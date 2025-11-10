"use client"

import React from 'react'

import { toast } from 'sonner'

import { IconBrandTiktok, IconBrandInstagram, IconMail } from '@tabler/icons-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { motion, easeOut } from 'framer-motion'

export default function Contact() {
    return (
        <section className='py-5 md:py-10 xl:py-20' id='contact'>
            <motion.div
                className="container space-y-10 xl:space-y-10 px-4 xl:px-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: easeOut }}
            >
                <ContactFormSection />
            </motion.div>
        </section>
    )
}

function ContactFormSection() {
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [subject, setSubject] = React.useState("")
    const [message, setMessage] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
    }

    const listContainer = {
        hidden: { opacity: 1 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 },
        },
    }

    const listItem = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: easeOut } },
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
            toast.error('Semua field wajib diisi')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error('Format email tidak valid')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            })
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data?.error || 'Gagal mengirim pesan')
            }
            toast.success('Pesan berhasil dikirim. Kami akan segera menghubungi Anda.')
            setName("")
            setEmail("")
            setSubject("")
            setMessage("")
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Terjadi kesalahan'
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12">
            <motion.div
                className="space-y-6"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-semibold">How can we help?</h2>
                    <p className="text-muted-foreground">Looking for support? Chat to our friendly team 24/7.</p>
                </div>

                <motion.ul className="space-y-2 text-primary" variants={listContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
                    <motion.li className="flex items-center gap-2" variants={listItem}>
                        <IconBrandTiktok size={18} />
                        <a href="https://www.tiktok.com/@yeahitsbams?_r=1&_t=ZS-91HRaxSI5hw" className="hover:underline" target="_blank" rel="noopener noreferrer">Kunjungi TikTok</a>
                    </motion.li>
                    <motion.li className="flex items-center gap-2" variants={listItem}>
                        <IconBrandInstagram size={18} />
                        <a href="https://www.instagram.com/yurspace22?igsh=MWE5OG9qZHcxdXRqZw==" className="hover:underline" target="_blank" rel="noopener noreferrer">Ikuti Instagram</a>
                    </motion.li>
                    <motion.li className="flex items-center gap-2" variants={listItem}>
                        <IconMail size={18} />
                        <a href="mailto:bambangharsono1707@gmail.com" className="hover:underline">Kirim Email</a>
                    </motion.li>
                </motion.ul>

                <motion.form
                    onSubmit={onSubmit}
                    className="space-y-5"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className='flex flex-col gap-2'>
                            <Label>Name</Label>
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label>Work email</Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <Label>Subject</Label>
                        <Input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="What is this regarding?"
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <Label>Message</Label>
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your message"
                            className='resize-none'
                            rows={6}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Sending...' : 'Send message'}
                            </Button>
                        </motion.div>
                    </div>
                </motion.form>
            </motion.div>

            <motion.div
                className="rounded-xl border overflow-hidden bg-muted/40 min-h-[360px]"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 0.15 }}
            >
                <iframe
                    title="map"
                    className="w-full h-full min-h-[360px]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3966.541972479755!2d106.52946077499014!3d-6.191984393795636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwMTEnMzEuMSJTIDEwNsKwMzEnNTUuMyJF!5e0!3m2!1sid!2sid!4v1762687466838!5m2!1sid!2sid"
                />
            </motion.div>
        </div>
    )
}

