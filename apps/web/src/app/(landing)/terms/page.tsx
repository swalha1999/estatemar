import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto max-w-4xl px-6 py-8">
					<div>
						<Link
							href="/"
							className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors mb-6"
						>
							<ArrowLeft className="size-4" />
							Back to Home
						</Link>
						<h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
						<p className="text-foreground/70">Last updated: March 20, 2025</p>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="container mx-auto max-w-4xl px-6 py-12">
				<div className="prose prose-lg dark:prose-invert max-w-none">
					<div className="space-y-8">
						<section>
							<h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
							<p className="text-foreground/80 mb-4">
								Welcome to SALATI. These Terms of Service (&quot;Terms&quot;) govern your use of the SALATI mobile application and website (collectively, the &quot;Service&quot;) operated by SALATI (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
							</p>
							<p className="text-foreground/80 mb-4">
								By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
							<p className="text-foreground/80 mb-4">
								By downloading, installing, or using the SALATI application, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Description of Service</h2>
							<p className="text-foreground/80 mb-4">
								SALATI is a mobile application designed to assist users in their Islamic prayer practices. The Service includes:
							</p>
							<ul className="list-disc pl-6 space-y-2 text-foreground/80">
								<li>Prayer time notifications and reminders</li>
								<li>Qibla direction indicator</li>
								<li>Qur&apos;anic recitation and guidance</li>
								<li>Athkar (remembrance) and supplications</li>
								<li>Islamic calendar and events</li>
								<li>Community features and sharing</li>
							</ul>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
							<p className="text-foreground/80 mb-4">
								When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
							</p>
							<p className="text-foreground/80 mb-4">
								You agree not to disclose your password to any third party and to take sole responsibility for any activities or actions under your account, whether or not you have authorized such activities or actions.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Acceptable Use</h2>
							<p className="text-foreground/80 mb-4">You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
							<ul className="list-disc pl-6 space-y-2 text-foreground/80">
								<li>Use the Service in any way that violates any applicable federal, state, local, or international law or regulation</li>
								<li>Transmit, or procure the sending of, any advertising or promotional material, including any &quot;junk mail,&quot; &quot;chain letter,&quot; &quot;spam,&quot; or any other similar solicitation</li>
								<li>Impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
								<li>Engage in any other conduct that restricts or inhibits anyone&apos;s use or enjoyment of the Service</li>
								<li>Use the Service to transmit any material that is defamatory, offensive, or otherwise objectionable</li>
								<li>Attempt to gain unauthorized access to any portion of the Service or any systems or networks connected to the Service</li>
							</ul>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Intellectual Property Rights</h2>
							<p className="text-foreground/80 mb-4">
								The Service and its original content, features, and functionality are and will remain the exclusive property of SALATI and its licensors. The Service is protected by copyright, trademark, and other laws.
							</p>
							<p className="text-foreground/80 mb-4">
								Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">User Content</h2>
							<p className="text-foreground/80 mb-4">
								Our Service may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material (&quot;Content&quot;). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
							</p>
							<p className="text-foreground/80 mb-4">
								By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit, post, or display on or through the Service and you are responsible for protecting those rights.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
							<p className="text-foreground/80 mb-4">
								Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Disclaimers</h2>
							<p className="text-foreground/80 mb-4">
								The information on this Service is provided on an &quot;as is&quot; basis. To the fullest extent permitted by law, this Company:
							</p>
							<ul className="list-disc pl-6 space-y-2 text-foreground/80">
								<li>Excludes all representations, warranties, conditions, and terms whether express or implied</li>
								<li>Excludes all liability for damages arising out of or in connection with your use of this Service</li>
								<li>Does not guarantee the accuracy, completeness, or usefulness of any information on the Service</li>
								<li>Does not warrant that the Service will be uninterrupted or error-free</li>
							</ul>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
							<p className="text-foreground/80 mb-4">
								In no event shall SALATI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
							</p>
							<ul className="list-disc pl-6 space-y-2 text-foreground/80">
								<li>Your use or inability to use the Service</li>
								<li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
								<li>Any interruption or cessation of transmission to or from the Service</li>
								<li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through the Service</li>
								<li>Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, transmitted, or otherwise made available via the Service</li>
							</ul>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
							<p className="text-foreground/80 mb-4">
								You agree to defend, indemnify, and hold harmless SALATI and its licensors and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees arising out of or relating to your violation of these Terms or your use of the Service.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Termination</h2>
							<p className="text-foreground/80 mb-4">
								We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
							</p>
							<p className="text-foreground/80 mb-4">
								If you wish to terminate your account, you may simply discontinue using the Service.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
							<p className="text-foreground/80 mb-4">
								These Terms shall be interpreted and governed by the laws of the United Arab Emirates, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
							<p className="text-foreground/80 mb-4">
								We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
							</p>
							<p className="text-foreground/80 mb-4">
								What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
							<p className="text-foreground/80 mb-4">
								If you have any questions about these Terms of Service, please contact us:
							</p>
							<p className="text-foreground/80">
								<a href="mailto:info@SALATI.app" className="text-blue-600 hover:underline">info@SALATI.app</a>
							</p>
						</section>
					</div>
				</div>
			</div>
		</div>
	)
}
