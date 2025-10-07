import express from 'express';
import multer from 'multer';
import { prisma }  from '../prisma';
import { sendError, sendSuccess } from '../helper/responseHelper';
import { UploadStatusEnum } from '@prisma/client';
import { getFileUploadQueue } from '../queue/config';

const SUCCESS_MESSAGE = 'Files uploaded and queued for processing'
const ERROR_MESSAGE = 'Upload failed'

const router = express.Router()

// Shortcut: Using local disk storage for uploaded files instead of S3.
// In a production environment, this should be replaced with cloud storage (S3)
// for durability, scalability, and availability across deployments.
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.array('files'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const uploadIds: string[] = [];
    const fileUploadQueue = await getFileUploadQueue();


    for (const file of files) {
      const uploadStatus = await prisma.uploadStatus.create({
        data: {
          filename: file.originalname,
          status: UploadStatusEnum.pending,
        },
      });

      await fileUploadQueue.add('process-file', {
        uploadId: uploadStatus.id,
        filename: file.originalname,
        filepath: file.path,
      });

      uploadIds.push(uploadStatus.id);
    }

    sendSuccess(res, { uploadIds }, SUCCESS_MESSAGE)
  } catch (error) {
    console.error(ERROR_MESSAGE, error);
    sendError(res, ERROR_MESSAGE)
  }
});

export default router