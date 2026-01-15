import { z } from "zod";
export const birthdaySchema = z.object({
    year: z.number().int().min(1900).max(new Date().getFullYear()),
    month: z.number().int().min(1).max(12),
    day: z.number().int().min(1).max(31),
});

export const signupSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format")
            .regex(/[A-Z]/, "Must contain one uppercase letter")
            .regex(/[0-9]/, "Must contain one number"),
        name: z.string().min(2).max(100),
        username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric and underscores"),
    }),

});

export type RegisterInput = z.infer<typeof signupSchema>['body'];