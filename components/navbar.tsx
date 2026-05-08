"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { BrandLogo } from "@/components/brand-logo"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse user", e)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    window.location.href = "/"
  }

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm py-2 md:py-3"
        : "bg-transparent py-3 md:py-4"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
          <div className="h-8 sm:h-10 md:h-12 w-auto">
            <BrandLogo
              className="h-full w-auto transition-transform duration-300 hover:scale-105"
              width="100"
              height="32"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
          <Link href="/#features" className={`text-xs md:text-sm font-medium transition-all hover:-translate-y-0.5 ${isScrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/90 hover:text-white drop-shadow-sm'}`}>
            Features
          </Link>
          <Link href="/#vision" className={`text-xs md:text-sm font-medium transition-all hover:-translate-y-0.5 ${isScrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/90 hover:text-white drop-shadow-sm'}`}>
            Vision
          </Link>
          <Link href="/#how-it-works" className={`text-xs md:text-sm font-medium transition-all hover:-translate-y-0.5 ${isScrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/90 hover:text-white drop-shadow-sm'}`}>
            How It Works
          </Link>
          <Link href="/contact" className={`text-xs md:text-sm font-medium transition-all hover:-translate-y-0.5 ${isScrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/90 hover:text-white drop-shadow-sm'}`}>
            Contact
          </Link>
          <div className={`w-px h-4 mx-2 ${isScrolled ? 'bg-border' : 'bg-white/30'}`}></div>
          <Link href="/3d-generator" className={`text-xs md:text-sm font-semibold hover:-translate-y-0.5 transition-all relative group ${isScrolled ? 'text-accent hover:text-accent-dark' : 'text-white hover:text-white drop-shadow-md'}`}>
            3D Generator
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full ${isScrolled ? 'bg-accent' : 'bg-white'}`}></span>
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3 md:gap-4">
          <div className={isScrolled ? "" : "opacity-90 grayscale brightness-200 contrast-200"}>
            <LanguageSelector />
          </div>
          {user ? (
            <div className="flex items-center gap-2 md:gap-3">
              <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}>
                <Button variant="ghost" size="sm" className={`text-xs md:text-sm font-medium ${isScrolled ? 'hover:bg-muted/50' : 'text-white hover:bg-white/20'}`}>
                  {user.name.split(' ')[0]}'s Portal
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                size="sm"
                className="text-xs md:text-sm bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border border-destructive/20 transition-all"
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className={`text-xs md:text-sm font-medium transition-colors ${isScrolled ? 'hover:bg-muted/50' : 'text-white hover:bg-white/20 hover:text-white'}`}>
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="text-xs md:text-sm bg-accent hover:bg-accent-dark text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Tablet/Mobile Actions */}
        <div className="lg:hidden flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-foreground h-10 w-10 sm:h-11 sm:w-11 hover:bg-muted/50"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[64px] sm:top-[72px] bg-black/50 lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Dropdown */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-md border-b border-border shadow-lg transition-all duration-300 ease-in-out origin-top overflow-hidden z-40 ${mobileMenuOpen ? "opacity-100 max-h-[calc(100vh-72px)] py-4 sm:py-6" : "opacity-0 max-h-0 py-0 border-transparent pointer-events-none"
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex flex-col space-y-3 sm:space-y-4">
          {/* Mobile Navigation Links */}
          <nav className="flex flex-col space-y-3 sm:space-y-4">
            <Link
              href="/#features"
              className="block text-sm sm:text-base font-medium text-muted-foreground hover:text-foreground hover:pl-2 transition-all py-2 sm:py-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/#vision"
              className="block text-sm sm:text-base font-medium text-muted-foreground hover:text-foreground hover:pl-2 transition-all py-2 sm:py-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              Vision
            </Link>
            {user && (
              <Link
                href={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="block text-sm sm:text-base font-medium text-primary hover:pl-2 transition-all py-2 sm:py-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Dashboard
              </Link>
            )}
            <Link
              href="/#how-it-works"
              className="block text-sm sm:text-base font-medium text-muted-foreground hover:text-foreground hover:pl-2 transition-all py-2 sm:py-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/contact"
              className="block text-sm sm:text-base font-medium text-muted-foreground hover:text-foreground hover:pl-2 transition-all py-2 sm:py-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/3d-generator"
              className="block text-sm sm:text-base font-semibold text-accent hover:text-accent-dark hover:pl-2 transition-all py-2 sm:py-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              3D Generator
            </Link>
          </nav>

          {/* Divider */}
          <div className="w-full h-px bg-border my-2 sm:my-4"></div>

          {/* Mobile Authentication Buttons */}
          <div className="flex flex-col gap-3 sm:gap-4 pt-2 sm:pt-4 pb-2 sm:pb-4">
            {user ? (
              <Button
                onClick={handleLogout}
                className="w-full bg-destructive text-white text-sm sm:text-base h-10 sm:h-12"
              >
                Logout
              </Button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full text-sm sm:text-base h-10 sm:h-12">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button className="w-full bg-accent hover:bg-accent-dark text-white text-sm sm:text-base h-10 sm:h-12">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Language Selector - shown on small screens */}
          <div className="sm:hidden pt-2 border-t border-border">
            <span className="text-xs font-semibold text-muted-foreground block mb-2">Language</span>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  )
}
