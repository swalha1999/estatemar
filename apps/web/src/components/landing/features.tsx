"use client";

import { BookOpen, Clock, Compass, Volume2 } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

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
						<h2 className="mb-4 font-bold text-3xl md:text-4xl">
							Features that enhance your spiritual journey
						</h2>
						<p className="mx-auto max-w-2xl text-foreground/70">
							Salati brings together all the tools you need for a focused and
							meaningful prayer experience.
						</p>
					</motion.div>

					<div className="relative z-10 grid grid-cols-6 gap-3">
						<AnimatedCard
							delay={0.1}
							className="relative col-span-full flex overflow-hidden lg:col-span-2"
						>
							<Card className="h-full w-full">
								<CardContent className="relative m-auto size-fit pt-6">
									<motion.div
										className="relative flex h-24 w-56 items-center"
										whileHover={{ scale: 1.05 }}
										transition={{ type: "spring", stiffness: 300 }}
									>
										<motion.span
											className="mx-auto block w-fit font-semibold text-5xl"
											initial={{ scale: 0, rotate: -180 }}
											animate={{ scale: 1, rotate: 0 }}
											transition={{ type: "spring", bounce: 0.6, delay: 0.8 }}
										>
											100%
										</motion.span>
									</motion.div>
									<motion.h2
										className="mt-6 text-center font-semibold text-3xl"
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.6 }}
									>
										Prayer Times
									</motion.h2>
									<motion.p
										className="mt-2 text-center text-foreground/70"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.8 }}
									>
										Accurate prayer times for your location
									</motion.p>
								</CardContent>
							</Card>
						</AnimatedCard>
						<AnimatedCard
							delay={0.2}
							className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2"
						>
							<Card className="h-full w-full">
								<CardContent className="pt-6">
									<motion.div
										className="before:-inset-2 relative mx-auto flex aspect-square size-32 rounded-full border before:absolute before:rounded-full before:border dark:border-white/10 dark:before:border-white/5"
										whileHover={{ rotate: 15 }}
										transition={{ type: "spring", stiffness: 300 }}
									>
										<motion.div
											initial={{ rotate: 0 }}
											animate={{ rotate: 360 }}
											transition={{
												duration: 20,
												repeat: Number.POSITIVE_INFINITY,
												ease: "linear",
											}}
											className="m-auto"
										>
											<Compass className="h-16 w-16 text-primary-600 dark:text-primary-500" />
										</motion.div>
									</motion.div>
									<div className="relative z-10 mt-6 space-y-2 text-center">
										<motion.h2
											className="font-medium text-lg transition dark:text-white"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.4 }}
										>
											Qibla Direction
										</motion.h2>
										<motion.p
											className="text-foreground/70"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.6 }}
										>
											Accurate compass pointing towards Mecca for proper prayer
											orientation.
										</motion.p>
									</div>
								</CardContent>
							</Card>
						</AnimatedCard>
						<AnimatedCard
							delay={0.3}
							className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2"
						>
							<Card className="h-full w-full">
								<CardContent className="pt-6">
									<motion.div className="relative pt-6 lg:px-6">
										<div className="before:-inset-2 relative mx-auto mb-6 flex aspect-square size-32 items-center justify-center rounded-full border before:absolute before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
											<motion.div
												whileHover={{ scale: 1.1 }}
												transition={{ type: "spring", stiffness: 400 }}
												className="flex items-center justify-center"
											>
												<BookOpen className="h-16 w-16 text-primary-600 dark:text-primary-500" />
											</motion.div>
										</div>
									</motion.div>
									<div className="relative z-10 mt-6 space-y-2 text-center">
										<motion.h2
											className="font-medium text-lg transition"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.5 }}
										>
											Quran Reading
										</motion.h2>
										<motion.p
											className="text-foreground/70"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.7 }}
										>
											Beautiful Arabic typography with smooth recitation
											experience.
										</motion.p>
									</div>
								</CardContent>
							</Card>
						</AnimatedCard>
						<AnimatedCard
							delay={0.4}
							className="card variant-outlined relative col-span-full overflow-hidden lg:col-span-3"
						>
							<Card className="h-full w-full">
								<CardContent className="grid pt-6 sm:grid-cols-2">
									<div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
										<motion.div
											className="before:-inset-2 relative flex aspect-square size-12 rounded-full border before:absolute before:rounded-full before:border dark:border-white/10 dark:before:border-white/5"
											whileHover={{ scale: 1.1, rotate: 5 }}
											transition={{ type: "spring", stiffness: 300 }}
										>
											<Volume2
												className="m-auto size-5 text-primary-600 dark:text-primary-500"
												strokeWidth={1}
											/>
										</motion.div>
										<motion.div
											className="space-y-2"
											initial={{ opacity: 0, x: -30 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.6 }}
										>
											<h2 className="font-medium text-lg text-zinc-800 transition dark:text-white">
												Audio Recitations
											</h2>
											<p className="text-foreground/70">
												Listen to beautiful Quran recitations with different
												reciters and follow along with the text.
											</p>
										</motion.div>
									</div>
									<motion.div
										className="-mb-6 -mr-6 relative mt-6 h-fit rounded-tl-(--radius) border-t border-l p-6 py-6 sm:ml-6"
										initial={{ opacity: 0, x: 30 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.8 }}
									>
										<div className="absolute top-2 left-3 flex gap-1">
											<motion.span
												className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"
												animate={{ scale: [1, 1.2, 1] }}
												transition={{
													duration: 2,
													repeat: Number.POSITIVE_INFINITY,
													delay: 0,
												}}
											/>
											<motion.span
												className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"
												animate={{ scale: [1, 1.2, 1] }}
												transition={{
													duration: 2,
													repeat: Number.POSITIVE_INFINITY,
													delay: 0.3,
												}}
											/>
											<motion.span
												className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"
												animate={{ scale: [1, 1.2, 1] }}
												transition={{
													duration: 2,
													repeat: Number.POSITIVE_INFINITY,
													delay: 0.6,
												}}
											/>
										</div>

										{/* Audio waveform visualization */}
										<div className="flex h-32 items-center justify-center space-x-1">
											{Array.from({ length: 20 }).map((_, i) => (
												<motion.div
													key={i}
													className="w-2 rounded-full bg-primary-500 dark:bg-primary-400"
													animate={{
														height: [8, Math.random() * 60 + 20, 8],
													}}
													transition={{
														duration: Math.random() * 2 + 1,
														repeat: Number.POSITIVE_INFINITY,
														repeatType: "reverse",
														ease: "easeInOut",
													}}
													style={{ height: 8 }}
												/>
											))}
										</div>
									</motion.div>
								</CardContent>
							</Card>
						</AnimatedCard>
						<AnimatedCard
							delay={0.5}
							className="card variant-outlined relative col-span-full overflow-hidden lg:col-span-3"
						>
							<Card className="h-full w-full">
								<CardContent className="grid h-full pt-6 sm:grid-cols-2">
									<div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
										<motion.div
											className="before:-inset-2 relative flex aspect-square size-12 rounded-full border before:absolute before:rounded-full before:border dark:border-white/10 dark:before:border-white/5"
											whileHover={{ scale: 1.1 }}
											transition={{ type: "spring", stiffness: 300 }}
										>
											<Clock
												className="m-auto size-6 text-primary-600 dark:text-primary-500"
												strokeWidth={1}
											/>
										</motion.div>
										<motion.div
											className="space-y-2"
											initial={{ opacity: 0, x: -30 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.7 }}
										>
											<h2 className="font-medium text-lg transition">
												Smart Reminders
											</h2>
											<p className="text-foreground/70">
												Customizable prayer reminders and notifications to keep
												you connected with your spiritual routine.
											</p>
										</motion.div>
									</div>
									<motion.div
										className="sm:-my-6 sm:-mr-6 relative mt-6 before:absolute before:inset-0 before:mx-auto before:w-px before:bg-(--color-border)"
										initial={{ opacity: 0, x: 30 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.9 }}
									>
										<div className="relative flex h-full flex-col justify-center space-y-6 py-6">
											<motion.div
												className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2"
												initial={{ opacity: 0, x: 20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: 1.1 }}
											>
												<span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">
													Fajr 5:30 AM
												</span>
												<motion.div
													className="flex size-7 items-center justify-center rounded-full bg-blue-100 ring-4 ring-background dark:bg-blue-900"
													whileHover={{ scale: 1.1 }}
												>
													<div className="h-2 w-2 rounded-full bg-blue-500" />
												</motion.div>
											</motion.div>
											<motion.div
												className="relative ml-[calc(50%-1rem)] flex items-center gap-2"
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: 1.3 }}
											>
												<motion.div
													className="flex size-8 items-center justify-center rounded-full bg-orange-100 ring-4 ring-background dark:bg-orange-900"
													whileHover={{ scale: 1.1 }}
												>
													<div className="h-3 w-3 rounded-full bg-orange-500" />
												</motion.div>
												<span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">
													Maghrib 7:15 PM
												</span>
											</motion.div>
											<motion.div
												className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2"
												initial={{ opacity: 0, x: 20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: 1.5 }}
											>
												<span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">
													Isha 8:45 PM
												</span>
												<motion.div
													className="flex size-7 items-center justify-center rounded-full bg-purple-100 ring-4 ring-background dark:bg-purple-900"
													whileHover={{ scale: 1.1 }}
												>
													<div className="h-2 w-2 rounded-full bg-purple-500" />
												</motion.div>
											</motion.div>
										</div>
									</motion.div>
								</CardContent>
							</Card>
						</AnimatedCard>
					</div>
				</div>
			</div>
		</section>
	);
}
