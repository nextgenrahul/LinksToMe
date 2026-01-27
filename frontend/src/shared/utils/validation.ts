import { z } from "zod";

export const validateSchema = <T>(schema: z.ZodSchema, data: unknown) => {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} as Record<keyof T | string, string> };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const formattedErrors: Record<string, string> = {};
      
      err.issues.forEach((e) => {
        const fieldName = e.path[0] as string;
        
        const key = fieldName === 'name' ? 'fullName' : fieldName;
        
        if (!formattedErrors[key]) {
          formattedErrors[key] = e.message;
        }
      });

      return { isValid: false, errors: formattedErrors };
    }
    return { isValid: false, errors: { _global: "An unexpected error occurred" } };
  }
};