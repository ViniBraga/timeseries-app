import express from 'express';
import { prisma } from '../prisma';
import { sendError, sendSuccess } from '../helper/responseHelper';

const SUCCESS_MESSAGE = 'File deleted successfully'
const ERROR_MESSAGE = 'Failed to delete file records'
const NO_RECORDS_MESSAGE = 'No records found for this file'

const router = express.Router();

router.delete('/:filename', async ({ params }, res) => {
  try {
    const deleted = await prisma.timeSeries.deleteMany({
      where: { source: params.filename },
    });

    if (deleted.count === 0) {
      return sendError(res, NO_RECORDS_MESSAGE, 404)
    }

    sendSuccess(res, { deletedCount: deleted.count }, SUCCESS_MESSAGE)
  } catch (error) {
    console.error(ERROR_MESSAGE, error);
    sendError(res, ERROR_MESSAGE)
  }
});

export default router;