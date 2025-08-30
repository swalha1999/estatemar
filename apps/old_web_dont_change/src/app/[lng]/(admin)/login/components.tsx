"use client";

// @ts-ignore TODO: remove this
import { useActionState } from "react";

import { loginAction } from "./actions";

const initialState = {
    message: "",
};

export function LoginForm() {
    const [state, action] = useActionState(loginAction, initialState);

    return (
        <form action={action} className="login-form-wrapper">
            <div className="input-group">
                <div className="input-container">
                    <label htmlFor="form-login.email" className="sr-only">
                        Email
                    </label>
                    <input
                        type="email"
                        id="form-login.email"
                        name="email"
                        autoComplete="username"
                        required
                        className="input-field"
                        placeholder="Email address"
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="form-login.password" className="sr-only">
                        Password
                    </label>
                    <input
                        type="password"
                        id="form-login.password"
                        name="password"
                        autoComplete="current-password"
                        required
                        className="input-field"
                        placeholder="Password"
                    />
                </div>
            </div>

            <div className="button-container">
                <button type="submit" className="login-button">
                    Sign in
                </button>
            </div>
            {state.message && <p className="error">{state.message}</p>}
        </form>
    );
}
