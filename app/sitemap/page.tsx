import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function SitemapPage() {
  const sections = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Platform",
      links: [
        { name: "Login", href: "/login" },
        { name: "Sign Up", href: "/signup" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "New Project", href: "/dashboard/new-project" },
        { name: "Contractors", href: "/dashboard/contractors" },
        { name: "Careers", href: "/dashboard/careers" }, // rename Recruitment to Careers and update link</CHANGE>
        { name: "Settings", href: "/dashboard/settings" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Security", href: "/security" },
        { name: "Accessibility", href: "/accessibility" },
        { name: "Cookie Policy", href: "/cookies" },
      ],
    },
  ]

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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sitemap</h1>
          <p className="text-xl text-muted-foreground mb-12">Navigate through all pages on SIID</p>

          <div className="grid md:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <Card key={index} className="p-6">
                <h2 className="text-xl font-bold mb-4">{section.title}</h2>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
