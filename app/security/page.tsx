import Link from "next/link"
import { ArrowLeft, Shield, Lock, Eye, Server, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function SecurityPage() {
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
          <div className="text-center mb-16">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Security at SIID</h1>
            <p className="text-xl text-muted-foreground">Your data security and privacy are our top priorities</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8">
              <Lock className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Data Encryption</h2>
              <p className="text-muted-foreground leading-relaxed">
                All data transmitted to and from SIID is encrypted using industry-standard TLS/SSL protocols. Your
                sensitive information is encrypted at rest using AES-256 encryption.
              </p>
            </Card>

            <Card className="p-8">
              <Server className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Secure Infrastructure</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our platform is hosted on enterprise-grade cloud infrastructure with 24/7 monitoring, automatic backups,
                and disaster recovery systems.
              </p>
            </Card>

            <Card className="p-8">
              <Eye className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Access Controls</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement strict access controls and authentication mechanisms. Only authorized personnel have access
                to systems, and all access is logged and monitored.
              </p>
            </Card>

            <Card className="p-8">
              <CheckCircle className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Compliance</h2>
              <p className="text-muted-foreground leading-relaxed">
                SIID complies with industry standards and regulations including GDPR, SOC 2, and ISO 27001 for data
                protection and security management.
              </p>
            </Card>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Our Security Practices</h2>
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Regular Security Audits</h3>
                <p className="text-sm text-muted-foreground">
                  We conduct regular third-party security audits and penetration testing to identify and address
                  vulnerabilities.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Employee Training</h3>
                <p className="text-sm text-muted-foreground">
                  All team members undergo comprehensive security training and follow strict security protocols.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Incident Response</h3>
                <p className="text-sm text-muted-foreground">
                  We have a dedicated incident response team and procedures to quickly address any security concerns.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Data Minimization</h3>
                <p className="text-sm text-muted-foreground">
                  We only collect and retain data that is necessary for providing our services, and securely delete data
                  when no longer needed.
                </p>
              </Card>
            </div>
          </section>

          <div className="text-center bg-muted rounded-lg p-12">
            <h2 className="text-2xl font-bold mb-4">Report a Security Issue</h2>
            <p className="text-muted-foreground mb-6">
              If you discover a security vulnerability, please report it to us immediately
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent-dark text-white">
              <a href="mailto:security@siid.com">Contact Security Team</a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
