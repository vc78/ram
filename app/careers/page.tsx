import Link from "next/link"
import { ArrowLeft, Briefcase, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function CareersPage() {
  const openings = [
    {
      title: "Senior Full Stack Engineer",
      department: "Engineering",
      location: "Bangalore, India",
      type: "Full-time",
      description: "Build the future of architectural design with cutting-edge AI and web technologies.",
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Create beautiful, intuitive experiences that empower users to design their dreams.",
    },
    {
      title: "AI/ML Engineer",
      department: "Engineering",
      location: "Bangalore, India",
      type: "Full-time",
      description: "Develop and improve our AI-powered design generation algorithms.",
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Mumbai, India",
      type: "Full-time",
      description: "Help our customers succeed and build lasting relationships.",
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
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Help us build the future of architectural design and empower millions to turn their dreams into reality.
            </p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Why Work at SIID?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Impactful Work</h3>
                <p className="text-sm text-muted-foreground">
                  Build products that directly impact people's lives and help them create their dream spaces.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Growth & Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Work with cutting-edge AI technology and learn from experienced professionals.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Great Culture</h3>
                <p className="text-sm text-muted-foreground">
                  Collaborative environment with flexible work arrangements and competitive benefits.
                </p>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8">Open Positions</h2>
            <div className="space-y-4">
              {openings.map((job, index) => (
                <Card key={index} className="p-6 hover-lift cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </div>
                      </div>
                    </div>
                    <Button className="bg-accent hover:bg-accent-dark text-white">Apply Now</Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <div className="mt-16 text-center bg-muted rounded-lg p-12">
            <h2 className="text-2xl font-bold mb-4">Don't See a Perfect Fit?</h2>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented people. Send us your resume and we'll keep you in mind for future
              opportunities.
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent-dark text-white">
              Send Your Resume
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
