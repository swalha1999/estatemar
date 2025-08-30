"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { AnimatedGroup } from "@/components/landing/animated-group"
import { AnimatedText } from "@/components/landing/animated-text"

// Import Montserrat font
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat'
})

interface HeroShowcaseProps {
  heading?: string
  description?: string
}

export function HeroShowcase({
  heading = "Estatemar – Smarter Real Estate at Your Fingertips",
  description = "Your complete real estate platform for data-driven investing, property management, and seamless experiences.",
}: HeroShowcaseProps) {

  return (
    <motion.section
      className="from-background to-background relative overflow-hidden bg-gradient-to-b"
      initial={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", bounce: 0.32, duration: 0.9 }}
    >
      <div className="container mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <AnimatedGroup
          preset="blur-slide"
          className="mx-auto flex flex-col items-center text-center md:ml-auto lg:max-w-3xl lg:items-start lg:text-left"
        >
          <AnimatedText
            as="h1"
            className={`my-6 text-2xl font-light text-pretty lg:text-3xl xl:text-4xl ${montserrat.className}`}
          >
            {heading}
          </AnimatedText>
          <AnimatedText
            as="p"
            className="text-foreground/70 mb-8 max-w-xl lg:text-xl"
            delay={0.12}
          >
            {description}
          </AnimatedText>
          <AnimatedGroup
            preset="slide"
            className="flex w-full flex-col justify-center gap-4 sm:flex-row lg:justify-start"
          >
            <a 
              href="#" 
              className="inline-block"
            >
              <img 
                src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1649462400" 
                alt="Download on the App Store" 
                className="h-14 w-auto object-contain hover:scale-105 transition-transform"
              />
            </a>
            <a 
              href="#" 
              className="inline-block"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                alt="Get it on Google Play" 
                className="h-14 w-auto object-contain hover:scale-105 transition-transform"
              />
            </a>
          </AnimatedGroup>
        </AnimatedGroup>
        <div className="flex">
          <Image
            src="/app1.png"
            alt="Estatemar app screen"
            width={2880}
            height={1842}
            className="h-full w-full rounded-md object-cover"
            priority
          />
        </div>
      </div>
    </motion.section>
  )
}
