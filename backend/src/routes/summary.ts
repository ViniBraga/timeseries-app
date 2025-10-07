import express from 'express';
import { prisma } from '../prisma';
import { sendError, sendSuccess } from '../helper/responseHelper';

const ERROR_MESSAGE = 'Failed to generate summary'

const router = express.Router();

router.get('/', async (_, res) => {
  try {
    // Get all distinct sources
    const sources: { source: string }[] = await prisma.timeSeries.findMany({
      distinct: ['source'],
      select: { source: true },
    });

    // Build the summary list
    const summary = await Promise.all(
      sources.map(async ({ source }) => {
        const uniqueTimestamps = await prisma.timeSeries.findMany({
          where: { source },
          distinct: ['ts'],
          select: { ts: true },
        });

        return {
          name: source,
          total: uniqueTimestamps.length.toString(),
        };
      })
    );

    sendSuccess(res, summary)
  } catch (error) {
    console.error(ERROR_MESSAGE, error);
    sendError(res, ERROR_MESSAGE)
  }
});

export default router;