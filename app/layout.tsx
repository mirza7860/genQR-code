import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GenQR - Custom QR Code Generator",
  description: "Create, customize, and manage beautiful QR codes for your business or personal use.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center">
                <a href="/" className="flex items-center gap-2">
                  <span className="text-xl font-bold">GenQR</span>
                </a>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                  <a href="/" className="text-sm font-medium">
                    Home
                  </a>
                  <a href="/generator" className="text-sm font-medium">
                    Generator
                  </a>
                  <a href="/reader" className="text-sm font-medium">
                    Reader
                  </a>
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'