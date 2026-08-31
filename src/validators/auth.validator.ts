import { z } from "zod";

export const signupSchema = z.object({
    email: z
        .string("Email is required")
        .email("Invalid email format"),
    password: z
        .string("Password is required")
        .min(6, "Password must be at least 6 characters long"),
    name: z
        .string()
        .min(1, "Name cannot be empty")
        .optional(),
});

export const loginSchema = z.object({
    email: z
        .string({ message: "Email is required" })
        .email({ message: "Invalid email format" }),
    password: z
        .string({ message: "Password is required" })
        .min(1, { message: "Password cannot be empty" }),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
