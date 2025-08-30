"use client";

import { Building2, Eye, Scale, TrendingUp, Users } from "lucide-react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Animated card wrapper component
function AnimatedCard({
	children,
	delay = 0,
	className = "",
	...props
}: {
	children: React.ReactNode;
	delay?: number;
	className?: string;
} & Omit<
	React.HTMLAttributes<HTMLDivElement>,
	"onDrag" | "onDragEnd" | "onDragStart" | "onAnimationStart" | "onAnimationEnd"
>) {
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
				delay: delay,
			}}
			whileHover={{ y: -8, scale: 1.02 }}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	);
}

export default function FeaturesSection() {
	const containerRef = useRef(null);
	const titleRef = useRef(null);
	const isTitleInView = useInView(titleRef, { once: true });

	return (
		<section
			ref={containerRef}
			id="why-estatemar"
			className="overflow-hidden bg-gray-50 py-16 md:py-32 dark:bg-transparent"
		>
			<div className="mx-auto max-w-5xl px-6">
				<div className="relative">
					{/* Animated section title */}
					<motion.div
						ref={titleRef}
						initial={{ opacity: 0, y: 30 }}
						animate={
							isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
						}
						transition={{ duration: 0.6 }}
						className="mb-16 text-center"
					>
						<h2 className="mb-4 font-bold text-3xl text-foreground tracking-tight md:text-4xl">
							Why Estatemar?
						</h2>
						<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
							We bring together real-time data, legal expertise, and innovative
							technology to make property ownership and investing easier than
							ever.
						</p>
					</motion.div>

					<div className="relative z-10 grid grid-cols-6 gap-3">
						<AnimatedCard
							delay={0.1}
							className="relative col-span-full flex overflow-hidden lg:col-span-2"
						>
							<Card className="h-full w-full">
								<CardHeader className="pb-2 text-center">
									<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
										<TrendingUp className="h-8 w-8 text-primary" />
									</div>
									<CardTitle className="text-xl">Real Data & ROI</CardTitle>
								</CardHeader>
								<CardContent className="text-center">
									<p className="text-muted-foreground">
										Track live market value and rental potential of your
										properties
									</p>
								</CardContent>
							</Card>
						</AnimatedCard>
						<AnimatedCard
							delay={0.2}
							className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2"
						>
							<Card className="h-full w-full">
								<CardHeader className="pb-2 text-center">
									<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
										<Building2 className="h-8 w-8 text-primary" />
									</div>
									<CardTitle className="text-xl">
										Projects & Financing
									</CardTitle>
								</CardHeader>
								<CardContent className="text-center">
									<p className="text-muted-foreground">
										Explore developments with flexible financing options
									</p>
								</CardContent>
							</Card>
						</AnimatedCard>
						<AnimatedCard
							delay={0.3}
							className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2"
						>
							<Card className="h-full w-full">
								<CardHeader className="pb-2 text-center">
									<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
										<Scale className="h-8 w-8 text-primary" />
									</div>
									<CardTitle className="text-xl">Legal Support</CardTitle>
								</CardHeader>
								<CardContent className="text-center">
									<p className="text-muted-foreground">
										In-house legal experts ensure safe and transparent
										transactions
									</p>
								</CardContent>
							</Card>
						</AnimatedCard>
						<AnimatedCard
							delay={0.4}
							className="relative col-span-full overflow-hidden lg:col-span-3"
						>
							<Card className="h-full w-full">
								<CardHeader className="pb-2">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
										<Eye className="h-6 w-6 text-primary" />
									</div>
									<CardTitle className="text-xl">Virtual 3D Tours</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground">
										Walk through properties anytime, anywhere with immersive
										virtual tours
									</p>
									<div className="mt-6 rounded-lg border bg-muted/50 p-1">
										<iframe
											src="https://tourin3d.com/"
											className="h-48 w-full rounded-md"
											title="Virtual 3D Tour Demo"
											allowFullScreen
										/>
									</div>
								</CardContent>
							</Card>
						</AnimatedCard>
						<AnimatedCard
							delay={0.5}
							className="relative col-span-full overflow-hidden lg:col-span-3"
						>
							<Card className="h-full w-full">
								<CardHeader className="pb-2">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
										<Users className="h-6 w-6 text-primary" />
									</div>
									<CardTitle className="text-xl">Free Dashboard</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="mb-6 text-muted-foreground">
										Free property management dashboard for agents & partners
									</p>
									<div className="space-y-4">
										<div className="flex items-center gap-3">
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
												<div className="h-2 w-2 rounded-full bg-blue-500" />
											</div>
											<span className="text-muted-foreground text-sm">
												Agents
											</span>
										</div>
										<div className="flex items-center gap-3">
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
												<div className="h-2 w-2 rounded-full bg-orange-500" />
											</div>
											<span className="text-muted-foreground text-sm">
												Partners
											</span>
										</div>
										<div className="flex items-center gap-3">
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
												<div className="h-2 w-2 rounded-full bg-purple-500" />
											</div>
											<span className="text-muted-foreground text-sm">
												Companies
											</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</AnimatedCard>
					</div>
				</div>

				{/* Dashboard CTA for Partners */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.6, delay: 0.8 }}
					className="mt-16 text-center"
				>
					<div className="mx-auto max-w-2xl">
						<h3 className="mb-4 font-semibold text-2xl text-foreground tracking-tight">
							Ready to Get Started?
						</h3>
						<p className="mb-8 text-muted-foreground">
							Join thousands of real estate professionals who are already using
							Estatemar to grow their business.
						</p>
						<Button asChild size="lg">
							<Link href="/dashboard">Go To Dashboard</Link>
						</Button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
