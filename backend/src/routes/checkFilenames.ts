import express from 'express';
import { prisma } from '../prisma';
import { sendError, sendSuccess } from '../helper/responseHelper';

const router = express.Router();

const ERROR_MESSAGE = 'Error checking filenames'

router.post('/', async (req, res) => {
  const { filenames } = req.body as { filenames: string[] };

  try {
    const existingSources: { source: string }[] = await prisma.timeSeries.findMany({
      where: {
        source: { in: filenames },
      },
      distinct: ['source'],
      select: { source: true },
    });

    const existing = existingSources.map((entry) => entry.source);
    sendSuccess(res, { existing })

  } catch (error) {
    console.error(ERROR_MESSAGE, error);
    sendError(res, ERROR_MESSAGE)
  }
});

export default router;