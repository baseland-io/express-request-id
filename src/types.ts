import type { Request, RequestHandler } from 'express';

export { };

/**
 * Options for configuring express request id.
 */
export type Options = {
  /**
   * Determines whether to set a the response header.
   * @default true
   */
  setHeader?: boolean | undefined;
  /**
   * The name of the header.
   * @default 'X-Request-Id`
   */
  headerName?: string | undefined;
  /**
   * A function that generates a string to be used as a unique id for each request.
   * @default (req) => uuidv4()
   */
  generator?: ((request: Request) => string) | undefined;
}

declare module 'express-serve-static-core' {
    export interface Request {
      id: string;
    }
}

declare function expressRequestId(options?: Options): RequestHandler;

export default expressRequestId;

