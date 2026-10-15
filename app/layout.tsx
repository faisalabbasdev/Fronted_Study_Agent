import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "react-hot-toast"
import Script from "next/script"
import "./globals.css"
import SiteHeader from "@/components/site-header"
import { AuthProvider } from "@/contexts/AuthContext"
import { LoadingProvider } from "@/contexts/LoadingContext"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Tayyar — Your course material, your study space",
  description: "Organize your subjects, practice with quizzes from your course PDFs, review mistakes, and follow your study progress with Tayyar.",
  keywords: ["AI learning", "study assistant", "education technology", "personalized learning", "quiz platform"],
  authors: [{ name: "Tayyar" }],
  creator: "Tayyar",
  publisher: "Tayyar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://studymodeagent.com"),
  openGraph: {
    title: "Tayyar — Your course material, your study space",
    description: "Organize your subjects, practice with quizzes from your course PDFs, review mistakes, and follow your study progress with Tayyar.",
    url: "https://studymodeagent.com",
    siteName: "Tayyar",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tayyar — AI Exam Preparation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tayyar — Your course material, your study space",
    description: "Organize your subjects, practice with quizzes from your course PDFs, review mistakes, and follow your study progress with Tayyar.",
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
      <head>
        <Script id="tayyar-theme-init" strategy="beforeInteractive">{`try { const theme = localStorage.getItem("theme"); const dark = theme === "dark"; document.documentElement.classList.toggle("dark", dark); document.documentElement.classList.toggle("light", !dark); } catch { document.documentElement.classList.add("light"); }`}</Script>
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <LoadingProvider>
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
