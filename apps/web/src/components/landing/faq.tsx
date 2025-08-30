"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
	{
		question: "Is Estatemar free to use?",
		answer:
			"Yes, Estatemar offers a free dashboard for agents and partners. Core features are available at no cost, with premium features for advanced users.",
	},
	{
		question: "How accurate is the market data?",
		answer:
			"Estatemar uses real-time data from multiple sources to provide accurate market valuations, rental yields, and investment projections for your properties.",
	},
	{
		question: "What legal support do you provide?",
		answer:
			"Our in-house legal experts ensure safe and transparent transactions, providing guidance on contracts, regulations, and compliance throughout the process.",
	},
	{
		question: "Can I manage multiple properties?",
		answer:
			"Absolutely! Our dashboard allows you to manage multiple properties in one place, track performance, and access comprehensive analytics for each investment.",
	},
	{
		question: "How do virtual 3D tours work?",
		answer:
			"Virtual 3D tours allow potential buyers and tenants to explore properties remotely, providing an immersive experience that saves time and increases engagement.",
	},
	{
		question: "What financing options are available?",
		answer:
			"Estatemar partners with various financial institutions to offer flexible financing options for property purchases and development projects.",
	},
	{
		question: "Can I use Estatemar for commercial properties?",
		answer:
			"Yes! Estatemar supports both residential and commercial properties, with specialized tools and data for different property types and investment strategies.",
	},
	{
		question: "How do I get started as an agent or partner?",
		answer:
			"Simply sign up for a free account and access our dashboard. Our team will guide you through the setup process and help you maximize your real estate business.",
	},
];

function FAQItem({ faq, index }: { faq: (typeof faqs)[0]; index: number }) {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 60, scale: 0.95 }}
			animate={
				isInView
					? { opacity: 1, y: 0, scale: 1 }
					: { opacity: 0, y: 60, scale: 0.95 }
			}
			transition={{
				type: "spring",
				bounce: 0.2,
				duration: 0.8,
				delay: index * 0.1,
			}}
		>
			<Card className="overflow-hidden">
				<CardContent className="p-0">
					<button
						type="button"
						onClick={() => setIsOpen(!isOpen)}
						className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-muted/50"
					>
						<h3 className="pr-4 font-semibold text-lg">{faq.question}</h3>
						{isOpen ? (
							<ChevronUp className="size-5 flex-shrink-0 text-muted-foreground" />
						) : (
							<ChevronDown className="size-5 flex-shrink-0 text-muted-foreground" />
						)}
					</button>
					<motion.div
						initial={false}
						animate={isOpen ? "open" : "closed"}
						variants={{
							open: { opacity: 1, height: "auto" },
							closed: { opacity: 0, height: 0 },
						}}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						<div className="px-6 pb-6">
							<p className="text-foreground/70 leading-relaxed">{faq.answer}</p>
						</div>
					</motion.div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

export function FAQSection() {
	const containerRef = useRef(null);
	const titleRef = useRef(null);
	const isTitleInView = useInView(titleRef, { once: true });
	
	return (
		<section ref={containerRef} id="faq" className="bg-background/50 py-16 md:py-32">
			<div className="container mx-auto max-w-4xl px-6">
				<motion.div
					ref={titleRef}
					initial={{ opacity: 0, y: 30 }}
					animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.6 }}
					className="mb-16 text-center"
				>
					<h2 className="mb-4 font-bold text-3xl md:text-4xl">
						Frequently Asked Questions
					</h2>
					<p className="mx-auto max-w-2xl text-foreground/70">
						Find answers to common questions about Estatemar and how it can enhance
						your real estate experience
					</p>
				</motion.div>

				<div className="space-y-4">
					{faqs.map((faq, index) => (
						<FAQItem key={faq.question} faq={faq} index={index} />
					))}
				</div>
			</div>
		</section>
	);
}
