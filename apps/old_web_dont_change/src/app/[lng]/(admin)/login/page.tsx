import { LoginForm } from "./components";
import Link from "next/link";
import { getCurrentSession } from "@/utils/auth/session";
import { redirect } from "next/navigation";
import { globalGETRateLimit } from "@/utils/auth/request";
import { GoogleSignInButton } from "@/components/google/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import "./styles.css";

export default async function Page() {
    if (!globalGETRateLimit()) {
        return <p className="error">Too many requests</p>;
    }
    const { session, user } = await getCurrentSession();
    if (session !== null && user.google_id === null) {
        if (!user.email_verified) {
            return redirect("/verify-email");
        }
        if (!user.registered_2fa) {
            return redirect("/2fa/setup");
        }
        if (!session.two_factor_verified) {
            return redirect("/2fa");
        }
    }
    if (session !== null) {
        return redirect("/dashboard");
    }
    return (
        <div className="login-page">
            <div className="login-left">
                <div className="top-header">
                    <h2 className="login-title">Sign in to your account</h2>
                    <p>Welcome back! Please enter your details.</p>
                </div>
                <div className="login-form">
                    <LoginForm />
                    <div className="login-buttons">
                        <GoogleSignInButton />
                    </div>
                    <div className="login-links">
                        <Link href="/signup" className="login-link">
                            Create an account
                        </Link>
                        <Link href="/forgot-password" className="login-link">
                            Forgot your password?
                        </Link>
                    </div>
                    <Button className="login-button">Sign in with shadcn</Button>
                </div>
            </div>
            <div className="login-right">{/* Right side content can be added here */}</div>
        </div>
    );
}
