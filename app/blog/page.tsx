import Link from "next/link"
import { ArrowLeft, Calendar, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import OptimizedImage from "@/components/optimized-image"
import BlogListClient from "@/components/blog-list-client"

export const metadata = {
  title: "SIID Blog",
  description: "Insights, tips, and stories about design, construction, and building your dreams",
}

export default function BlogPage() {
  const posts = [
    {
      title: "10 Tips for Planning Your Dream Home",
      excerpt: "Essential considerations before starting your home design project, from budget to lifestyle needs.",
      author: "Sarah Johnson",
      date: "Jan 15, 2025",
      category: "Design Tips",
      image: "/images/modern-villa-project.jpg",
    },
    {
      title: "How AI is Revolutionizing Architectural Design",
      excerpt: "Explore how artificial intelligence is transforming the way we approach building design and planning.",
      author: "Michael Chen",
      date: "Jan 10, 2025",
      category: "Technology",
      image: "/images/ai-floor-plan-generation-architectural.jpg",
    },
    {
      title: "Choosing the Right Contractor: A Complete Guide",
      excerpt: "Learn how to evaluate and select the perfect contractor for your construction project.",
      author: "Priya Sharma",
      date: "Jan 5, 2025",
      category: "Contractors",
      image: "/images/building-foundation-concrete-construction.jpg",
    },
    {
      title: "Sustainable Building Materials for 2025",
      excerpt: "Discover eco-friendly materials that are both beautiful and environmentally responsible.",
      author: "David Kumar",
      date: "Dec 28, 2024",
      category: "Sustainability",
      image: "/images/eco-friendly-design.jpg",
    },
    {
      title: "Budget Estimation: What You Need to Know",
      excerpt: "Understanding construction costs and how to create a realistic budget for your project.",
      author: "Lisa Anderson",
      date: "Dec 20, 2024",
      category: "Finance",
      image: "/images/building-permit-approval-documents.jpg",
    },
    {
      title: "Smart Home Integration in Modern Design",
      excerpt: "How to incorporate smart technology seamlessly into your home design from the start.",
      author: "Raj Patel",
      date: "Dec 15, 2024",
      category: "Technology",
      image: "/images/interior-design-3d-walkthrough.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <OptimizedImage
              src="/images/siid-flash-logo.png"
              alt="SIID Logo"
              className="h-12 w-auto object-contain"
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">SIID Blog</h1>
            <p className="text-xl text-muted-foreground">
              Insights, tips, and stories about design, construction, and building your dreams
            </p>
          </div>

          <BlogListClient posts={posts} />
        </div>
      </main>
    </div>
  )
}
