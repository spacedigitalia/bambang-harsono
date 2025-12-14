import Link from 'next/link'

import { navLink } from '@/components/layout/lib/Navigation'

export default function Footer() {
    const year = new Date().getFullYear()
    return (
        <footer>
            <div className="container mx-auto px-4 border-t">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-semibold dark:bg-zinc-100 dark:text-zinc-900">BH</Link>
                        <span className="text-sm text-zinc-400">Bambang Harsono</span>
                    </div>

                    <nav className="flex items-center gap-6 text-sm md:text-base">
                        {navLink.map((link, idx) => (
                            <Link key={idx} href={link.href} className="text-zinc-400 hover:text-white transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="text-xs text-zinc-500">© {year} All rights reserved.</div>
                </div>
            </div>
        </footer>
    )
}