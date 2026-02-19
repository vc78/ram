import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import MediaFallbackInjector from "@/components/media-fallback-injector"
import { Suspense } from "react"
import "./globals.css"
import PageTheme from "@/components/page-theme"
import { LanguageProvider } from "@/contexts/language-context"
import ErrorBoundary from "@/components/error-boundary"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "SIID FLASH - Smart Intelligent Infrastructure Design",
  description:
    "Transform your dreams into reality with AI-powered architectural design and seamless contractor connections",
  generator: "SIID FLASH",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable}`}>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <LanguageProvider>
              <PageTheme />
              <MediaFallbackInjector />
              {children}
              <Analytics />
            </LanguageProvider>
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
}
