"use client";

import { Building2, Scale, Search, TrendingUp } from "lucide-react";
import { motion, useInView } from "motion/react";
// Import Montserrat font
import { Montserrat } from "next/font/google";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

const montserrat = Montserrat({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-montserrat",
});

const steps = [
	{
		icon: Search,
		title: "Discover Properties",
		description:
			"Browse our extensive database of properties with real-time market data and virtual 3D tours.",
		step: "01",
	},
	{
		icon: Building2,
		title: "Evaluate Investments",
		description:
			"Access comprehensive property analytics, ROI projections, and market trends to make informed decisions.",
		step: "02",
	},
	{
		icon: Scale,
		title: "Legal Support",
		description:
			"Get expert legal guidance from our in-house real estate lawyers for safe and transparent transactions.",
		step: "03",
	},
	{
		icon: TrendingUp,
		title: "Manage & Grow",
		description:
			"Use our dashboard to manage your properties, track performance, and explore new investment opportunities.",
		step: "04",
	},
];

function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
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
				delay: index * 0.2,
			}}
			whileHover={{ y: -8, scale: 1.02 }}
			className="relative"
		>
			{/* Connection line for desktop */}
			{index < steps.length - 1 && (
				<div className="-right-6 -translate-y-1/2 absolute top-1/2 hidden h-0.5 w-12 transform bg-gradient-to-r from-primary/50 to-transparent lg:block" />
			)}

			<Card className="relative h-full">
				<CardContent className="p-8 text-center">
					{/* Step number */}
					<div className="-top-4 -translate-x-1/2 absolute left-1/2 transform">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-sm">
							{step.step}
						</div>
					</div>

					{/* Icon */}
					<motion.div
						initial={{ scale: 0, rotate: -180 }}
						animate={
							isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }
						}
						transition={{
							type: "spring",
							bounce: 0.6,
							delay: index * 0.2 + 0.3,
						}}
						className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
					>
						<step.icon className="size-8 text-primary" />
					</motion.div>

					{/* Content */}
					<h3
						className={`mb-4 font-semibold text-primary text-xl ${montserrat.className}`}
					>
						{step.title}
					</h3>
					<p
						className={`font-medium text-foreground/80 leading-relaxed ${montserrat.className}`}
					>
						{step.description}
					</p>
				</CardContent>
			</Card>
		</motion.div>
	);
}

export function HowItWorksSection() {
	const containerRef = useRef(null);
	const titleRef = useRef(null);
	const isTitleInView = useInView(titleRef, { once: true });

	return (
		<section
			ref={containerRef}
			id="how-it-works"
			className="bg-background py-16 md:py-32"
		>
			<div className="container mx-auto max-w-6xl px-6">
				<motion.div
					ref={titleRef}
					initial={{ opacity: 0, y: 30 }}
					animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.6 }}
					className="mb-16 text-center"
				>
					<h2
						className={`mb-4 font-bold text-3xl text-primary md:text-4xl ${montserrat.className}`}
					>
						How Estatemar Works
					</h2>
					<p
						className={`mx-auto max-w-2xl font-medium text-foreground/80 text-lg ${montserrat.className}`}
					>
						Get started with Estatemar in just a few simple steps and transform
						your real estate experience
					</p>
				</motion.div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
					{steps.map((step, index) => (
						<StepCard key={index} step={step} index={index} />
					))}
				</div>
			</div>
		</section>
	);
}
