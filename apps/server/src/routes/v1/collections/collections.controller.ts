import { NextFunction, Request, Response } from 'express';
import { getCollectionBySymbol } from '../../../services/collections';
import { createError } from '../../../middleware/error';

export async function getCollectionController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { symbol } = req.params;

    // Retrieve user from the database
    const collection = getCollectionBySymbol(symbol);
    if (collection == null) throw createError('Collection not found', 404);

    res.send({
      collection,
    });
  } catch (e) {
    next(e); // Pass error to the error middleware as the error is unknown
  }
}
