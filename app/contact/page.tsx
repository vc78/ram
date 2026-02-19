"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, MapPin, Send, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleVisitUs = () => {
    if (!navigator.geolocation) {
      window.open("https://maps.google.com", "_blank")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, "_blank")
      },
      () => window.open("https://maps.google.com", "_blank"),
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get("name") || "")
    const email = String(formData.get("email") || "")
    const subject = String(formData.get("subject") || "")
    const message = String(formData.get("message") || "")

    await new Promise((resolve) => setTimeout(resolve, 1200))

    // WhatsApp share to owner number
    const waText = encodeURIComponent(
      `New website inquiry:\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    )
    window.open(`https://wa.me/9032306961?text=${waText}`, "_blank")

    toast({ title: "Message Sent!", description: "We shared your message via WhatsApp." })
    setLoading(false)
    form.reset()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/siid-flash-logo.png"
              alt="SIID FLASH Logo"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement
                if (!img.dataset.fallbackShown) {
                  img.dataset.fallbackShown = "true"
                  img.style.display = "none"
                }
              }}
            />
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center">
              {/* Email */}
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-sm text-muted-foreground mb-2">Our team is here to help</p>
              <a href="mailto:venkatbodduluri78@gmail.com" className="text-primary hover:underline text-sm">
                venkatbodduluri78@gmail.com
              </a>
            </Card>

            <Card className="p-6 text-center">
              {/* Phone */}
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-sm text-muted-foreground mb-2">Mon-Fri from 9am to 6pm</p>
              <a href="tel:+919032306961" className="text-primary hover:underline text-sm">
                +91 90323 06961
              </a>
            </Card>

            <Card className="p-6 text-center">
              {/* Visit Us */}
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Visit Us</h3>
              <p className="text-sm text-muted-foreground mb-3">Open your current location in Maps</p>
              <button
                onClick={handleVisitUs}
                className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
              >
                <Navigation className="w-4 h-4" />
                Open in Maps
              </button>
            </Card>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input id="name" name="name" required placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input id="email" name="email" type="email" required placeholder="your@email.com" />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <Input id="subject" name="subject" required placeholder="How can we help?" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-accent hover:bg-accent-dark text-white"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
                <Send className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
