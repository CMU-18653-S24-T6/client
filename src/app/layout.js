import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'

import ChatIcon from '@mui/icons-material/Chat'

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
                            <div>
                                <span>ZenTicket</span>
                            </div>
                            <div className="flex gap-2">
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
