import express from 'express';
import { prisma } from '../prisma';
import { sendError, sendSuccess } from '../helper/responseHelper';

const router = express.Router();

router.get('/:uploadId', async (req, res) => {
  try {
    const { uploadId } = req.params;
    
    const status = await prisma.uploadStatus.findUnique({
      where: { id: uploadId },
    });

    if (!status) {
      return sendError(res, 'Upload not found', 404);
    }

    sendSuccess(res, status.status);
  } catch (error) {
    console.error('Failed to fetch upload status:', error);
    sendError(res, 'Failed to fetch status');
  }
});

router.get('/', async (_, res) => {
  try {
    const statuses = await prisma.uploadStatus.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    sendSuccess(res, statuses);
  } catch (error) {
    console.error('Failed to fetch upload statuses:', error);
    sendError(res, 'Failed to fetch statuses');
  }
});

export default router;