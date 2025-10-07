import type { Response } from "express";

export const sendSuccess = <T>(res: Response, data: T, message = ''): Response =>
  res.status(200).json({
    success: true,
    data,
    message,
  });

export const sendError = (res: Response, error = 'Something went wrong', status = 500): Response =>
  res.status(status).json({
    success: false,
    error,
  });