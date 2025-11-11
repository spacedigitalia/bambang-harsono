"use client"

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useAuth } from '@/utils/context/AuthContext'

import { AppSidebar } from '@/components/app-sidebar'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import AccessDenied from '@/components/dashboard/AccessDenied'

import { SiteHeader } from '@/components/site-header'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading, userRole } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/')
        }
    }, [loading, user, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    if (userRole !== 'admins') {
        return <AccessDenied />
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <main className='py-2 px-2 md:py-4 md:px-4'>
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}