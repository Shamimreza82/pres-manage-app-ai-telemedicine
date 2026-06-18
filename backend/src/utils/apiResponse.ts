import { Response } from 'express';

export const sendSuccess = (res: Response, data: unknown, status = 200) =>
  res.status(status).json({ success: true, data });

export const sendPaginated = (
  res: Response,
  data: unknown[],
  total: number,
  page: number,
  limit: number
) =>
  res.status(200).json({
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });

