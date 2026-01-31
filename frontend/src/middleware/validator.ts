import { z } from "zod";

/**
 * Frontend Validation Result Interface
 */
export interface ValidationResult<T> {
  isValid: boolean;
  errors: Partial<Record<keyof T | string, string>>;
}

/**
 * A reusable utility to validate any Zod schema on the frontend.
 * It maps complex Zod issues into a flat object for easy UI rendering.
 */
export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> => {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors: Record<string, string> = {};

      error.issues.forEach((issue) => {
        // We join path segments for nested objects (e.g., 'dob.day')
        const path = issue.path.join(".");
        
        // We only store the first error message per field for cleaner UI
        if (!formattedErrors[path]) {
          formattedErrors[path] = issue.message;
        }
      });

      return { isValid: false, errors: formattedErrors as Partial<Record<keyof T | string, string>> };
    }
    
    return { isValid: false, errors: { _global: "An unexpected validation error occurred." } as Partial<Record<keyof T | string, string>> };
  }
};