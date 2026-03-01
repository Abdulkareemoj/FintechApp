import { z } from "zod";

const MIN_PASSWORD_LENGTH = 8;
const MIN_NAME_LENGTH = 2;

export const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(MIN_NAME_LENGTH, {
        message: `Name must be at least ${MIN_NAME_LENGTH} characters.`,
      }),
    lastName: z
      .string()
      .min(MIN_NAME_LENGTH, {
        message: `Name must be at least ${MIN_NAME_LENGTH} characters.`,
      }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
      )
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;
