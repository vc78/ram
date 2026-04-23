import Link from "next/link"
import { ArrowLeft, Target, Users, Lightbulb, Award, Zap, Shield, Cpu, Globe, Rocket, CheckCircle2, TrendingUp, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
            <Button variant="ghost" size="sm" className="font-bold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="pb-32">
        {/* HERO SECTION: THE NEURAL ORIGIN */}
        <div className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 border-primary/30 text-primary bg-primary/5 font-black uppercase tracking-[0.2em] text-[10px]">
               Beyond Traditional Construction
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
               Architecting the <br /> <span className="text-primary">Intelligence</span> Age
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
               We don't just build structures; we synthesize environments. SIID is a neural bridge between your vision and physical reality.
            </p>
          </div>
        </div>

        {/* ECOSYSTEM GRID: THE FOUR PILLARS */}
        <section className="container mx-auto px-4 mb-32">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  icon: <Cpu className="w-8 h-8" />, 
                  title: "Neural Estimation", 
                  desc: "Proprietary ML weights analyze local market fluctuations in real-time to provide ±3% cost accuracy.",
                  color: "bg-blue-500/10 text-blue-600"
                },
                { 
                  icon: <Globe className="w-8 h-8" />, 
                  title: "Geo-Vetted Network", 
                  desc: "A strictly curated ecosystem of the top 5% contractors in every region, verified by performance data.",
                  color: "bg-emerald-500/10 text-emerald-600"
                },
                { 
                  icon: <Zap className="w-8 h-8" />, 
                  title: "Vector Synthesis", 
                  desc: "Our layout engine generates architectural vectors that are compliant with both Vastu and building codes.",
                  color: "bg-amber-500/10 text-amber-600"
                },
                { 
                  icon: <Shield className="w-8 h-8" />, 
                  title: "Dossier Security", 
                  desc: "Hyper-encrypted project blueprints and legal manifests stored on the decentralized construction ledger.",
                  color: "bg-primary/10 text-primary"
                }
              ].map((pillar, i) => (
                <Card key={i} className="p-10 border-none shadow-xl hover:shadow-2xl transition-all duration-500 group rounded-[2.5rem] flex flex-col bg-card hover:-translate-y-2">
                   <div className={`p-4 rounded-2xl w-fit mb-8 ${pillar.color} shadow-inner`}>
                      {pillar.icon}
                   </div>
                   <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-primary transition-colors">{pillar.title}</h3>
                   <p className="text-muted-foreground leading-relaxed text-sm font-medium">
                      {pillar.desc}
                   </p>
                </Card>
              ))}
           </div>
        </section>

        {/* THE MISSION: GLASSMORPHIC BREAKOUT */}
        <section className="container mx-auto px-4 mb-32">
           <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[150px] -mr-48 -mt-48" />
              <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
                 <div className="space-y-8">
                    <div className="space-y-4">
                       <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">Decentralizing <br /> Design Dreams</h2>
                       <p className="text-slate-400 text-lg leading-relaxed">
                          The construction industry has been broken for decades. Opacity, middlemen, and inefficiency have made building dreams a nightmare. 
                       </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <h4 className="text-3xl font-black text-primary tracking-tighter">98%</h4>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Customer Trust Rate</p>
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-3xl font-black text-primary tracking-tighter">₹500Cr+</h4>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Projects Optimized</p>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-6">
                    {[
                      { icon: <CheckCircle2 className="w-5 h-5 text-primary" />, text: "Automated Blueprint Generation in < 60 Seconds" },
                      { icon: <CheckCircle2 className="w-5 h-5 text-primary" />, text: "Real-time Material Market Price Synchronization" },
                      { icon: <CheckCircle2 className="w-5 h-5 text-primary" />, text: "Proprietary Vastu Intelligence Integration" },
                      { icon: <CheckCircle2 className="w-5 h-5 text-primary" />, text: "Direct-to-Contractor Procurement Channels" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-default">
                         {item.icon}
                         <span className="text-sm font-bold text-slate-200">{item.text}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* REAL-TIME STATS: INTERACTIVE FEEL */}
        <section className="container mx-auto px-4 mb-32">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Neural Designs", value: "12,400+", icon: <Rocket className="w-5 h-5" /> },
                { label: "Active Cities", value: "48", icon: <Globe className="w-5 h-5" /> },
                { label: "Vetted Builders", value: "850+", icon: <Briefcase className="w-5 h-5" /> },
                { label: "Growth Rate", value: "215%", icon: <TrendingUp className="w-5 h-5" /> }
              ].map((stat, i) => (
                <div key={i} className="space-y-2 group cursor-default">
                   <div className="mx-auto p-3 bg-muted rounded-full w-fit group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                      {stat.icon}
                   </div>
                   <h4 className="text-3xl font-black tracking-tighter">{stat.value}</h4>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
           </div>
        </section>

        {/* THE FINAL PITCH: ACTION CTA */}
        <section className="container mx-auto px-4">
           <div className="bg-gradient-to-r from-primary to-primary/80 rounded-[3.5rem] p-16 md:p-24 text-center text-primary-foreground shadow-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
              <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                    Ready to build your <br /> future legacy?
                 </h2>
                 <p className="text-xl opacity-90 font-medium">
                    Stop guessing. Start architecting with the power of SIID Intelligence.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link href="/projects/create">
                       <Button size="lg" className="h-16 px-12 bg-white text-primary hover:bg-slate-100 font-black rounded-2xl text-lg shadow-xl shadow-white/10">
                          Launch New Project
                       </Button>
                    </Link>
                    <Link href="/contact">
                       <Button size="lg" variant="outline" className="h-16 px-12 border-white/30 text-white hover:bg-white/10 font-black rounded-2xl text-lg">
                          Expert Consultation
                       </Button>
                    </Link>
                 </div>
              </div>
           </div>
        </section>
      </main>
    </div>
  )
}
