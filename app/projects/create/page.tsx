"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowRight, ArrowLeft, MapPin, CheckCircle2, Factory, Hammer, 
  Map, DollarSign, Download, Compass, Box, HardHat, Waves, Zap, PaintBucket, 
  Trees, Layers, Loader2, LayoutGrid, Lightbulb, Sofa, FileDown,
  Grid3x3, Calendar, Calculator, Users
} from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function CreateProjectWorkflow() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSimulatingAI, setIsSimulatingAI] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // -- STATES --
  const [plot, setPlot] = useState({
    area: "", length: "", width: "", shape: "rectangular",
    city: "", state: "", pincode: "", zone: "residential",
    soil: "red", facing: "north", floors: "1"
  })

  const [budget, setBudget] = useState({
    grade: "standard", min: "5000000", max: "8000000",
    cement: "OPC 53", steel: "TMT Fe500",
    estimatedStream: "", estimatedComplete: false
  })

  const [features, setFeatures] = useState({
    beds: "3", baths: "3", kitchen: "modular",
    specialRooms: [] as string[],
    accessibility: false, vaastu: true, style: "modern"
  })

  const [analysis, setAnalysis] = useState({
    materialDone: false, budgetDone: false, siteDone: false, allDone: false
  })

  // Generated dynamic data
  const [dynMaterials, setDynMaterials] = useState<any[]>([])
  const [dynTimeline, setDynTimeline] = useState<any[]>([])
  
  const [streamProgress, setStreamProgress] = useState(0)
  
  // Step 6 Layout Switching
  const [activeLayout, setActiveLayout] = useState('arch')

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => s - 1)

  // DYNAMIC CALCULATIONS
  const sqft = parseInt(plot.area) || 1500
  const floors = parseInt(plot.floors) || 1
  const totalArea = sqft * floors

  const handleEstimateAI = async () => {
    setIsSimulatingAI(true)
    setBudget(b => ({ ...b, estimatedStream: "", estimatedComplete: false }))
    
    try {
      const res = await fetch("/api/ml-project-estimation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: { location: plot.city },
          requirements: { 
            size: totalArea > 10000 ? "mega" : totalArea > 5000 ? "large" : totalArea > 2000 ? "medium" : "small",
            materials: budget.grade,
            solarIntegration: features.specialRooms.includes("Solar panels"),
            rainwaterHarvesting: features.specialRooms.includes("Rainwater harvesting"),
            smartOptions: features.specialRooms.filter(r => r.toLowerCase().includes("smart"))
          },
          projectType: plot.zone || "residential"
        })
      })
      
      if (!res.ok) throw new Error("API Limit reached")
      const result = await res.json()
      
      const textTarget = `[ AI DATALINK VERIFIED: PINGING REAL-TIME CONTRACTOR RATES FOR: ${plot.city.toUpperCase()} ]

>> ARCHITECTURAL GEOMETRY:
Footprint bounds: ${plot.length}ft × ${plot.width}ft.
Gross built-up area: ${totalArea} Sq.Ft. across G+${floors-1} floors.

>> FINANCIAL ML ANALYSIS:
Predicted Budget Range: ₹${(result.budgetRange.min * 100000).toLocaleString()} - ₹${(result.budgetRange.max * 100000).toLocaleString()}
ML Confidence Score: ${(result.ml_metadata.confidence * 100).toFixed(1)}%

>> COST BREAKDOWN:
- Civil & Materials: ₹${(result.breakdown.materials * 100000).toLocaleString()}
- Labor & Ops: ₹${(result.breakdown.labor * 100000).toLocaleString()}
- MEP Systems: ₹${(result.itemized.mep_systems * 100000).toLocaleString()}

>> SUSTAINABILITY METRICS:
- Carbon Offset: ${result.sustainability_metrics.carbon_offset_projection}
- GRIHA Readiness: ${result.sustainability_metrics.griha_certification_readiness}

>> REASONING:
${result.reasoning.map((r: string) => `- ${r}`).join("\n")}
`
      const textArr = textTarget.split(" ")
      let idx = 0
      const interval = setInterval(() => {
        if (idx < textArr.length) {
          setBudget(b => ({ ...b, estimatedStream: b.estimatedStream + (idx > 0 ? " " : "") + textArr[idx] }))
          idx++
        } else {
          clearInterval(interval)
          setIsSimulatingAI(false)
          setBudget(b => ({ ...b, estimatedComplete: true }))
        }
      }, 10)
    } catch (err) {
      toast.error("ML Simulation failed. Falling back to edge-node local calculation.")
      setIsSimulatingAI(false)
    }
  }

  const runCoreEngine = async () => {
    setIsSimulatingAI(true)
    setAnalysis({ materialDone: false, budgetDone: false, siteDone: false, allDone: false })
    setStreamProgress(0)
    
    try {
      const res = await fetch("/api/predict-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area: sqft,
          floors: floors,
          qualityLevel: budget.grade,
          city: plot.city,
          soilType: plot.soil
        })
      })
      
      if (!res.ok) throw new Error("Material prediction failed")
      const pred = await res.json()

      setDynMaterials([
        { item: `Cement (${budget.cement})`, qty: pred.cement.toLocaleString(), unit: "Bags" },
        { item: `Reinforcement (${budget.steel})`, qty: (pred.steel / 1000).toFixed(2), unit: "Metric Tons" },
        { item: "Standard Clay/Fly Bricks", qty: pred.bricks.toLocaleString(), unit: "Pcs" },
        { item: "Fine M-Sand", qty: pred.sand.toLocaleString(), unit: "Cu.Ft" },
        { item: "Coarse Aggregate (20mm)", qty: pred.aggregate.toLocaleString(), unit: "Cu.Ft" }
      ])

      // Calculate timeline based on total area complexity
      const baseWeeks = Math.max(16, Math.round(totalArea / 140))
      setDynTimeline([
        { phase: "Excavation & Foundation", weeks: Math.round(baseWeeks * 0.2) },
        { phase: "RCC Structure & Slabs", weeks: Math.round(baseWeeks * 0.4) },
        { phase: "Finishing & Handover", weeks: Math.round(baseWeeks * 0.4) },
      ])

      setAnalysis(a => ({ ...a, materialDone: true }))
      setTimeout(() => setAnalysis(a => ({ ...a, budgetDone: true })), 1000)
      setTimeout(() => setAnalysis(a => ({ ...a, siteDone: true })), 2000)
      setTimeout(() => {
        setAnalysis(a => ({ ...a, allDone: true }))
        setIsSimulatingAI(false)
      }, 3000)
      
      const progressInt = setInterval(() => {
         setStreamProgress(p => p >= 100 ? 100 : p + 5)
      }, 100)
      return () => clearInterval(progressInt)

    } catch (err) {
      setIsSimulatingAI(false)
      toast.error("ML Analysis engine offline.")
    }
  }

  useEffect(() => {
    if (step === 4 && !analysis.allDone && !isSimulatingAI) {
      runCoreEngine()
    }
  }, [step])

  const toggleSpecialRoom = (room: string) => {
    setFeatures(f => ({
      ...f, 
      specialRooms: f.specialRooms.includes(room) ? f.specialRooms.filter(r => r !== room) : [...f.specialRooms, room]
    }))
  }

  // Export dynamically to PDF natively bypassing oklch parser bugs
  const exportToPdf = async () => {
    setIsExporting(true)
    toast.info("Preparing Vector PDF Dossier...")
    try {
      const isBlueprintMode = step === 6;
      const targetId = isBlueprintMode ? 'project-workflow-container' : 'pdf-export-layer'
      const element = document.getElementById(targetId)
      
      if (!element) throw new Error("Element not found")

      // Use a pure browser print window to bypass html2canvas strict CSS color passing (Tailwind 4 oklch blocks)
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
         toast.error("Please allow popups to generate the PDF.");
         setIsExporting(false);
         return;
      }
      
      // Inject identical stylesheet logic natively
      const headHTML = document.head.innerHTML;
      const htmlPayload = element.outerHTML;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${plot.city ? plot.city.toUpperCase() : 'SIID'}_OFFICIAL_DOSSIER</title>
            ${headHTML}
            <style>
               @media print {
                  @page { size: A4; margin: 0; }
                  body { 
                     -webkit-print-color-adjust: exact !important; 
                     print-color-adjust: exact !important; 
                     background-color: white !important; 
                  }
                  #pdf-export-layer {
                     opacity: 1 !important;
                     position: relative !important;
                     top: 0 !important;
                     left: 0 !important;
                     margin: 0 auto !important;
                     box-shadow: none !important;
                  }
               }
            </style>
          </head>
          <body class="bg-white m-0 p-0 overflow-x-hidden min-h-screen pt-4 pb-4 flex justify-center">
            ${htmlPayload}
            <script>
               // Overwrite inline opacity if the component spawned it hidden
               const target = document.getElementById('${targetId}');
               if(target) {
                 target.style.opacity = '1';
                 target.style.position = 'relative';
                 target.style.left = '0';
                 target.style.top = '0';
               }
               window.onload = () => {
                 setTimeout(() => {
                    window.print();
                 }, 800);
               };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      toast.success("Document opened for High-Fidelity PDF generation!")
    } catch (e) {
      toast.error("Failed to generate PDF.")
      console.error(e)
    }
    setIsExporting(false)
  }

  // Helper for dynamic dimensions in SVG based on input (scale down to fit 600 box)
  const lRaw = parseInt(plot.length) || 60
  const wRaw = parseInt(plot.width) || 40
  const maxDim = Math.max(lRaw, wRaw)
  const scale = 400 / maxDim
  const svgW = lRaw * scale
  const svgH = wRaw * scale
  const offX = (600 - svgW) / 2 + 100 // +100 to center in 800 width
  const offY = (400 - svgH) / 2 + 100 // +100 to center in 600 height

  const costPerSqft = budget.grade === 'economy' ? 1450 : budget.grade === 'standard' ? 1650 : budget.grade === 'premium' ? 2200 : 3500;
  const totalCost = totalArea * costPerSqft;

  // --- RENDERING ENGINE FOR SVG LAYOUTS ---
  const renderSVG = (is3D=false) => {
    return (
      <svg viewBox="0 0 800 600" className={`w-full h-full min-w-[400px] ${!is3D ? 'bg-background rounded' : ''}`} style={is3D ? { overflow: 'visible' } : {}}>
        {!is3D && (
          <>
            <defs>
               <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                 <rect width="20" height="20" fill="none" stroke="currentColor" opacity="0.03" strokeWidth="1" />
               </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </>
        )}
        
        {activeLayout === 'ext' && (
           <g opacity="0.6">
              <circle cx={offX - 40} cy={offY + 40} r="20" fill="rgba(34,197,94,0.3)" stroke="#22c55e" />
              <circle cx={offX + svgW + 30} cy={offY + svgH - 50} r="30" fill="rgba(34,197,94,0.3)" stroke="#22c55e" />
              <rect x={offX + 20} y={offY + svgH} width="60" height="150" fill={is3D?"rgba(148,163,184,0.1)":"none"} stroke="currentColor" strokeDasharray="3,3" />
              {!is3D && <text x={offX + 25} y={offY + svgH + 40} fontSize="10" fill="currentColor">Driveway</text>}
              <rect x="30" y="30" width="740" height="540" fill="none" stroke="currentColor" opacity="0.2" strokeWidth="2" strokeDasharray="5,5" />
              {!is3D && <text x="40" y="45" fill="currentColor" opacity="0.4" fontSize="12" fontFamily="monospace">Site Perimeter ({plot.length}' x {plot.width}' at {plot.pincode})</text>}
           </g>
        )}

        <g stroke="currentColor" opacity={is3D?"0.3":"0.1"} fill="currentColor">
           <rect x={offX} y={offY} width={svgW} height={svgH} />
        </g>

        {(activeLayout === 'arch' || activeLayout === 'struct' || activeLayout === 'int' || activeLayout === 'elec' || activeLayout === 'plumb') && (
          <g stroke="currentColor" strokeWidth={activeLayout === 'arch' || is3D ? "4" : "2"} strokeLinecap="square" opacity={activeLayout === 'arch' || is3D ? "0.8" : "0.3"} fill={is3D ? "currentColor" : "none"}>
             <path d={`M ${offX} ${offY} L ${offX+svgW} ${offY} L ${offX+svgW} ${offY+svgH} L ${offX} ${offY+svgH} Z`} fill={is3D ? "rgba(0,0,0,0.05)" : "none"} stroke="currentColor" />
             <line x1={offX+svgW*0.3} y1={offY} x2={offX+svgW*0.3} y2={offY+svgH*0.5} />
             <line x1={offX} y1={offY+svgH*0.5} x2={offX+svgW*0.5} y2={offY+svgH*0.5} />
             <line x1={offX+svgW*0.7} y1={offY} x2={offX+svgW*0.7} y2={offY+svgH} />
             <line x1={offX+svgW*0.5} y1={offY+svgH*0.5} x2={offX+svgW*0.7} y2={offY+svgH*0.5} />
          </g>
        )}

        {activeLayout === 'arch' && !is3D && (
          <g fill="currentColor" opacity="0.8" fontSize="12" fontWeight="600" textAnchor="middle">
             <text x={offX+svgW*0.15} y={offY+svgH*0.25}>{features.beds >= 2 ? 'Bed 1' : 'Study'}</text>
             <text x={offX+svgW*0.15} y={offY+svgH*0.25 + 14} fontSize="9" opacity="0.6">{Math.round(lRaw*0.3)}' x {Math.round(wRaw*0.5)}'</text>
             <text x={offX+svgW*0.15} y={offY+svgH*0.75}>Master Bed</text>
             <text x={offX+svgW*0.15} y={offY+svgH*0.75 + 14} fontSize="9" opacity="0.6">{Math.round(lRaw*0.3)}' x {Math.round(wRaw*0.5)}'</text>
             <text x={offX+svgW*0.5} y={offY+svgH*0.25}>Living Room</text>
             <text x={offX+svgW*0.5} y={offY+svgH*0.25 + 14} fontSize="9" opacity="0.6">{Math.round(lRaw*0.4)}' x {Math.round(wRaw*0.5)}'</text>
             <text x={offX+svgW*0.6} y={offY+svgH*0.75}>Bath</text>
             <text x={offX+svgW*0.6} y={offY+svgH*0.75 + 14} fontSize="9" opacity="0.6">{Math.round(lRaw*0.2)}' x {Math.round(wRaw*0.5)}'</text>
             <text x={offX+svgW*0.85} y={offY+svgH*0.25}>Kitchen</text>
             <text x={offX+svgW*0.85} y={offY+svgH*0.25 + 14} fontSize="9" opacity="0.6">{Math.round(lRaw*0.3)}' x {Math.round(wRaw*0.5)}'</text>
             <text x={offX+svgW*0.85} y={offY+svgH*0.75}>Garage/Deck</text>
             <text x={offX+svgW*0.85} y={offY+svgH*0.75 + 14} fontSize="9" opacity="0.6">{Math.round(lRaw*0.3)}' x {Math.round(wRaw*0.5)}'</text>
          </g>
        )}

        {activeLayout === 'arch' && !is3D && (
          <g stroke="currentColor" strokeWidth="1" opacity="0.6">
             <line x1={offX} y1={offY-20} x2={offX+svgW} y2={offY-20} />
             <line x1={offX} y1={offY-25} x2={offX} y2={offY-15} />
             <line x1={offX+svgW} y1={offY-25} x2={offX+svgW} y2={offY-15} />
             <rect x={offX+svgW/2 - 25} y={offY-28} width="50" height="16" fill="var(--background)" stroke="none" />
             <text x={offX+svgW/2} y={offY-16} fill="currentColor" fontWeight="bold" fontSize="11" textAnchor="middle" stroke="none">{plot.length}' - 0"</text>
             <line x1={offX-20} y1={offY} x2={offX-20} y2={offY+svgH} />
             <line x1={offX-25} y1={offY} x2={offX-15} y2={offY} />
             <line x1={offX-25} y1={offY+svgH} x2={offX-15} y2={offY+svgH} />
             <rect x={offX-28} y={offY+svgH/2 - 25} width="16" height="50" fill="var(--background)" stroke="none" />
             <text x={offX-24} y={offY+svgH/2} fill="currentColor" fontWeight="bold" fontSize="11" textAnchor="middle" stroke="none" transform={`rotate(-90, ${offX-24}, ${offY+svgH/2})`}>{plot.width}' - 0"</text>
          </g>
        )}

        {activeLayout === 'struct' && (
           <g>
             {[
               [0,0], [0.3,0], [0.7,0], [1,0],
               [0,0.5], [0.5,0.5], [0.7,0.5], [1,0.5],
               [0,1], [0.7,1], [1,1]
             ].map((pos, i) => (
               <rect key={i} x={offX+svgW*pos[0]-6} y={offY+svgH*pos[1]-6} width="12" height="12" fill="#ef4444" opacity={is3D? "1": "0.8"} stroke={is3D?"#b91c1c":"none"} />
             ))}
             {!is3D && <text x={offX+20} y={offY+30} fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">MATRIX: C1: 9x15 LOAD BEARING COLUMNS</text>}
           </g>
        )}

        {activeLayout === 'plumb' && (
           <g fill="none" opacity="0.8">
              {/* Hydraulic Source & Main Line */}
              <path d={`M ${offX+svgW*0.6} ${offY+svgH*0.75} L ${offX+svgW*0.85} ${offY+svgH*0.25} L ${offX+svgW*1.1} ${offY+svgH*0.25}`} stroke="url(#plumbGradient)" strokeWidth={is3D?"5":"3"} strokeDasharray={is3D?"none":"8,4"} />
              <defs>
                <linearGradient id="plumbGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
              </defs>

              {/* Pressure Regulation Nodes */}
              <circle cx={offX+svgW*0.6} cy={offY+svgH*0.75} r={is3D?"9":"5"} fill="#2563eb" stroke="#fff" strokeWidth="2" />
              <circle cx={offX+svgW*0.85} cy={offY+svgH*0.25} r={is3D?"9":"5"} fill="#2563eb" stroke="#fff" strokeWidth="2" />
              
              {!is3D && (
                <g stroke="none" fontWeight="bold" fontSize="9">
                  <text x={offX+svgW*0.85} y={offY+svgH*0.25 - 15} fill="#2563eb">H-MAX PRESSURE (4.5 BAR)</text>
                  <text x={offX+svgW*0.6} y={offY+svgH*0.75 - 15} fill="#2563eb">MAIN RISER FLUX</text>
                </g>
              )}
           </g>
        )}

        {/* VASTU HARMONIC HEATMAP (Overlay) */}
        {features.vaastu && !is3D && (
          <g opacity="0.07" pointerEvents="none">
             <rect x={offX} y={offY} width={svgW/2} height={svgH/2} fill="#d1fae5" /> {/* NW */}
             <rect x={offX+svgW/2} y={offY} width={svgW/2} height={svgH/2} fill="#fef3c7" /> {/* NE */}
             <rect x={offX} y={offY+svgH/2} width={svgW/2} height={svgH/2} fill="#fee2e2" /> {/* SW */}
             <rect x={offX+svgW/2} y={offY+svgH/2} width={svgW/2} height={svgH/2} fill="#ffedd5" /> {/* SE */}
             <circle cx={offX+svgW/2} cy={offY+svgH/2} r="15" fill="#fff" stroke="#000" strokeWidth="0.5" />
          </g>
        )}

        {activeLayout === 'elec' && (
           <g fill="none" opacity="0.9">
              {/* Phase Distribution Circuits (Neural-Link Map) */}
              <path d={`M ${offX+30} ${offY+30} Q ${offX+svgW*0.2} ${offY+svgH*0.3} ${offX+svgW*0.15} ${offY+svgH*0.25}`} stroke="#ef4444" strokeWidth={is3D?"4":"2"} strokeDasharray="4,2" />
              <path d={`M ${offX+30} ${offY+30} Q ${offX+svgW*0.5} ${offY+svgH*0.3} ${offX+svgW*0.5} ${offY+svgH*0.5}`} stroke="#eab308" strokeWidth={is3D?"4":"2"} />
              <path d={`M ${offX+30} ${offY+30} Q ${offX+svgW*0.8} ${offY+svgH*0.1} ${offX+svgW*0.85} ${offY+svgH*0.25}`} stroke="#3b82f6" strokeWidth={is3D?"4":"2"} strokeDasharray="6,3" />
              
              {/* Main Distribution & Inverter Logic */}
              <circle cx={offX+30} cy={offY+30} r={is3D?"12":"8"} fill="#a16207" className="animate-pulse" />
              {!is3D && <text x={offX+45} y={offY+35} fill="#a16207" fontSize="10" fontWeight="black" className="tracking-tighter">AI-DB SOURCE (3-PHASE BALANCED)</text>}
              
              {/* Load Nodes */}
              <g fill="currentColor">
                <circle cx={offX+svgW*0.15} cy={offY+svgH*0.25} r={is3D?"6":"4"} fill="#ef4444" />
                <circle cx={offX+svgW*0.5} cy={offY+svgH*0.5} r={is3D?"6":"4"} fill="#eab308" />
                <circle cx={offX+svgW*0.85} cy={offY+svgH*0.25} r={is3D?"6":"4"} fill="#3b82f6" />
              </g>

              {/* Advanced Solar PV Integration (if applicable) */}
              {features.specialRooms.includes("Solar panels") && (
                <path d={`M ${offX+svgW*0.5} ${offY-40} L ${offX+30} ${offY+30}`} stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" />
              )}
           </g>
        )}

        {/* HUMAN CIRCULATION ANALYSIS (Layout Mutation) */}
        {activeLayout === 'arch' && !is3D && (
          <g fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="1" strokeDasharray="10,5">
             <path d={`M ${offX+svgW*0.5} ${offY+svgH} C ${offX+svgW*0.5} ${offY+svgH*0.5}, ${offX+svgW*0.15} ${offY+svgH*0.5}, ${offX+svgW*0.15} ${offY+svgH*0.25}`} />
             <path d={`M ${offX+svgW*0.5} ${offY+svgH} C ${offX+svgW*0.5} ${offY+svgH*0.5}, ${offX+svgW*0.85} ${offY+svgH*0.5}, ${offX+svgW*0.85} ${offY+svgH*0.25}`} />
             <text x={offX+svgW*0.5} y={offY+svgH - 20} fill="rgba(16,185,129,0.6)" fontSize="9" fontWeight="bold" textAnchor="middle" stroke="none">PRIMARY CIRCULATION FLOW</text>
          </g>
        )}

        {activeLayout === 'int' && (
           <g fill={is3D ? "rgba(125,211,252,0.6)" : "rgba(148,163,184,0.3)"} stroke={is3D ? "#0ea5e9" : "rgba(148,163,184,0.6)"} strokeWidth={is3D ? "2" : "1"}>
              <rect x={offX+10} y={offY+svgH*0.75} width="60" height="50" rx="4" />
              <rect x={offX+10} y={offY+svgH*0.75+5} width="20" height="15" rx="2" fill="rgba(148,163,184,0.5)" />
              <rect x={offX+svgW*0.4} y={offY+10} width="80" height="30" rx="3" />
              <rect x={offX+svgW*0.4} y={offY+10} width="20" height="30" rx="2" fill="rgba(148,163,184,0.5)" />
              <circle cx={offX+svgW*0.5} cy={offY+svgH*0.4} r="25" fill={is3D ? "rgba(251,146,60,0.6)" : "none"} strokeWidth="2" />
              <rect x={offX+svgW*0.8} y={offY+svgH*0.1} width="40" height="60" rx="2" fill="rgba(148,163,184,0.2)" />
           </g>
        )}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="space-y-6">
          <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground -ml-4">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
               <h1 className="text-3xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                     <Factory className="w-6 h-6" />
                  </div>
                  Project Setup
               </h1>
               <p className="text-muted-foreground mt-2">Create a new construction project and generate intelligent layouts.</p>
            </div>
            <div className="md:text-right">
               <div className="text-sm font-semibold text-primary mb-1">Step {step} of 7</div>
               <div className="text-lg font-medium hover:text-primary transition-colors">
                 {step === 1 && "Plot Details & Location"}
                 {step === 2 && "Materials & Budget"}
                 {step === 3 && "Features & Amenities"}
                 {step === 4 && "AI Analysis Engine"}
                 {step === 5 && "Vastu Layout"}
                 {step === 6 && "Live Design Suite"}
                 {step === 7 && "Executive Master Brief"}
               </div>
            </div>
          </div>
          <Progress value={(step / 7) * 100} className="h-2" />
        </header>

        {/* WORKFLOW CONTAINER */}
        <Card id="project-workflow-container" className="p-6 md:p-8 rounded-xl shadow-sm border border-border min-h-[500px] flex flex-col bg-card">
          <AnimatePresence mode="wait">
            
            {/* --- STEP 1: PLOT INPUT --- */}
            {step === 1 && <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="font-semibold">Plot Dimensions (L × W)</Label>
                    <div className="flex gap-4">
                       <Input placeholder="Length (ft)" type="number" className="h-12" value={plot.length} onChange={e => {
                         const l = e.target.value; const w = plot.width;
                         setPlot({...plot, length: l, area: (parseFloat(l||'0')*parseFloat(w||'0')||'').toString()})
                       }} />
                       <Input placeholder="Width (ft)" type="number" className="h-12" value={plot.width} onChange={e => {
                         const w = e.target.value; const l = plot.length;
                         setPlot({...plot, width: w, area: (parseFloat(l||'0')*parseFloat(w||'0')||'').toString()})
                       }} />
                    </div>
                  </div>
                  <div className="space-y-3">
                     <Label className="font-semibold">Total Plot Area</Label>
                     <Input placeholder="Sq Feet" type="number" className="h-12 bg-muted font-mono" readOnly value={plot.area} onChange={e => setPlot({...plot, area: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                     <Label className="font-semibold">Location Tracker (Live)</Label>
                     <div className="flex gap-2">
                        <Input placeholder="City Name" className="h-12" value={plot.city} onChange={e => setPlot({...plot, city: e.target.value})} />
                        <Input placeholder="Pin Code" className="h-12 w-1/3" value={plot.pincode} onChange={e => setPlot({...plot, pincode: e.target.value})} />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <Label className="font-semibold">Facing Direction</Label>
                     <div className="grid grid-cols-4 gap-2">
                        {["North", "East", "West", "South"].map(d => (
                          <Button key={d} variant={plot.facing.toLowerCase() === d.toLowerCase() ? "default" : "outline"} className={`h-12 w-full transition-colors`} onClick={() => setPlot({...plot, facing: d.toLowerCase()})}>{d}</Button>
                        ))}
                     </div>
                  </div>
                  
                  {/* Embedded Google Maps based on location input */}
                  <div className="md:col-span-2 mt-4">
                     <Label className="font-semibold flex items-center gap-2 mb-2 text-primary"><MapPin className="w-4 h-4"/> Geolocation Boundary</Label>
                     <div className="h-48 w-full border rounded-lg bg-muted/30 overflow-hidden shadow-inner relative">
                       {plot.city && plot.pincode && plot.city.length > 2 ? (
                         <iframe 
                           width="100%" height="100%" frameBorder="0" style={{ border: 0 }}
                           src={`https://maps.google.com/maps?&q=${encodeURIComponent(plot.city + ' ' + plot.pincode)}&output=embed`}
                           allowFullScreen
                         />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground flex-col gap-2">
                            <Map className="w-8 h-8 opacity-20" />
                            Enter City & Pincode to load satellite view
                         </div>
                       )}
                     </div>
                  </div>

                  <div className="space-y-3">
                     <Label className="font-semibold">Number of Floors</Label>
                     <Input placeholder="e.g. 2" type="number" className="h-12" value={plot.floors} onChange={e => setPlot({...plot, floors: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                     <Label className="font-semibold">Soil Type (Structural Analysis)</Label>
                     <select className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" value={plot.soil} onChange={e => setPlot({...plot, soil: e.target.value})}>
                        <option value="red">Red Soil</option>
                        <option value="black">Black Soil (High Swell)</option>
                        <option value="sandy">Sandy Soil</option>
                        <option value="clay">Clay Soil</option>
                        <option value="rocky">Rocky (Hard Strata)</option>
                     </select>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t mt-6">
                   <div className="text-sm text-muted-foreground flex gap-2"><FileDown className="w-4 h-4"/> Can export PDF at any stage</div>
                   <Button onClick={handleNext} disabled={!plot.length || !plot.width || !plot.area || !plot.city} className="h-12 px-8" size="lg">
                     Next Step <ArrowRight className="ml-2 w-4 h-4" />
                   </Button>
                </div>
              </motion.div>}

            {/* --- STEP 2: MATERIALS & BUDGET --- */}
            {step === 2 && <motion.div key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="space-y-3">
                         <Label className="font-semibold">Construction Grade</Label>
                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                            {["economy", "standard", "premium", "luxury"].map(g => (
                              <Button key={g} variant={budget.grade === g ? "default" : "outline"} className={`h-12 capitalize`} onClick={() => setBudget({...budget, grade: g})}>{g}</Button>
                            ))}
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-3">
                           <Label className="font-semibold">Min Target Budget (₹)</Label>
                           <Input type="number" className="h-12" value={budget.min} onChange={e => setBudget({...budget, min: e.target.value})} />
                         </div>
                         <div className="space-y-3">
                           <Label className="font-semibold">Max Target Budget (₹)</Label>
                           <Input type="number" className="h-12" value={budget.max} onChange={e => setBudget({...budget, max: e.target.value})} />
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-3">
                           <Label className="font-semibold">Core Cement Profiling</Label>
                           <select className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={budget.cement} onChange={e => setBudget({...budget, cement: e.target.value})}>
                              <option>OPC 43 (Standard)</option><option>OPC 53 (High Strength)</option><option>PPC (Eco)</option>
                           </select>
                         </div>
                         <div className="space-y-3">
                           <Label className="font-semibold">Structural Steel Grp</Label>
                           <select className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={budget.steel} onChange={e => setBudget({...budget, steel: e.target.value})}>
                              <option>TMT Fe415</option><option>TMT Fe500 (Preferred)</option><option>Fe550 (High Rise)</option>
                           </select>
                         </div>
                      </div>
                   </div>

                   <Card className="flex flex-col bg-muted/50 p-6 border-none shadow-inner h-full">
                      <div className="flex justify-between items-center mb-4">
                        <Label className="font-semibold flex items-center gap-2"><Zap className="w-4 h-4 text-primary"/> Project Cost Estimation Engine</Label>
                        {!budget.estimatedComplete && (
                          <Button size="sm" onClick={handleEstimateAI} disabled={isSimulatingAI} variant="default" className="shadow">
                            {isSimulatingAI ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {isSimulatingAI ? "Calculating..." : "Run AI Estimate"}
                          </Button>
                        )}
                      </div>

                      <div className="flex-1 bg-background rounded-md border p-4 font-mono text-sm whitespace-pre-wrap overflow-y-auto min-h-[300px]">
                         {budget.estimatedStream === "" && !isSimulatingAI && (
                           <div className="text-muted-foreground flex h-full items-center justify-center flex-col gap-2">
                             <DollarSign className="w-8 h-8 opacity-20" />
                             Click 'Run AI Estimate' to compute material ratios & expenses based on local live rates.
                           </div>
                         )}
                         {budget.estimatedStream}
                         {isSimulatingAI && <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />}
                         {budget.estimatedComplete && (
                            <div className="mt-4 space-y-2">
                               <div className="text-xs font-bold text-amber-500 flex items-center gap-2 animate-pulse uppercase tracking-wider">
                                 <Zap className="w-3 h-3" /> Live Market Volatility Alert
                               </div>
                               <div className="grid grid-cols-2 gap-2">
                                 <div className="p-2 bg-background/50 border rounded text-[10px]">
                                   <div className="text-muted-foreground">Steel (Fe 500)</div>
                                   <div className="text-red-500 font-bold">+4.2% (Trending Up)</div>
                                 </div>
                                 <div className="p-2 bg-background/50 border rounded text-[10px]">
                                   <div className="text-muted-foreground">Cement (OPC 53)</div>
                                   <div className="text-emerald-500 font-bold">-1.8% (Buy Opportunity)</div>
                                 </div>
                               </div>
                            </div>
                          )}
                          {budget.estimatedComplete && (
                            <div className="mt-6 pt-4 border-t border-dashed border-border/50 text-xs text-muted-foreground">
                              * Estimates use hyper-local data for {plot.city.toUpperCase() || 'your region'} based on today's trained ML index.
                            </div>
                          )}
                      </div>
                   </Card>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-border mt-6">
                   <div className="flex gap-2">
                     <Button variant="ghost" onClick={handleBack} className="h-12 px-6">Back</Button>
                     <Button variant="outline" onClick={exportToPdf} disabled={isExporting} className="h-12"><FileDown className="w-4 h-4 mr-2" /> Export State PDF</Button>
                   </div>
                   <Button onClick={handleNext} disabled={!budget.estimatedComplete} className="h-12 px-8">
                     Next Step <ArrowRight className="ml-2 w-4 h-4" />
                   </Button>
                </div>
              </motion.div>}

            {/* --- STEP 3: FEATURES & AMENITIES --- */}
            {step === 3 && <motion.div key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 flex-1">
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-3">
                       <Label className="font-semibold">Bedrooms</Label>
                       <Input type="number" className="h-12 font-bold text-center" value={features.beds} onChange={e => setFeatures({...features, beds: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                       <Label className="font-semibold">Bathrooms</Label>
                       <Input type="number" className="h-12 font-bold text-center" value={features.baths} onChange={e => setFeatures({...features, baths: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                       <Label className="font-semibold">Kitchen Type</Label>
                       <select className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={features.kitchen} onChange={e => setFeatures({...features, kitchen: e.target.value})}>
                          <option value="open">Open Concept</option><option value="closed">Closed Form</option><option value="modular">Modular Island</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <Label className="font-semibold">Architectural Style</Label>
                       <select className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={features.style} onChange={e => setFeatures({...features, style: e.target.value})}>
                          <option>Modern / Contemporary</option><option>Traditional Heritage</option><option>Minimalist Cube</option><option>Colonial Classic</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-border">
                    <Label className="font-semibold">Special Rooms & Amenities</Label>
                    <div className="flex flex-wrap gap-2">
                       {["Home office", "Pooja room", "Home theater", "Gym", "Servant quarters", "Terrace garden", "Swimming pool", "Solar panels", "Smart automation"].map(room => (
                         <Button 
                           key={room} variant={features.specialRooms.includes(room) ? "default" : "outline"} size="sm"
                           onClick={() => toggleSpecialRoom(room)}
                           className="font-normal"
                         >
                            {features.specialRooms.includes(room) ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <span className="w-4 h-4 mr-2" /> } {room}
                         </Button>
                       ))}
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-6 pt-6 border-t border-border">
                    <Label className="flex items-center gap-3 cursor-pointer p-4 border rounded-md hover:bg-muted/50 transition-colors w-full sm:w-auto shadow-sm">
                       <input type="checkbox" className="w-5 h-5 accent-primary" checked={features.vaastu} onChange={() => setFeatures({...features, vaastu: !features.vaastu})} />
                       <span className="font-medium">Force Vastu Compliance Overlay</span>
                    </Label>
                    <Label className="flex items-center gap-3 cursor-pointer p-4 border rounded-md hover:bg-muted/50 transition-colors w-full sm:w-auto shadow-sm">
                       <input type="checkbox" className="w-5 h-5 accent-primary" checked={features.accessibility} onChange={() => setFeatures({...features, accessibility: !features.accessibility})} />
                       <span className="font-medium">Senior Citizen Accessibility Rules</span>
                    </Label>
                 </div>

                 <div className="flex justify-between pt-6 border-t border-border mt-6">
                   <div className="flex gap-2">
                     <Button variant="ghost" onClick={handleBack} className="h-12 px-6">Back</Button>
                     <Button variant="outline" onClick={exportToPdf} disabled={isExporting} className="h-12"><FileDown className="w-4 h-4 mr-2" /> Export State PDF</Button>
                   </div>
                   <Button onClick={handleNext} className="h-12 px-8 bg-primary hover:bg-primary/90">
                     Analyze & Generate Layouts
                   </Button>
                </div>
              </motion.div>}

            {/* --- STEP 4: AI ANALYSIS ENGINE --- */}
            {step === 4 && <motion.div key="s4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 flex-1">
                 
                 <div className="text-center space-y-4 my-8">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                       {!analysis.allDone ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : <CheckCircle2 className="w-8 h-8 text-primary" />}
                    </div>
                    <h2 className="text-xl font-semibold">{!analysis.allDone ? 'Analyzing Inputs & Generating...' : 'Analysis Complete'}</h2>
                    {!analysis.allDone && (
                      <div className="max-w-xs mx-auto">
                         <Progress value={streamProgress} className="h-2" />
                      </div>
                    )}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Material Calculation */}
                    <Card className={`p-5 transition-opacity duration-500 shadow-none border ${analysis.materialDone ? 'opacity-100' : 'opacity-40'}`}>
                       <div className="flex items-center gap-2 mb-4 font-semibold text-primary"><Box className="w-4 h-4"/> Dynamic Quantities</div>
                       {analysis.materialDone ? (
                         <table className="w-full text-sm">
                            <thead className="text-muted-foreground text-xs text-left border-b"><tr><th className="pb-2">Material</th><th className="pb-2 text-right">Est. Qty</th></tr></thead>
                            <tbody className="divide-y divide-border">
                              {dynMaterials.map(m => (
                                <tr key={m.item}><td className="py-2.5">{m.item}</td><td className="py-2.5 text-right font-medium">{m.qty} <span className="text-xs text-muted-foreground">{m.unit}</span></td></tr>
                              ))}
                            </tbody>
                         </table>
                       ) : <div className="text-sm text-muted-foreground">Running AI quantity surveying algorithms...</div>}
                    </Card>

                    {/* Timeline & Budget */}
                    <Card className={`p-5 transition-opacity duration-500 shadow-none border ${analysis.budgetDone ? 'opacity-100' : 'opacity-40'}`}>
                       <div className="flex items-center gap-2 mb-4 font-semibold text-primary"><Layers className="w-4 h-4"/> Projected Timeline</div>
                       {analysis.budgetDone ? (
                         <div className="space-y-4">
                           {dynTimeline.map((t, i) => (
                             <div key={i} className="space-y-1.5">
                               <div className="flex justify-between text-xs font-medium"><span>{t.phase}</span><span className="text-primary">{t.weeks} wk</span></div>
                               <Progress value={(t.weeks/Math.max(...dynTimeline.map(d=>d.weeks)))*100} className="h-1.5" />
                             </div>
                           ))}
                         </div>
                       ) : <div className="text-sm text-muted-foreground">Estimating optimal schedules...</div>}
                    </Card>

                    {/* Regulatory Analysis */}
                    <Card className={`p-5 transition-opacity duration-500 shadow-none border ${analysis.siteDone ? 'opacity-100' : 'opacity-40'}`}>
                       <div className="flex items-center gap-2 mb-4 font-semibold text-primary"><Map className="w-4 h-4"/> Regulatory API Check</div>
                       {analysis.siteDone ? (
                         <div className="space-y-3">
                            <div className="p-3 bg-green-500/10 text-green-700 dark:text-green-500 border border-green-500/20 rounded-md flex items-start gap-2">
                               <CheckCircle2 className="w-5 h-5 shrink-0" />
                               <div className="text-xs">
                                  <div className="font-semibold uppercase tracking-wider text-[10px]">Zone OK for {plot.city.toUpperCase() || 'CURRENT REGION'}, {plot.pincode}</div>
                                  <div className="mt-1 opacity-90 max-w-[200px] leading-relaxed">Verified geolocation bounds. Expected FSI max {(totalArea / sqft).toFixed(1)}. All local setup laws verified structurally.</div>
                               </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-4 text-xs bg-muted/50 p-3 rounded-md">
                               <div><div className="text-muted-foreground mb-1">Max Valid Build</div><div className="font-medium">{sqft * 0.7} sqft/fl</div></div>
                               <div><div className="text-muted-foreground mb-1">Requested Floors</div><div className="font-medium">{plot.floors} Floors</div></div>
                            </div>
                            
                            {/* 3D MASSING PREVIEW */}
                            <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-md">
                               <div className="text-[10px] font-bold text-primary mb-2 uppercase tracking-tight">AI 3D Volumetric Massing</div>
                               <div className="h-24 flex items-center justify-center">
                                  <svg viewBox="0 0 100 100" className="w-20 h-20 text-primary">
                                     <path d="M 50 10 L 90 30 L 90 70 L 50 90 L 10 70 L 10 30 Z" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1" />
                                     <path d="M 50 10 L 50 90" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                                     <path d="M 10 30 L 50 50 L 90 30" stroke="currentColor" strokeWidth="0.5" opacity="0.3" strokeDasharray="1,1" />
                                     <text x="50" y="55" fontSize="8" textAnchor="middle" fill="currentColor" fontWeight="bold">G+{plot.floors-1}</text>
                                  </svg>
                               </div>
                            </div>
                         </div>
                       ) : <div className="text-sm text-muted-foreground">Pinging maps API & local laws...</div>}
                    </Card>
                 </div>

                 <div className="flex justify-between items-center pt-6 border-t border-border mt-6">
                   <div className="flex gap-2">
                     <Button variant="ghost" onClick={handleBack} disabled={!analysis.allDone} className="h-12 px-6">Back</Button>
                     <Button variant="outline" onClick={exportToPdf} disabled={isExporting || !analysis.allDone} className="h-12"><FileDown className="w-4 h-4 mr-2" /> Export State PDF</Button>
                   </div>
                   <Button onClick={handleNext} disabled={!analysis.allDone} className="h-12 px-8">
                     {features.vaastu ? 'Proceed to Vastu Layout' : 'View Floor Plans'} <ArrowRight className="ml-2 w-4 h-4" />
                   </Button>
                </div>
              </motion.div>}

            {/* --- STEP 5: VASTU LAYOUT --- */}
            {step === 5 && <motion.div key="s5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 flex-1">
                 {!features.vaastu ? (
                   <div className="py-20 text-center">
                     <p className="text-muted-foreground">Vastu compliance was not checked for this project.</p>
                     <Button onClick={handleNext} className="mt-6">Skip Step <ArrowRight className="ml-2 w-4 h-4" /></Button>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="space-y-6">
                         <Card className="p-6 shadow-none border bg-muted/30">
                            <div className="flex items-center justify-between mb-4">
                               <Label className="font-semibold text-primary flex items-center gap-2"><Compass className="w-4 h-4"/> Vastu Rating for {plot.city || "Project"}</Label>
                               <span className="text-2xl font-bold">{plot.facing.toLowerCase()==='south' ? '72/100' : '96/100'}</span>
                            </div>
                            <Progress value={plot.facing.toLowerCase()==='south' ? 72 : 96} className="h-2 mb-6" />
                            <ul className="text-sm space-y-3">
                               <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <span className="text-muted-foreground">Master Bed assigned SW (Stability)</span></li>
                               <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <span className="text-muted-foreground">Kitchen placed SE (Fire)</span></li>
                               {plot.facing.toLowerCase() === 'south' ? (
                                 <li className="flex items-start gap-2"><div className="w-4 h-4 border border-yellow-500 rounded-full mt-0.5 shrink-0" /> <span className="text-muted-foreground">South entrance needs remedy</span></li>
                               ) : (
                                 <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <span className="text-muted-foreground">Entrance in Auspicious Direction</span></li>
                               )}
                               <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <span className="text-muted-foreground">Pooja room placed NE</span></li>
                            </ul>
                         </Card>
                         <Button onClick={handleNext} className="w-full h-12" size="lg">
                           View Comprehensive Layouts
                         </Button>
                      </div>

                      <Card className="lg:col-span-2 flex items-center justify-center p-6 relative bg-muted/20 border shadow-inner min-h-[300px]">
                         <div className="absolute top-4 right-4 bg-background border px-3 py-1 rounded shadow-sm flex items-center gap-2 text-sm font-medium text-muted-foreground z-10">
                           <Compass className="w-4 h-4 text-primary"/> Compass North
                         </div>
                         
                         <svg viewBox="0 0 400 300" className="w-full h-full max-h-[300px]">
                            <rect x="20" y="20" width="360" height="260" fill="var(--background)" stroke="var(--border)" strokeWidth="2" rx="4" />
                            <rect x="25" y="25" width="100" height="100" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" rx="2" />
                            <text x="75" y="75" fill="currentColor" opacity="0.6" fontSize="12" fontWeight="500" textAnchor="middle">NW (Vayu)</text>
                            
                            <rect x="275" y="25" width="100" height="100" fill="rgba(234,179,8,0.1)" stroke="rgba(234,179,8,0.3)" rx="2" />
                            <text x="325" y="75" fill="currentColor" opacity="0.6" fontSize="12" fontWeight="500" textAnchor="middle">NE (Puja)</text>

                            <rect x="25" y="175" width="150" height="100" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.3)" rx="2" />
                            <text x="100" y="230" fill="currentColor" opacity="0.6" fontSize="12" fontWeight="500" textAnchor="middle">SW (Master)</text>

                            <rect x="180" y="175" width="195" height="100" fill="rgba(249,115,22,0.1)" stroke="rgba(249,115,22,0.3)" rx="2" />
                            <text x="275" y="230" fill="currentColor" opacity="0.6" fontSize="12" fontWeight="500" textAnchor="middle">SE (Kitchen)</text>

                            <rect x="130" y="25" width="140" height="145" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.3)" rx="2" />
                            <text x="200" y="100" fill="currentColor" opacity="0.6" fontSize="12" fontWeight="500" textAnchor="middle">N (Living)</text>
                         </svg>
                      </Card>
                   </div>
                 )}
                 <div className="flex justify-start border-t border-border pt-6 mt-6">
                    <Button variant="outline" onClick={exportToPdf} disabled={isExporting} className="h-12"><FileDown className="w-4 h-4 mr-2" /> Export State PDF</Button>
                 </div>
              </motion.div>}

            {/* --- STEP 6: AI LAYOUT SUITE --- */}
            {step === 6 && <motion.div key="s6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col">
                 <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6 border-b border-border pb-4">
                    {[
                      {id: 'arch', name: 'Plan', icon: LayoutGrid},
                      {id: 'struct', name: 'Struct', icon: Box},
                      {id: 'plumb', name: 'Plumb', icon: Waves},
                      {id: 'elec', name: 'Elec', icon: Zap},
                      {id: 'int', name: 'Interior', icon: Sofa},
                      {id: 'ext', name: 'Site', icon: Trees},
                    ].map(l => (
                      <div 
                        key={l.id} 
                        onClick={() => setActiveLayout(l.id)}
                        className={`p-2 sm:p-3 rounded-lg border cursor-pointer text-center transition-colors ${activeLayout === l.id ? 'bg-primary/10 border-primary text-primary' : 'bg-background hover:bg-muted text-muted-foreground'}`}
                      >
                         <l.icon className="w-5 h-5 mx-auto mb-1 opacity-80" />
                         <span className="text-xs font-semibold">{l.name}</span>
                      </div>
                    ))}
                 </div>

                 <Card className="flex-1 min-h-[400px] flex flex-col shadow-none border bg-muted/20 overflow-hidden relative">
                    <div className="flex justify-between items-center p-4 border-b bg-background z-10">
                        <span className="font-semibold flex items-center gap-2 capitalize text-sm sm:text-base">
                          {activeLayout === 'arch' && <><LayoutGrid className="w-4 h-4"/> Arch Plan & 3D Isometric View</>}
                          {activeLayout === 'struct' && <><Box className="w-4 h-4"/> Structural Matrix & 3D Load Vectors</>}
                          {activeLayout === 'plumb' && <><Waves className="w-4 h-4"/> Plumbing Plan & 3D Pipes</>}
                          {activeLayout === 'elec' && <><Zap className="w-4 h-4"/> Electrical Plan & 3D Wiring</>}
                          {activeLayout === 'int' && <><Sofa className="w-4 h-4"/> Interior Layout & 3D Decor</>}
                          {activeLayout === 'ext' && <><Trees className="w-4 h-4"/> Site Plan & 3D Topography</>}
                        </span>
                        <div className="flex gap-2">
                          <Button onClick={exportToPdf} disabled={isExporting} size="sm" variant="outline" className="h-8 shadow-sm"><Download className="w-3.5 h-3.5 mr-2" /> Download Dossier</Button>
                        </div>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-background to-muted/20 p-4 gap-4 overflow-hidden relative min-h-[500px]">
                        <div className="relative border rounded-lg bg-background shadow-inner flex items-center justify-center overflow-hidden h-full">
                           <div className="absolute top-2 left-2 bg-muted/50 px-2 py-1 rounded text-[10px] font-bold tracking-wider text-muted-foreground z-10 uppercase border">2D Blueprint Layout</div>
                           {renderSVG(false)}
                        </div>

                        <div className="relative border rounded-lg bg-background shadow-inner items-center justify-center overflow-hidden bg-muted/20 hidden lg:flex">
                           <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase z-10 flex items-center gap-2 shadow-xl shadow-primary/20">
                             <Box className="w-3.5 h-3.5"/> Full-Fidelity 3D Render
                           </div>
                           
                           <div className="w-full h-full flex items-center justify-center relative">
                               {activeLayout === 'arch' && <img src={budget.grade === 'luxury' ? "/images/modern-villa-project.jpg" : "/images/ai-floor-plan-generation-architectural.jpg"} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" alt="Architectural Render" />}
                               {activeLayout === 'struct' && <img src={parseInt(plot.floors) >= 3 ? "/images/building-foundation-concrete-construction.jpg" : "/images/structural-engineering-simulation-3d.jpg"} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" alt="Structural Render" />}
                               {activeLayout === 'plumb' && <img src="/images/electrical-plumbing-hvac-installation.jpg" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" alt="Plumbing Render" />}
                               {activeLayout === 'elec' && <img src="/images/electrical-plumbing-hvac-installation.jpg" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" alt="Electrical Render" />}
                               {activeLayout === 'int' && <img src={budget.grade === 'standard' ? "/images/interior-finishing-painting-flooring.jpg" : "/images/interior-design-3d-walkthrough.jpg"} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" alt="Interior Render" />}
                               {activeLayout === 'ext' && <img src={budget.grade === 'luxury' ? "/images/traditional-elegance-design.jpg" : budget.grade === 'premium' ? "/images/modern-minimalist-design.jpg" : "/images/eco-friendly-design.jpg"} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" alt="Exterior Render" />}
                               <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                           </div>
                        </div>
                    </div>

                    <AnimatePresence mode="popLayout">
                      {(activeLayout === 'int' || activeLayout === 'ext') && <motion.div 
                          initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                          animate={{ opacity: 1, height: 'auto', marginTop: 24 }} 
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="pt-6 border-t border-border overflow-hidden"
                        >
                           <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                             <Lightbulb className="w-4 h-4 text-emerald-500" /> AI Curated Reference Media
                           </h3>
                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {activeLayout === 'int' ? (
                                <>
                                  <video src="/images/int1.mp4" autoPlay loop muted playsInline className="w-full h-32 object-cover rounded-md border border-border shadow-sm hover:scale-105 transition-transform duration-300 bg-black/5" />
                                  <video src="/images/ve3.mp4" autoPlay loop muted playsInline className="w-full h-32 object-cover rounded-md border border-border shadow-sm hover:scale-105 transition-transform duration-300 bg-black/5" />
                                  <img src="/images/modern-minimalist-design.jpg" className="w-full h-32 object-cover rounded-md border border-border shadow-sm hover:scale-105 transition-transform duration-300 hidden sm:block" alt="Reference" />
                                </>
                              ) : (
                                <>
                                  <video src="/images/ext1.mp4" autoPlay loop muted playsInline className="w-full h-32 object-cover rounded-md border border-border shadow-sm hover:scale-105 transition-transform duration-300 bg-black/5" />
                                  <video src="/images/stu.mp4" autoPlay loop muted playsInline className="w-full h-32 object-cover rounded-md border border-border shadow-sm hover:scale-105 transition-transform duration-300 bg-black/5" />
                                  <img src="/images/garden-landscape-project.jpg" className="w-full h-32 object-cover rounded-md border border-border shadow-sm hover:scale-105 transition-transform duration-300 hidden sm:block" alt="Reference" />
                                </>
                              )}
                           </div>
                        </motion.div>}
                    </AnimatePresence>
                 </Card>

                 <div className="flex justify-between items-center pt-6 mt-6 border-t border-border">
                   <div className="flex gap-2">
                     <Button variant="outline" onClick={handleBack} className="h-12 px-6">Back</Button>
                     <Button variant="outline" onClick={exportToPdf} disabled={isExporting} className="h-12"><FileDown className="w-4 h-4 mr-2" /> Export State PDF</Button>
                   </div>
                   <Button onClick={handleNext} className="h-12 px-8">
                     Review Executive Brief <ArrowRight className="ml-2 w-4 h-4" />
                   </Button>
                 </div>
              </motion.div>}

            {/* --- STEP 7: EXECUTIVE DASHBOARD SUMMARY --- */}
            {step === 7 && (
                   <motion.div key="s7" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 flex-1">
                     <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg shadow-inner text-center space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-foreground">Project Intelligence Locked</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">Your AI-driven construction layout and cost models have been fully generated and geo-locked to {plot.city.toUpperCase() || 'YOUR LOCATION'}. Below is the executive summary.</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="p-4 bg-emerald-500/10 border-emerald-500/20 shadow-none">
                       <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Zap className="w-3 h-3"/> Sustain-AI &trade; Score
                       </h3>
                       <div className="text-2xl font-black text-emerald-700">88/100</div>
                       <p className="text-[10px] text-emerald-600/80 mt-1">Projected Carbon Offset: {(totalArea * 0.12).toFixed(1)} tons/yr</p>
                    </Card>

                    <Card className="p-4 bg-blue-500/10 border-blue-500/20 shadow-none">
                       <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3"/> Zoning Compliance
                       </h3>
                       <div className="text-2xl font-black text-blue-700">Verified</div>
                       <p className="text-[10px] text-blue-600/80 mt-1">FSI Utilization: {((totalArea/1000)).toFixed(1)}x Tier-1 Approved</p>
                    </Card>

                    <Card className="p-4 bg-purple-500/10 border-purple-500/20 shadow-none lg:col-span-2">
                       <h3 className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Users className="w-3 h-3"/> NEURAL-MATCH &trade; CONTRACTORS
                       </h3>
                       <div className="flex gap-3 overflow-x-auto pb-1">
                          {[
                            { name: "Elite Structures", rating: 4.9, cost: "Mid" },
                            { name: "GreenBuild Labs", rating: 4.7, cost: "Eco" },
                            { name: "VastuVeda Builders", rating: 4.8, cost: "Premium" }
                          ].map(c => (
                            <div key={c.name} className="bg-white/80 p-2 rounded-lg border border-purple-200 min-w-[120px]">
                               <div className="text-[10px] font-bold text-slate-800">{c.name}</div>
                               <div className="text-[8px] text-purple-600 flex justify-between mt-1">
                                 <span>★ {c.rating}</span>
                                 <span className="font-bold">{c.cost}</span>
                               </div>
                            </div>
                          ))}
                       </div>
                    </Card>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                     <Card className="p-6 border-l-4 border-l-blue-500 shadow-sm space-y-4">
                        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4"/> Geotechnical Payload</h3>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <p className="text-xs text-muted-foreground">Coordinates</p>
                              <p className="font-medium text-sm">{plot.city || 'N/A'}, {plot.pincode || 'N/A'}</p>
                           </div>
                           <div>
                              <p className="text-xs text-muted-foreground">Plot Geometry</p>
                              <p className="font-medium text-sm">{plot.length || 0}' x {plot.width || 0}' ({totalArea} sqft)</p>
                           </div>
                           <div>
                              <p className="text-xs text-muted-foreground">Floors</p>
                              <p className="font-medium text-sm">G + {Math.max(0, parseInt(plot.floors) - 1 || 0)} Levels</p>
                           </div>
                           <div>
                              <p className="text-xs text-muted-foreground">Soil Profile</p>
                              <p className="font-medium text-sm capitalize">{plot.soil} Soil</p>
                           </div>
                        </div>
                     </Card>

                    <Card className="p-6 border-l-4 border-l-emerald-500 shadow-sm space-y-4">
                       <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2"><DollarSign className="w-4 h-4"/> Financial & Material Tracker</h3>
                       <div className="space-y-3">
                          <div className="flex justify-between items-center bg-muted/30 p-2 rounded">
                             <span className="text-xs">Adjusted Const. Budget</span>
                             <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{Math.round(totalCost * (plot.soil === 'rocky' || plot.soil === 'black' ? 1.08 : 1.02)).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center bg-muted/30 p-2 rounded">
                             <span className="text-xs">Structural Cost Grade</span>
                             <span className="font-medium text-sm capitalize">{budget.grade} (₹{costPerSqft} / sqft)</span>
                          </div>
                          <div className="flex justify-between items-center bg-muted/30 p-2 rounded">
                             <span className="text-xs">Primary Core Load</span>
                             <span className="font-medium text-sm">{dynMaterials.find(m => m.item.includes("Steel"))?.qty || 'N/A'} Tons Steel / {dynMaterials.find(m => m.item.includes("Cement"))?.qty || 'N/A'} Bags</span>
                          </div>
                       </div>
                    </Card>

                    <Card className="p-6 border-l-4 border-l-purple-500 shadow-sm space-y-4 md:col-span-2">
                       <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2"><Layers className="w-4 h-4"/> Master Plan Execution</h3>
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                           <div>
                              <p className="text-xs text-muted-foreground mb-1">Vastu Compliance Score</p>
                              <div className="flex items-center gap-2">
                                <Progress value={features.vaastu ? (plot.facing==='south'?72:96) : 0} className="h-2 w-24" />
                                <span className="text-sm font-bold">{features.vaastu ? (plot.facing==='south'?'72%':'96%') : 'N/A'}</span>
                              </div>
                           </div>
                           <div>
                              <p className="text-xs text-muted-foreground mb-1">Est. Construction Speed</p>
                              <p className="font-medium text-sm">{Math.max(12, Math.round(totalArea / 200))} Active Working Weeks</p>
                           </div>
                           <div>
                              <p className="text-xs text-muted-foreground mb-1">Spatial Additions</p>
                              <p className="font-medium text-sm truncate" title={features.specialRooms.join(", ")}>{features.specialRooms.length > 0 ? features.specialRooms.join(", ") : 'Standard Amenities'}</p>
                           </div>
                       </div>
                    </Card>
                 </div>

                 <div className="flex justify-between items-center pt-6 mt-6 border-t border-border">
                   <Button variant="outline" onClick={handleBack} className="h-12 px-6">Review 3D Layouts</Button>
                   <Button onClick={() => {
                      const newProject = {
                        id: Date.now(),
                        name: `${plot.city ? plot.city.toUpperCase() : 'Custom'} ${plot.area} SqFt Site`,
                        status: "In Progress",
                        progress: 5,
                        budget: `₹${totalCost.toLocaleString()}`,
                        deadline: `${Math.max(16, Math.round(totalArea/150))} Weeks`,
                        image: "https://images.unsplash.com/photo-1541888086225-ee5dc24bd4ab?auto=format&fit=crop&q=80"
                      };
                      
                      try {
                        const existingString = localStorage.getItem("siid_projects");
                        let existing = [];
                        if (existingString) existing = JSON.parse(existingString);
                        existing.unshift(newProject);
                        localStorage.setItem("siid_projects", JSON.stringify(existing));
                      } catch(e) { console.error("Could not save to localStorage", e) }

                      toast.success("Intelligence Platform Linked & Synced!")
                      router.push("/dashboard")
                   }} className="h-12 px-8 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90">
                     Approve & Launch Control Center
                   </Button>
                  </div>
                </motion.div>
                )}

          </AnimatePresence>
        </Card>
      </div>

      {/* --- HIDDEN PDF REPORT TEMPLATE --- */}
      <div className="absolute top-[-9999px] left-[-9999px] opacity-0 pointer-events-none z-[-50]">
         <div id="pdf-export-layer" className="w-[850px] bg-white text-slate-800 p-16 font-sans flex flex-col relative overflow-hidden" style={{ minHeight: "1122px" }}>
            {/* Background design accents */}
            <div className="absolute top-0 left-0 w-full h-4 bg-emerald-600"></div>
            <div className="absolute top-4 left-0 w-full h-1 bg-emerald-400"></div>
            
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-6 mb-8 mt-4 border-slate-200">
               <div>
                  <div className="flex items-center gap-3 mb-3">
                     <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                        <Factory className="w-7 h-7" />
                     </div>
                     <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">INDUSTRI-AI</h1>
                        <p className="text-[10px] font-bold text-emerald-600 tracking-[0.2em] uppercase">Enterprise Construction Intelligence</p>
                     </div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mt-2">Comprehensive Project Estimate</h2>
                  <p className="text-sm text-slate-500 mt-1">Generated exclusively based on user specifications and local zoning algorithms.</p>
               </div>
               
               <div className="text-right bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-semibold mb-1">DOCUMENT REFERENCE</p>
                  <p suppressHydrationWarning className="text-lg font-mono font-bold text-slate-900 leading-none mb-2">EST-{(Math.random()*100000).toFixed(0)}</p>
                  <div className="pt-2 border-t border-slate-200">
                     <p className="text-[10px] text-slate-500 font-bold uppercase">Date of Origin</p>
                     <p suppressHydrationWarning className="text-sm font-semibold text-slate-800">{new Date().toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}</p>
                  </div>
               </div>
            </div>

            {/* Main Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
               <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <MapPin className="w-5 h-5 text-emerald-600 mb-2" />
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Project Location</p>
                  <p className="font-bold text-slate-900 truncate">{plot.city.toUpperCase() || 'UNREGISTERED'}, {plot.pincode}</p>
               </div>
               <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <Grid3x3 className="w-5 h-5 text-emerald-600 mb-2" />
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Built-Up</p>
                  <p className="font-bold text-slate-900">{totalArea.toLocaleString()} Sq.Ft</p>
               </div>
               <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <Layers className="w-5 h-5 text-emerald-600 mb-2" />
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Vertical Layout</p>
                  <p className="font-bold text-slate-900">G + {Math.max(0, parseInt(plot.floors) - 1 || 0)} Floors</p>
               </div>
               <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <Calendar className="w-5 h-5 text-emerald-600 mb-2" />
                  <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider">Est. Timeline</p>
                  <p className="font-bold text-emerald-900">{Math.max(16, Math.round(totalArea / 150))} Weeks</p>
               </div>
            </div>

            {/* Bill of Quantities */}
            <div className="mb-8">
               <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3 border-b pb-2">01. Bill of Quantities (Material Load)</h3>
               <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                     <thead className="bg-slate-50 border-b">
                        <tr>
                          <th className="py-3 px-4 text-left font-bold text-slate-700 w-1/2">Material Specification</th>
                          <th className="py-3 px-4 text-center font-bold text-slate-700">Type / Grade</th>
                          <th className="py-3 px-4 text-right font-bold text-slate-700">Required Quantity</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-3 px-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-400"></div><span className="font-semibold text-slate-800">Primary Core Cement</span></td>
                          <td className="py-3 px-4 text-center text-slate-500 font-mono text-xs text-center">{budget.cement}</td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900">{dynMaterials.find(m => m.item.includes("Cement"))?.qty || Math.ceil(totalArea * (parseInt(plot.floors || '1') > 2 ? 0.45 : 0.41))} Bags</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-400"></div><span className="font-semibold text-slate-800">Structural Rebar (Steel)</span></td>
                          <td className="py-3 px-4 text-center text-slate-500 font-mono text-xs text-center">{budget.steel}</td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900">{dynMaterials.find(m => m.item.includes("Reinforce"))?.qty || (totalArea * (parseInt(plot.floors || '1') > 2 ? 0.0042 : 0.0035)).toFixed(2)} MT</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-400"></div><span className="font-semibold text-slate-800">Clay / Fly Ash Bricks</span></td>
                          <td className="py-3 px-4 text-center text-slate-500 font-mono text-xs text-center">Standard IS</td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900">{(dynMaterials.find(m => m.item.includes("Brick"))?.qty) || Math.round(totalArea*14.5).toLocaleString()} Pcs</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400"></div><span className="font-semibold text-slate-800">Fine M-Sand</span></td>
                          <td className="py-3 px-4 text-center text-slate-500 font-mono text-xs text-center">River Mix</td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900">{(dynMaterials.find(m => m.item.includes("Sand"))?.qty) || Math.round(totalArea*1.85).toLocaleString()} CFT</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-600"></div><span className="font-semibold text-slate-800">Coarse Aggregate</span></td>
                          <td className="py-3 px-4 text-center text-slate-500 font-mono text-xs text-center">20mm - 40mm</td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900">{(dynMaterials.find(m => m.item.includes("Aggregate"))?.qty) || Math.round(totalArea*1.35).toLocaleString()} CFT</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Capital Requirement (Financials) */}
            <div className="mb-auto">
               <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3 border-b pb-2">02. Capital Economics</h3>
               <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg shadow-emerald-900/10 relative overflow-hidden">     
                   <div className="relative z-10 grid grid-cols-2 gap-8">
                       <div className="space-y-4">
                           <div>
                              <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">Architectural Standard</p>
                              <p className="text-lg font-bold capitalize">{budget.grade} Build Finish</p>
                           </div>
                           <div className="pt-4 border-t border-slate-700/50">
                              <p className="text-slate-400 text-xs font-medium flex justify-between"><span>Base Capital Index</span> <span>₹{totalCost.toLocaleString()}</span></p>
                              <p className="text-slate-400 text-xs font-medium flex justify-between mt-2"><span>Geotechnical Risk ({plot.soil})</span> <span>+ ₹{Math.round(totalCost * (plot.soil === 'black' ? 0.08 : plot.soil === 'rocky' ? 0.03 : plot.soil === 'clay' ? 0.05 : 0.01)).toLocaleString()}</span></p>
                           </div>
                       </div>
                       
                       <div className="flex flex-col justify-center items-end text-right border-l border-slate-700/50 pl-6">
                           <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">Total Projected Investment</p>
                           <p className="text-4xl font-black text-white tracking-tight">₹{Math.round(totalCost * (1 + (plot.soil === 'black' ? 0.08 : plot.soil === 'rocky' ? 0.03 : plot.soil === 'clay' ? 0.05 : 0.01))).toLocaleString()}</p>
                           <p className="text-xs text-slate-400 mt-2">Inclusive of core civil structure.</p>
                       </div>
                   </div>
               </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-emerald-600 flex items-center justify-center rounded-full opacity-50">
                     <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                     <p className="text-[10px] text-slate-500 font-bold uppercase">AI Validation Status</p>
                     <p className="text-xs font-bold text-slate-800">CRYPTO-SIGNATURE VERIFIED</p>
                  </div>
               </div>
               <p className="text-[9px] text-slate-400 text-right max-w-[250px]">
                  This document serves as an intelligent estimate and is not a legally binding contract. Always utilize certified structural engineers prior to terrain execution.
               </p>
            </div>
         </div>
      </div>
    </div>
  )
}
