"use client";

import { redirect } from "next/navigation";
import SignUpForm from "@/components/sign-up-form";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
	// check if the user is loged in and redirect to the dashboard
	const { data: session } = authClient.useSession();
	if (session) {
		redirect("/dashboard");
	}
	return <SignUpForm />;
}
