import "@/styles/globals.css"
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
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
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
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
              <SiteHeader />
              <div className="container grid items-center gap-6 pb-8 pt-6 md:py-6 mt-6 mb-3 rounded-md border">
                <div className="sm:text-sm md:text-md tracking-tight">
                  <h1 className="text-lg font-bold">
                    Welcome! Give InstaGraph a try below.
                  </h1>
                    This project was inspired by <a href="https://twitter.com/yoheinakajima" target="_blank" rel="noopener noreferrer" className="underline text-blue-500">@yoheinakajima</a>, "VC by day, builder by night." 
                    <br/>
                    Yohei built <a href="https://instagraph.ai" target="_blank" rel="noopener noreferrer" className="underline text-blue-500">instagraph.ai</a> to visualize AI generated knowledge graphs. Check out his examples {' '}  
                    <a href="https://twitter.com/yoheinakajima/status/1706848028014068118" target="_blank" rel="noopener noreferrer" className="underline text-blue-500">here</a> {' '}  
                    and {' '}  
                    <a href="https://twitter.com/yoheinakajima/status/1701351068817301922" target="_blank" rel="noopener noreferrer" className="underline text-blue-500">here</a>.
                    <br/>
                    These graphs are more similar to how our brain embeds information in comparison to a linear format.
                    <br/>
                    <br/> 
                    I created my own version of instagraph here. I'm adding some fun features to help you build your own knowledge graphs and more.
                    <br/>
                    <a href="https://tally.so#tally-open=mY0676&tally-layout=modal&tally-width=1000&tally-emoji-text=👋&tally-emoji-animation=wave&tally-auto-close=0" className="underline text-blue-500">
                        Sign up for early access
                    </a> {' '}
                    and reach out via Twitter if you have any questions or suggestions.
                </div>
              </div>
              <div className="flex-1">{children}</div>
            </div>
            <TailwindIndicator />
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </>
  )
}
