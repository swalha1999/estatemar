"use client";

import { useFormState } from "react-dom";
import { signupAction } from "./actions";

const initialState = {
	message: "",
};

export function SignUpForm() {
	const [state, action] = useFormState(signupAction, initialState);

	return (
		<form action={action} className="space-y-4">
			<div>
				<label
					htmlFor="form-signup.username"
					className="mb-1 block font-medium text-sm"
				>
					Username
				</label>
				<input
					id="form-signup.username"
					name="username"
					required
					minLength={4}
					maxLength={31}
					className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>
			<div>
				<label
					htmlFor="form-signup.email"
					className="mb-1 block font-medium text-sm"
				>
					Email
				</label>
				<input
					type="email"
					id="form-signup.email"
					name="email"
					autoComplete="username"
					required
					className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>
			<div>
				<label
					htmlFor="form-signup.password"
					className="mb-1 block font-medium text-sm"
				>
					Password
				</label>
				<input
					type="password"
					id="form-signup.password"
					name="password"
					autoComplete="new-password"
					required
					className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>
			<button className="w-full rounded-md bg-primary py-2 text-primary-foreground transition-colors hover:bg-primary/90">
				Continue
			</button>
			{state.message && (
				<p className="mt-2 text-destructive text-sm">{state.message}</p>
			)}
		</form>
	);
}
