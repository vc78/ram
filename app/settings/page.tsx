"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Zap, 
  Database, 
  HardDrive, 
  Lock, 
  Key, 
  MessageSquare,
  Activity,
  Globe,
  Truck,
  Building2,
  Construction,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  LayoutDashboard
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"
import { AuthGuard } from "@/components/auth-guard"

export default function ProfessionalSettings() {
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
  }, [])

  const handleSave = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings Saved",
        description: "Your professional profile and system configs have been updated.",
      })
    }, 1200)
  }

  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Site Monitor Edge', key: 'pk_live_******************8932', status: 'active' },
    { id: '2', name: 'BIM Integration Node', key: 'pk_live_******************4421', status: 'revoked' }
  ])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b1220] p-4 md:p-10">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
              >
                Control <span className="text-primary italic">Tower</span>
              </motion.h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Manage your profile, industrial integrations, and infrastructure security.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm" onClick={() => window.location.reload()}>
                <RotateCcw className="w-4 h-4 mr-2" /> Reset
              </Button>
              <Button onClick={handleSave} className="h-11 bg-primary hover:bg-primary/90 text-white px-8 shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
              </Button>
            </div>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-slate-100 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-5 gap-1 h-auto overflow-x-auto">
              <TabsTrigger value="profile" className="rounded-xl py-3 px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all flex items-center gap-2">
                <User className="w-4 h-4" /> Profile
              </TabsTrigger>
              <TabsTrigger value="industrial" className="rounded-xl py-3 px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all flex items-center gap-2">
                <Construction className="w-4 h-4" /> Industrial
              </TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-xl py-3 px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all flex items-center gap-2">
                <Bell className="w-4 h-4" /> Alerts
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-xl py-3 px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all flex items-center gap-2">
                <Shield className="w-4 h-4" /> Security
              </TabsTrigger>
              <TabsTrigger value="audit" className="rounded-xl py-3 px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all flex items-center gap-2">
                <Activity className="w-4 h-4" /> Audit
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="md:col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                  <CardHeader className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 p-8">
                    <CardTitle className="text-xl font-bold flex items-center gap-3 italic">
                      <Settings className="w-5 h-5 text-primary" /> General Identity
                    </CardTitle>
                    <CardDescription>Primary account details and display preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Full Regulatory Name</Label>
                        <Input defaultValue={user?.name || "B VENKAT CHOWDARY"} className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Infrastructure Title</Label>
                        <Input defaultValue="Lead Structural Compliance Architect" className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Registered Email</Label>
                      <Input defaultValue={user?.email || "architect@chowdary.id"} className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Professional Bio</Label>
                      <textarea className="w-full min-h-[120px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Experience in smart urban design and sustainable materials..." />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm h-fit">
                   <div className="p-8 flex flex-col items-center text-center space-y-4">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || " Chowdary"}`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">{user?.name || "B Venkat Chowdary"}</h4>
                        <p className="text-sm text-slate-500 font-medium">Verified Professional</p>
                      </div>
                      <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-2" />
                      <div className="grid grid-cols-2 w-full gap-4">
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Projects</p>
                          <p className="text-lg font-bold">42</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Score</p>
                          <p className="text-lg font-bold">98%</p>
                        </div>
                      </div>
                   </div>
                </Card>
              </div>
            </TabsContent>

            {/* Industrial Tab */}
            <TabsContent value="industrial">
              <div className="grid md:grid-cols-2 gap-8">
                 <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                   <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800">
                      <CardTitle className="text-xl font-bold flex items-center gap-3 uppercase tracking-tighter">
                         <Brick className="w-5 h-5 text-amber-500" /> Standard Engineering Units
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="p-8 space-y-6">
                      <div className="flex justify-between items-center group/item p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all">
                        <div className="space-y-1">
                          <Label className="font-bold">Metric Protocol (SI)</Label>
                          <p className="text-xs text-slate-500">Enable meters, kilograms, and Celsius as default</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center group/item p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all">
                        <div className="space-y-1">
                          <Label className="font-bold">ASTM Standards Alignment</Label>
                          <p className="text-xs text-slate-500">Auto-align material grades with US building codes</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Default Material Grade</Label>
                        <select className="w-full h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm">
                          <option>M30 High Strength Concrete</option>
                          <option>M40 Industrial Grade</option>
                          <option>Fe550 High Strength Steel</option>
                        </select>
                      </div>
                   </CardContent>
                 </Card>

                 <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                   <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800">
                      <CardTitle className="text-xl font-bold flex items-center gap-3 uppercase tracking-tighter">
                         <Building2 className="w-5 h-5 text-blue-500" /> BIM Integration Node
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="p-8 space-y-6">
                      <div className="p-6 bg-blue-600/5 border border-blue-600/20 rounded-2xl space-y-4">
                        <div className="flex items-center gap-3">
                           <Globe className="w-6 h-6 text-blue-500 animate-pulse" />
                           <h4 className="font-bold text-blue-600 dark:text-blue-400">Live External Sync</h4>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Connected to AutoCAD Web API & Revit Cloud Nodes. Last sync: 4 minutes ago.</p>
                        <Button variant="secondary" className="w-full bg-blue-600 text-white hover:bg-blue-500">Force Re-index BIM</Button>
                      </div>
                      <div className="flex justify-between items-center group/item p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl">
                        <div className="space-y-1">
                          <Label className="font-bold">IoT Sensor Overlay</Label>
                          <p className="text-xs text-slate-500">Render live structural sensors in 3D views</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                   </CardContent>
                 </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm md:col-span-2">
                   <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                      <CardTitle className="text-xl font-bold flex items-center gap-3">
                         <Bell className="w-5 h-5 text-primary" /> Channel Thresholds
                      </CardTitle>
                      <Badge className="bg-primary/10 text-primary border-none">4 Channels Active</Badge>
                   </CardHeader>
                   <CardContent className="p-8">
                      <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                                  <MessageSquare className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="font-bold">Email Digest</p>
                                  <p className="text-xs text-slate-500">Weekly operational summary</p>
                               </div>
                            </div>
                            <Switch defaultChecked />
                         </div>
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-blue-500">
                                  <MessageSquare className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="font-bold">Slack Webhook</p>
                                  <p className="text-xs text-slate-500">Instant critical alerts</p>
                               </div>
                            </div>
                            <Switch defaultChecked />
                         </div>
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-green-500">
                                  <Zap className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="font-bold">Push Notifications</p>
                                  <p className="text-xs text-slate-500">Real-time site updates</p>
                               </div>
                            </div>
                            <Switch />
                         </div>
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-amber-500">
                                  <Truck className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="font-bold">Supply Chain Alerts</p>
                                  <p className="text-xs text-slate-500">Material shipment delays</p>
                               </div>
                            </div>
                            <Switch defaultChecked />
                         </div>
                      </div>
                   </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-8">
               <div className="grid md:grid-cols-2 gap-8">
                 <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                   <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                      <CardTitle className="text-xl font-bold flex items-center gap-3">
                         <Key className="w-5 h-5 text-indigo-500" /> API Access Management
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-indigo-500 hover:bg-indigo-500/10">
                         <Plus className="w-4 h-4 mr-2" /> Create Key
                      </Button>
                   </CardHeader>
                   <CardContent className="p-8">
                      <div className="space-y-4">
                         {apiKeys.map(key => (
                           <div key={key.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-border/40 transition-shadow hover:shadow-inner">
                              <div className="space-y-1">
                                <h5 className="text-sm font-bold text-foreground flex items-center gap-2">
                                   {key.name}
                                   <Badge variant="outline" className={`text-[10px] ${key.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-400/10 text-slate-400 border-slate-400/20'}`}>
                                      {key.status.toUpperCase()}
                                   </Badge>
                                </h5>
                                <p className="font-mono text-[10px] text-muted-foreground">{key.key}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                   <RotateCcw className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/60 hover:text-destructive">
                                   <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                           </div>
                         ))}
                      </div>
                   </CardContent>
                 </Card>

                 <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                   <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800">
                      <CardTitle className="text-xl font-bold flex items-center gap-3">
                         <Lock className="w-5 h-5 text-rose-500" /> Multi-Factor Auth (MFA)
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="p-8">
                      <div className="space-y-6">
                         <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl space-y-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Elevate your perimeter security by enabling TOTP-based authentication for all infrastructure modifications.</p>
                            <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold">Initiate MFA Setup</Button>
                         </div>
                         <div className="flex justify-between items-center p-4">
                            <div className="space-y-1">
                               <Label className="font-bold">Biometric Vault Access</Label>
                               <p className="text-xs text-slate-500">Use FaceID/Fingerprint for high-payload actions</p>
                            </div>
                            <Switch />
                         </div>
                      </div>
                   </CardContent>
                 </Card>
               </div>
            </TabsContent>

            {/* Audit Tab */}
            <TabsContent value="audit">
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                 <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-xl font-bold flex items-center gap-3">
                       <Activity className="w-5 h-5 text-primary" /> Infrastructure Activity Log
                    </CardTitle>
                    <CardDescription>Immutable record of all account Level-4 modifications.</CardDescription>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
                             <tr>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Event</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actor</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Timestamp</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                             <tr>
                                <td className="px-8 py-5">
                                   <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                                      <span className="text-sm font-bold">API Key Generated</span>
                                   </div>
                                </td>
                                <td className="px-8 py-5 text-sm font-medium">V. Chowdary</td>
                                <td className="px-8 py-5 text-sm text-slate-500">Edge Gateway [Mumbai_01]</td>
                                <td className="px-8 py-5 text-sm font-mono text-slate-500 text-right">25/03/2026 14:22:01</td>
                             </tr>
                             <tr>
                                <td className="px-8 py-5">
                                   <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                                      <span className="text-sm font-bold">Profile Config Updated</span>
                                   </div>
                                </td>
                                <td className="px-8 py-5 text-sm font-medium">System Core</td>
                                <td className="px-8 py-5 text-sm text-slate-500">Next.js Web Interface</td>
                                <td className="px-8 py-5 text-sm font-mono text-slate-500 text-right">25/03/2026 09:15:52</td>
                             </tr>
                             <tr>
                                <td className="px-8 py-5">
                                   <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                                      <span className="text-sm font-bold">MFA Required Challenge</span>
                                   </div>
                                </td>
                                <td className="px-8 py-5 text-sm font-medium">V. Chowdary</td>
                                <td className="px-8 py-5 text-sm text-slate-500">Mobile Device [iOS_17]</td>
                                <td className="px-8 py-5 text-sm font-mono text-slate-500 text-right">24/03/2026 21:04:18</td>
                             </tr>
                          </tbody>
                       </table>
                    </div>
                    <div className="p-8 border-t border-slate-100 dark:border-slate-800 text-center">
                       <Button variant="ghost" className="text-primary font-bold">View Forensic History Report</Button>
                    </div>
                 </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <footer className="pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6 text-xs text-slate-400 font-bold uppercase tracking-widest">
               <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-emerald-500" /> AES-256 Encrypted</span>
               <span className="flex items-center gap-1.5"><Globe className="w-3 h-3 text-blue-500" /> Node Status: Optimal</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">© 2026 SIID FLASH • SMART INTEGRATED INFRASTRUCTURE DESIGN</p>
          </footer>
        </div>
      </div>
    </AuthGuard>
  )
}

function Brick({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="8" y1="5" x2="8" y2="19" />
      <line x1="16" y1="5" x2="16" y2="19" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  )
}
