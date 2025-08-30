"use client";

import { Quote, Star } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
	{
		name: "Ahmed Hassan",
		role: "Software Engineer",
		avatar: "https://github.com/shadcn.png",
		content:
			"Salati has completely transformed my prayer experience. The accurate prayer times and beautiful athan notifications keep me connected to my faith throughout the day.",
		rating: 5,
	},
	{
		name: "Fatima Al-Zahra",
		role: "Teacher",
		avatar: "https://github.com/emilkowalski.png",
		content:
			"As a busy teacher, I love how Salati reminds me of prayer times and helps me stay focused during salah. The interface is so clean and intuitive.",
		rating: 5,
	},
	{
		name: "Omar Khalil",
		role: "Student",
		avatar: "https://github.com/raunofreiberg.png",
		content:
			"The qibla finder feature is amazing! I travel a lot and it's so helpful to have accurate qibla direction wherever I am. Highly recommend!",
		rating: 5,
	},
	{
		name: "Aisha Rahman",
		role: "Healthcare Worker",
		avatar: "https://github.com/educlopez.png",
		content:
			"Working in healthcare means irregular hours, but Salati ensures I never miss a prayer. The notifications are perfect and not intrusive.",
		rating: 5,
	},
	{
		name: "Yusuf Ibrahim",
		role: "Business Owner",
		avatar: "https://github.com/swalha1999.png",
		content:
			"The athkar feature is wonderful. It helps me maintain my spiritual connection throughout the day with beautiful reminders and dhikr.",
		rating: 5,
	},
	{
		name: "Zara Malik",
		role: "Designer",
		avatar: "https://github.com/shadcn.png",
		content:
			"I love the beautiful design and smooth animations. It makes using the app a pleasure while helping me stay connected to my faith.",
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
		<section ref={containerRef} className="bg-background/50 py-16 md:py-32">
			<div className="container mx-auto max-w-6xl px-6">
				<motion.div
					ref={titleRef}
					initial={{ opacity: 0, y: 30 }}
					animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.6 }}
					className="mb-16 text-center"
				>
					<h2 className="mb-4 font-bold text-3xl md:text-4xl">
						Loved by Muslims worldwide
					</h2>
					<p className="mx-auto max-w-2xl text-foreground/70">
						Join thousands of users who have transformed their prayer experience
						with Salati
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
