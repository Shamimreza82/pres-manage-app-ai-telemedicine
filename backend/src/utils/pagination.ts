import { Request } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  search: string;
}

export const getPaginationParams = (query: Request['query']): PaginationParams => {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20));
  const skip = (page - 1) * limit;
  const search = (query.search as string) || '';
  return { page, limit, skip, search };
};
