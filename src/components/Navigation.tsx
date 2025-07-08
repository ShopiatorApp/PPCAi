'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Settings } from 'lucide-react'


export function Navigation() {
    const pathname = usePathname()

    const links = [
        { href: '/', label: 'Dashboard' },
        { href: '/terms', label: 'Search Terms' },
        { href: '/ngrams', label: 'Ngram Analysis' },
        { href: '/settings', label: 'Settings' }
    ]

    return (
        <nav className="fixed top-0 z-40 w-full border-b bg-white">
            <div className="container mx-auto px-4 h-16 flex items-center">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-6">
                        <Link href="/" className="flex items-center">
                            <span className="font-bold">
                                Google Ads Dashboard
                            </span>
                        </Link>
                        <div className="flex space-x-8">
                            {links.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2',
                                        pathname === link.href
                                            ? 'border-blue-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <Link
                        href="/settings"
                        className={cn(
                            "transition-colors hover:text-foreground/80",
                            pathname === "/settings" ? "text-foreground" : "text-foreground/60"
                        )}
                    >
                        <Settings size={20} />
                    </Link>
                </div>
            </div>
        </nav>
    )
} 