"use client";

import { Quote, Star } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
	{
		name: "Ahmed Hassan",
		role: "Property Investor",
		avatar: "https://github.com/shadcn.png",
		content:
			"Estatemar has completely transformed my real estate investing. The real-time data and ROI projections help me make informed decisions that maximize my returns.",
		rating: 5,
	},
	{
		name: "Fatima Al-Zahra",
		role: "Real Estate Agent",
		avatar: "https://github.com/emilkowalski.png",
		content:
			"As a busy agent, I love how Estatemar's free dashboard helps me manage properties and reach more clients. The virtual tours are a game-changer for showings.",
		rating: 5,
	},
	{
		name: "Omar Khalil",
		role: "Property Developer",
		avatar: "https://github.com/raunofreiberg.png",
		content:
			"The legal support team is exceptional! They ensure all our transactions are safe and transparent. Estatemar makes complex deals feel simple.",
		rating: 5,
	},
	{
		name: "Aisha Rahman",
		role: "Property Manager",
		avatar: "https://github.com/educlopez.png",
		content:
			"Managing multiple properties used to be overwhelming, but Estatemar's dashboard keeps everything organized. The market insights are invaluable.",
		rating: 5,
	},
	{
		name: "Yusuf Ibrahim",
		role: "First-time Buyer",
		avatar: "https://github.com/swalha1999.png",
		content:
			"Buying my first property was intimidating, but Estatemar's guidance and legal support made the process smooth and stress-free.",
		rating: 5,
	},
	{
		name: "Zara Malik",
		role: "Real Estate Partner",
		avatar: "https://github.com/shadcn.png",
		content:
			"I love the beautiful interface and comprehensive features. Estatemar has helped me grow my real estate business significantly.",
		rating: 5,
	},
];

function TestimonialCard({
	testimonial,
	index,
}: {
	testimonial: (typeof testimonials)[0];
	index: number;
}) {
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
				<CardContent className="p-6">
					<div className="mb-4 flex items-center gap-1">
						{[...Array(testimonial.rating)].map((_, i) => (
							<Star
								key={i}
								className="size-4 fill-yellow-400 text-yellow-400"
							/>
						))}
					</div>
					<Quote className="mb-4 size-8 text-muted-foreground/50" />
					<p className="mb-6 text-foreground/80 leading-relaxed">
						&quot;{testimonial.content}&quot;
					</p>
					<div className="flex items-center gap-3">
						<Avatar className="size-10">
							<AvatarImage src={testimonial.avatar} alt={testimonial.name} />
							<AvatarFallback>
								{testimonial.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-semibold text-sm">{testimonial.name}</p>
							<p className="text-foreground/60 text-xs">{testimonial.role}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

export function TestimonialsSection() {
	const containerRef = useRef(null);
	const titleRef = useRef(null);
	const isTitleInView = useInView(titleRef, { once: true });

	return (
		<section
			ref={containerRef}
			id="testimonials"
			className="bg-background/50 py-16 md:py-32"
		>
			<div className="container mx-auto max-w-6xl px-6">
				<motion.div
					ref={titleRef}
					initial={{ opacity: 0, y: 30 }}
					animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.6 }}
					className="mb-16 text-center"
				>
					<h2 className="mb-4 font-bold text-3xl md:text-4xl">
						Loved by real estate professionals
					</h2>
					<p className="mx-auto max-w-2xl text-foreground/70">
						Join thousands of users who have transformed their real estate
						experience with Estatemar
					</p>
				</motion.div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{testimonials.map((testimonial, index) => (
						<TestimonialCard
							key={index}
							testimonial={testimonial}
							index={index}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
