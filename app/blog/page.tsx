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
      id: 1,
      title: "10 Tips for Planning Your Dream Home",
      excerpt: "Essential considerations before starting your home design project, from budget to lifestyle needs.",
      author: "Sarah Johnson",
      date: "Jan 15, 2025",
      category: "Design Tips",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
      readingTime: "5 min",
      featured: true,
    },
    {
      id: 2,
      title: "Neural Architecture: How AI is Reshaping Spaces",
      excerpt: "Beyond floor plans—how generative AI is creating hyper-personalized living environments that adapt to human emotion.",
      author: "Michael Chen",
      date: "Jan 10, 2025",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80",
      readingTime: "8 min",
    },
    {
      id: 3,
      title: "The Future of Smart Cities: 2025 and Beyond",
      excerpt: "How construction intelligence is paving the way for integrated, self-sustaining urban ecosystems.",
      author: "Priya Sharma",
      date: "Jan 5, 2025",
      category: "Sustainability",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80",
      readingTime: "12 min",
    },
    {
      id: 4,
      title: "Sustainable Building Materials for the Next Decade",
      excerpt: "From mushroom bricks to transparent wood—exploring the cutting-edge of eco-friendly construction.",
      author: "David Kumar",
      date: "Dec 28, 2024",
      category: "Sustainability",
      image: "https://images.unsplash.com/photo-1518005020250-68594b8152e0?auto=format&fit=crop&q=80",
      readingTime: "7 min",
    },
    {
      id: 5,
      title: "Zero-Carbon Concrete: The Holy Grail of Building",
      excerpt: "How structural engineers are finally solving the cement industry's massive carbon footprint.",
      author: "Lisa Anderson",
      date: "Dec 20, 2024",
      category: "Engineering",
      image: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80",
      readingTime: "10 min",
    },
    {
      id: 6,
      title: "Quantum Simulations in Structural Stress Testing",
      excerpt: "A deep dive into how quantum computing is making skyscrapers safer than ever before.",
      author: "Raj Patel",
      date: "Dec 15, 2024",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
      readingTime: "15 min",
    },
  ]

  const featuredPost = posts.find(p => p.featured) || posts[0]
  const otherPosts = posts.filter(p => p.id !== featuredPost.id)


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
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 text-primary bg-primary/5 uppercase tracking-widest text-[10px] font-black">
               The SIID Intelligence Journal
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Future of Living</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Where construction meets intelligence. Exploring the boundary between architectural art and neural engineering.
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-20">
             <Card className="overflow-hidden border-none shadow-2xl group cursor-pointer bg-slate-900 text-white rounded-[2.5rem]">
                <div className="grid lg:grid-cols-2">
                   <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
                      <img 
                        src={featuredPost.image} 
                        alt={featuredPost.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                   </div>
                   <div className="p-10 lg:p-16 flex flex-col justify-center space-y-6">
                      <Badge className="w-fit bg-primary text-primary-foreground font-black px-4 py-1 rounded-full uppercase tracking-wider text-[10px]">
                         {featuredPost.category}
                      </Badge>
                      <h2 className="text-4xl lg:text-5xl font-black leading-tight group-hover:text-primary transition-colors">
                         {featuredPost.title}
                      </h2>
                      <p className="text-lg text-slate-300 leading-relaxed">
                         {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-6 pt-6 border-t border-white/10">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs uppercase border border-white/20">
                               {featuredPost.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-sm font-bold">{featuredPost.author}</span>
                         </div>
                         <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Calendar className="w-4 h-4" />
                            {featuredPost.date}
                         </div>
                      </div>
                   </div>
                </div>
             </Card>
          </div>

          <BlogListClient posts={otherPosts} />

          {/* Newsletter Section */}
          <div className="mt-32 p-16 rounded-[3rem] bg-primary text-primary-foreground relative overflow-hidden shadow-3xl text-center">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
             <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
                <h3 className="text-4xl md:text-5xl font-black tracking-tight">Stay Ahead of the Curve</h3>
                <p className="text-lg opacity-80 leading-relaxed">
                   Join 5,000+ architects and homeowners receiving our weekly intelligence digest.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                   <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="flex-1 h-14 rounded-2xl px-6 bg-white/10 border border-white/20 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 text-white" 
                   />
                   <Button size="lg" className="h-14 px-8 rounded-2xl bg-white text-primary hover:bg-slate-100 font-black">
                      Subscribe Now
                   </Button>
                </div>
             </div>
          </div>
        </div>
      </main>

    </div>
  )
}
