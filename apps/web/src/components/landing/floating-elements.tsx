"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface FloatingElement {
	id: number;
	x: number;
	y: number;
	size: number;
	duration: number;
	delay: number;
}

export function FloatingElements() {
	const [elements, setElements] = useState<FloatingElement[]>([]);

	useEffect(() => {
		const generateElements = () => {
			const newElements = Array.from({ length: 8 }, (_, i) => ({
				id: i,
				x: Math.random() * 100,
				y: Math.random() * 100,
				size: Math.random() * 6 + 4,
				duration: Math.random() * 20 + 10,
				delay: Math.random() * 5,
			}));
			setElements(newElements);
		};

		generateElements();
	}, []);

	return (
		<div className="-z-10 pointer-events-none fixed inset-0 overflow-hidden">
			{elements.map((element) => (
				<motion.div
					key={element.id}
					className="absolute rounded-full bg-primary/5 blur-sm dark:bg-primary/10"
					style={{
						left: `${element.x}%`,
						top: `${element.y}%`,
						width: `${element.size}px`,
						height: `${element.size}px`,
					}}
					animate={{
						y: [0, -30, 0],
						x: [0, Math.random() > 0.5 ? 15 : -15, 0],
						scale: [1, 1.1, 1],
						opacity: [0.3, 0.8, 0.3],
					}}
					transition={{
						duration: element.duration,
						repeat: Number.POSITIVE_INFINITY,
						delay: element.delay,
						ease: "easeInOut",
					}}
				/>
			))}

			{/* Gradient orbs */}
			<motion.div
				className="absolute top-1/4 right-1/4 h-72 w-72 rounded-full bg-gradient-to-r from-blue-400/10 to-green-400/10 blur-3xl"
				animate={{
					scale: [1, 1.2, 1],
					opacity: [0.3, 0.5, 0.3],
				}}
				transition={{
					duration: 8,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
				}}
			/>

			<motion.div
				className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-400/10 blur-3xl"
				animate={{
					scale: [1.2, 1, 1.2],
					opacity: [0.2, 0.4, 0.2],
				}}
				transition={{
					duration: 12,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
				}}
			/>
		</div>
	);
}
