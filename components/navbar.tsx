"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { BrandLogo } from "@/components/brand-logo"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Track scroll position for subtle animation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <BrandLogo className="h-14 w-auto object-contain transition-transform duration-300 hover:scale-105" />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className={`text-sm font-medium transition-all hover:-translate-y-0.5 ${isScrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/90 hover:text-white drop-shadow-sm'}`}>
            Features
          </Link>
          <Link href="/#vision" className={`text-sm font-medium transition-all hover:-translate-y-0.5 ${isScrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/90 hover:text-white drop-shadow-sm'}`}>
            Vision
          </Link>
          <Link href="/#how-it-works" className={`text-sm font-medium transition-all hover:-translate-y-0.5 ${isScrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/90 hover:text-white drop-shadow-sm'}`}>
            How It Works
          </Link>
          <Link href="/contact" className={`text-sm font-medium transition-all hover:-translate-y-0.5 ${isScrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/90 hover:text-white drop-shadow-sm'}`}>
            Contact
          </Link>
          <div className={`w-px h-4 mx-2 ${isScrolled ? 'bg-border' : 'bg-white/30'}`}></div>
          <Link href="/3d-generator" className={`text-sm font-semibold hover:-translate-y-0.5 transition-all relative group ${isScrolled ? 'text-accent hover:text-accent-dark' : 'text-white hover:text-white drop-shadow-md'}`}>
            3D Generator
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full ${isScrolled ? 'bg-accent' : 'bg-white'}`}></span>
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <div className={isScrolled ? "" : "opacity-90 grayscale brightness-200 contrast-200"}>
            <LanguageSelector />
          </div>
          <Link href="/login">
            <Button variant="ghost" size="sm" className={`font-medium transition-colors ${isScrolled ? 'hover:bg-muted/50' : 'text-white hover:bg-white/20 hover:text-white'}`}>
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-accent hover:bg-accent-dark text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-3">
          <LanguageSelector />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-foreground"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border shadow-lg transition-all duration-300 ease-in-out origin-top overflow-hidden ${
          mobileMenuOpen ? "opacity-100 max-h-96 py-4" : "opacity-0 max-h-0 py-0 border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          <Link
            href="/#features"
            className="block text-sm font-medium text-muted-foreground hover:text-foreground hover:pl-2 transition-all py-1.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            href="/#vision"
            className="block text-sm font-medium text-muted-foreground hover:text-foreground hover:pl-2 transition-all py-1.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Vision
          </Link>
          <Link
            href="/#how-it-works"
            className="block text-sm font-medium text-muted-foreground hover:text-foreground hover:pl-2 transition-all py-1.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="/contact"
            className="block text-sm font-medium text-muted-foreground hover:text-foreground hover:pl-2 transition-all py-1.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <div className="w-full h-px bg-border my-2"></div>
          <Link
            href="/3d-generator"
            className="block text-sm font-semibold text-accent hover:text-accent-dark hover:pl-2 transition-all py-1.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            3D Generator
          </Link>
          <div className="flex items-center gap-3 pt-4 pb-2">
            <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">
                Login
              </Button>
            </Link>
            <Link href="/signup" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-accent hover:bg-accent-dark text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
