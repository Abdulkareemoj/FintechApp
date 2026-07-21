import { z } from "zod";

// Constants for schema validation
const MIN_PASSWORD_LENGTH = 8;
const MIN_USERNAME_LENGTH = 5;
const MAX_USERNAME_LENGTH = 25;
const MIN_NAME_LENGTH = 2;

//signup
export const signUpSchema = z
	.object({
		firstName: z.string().min(MIN_NAME_LENGTH, {
			message: `Name must be at least ${MIN_NAME_LENGTH} characters.`,
		}),
		lastName: z.string().min(MIN_NAME_LENGTH, {
			message: `Name must be at least ${MIN_NAME_LENGTH} characters.`,
		}),
		username: z
			.string()
			.min(MIN_USERNAME_LENGTH, {
				message: `Username must be at least ${MIN_USERNAME_LENGTH} characters.`,
			})
			.max(MAX_USERNAME_LENGTH, {
				message: `Username cannot exceed ${MAX_USERNAME_LENGTH} characters.`,
			})
			.regex(/^[a-zA-Z0-9_-]+$/, {
				message: "Only letters, numbers, dashes, and underscores are allowed.",
			}),
		email: z.string().email({ message: "Please enter a valid email address." }),
		password: z
			.string()
			.min(
				MIN_PASSWORD_LENGTH,
				`Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
			)
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[0-9]/, "Password must contain at least one number"),
		confirmPassword: z.string(),
		image: z.string().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

//signin
export const signInSchema = z.object({
	identifier: z.string({
		message: "Email or username is required.",
	}),
	password: z.string().min(1, {
		message: "Password is required.",
	}),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

//forgot-password
export const forgotPasswordSchema = z.object({
	email: z.email({
		message: "Please enter a valid email address.",
	}),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

//reset-password
export const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(
				MIN_PASSWORD_LENGTH,
				`Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
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

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
