"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { 
  Settings, 
  Shield, 
  Lock, 
  Database, 
  Globe, 
  Bell, 
  Zap, 
  Cpu,
  Save,
  RefreshCw,
  HardDrive
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function AdminSettings() {
  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
           <h1 className="text-4xl font-extrabold text-white tracking-tight">Terminal <span className="text-blue-500">Settings</span></h1>
           <p className="text-slate-400 text-lg">Configure system-level parameters and security overrides.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="border-slate-800 bg-slate-900 shadow-xl text-slate-300">
             <RefreshCw className="w-4 h-4 mr-2" /> Reset Defaults
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 shadow-lg shadow-blue-500/20">
             <Save className="w-4 h-4 mr-2" /> Save Config
           </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
         <Card className="bg-slate-900 border-slate-800 overflow-hidden group">
            <CardHeader className="bg-slate-950/50 border-b border-slate-800 p-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                     <Shield className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol 04</p>
                     <CardTitle className="text-xl font-bold text-white uppercase tracking-tight">Security & Auth</CardTitle>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
               <div className="flex justify-between items-center group/item p-4 bg-slate-950/50 rounded-2xl border border-transparent hover:border-slate-800 transition-all">
                  <div className="space-y-1">
                     <Label className="text-sm font-bold text-slate-200">2FA Enforcement</Label>
                     <p className="text-xs text-slate-500">Require multi-factor for all admin accounts</p>
                  </div>
                  <Switch defaultChecked />
               </div>
               <div className="flex justify-between items-center group/item p-4 bg-slate-950/50 rounded-2xl border border-transparent hover:border-slate-800 transition-all">
                  <div className="space-y-1">
                     <Label className="text-sm font-bold text-slate-200">API Key Rotation</Label>
                     <p className="text-xs text-slate-500">Auto-rotate neural engine keys every 30 days</p>
                  </div>
                  <Switch defaultChecked />
               </div>
            </CardContent>
         </Card>

         <Card className="bg-slate-900 border-slate-800 overflow-hidden group">
            <CardHeader className="bg-slate-950/50 border-b border-slate-800 p-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-500">
                     <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Engine v4</p>
                     <CardTitle className="text-xl font-bold text-white uppercase tracking-tight">Neural Core</CardTitle>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
               <div className="space-y-4">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inference Threshold</Label>
                  <div className="flex gap-4">
                     <Input className="bg-slate-950 border-slate-800 h-12 rounded-xl text-white font-mono" defaultValue="0.85" />
                     <Button variant="outline" className="h-12 border-slate-800 bg-slate-950 text-slate-400">Calibrate</Button>
                  </div>
               </div>
               <div className="flex justify-between items-center group/item p-4 bg-slate-950/50 rounded-2xl border border-transparent hover:border-slate-800 transition-all">
                  <div className="space-y-1">
                     <Label className="text-sm font-bold text-slate-200">GPU Accelerated Synthesis</Label>
                     <p className="text-xs text-slate-500">Use distributed cluster for 3D generation</p>
                  </div>
                  <Switch defaultChecked />
               </div>
            </CardContent>
         </Card>

         <Card className="bg-slate-900 border-slate-800 p-8 flex items-center justify-between lg:col-span-2">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-3xl bg-amber-600/10 flex items-center justify-center text-amber-500">
                  <HardDrive className="w-8 h-8" />
               </div>
               <div>
                  <h4 className="text-xl font-bold text-white uppercase tracking-tight">Instance Storage</h4>
                  <p className="text-sm text-slate-500 font-medium tracking-tight">842 GB of 1.2 TB utilized across global nodes.</p>
               </div>
            </div>
            <Button className="bg-slate-950 border border-amber-600/30 text-amber-500 hover:bg-amber-600/10 px-8 h-12 rounded-xl font-bold uppercase tracking-widest">Wipe Cache</Button>
         </Card>
      </div>
    </div>
  )
}
