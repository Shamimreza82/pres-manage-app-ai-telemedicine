import { Request } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  search: string;
}

export interface PaginationParamsExtended extends PaginationParams {
  status?: string;
  planId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const getPaginationParams = (query: Request['query']): PaginationParamsExtended => {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20));
  const skip = (page - 1) * limit;
  const search = (query.search as string) || '';
  const status = (query.status as string) || '';
  const planId = (query.planId as string) || '';
  const dateFrom = (query.dateFrom as string) || '';
  const dateTo = (query.dateTo as string) || '';
  return { page, limit, skip, search, status, planId, dateFrom, dateTo };
};
