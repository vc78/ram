import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto prose prose-slate">
          <h1 className="text-4xl font-bold mb-4">Accessibility Statement</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
            <p className="text-muted-foreground leading-relaxed">
              SIID is committed to ensuring digital accessibility for people with disabilities. We are continually
              improving the user experience for everyone and applying the relevant accessibility standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Conformance Status</h2>
            <p className="text-muted-foreground leading-relaxed">
              We aim to conform to WCAG 2.1 Level AA standards. These guidelines explain how to make web content more
              accessible for people with disabilities and user-friendly for everyone.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Accessibility Features</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Keyboard navigation support</li>
              <li>Screen reader compatibility</li>
              <li>Alternative text for images</li>
              <li>Clear and consistent navigation</li>
              <li>Sufficient color contrast</li>
              <li>Resizable text without loss of functionality</li>
              <li>Focus indicators for interactive elements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Feedback</h2>
            <p className="text-muted-foreground leading-relaxed">
              We welcome your feedback on the accessibility of SIID. Please let us know if you encounter accessibility
              barriers by contacting us at{" "}
              <a href="venkatbodduluri78@gmail.com" className="text-primary hover:underline">
                venkatbodduluri78@gmail.com
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Technical Specifications</h2>
            <p className="text-muted-foreground leading-relaxed">
              Accessibility of SIID relies on the following technologies to work with the particular combination of web
              browser and any assistive technologies or plugins installed on your computer: HTML, WAI-ARIA, CSS, and
              JavaScript.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
