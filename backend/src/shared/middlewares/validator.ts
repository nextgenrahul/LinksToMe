import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export class SchemaValidator {
  static validate<T>(schema: z.ZodType<T>) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const parsed = await schema.parseAsync(req.body);
        req.body = parsed;
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            status: "validation_error",
            errors: error.issues.map(issue => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          });
        }

        next(error);
      }
    };
  }
}
