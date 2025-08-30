import { AndroidSmartBanner } from "@/components/landing/android-smart-banner";
import { CTASection } from "@/components/landing/cta";
import { FAQSection } from "@/components/landing/faq";
import FeaturesSection from "@/components/landing/features";
import { FloatingElements } from "@/components/landing/floating-elements";
import { Footer } from "@/components/landing/footer";
import { HeroShowcase } from "@/components/landing/hero";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { StatisticsSection } from "@/components/landing/statistics";
import { TestimonialsSection } from "@/components/landing/testimonials";

export default function LandingPage() {
	return (
		<div className="relative overflow-hidden">
			{/* Android Smart App Banner */}
			<AndroidSmartBanner />

			{/* Floating elements background */}
			<FloatingElements />

			{/* Background gradient animation */}
			<div className="-z-10 fixed inset-0">
				<div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-green-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-green-950/20" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.05),transparent)]" />
			</div>

			<HeroShowcase />
			<section id="features">
				<FeaturesSection />
			</section>
			<section id="statistics">
				<StatisticsSection />
			</section>
			<section id="how-it-works">
				<HowItWorksSection />
			</section>
			<section id="testimonials">
				<TestimonialsSection />
			</section>
			<section id="faq">
				<FAQSection />
			</section>
			<section id="download">
				<CTASection />
			</section>
			<Footer />
		</div>
	);
}
