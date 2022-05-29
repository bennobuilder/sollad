import { NextFunction, Request, Response } from 'express';
import SlError, { AdditionalInfoType } from './SlError';
import { HttpError } from 'http-errors';

export async function errorMiddleware(
  err: HttpError | TypeError | SlError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let customError;

  if (err instanceof SlError) {
    customError = err;
  } else if (err instanceof TypeError) {
    customError = new SlError('Internal server error!', 500);
  } else if (err instanceof HttpError) {
    customError = new SlError(err.message, err.status);
  } else {
    customError = new SlError('Internal server error!', 500, { log: err });
  }

  // Not using the next function to prevent triggering the default error-handler
  res.status(customError.status);
  res.json({ error: customError });
}

export function createError(
  message: string,
  status = 500,
  additionalInfo: AdditionalInfoType = null,
): SlError {
  return new SlError(message, status, additionalInfo);
}

export { SlError };
