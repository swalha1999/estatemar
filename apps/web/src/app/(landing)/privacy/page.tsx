import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
						<h1 className="text-4xl font-bold mb-2">Privacy and Data Protection Policy</h1>
						<p className="text-foreground/70">Last updated: March 20, 2022</p>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="container mx-auto max-w-4xl px-6 py-12">
				<div className="prose prose-lg dark:prose-invert max-w-none">
					<div className="space-y-8">
						<section>
							<h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
							<p className="text-foreground/80 mb-4">
								SALATI (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;) operates the SALATI mobile application (the &quot;Service&quot;); SALATI respects your privacy and is committed to protect the personal information that you share with us, if any.
							</p>
							<p className="text-foreground/80 mb-4">
								Generally, you can browse through our website and use SALATI mobile application without giving us any information about yourself (except for cookies and pixel tags). When we do need your personal information to provide services that you request or when you choose to provide us with your personal information, for example when you decide to contact us for additional information or subscribe to our Service, this policy describes how we collect and use your personal information.
							</p>
							<p className="text-foreground/80 mb-4">
								We will not use or share your information with anyone except as described in this Privacy Policy.
							</p>
							<p className="text-foreground/80 mb-4">
								We use your Personal Information for providing and improving the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Information Collection And Use</h2>
							<p className="text-foreground/80 mb-4">
								While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to, your email address, first and last name, phone number, home, postal or other physical address, other contact information, title, birth date, gender, occupation, industry, personal interests, and other information when needed to provide a product or service you requested (&quot;Personal Information&quot;).
							</p>
							<p className="text-foreground/80 mb-4">
								We collect and store personal information when you submit inquiries or requests with respect to our Service. We will use such information to contact you only for the purposes for which you sent the inquiry or to send you promotional materials.
							</p>
							<p className="text-foreground/80 mb-4">
								We also collect and store personal information if you contact us or subscribe to our Service, for the purpose of sending you information on promotional or informational materials, direct mailing and targeted advertising on products that we believe you may be interested in. We do so only if you have given your explicit, free and informed consent for such purposes. In line with the GDPR we will always give you the opportunity to opt in to our mailing list and without your consent we will not add you to our mailing list to receive direct marketing or market research information.
							</p>
							<p className="text-foreground/80 mb-4">
								We may also use your personal information, such as web server logs, IP addresses, cookies, pixel tags and web beacons, when you send us inquiries regarding our website or Service or when you browse the website, in order to administrate and improve this website or our Service, for our internal records and for statistical analysis.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Log Data</h2>
							<p className="text-foreground/80 mb-4">
								When you access the Service by or through a mobile device, we may collect certain information automatically, including, but not limited to, the type of mobile device you use, your mobile device unique ID, the IP address of your mobile device, your mobile operating system, the type of mobile Internet browser you use and other statistics (&quot;Log Data&quot;).
							</p>
							<p className="text-foreground/80 mb-4">
								In addition, we may use third party services such as Google Analytics that collect, monitor and analyze this type of information in order to increase our Service&apos;s functionality. These third party service providers have their own privacy policies addressing how they use such information.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Location information</h2>
							<p className="text-foreground/80 mb-4">
								We may use and store information about your location, if you give us permission to do so. We use this information to provide features of our Service, to improve and customize our Service. You can enable or disable location services when you use our Service at any time, through your mobile device settings.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Legal Basis for Processing</h2>
							<p className="text-foreground/80 mb-4">Our collection and processing of personal information is based on the following:</p>
							<ul className="list-disc pl-6 space-y-2 text-foreground/80">
								<li>The need to carry out the above processing of information, which is in anticipation of entering into commercial engagements or as part of the performance of existing engagements with you.</li>
								<li>To the extent that we use the personal information for advertising or promotional activities, including direct mailing and targeted advertising, we will request your specific, freely-given, unbundled, informed and separate consent to such uses.</li>
								<li>To the extent that we use the personal information to improve the Service or for analyzing statistics, the basis for collection of data is our legitimate interest to conduct such improvements and analysis.</li>
							</ul>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Cookies</h2>
							<p className="text-foreground/80 mb-4">
								Cookies pixels and web beacons (&quot;Cookies&quot;) are files with a small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer&apos;s hard drive.
							</p>
							<p className="text-foreground/80 mb-4">
								We use &quot;cookies&quot; to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Behavioral Remarketing</h2>
							<p className="text-foreground/80 mb-4">
								SALATI uses remarketing services to advertise on third party websites to you after you visited our Service. We, and our third party vendors, use cookies to inform, optimize and serve ads based on your past visits to our Service.
							</p>
							<h3 className="text-xl font-semibold mb-3">Google</h3>
							<p className="text-foreground/80 mb-4">
								Google AdWords remarketing service is provided by Google Inc.
							</p>
							<p className="text-foreground/80 mb-4">
								You can opt-out of Google Analytics for Display Advertising and customize the Google Display Network ads by visiting the Google Ads Settings page: <a href="http://www.google.com/settings/ads" className="text-blue-600 hover:underline">http://www.google.com/settings/ads</a>
							</p>
							<p className="text-foreground/80 mb-4">
								Google also recommends installing the Google Analytics Opt-out Browser Add-on – <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline">https://tools.google.com/dlpage/gaoptout</a> – for your web browser. Google Analytics Opt-out Browser Add-on provides visitors with the ability to prevent their data from being collected and used by Google Analytics.
							</p>
							<p className="text-foreground/80 mb-4">
								For more information on the privacy practices of Google, please visit the Google Privacy Terms web page: <a href="http://www.google.com/intl/en/policies/privacy/" className="text-blue-600 hover:underline">http://www.google.com/intl/en/policies/privacy/</a>
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Service Providers</h2>
							<p className="text-foreground/80 mb-4">
								We may employ third party companies and individuals to facilitate our Service, to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.
							</p>
							<p className="text-foreground/80 mb-4">
								These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
							</p>
							<p className="text-foreground/80 mb-4">
								For the above purposes, personal information may be transferred to recipients in countries around the world which in some cases may have a lower level of protection than that within the USA.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Compliance With Laws</h2>
							<p className="text-foreground/80 mb-4">
								We will disclose your Personal Information where required to do so by law or subpoena or if we believe that such action is necessary to comply with the law and the reasonable requests of law enforcement or to protect the security or integrity of our Service.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Business Transaction</h2>
							<p className="text-foreground/80 mb-4">
								If SALATI is involved in a merger, acquisition or asset sale, your Personal Information may be transferred. We will provide notice before your Personal Information is transferred and becomes subject to a different Privacy Policy.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Security</h2>
							<p className="text-foreground/80 mb-4">
								The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">International Transfer</h2>
							<p className="text-foreground/80 mb-4">
								Your information, including Personal Information, may be transferred to and maintained on computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.
							</p>
							<p className="text-foreground/80 mb-4">
								If you are located outside the United Arab Emirates and choose to provide information to us, please note that we transfer the information, including Personal Information, to the United Arab Emirates and process it there.
							</p>
							<p className="text-foreground/80 mb-4">
								Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
							<p className="text-foreground/80 mb-4">
								SALATI stores the personal information as long as it is necessary to fulfil the purpose for which the data has been collected. This means that SALATI deletes your personal information when such information is no longer necessary, unless we have a legitimate interest to retain such data for longer periods or are required to do so by any applicable law. Statistics which has been anonymised may be saved thereafter.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Links To Other Sites</h2>
							<p className="text-foreground/80 mb-4">
								Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party&apos;s site. We strongly advise you to review the Privacy Policy of every site you visit.
							</p>
							<p className="text-foreground/80 mb-4">
								We do not share your personal information with those websites and we have no control over, and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
							</p>
							<p className="text-foreground/80 mb-4">
								Some of these third-party sites may have permission to include the SALATI logo, even though they are not operated or maintained by SALATI. Although we choose our business partners carefully, SALATI is not responsible for the privacy practices of websites operated by third parties that are linked to our site. Once you have left our website or Service, you should check the applicable privacy policy of the third party website to determine how they will handle any information they collect from you. We may provide service based on third party applications and content tools on SALATI. These third parties may automatically receive certain types of information whenever you interact with us on SALATI using such third party applications and tools, based on such third parties&apos; privacy statements.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Changes To This Privacy Policy</h2>
							<p className="text-foreground/80 mb-4">
								We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
							</p>
							<p className="text-foreground/80 mb-4">
								You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
							<p className="text-foreground/80 mb-4">
								If you have any questions about this Privacy Policy, please contact us:
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
