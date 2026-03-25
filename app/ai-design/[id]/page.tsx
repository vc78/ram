"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  ArrowLeft, 
  Download, 
  Share2, 
  Layout, 
  Maximize2,
  Image as ImageIcon,
  Palette,
  Compass,
  Zap
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"

export default function AIDesignPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", label: "All Designs" },
    { id: "modern", label: "Modern Minimal" },
    { id: "classic", label: "Classis Heritage" },
    { id: "industrial", label: "Industrial Loft" }
  ]

  const designs = [
    { id: 1, title: "Skyline Villa Concept", category: "modern", image: "/images/ai-design-1.jpg", prompt: "Minimalist concrete villa with infinity pool" },
    { id: 2, title: "Heritage Court", category: "classic", image: "/images/ai-design-2.jpg", prompt: "Indian courtyard style with modern amenities" },
    { id: 3, title: "The Brick Box", category: "industrial", image: "/images/ai-design-3.jpg", prompt: "Exposed brick industrial home design" }
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <div className="container mx-auto py-12 px-6 space-y-12">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-12">
            <div className="space-y-4">
               <Button 
                 variant="ghost" 
                 onClick={() => router.back()}
                 className="text-slate-400 hover:text-white -ml-4"
               >
                 <ArrowLeft className="w-5 h-5 mr-2" />
                 Return to Terminal
               </Button>
               <h1 className="text-5xl font-bold text-white flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-blue-500/20">
                   <Sparkles className="w-8 h-8 text-white" />
                 </div>
                 Neural Architect <span className="text-blue-500">v4</span>
               </h1>
               <p className="text-slate-400 max-w-2xl text-lg">AI-synthesized architectural visions based on your project parameters. Precision-matched to local building codes.</p>
            </div>
            <div className="flex gap-4">
               <Button variant="outline" className="border-slate-800 bg-slate-900/50 hover:bg-slate-900">
                 <Share2 className="w-4 h-4 mr-2" /> Share
               </Button>
               <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8">
                 <Download className="w-4 h-4 mr-2" /> Export Bundle
               </Button>
            </div>
          </header>

          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className={selectedCategory === cat.id ? "bg-blue-600 text-white" : "border-slate-800 text-slate-400 hover:text-white"}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {designs.map((design) => (
              <Card key={design.id} className="group overflow-hidden bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all duration-500">
                <div className="aspect-[4/5] relative overflow-hidden">
                   <img 
                     src={design.image || "/images/modern-villa-project.jpg"} 
                     alt={design.title}
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                   <div className="absolute top-4 right-4 flex gap-2">
                      <Badge className="bg-blue-600/80 backdrop-blur-md uppercase tracking-widest text-[10px] py-1 border-0">AI GEN</Badge>
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40 backdrop-blur-[2px]">
                      <Button className="bg-white text-slate-950 hover:bg-white/90">
                         <Maximize2 className="w-4 h-4 mr-2" /> View Details
                      </Button>
                   </div>
                </div>
                <CardContent className="p-6 space-y-4">
                   <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{design.title}</h3>
                   <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      <span className="flex items-center gap-1"><Palette className="w-3 h-3" /> Materials</span>
                      <span className="flex items-center gap-1"><Compass className="w-3 h-3" /> Orientation</span>
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Energy</span>
                   </div>
                   <p className="text-sm text-slate-400 italic">"Prompt: {design.prompt}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
