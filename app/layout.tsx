import "@/styles/globals.css"
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { Header } from "@/components/header"

import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

import { Analytics } from '@vercel/analytics/react';


export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ]
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script async src="https://tally.so/widgets/embed.js"></script>
        </head>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem> */}
          <ThemeProvider attribute="class" defaultTheme="light">
            <div className="relative flex min-h-screen flex-col">
              {/* <SiteHeader /> */}
              <Header />
              <div className="flex-1">{children}</div>
            </div>
            {/* <div className="flex flex-col min-h-screen">
              <main className="flex flex-col flex-1 bg-muted/50">{children}</main>
            </div> */}
            <TailwindIndicator />
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </>
  )
}
