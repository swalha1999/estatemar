"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
	{
		question: "Is Salati free to use?",
		answer:
			"Yes, Salati is completely free to download and use. All core features including prayer times, qibla finder, and athkar are available at no cost.",
	},
	{
		question: "Does Salati work offline?",
		answer:
			"Yes! Once you've set your location, Salati works offline for prayer times and qibla direction. You'll need internet connection for initial setup and updates.",
	},
	{
		question: "How accurate are the prayer times?",
		answer:
			"Salati uses precise astronomical calculations and multiple calculation methods to provide highly accurate prayer times for your exact location.",
	},
	{
		question: "Can I customize the athan notifications?",
		answer:
			"Absolutely! You can choose different athan sounds, adjust notification timing, and set custom reminders for each prayer.",
	},
	{
		question: "Is my location data private?",
		answer:
			"Yes, your location data is only used to calculate accurate prayer times and is never shared with third parties. We prioritize your privacy.",
	},
	{
		question: "Does Salati support multiple languages?",
		answer:
			"Yes, Salati supports multiple languages including English, Arabic, and others. You can change the language in the app settings.",
	},
	{
		question: "Can I use Salati while traveling?",
		answer:
			"Yes! Salati automatically updates prayer times when you travel to different locations, and the qibla finder works worldwide.",
	},
	{
		question: "How do I report a bug or suggest a feature?",
		answer:
			"You can contact us through the app settings or email us directly. We value your feedback and continuously work to improve Salati.",
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
		<section ref={containerRef} className="bg-background/50 py-16 md:py-32">
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
						Find answers to common questions about Salati and how it can enhance
						your prayer experience
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
