import { z } from 'zod';

export const BirthdaySchema = z.object({
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
});

// Signup Payload Schema
export const SignupPayloadSchema = z.object({
  email: z.string().email("A valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name is too short").max(100),
  username: z.string()
    .min(3, "Username must be 3+ chars")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Only alphanumeric and underscores allowed"),
  birthday: BirthdaySchema,
});

// Infer Types for use in Frontend and Backend
export type SignupPayload = z.infer<typeof SignupPayloadSchema>;
export type Birthday = z.infer<typeof BirthdaySchema>;