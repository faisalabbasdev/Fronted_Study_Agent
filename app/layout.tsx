import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "react-hot-toast"
import "./globals.css"
import SiteHeader from "@/components/site-header"
import AnimatedBackground from "@/components/animated-background"
import { AuthProvider } from "@/contexts/AuthContext"
import { LoadingProvider } from "@/contexts/LoadingContext"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Study Mode Agent - AI-Powered Learning Platform",
  description: "Transform your learning experience with our AI-powered study assistant. Get personalized explanations, practice with intelligent quizzes, and track your progress with advanced analytics.",
  keywords: ["AI learning", "study assistant", "education technology", "personalized learning", "quiz platform"],
  authors: [{ name: "Study Mode Agent Team" }],
  creator: "Study Mode Agent",
  publisher: "Study Mode Agent",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://studymodeagent.com"),
  openGraph: {
    title: "Study Mode Agent - AI-Powered Learning Platform",
    description: "Transform your learning experience with our AI-powered study assistant.",
    url: "https://studymodeagent.com",
    siteName: "Study Mode Agent",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Study Mode Agent - AI-Powered Learning Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Mode Agent - AI-Powered Learning Platform",
    description: "Transform your learning experience with our AI-powered study assistant.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <LoadingProvider>
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
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                  border: '1px solid hsl(var(--border))',
                },
                success: {
                  iconTheme: {
                    primary: 'hsl(var(--primary))',
                    secondary: 'hsl(var(--primary-foreground))',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'hsl(var(--destructive))',
                    secondary: 'hsl(var(--destructive-foreground))',
                  },
                },
              }}
            />
            <Analytics />
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
