"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Github } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Play className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-foreground">YouTube 分析工具</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            首页
          </Link>
          <Link
            href="/app"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            分析工具
          </Link>
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            功能特色
          </Link>
          <Link
            href="#about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            关于我们
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
          <Button variant="default" size="sm" asChild>
            <Link href="/app">开始分析</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
