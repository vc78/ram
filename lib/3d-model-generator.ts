import * as THREE from "three"

export interface BuildingInputs {
  // A. USER INPUT SYSTEM - Plot & Structure Inputs (25 features)
  plotDimensions: { length: number; width: number }
  plotOrientation: "N" | "E" | "S" | "W" | "NE" | "NW" | "SE" | "SW"
  roadPosition: "single" | "corner" | "multiple"
  numberOfFloors: number
  floorHeight: number
  hasBasement: boolean
  parkingType: "open" | "stilt" | "basement"
  staircaseType: "straight" | "spiral" | "dogleg"
  hasLift: boolean
  liftCapacity?: number
  terraceType: "open" | "garden" | "utility"

  // Architectural Inputs
  roomsPerFloor: number
  roomDimensions?: { width: number; length: number }[]
  balconyCount: number
  balconySize: { width: number; length: number }
  corridorWidth: number
  doorSize: { width: number; height: number }
  windowSize: { width: number; height: number }
  ceilingHeight: number
  roofType: "flat" | "sloped"
  facadeStyle: "modern" | "classic" | "minimal"
  exteriorSymmetry: boolean
  overhangDepth: number

  // Material & Finish Inputs
  wallMaterial: "brick" | "aac" | "concrete"
  flooringMaterial: string[]
  exteriorCladding: string
  glassType: "clear" | "tinted" | "reflective"
  colorPalette: string[]

  roomLayout?: RoomLayout[]
  designStyle: "modern" | "traditional" | "contemporary" | "minimalist"
  materials?: MaterialOptions

  // D. CAMERA SYSTEM (20 features)
  cameraMode: "walkthrough" | "flyover" | "orbit" | "firstperson" | "birdseye" | "isometric" | "cinematic" | "drone"
  cameraSpeed: "slow" | "normal" | "fast"
  cameraHeight?: number
  cameraPath?: THREE.Vector3[]
  enableDepthOfField: boolean

  // C. REALISTIC MATERIALS & LIGHTING (20 features)
  lightingMode: "day" | "night" | "evening"
  weatherPreset: "sunny" | "cloudy" | "rainy"
  enablePBR: boolean
  textureQuality: "low" | "medium" | "high" | "4k"
  enableShadows: boolean
  shadowQuality: "low" | "medium" | "high"
  enableAO: boolean
  enableReflections: boolean

  // E. REAL-TIME RENDERING & PERFORMANCE (15 features)
  enableAdaptiveQuality: boolean
  targetFPS: number
  enableLOD: boolean
  enableTextureStreaming: boolean
  renderQuality: "low" | "medium" | "high" | "ultra"
}

export interface RoomLayout {
  name: string
  floor: number
  x: number
  y: number
  width: number
  height: number
  doors?: DoorOpening[]
  windows?: WindowOpening[]
}

export interface DoorOpening {
  wall: "north" | "south" | "east" | "west"
  position: number
  width: number
  height: number
}

export interface WindowOpening {
  wall: "north" | "south" | "east" | "west"
  position: number
  width: number
  height: number
  heightFromFloor: number
}

export interface MaterialOptions {
  wallColor?: string
  floorColor?: string
  roofColor?: string
  doorColor?: string
  windowColor?: string
  wallRoughness?: number
  wallMetalness?: number
  glassOpacity?: number
  glassReflectivity?: number
}

export class ThreeDModelGenerator {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private building: THREE.Group
  private inputs: BuildingInputs
  private animationFrameId?: number
  private clock: THREE.Clock
  private raycaster: THREE.Raycaster
  private lights: THREE.Light[] = []
  private performanceMonitor: { fps: number; frameCount: number; lastTime: number }

  // Performance & rendering features
  private lodLevels: Map<THREE.Object3D, THREE.LOD> = new Map()
  private textureCache: Map<string, THREE.Texture> = new Map()
  private geometryCache: Map<string, THREE.BufferGeometry> = new Map()

  constructor(inputs: BuildingInputs, canvas?: HTMLCanvasElement) {
    this.inputs = inputs
    this.scene = new THREE.Scene()
    this.building = new THREE.Group()
    this.clock = new THREE.Clock()
    this.raycaster = new THREE.Raycaster()

    // Initialize performance monitor
    this.performanceMonitor = { fps: 60, frameCount: 0, lastTime: performance.now() }

    // Setup camera with advanced features
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas ? canvas.clientWidth / canvas.clientHeight : window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )

