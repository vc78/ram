import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CookiesPage() {
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
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">What Are Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are placed on your device when you visit our website. They help us
              provide you with a better experience by remembering your preferences and understanding how you use our
              platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                <strong>Essential Cookies:</strong> Required for the platform to function properly (authentication,
                security)
              </li>
              <li>
                <strong>Performance Cookies:</strong> Help us understand how visitors interact with our platform
              </li>
              <li>
                <strong>Functionality Cookies:</strong> Remember your preferences and settings
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Collect information about how you use our platform to help us
                improve
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can control and manage cookies in your browser settings. Please note that removing or blocking cookies
              may impact your user experience and some features may no longer function properly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may use third-party services (such as analytics providers) that also set cookies. These third parties
              have their own privacy policies and cookie policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about our use of cookies, please contact us at{" "}
              <a href="mailto:privacy@siid.com" className="text-primary hover:underline">
                privacy@siid.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
