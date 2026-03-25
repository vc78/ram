"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Calculator, 
  ArrowLeft, 
  Download, 
  History, 
  TrendingUp, 
  AlertCircle,
  Construction,
  Layers,
  Zap,
  Droplets
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { AuthGuard } from "@/components/auth-guard"

export default function MaterialCalculatorPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const materials = [
    { name: "Concrete", amount: "450 m³", cost: "₹2.2M", progress: 65, icon: Construction, color: "text-blue-500" },
    { name: "Steel Rebar", amount: "65 Tons", cost: "₹4.1M", progress: 40, icon: Layers, color: "text-slate-500" },
    { name: "Bricks", amount: "125,000", cost: "₹1.5M", progress: 85, icon: Grid3x3, color: "text-orange-500" },
    { name: "Electrical", amount: "2.4 km", cost: "₹0.8M", progress: 10, icon: Zap, color: "text-yellow-500" },
    { name: "Plumbing", amount: "1.8 km", cost: "₹0.6M", progress: 5, icon: Droplets, color: "text-cyan-500" }
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Calculator className="w-8 h-8 text-blue-500" />
                  Material Intelligence
                </h1>
                <p className="text-slate-400">AI-powered estimation and procurement tracking</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-900">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </header>

          <div className="grid md:grid-cols-3 gap-6">
             <Card className="bg-slate-900 border-slate-800 p-6">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Total Estimate</p>
                   <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-4xl font-bold text-white">₹9.2M<span className="text-sm font-normal text-slate-500 ml-2">± 2%</span></p>
             </Card>
             <Card className="bg-slate-900 border-slate-800 p-6">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Market Drift</p>
                   <AlertCircle className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-4xl font-bold text-white">+4.2%<span className="text-sm font-normal text-slate-500 ml-2">last 30d</span></p>
             </Card>
             <Card className="bg-slate-900 border-slate-800 p-6">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Optimization</p>
                   <Zap className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-4xl font-bold text-white">12.5%<span className="text-sm font-normal text-slate-500 ml-2">savings</span></p>
             </Card>
          </div>

          <Card className="bg-slate-900 border-slate-800">
             <CardHeader className="border-b border-slate-800">
                <CardTitle className="text-lg font-semibold text-white">Quantum Inventory Analysis</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                {materials.map((m, i) => (
                  <div key={i} className="flex items-center p-6 border-b border-slate-800 last:border-0 hover:bg-slate-800/30 transition-colors">
                     <div className={`w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center mr-6 ${m.color}`}>
                        <m.icon className="w-6 h-6" />
                     </div>
                     <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center">
                           <h3 className="font-bold text-white uppercase tracking-tight">{m.name}</h3>
                           <span className="text-sm font-mono text-slate-400">{m.amount} | {m.cost}</span>
                        </div>
                        <Progress value={m.progress} className="h-2 bg-slate-950" />
                     </div>
                  </div>
                ))}
             </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}

function Grid3x3(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  )
}
