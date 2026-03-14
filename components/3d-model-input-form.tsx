"use client"

import type React from "react"
import { useState } from "react"
import type { BuildingInputs } from "@/lib/3d-model-generator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Building2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/lib/i18n/translations"

interface ThreeDModelInputFormProps {
  onGenerate: (inputs: BuildingInputs) => void
}

export function ThreeDModelInputForm({ onGenerate }: ThreeDModelInputFormProps) {
  const { language } = useLanguage()
  const t: any = useTranslation(language)
  const [inputs, setInputs] = useState<BuildingInputs>({
    // A. USER INPUT SYSTEM - Plot & Structure
    plotDimensions: { length: 20, width: 15 },
    plotOrientation: "N",
    roadPosition: "single",
    numberOfFloors: 2,
    floorHeight: 3,
    hasBasement: false,
    parkingType: "open",
    staircaseType: "straight",
    hasLift: false,
    liftCapacity: 6,
    terraceType: "open",

    // Architectural Inputs
    roomsPerFloor: 4,
    balconyCount: 2,
    balconySize: { width: 2, length: 1.5 },
    corridorWidth: 1.2,
    doorSize: { width: 1.2, height: 2.2 },
    windowSize: { width: 1.5, height: 1.5 },
    ceilingHeight: 3,
    roofType: "flat",
    facadeStyle: "modern",
    exteriorSymmetry: true,
    overhangDepth: 0.5,

    // Material & Finish Inputs
    wallMaterial: "brick",
    flooringMaterial: ["tile", "wood"],
    exteriorCladding: "paint",
    glassType: "clear",
    colorPalette: ["#f5f5f5", "#8b4513", "#87ceeb"],

    designStyle: "modern",
    materials: {
      wallColor: "#f5f5f5",
      floorColor: "#cccccc",
      roofColor: "#8b4513",
      doorColor: "#8b4513",
      windowColor: "#87ceeb",
      wallRoughness: 0.8,
      wallMetalness: 0.0,
      glassOpacity: 0.4,
      glassReflectivity: 0.9,
    },

    // D. CAMERA SYSTEM
    cameraMode: "orbit",
    cameraSpeed: "normal",
    cameraHeight: 1.7,
    enableDepthOfField: false,

    // C. REALISTIC MATERIALS & LIGHTING
    lightingMode: "day",
    weatherPreset: "sunny",
    enablePBR: true,
    textureQuality: "high",
    enableShadows: true,
    shadowQuality: "high",
    enableAO: true,
    enableReflections: true,

    // E. REAL-TIME RENDERING & PERFORMANCE
    enableAdaptiveQuality: true,
    targetFPS: 60,
    enableLOD: true,
    enableTextureStreaming: true,
    renderQuality: "high",
  })

  const updateInput = (path: string, value: any) => {
    const newInputs = { ...inputs }
    const keys = path.split(".")
    let current: any = newInputs
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] }
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
    setInputs(newInputs)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate(inputs)
  }

  // Simplified Field Components
  const NumberField = ({ label, id, path, min, max, step = 1 }: any) => {
    const value = path.split(".").reduce((obj: any, key: string) => obj?.[key], inputs)
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value ?? ""}
          onChange={(e) => updateInput(path, Number(e.target.value))}
        />
      </div>
    )
  }

  const SelectField = ({ label, id, path, options }: any) => {
    const value = path.split(".").reduce((obj: any, key: string) => obj?.[key], inputs)
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Select value={value} onValueChange={(val) => updateInput(path, val)}>
          <SelectTrigger id={id}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt: any) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  const SwitchField = ({ label, id, path, description }: any) => {
    const value = path.split(".").reduce((obj: any, key: string) => obj?.[key], inputs)
    return (
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor={id}>{label}</Label>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <Switch id={id} checked={!!value} onCheckedChange={(checked) => updateInput(path, checked)} />
      </div>
    )
  }

  const SliderField = ({ label, id, path, min, max, step = 0.1 }: any) => {
    const value = path.split(".").reduce((obj: any, key: string) => obj?.[key], inputs)
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor={id}>{label}</Label>
          <span className="text-xs font-mono text-muted-foreground">
            {typeof value === "number" ? value.toFixed(2) : value}
          </span>
        </div>
        <Slider
          id={id}
          min={min}
          max={max}
          step={step}
          value={[value || 0]}
          onValueChange={([val]) => updateInput(path, val)}
        />
      </div>
    )
  }

  const ColorField = ({ label, id, path }: any) => {
    const value = path.split(".").reduce((obj: any, key: string) => obj?.[key], inputs)
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <div className="flex gap-2">
          <Input
            id={id}
            type="color"
            value={value || "#ffffff"}
            onChange={(e) => updateInput(path, e.target.value)}
            className="h-10 w-20"
          />
          <Input
            type="text"
            value={value || "#ffffff"}
            onChange={(e) => updateInput(path, e.target.value)}
            className="flex-1 font-mono text-xs"
          />
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-t-4 border-t-primary overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">3D Architecture AI Generator</CardTitle>
            <CardDescription className="text-sm">Configure advanced parameters for the generative engine</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs defaultValue="plot" className="w-full">
            <TabsList className="grid grid-cols-6 w-full h-auto p-1 bg-muted/50 rounded-xl mb-6">
              <TabsTrigger value="plot" className="py-2.5 rounded-lg data-[state=active]:shadow-md transition-all">
                {t.plotTab}
              </TabsTrigger>
              <TabsTrigger
                value="architecture"
                className="py-2.5 rounded-lg data-[state=active]:shadow-md transition-all"
              >
                {t.architectureTab}
              </TabsTrigger>
              <TabsTrigger value="materials" className="py-2.5 rounded-lg data-[state=active]:shadow-md transition-all">
                {t.materialsTab}
              </TabsTrigger>
              <TabsTrigger value="camera" className="py-2.5 rounded-lg data-[state=active]:shadow-md transition-all">
                {t.cameraTab}
              </TabsTrigger>
              <TabsTrigger value="lighting" className="py-2.5 rounded-lg data-[state=active]:shadow-md transition-all">
                {t.lightingTab}
              </TabsTrigger>
              <TabsTrigger value="performance" className="py-2.5 rounded-lg data-[state=active]:shadow-md transition-all">
                {t.performanceTab}
              </TabsTrigger>
            </TabsList>

            {/* Plot Information */}
            <TabsContent value="plot" className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <NumberField label={t.length} id="plotLength" path="plotDimensions.length" min={5} max={100} />
                <NumberField label={t.width} id="plotWidth" path="plotDimensions.width" min={5} max={100} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <SelectField
                  label={t.plotOrientation}
                  id="plotOrientation"
                  path="plotOrientation"
                  options={[
                    { value: "N", label: "North" },
                    { value: "S", label: "South" },
                    { value: "E", label: "East" },
                    { value: "W", label: "West" },
                    { value: "NE", label: "North East" },
                    { value: "NW", label: "North West" },
                    { value: "SE", label: "South East" },
                    { value: "SW", label: "South West" },
                  ]}
                />
                <SelectField
                  label={t.roadPosition}
                  id="roadPosition"
                  path="roadPosition"
                  options={[
                    { value: "single", label: "Single Front View" },
                    { value: "corner", label: "Corner Plot (2 Roads)" },
                    { value: "three-side", label: "Three Side Open" },
                    { value: "four-side", label: "Four Side Open" },
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <NumberField label={t.numberOfFloors} id="floors" path="numberOfFloors" min={1} max={50} />
                <NumberField label={t.floorHeight} id="floorHeight" path="floorHeight" min={2.4} max={4.5} step={0.1} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <SwitchField label={t.hasBasement} id="basement" path="hasBasement" description="Include parking" />
                <SelectField
                  label={t.parkingType}
                  id="parking"
                  path="parkingType"
                  options={[
                    { value: "open", label: "Open Parking" },
                    { value: "stilt", label: "Stilt Parking" },
                    { value: "basement", label: "Basement Parking" },
                    { value: "automated", label: "Automated System" },
                  ]}
                />
              </div>
            </TabsContent>

            {/* Architecture Information */}
            <TabsContent value="architecture" className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <NumberField label={t.roomsPerFloor} id="rooms" path="roomsPerFloor" min={1} max={20} />
                <NumberField label={t.balconyCount} id="balcony" path="balconyCount" min={0} max={10} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <SelectField
                  label={t.staircaseType}
                  id="staircase"
                  path="staircaseType"
                  options={[
                    { value: "straight", label: "Straight Run" },
                    { value: "dog-legged", label: "Dog-Legged" },
                    { value: "spiral", label: "Modern Spiral" },
                    { value: "u-shaped", label: "U-Shaped" },
                  ]}
                />
                <SwitchField label={t.hasLift} id="lift" path="hasLift" description="Passenger elevator" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <SelectField
                  label={t.roofType}
                  id="roofType"
                  path="roofType"
                  options={[
                    { value: "flat", label: "Modern Flat" },
                    { value: "sloped", label: "Traditional Sloped" },
                    { value: "pitched", label: "Pitched Roof" },
                    { value: "terraced", label: "Usable Terrace" },
                  ]}
                />
                <SelectField
                  label={t.facadeStyle}
                  id="facadeStyle"
                  path="facadeStyle"
                  options={[
                    { value: "modern", label: "Contemporary Modern" },
                    { value: "minimalist", label: "Minimalist" },
                    { value: "industrial", label: "Industrial Loft" },
                    { value: "classical", label: "Neo-Classical" },
                  ]}
                />
              </div>

              <SwitchField
                label={t.exteriorSymmetry}
                id="symmetry"
                path="exteriorSymmetry"
                description="Symmetrical facade design"
              />
            </TabsContent>

            {/* Materials */}
            <TabsContent value="materials" className="space-y-6 pt-4">
              <SelectField
                label={t.wallMaterial}
                id="wallMaterial"
                path="wallMaterial"
                options={[
                  { value: "brick", label: "Brick" },
                  { value: "aac", label: "AAC Block" },
                  { value: "concrete", label: "Concrete" },
                ]}
              />

              <SelectField
                label={t.glassType}
                id="glassType"
                path="glassType"
                options={[
                  { value: "clear", label: "Clear Glass" },
                  { value: "tinted", label: "Tinted Glass" },
                  { value: "reflective", label: "Reflective Glass" },
                ]}
              />

              <div className="grid grid-cols-2 gap-4">
                <ColorField label={t.wallColor} id="wallColor" path="materials.wallColor" />
                <ColorField label={t.roofColor} id="roofColor" path="materials.roofColor" />
                <ColorField label={t.doorColor} id="doorColor" path="materials.doorColor" />
                <ColorField label={t.windowColor} id="windowColor" path="materials.windowColor" />
              </div>

              <div className="space-y-6 pt-2">
                <SliderField label={t.wallRoughness} id="wallRoughness" path="materials.wallRoughness" min={0} max={1} />
                <SliderField label={t.glassOpacity} id="glassOpacity" path="materials.glassOpacity" min={0.1} max={1} />
              </div>
            </TabsContent>

            {/* Camera */}
            <TabsContent value="camera" className="space-y-6 pt-4">
              <SelectField
                label={t.cameraMode}
                id="cameraMode"
                path="cameraMode"
                description="Choose how the camera will move around your building"
                options={[
                  { value: "walkthrough", label: "Walkthrough (Ground Level)" },
                  { value: "flyover", label: "Flyover (Aerial View)" },
                  { value: "orbit", label: "Orbit (360° View)" },
                  { value: "firstperson", label: "First Person View" },
                  { value: "birdseye", label: "Bird's Eye View" },
                  { value: "isometric", label: "Isometric View" },
                  { value: "cinematic", label: "Cinematic Dolly" },
                  { value: "drone", label: "Drone Style" },
                ]}
              />

              <SelectField
                label={t.cameraSpeed}
                id="cameraSpeed"
                path="cameraSpeed"
                options={[
                  { value: "slow", label: t.slow },
                  { value: "normal", label: t.normal },
                  { value: "fast", label: t.fast },
                ]}
              />

              <SliderField label={t.cameraHeight} id="cameraHeight" path="cameraHeight" min={0.5} max={5} />

              <SwitchField
                label={t.depthOfField}
                id="depthOfField"
                path="enableDepthOfField"
                description="Cinematic focus effect"
              />
            </TabsContent>

            {/* Lighting */}
            <TabsContent value="lighting" className="space-y-6 pt-4">
              <SelectField
                label={t.timeOfDay}
                id="lightingMode"
                path="lightingMode"
                options={[
                  { value: "day", label: t.day },
                  { value: "evening", label: t.evening },
                  { value: "night", label: t.night },
                ]}
              />

              <SelectField
                label={t.weatherPreset}
                id="weatherPreset"
                path="weatherPreset"
                options={[
                  { value: "sunny", label: t.sunny },
                  { value: "cloudy", label: t.cloudy },
                  { value: "rainy", label: t.rainy },
                ]}
              />

              <div className="grid grid-cols-2 gap-4">
                <SwitchField label={t.enablePBR} id="pbr" path="enablePBR" description="Physically Based Rendering" />
                <SwitchField label={t.enableShadows} id="shadows" path="enableShadows" description="Real-time shadows" />
              </div>

              {inputs.enableShadows && (
                <SelectField
                  label={t.shadowQuality}
                  id="shadowQuality"
                  path="shadowQuality"
                  options={[
                    { value: "low", label: t.low },
                    { value: "medium", label: t.medium },
                    { value: "high", label: t.high },
                  ]}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <SwitchField label={t.ambientOcclusion} id="ao" path="enableAO" description="Contact shadows" />
                <SwitchField label={t.reflections} id="reflections" path="enableReflections" description="Glass & metal" />
              </div>

              <SelectField
                label={t.textureQuality}
                id="textureQuality"
                path="textureQuality"
                options={[
                  { value: "low", label: `${t.low} (512px)` },
                  { value: "medium", label: `${t.medium} (1024px)` },
                  { value: "high", label: `${t.high} (2048px)` },
                  { value: "4k", label: "Ultra (4K)" },
                ]}
              />
            </TabsContent>

            {/* Performance */}
            <TabsContent value="performance" className="space-y-6 pt-4">
              <SelectField
                label={t.renderQuality}
                id="renderQuality"
                path="renderQuality"
                options={[
                  { value: "low", label: `${t.low} (Fast)` },
                  { value: "medium", label: `${t.medium} (Balanced)` },
                  { value: "high", label: `${t.high} (Quality)` },
                  { value: "ultra", label: `${t.ultra} (Maximum)` },
                ]}
              />

              <SliderField label={t.targetFPS} id="targetFPS" path="targetFPS" min={30} max={120} step={10} />

              <div className="space-y-4">
                <SwitchField
                  label={t.adaptiveQuality}
                  id="adaptiveQuality"
                  path="enableAdaptiveQuality"
                  description="Auto-adjust quality for target FPS"
                />
                <SwitchField
                  label={t.dynamicLOD}
                  id="lod"
                  path="enableLOD"
                  description="Distance-based detail optimization"
                />
                <SwitchField
                  label={t.textureStreaming}
                  id="textureStreaming"
                  path="enableTextureStreaming"
                  description="Load textures progressively"
                />
              </div>

              <div className="p-4 bg-muted/50 rounded-lg space-y-2 border border-border">
                <p className="text-sm font-medium">Performance Optimization Details</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>
                    • Adaptive scaling maintains {inputs.targetFPS} {t.targetFPS} stability
                  </li>
                  <li>• LOD reduces geometry complexity by up to 70%</li>
                  <li>• Streaming optimizes VRAM usage for high-quality textures</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          <Button type="submit" className="w-full" size="lg">
            {t.generateModel}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
