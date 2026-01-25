import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .refine((val) => /[a-z]/.test(val), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((val) => /[0-9]/.test(val), {
    message: "Password must contain at least one number",
  })
  .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
    message: "Password must contain at least one special character",
  })
  .refine((val) => !/\s/.test(val), {
    message: "Password must not contain spaces",
  });


export const BirthdaySchema = z.object({
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
});

// Signup Payload Schema
export const SignupPayloadSchema = z.object({
  email: z.string().min(10).max(200).email("A valid email is required"),
  password: passwordSchema,
  name: z.string().min(2, "Name is too short").max(100),
  username: z.string()
    .min(3, "Username must be 3+ chars")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Only alphanumeric and underscores allowed"),
  birthday: BirthdaySchema,
});

// Sign In Payload

export const SigninPayloadSchema = z.object({
  email: z.string().email("A valid email is required"),
  password: passwordSchema
});


// Infer Types for use in Frontend and Backend
export type Birthday = z.infer<typeof BirthdaySchema>;
export type SignupPayload = z.infer<typeof SignupPayloadSchema>;
export type SigninPayload = z.infer<typeof SigninPayloadSchema>;