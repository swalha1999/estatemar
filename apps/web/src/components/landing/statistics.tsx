"use client";

import { Award, Building2, DollarSign, TrendingUp, Users } from "lucide-react";
import { motion, useInView } from "motion/react";
// Import Montserrat font
import { Montserrat } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const montserrat = Montserrat({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-montserrat",
});

const stats = [
	{
		icon: Building2,
		value: 430,
		suffix: "+",
		label: "Successful Deals",
		description: "Properties closed",
	},
	{
		icon: Users,
		value: 4300,
		suffix: "+",
		label: "Satisfied Customers",
		description: "Happy clients",
	},
	{
		icon: DollarSign,
		value: 400,
		suffix: "M+",
		label: "Trading Volume",
		description: "In property value",
	},
	{
		icon: Award,
		value: 25,
		suffix: "+",
		label: "Years Experience",
		description: "In real estate law",
	},
];

function AnimatedCounter({
	value,
	suffix = "",
	duration = 2000,
}: {
	value: number;
	suffix?: string;
	duration?: number;
}) {
	const [count, setCount] = useState(0);
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	useEffect(() => {
		if (isInView) {
			const startTime = Date.now();
			const animate = () => {
				const elapsed = Date.now() - startTime;
				const progress = Math.min(elapsed / duration, 1);
				const currentCount = Math.floor(value * progress);
				setCount(currentCount);

				if (progress < 1) {
					requestAnimationFrame(animate);
				} else {
					setCount(value);
				}
			};
			animate();
		}
	}, [isInView, value, duration]);

	return (
		<span ref={ref} className="font-bold text-4xl md:text-5xl">
			{count.toFixed(value % 1 === 0 ? 0 : 1)}
			{suffix}
		</span>
	);
}

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
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
			whileHover={{ y: -8, scale: 1.02 }}
		>
			<Card className="h-full">
				<CardContent className="p-8 text-center">
					<motion.div
						initial={{ scale: 0, rotate: -180 }}
						animate={
							isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }
						}
						transition={{
							type: "spring",
							bounce: 0.6,
							delay: index * 0.1 + 0.3,
						}}
						className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
					>
						<stat.icon className="size-8 text-primary" />
					</motion.div>

					<div className="mb-2">
						<AnimatedCounter value={stat.value} suffix={stat.suffix} />
					</div>

					<h3 className="mb-2 font-semibold text-xl">{stat.label}</h3>
					<p className="text-foreground/60 text-sm">{stat.description}</p>
				</CardContent>
			</Card>
		</motion.div>
	);
}

export function StatisticsSection() {
	const containerRef = useRef(null);
	const titleRef = useRef(null);
	const isTitleInView = useInView(titleRef, { once: true });

	return (
		<section
			ref={containerRef}
			id="trusted-expertise"
			className="bg-gradient-to-br from-primary/5 via-transparent to-primary/5 py-16 md:py-32"
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
						Trusted Expertise
					</h2>
					<p
						className={`mx-auto max-w-2xl font-medium text-foreground/80 text-lg ${montserrat.className}`}
					>
						Our co-founders are seasoned real estate lawyers with a proven track
						record
					</p>
				</motion.div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					{stats.map((stat, index) => (
						<StatCard key={index} stat={stat} index={index} />
					))}
				</div>
			</div>
		</section>
	);
}
