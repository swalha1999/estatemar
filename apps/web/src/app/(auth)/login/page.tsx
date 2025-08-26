"use client";

import { redirect } from "next/navigation";
import SignInForm from "@/components/sign-in-form";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
	// check if the user is loged in and redirect to the dashboard
	const { data: session } = authClient.useSession();
	if (session) {
		redirect("/dashboard");
	}
	return <SignInForm />;
}
