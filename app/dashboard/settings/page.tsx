"use client"

import { apiGet, apiPut } from "@/lib/backend"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, Lock, Bell, Shield, Database, 
  Globe, Zap, Save, ChevronRight, 
  Construction, Cpu, CreditCard, Code,
  Smartphone, Activity, Box, LayoutGrid,
  Scale, FileText, Cloud, HardDrive
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function ProfessionalSettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")

  // State for all 30+ Industrial Features
  const [settings, setSettings] = useState({
    // Profile
    name: "Arjun Chowdary",
    email: "user@siid.com",
    role: "Project Director",
    company: "SIID Flash Platforms",
    
    // Engineering Units (Industry Oriented)
    unitSystem: "metric", // metric vs imperial
    areaUnit: "sq_meters",
    precision: "2",
    bimIntegration: true,
    autoStructuralCheck: true,
    
    // Security & Compliance
    twoFactor: false,
    sessionPersistence: true,
    auditLogs: true,
    apiAccess: false,
    biometricLogin: false,
    
    // Notifications (Operational)
    notifEmail: true,
    notifSms: false,
    notifWhatsApp: true,
    budgetAlerts: true,
    safetyAlerts: true,
    materialShortage: true,
    
    // Project Management
    autoSaveInterval: "5", // minutes
    cloudSync: true,
    offlineMode: false,
    highQualityModels: true,
    collaborationRealtime: true,
    
    // Developer & Integrations
    webhookUrl: "",
    debugMode: false,
    sandboxEnv: true,
    exportFormat: "dwg",
    legacyMode: false
  })

  // Load Initial Settings from Database
  useEffect(() => {
    async function loadSettings() {
      try {
        const user = await apiGet<any>("/auth/me")
        if (user) {
          // Merge basic info
          const basicInfo = {
            name: user.name || "Arjun Chowdary",
            email: user.email || "user@siid.com",
            role: user.role || "Project Director",
          }
          
          // Parse complex industrial settings from JSON column
          if (user.settings_data) {
            try {
              const dbSettings = JSON.parse(user.settings_data)
              setSettings(prev => ({ ...prev, ...basicInfo, ...dbSettings }))
            } catch (e) {
              console.error("Failed to parse settings JSON from DB", e)
              setSettings(prev => ({ ...prev, ...basicInfo }))
            }
          } else {
            setSettings(prev => ({ ...prev, ...basicInfo }))
          }
        }
      } catch (err) {
        console.error("Failed to fetch settings from backend", err)
      }
    }
    loadSettings()
  }, [])

  // Toast Handler
  const showToast = (msg: string) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !(prev as any)[key] }))
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Exclude base info from the JSON blob to keep search fast
      const { name, email, role, company, ...industrialSettings } = settings
      
      const payload = {
        name: settings.name,
        settings_data: JSON.stringify(industrialSettings)
      }

      const updatedUser = await apiPut<any>("/auth/settings", payload)
      
      // Update local storage so other parts of the app know the name changed
      localStorage.setItem("user", JSON.stringify(updatedUser))
      
      showToast("Global configurations synchronized successfully.")
    } catch (err: any) {
      console.error("Manual save failed", err)
      showToast("Error: Connection lost while saving settings.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0b1224] text-slate-200 selection:bg-primary/30">
        {/* Navigation Sidebar (Industrial UI) */}
        <aside className="fixed left-0 top-0 h-full w-72 border-r border-slate-800 bg-[#0f172a] overflow-y-auto">
          <div className="p-8 pb-4">
             <Link href="/dashboard" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                   <Construction className="text-white w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">SIID OPS</h1>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">Settings Center</p>
                </div>
             </Link>
          </div>

          <nav className="p-4 space-y-2 mt-4">
             <SidebarItem 
               icon={<User className="w-4 h-4" />} 
               label="Account Core" 
               active={activeTab === "profile"} 
               onClick={() => setActiveTab("profile")} 
             />
             <SidebarItem 
               icon={<Scale className="w-4 h-4" />} 
               label="Engineering Units" 
               active={activeTab === "units"} 
               onClick={() => setActiveTab("units")} 
             />
             <SidebarItem 
               icon={<Shield className="w-4 h-4" />} 
               label="Security & Privacy" 
               active={activeTab === "security"} 
               onClick={() => setActiveTab("security")} 
             />
             <SidebarItem 
               icon={<Bell className="w-4 h-4" />} 
               label="Operational Alerts" 
               active={activeTab === "notifs"} 
               onClick={() => setActiveTab("notifs")} 
             />
             <SidebarItem 
               icon={<Database className="w-4 h-4" />} 
               label="Data & Intelligence" 
               active={activeTab === "data"} 
               onClick={() => setActiveTab("data")} 
             />
             <SidebarItem 
               icon={<Code className="w-4 h-4" />} 
               label="API & Webhooks" 
               active={activeTab === "dev"} 
               onClick={() => setActiveTab("dev")} 
             />
             
             <div className="pt-8 px-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Actions</p>
                <div className="space-y-4">
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">BIM Engine Status</span>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   </div>
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Database Sync</span>
                      <span className="text-emerald-500 font-mono">STABLE</span>
                   </div>
                </div>
             </div>
          </nav>
        </aside>

        {/* Main Interface Area */}
        <main className="ml-72 min-h-screen">
          {/* Top Bar */}
          <header className="h-20 border-b border-slate-800 bg-[#0b1224]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-10">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500 uppercase font-bold tracking-widest text-[10px]">Operations</span>
                <ChevronRight className="w-3 h-3 text-slate-700" />
                <span className="text-white font-medium capitalize">{activeTab.replace("-", " ")} Controls</span>
              </div>
              
              <div className="flex items-center gap-4">
                  <AnimatePresence>
                    {success && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-1.5 rounded-full text-xs font-bold"
                      >
                         {success}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Button onClick={handleUpdate} disabled={loading} className="bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/20 px-6">
                    {loading ? "Syncing..." : "Publish Changes"}
                    {!loading && <Save className="ml-2 w-4 h-4" />}
                  </Button>
              </div>
          </header>

          <div className="p-10 max-w-5xl">
             <form onSubmit={handleUpdate}>
                <AnimatePresence mode="wait">
                  {activeTab === "profile" && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} key="profile">
                       <SectionTitle title="Identity & Organizational Role" subtitle="Manage your professional signature and corporate access levels." />
                       <div className="grid grid-cols-2 gap-6 mb-10">
                          <SettingField label="Full Legal Name" description="Your name as it appears on official BIM reports.">
                             <Input value={settings.name} className="bg-[#1e293b] border-slate-700" onChange={e => setSettings({...settings, name: e.target.value})} />
                          </SettingField>
                          <SettingField label="Industry Role" description="Used to define your specific modeling permissions.">
                             <Input value={settings.role} className="bg-[#1e293b] border-slate-700 font-medium text-primary" readOnly />
                          </SettingField>
                          <SettingField label="Work Email" description="All intelligence reports will be sent here.">
                             <Input value={settings.email} className="bg-[#1e293b] border-slate-700" readOnly />
                          </SettingField>
                          <SettingField label="Parent Organization" description="Corporate entity managing your project access.">
                             <Input value={settings.company} className="bg-[#1e293b] border-slate-700" readOnly />
                          </SettingField>
                       </div>
                    </motion.div>
                  )}

                  {activeTab === "units" && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} key="units">
                       <SectionTitle title="Industrial Engineering Standards" subtitle="Configure technical specifications for all generated architectural models." />
                       <div className="space-y-6">
                          <Card className="p-6 bg-[#0f172a] border-slate-800">
                             <div className="flex items-center justify-between mb-8">
                                <div>
                                   <label className="text-sm font-bold text-white mb-1 block">Primary Measurement System</label>
                                   <p className="text-xs text-slate-500">Global standard used for all length, area, and volume calculations.</p>
                                </div>
                                <div className="flex bg-slate-800 p-1 rounded-lg">
                                   <button type="button" onClick={() => setSettings({...settings, unitSystem: 'metric'})} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${settings.unitSystem === 'metric' ? 'bg-primary text-white shadow-md' : 'text-slate-400'}`}>METRIC (MM/M)</button>
                                   <button type="button" onClick={() => setSettings({...settings, unitSystem: 'imperial'})} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${settings.unitSystem === 'imperial' ? 'bg-primary text-white shadow-md' : 'text-slate-400'}`}>IMPERIAL (FT/IN)</button>
                                </div>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-8">
                                <ToggleSetting 
                                  icon={<Cpu className="w-5 h-5" />} 
                                  title="Automatic Structural Integrity Check" 
                                  desc="AI validates load-bearing elements during every model generation cycle."
                                  checked={settings.autoStructuralCheck} 
                                  onToggle={() => handleToggle('autoStructuralCheck')}
                                />
                                <ToggleSetting 
                                  icon={<LayoutGrid className="w-5 h-5" />} 
                                  title="Level-3 BIM Integration" 
                                  desc="Enable full building information modeling metadata in every export."
                                  checked={settings.bimIntegration} 
                                  onToggle={() => handleToggle('bimIntegration')}
                                />
                             </div>
                          </Card>
                       </div>
                    </motion.div>
                  )}

                  {activeTab === "security" && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} key="security">
                       <SectionTitle title="Access Control & Shielding" subtitle="Secure your professional designs with bank-grade protection features." />
                       <div className="space-y-4">
                          <ToggleItem title="Two-Factor Authentication (2FA)" desc="Requires a unique code from your mobile device for every login attempt." checked={settings.twoFactor} onToggle={() => handleToggle('twoFactor')} />
                          <ToggleItem title="Intelligent Session Persistence" desc="Keeps your project open across multiple sessions without re-authenticating." checked={settings.sessionPersistence} onToggle={() => handleToggle('sessionPersistence')} />
                          <ToggleItem title="Real-time Audit Logs" desc="Record every metadata change and design modification in a secure ledger." checked={settings.auditLogs} onToggle={() => handleToggle('auditLogs')} />
                          <ToggleItem title="Biometric Security Access" desc="Use FaceID or Fingerprint for instant drawing approvals (Mobile Only)." checked={settings.biometricLogin} onToggle={() => handleToggle('biometricLogin')} />
                          
                          <div className="pt-6">
                             <Button variant="outline" className="border-slate-800 hover:bg-slate-800 text-xs h-10 px-6">
                                <Activity className="w-4 h-4 mr-2" />
                                Review Active Sessions
                             </Button>
                          </div>
                       </div>
                    </motion.div>
                  )}

                  {activeTab === "notifs" && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} key="notifs">
                       <SectionTitle title="Command Center Notifications" subtitle="Customizes how your site engineers and project managers receive alerts." />
                       <div className="grid grid-cols-2 gap-4">
                          <Card className="p-5 bg-emerald-500/5 border-emerald-500/10 border">
                             <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                                   <Smartphone className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-bold text-white text-sm">Industrial Push Routing</h4>
                             </div>
                             <div className="space-y-4">
                                <ToggleItem title="WhatsApp Operational Alerts" desc="Critical site warnings." checked={settings.notifWhatsApp} onToggle={() => handleToggle('notifWhatsApp')} />
                                <ToggleItem title="SMS Emergency Dispatch" desc="Direct site evacuation alerts." checked={settings.notifSms} onToggle={() => handleToggle('notifSms')} />
                             </div>
                          </Card>
                          
                          <Card className="p-5 bg-primary/5 border-primary/10 border">
                             <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                   <Box className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-bold text-white text-sm">Project Logic Alerts</h4>
                             </div>
                             <div className="space-y-4">
                                <ToggleItem title="Budget Variance Threshold" desc="Notification on 5% cost drift." checked={settings.budgetAlerts} onToggle={() => handleToggle('budgetAlerts')} />
                                <ToggleItem title="Material Scarcity Warning" desc="Alert when site supply is low." checked={settings.materialShortage} onToggle={() => handleToggle('materialShortage')} />
                             </div>
                          </Card>
                       </div>
                    </motion.div>
                  )}
                  
                  {activeTab === "data" && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} key="data">
                       <SectionTitle title="Intelligence & Data Integrity" subtitle="Manage the performance and synchronization of your design data." />
                       <div className="space-y-6">
                          <Card className="p-6 bg-[#0f172a] border-slate-800">
                             <div className="grid grid-cols-2 gap-10">
                                <div>
                                   <Label className="text-white font-bold mb-4 block">Engine Synchronization Interval</Label>
                                   <select className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                                      <option value="1">High Performance (1 Min)</option>
                                      <option value="5">Balanced (5 Min)</option>
                                      <option value="15">Efficiency Mode (15 Min)</option>
                                   </select>
                                </div>
                                <div>
                                   <Label className="text-white font-bold mb-4 block">Preferred Intelligence Model</Label>
                                   <select className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                                      <option value="standard">Standard Architectural Flow</option>
                                      <option value="pro">Pro Structural Intelligence (V3)</option>
                                      <option value="vas">Advanced Vedic Compliance Engine</option>
                                   </select>
                                </div>
                             </div>
                             
                             <div className="mt-10 pt-10 border-t border-slate-800 grid grid-cols-2 gap-6">
                                <ToggleSetting icon={<Cloud className="w-5 h-5" />} title="Persistent Multi-Cloud Backup" desc="Mirror every design across AWS and Azure for 100% uptime." checked={settings.cloudSync} onToggle={() => handleToggle('cloudSync')} />
                                <ToggleSetting icon={<HardDrive className="w-5 h-5" />} title="Low-Latency Offline Mode" desc="Keep designing when site connectivity is lost. Syncs later." checked={settings.offlineMode} onToggle={() => handleToggle('offlineMode')} />
                             </div>
                          </Card>
                       </div>
                    </motion.div>
                  )}

                  {activeTab === "dev" && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} key="dev">
                       <SectionTitle title="Developer API & Integrations" subtitle="Unlock programmatic access for custom BIM scripts and ERP automation." />
                       <div className="space-y-6">
                          <Card className="p-6 bg-[#0f172a] border-slate-800">
                             <div className="space-y-6 mb-8">
                                <SettingField label="Global Webhook Dispatcher" description="POST events to this URL when project statuses change.">
                                   <Input placeholder="https://your-api.com/webhook" className="bg-[#1e293b] border-slate-700 font-mono text-xs" />
                                </SettingField>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-8">
                                <ToggleSetting icon={<Zap className="w-5 h-5" />} title="Production Sandbox Environment" desc="Isolate experimental BIM scripts from live site data." checked={settings.sandboxEnv} onToggle={() => handleToggle('sandboxEnv')} />
                                <ToggleSetting icon={<Code className="w-5 h-5" />} title="Debug Intelligence Trace" desc="Detailed console output for all AI layout logic cycles." checked={settings.debugMode} onToggle={() => handleToggle('debugMode')} />
                             </div>
                             
                             <div className="mt-8 pt-6 border-t border-slate-800">
                                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white border-none h-12">
                                   Generate New API Token (Secret Key)
                                </Button>
                                <p className="text-[10px] text-center text-slate-600 mt-2 uppercase tracking-widest font-bold">Expires in 365 Days • AES-256 Encryption</p>
                             </div>
                          </Card>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </form>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
        active 
          ? "bg-primary text-white shadow-lg shadow-primary/20" 
          : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
      }`}
    >
      <span className={active ? "text-white" : "text-slate-500 group-hover:text-slate-300 transition-colors"}>{icon}</span>
      {label}
      {active && <motion.div layoutId="navIndicator" className="ml-auto w-1 h-4 bg-white/50 rounded-full" />}
    </button>
  )
}

function SectionTitle({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">{title}</h2>
      <p className="text-slate-500 text-sm max-w-2xl">{subtitle}</p>
    </div>
  )
}

function SettingField({ label, description, children }: { label: string, description: string, children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-bold text-slate-300">{label}</Label>
      {children}
      <p className="text-[11px] text-slate-600 font-medium leading-tight">{description}</p>
    </div>
  )
}

function ToggleSetting({ icon, title, desc, checked, onToggle }: { icon: React.ReactNode, title: string, desc: string, checked: boolean, onToggle: () => void }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-800/30 transition-colors">
       <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${checked ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-500'}`}>
          {icon}
       </div>
       <div className="flex-1">
          <div className="flex items-center justify-between gap-4">
             <span className={`text-sm font-bold transition-colors ${checked ? 'text-white' : 'text-slate-400'}`}>{title}</span>
             <Switch checked={checked} onCheckedChange={onToggle} />
          </div>
          <p className="text-[11px] text-slate-600 mt-1 leading-normal">{desc}</p>
       </div>
    </div>
  )
}

function ToggleItem({ title, desc, checked, onToggle }: { title: string, desc: string, checked: boolean, onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between p-2">
       <div>
          <p className={`text-sm font-bold transition-colors ${checked ? 'text-white' : 'text-slate-400'}`}>{title}</p>
          <p className="text-[11px] text-slate-600">{desc}</p>
       </div>
       <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  )
}
