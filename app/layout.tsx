import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import SiteHeader from "@/components/site-header"
import AnimatedBackground from "@/components/animated-background"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* Background runs behind all content */}
        <Suspense fallback={null}>
          <AnimatedBackground />
        </Suspense>
        {/* Sticky header across all pages */}
        <Suspense fallback={null}>
          <SiteHeader />
        </Suspense>
        {/* Main content area */}
        <main className="relative min-h-screen pt-16">{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
