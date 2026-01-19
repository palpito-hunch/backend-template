import { type Request, type Response, type NextFunction } from 'express';
import { type ZodSchema, type z } from 'zod';

interface ValidateOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validate(schemas: ValidateOptions) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body) as z.infer<typeof schemas.body>;
    }

    if (schemas.query) {
      req.query = schemas.query.parse(req.query) as z.infer<
        typeof schemas.query
      >;
    }

    if (schemas.params) {
      req.params = schemas.params.parse(req.params) as z.infer<
        typeof schemas.params
      >;
    }

    next();
  };
}
