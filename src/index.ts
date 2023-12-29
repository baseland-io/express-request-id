import { NextFunction, Request, Response } from 'express-serve-static-core';
import { v4 as uuidv4 } from 'uuid';
import type { Options } from './types';

const generateV4UUID = (_request: Request) => uuidv4();

const ATTRIBUTE_NAME = 'id';
const HEADER_NAME = 'X-Request-Id';

/**
 * Middleware for generating and setting a unique identifier for each incoming request.
 *
 * @param options - Configuration options for the middleware.
 *
 * @returns Express middleware function.
 */
const expressRequestId = (options: Options = { }): any => {
  return (request: Request, response: Response, next: NextFunction): any => {
    const { generator = generateV4UUID, headerName = HEADER_NAME, setHeader = true } = options;
    // Retrieve existing identifier from the request header
    const existingId: string | undefined = request.get(headerName);
    // Generate a new identifier or use the existing one
    const id: string = existingId === undefined ? generator(request) : existingId;

    // Set the identifier in the response header if required
    if (setHeader) {
      response.set(headerName, id);
    }

    request[ATTRIBUTE_NAME] = id;

    next();
  };
};

export default expressRequestId;
