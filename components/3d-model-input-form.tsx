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

interface ThreeDModelInputFormProps {
  onGenerate: (inputs: BuildingInputs) => void
}

export function ThreeDModelInputForm({ onGenerate }: ThreeDModelInputFormProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate(inputs)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Advanced 3D Building Generator (120+ Features)
        </CardTitle>
        <CardDescription>
          Configure comprehensive building parameters with realistic rendering and performance optimization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="plot" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="plot">Plot</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="camera">Camera</TabsTrigger>
              <TabsTrigger value="lighting">Lighting</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            {/* A. USER INPUT SYSTEM - Plot & Structure Inputs (25 features) */}
            <TabsContent value="plot" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Plot Length (m)</Label>
                  <Input
                    id="length"
                    type="number"
                    min="5"
                    max="100"
                    value={inputs.plotDimensions.length}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        plotDimensions: { ...inputs.plotDimensions, length: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Plot Width (m)</Label>
                  <Input
                    id="width"
                    type="number"
                    min="5"
                    max="100"
                    value={inputs.plotDimensions.width}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        plotDimensions: { ...inputs.plotDimensions, width: Number(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orientation">Plot Orientation</Label>
                  <Select
                    value={inputs.plotOrientation}
                    onValueChange={(value: any) => setInputs({ ...inputs, plotOrientation: value })}
                  >
                    <SelectTrigger id="orientation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="N">North</SelectItem>
                      <SelectItem value="E">East</SelectItem>
                      <SelectItem value="S">South</SelectItem>
                      <SelectItem value="W">West</SelectItem>
                      <SelectItem value="NE">North-East</SelectItem>
                      <SelectItem value="NW">North-West</SelectItem>
                      <SelectItem value="SE">South-East</SelectItem>
                      <SelectItem value="SW">South-West</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roadPosition">Road Position</Label>
                  <Select
                    value={inputs.roadPosition}
                    onValueChange={(value: any) => setInputs({ ...inputs, roadPosition: value })}
                  >
                    <SelectTrigger id="roadPosition">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Side</SelectItem>
                      <SelectItem value="corner">Corner Plot</SelectItem>
                      <SelectItem value="multiple">Multiple Sides</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floors">Number of Floors</Label>
                  <Input
                    id="floors"
                    type="number"
                    min="1"
                    max="10"
                    value={inputs.numberOfFloors}
                    onChange={(e) => setInputs({ ...inputs, numberOfFloors: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floorHeight">Floor Height (m)</Label>
                  <Input
                    id="floorHeight"
                    type="number"
                    min="2.5"
                    max="5"
                    step="0.1"
                    value={inputs.floorHeight}
                    onChange={(e) => setInputs({ ...inputs, floorHeight: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ceilingHeight">Ceiling Height (m)</Label>
                  <Input
                    id="ceilingHeight"
                    type="number"
                    min="2.5"
                    max="5"
                    step="0.1"
                    value={inputs.ceilingHeight}
                    onChange={(e) => setInputs({ ...inputs, ceilingHeight: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="basement">Include Basement</Label>
                  <Switch
                    id="basement"
                    checked={inputs.hasBasement}
                    onCheckedChange={(checked) => setInputs({ ...inputs, hasBasement: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parkingType">Parking Type</Label>
                  <Select
                    value={inputs.parkingType}
                    onValueChange={(value: any) => setInputs({ ...inputs, parkingType: value })}
                  >
                    <SelectTrigger id="parkingType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open Parking</SelectItem>
                      <SelectItem value="stilt">Stilt Parking</SelectItem>
                      <SelectItem value="basement">Basement Parking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="lift">Include Lift</Label>
                  <Switch
                    id="lift"
                    checked={inputs.hasLift}
                    onCheckedChange={(checked) => setInputs({ ...inputs, hasLift: checked })}
                  />
                </div>

                {inputs.hasLift && (
                  <div className="space-y-2">
                    <Label htmlFor="liftCapacity">Lift Capacity (persons)</Label>
                    <Input
                      id="liftCapacity"
                      type="number"
                      min="4"
                      max="20"
                      value={inputs.liftCapacity}
                      onChange={(e) => setInputs({ ...inputs, liftCapacity: Number(e.target.value) })}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            {/* A. Architectural Inputs */}
            <TabsContent value="architecture" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="designStyle">Design Style</Label>
                <Select
                  value={inputs.designStyle}
                  onValueChange={(value: any) => setInputs({ ...inputs, designStyle: value })}
                >
                  <SelectTrigger id="designStyle">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="traditional">Traditional</SelectItem>
                    <SelectItem value="contemporary">Contemporary</SelectItem>
                    <SelectItem value="minimalist">Minimalist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roomsPerFloor">Rooms per Floor</Label>
                  <Input
                    id="roomsPerFloor"
                    type="number"
                    min="1"
                    max="10"
                    value={inputs.roomsPerFloor}
                    onChange={(e) => setInputs({ ...inputs, roomsPerFloor: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="balconyCount">Balcony Count</Label>
                  <Input
                    id="balconyCount"
                    type="number"
                    min="0"
                    max="6"
                    value={inputs.balconyCount}
                    onChange={(e) => setInputs({ ...inputs, balconyCount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="balconyWidth">Balcony Width (m)</Label>
                  <Input
                    id="balconyWidth"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={inputs.balconySize.width}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        balconySize: { ...inputs.balconySize, width: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="balconyLength">Balcony Length (m)</Label>
                  <Input
                    id="balconyLength"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={inputs.balconySize.length}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        balconySize: { ...inputs.balconySize, length: Number(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doorWidth">Door Width (m)</Label>
                  <Input
                    id="doorWidth"
                    type="number"
                    min="0.8"
                    max="2"
                    step="0.1"
                    value={inputs.doorSize.width}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        doorSize: { ...inputs.doorSize, width: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doorHeight">Door Height (m)</Label>
                  <Input
                    id="doorHeight"
                    type="number"
                    min="2"
                    max="3"
                    step="0.1"
                    value={inputs.doorSize.height}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        doorSize: { ...inputs.doorSize, height: Number(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="windowWidth">Window Width (m)</Label>
                  <Input
                    id="windowWidth"
                    type="number"
                    min="0.8"
                    max="3"
                    step="0.1"
                    value={inputs.windowSize.width}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        windowSize: { ...inputs.windowSize, width: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="windowHeight">Window Height (m)</Label>
                  <Input
                    id="windowHeight"
                    type="number"
                    min="0.8"
                    max="2.5"
                    step="0.1"
                    value={inputs.windowSize.height}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        windowSize: { ...inputs.windowSize, height: Number(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="staircaseType">Staircase Type</Label>
                <Select
                  value={inputs.staircaseType}
                  onValueChange={(value: any) => setInputs({ ...inputs, staircaseType: value })}
                >
                  <SelectTrigger id="staircaseType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="straight">Straight</SelectItem>
                    <SelectItem value="spiral">Spiral</SelectItem>
                    <SelectItem value="dogleg">Dog-leg</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roofType">Roof Type</Label>
                  <Select
                    value={inputs.roofType}
                    onValueChange={(value: any) => setInputs({ ...inputs, roofType: value })}
                  >
                    <SelectTrigger id="roofType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="sloped">Sloped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="terraceType">Terrace Type</Label>
                  <Select
                    value={inputs.terraceType}
                    onValueChange={(value: any) => setInputs({ ...inputs, terraceType: value })}
                  >
                    <SelectTrigger id="terraceType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open Terrace</SelectItem>
                      <SelectItem value="garden">Garden Terrace</SelectItem>
                      <SelectItem value="utility">Utility Terrace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="symmetry">Exterior Symmetry</Label>
                  <p className="text-xs text-muted-foreground">Symmetrical facade design</p>
                </div>
                <Switch
                  id="symmetry"
                  checked={inputs.exteriorSymmetry}
                  onCheckedChange={(checked) => setInputs({ ...inputs, exteriorSymmetry: checked })}
                />
              </div>
            </TabsContent>

            {/* A. Material & Finish Inputs / C. Materials */}
            <TabsContent value="materials" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wallMaterial">Wall Material</Label>
                <Select
                  value={inputs.wallMaterial}
                  onValueChange={(value: any) => setInputs({ ...inputs, wallMaterial: value })}
                >
                  <SelectTrigger id="wallMaterial">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brick">Brick</SelectItem>
                    <SelectItem value="aac">AAC Block</SelectItem>
                    <SelectItem value="concrete">Concrete</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="glassType">Glass Type</Label>
                <Select
                  value={inputs.glassType}
                  onValueChange={(value: any) => setInputs({ ...inputs, glassType: value })}
                >
                  <SelectTrigger id="glassType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clear">Clear Glass</SelectItem>
                    <SelectItem value="tinted">Tinted Glass</SelectItem>
                    <SelectItem value="reflective">Reflective Glass</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wallColor">Wall Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="wallColor"
                      type="color"
                      value={inputs.materials?.wallColor || "#f5f5f5"}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          materials: { ...inputs.materials, wallColor: e.target.value },
                        })
                      }
                      className="h-10 w-20"
                    />
                    <Input
                      type="text"
                      value={inputs.materials?.wallColor || "#f5f5f5"}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          materials: { ...inputs.materials, wallColor: e.target.value },
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roofColor">Roof Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="roofColor"
                      type="color"
                      value={inputs.materials?.roofColor || "#8b4513"}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          materials: { ...inputs.materials, roofColor: e.target.value },
                        })
                      }
                      className="h-10 w-20"
                    />
                    <Input
                      type="text"
                      value={inputs.materials?.roofColor || "#8b4513"}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          materials: { ...inputs.materials, roofColor: e.target.value },
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doorColor">Door Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="doorColor"
                      type="color"
                      value={inputs.materials?.doorColor || "#8b4513"}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          materials: { ...inputs.materials, doorColor: e.target.value },
                        })
                      }
                      className="h-10 w-20"
                    />
                    <Input
                      type="text"
                      value={inputs.materials?.doorColor || "#8b4513"}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          materials: { ...inputs.materials, doorColor: e.target.value },
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="windowColor">Window Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="windowColor"
                      type="color"
                      value={inputs.materials?.windowColor || "#87ceeb"}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          materials: { ...inputs.materials, windowColor: e.target.value },
                        })
                      }
                      className="h-10 w-20"
                    />
                    <Input
                      type="text"
                      value={inputs.materials?.windowColor || "#87ceeb"}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          materials: { ...inputs.materials, windowColor: e.target.value },
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wallRoughness">Wall Roughness: {inputs.materials?.wallRoughness?.toFixed(2)}</Label>
                  <Slider
                    id="wallRoughness"
                    min={0}
                    max={1}
                    step={0.05}
                    value={[inputs.materials?.wallRoughness || 0.8]}
                    onValueChange={([value]) =>
                      setInputs({
                        ...inputs,
                        materials: { ...inputs.materials, wallRoughness: value },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="glassOpacity">Glass Opacity: {inputs.materials?.glassOpacity?.toFixed(2)}</Label>
                  <Slider
                    id="glassOpacity"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={[inputs.materials?.glassOpacity || 0.4]}
                    onValueChange={([value]) =>
                      setInputs({
                        ...inputs,
                        materials: { ...inputs.materials, glassOpacity: value },
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>

            {/* D. CAMERA SYSTEM (20 features) */}
            <TabsContent value="camera" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cameraMode">Camera Mode</Label>
                <Select
                  value={inputs.cameraMode}
                  onValueChange={(value: any) => setInputs({ ...inputs, cameraMode: value })}
                >
                  <SelectTrigger id="cameraMode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walkthrough">Walkthrough (Ground Level)</SelectItem>
                    <SelectItem value="flyover">Flyover (Aerial View)</SelectItem>
                    <SelectItem value="orbit">Orbit (360° View)</SelectItem>
                    <SelectItem value="firstperson">First Person View</SelectItem>
                    <SelectItem value="birdseye">Bird's Eye View</SelectItem>
                    <SelectItem value="isometric">Isometric View</SelectItem>
                    <SelectItem value="cinematic">Cinematic Dolly</SelectItem>
                    <SelectItem value="drone">Drone Style</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Choose how the camera will move around your building</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cameraSpeed">Camera Speed</Label>
                <Select
                  value={inputs.cameraSpeed}
                  onValueChange={(value: any) => setInputs({ ...inputs, cameraSpeed: value })}
                >
                  <SelectTrigger id="cameraSpeed">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cameraHeight">Camera Height (m): {inputs.cameraHeight?.toFixed(1)}</Label>
                <Slider
                  id="cameraHeight"
                  min={0.5}
                  max={5}
                  step={0.1}
                  value={[inputs.cameraHeight || 1.7]}
                  onValueChange={([value]) => setInputs({ ...inputs, cameraHeight: value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="depthOfField">Depth of Field Effect</Label>
                  <p className="text-xs text-muted-foreground">Cinematic focus effect</p>
                </div>
                <Switch
                  id="depthOfField"
                  checked={inputs.enableDepthOfField}
                  onCheckedChange={(checked) => setInputs({ ...inputs, enableDepthOfField: checked })}
                />
              </div>
            </TabsContent>

            {/* C. REALISTIC MATERIALS & LIGHTING (20 features) */}
            <TabsContent value="lighting" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lightingMode">Time of Day</Label>
                <Select
                  value={inputs.lightingMode}
                  onValueChange={(value: any) => setInputs({ ...inputs, lightingMode: value })}
                >
                  <SelectTrigger id="lightingMode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day (Bright Sunlight)</SelectItem>
                    <SelectItem value="evening">Evening (Golden Hour)</SelectItem>
                    <SelectItem value="night">Night (Moonlight)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weatherPreset">Weather Preset</Label>
                <Select
                  value={inputs.weatherPreset}
                  onValueChange={(value: any) => setInputs({ ...inputs, weatherPreset: value })}
                >
                  <SelectTrigger id="weatherPreset">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunny">Sunny</SelectItem>
                    <SelectItem value="cloudy">Cloudy</SelectItem>
                    <SelectItem value="rainy">Rainy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pbr">Physically Based Rendering (PBR)</Label>
                    <p className="text-xs text-muted-foreground">Realistic material rendering</p>
                  </div>
                  <Switch
                    id="pbr"
                    checked={inputs.enablePBR}
                    onCheckedChange={(checked) => setInputs({ ...inputs, enablePBR: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="shadows">Enable Shadows</Label>
                    <p className="text-xs text-muted-foreground">Cast and receive shadows</p>
                  </div>
                  <Switch
                    id="shadows"
                    checked={inputs.enableShadows}
                    onCheckedChange={(checked) => setInputs({ ...inputs, enableShadows: checked })}
                  />
                </div>

                {inputs.enableShadows && (
                  <div className="space-y-2">
                    <Label htmlFor="shadowQuality">Shadow Quality</Label>
                    <Select
                      value={inputs.shadowQuality}
                      onValueChange={(value: any) => setInputs({ ...inputs, shadowQuality: value })}
                    >
                      <SelectTrigger id="shadowQuality">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ao">Ambient Occlusion</Label>
                    <p className="text-xs text-muted-foreground">Contact shadow simulation</p>
                  </div>
                  <Switch
                    id="ao"
                    checked={inputs.enableAO}
                    onCheckedChange={(checked) => setInputs({ ...inputs, enableAO: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reflections">Reflections</Label>
                    <p className="text-xs text-muted-foreground">Glass and metallic reflections</p>
                  </div>
                  <Switch
                    id="reflections"
                    checked={inputs.enableReflections}
                    onCheckedChange={(checked) => setInputs({ ...inputs, enableReflections: checked })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="textureQuality">Texture Quality</Label>
                <Select
                  value={inputs.textureQuality}
                  onValueChange={(value: any) => setInputs({ ...inputs, textureQuality: value })}
                >
                  <SelectTrigger id="textureQuality">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (512px)</SelectItem>
                    <SelectItem value="medium">Medium (1024px)</SelectItem>
                    <SelectItem value="high">High (2048px)</SelectItem>
                    <SelectItem value="4k">Ultra (4K)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* E. REAL-TIME RENDERING & PERFORMANCE (15 features) */}
            <TabsContent value="performance" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="renderQuality">Overall Render Quality</Label>
                <Select
                  value={inputs.renderQuality}
                  onValueChange={(value: any) => setInputs({ ...inputs, renderQuality: value })}
                >
                  <SelectTrigger id="renderQuality">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Fast)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                    <SelectItem value="high">High (Quality)</SelectItem>
                    <SelectItem value="ultra">Ultra (Maximum)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetFPS">Target FPS: {inputs.targetFPS}</Label>
                <Slider
                  id="targetFPS"
                  min={30}
                  max={120}
                  step={10}
                  value={[inputs.targetFPS]}
                  onValueChange={([value]) => setInputs({ ...inputs, targetFPS: value })}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="adaptiveQuality">Adaptive Quality Scaling</Label>
                    <p className="text-xs text-muted-foreground">Auto-adjust quality for target FPS</p>
                  </div>
                  <Switch
                    id="adaptiveQuality"
                    checked={inputs.enableAdaptiveQuality}
                    onCheckedChange={(checked) => setInputs({ ...inputs, enableAdaptiveQuality: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lod">Dynamic LOD (Level of Detail)</Label>
                    <p className="text-xs text-muted-foreground">Distance-based detail optimization</p>
                  </div>
                  <Switch
                    id="lod"
                    checked={inputs.enableLOD}
                    onCheckedChange={(checked) => setInputs({ ...inputs, enableLOD: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="textureStreaming">Texture Streaming</Label>
                    <p className="text-xs text-muted-foreground">Load textures progressively</p>
                  </div>
                  <Switch
                    id="textureStreaming"
                    checked={inputs.enableTextureStreaming}
                    onCheckedChange={(checked) => setInputs({ ...inputs, enableTextureStreaming: checked })}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-2">
                <p className="text-sm font-medium">Performance Tips</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Enable adaptive quality for consistent frame rate</li>
                  <li>• Use LOD for large buildings with many details</li>
                  <li>• Lower shadow quality if experiencing slowdowns</li>
                  <li>• Disable reflections and AO for faster rendering</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          <Button type="submit" className="w-full" size="lg">
            Generate Advanced 3D Model
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
