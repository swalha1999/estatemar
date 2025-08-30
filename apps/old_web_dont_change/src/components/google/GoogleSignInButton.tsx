import Link from "next/link";
import { GoogleIcon } from "./GoogleIcon";

export function GoogleSignInButton() {
    return (
        //dont prefetch this link
        <Link
            href="/login/google"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:opacity-80"
        >
            <GoogleIcon />
            Sign in with Google
        </Link>
    );
}
