import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import Link from 'next/link'

import ChatIcon from '@mui/icons-material/Chat'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'ZenTicket',
    description: 'Get the best events in your city',
    favicon: '/favicon.ico',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <AppRouterCacheProvider>
                <ThemeProvider theme={theme}>
                    <body>
                        <header className="py-4 px-8 bg-gray-700 flex justify-between">
                            <div className="flex gap-8">
                                <span>ZenTicket</span>
                                <span>
                                    <Link href="/event">Events</Link>
                                </span>
                            </div>
                            <div className="flex gap-8 items-end">
                                <Link href="/order">
                                    <ShoppingCartIcon />
                                </Link>
                                <ChatIcon />
                            </div>
                        </header>
                        {children}
                    </body>
                </ThemeProvider>
            </AppRouterCacheProvider>
        </html>
    )
}
