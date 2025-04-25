import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { RocketLaunchIcon } from '@heroicons/react/24/outline'

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b shadow-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex items-center space-x-2">
          <RocketLaunchIcon className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-foreground hidden sm:inline-block">InstaGraph</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-primary/10 text-foreground/80 hover:text-foreground"
              >
                <Icons.gitHub className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline-block">GitHub</span>
              </Button>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-primary/10 text-foreground/80 hover:text-foreground"
              >
                <Icons.twitter className="h-5 w-5 mr-1 fill-current" />
                <span className="hidden sm:inline-block">Twitter</span>
              </Button>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
