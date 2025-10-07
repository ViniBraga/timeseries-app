import { Worker } from 'bullmq';
import fs from 'fs';
import { prisma } from '../prisma';
import { parseCsvFile } from '../helper/parseCsv';
import { getConnection } from '../queue/config';
import type { FileUploadJob } from '../queue/types';
import { UploadStatusEnum } from '@prisma/client';

const startWorker = async () => {
  const connection = getConnection();
  await connection.connect();
  
  console.log('Worker connected to Redis');

  const worker = new Worker<FileUploadJob>(
    'file-upload',
    async (job) => {
      const { uploadId, filename, filepath } = job.data;

      try {
        await prisma.uploadStatus.update({
          where: { id: uploadId },
          data: { status: UploadStatusEnum.processing },
        });

        job.updateProgress(10);

        const rows = await parseCsvFile(filepath);
        job.updateProgress(30);

        const records = rows.flatMap((row) => {
          const ts = new Date(row.ts);
          return Object.entries(row)
            .filter(([key]) => key !== 'ts')
            .map(([measure, value]) => ({
              ts,
              source: filename,
              measure,
              float_value: parseFloat(value as string),
            }));
        });

        job.updateProgress(50);

        const batchSize = 1000;
        for (let i = 0; i < records.length; i += batchSize) {
          const batch = records.slice(i, i + batchSize);
          await prisma.timeSeries.createMany({ data: batch });
          const progress = 50 + ((i / records.length) * 40);
          job.updateProgress(Math.round(progress));
        }

        job.updateProgress(90);

        fs.unlinkSync(filepath);

        await prisma.uploadStatus.update({
          where: { id: uploadId },
          data: { status: UploadStatusEnum.completed },
        });

        job.updateProgress(100);

        return { success: true, recordCount: records.length };
      } catch (error) {
        console.error('Job failed:', error);

        await prisma.uploadStatus.update({
          where: { id: uploadId },
          data: { status: UploadStatusEnum.failed },
        });

        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }

        throw error;
      }
    },
    {
      connection,
      concurrency: 5,
      limiter: {
        max: 10,
        duration: 1000,
      },
    }
  );

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
  });

  console.log('Worker started and waiting for jobs...');
};

startWorker().catch(console.error);