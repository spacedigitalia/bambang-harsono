"use client"

import Image from 'next/image'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { IconBrandInstagram, IconBrandTiktokFilled, IconBrandLinkedinFilled, IconBrandGithub, IconBrandWhatsapp } from "@tabler/icons-react"

import { motion, type Variants } from 'framer-motion'

import { useLoading } from '@/utils/context/LoadingContext'

const socialLink = [
    {
        href: "https://www.instagram.com/yurspace22?igsh=MWE5OG9qZHcxdXRqZw==",
        icon: IconBrandInstagram,
    },
    {
        href: "https://www.tiktok.com/@yeahitsbams?_r=1&_t=ZS-91HRaxSI5hw",
        icon: IconBrandTiktokFilled,
    },
    {
        href: "https://www.linkedin.com/in/bambang-harsono-31981b29b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        icon: IconBrandLinkedinFilled,
    },
    {
        href: "https://gist.github.com/bambangharsono",
        icon: IconBrandGithub,
    },
    {
        href: "https://wa.me/message/HVPSQOQGHTHVM1",
        icon: IconBrandWhatsapp,
    },
]

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15, when: 'beforeChildren' },
    },
}

const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const itemLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
}

const socialContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.12 },
    },
}

export default function Home({ homeData }: { homeData: HomeContent[] }) {
    const content = homeData?.[0]
    const { isInitialLoading, isLoading } = useLoading()
    const isBusy = isInitialLoading || isLoading
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="container px-4">
                <motion.div
                    className="grid grid-cols-1 items-center gap-10 xl:grid-cols-2 z-50 "
                    variants={container}
                    initial="hidden"
                    animate={isBusy ? "hidden" : "show"}
                >
                    <motion.div className="pl-0 lg:pl-12 space-y-6 text-left order-2 xl:order-1" variants={item}>
                        <div className="leading-[0.9]">
                            <motion.h1
                                className="text-4xl sm:text-6xl md:text-7xl max-w-[400px] font-extrabold tracking-tight leading-tight wrap-break-word"
                                variants={itemLeft}
                            >
                                {content?.name}
                            </motion.h1>
                        </div>

                        <div className="flex flex-wrap items-center justify-start gap-3">
                            {
                                content?.links?.map((link, idx) => (
                                    <motion.div key={link.href} variants={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                                        <Link href={link.href}>
                                            <Button size="lg" variant={idx === 1 ? "ghost" : "default"} className="gap-2 cursor-pointer">
                                                <span className="inline-flex items-center">{link.label}</span>
                                            </Button>
                                        </Link>
                                    </motion.div>
                                ))
                            }
                        </div>
                    </motion.div>

                    <motion.div className="flex flex-col justify-center mb-5 gap-2 pl-0 lg:pl-24 xl:pl-44 order-2 xl:order-1" variants={item}>
                        <motion.span className="mb-2 text-base uppercase tracking-wider opacity-60" variants={item}>*{content?.text}</motion.span>
                        <motion.h2 className="mb-3 text-2xl font-semibold md:text-4xl" variants={itemLeft}>{content?.title}</motion.h2>
                        <motion.p className="text-base opacity-80 max-w-[400px]" variants={item}>{content?.description}</motion.p>
                    </motion.div>

                    <motion.div className='relative order-1 xl:order-3 xl:absolute xl:bottom-0 xl:left-0 xl:right-0 -z-10' initial={{ opacity: 0, y: 40 }} animate={isBusy ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                        <motion.div className="relative mx-auto w-full md:w-[calc(100%-2rem)] overflow-hidden aspect-video opacity-70" initial={{ scale: 1.02 }} animate={isBusy ? { scale: 1.02 } : { scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                            <Image
                                src={content?.image}
                                alt={content?.name}
                                fill
                                sizes="100vw"
                                priority
                                className="object-contain object-center select-none pointer-events-none"
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>

                <motion.div
                    className='relative xl:absolute xl:bottom-10 container left-0 right-0 px-0 xl:px-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 z-50'
                    initial={{ opacity: 0, y: 10 }}
                    animate={isBusy ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Link href={`mailto:${content?.email}`} className='max-w-full truncate hover:text-primary hover:underline transition-all'>{content?.email}</Link>

                    <motion.div className='flex gap-2' variants={socialContainer} initial="hidden" animate={isBusy ? "hidden" : "show"}>
                        {
                            socialLink.map((s, idx) => {
                                return (
                                    <motion.div key={idx} variants={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                                        <Link href={s.href} target="_blank" rel="noopener noreferrer">
                                            <Button size="default" className="gap-2 bg-card cursor-pointer text-card-foreground hover:bg-card/90">
                                                <s.icon className="w-6 h-6" />
                                            </Button>
                                        </Link>
                                    </motion.div>
                                )
                            })
                        }
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
