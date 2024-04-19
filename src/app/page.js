'use client'
import { useState, useEffect } from 'react'
import * as jose from 'jose'
import Link from 'next/link'

import { logout } from '@/utils/auth'

export default function Home() {
    const [decoded, setDecoded] = useState(null)
    useEffect(() => {
        const idToken = localStorage.getItem('idToken')
        if (idToken) {
            const decoded = jose.decodeJwt(idToken)
            setDecoded(decoded)
        }
    }, [])
    return (
        <main className="flex flex-col min-h-screen items-center justify-center gap-64 p-4">
            <div className="flex items-center justify-center gap-12 flex-wrap">
                <div className="flex flex-col gap-6 max-w-96">
                    <h1 className="text-4xl font-bold">Welcome to ZenTicket</h1>
                    {decoded ? (
                        <p>
                            You are logged in as <strong>{decoded.email}</strong>. <a onClick={logout}>Log out</a>
                        </p>
                    ) : (
                        <p>
                            You are not logged in. Please <Link href={'/login'}>log in</Link> to access the best events
                            in your city.
                        </p>
                    )}
                </div>
            </div>
        </main>
    )
}
