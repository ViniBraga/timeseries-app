import express from 'express'
import type { Request, Response } from 'express'

const router = express.Router();

router.get('/', function(_req: Request, res: Response) {
  res.send('pong');
});

export default router
