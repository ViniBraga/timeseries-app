import express from 'express';
import { prisma } from '../prisma';
import { Parser } from 'json2csv';
import { sendError } from '../helper/responseHelper';

const ERROR_MESSAGE = 'Failed to reconstruct file'

const router = express.Router();

router.get('/:filename', async (req, res) => {
  const { filename } = req.params;

  try {
    const records = await prisma.timeSeries.findMany({
      where: { source: filename },
      orderBy: { ts: 'asc' },
    });

    if (records.length === 0) {
      return sendError(res, 'File not found', 404)
    }

    // Group by timestamp
    const grouped: Record<string, Record<string, string>> = {};

    for (const record of records) {
      const ts = record.ts.toISOString().replace('T', ' ').slice(0, 19);
      if (!grouped[ts]) grouped[ts] = {};
      grouped[ts][record.measure] = record.float_value.toString();
    }

    // Rebuild rows
    const rows = Object.entries(grouped).map(([ts, measures]) => ({
      ts,
      ...measures,
    }));

    // Generate CSV
    const parser = new Parser({
      quote: '',
      header: true,
    });
    const csv = parser.parse(rows);

    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    res.send(csv);
  } catch (error) {
    console.error(ERROR_MESSAGE, error);
    sendError(res, ERROR_MESSAGE)
  }
});

export default router;