"use client";

import { ArrowLeft, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ModeToggle } from "@/components/themes/mode-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const pathname = usePathname();
	const isHomePage = pathname === "/";

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-6">
				{/* Logo and Back Button */}
				<div className="flex items-center space-x-4">
					{!isHomePage && (
						<Button variant="ghost" size="icon" asChild className="mr-2">
							<Link href="/">
								<ArrowLeft className="h-4 w-4" />
								<span className="sr-only">Go back to home</span>
							</Link>
						</Button>
					)}
					<Link href="/" className="flex items-center space-x-2">
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="flex items-center space-x-2"
						>
							<Image
								src="/blue_estatemar_logo.svg"
								alt="Estatemar Logo"
								width={300}
								height={90}
								className="h-64 w-auto"
							/>
						</motion.div>
					</Link>
				</div>

				{/* Desktop Navigation - Only show on home page */}
				{isHomePage && (
					<nav className="hidden items-center space-x-6 md:flex">
						<Link
							href="#why-estatemar"
							className="text-foreground/70 transition-colors hover:text-foreground"
						>
							Why Estatemar
						</Link>
						<Link
							href="#how-it-works"
							className="text-foreground/70 transition-colors hover:text-foreground"
						>
							How It Works
						</Link>
						<Link
							href="#trusted-expertise"
							className="text-foreground/70 transition-colors hover:text-foreground"
						>
							Trusted Expertise
						</Link>
						<Link
							href="#faq"
							className="text-foreground/70 transition-colors hover:text-foreground"
						>
							FAQ
						</Link>
					</nav>
				)}

				{/* Desktop Actions */}
				<div className="hidden items-center space-x-4 md:flex">
					<ModeToggle />
					<Button asChild>
						<Link href="/dashboard">
							Dashboard
						</Link>
					</Button>
				</div>

				{/* Mobile Menu Button */}
				<div className="flex items-center space-x-2 md:hidden">
					<ModeToggle />
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleMenu}
						aria-label="Toggle menu"
					>
						{isMenuOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
					</Button>
				</div>
			</div>

			{/* Mobile Navigation - Only show on home page */}
			{isHomePage && (
				<motion.div
					initial={false}
					animate={isMenuOpen ? "open" : "closed"}
					variants={{
						open: { opacity: 1, height: "auto" },
						closed: { opacity: 0, height: 0 },
					}}
					transition={{ duration: 0.2 }}
					className="overflow-hidden border-t bg-background/95 backdrop-blur md:hidden"
				>
					<nav className="container mx-auto space-y-4 px-6 py-4">
						<Link
							href="#why-estatemar"
							className="block text-foreground/70 transition-colors hover:text-foreground"
							onClick={() => setIsMenuOpen(false)}
						>
							Why Estatemar
						</Link>
						<Link
							href="#how-it-works"
							className="block text-foreground/70 transition-colors hover:text-foreground"
							onClick={() => setIsMenuOpen(false)}
						>
							How It Works
						</Link>
						<Link
							href="#trusted-expertise"
							className="block text-foreground/70 transition-colors hover:text-foreground"
							onClick={() => setIsMenuOpen(false)}
						>
							Trusted Expertise
						</Link>
						<Link
							href="#faq"
							className="block text-foreground/70 transition-colors hover:text-foreground"
							onClick={() => setIsMenuOpen(false)}
						>
							FAQ
						</Link>
						<Button asChild className="w-full">
							<Link
								href="/dashboard"
								onClick={() => setIsMenuOpen(false)}
							>
								Dashboard
							</Link>
						</Button>
					</nav>
				</motion.div>
			)}
		</header>
	);
}
