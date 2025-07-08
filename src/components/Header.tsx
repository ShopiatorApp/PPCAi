'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { HelpCircle, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const pathname = usePathname()

  const navigationItems = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/reports', label: 'Reports' },
    { href: '/settings', label: 'Settings' },
  ]

  const accounts = [
    { id: '1', name: 'Account 1' },
    { id: '2', name: 'Account 2' },
    { id: '3', name: 'Account 3' },
  ]

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 relative bg-gray-200 rounded overflow-hidden">
              <Image
                src="https://placehold.co/40x40/2563eb/ffffff?text=Logo"
                alt="Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </div>

          {/* Account Dropdown */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                Select Account
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {accounts.map((account) => (
                  <DropdownMenuItem key={account.id}>
                    {account.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation Items */}
          <nav className="flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-gray-900',
                  pathname === item.href
                    ? 'text-gray-900'
                    : 'text-gray-500'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Options */}
          <div className="flex items-center space-x-4">
            <Link
              href="/help"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
} 