import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import MediaFallbackInjector from "@/components/media-fallback-injector"
import { Suspense } from "react"
import "./globals.css"
import PageTheme from "@/components/page-theme"
import { LanguageProvider } from "@/contexts/language-context"
import ErrorBoundary from "@/components/error-boundary"
import { Toaster } from "@/components/ui/toaster"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "SIID  - Smart Innovation And  Infrastructure Design",
  description:
    "Transform your dreams into reality with AI-powered architectural design and seamless contractor connections",
  generator: "SIID ",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#1e3a8a" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0b1220" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SIID" />
      </head>
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable} overflow-x-hidden`}>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <LanguageProvider>
              <PageTheme />
              <MediaFallbackInjector />
              {children}
              <Toaster />
            </LanguageProvider>
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
}
