'use client'

import React from 'react'

import { useEffect } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { useLoading } from "@/utils/context/LoadingContext"

import Image from 'next/image'

import pesawat from "@/assets/pesawat.png"

function CloudLinesCanvas({ className = "w-full h-40" }: { className?: string }) {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const rafRef = React.useRef<number | null>(null)
    const stripesRef = React.useRef<Array<{ x: number; y: number; w: number; h: number; v: number; a: number; idx: number }>>([])

    useEffect(() => {
        const canvasEl = canvasRef.current
        if (!canvasEl) return
        const context = canvasEl.getContext('2d')
        if (!context) return
        const canvas = canvasEl
        const ctx = context

        const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1))

        function resize() {
            const { clientWidth, clientHeight } = canvas
            canvas.width = Math.floor(clientWidth * DPR)
            canvas.height = Math.floor(clientHeight * DPR)
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
            const count = 6
            const stripes: typeof stripesRef.current = []
            const topOffset = 24
            const bottomOffset = 8
            const availableHeight = Math.max(0, clientHeight - topOffset - bottomOffset)
            const segment = availableHeight / count
            for (let i = 0; i < count; i++) {
                const h = Math.random() * 4 + 1.5
                const w = Math.random() * (clientWidth * 0.25) + clientWidth * 0.15
                const maxX = Math.max(0, clientWidth - w)
                const baseY = topOffset + i * segment
                const yRange = Math.max(0, segment - h)
                const y = Math.min(clientHeight - bottomOffset - h, baseY + Math.random() * yRange)
                stripes.push({
                    x: Math.random() * maxX,
                    y,
                    w,
                    h,
                    v: (Math.random() * 0.6 + 0.2) * 1.0,
                    a: Math.random() * 0.2 + 0.2,
                    idx: i,
                })
            }
            stripesRef.current = stripes
        }

        function roundedRect(x: number, y: number, w: number, h: number, r: number) {
            const rr = Math.min(r, h / 2, w / 2)
            ctx.beginPath()
            ctx.moveTo(x + rr, y)
            ctx.lineTo(x + w - rr, y)
            ctx.quadraticCurveTo(x + w, y, x + w, y + rr)
            ctx.lineTo(x + w, y + h - rr)
            ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h)
            ctx.lineTo(x + rr, y + h)
            ctx.quadraticCurveTo(x, y + h, x, y + h - rr)
            ctx.lineTo(x, y + rr)
            ctx.quadraticCurveTo(x, y, x + rr, y)
            ctx.closePath()
        }

        function step() {
            const { width, height } = canvas
            ctx.clearRect(0, 0, width, height)
            const w = canvas.clientWidth
            const h = canvas.clientHeight

            for (const s of stripesRef.current) {
                s.x -= s.v
                if (s.x < 0) {
                    const count = stripesRef.current.length || 1
                    const topOffset = 24
                    const bottomOffset = 8
                    const availableHeight = Math.max(0, h - topOffset - bottomOffset)
                    const segment = availableHeight / count
                    s.w = Math.random() * (w * 0.25) + w * 0.15
                    s.h = Math.random() * 4 + 1.5
                    s.v = (Math.random() * 0.6 + 0.2) * 1.0
                    s.a = Math.random() * 0.2 + 0.2
                    const baseY = topOffset + (s.idx ?? 0) * segment
                    const yRange = Math.max(0, segment - s.h)
                    s.y = Math.min(h - bottomOffset - s.h, baseY + Math.random() * yRange)
                    s.x = Math.max(0, w - s.w)
                }
                ctx.globalAlpha = s.a
                ctx.fillStyle = '#ffffff'
                ctx.shadowColor = 'rgba(255,255,255,0.9)'
                ctx.shadowBlur = 8
                roundedRect(s.x, s.y, s.w, s.h, s.h / 2)
                ctx.fill()
            }

            ctx.shadowBlur = 0
            ctx.globalAlpha = 1
            rafRef.current = requestAnimationFrame(step)
        }

        resize()
        step()
        const ro = new ResizeObserver(() => resize())
        ro.observe(canvas)
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            ro.disconnect()
        }
    }, [])

    return (
        <div className={`relative ${className}`}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    )
}

