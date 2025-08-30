"use client";

import { signupAction } from "./actions";
import { useFormState } from "react-dom";

const initialState = {
    message: "",
};

export function SignUpForm() {
    const [state, action] = useFormState(signupAction, initialState);

    return (
        <form action={action} className="space-y-4">
            <div>
                <label htmlFor="form-signup.username" className="block text-sm font-medium mb-1">
                    Username
                </label>
                <input
                    id="form-signup.username"
                    name="username"
                    required
                    minLength={4}
                    maxLength={31}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <div>
                <label htmlFor="form-signup.email" className="block text-sm font-medium mb-1">
                    Email
                </label>
                <input
                    type="email"
                    id="form-signup.email"
                    name="email"
                    autoComplete="username"
                    required
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <div>
                <label htmlFor="form-signup.password" className="block text-sm font-medium mb-1">
                    Password
                </label>
                <input
                    type="password"
                    id="form-signup.password"
                    name="password"
                    autoComplete="new-password"
                    required
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors">
                Continue
            </button>
            {state.message && <p className="text-destructive text-sm mt-2">{state.message}</p>}
        </form>
    );
}
