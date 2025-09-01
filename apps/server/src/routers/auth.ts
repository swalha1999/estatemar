import { publicProcedure, protectedProcedure } from "../lib/orpc";
import { createPersonalOrganization, auth } from "../lib/auth";
import { z } from "zod";

const signUpSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email({ message: "Please enter a valid email address" }),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const authRouter = {
	privateData: protectedProcedure.handler(({ context }) => {
		return {
			message: "This is private",
			user: context.session?.user,
		};
	}),

	signUpWithOrganization: publicProcedure
		.input(signUpSchema)
		.handler(async ({ input }) => {
			try {
				// First create the user using Better Auth
				const signUpResult = await auth.api.signUpEmail({
					body: {
						email: input.email,
						password: input.password,
						name: input.name,
					},
				});

				// If signup was successful, create personal organization
				if (signUpResult && signUpResult.user) {
					await createPersonalOrganization(
						signUpResult.user.id,
						signUpResult.user.name,
						signUpResult.user.email,
					);
				}

				return {
					success: true,
					user: signUpResult?.user,
					token: signUpResult?.token,
				};
			} catch (error) {
				console.error("Signup error:", error);
				throw new Error("Failed to create account");
			}
		}),

	ensurePersonalOrganization: protectedProcedure.handler(
		async ({ context }) => {
			const user = context.session.user;
			if (user.id && user.email) {
				await createPersonalOrganization(user.id, user.name, user.email);
			}
			return { success: true };
		},
	),
};
