import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'

import Header from './header'

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
                        <Header />
                        {children}
                    </body>
                </ThemeProvider>
            </AppRouterCacheProvider>
        </html>
    )
}
