"use client"

import * as React from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { motion } from "motion/react"
import { AnimatedGroup } from "@/components/landing/animated-group"
import { AnimatedText } from "@/components/landing/animated-text"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface HeroShowcaseProps {
  heading?: string
  description?: string
  reviews?: {
    count: number
    avatars: {
      src: string
      alt: string
    }[]
    rating?: number
  }
}

export function HeroShowcase({
  heading = "Your guide to deeper Qur’an in prayer.",
  description = "Salati helps you follow and recite Qur’anic verses with ease during prayer, offering reminders, guidance, and a focused spiritual experience.",

  reviews = {
    count: 100,
    rating: 5.0,
    avatars: [
      {
        src: "https://github.com/educlopez.png",
        alt: "Avatar 1",
      },
      {
        src: "https://github.com/emilkowalski.png",
        alt: "Avatar 2",
      },
      {
        src: "https://github.com/raunofreiberg.png",
        alt: "Avatar 3",
      },
      {
        src: "https://github.com/shadcn.png",
        alt: "Avatar 4",
      },
      {
        src: "https://github.com/swalha1999.png",
        alt: "Avatar 5",
      },
    ],
  },
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
            className="my-6 text-4xl font-bold text-pretty lg:text-6xl xl:text-7xl"
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
            className="mb-12 flex w-fit flex-col items-center gap-4 sm:flex-row"
          >
            <span className="inline-flex items-center -space-x-4">
              {reviews.avatars.map((avatar, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ display: "inline-block" }}
                >
                  <Avatar className="size-12 border">
                    <AvatarImage src={avatar.src} alt={avatar.alt} />
                  </Avatar>
                </motion.div>
              ))}
            </span>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="size-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="mr-1 font-semibold">
                  {reviews.rating?.toFixed(1)}
                </span>
              </div>
              <p className="text-foreground/70 text-left font-medium">
                from {reviews.count}+ reviews
              </p>
            </div>
          </AnimatedGroup>
          <AnimatedGroup
            preset="slide"
            className="flex w-full flex-col justify-center gap-4 sm:flex-row lg:justify-start"
          >
            <a 
              href="https://apps.apple.com/us/app/salati-%D8%B5%D9%84%D8%A7%D8%AA%D9%8A/id1546722792?itscg=30200&itsct=apps_box_badge&mttnsubad=1546722792" 
              className="inline-block"
            >
              <img 
                src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1649462400" 
                alt="Download on the App Store" 
                className="h-14 w-auto object-contain hover:scale-105 transition-transform"
              />
            </a>
            <a 
              href="https://play.google.com/store/apps/details?id=net.nadsoft.salati&hl=en&gl=US" 
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
            src="/iPhone_bg.png"
            alt="app screen"
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
