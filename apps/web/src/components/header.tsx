"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { Menu, X, ArrowLeft } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/themes/mode-toggle"

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false)
	const pathname = usePathname()
	const isHomePage = pathname === "/"

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-6">
				{/* Logo and Back Button */}
				<div className="flex items-center space-x-4">
					{!isHomePage && (
						<Button
							variant="ghost"
							size="icon"
							asChild
							className="mr-2"
						>
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
								src="/salati-logo.png"
								alt="Salati App Icon"
								width={126}
								height={54}
							/>
						</motion.div>
					</Link>
				</div>

				{/* Desktop Navigation - Only show on home page */}
				{isHomePage && (
					<nav className="hidden md:flex items-center space-x-6">
						<Link
							href="#features"
							className="text-foreground/70 hover:text-foreground transition-colors"
						>
							Features
						</Link>
						<Link
							href="#how-it-works"
							className="text-foreground/70 hover:text-foreground transition-colors"
						>
							How It Works
						</Link>
						<Link
							href="#testimonials"
							className="text-foreground/70 hover:text-foreground transition-colors"
						>
							Reviews
						</Link>
						<Link
							href="#faq"
							className="text-foreground/70 hover:text-foreground transition-colors"
						>
							FAQ
						</Link>
						<Link
							href="#download"
							className="text-foreground/70 hover:text-foreground transition-colors"
						>
							Download
						</Link>
					</nav>
				)}

				{/* Desktop Actions */}
				<div className="hidden md:flex items-center space-x-4">
					<ModeToggle />
					<Button asChild>
						<Link href="https://apps.apple.com/us/app/salati-%D8%B5%D9%84%D8%A7%D8%AA%D9%8A/id1546722792">
							Download App
						</Link>
					</Button>
				</div>

				{/* Mobile Menu Button */}
				<div className="md:hidden flex items-center space-x-2">
					<ModeToggle />
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleMenu}
						aria-label="Toggle menu"
					>
						{isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
						closed: { opacity: 0, height: 0 }
					}}
					transition={{ duration: 0.2 }}
					className="md:hidden overflow-hidden border-t bg-background/95 backdrop-blur"
				>
					<nav className="container mx-auto px-6 py-4 space-y-4">
						<Link
							href="#features"
							className="block text-foreground/70 hover:text-foreground transition-colors"
							onClick={() => setIsMenuOpen(false)}
						>
							Features
						</Link>
						<Link
							href="#how-it-works"
							className="block text-foreground/70 hover:text-foreground transition-colors"
							onClick={() => setIsMenuOpen(false)}
						>
							How It Works
						</Link>
						<Link
							href="#testimonials"
							className="block text-foreground/70 hover:text-foreground transition-colors"
							onClick={() => setIsMenuOpen(false)}
						>
							Reviews
						</Link>
						<Link
							href="#faq"
							className="block text-foreground/70 hover:text-foreground transition-colors"
							onClick={() => setIsMenuOpen(false)}
						>
							FAQ
						</Link>
						<Link
							href="#download"
							className="block text-foreground/70 hover:text-foreground transition-colors"
							onClick={() => setIsMenuOpen(false)}
						>
							Download
						</Link>
						<Button asChild className="w-full">
							<Link
								href="https://apps.apple.com/us/app/salati-%D8%B5%D9%84%D8%A7%D8%AA%D9%8A/id1546722792"
								onClick={() => setIsMenuOpen(false)}
							>
								Download App
							</Link>
						</Button>
					</nav>
				</motion.div>
			)}
		</header>
	)
}
