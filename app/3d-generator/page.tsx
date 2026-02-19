"use client"

import { useState } from "react"
import type { BuildingInputs } from "@/lib/3d-model-generator"
import { ThreeDModelInputForm } from "@/components/3d-model-input-form"
import { ThreeDModelViewer } from "@/components/3d-model-viewer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Cable as Cube,
  Maximize2,
  MapPin,
  Building2,
  TrendingUp,
  Mountain,
  FileCheck2,
  CheckCircle2,
} from "lucide-react"

export default function ThreeDGeneratorPage() {
  const [buildingInputs, setBuildingInputs] = useState<BuildingInputs | null>(null)
  const [showViewer, setShowViewer] = useState(false)

  const handleGenerate = (inputs: BuildingInputs) => {
    setBuildingInputs(inputs)
    setShowViewer(true)
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <Cube className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Rule-Based 3D Model Generator</h1>
            <p className="text-lg text-muted-foreground">
              Generate professional 3D building models with automatic camera animations
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <Maximize2 className="w-5 h-5 text-primary mb-2" />
              <CardTitle className="text-sm">Any Plot Shape</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Irregular, L-shaped, or custom contours supported</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                <CheckCircle2 className="w-3 h-3" />
                <span>All configurations</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <MapPin className="w-5 h-5 text-primary mb-2" />
              <CardTitle className="text-sm">Survey Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Real-world GPS-level precision data</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                <CheckCircle2 className="w-3 h-3" />
                <span>GPS precision</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <Building2 className="w-5 h-5 text-primary mb-2" />
              <CardTitle className="text-sm">Urban Plots</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">City constraints and density regulations</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                <CheckCircle2 className="w-3 h-3" />
                <span>Code-compliant</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <TrendingUp className="w-5 h-5 text-primary mb-2" />
              <CardTitle className="text-sm">Corner Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Dual-access and optimal orientation</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                <CheckCircle2 className="w-3 h-3" />
                <span>Enhanced appeal</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <Mountain className="w-5 h-5 text-primary mb-2" />
              <CardTitle className="text-sm">Sloped Land</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Multi-level designs with proper drainage</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                <CheckCircle2 className="w-3 h-3" />
                <span>Terrain-adaptive</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <FileCheck2 className="w-5 h-5 text-primary mb-2" />
              <CardTitle className="text-sm">Professional Output</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Construction-ready documentation</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                <CheckCircle2 className="w-3 h-3" />
                <span>Industry-standard</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div>
          <ThreeDModelInputForm onGenerate={handleGenerate} />
        </div>

        {/* 3D Viewer */}
        <div className="space-y-4">
          {showViewer && buildingInputs ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">3D Preview</h2>
                <Badge variant="secondary" className="gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live Preview
                </Badge>
              </div>
              <ThreeDModelViewer inputs={buildingInputs} autoPlay showControls />

              {/* Model Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Model Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimensions:</span>
                    <span className="font-medium">
                      {buildingInputs.plotDimensions.length}m × {buildingInputs.plotDimensions.width}m
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Floors:</span>
                    <span className="font-medium">{buildingInputs.numberOfFloors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Height:</span>
                    <span className="font-medium">{buildingInputs.numberOfFloors * buildingInputs.floorHeight}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Style:</span>
                    <span className="font-medium capitalize">{buildingInputs.designStyle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Camera Mode:</span>
                    <span className="font-medium capitalize">{buildingInputs.cameraMode}</span>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-full min-h-[600px] flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Cube className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No Model Generated Yet</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Fill in the building parameters on the left and click "Generate 3D Model" to see your building come
                    to life
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Tech Stack Info */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>This 3D generator is powered by industry-standard tools</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <h4 className="font-semibold">Three.js</h4>
            <p className="text-sm text-muted-foreground">
              WebGL-based 3D rendering engine for creating and displaying animated 3D graphics
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold">GLTF Export</h4>
            <p className="text-sm text-muted-foreground">
              Industry-standard 3D model format for importing into Blender, Unity, or other tools
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold">WebGL</h4>
            <p className="text-sm text-muted-foreground">
              Hardware-accelerated graphics API for smooth, high-performance 3D visualization
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
