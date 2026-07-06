import { z } from "zod"

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
})

export type LoginInput = z.infer<typeof LoginSchema>

export const RegisterSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(3, "First name must be at least 3 characters long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(3, "Last name must be at least 3 characters long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .refine((val) => /[A-Z]/.test(val), "Password must contain at least one uppercase letter")
    .refine((val) => /[0-9]/.test(val), "Password must contain at least one number"),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
