export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const notFound = (msg = 'Resource not found') => new AppError(msg, 404);
export const badRequest = (msg: string) => new AppError(msg, 400);
export const unauthorized = (msg = 'Unauthorized') => new AppError(msg, 401);
export const forbidden = (msg = 'Forbidden') => new AppError(msg, 403);
export const conflict = (msg: string) => new AppError(msg, 409);
