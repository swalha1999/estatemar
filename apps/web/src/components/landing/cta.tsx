"use client";

import { Download, Star, Users } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function CTASection() {
	const containerRef = useRef(null);
	const isInView = useInView(containerRef, { once: true });

	return (
		<section
			ref={containerRef}
			className="bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 py-16 md:py-32"
		>
			<div className="container mx-auto max-w-4xl px-6 text-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.6 }}
				>
					<h2 className="mb-6 font-bold text-3xl md:text-4xl lg:text-5xl">
						Start Your Spiritual Journey Today
					</h2>
					<p className="mx-auto mb-8 max-w-2xl text-foreground/70 text-lg">
						Join thousands of Muslims worldwide who have transformed their
						prayer experience with Salati. Download now and never miss a prayer
						again.
					</p>

					{/* Stats */}
					<div className="mb-12 flex flex-wrap items-center justify-center gap-8">
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={
								isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
							}
							transition={{ delay: 0.2 }}
							className="flex items-center gap-2"
						>
							<Star className="size-5 fill-yellow-400 text-yellow-400" />
							<span className="font-semibold">4.8/5 Rating</span>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={
								isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
							}
							transition={{ delay: 0.3 }}
							className="flex items-center gap-2"
						>
							<Users className="size-5 text-primary" />
							<span className="font-semibold">50K+ Users</span>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={
								isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
							}
							transition={{ delay: 0.4 }}
							className="flex items-center gap-2"
						>
							<Download className="size-5 text-primary" />
							<span className="font-semibold">100K+ Downloads</span>
						</motion.div>
					</div>

					{/* Download Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
						transition={{ delay: 0.5 }}
						className="flex flex-col items-center justify-center gap-4 sm:flex-row"
					>
						<a
							href="https://apps.apple.com/us/app/salati-%D8%B5%D9%84%D8%A7%D8%AA%D9%8A/id1546722792?itscg=30200&itsct=apps_box_badge&mttnsubad=1546722792"
							className="inline-block"
						>
							<img
								src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1649462400"
								alt="Download on the App Store"
								className="h-16 w-auto object-contain transition-transform hover:scale-105"
							/>
						</a>
						<a
							href="https://play.google.com/store/apps/details?id=net.nadsoft.salati&hl=en&gl=US"
							className="inline-block"
						>
							<img
								src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
								alt="Get it on Google Play"
								className="h-16 w-auto object-contain transition-transform hover:scale-105"
							/>
						</a>
					</motion.div>

					{/* Additional CTA */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={isInView ? { opacity: 1 } : { opacity: 0 }}
						transition={{ delay: 0.7 }}
						className="mt-8"
					>
						<p className="text-foreground/60 text-sm">
							Free to download • No ads • Privacy focused
						</p>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