function MangcodingStyleSplash({
    isLoading,
    className = "",
}: MangcodingStyleSplashProps) {
    if (!isLoading) return null

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-background ${className}`}
        >
            <div className="absolute inset-0 z-0 pointer-events-none">
                <CloudLinesCanvas className="w-full h-full" />
            </div>
            <div className="relative z-10 flex flex-col items-center space-y-8 w-screen px-4">
                <motion.div
                    className="text-center"
                >
                    <motion.div
                        className="w-screen overflow-hidden mb-3 h-[120px] relative"
                    >
                        <motion.div
                            className="absolute top-1/2 -translate-y-1/2"
                            initial={{ left: 0 }}
                            animate={{ left: "calc(100vw - 240px)" }}
                            transition={{ duration: 6, ease: "linear", repeat: Infinity }}
                        >
                            <Image
                                src={pesawat}
                                alt="Airplane"
                                width={300}
                                height={150}
                                priority
                                className="opacity-90 select-none w-full h-full object-contain"
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>


            </div>
        </div>
    )
}

function ControlledInitialLoader({
    loadingMessage,
    onDone,
}: {
    loadingMessage: string;
    onDone: () => void;
}) {
    const { isInitialLoading } = useLoading()

    useEffect(() => {
        if (!isInitialLoading) {
            onDone()
        }
    }, [isInitialLoading, onDone])

    return (
        <MangcodingStyleSplash
            isLoading={isInitialLoading}
            message={loadingMessage}
        />
    )
}

export default function LoadingOverlayWrapper() {
    const { isLoading, loadingMessage } = useLoading()
    const [initialDone, setInitialDone] = React.useState(false)
    const [showInitialSplit, setShowInitialSplit] = React.useState(false)
    const INITIAL_SPLIT_DURATION_MS = 650
    const prevIsLoadingRef = React.useRef(isLoading)

    useEffect(() => {
        let openTimer: ReturnType<typeof setTimeout> | undefined
        let closeTimer: ReturnType<typeof setTimeout> | undefined
        if (initialDone && prevIsLoadingRef.current && !isLoading) {
            openTimer = setTimeout(() => {
                setShowInitialSplit(true)
                closeTimer = setTimeout(() => setShowInitialSplit(false), INITIAL_SPLIT_DURATION_MS)
            }, 0)
        }
        prevIsLoadingRef.current = isLoading
        return () => {
            if (openTimer) clearTimeout(openTimer)
            if (closeTimer) clearTimeout(closeTimer)
        }
    }, [isLoading, initialDone])

    return (
        <>
            <AnimatePresence mode="wait" initial={true}>
                {!initialDone && (
                    <motion.div key="initial-sequence" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, ease: 'linear' }}>
                        <ControlledInitialLoader
                            loadingMessage={loadingMessage}
                            onDone={() => {
                                if (!isLoading) {
                                    setShowInitialSplit(true)
                                    setTimeout(() => setShowInitialSplit(false), INITIAL_SPLIT_DURATION_MS)
                                }
                                setInitialDone(true)
                            }}
                        />
                    </motion.div>
                )}

                {initialDone && (
                    <motion.div key="loading-splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, ease: 'linear' }}>
                        <MangcodingStyleSplash
                            isLoading={isLoading}
                            message={loadingMessage}
                        />
                    </motion.div>
                )}
                {showInitialSplit && (
                    <div className="fixed inset-0 z-60 pointer-events-none">
                        <motion.div
                            className="absolute top-0 left-0 h-full w-1/2 bg-foreground"
                            initial={{ x: 0 }}
                            animate={{ x: "-100%" }}
                            transition={{ duration: INITIAL_SPLIT_DURATION_MS / 1000, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                        />
                        <motion.div
                            className="absolute top-0 right-0 h-full w-1/2 bg-foreground"
                            initial={{ x: 0 }}
                            animate={{ x: "100%" }}
                            transition={{ duration: INITIAL_SPLIT_DURATION_MS / 1000, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                        />
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}