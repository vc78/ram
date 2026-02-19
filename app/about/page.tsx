import Link from "next/link"
import { ArrowLeft, Target, Users, Lightbulb, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import OptimizedImage from "@/components/optimized-image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <OptimizedImage
              src="/images/siid-flash-logo.png"
              alt="SIID FLASH Logo"
              className="h-12 w-auto object-contain"
              fallback="/images/modern-minimalist-design.jpg"
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">About SIID FLASH</h1>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            We're on a mission to democratize architectural design and make building dreams accessible to everyone.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To transform the way people design and build by providing intelligent, accessible tools that connect
                dreamers with makers, eliminating complexity and reducing costs.
              </p>
            </Card>

            <Card className="p-8">
              <Lightbulb className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                A world where anyone can design their dream space with confidence, connect directly with trusted
                professionals, and watch their vision come to life seamlessly.
              </p>
            </Card>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                SIID FLASH was born from a simple observation: building or renovating a space shouldn't be so
                complicated. Traditional processes involve countless middlemen, unclear pricing, and designs that don't
                match your vision.
              </p>
              <p>
                We set out to change that by combining cutting-edge AI technology with direct contractor connections,
                creating a platform where your ideas transform into detailed plans instantly, and you connect with the
                right professionals to bring them to life.
              </p>
              <p>
                Today, we're proud to serve thousands of homeowners, businesses, and developers who trust SIID FLASH to
                turn their dreams into reality.
              </p>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <Users className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  Clear pricing, direct communication, and honest relationships at every step.
                </p>
              </Card>
              <Card className="p-6">
                <Award className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Quality</h3>
                <p className="text-sm text-muted-foreground">
                  We never compromise on the quality of our designs or our contractor network.
                </p>
              </Card>
              <Card className="p-6">
                <Lightbulb className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  Constantly pushing boundaries with AI and technology to serve you better.
                </p>
              </Card>
            </div>
          </section>

          <div className="text-center bg-muted rounded-lg p-12">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of satisfied customers who built with SIID FLASH
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-accent hover:bg-accent-dark text-white">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
