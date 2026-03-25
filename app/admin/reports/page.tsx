"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function AdminReports() {
  const reports = [
    { id: "R-1024", title: "Quarterly Growth Analysis", type: "PDF", date: "2024-03-01", size: "4.2 MB", status: "Ready" },
    { id: "R-1025", title: "User Retention Matrix", type: "XLSX", date: "2024-02-28", size: "1.8 MB", status: "Processing" },
    { id: "R-1026", title: "Construction Compliance Audit", type: "PDF", date: "2024-02-25", size: "12.5 MB", status: "Ready" },
    { id: "R-1027", title: "AI Generation Error Logs", type: "JSON", date: "2024-02-20", size: "0.5 MB", status: "Error" },
  ]

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
           <h1 className="text-4xl font-extrabold text-white tracking-tight">System <span className="text-blue-500">Reports</span></h1>
           <p className="text-slate-400 text-lg">Archived intelligence and automated compliance documentation.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 shadow-lg shadow-blue-500/20">
           <Layers className="w-4 h-4 mr-2" /> Compile New Batch
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input 
              placeholder="Search by ID or report name..." 
              className="pl-12 bg-slate-900 border-slate-800 text-white h-14 rounded-2xl focus:ring-blue-500" 
            />
         </div>
         <Button variant="outline" className="h-14 border-slate-800 bg-slate-900/50 text-slate-300 rounded-2xl px-8">
            <Filter className="w-4 h-4 mr-2" /> Sector Filter
         </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead className="bg-slate-950/50 border-b border-slate-800">
                  <tr className="text-left">
                     <th className="py-6 px-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Descriptor</th>
                     <th className="py-6 px-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mime-Type</th>
                     <th className="py-6 px-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Archived</th>
                     <th className="py-6 px-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resolution</th>
                     <th className="py-6 px-8 text-right"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50">
                  {reports.map((r) => (
                    <tr key={r.id} className="group hover:bg-slate-800/10 transition-colors">
                       <td className="py-6 px-8">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-500">
                                <FileText className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{r.title}</p>
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{r.id}</p>
                             </div>
                          </div>
                       </td>
                       <td className="py-6 px-8">
                          <Badge variant="outline" className="border-slate-800 bg-slate-900 font-bold">{r.type}</Badge>
                       </td>
                       <td className="py-6 px-8">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                             <Calendar className="w-3 h-3" /> {r.date}
                          </div>
                       </td>
                       <td className="py-6 px-8">
                          <div className="flex items-center gap-2">
                             {r.status === 'Ready' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                             {r.status === 'Processing' && <Clock className="w-4 h-4 text-amber-500 animate-spin" />}
                             {r.status === 'Error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                             <span className="text-xs font-bold text-slate-300 uppercase">{r.status}</span>
                          </div>
                       </td>
                       <td className="py-6 px-8 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800"><Eye className="w-4 h-4" /></Button>
                             <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10"><Download className="w-4 h-4" /></Button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  )
}
