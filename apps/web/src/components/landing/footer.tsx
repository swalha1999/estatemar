"use client";

import { Heart, Mail } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
	return (
		<footer className="border-t bg-background">
			<div className="container mx-auto max-w-6xl px-6 py-12">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					{/* Brand */}
					<div className="md:col-span-2">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
						>
							<div className="mb-4 flex items-center space-x-3">
								<Image
									src="/blue_estatemar_logo.svg"
									alt="Estatemar Logo"
									width={300}
									height={90}
									className="h-64 w-auto"
								/>
							</div>
							<p className="mb-6 max-w-md text-foreground/70">
								Your complete real estate platform for data-driven investing, property management, and seamless experiences. With Estatemar, you invest with confidence.
							</p>
							<div className="flex items-center gap-4">
								<Link
									href="mailto:info@estatemar.com"
									className="text-foreground/70 transition-colors hover:text-foreground"
								>
									<Mail className="size-5" />
								</Link>
							</div>
						</motion.div>
					</div>

					{/* Quick Links */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						viewport={{ once: true }}
					>
						<h4 className="mb-4 font-semibold">Quick Links</h4>
						<ul className="space-y-2">
							<li>
								<Link
									href="#features"
									className="text-foreground/70 transition-colors hover:text-foreground"
								>
									Features
								</Link>
							</li>
							<li>
								<Link
									href="#testimonials"
									className="text-foreground/70 transition-colors hover:text-foreground"
								>
									Reviews
								</Link>
							</li>
							<li>
								<Link
									href="#download"
									className="text-foreground/70 transition-colors hover:text-foreground"
								>
									Download
								</Link>
							</li>
							<li>
								<Link
									href="#faq"
									className="text-foreground/70 transition-colors hover:text-foreground"
								>
									FAQ
								</Link>
							</li>
						</ul>
					</motion.div>

					{/* Support */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
					>
						<h4 className="mb-4 font-semibold">Support</h4>
						<ul className="space-y-2">
							<li>
								<Link
									href="/privacy"
									className="text-foreground/70 transition-colors hover:text-foreground"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="text-foreground/70 transition-colors hover:text-foreground"
								>
									Terms of Service
								</Link>
							</li>
						</ul>
					</motion.div>
				</div>

				{/* Bottom */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					viewport={{ once: true }}
					className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row"
				>
					<p className="text-foreground/60 text-sm">
						© 2025 Estatemar. All rights reserved.
					</p>
					<div className="flex items-center gap-2 text-foreground/60 text-sm">
						<span>Made with</span>
						<Heart className="size-4 fill-red-500 text-red-500" />
						<span>for the real estate community</span>
					</div>
				</motion.div>
			</div>
		</footer>
	);
}
