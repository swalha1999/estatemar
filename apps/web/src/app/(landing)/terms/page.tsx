import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Terms of Service - Estatemar",
	description: "Terms of Service for Estatemar real estate platform",
};

export default function TermsPage() {
	return (
		<div className="container mx-auto max-w-4xl px-6 py-12">
			<h1 className="mb-8 text-3xl font-bold">Terms of Service</h1>
			<div className="prose prose-gray max-w-none dark:prose-invert">
				<p className="text-lg text-muted-foreground">
					<strong>Effective Date:</strong> January 1, 2025
				</p>

				<h2 className="mt-8 text-2xl font-semibold">1. Acceptance of Terms</h2>
				<p>
					Welcome to ESTATEMAR. These Terms of Service (&quot;Terms&quot;) govern your use of the ESTATEMAR mobile application and website (collectively, the &quot;Service&quot;) operated by ESTATEMAR (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
				</p>
				<p>
					By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
				</p>

				<h2 className="mt-8 text-2xl font-semibold">2. Description of Service</h2>
				<p>
					ESTATEMAR is a real estate platform designed to assist users in property management, investment analysis, and real estate transactions. The Service includes:
				</p>
				<ul className="list-disc pl-6">
					<li>Property listings and market data</li>
					<li>Investment analysis and ROI projections</li>
					<li>Legal support and transaction guidance</li>
					<li>Virtual 3D property tours</li>
					<li>Property management dashboard</li>
					<li>Financing options and project exploration</li>
				</ul>

				<h2 className="mt-8 text-2xl font-semibold">3. User Accounts</h2>
				<p>
					When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
				</p>

				<h2 className="mt-8 text-2xl font-semibold">4. Acceptable Use</h2>
				<p>You agree not to use the Service to:</p>
				<ul className="list-disc pl-6">
					<li>Violate any applicable laws or regulations</li>
					<li>Infringe upon the rights of others</li>
					<li>Transmit harmful or malicious content</li>
					<li>Attempt to gain unauthorized access to our systems</li>
					<li>Use the Service for any commercial purpose without authorization</li>
				</ul>

				<h2 className="mt-8 text-2xl font-semibold">5. Intellectual Property</h2>
				<p>
					The Service and its original content, features, and functionality are and will remain the exclusive property of ESTATEMAR and its licensors. The Service is protected by copyright, trademark, and other laws.
				</p>

				<h2 className="mt-8 text-2xl font-semibold">6. Privacy Policy</h2>
				<p>
					Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
				</p>

				<h2 className="mt-8 text-2xl font-semibold">7. Disclaimers</h2>
				<p>
					The information provided through our Service is for informational purposes only and should not be considered as financial, legal, or investment advice. We recommend consulting with qualified professionals before making any real estate decisions.
				</p>

				<h2 className="mt-8 text-2xl font-semibold">8. Limitation of Liability</h2>
				<p>
					In no event shall ESTATEMAR, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
				</p>

				<h2 className="mt-8 text-2xl font-semibold">9. Indemnification</h2>
				<p>
					You agree to defend, indemnify, and hold harmless ESTATEMAR and its licensors and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees arising out of or relating to your violation of these Terms or your use of the Service.
				</p>

				<h2 className="mt-8 text-2xl font-semibold">10. Termination</h2>
				<p>
					We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
				</p>

				<h2 className="mt-8 text-2xl font-semibold">11. Governing Law</h2>
				<p>
					These Terms shall be interpreted and governed by the laws of the jurisdiction in which ESTATEMAR operates, without regard to its conflict of law provisions.
				</p>

				<h2 className="mt-8 text-2xl font-semibold">12. Changes to Terms</h2>
				<p>
					We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
				</p>

				<h2 className="mt-8 text-2xl font-semibold">13. Contact Information</h2>
				<p>
					If you have any questions about these Terms of Service, please contact us at:
				</p>
				<p>
					<strong>Email:</strong>{" "}
					<a href="mailto:info@ESTATEMAR.com" className="text-blue-600 hover:underline">info@ESTATEMAR.com</a>
				</p>
			</div>
		</div>
	);
}
