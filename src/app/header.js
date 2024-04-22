'use client'
import { useState, useEffect } from 'react'

import { getRole } from '@/utils/auth'

import Link from 'next/link'

import ChatIcon from '@mui/icons-material/Chat'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

export default function Header() {
    const [role, setRole] = useState(null)
    useEffect(() => {
        setRole(getRole())
    }, [])
    return (
        <header className="py-4 px-8 bg-gray-700 flex justify-between">
            <div className="flex gap-8">
                <span>ZenTicket</span>
                <span>
                    {role === 'ADMIN' ? (
                        <Link href="/event-admin">Manage Events</Link>
                    ) : (
                        <Link href="/event">Events</Link>
                    )}
                </span>
                <span>{role === 'ADMIN' && <Link href="/order-admin">Manage Orders</Link>}</span>
            </div>
            <div className="flex gap-8 items-end">
                {role === 'USER' && (
                    <Link href="/order">
                        <ShoppingCartIcon />
                    </Link>
                )}
                {role && <ChatIcon />}
                {!role && <Link href="/login">Log In</Link>}
            </div>
        </header>
    )
}
