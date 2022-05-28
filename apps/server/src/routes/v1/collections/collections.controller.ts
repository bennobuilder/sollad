import { NextFunction, Request } from 'express';

export async function getCollectionController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // TODO
  } catch (e) {
    next(e); // Pass error to error middleware
  }
}