    // Setup renderer with advanced features
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: inputs.renderQuality !== "low",
      alpha: true,
      powerPreference: "high-performance",
    })

    this.renderer.setSize(
      canvas ? canvas.clientWidth : window.innerWidth,
      canvas ? canvas.clientHeight : window.innerHeight,
    )

    // Enable shadow mapping based on settings
    this.renderer.shadowMap.enabled = inputs.enableShadows
    if (inputs.shadowQuality === "high") {
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    } else {
      this.renderer.shadowMap.type = THREE.BasicShadowMap
    }

    // Enable tone mapping for realistic rendering
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1

    // Enable physically correct lighting if PBR is enabled
    if (inputs.enablePBR) {
      this.renderer.physicallyCorrectLights = true
    }

    this.setupScene()
  }

  private setupScene() {
    const { lightingMode, weatherPreset, enablePBR } = this.inputs

    // Set background based on time of day and weather
    if (lightingMode === "day" && weatherPreset === "sunny") {
      this.scene.background = new THREE.Color(0x87ceeb)
      this.scene.fog = new THREE.Fog(0x87ceeb, 50, 200)
    } else if (lightingMode === "evening") {
      this.scene.background = new THREE.Color(0xff6b35)
      this.scene.fog = new THREE.Fog(0xff6b35, 30, 150)
    } else if (lightingMode === "night") {
      this.scene.background = new THREE.Color(0x0a0a2e)
      this.scene.fog = new THREE.Fog(0x0a0a2e, 20, 100)
    } else if (weatherPreset === "cloudy") {
      this.scene.background = new THREE.Color(0xaaaaaa)
      this.scene.fog = new THREE.Fog(0xaaaaaa, 40, 180)
    }

    // Lighting setup based on time of day
    if (lightingMode === "day") {
      // Bright ambient light for daytime
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
      this.scene.add(ambientLight)
      this.lights.push(ambientLight)

      // Strong directional sunlight
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(50, 100, 50)
      directionalLight.castShadow = this.inputs.enableShadows
      if (this.inputs.enableShadows) {
        directionalLight.shadow.camera.left = -50
        directionalLight.shadow.camera.right = 50
        directionalLight.shadow.camera.top = 50
        directionalLight.shadow.camera.bottom = -50
        directionalLight.shadow.mapSize.width = this.inputs.shadowQuality === "high" ? 2048 : 1024
        directionalLight.shadow.mapSize.height = this.inputs.shadowQuality === "high" ? 2048 : 1024
      }
      this.scene.add(directionalLight)
      this.lights.push(directionalLight)
    } else if (lightingMode === "evening") {
      // Warm evening light
      const ambientLight = new THREE.AmbientLight(0xffaa77, 0.4)
      this.scene.add(ambientLight)
      this.lights.push(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xff8844, 0.6)
      directionalLight.position.set(-50, 30, 50)
      directionalLight.castShadow = this.inputs.enableShadows
      this.scene.add(directionalLight)
      this.lights.push(directionalLight)
    } else if (lightingMode === "night") {
      // Low ambient light for night
      const ambientLight = new THREE.AmbientLight(0x444488, 0.2)
      this.scene.add(ambientLight)
      this.lights.push(ambientLight)

      // Moonlight
      const moonLight = new THREE.DirectionalLight(0x8888ff, 0.3)
      moonLight.position.set(30, 50, -30)
      this.scene.add(moonLight)
      this.lights.push(moonLight)
    }

    // Add hemisphere light for realistic sky/ground color blending
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x4a7c59, 0.5)
    this.scene.add(hemiLight)
    this.lights.push(hemiLight)

    // Ground with realistic material
    const groundGeometry = new THREE.PlaneGeometry(200, 200)
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a7c59,
      roughness: 0.8,
      metalness: 0.0,
    })

    if (enablePBR) {
      groundMaterial.roughness = 0.9
      groundMaterial.metalness = 0.0
    }

    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = this.inputs.enableShadows
    this.scene.add(ground)

    // Grid helper (can be toggled off in production)
    if (this.inputs.renderQuality !== "low") {
      const gridHelper = new THREE.GridHelper(100, 50, 0x888888, 0xcccccc)
      gridHelper.material.opacity = 0.25
      gridHelper.material.transparent = true
      this.scene.add(gridHelper)
    }
  }

  public generateBuilding() {
    this.building.clear()

    const {
      plotDimensions,
      numberOfFloors,
      floorHeight,
      hasBasement,
      parkingType,
      terraceType,
      roomLayout,
      designStyle,
      materials,
      balconyCount,
      balconySize,
      hasLift,
      staircaseType,
    } = this.inputs

    let startY = 0

    // B. PROGRAMMATIC 3D MODEL GENERATION - Feature: Basement inclusion
    if (hasBasement) {
      const basementGroup = new THREE.Group()
      basementGroup.position.y = -floorHeight
      this.generateFloorSlab(basementGroup, plotDimensions, "#555555")
      this.generateDefaultFloorPlan(basementGroup, plotDimensions, floorHeight, "minimal", materials)
      this.building.add(basementGroup)
      startY = 0
    }

    // B. Feature: Parking generation
    if (parkingType === "stilt") {
      const stiltGroup = new THREE.Group()
      stiltGroup.position.y = 0
      this.generateStiltParking(stiltGroup, plotDimensions, floorHeight)
      this.building.add(stiltGroup)
      startY = floorHeight
    } else if (parkingType === "basement" && hasBasement) {
      // Parking already handled in basement
    }

    // Generate main floors
    for (let floor = 0; floor < numberOfFloors; floor++) {
      const floorGroup = new THREE.Group()
      floorGroup.position.y = startY + floor * floorHeight

      // B. Feature: Floor-wise geometry instancing & slab generation
      this.generateFloorSlab(floorGroup, plotDimensions, materials?.floorColor)

      // B. Feature: Column placement based on grid logic
      this.generateColumns(floorGroup, plotDimensions, floorHeight)

      // Generate walls and rooms
      if (roomLayout && roomLayout.length > 0) {
        const floorRooms = roomLayout.filter((r) => r.floor === floor)
        floorRooms.forEach((room) => {
          this.generateRoom(floorGroup, room, floorHeight, materials)
        })
      } else {
        this.generateDefaultFloorPlan(floorGroup, plotDimensions, floorHeight, designStyle, materials)
      }

      // B. Feature: Balcony extrusion logic
      if (balconyCount > 0 && floor > 0) {
        for (let i = 0; i < balconyCount; i++) {
          this.generateBalcony(floorGroup, plotDimensions, balconySize, i, balconyCount, materials)
        }
      }

      // B. Feature: Parametric staircase generation
      if (floor < numberOfFloors - 1 || (floor === numberOfFloors - 1 && terraceType !== "open")) {
        this.generateStaircase(floorGroup, staircaseType, plotDimensions, floorHeight, materials)
      }

      // B. Feature: Parametric railing generation
      if (floor > 0) {
        this.generateRailings(floorGroup, plotDimensions, materials)
      }

      this.building.add(floorGroup)
    }

    // B. Feature: Lift shaft auto-modeling
    if (hasLift) {
      this.generateLiftShaft(plotDimensions, numberOfFloors, floorHeight, startY, materials)
    }

    // B. Feature: Roof mesh auto-generation
    const roofHeight = startY + numberOfFloors * floorHeight
    this.generateRoof(roofHeight, plotDimensions, designStyle, terraceType, materials?.roofColor)

    // B. Feature: Compound wall generation
    this.generateCompoundWall(plotDimensions)

    // B. Feature: Gate & entry modeling
    this.generateGate(plotDimensions, materials)

    // B. Feature: Enable LOD if requested
    if (this.inputs.enableLOD) {
      this.applyLOD()
    }

    this.building.castShadow = true
    this.scene.add(this.building)

    // D. CAMERA SYSTEM - Setup camera
    this.setupCamera()
  }

  // B. Feature: Stilt parking generation
  private generateStiltParking(parent: THREE.Group, dimensions: { length: number; width: number }, height: number) {
    const columnMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.8,
      metalness: 0.2,
    })

    const columns = [
      [-dimensions.length / 3, 0, -dimensions.width / 3],
      [-dimensions.length / 3, 0, dimensions.width / 3],
      [dimensions.length / 3, 0, -dimensions.width / 3],
      [dimensions.length / 3, 0, dimensions.width / 3],
    ]

    columns.forEach((pos) => {
      const columnGeom = new THREE.CylinderGeometry(0.3, 0.3, height, 8)
      const column = new THREE.Mesh(columnGeom, columnMaterial)
      column.position.set(pos[0], height / 2, pos[2])
      column.castShadow = true
      parent.add(column)
    })
  }

  // B. Feature: Column placement based on grid logic
  private generateColumns(parent: THREE.Group, dimensions: { length: number; width: number }, height: number) {
    if (!this.inputs.enablePBR) return // Skip columns for simpler renders

    const columnMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.7,
      metalness: 0.1,
    })

    const spacing = 5 // 5 meters between columns
    const cols = Math.floor(dimensions.length / spacing)
    const rows = Math.floor(dimensions.width / spacing)

    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        if (i === 0 || i === cols || j === 0 || j === rows) {
          const x = (i / cols - 0.5) * dimensions.length
          const z = (j / rows - 0.5) * dimensions.width

          const columnGeom = new THREE.BoxGeometry(0.3, height, 0.3)
          const column = new THREE.Mesh(columnGeom, columnMaterial)
          column.position.set(x, height / 2, z)
          column.castShadow = true
          column.receiveShadow = true
          parent.add(column)
        }
      }
    }
  }

  // B. Feature: Balcony extrusion logic
  private generateBalcony(
    parent: THREE.Group,
    plotDimensions: { length: number; width: number },
    balconySize: { width: number; length: number },
    index: number,
    total: number,
    materials?: MaterialOptions,
  ) {
    const balconyMaterial = new THREE.MeshStandardMaterial({
      color: materials?.floorColor || 0xcccccc,
      roughness: 0.7,
    })

    const position = ((index + 1) / (total + 1) - 0.5) * plotDimensions.length

    const balconyGeom = new THREE.BoxGeometry(balconySize.width, 0.2, balconySize.length)
    const balcony = new THREE.Mesh(balconyGeom, balconyMaterial)
    balcony.position.set(position, 0, plotDimensions.width / 2 + balconySize.length / 2)
    balcony.castShadow = true
    balcony.receiveShadow = true
    parent.add(balcony)

    // Add railing
    const railingMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 })
    const railing = new THREE.Mesh(new THREE.BoxGeometry(balconySize.width, 1, 0.05), railingMaterial)
    railing.position.set(position, 0.5, plotDimensions.width / 2 + balconySize.length)
    parent.add(railing)
  }

  // B. Feature: Parametric staircase generation
  private generateStaircase(
    parent: THREE.Group,
    type: string,
    dimensions: { length: number; width: number },
    height: number,
    materials?: MaterialOptions,
  ) {
    const stairMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.6,
    })

    const steps = 15
    const stepHeight = height / steps
    const stepDepth = 0.3

    if (type === "straight") {
      for (let i = 0; i < steps; i++) {
        const stepGeom = new THREE.BoxGeometry(1.5, stepHeight, stepDepth)
        const step = new THREE.Mesh(stepGeom, stairMaterial)
        step.position.set(-dimensions.length / 2 + 2, i * stepHeight, -dimensions.width / 2 + 2 + i * stepDepth)
        step.castShadow = true
        parent.add(step)
      }
    } else if (type === "spiral") {
      const radius = 1.5
      for (let i = 0; i < steps; i++) {
        const angle = (i / steps) * Math.PI * 2
        const stepGeom = new THREE.BoxGeometry(0.8, stepHeight, 0.8)
        const step = new THREE.Mesh(stepGeom, stairMaterial)
        step.position.set(
          Math.cos(angle) * radius - dimensions.length / 2 + 3,
          i * stepHeight,
          Math.sin(angle) * radius - dimensions.width / 2 + 3,
        )
        step.castShadow = true
        parent.add(step)
      }
    } else if (type === "dogleg") {
      const halfSteps = Math.floor(steps / 2)
      // First flight
      for (let i = 0; i < halfSteps; i++) {
        const stepGeom = new THREE.BoxGeometry(1.5, stepHeight, stepDepth)
        const step = new THREE.Mesh(stepGeom, stairMaterial)
        step.position.set(-dimensions.length / 2 + 2, i * stepHeight, -dimensions.width / 2 + 2 + i * stepDepth)
        step.castShadow = true
        parent.add(step)
      }
      // Second flight (reversed)
      for (let i = halfSteps; i < steps; i++) {
        const stepGeom = new THREE.BoxGeometry(1.5, stepHeight, stepDepth)
        const step = new THREE.Mesh(stepGeom, stairMaterial)
        step.position.set(
          -dimensions.length / 2 + 4,
          i * stepHeight,
          -dimensions.width / 2 + 2 + halfSteps * stepDepth - (i - halfSteps) * stepDepth,
        )
        step.castShadow = true
        parent.add(step)
      }
    }
  }

  // B. Feature: Parametric railing generation
  private generateRailings(
    parent: THREE.Group,
    dimensions: { length: number; width: number },
    materials?: MaterialOptions,
  ) {
    const railingMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      roughness: 0.5,
      metalness: 0.5,
    })

    const height = 1
    const thickness = 0.05

    // Create railing around the perimeter
    const railings = [
      { pos: [0, height / 2, dimensions.width / 2], size: [dimensions.length, height, thickness] },
      { pos: [0, height / 2, -dimensions.width / 2], size: [dimensions.length, height, thickness] },
      { pos: [dimensions.length / 2, height / 2, 0], size: [thickness, height, dimensions.width] },
      { pos: [-dimensions.length / 2, height / 2, 0], size: [thickness, height, dimensions.width] },
    ]

    railings.forEach((railing) => {
      const geom = new THREE.BoxGeometry(...(railing.size as [number, number, number]))
      const mesh = new THREE.Mesh(geom, railingMaterial)
      mesh.position.set(...(railing.pos as [number, number, number]))
      parent.add(mesh)
    })
  }

  // B. Feature: Lift shaft auto-modeling
  private generateLiftShaft(
    dimensions: { length: number; width: number },
    floors: number,
    floorHeight: number,
    startY: number,
    materials?: MaterialOptions,
  ) {
    const shaftMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.5,
      metalness: 0.7,
    })

    const shaftWidth = 2
    const shaftDepth = 2
    const shaftHeight = floors * floorHeight

    const shaftGeom = new THREE.BoxGeometry(shaftWidth, shaftHeight, shaftDepth)
    const shaft = new THREE.Mesh(shaftGeom, shaftMaterial)
    shaft.position.set(dimensions.length / 2 - 2, startY + shaftHeight / 2, dimensions.width / 2 - 2)
    shaft.castShadow = true
    this.building.add(shaft)
  }

  // B. Feature: Compound wall generation
  private generateCompoundWall(dimensions: { length: number; width: number }) {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b7355,
      roughness: 0.9,
    })

    const wallHeight = 2.5
    const wallThickness = 0.3
    const offset = Math.max(dimensions.length, dimensions.width) * 0.6

    const walls = [
      { pos: [0, wallHeight / 2, offset], size: [dimensions.length + offset, wallHeight, wallThickness] },
      { pos: [0, wallHeight / 2, -offset], size: [dimensions.length + offset, wallHeight, wallThickness] },
      { pos: [offset, wallHeight / 2, 0], size: [wallThickness, wallHeight, dimensions.width + offset] },
      { pos: [-offset, wallHeight / 2, 0], size: [wallThickness, wallHeight, dimensions.width + offset] },
    ]

    walls.forEach((wall) => {
      const geom = new THREE.BoxGeometry(...(wall.size as [number, number, number]))
      const mesh = new THREE.Mesh(geom, wallMaterial)
      mesh.position.set(...(wall.pos as [number, number, number]))
      mesh.castShadow = true
      mesh.receiveShadow = true
      this.scene.add(mesh)
    })
  }

  // B. Feature: Gate & entry modeling
  private generateGate(dimensions: { length: number; width: number }, materials?: MaterialOptions) {
    const gateMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.4,
      metalness: 0.8,
    })

    const gateWidth = 4
    const gateHeight = 2.5
    const offset = Math.max(dimensions.length, dimensions.width) * 0.6

    const gateGeom = new THREE.BoxGeometry(gateWidth, gateHeight, 0.1)
    const gate = new THREE.Mesh(gateGeom, gateMaterial)
    gate.position.set(0, gateHeight / 2, -offset)
    gate.castShadow = true
    this.scene.add(gate)
  }

  private generateFloorSlab(parent: THREE.Group, dimensions: { length: number; width: number }, color?: string) {
    const cacheKey = `slab-${dimensions.length}-${dimensions.width}`
    let slabGeometry = this.geometryCache.get(cacheKey)

    if (!slabGeometry) {
      slabGeometry = new THREE.BoxGeometry(dimensions.length, 0.2, dimensions.width)
      this.geometryCache.set(cacheKey, slabGeometry)
    }

    const slabMaterial = new THREE.MeshStandardMaterial({
      color: color || 0xcccccc,
      roughness: this.inputs.enablePBR ? 0.8 : 0.7,
      metalness: this.inputs.enablePBR ? 0.1 : 0.0,
    })

    const slab = new THREE.Mesh(slabGeometry, slabMaterial)
    slab.receiveShadow = this.inputs.enableShadows
    slab.castShadow = this.inputs.enableShadows
    parent.add(slab)
  }

  private generateRoom(parent: THREE.Group, room: RoomLayout, floorHeight: number, materials?: MaterialOptions) {
    const wallThickness = 0.2
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: materials?.wallColor || 0xffffff,
      roughness: 0.8,
    })

    // Create room walls
    const walls = [
      { pos: [0, floorHeight / 2, room.height / 2], size: [room.width, floorHeight, wallThickness] }, // North
      { pos: [0, floorHeight / 2, -room.height / 2], size: [room.width, floorHeight, wallThickness] }, // South
      { pos: [room.width / 2, floorHeight / 2, 0], size: [wallThickness, floorHeight, room.height] }, // East
      { pos: [-room.width / 2, floorHeight / 2, 0], size: [wallThickness, floorHeight, room.height] }, // West
    ]

    walls.forEach((wall, idx) => {
      const wallGeometry = new THREE.BoxGeometry(...(wall.size as [number, number, number]))
      const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial)
      wallMesh.position.set(room.x + wall.pos[0], wall.pos[1], room.y + wall.pos[2])
      wallMesh.castShadow = true
      wallMesh.receiveShadow = true
      parent.add(wallMesh)
    })

    // Add doors
    if (room.doors) {
      room.doors.forEach((door) => {
        this.generateDoor(parent, room, door, floorHeight, materials?.doorColor)
      })
    }

    // Add windows
    if (room.windows) {
      room.windows.forEach((window) => {
        this.generateWindow(parent, room, window, materials?.windowColor)
      })
    }
  }

  private generateDefaultFloorPlan(
    parent: THREE.Group,
    dimensions: { length: number; width: number },
    floorHeight: number,
    designStyle: string,
    materials?: MaterialOptions,
  ) {
    const wallThickness = 0.2

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: materials?.wallColor || 0xf5f5f5,
      roughness: materials?.wallRoughness || (this.inputs.enablePBR ? 0.9 : 0.8),
      metalness: materials?.wallMetalness || 0.0,
    })

    // Apply wall material texture based on input
    if (this.inputs.wallMaterial === "brick") {
      wallMaterial.color.setHex(0xb85c4d)
      wallMaterial.roughness = 0.95
    } else if (this.inputs.wallMaterial === "concrete") {
      wallMaterial.color.setHex(0xa0a0a0)
      wallMaterial.roughness = 0.85
    } else if (this.inputs.wallMaterial === "aac") {
      wallMaterial.color.setHex(0xe0e0e0)
      wallMaterial.roughness = 0.9
    }

    // Outer walls
    const walls = [
      { pos: [0, floorHeight / 2, dimensions.width / 2], size: [dimensions.length, floorHeight, wallThickness] },
      { pos: [0, floorHeight / 2, -dimensions.width / 2], size: [dimensions.length, floorHeight, wallThickness] },
      { pos: [dimensions.length / 2, floorHeight / 2, 0], size: [wallThickness, floorHeight, dimensions.width] },
      { pos: [-dimensions.length / 2, floorHeight / 2, 0], size: [wallThickness, floorHeight, dimensions.width] },
    ]

    walls.forEach((wall) => {
      const geometry = new THREE.BoxGeometry(...(wall.size as [number, number, number]))
      const mesh = new THREE.Mesh(geometry, wallMaterial)
      mesh.position.set(...(wall.pos as [number, number, number]))
      mesh.castShadow = this.inputs.enableShadows
      mesh.receiveShadow = this.inputs.enableShadows
      parent.add(mesh)
    })

    // Add windows with glass material based on glass type
    const windowCount = designStyle === "modern" ? 6 : 4
    for (let i = 0; i < windowCount; i++) {
      const position = (i + 1) / (windowCount + 1)
      this.generateWindow(
        parent,
        { x: 0, y: 0, width: dimensions.length, height: dimensions.width, floor: 0, name: "default" },
        {
          wall: i % 2 === 0 ? "north" : "south",
          position,
          width: this.inputs.windowSize.width,
          height: this.inputs.windowSize.height,
          heightFromFloor: 1,
        },
        materials?.windowColor,
      )
    }

    // Add entrance door
    this.generateDoor(
      parent,
      { x: 0, y: 0, width: dimensions.length, height: dimensions.width, floor: 0, name: "default" },
      {
        wall: "south",
        position: 0.5,
        width: this.inputs.doorSize.width,
        height: this.inputs.doorSize.height,
      },
      floorHeight,
      materials?.doorColor,
    )
  }

  private generateDoor(parent: THREE.Group, room: RoomLayout, door: DoorOpening, floorHeight: number, color?: string) {
    const doorMaterial = new THREE.MeshStandardMaterial({
      color: color || 0x8b4513,
      roughness: 0.5,
      metalness: 0.3,
    })

    const doorGeometry = new THREE.BoxGeometry(door.width, door.height, 0.1)
    const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial)

    // Position door based on wall
    let x = room.x
    let z = room.y

    switch (door.wall) {
      case "north":
        x += (door.position - 0.5) * room.width
        z += room.height / 2
        break
      case "south":
        x += (door.position - 0.5) * room.width
        z -= room.height / 2
        break
      case "east":
        x += room.width / 2
        z += (door.position - 0.5) * room.height
        doorMesh.rotation.y = Math.PI / 2
        break
      case "west":
        x -= room.width / 2
        z += (door.position - 0.5) * room.height
        doorMesh.rotation.y = Math.PI / 2
        break
    }

    doorMesh.position.set(x, door.height / 2, z)
    doorMesh.castShadow = true
    parent.add(doorMesh)
  }

  private generateWindow(parent: THREE.Group, room: RoomLayout, window: WindowOpening, color?: string) {
    let glassColor = color || 0x87ceeb
    let opacity = 0.4

    if (this.inputs.glassType === "clear") {
      opacity = 0.3
      glassColor = 0xffffff
    } else if (this.inputs.glassType === "tinted") {
      opacity = 0.5
      glassColor = 0x444444
    } else if (this.inputs.glassType === "reflective") {
      opacity = 0.2
      glassColor = 0x888888
    }

    const windowMaterial = new THREE.MeshStandardMaterial({
      color: glassColor,
      transparent: true,
      opacity: this.inputs.materials?.glassOpacity || opacity,
      roughness: this.inputs.enablePBR ? 0.05 : 0.1,
      metalness: this.inputs.enablePBR ? this.inputs.materials?.glassReflectivity || 0.9 : 0.9,
    })

    if (this.inputs.enableReflections) {
      windowMaterial.envMapIntensity = 1.5
    }

    const windowGeometry = new THREE.BoxGeometry(window.width, window.height, 0.05)
    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial)

    // Position window based on wall
    let x = room.x
    let z = room.y

    switch (window.wall) {
      case "north":
        x += (window.position - 0.5) * room.width
        z += room.height / 2
        break
      case "south":
        x += (window.position - 0.5) * room.width
        z -= room.height / 2
        break
      case "east":
        x += room.width / 2
        z += (window.position - 0.5) * room.height
        windowMesh.rotation.y = Math.PI / 2
        break
      case "west":
        x -= room.width / 2
        z += (window.position - 0.5) * room.height
        windowMesh.rotation.y = Math.PI / 2
        break
    }

    windowMesh.position.set(x, window.heightFromFloor + window.height / 2, z)
    parent.add(windowMesh)

    // Add window frame
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
    const frameThickness = 0.05
    const frames = [
      new THREE.BoxGeometry(window.width + frameThickness * 2, frameThickness, frameThickness),
      new THREE.BoxGeometry(frameThickness, window.height, frameThickness),
    ]

    frames.forEach((frameGeom, idx) => {
      const frameMesh = new THREE.Mesh(frameGeom, frameMaterial)
      frameMesh.position.copy(windowMesh.position)
      if (idx === 1) {
        frameMesh.position.x += window.width / 2
      }
      parent.add(frameMesh)
    })
  }

  private generateRoof(
    height: number,
    dimensions: { length: number; width: number },
    designStyle: string,
    terraceType: string,
    color?: string,
  ) {
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: color || 0x8b4513,
      roughness: this.inputs.enablePBR ? 0.95 : 0.9,
      metalness: 0.0,
    })

    if (designStyle === "modern" || designStyle === "minimalist" || this.inputs.roofType === "flat") {
      // Flat roof
      const roofGeometry = new THREE.BoxGeometry(dimensions.length, 0.3, dimensions.width)
      const roof = new THREE.Mesh(roofGeometry, roofMaterial)
      roof.position.y = height + 0.15
      roof.castShadow = this.inputs.enableShadows
      roof.receiveShadow = this.inputs.enableShadows
      this.building.add(roof)

      // Add terrace features
      if (terraceType === "garden") {
        // Add green texture
        roofMaterial.color.setHex(0x2d5016)
      } else if (terraceType === "utility") {
        // Add utility structures
        const utilityBox = new THREE.Mesh(
          new THREE.BoxGeometry(2, 2, 2),
          new THREE.MeshStandardMaterial({ color: 0x666666 }),
        )
        utilityBox.position.set(dimensions.length / 3, height + 1.15, 0)
        this.building.add(utilityBox)
      }
    } else {
      // Sloped roof
      const roofGeometry = new THREE.ConeGeometry(Math.max(dimensions.length, dimensions.width) * 0.7, 3, 4)
      const roof = new THREE.Mesh(roofGeometry, roofMaterial)
      roof.position.y = height + 1.5
      roof.rotation.y = Math.PI / 4
      roof.castShadow = this.inputs.enableShadows
      this.building.add(roof)
    }
  }

  private setupCamera() {
    const { plotDimensions, numberOfFloors, floorHeight, cameraMode, cameraHeight } = this.inputs
    const buildingHeight = numberOfFloors * floorHeight

    switch (cameraMode) {
      case "walkthrough":
        this.camera.position.set(
          -plotDimensions.length * 1.5,
          cameraHeight || floorHeight * 0.6,
          plotDimensions.width * 1.5,
        )
        this.camera.lookAt(0, cameraHeight || floorHeight * 0.6, 0)
        break

      case "flyover":
        this.camera.position.set(plotDimensions.length * 2, buildingHeight * 2, plotDimensions.width * 2)
        this.camera.lookAt(0, buildingHeight / 2, 0)
        break

      case "orbit":
        this.camera.position.set(plotDimensions.length * 1.5, buildingHeight * 1.2, plotDimensions.width * 1.5)
        this.camera.lookAt(0, buildingHeight / 2, 0)
        break

      case "firstperson":
        this.camera.position.set(0, floorHeight * 0.6, plotDimensions.width / 2 + 2)
        this.camera.lookAt(0, floorHeight * 0.6, 0)
        break

      case "birdseye":
        this.camera.position.set(0, buildingHeight * 3, 0)
        this.camera.lookAt(0, 0, 0)
        break

      case "isometric":
        const isoDistance = Math.max(plotDimensions.length, plotDimensions.width) * 2
        this.camera.position.set(isoDistance, isoDistance, isoDistance)
        this.camera.lookAt(0, buildingHeight / 2, 0)
        break

      case "cinematic":
        this.camera.position.set(-plotDimensions.length * 2, buildingHeight * 0.8, plotDimensions.width * 2)
        this.camera.lookAt(0, buildingHeight * 0.5, 0)
        break

      case "drone":
        this.camera.position.set(plotDimensions.length, buildingHeight * 1.5, plotDimensions.width * 1.5)
        this.camera.lookAt(0, buildingHeight / 2, 0)
        break
    }
  }

  public animateCamera(onUpdate?: () => void): () => void {
    const { cameraMode, plotDimensions, numberOfFloors, floorHeight, cameraSpeed, cameraHeight } = this.inputs
    const buildingHeight = numberOfFloors * floorHeight
    let time = 0

    // Adjust speed multiplier
    const speedMultiplier = cameraSpeed === "slow" ? 0.3 : cameraSpeed === "fast" ? 2.0 : 1.0

    const animate = () => {
      time += 0.01 * speedMultiplier

      // E. REAL-TIME RENDERING & PERFORMANCE - FPS monitoring
      if (this.inputs.enableAdaptiveQuality) {
        this.monitorPerformance()
      }

      switch (cameraMode) {
        case "walkthrough":
          const radius = Math.max(plotDimensions.length, plotDimensions.width) * 1.5
          this.camera.position.x = Math.cos(time) * radius
          this.camera.position.z = Math.sin(time) * radius
          this.camera.position.y = cameraHeight || floorHeight * 0.6
          this.camera.lookAt(0, cameraHeight || floorHeight * 0.6, 0)
          break

        case "flyover":
          const flyRadius = Math.max(plotDimensions.length, plotDimensions.width) * 2
          this.camera.position.x = Math.cos(time * 0.5) * flyRadius
          this.camera.position.z = Math.sin(time * 0.5) * flyRadius
          this.camera.position.y = buildingHeight * 2 + Math.sin(time * 2) * buildingHeight * 0.5
          this.camera.lookAt(0, buildingHeight / 2, 0)
          break

        case "orbit":
          const orbitRadius = Math.max(plotDimensions.length, plotDimensions.width) * 1.5
          this.camera.position.x = Math.cos(time * 0.7) * orbitRadius
          this.camera.position.z = Math.sin(time * 0.7) * orbitRadius
          this.camera.position.y = buildingHeight * 1.2 + Math.sin(time) * buildingHeight * 0.3
          this.camera.lookAt(0, buildingHeight / 2, 0)
          break

        case "firstperson":
          this.camera.position.x = Math.sin(time * 0.3) * plotDimensions.length * 0.4
          this.camera.position.z = Math.cos(time * 0.3) * plotDimensions.width * 0.4
          this.camera.position.y = floorHeight * 0.6
          this.camera.lookAt(0, floorHeight * 0.6, 0)
          break

        case "birdseye":
          this.camera.position.x = Math.sin(time * 0.2) * plotDimensions.length * 0.5
          this.camera.position.z = Math.cos(time * 0.2) * plotDimensions.width * 0.5
          this.camera.lookAt(0, 0, 0)
          break

        case "isometric":
          const isoRadius = Math.max(plotDimensions.length, plotDimensions.width) * 2
          this.camera.position.x = Math.cos(time * 0.5) * isoRadius
          this.camera.position.z = Math.sin(time * 0.5) * isoRadius
          this.camera.position.y = isoRadius
          this.camera.lookAt(0, buildingHeight / 2, 0)
          break

        case "cinematic":
          const cinRadius = Math.max(plotDimensions.length, plotDimensions.width) * 2
          this.camera.position.x = Math.cos(time * 0.4) * cinRadius
          this.camera.position.z = Math.sin(time * 0.4) * cinRadius
          this.camera.position.y = buildingHeight * 0.8 + Math.sin(time * 0.8) * buildingHeight * 0.2
          this.camera.lookAt(0, buildingHeight * 0.5, 0)
          break

        case "drone":
          const droneRadius = Math.max(plotDimensions.length, plotDimensions.width) * 1.5
          this.camera.position.x = Math.cos(time * 0.6) * droneRadius
          this.camera.position.z = Math.sin(time * 0.6) * droneRadius
          this.camera.position.y = buildingHeight * 1.5 + Math.sin(time * 1.5) * buildingHeight * 0.4
          this.camera.lookAt(0, buildingHeight / 2, 0)
          break
      }

      this.renderer.render(this.scene, this.camera)
      onUpdate?.()
      this.animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId)
      }
    }
  }

  // E. REAL-TIME RENDERING & PERFORMANCE - Performance monitoring
  private monitorPerformance() {
    this.performanceMonitor.frameCount++
    const currentTime = performance.now()

    if (currentTime - this.performanceMonitor.lastTime >= 1000) {
      this.performanceMonitor.fps = this.performanceMonitor.frameCount
      this.performanceMonitor.frameCount = 0
      this.performanceMonitor.lastTime = currentTime

      // Adaptive quality scaling
      if (this.performanceMonitor.fps < this.inputs.targetFPS - 5) {
        // Reduce quality
        this.renderer.setPixelRatio(Math.max(1, window.devicePixelRatio * 0.75))
      } else if (this.performanceMonitor.fps > this.inputs.targetFPS + 10) {
        // Increase quality
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      }
    }
  }

  // E. Feature: Dynamic LOD switching
  private applyLOD() {
    this.building.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const lod = new THREE.LOD()

        // High detail (close)
        lod.addLevel(child.clone(), 0)

        // Medium detail
        const medGeom = child.geometry.clone()
        const medMesh = new THREE.Mesh(medGeom, child.material)
        lod.addLevel(medMesh, 20)

        // Low detail (far)
        const lowGeom = new THREE.BoxGeometry(1, 1, 1)
        const lowMesh = new THREE.Mesh(lowGeom, child.material)
        lod.addLevel(lowMesh, 50)

        this.lodLevels.set(child, lod)
      }
    })
  }

  // Get current FPS for UI display
  public getCurrentFPS(): number {
    return this.performanceMonitor.fps
  }

  public render() {
    this.renderer.render(this.scene, this.camera)
  }

  public handleResize(width: number, height: number) {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  public dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }
    this.renderer.dispose()
    this.building.clear()
    this.geometryCache.clear()
    this.textureCache.clear()
    this.lodLevels.clear()
  }

  // F. EXPORT & OUTPUT SYSTEM - Enhanced export with multiple formats
  public exportGLTF(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        const gltf = {
          asset: { version: "2.0", generator: "SIID FLASH 3D Model Generator v2.0" },
          scene: 0,
          scenes: [{ name: "Building Scene", nodes: [0] }],
          nodes: [] as any[],
          meshes: [] as any[],
          materials: [] as any[],
          accessors: [] as any[],
          bufferViews: [] as any[],
          buffers: [] as any[],
        }

        const materialsMap = new Map<string, number>()
        const meshesData: any[] = []

        this.building.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const geometry = child.geometry
            const material = child.material as THREE.MeshStandardMaterial

            const matKey = `${material.color.getHex()}-${material.roughness}-${material.metalness}`
            let materialIndex = materialsMap.get(matKey)

            if (materialIndex === undefined) {
              materialIndex = gltf.materials.length
              materialsMap.set(matKey, materialIndex)

              gltf.materials.push({
                name: `Material_${materialIndex}`,
                pbrMetallicRoughness: {
                  baseColorFactor: [material.color.r, material.color.g, material.color.b, material.opacity || 1],
                  metallicFactor: material.metalness || 0,
                  roughnessFactor: material.roughness || 1,
                },
                alphaMode: material.transparent ? "BLEND" : "OPAQUE",
              })
            }

            meshesData.push({
              geometry,
              material: materialIndex,
              position: child.position.clone(),
              rotation: child.rotation.clone(),
              scale: child.scale.clone(),
            })
          }
        })

        gltf.nodes.push({ name: "Building", children: Array.from({ length: meshesData.length }, (_, i) => i + 1) })

        meshesData.forEach((data, index) => {
          const { geometry, material, position, rotation, scale } = data

          const positionAttr = geometry.attributes.position
          const positions = Array.from(positionAttr.array)

          gltf.meshes.push({
            name: `Mesh_${index}`,
            primitives: [{ attributes: { POSITION: index }, material, mode: 4 }],
          })

          const matrix = new THREE.Matrix4()
          matrix.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale)

          gltf.nodes.push({ name: `Node_${index}`, mesh: index, matrix: matrix.toArray() })

          gltf.accessors.push({
            bufferView: index,
            componentType: 5126,
            count: positions.length / 3,
            type: "VEC3",
            max: [
              Math.max(...positions.filter((_, i) => i % 3 === 0)),
              Math.max(...positions.filter((_, i) => i % 3 === 1)),
              Math.max(...positions.filter((_, i) => i % 3 === 2)),
            ],
            min: [
              Math.min(...positions.filter((_, i) => i % 3 === 0)),
              Math.min(...positions.filter((_, i) => i % 3 === 1)),
              Math.min(...positions.filter((_, i) => i % 3 === 2)),
            ],
          })

          gltf.bufferViews.push({
            buffer: 0,
            byteOffset: index * positions.length * 4,
            byteLength: positions.length * 4,
          })
        })

        const allPositions: number[] = []
        meshesData.forEach((data) => {
          const positions = Array.from(data.geometry.attributes.position.array)
          allPositions.push(...positions)
        })

        const buffer = new ArrayBuffer(allPositions.length * 4)
        const view = new Float32Array(buffer)
        view.set(allPositions)

        gltf.buffers.push({ byteLength: buffer.byteLength })

        const gltfJSON = JSON.stringify(gltf, null, 2)
        const blob = new Blob([gltfJSON], { type: "model/gltf+json" })
        resolve(blob)
      } catch (error) {
        console.error("[v0] Export error:", error)
        reject(error)
      }
    })
  }

  // F. Feature: Export as OBJ format
  public exportOBJ(): string {
    let objContent = "# SIID FLASH 3D Model Export\n"
    let vertexIndex = 1

    this.building.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const geometry = child.geometry
        const positions = geometry.attributes.position

        objContent += `o ${child.name || "mesh"}\n`

        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i)
          const y = positions.getY(i)
          const z = positions.getZ(i)
          objContent += `v ${x} ${y} ${z}\n`
        }

        for (let i = 0; i < positions.count; i += 3) {
          objContent += `f ${vertexIndex} ${vertexIndex + 1} ${vertexIndex + 2}\n`
          vertexIndex += 3
        }
      }
    })

    return objContent
  }

  // F. Feature: Export building data as JSON
  public exportBuildingData(): any {
    return {
      inputs: this.inputs,
      buildingStats: {
        totalFloors: this.inputs.numberOfFloors,
        totalHeight: this.inputs.numberOfFloors * this.inputs.floorHeight,
        plotArea: this.inputs.plotDimensions.length * this.inputs.plotDimensions.width,
        builtUpArea: this.inputs.plotDimensions.length * this.inputs.plotDimensions.width * this.inputs.numberOfFloors,
      },
      generatedAt: new Date().toISOString(),
    }
  }
}
