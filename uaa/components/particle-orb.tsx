"use client"

import { useRef, useMemo, useState, useCallback, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Color } from "three"
import { Shuffle } from "lucide-react"

type OrbIdentity = {
  colors: string[]
  dotCount: number
  dotSize: number
  radius: number
  rotationSpeed: number
  wobbleSpeed: number
  glowStrength: number
  zapCount: number
  zapDuration: number
  zapInterval: number
}

type DotPosition = [number, number, number]

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function randomInt(min: number, max: number) {
  return Math.floor(randomBetween(min, max + 1))
}

function randomColor() {
  const h = Math.random()
  const s = 0.55 + Math.random() * 0.45
  const l = 0.45 + Math.random() * 0.25

  return new Color().setHSL(h, s, l).getStyle()
}

function randomPalette() {
  const colorCount = randomInt(4, 9)
  return Array.from({ length: colorCount }, () => randomColor())
}

function generateOrbIdentity(): OrbIdentity {
  return {
    colors: randomPalette(),
    dotCount: randomInt(50, 800),
    dotSize: 0.032,
    radius: 1.22,
    rotationSpeed: randomBetween(0.04, 0.16),
    wobbleSpeed: randomBetween(0.03, 0.11),
    glowStrength: randomBetween(0.18, 0.34),
    zapCount: randomInt(4, 9),
    zapDuration: randomBetween(0.18, 0.35),
    zapInterval: randomBetween(0.35, 0.7),
  }
}

function getPaletteColor(colors: string[], t: number) {
  if (colors.length === 1) return new Color(colors[0])

  const clampedT = Math.max(0, Math.min(1, t))
  const scaled = clampedT * (colors.length - 1)
  const index = Math.floor(scaled)
  const nextIndex = Math.min(index + 1, colors.length - 1)
  const localT = scaled - index

  return new Color().lerpColors(new Color(colors[index]), new Color(colors[nextIndex]), localT)
}

function generateSphereDots(dotCount: number, radius: number): DotPosition[] {
  const positions: DotPosition[] = []
  const phi = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < dotCount; i++) {
    const y = 1 - (i / Math.max(1, dotCount - 1)) * 2
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = phi * i

    const x = Math.cos(theta) * radiusAtY * radius
    const z = Math.sin(theta) * radiusAtY * radius

    positions.push([x, y * radius, z])
  }

  return positions
}

function distance(a: DotPosition, b: DotPosition) {
  const dx = a[0] - b[0]
  const dy = a[1] - b[1]
  const dz = a[2] - b[2]
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

function buildZapPairs(dots: DotPosition[], pairCount: number, radius: number): Array<[number, number]> {
  const pairs: Array<[number, number]> = []

  if (dots.length < 2) return pairs

  for (let i = 0; i < pairCount; i++) {
    const startIndex = randomInt(0, dots.length - 1)
    const start = dots[startIndex]

    let bestIndex = -1
    let bestDistance = Number.POSITIVE_INFINITY

    for (let j = 0; j < 18; j++) {
      const candidateIndex = randomInt(0, dots.length - 1)
      if (candidateIndex === startIndex) continue

      const candidate = dots[candidateIndex]
      const d = distance(start, candidate)

      if (d > radius * 0.18 && d < radius * 0.72 && d < bestDistance) {
        bestDistance = d
        bestIndex = candidateIndex
      }
    }

    if (bestIndex !== -1) {
      pairs.push([startIndex, bestIndex])
    }
  }

  return pairs
}

function DottedSphere({
  identity,
  dots,
}: {
  identity: OrbIdentity
  dots: DotPosition[]
}) {
  const groupRef = useRef<THREE.Group>(null)

  const colors = useMemo(() => {
    return dots.map(([x, y, z], i) => {
      const heightT = (y / identity.radius + 1) / 2
      const angleT = (Math.atan2(z, x) + Math.PI) / (Math.PI * 2)
      const indexT = i / Math.max(1, dots.length - 1)

      const mixedT = (heightT * 0.5 + angleT * 0.3 + indexT * 0.2) % 1
      const base = getPaletteColor(identity.colors, mixedT)

      const hueShift = randomBetween(-0.04, 0.04)
      const saturationBoost = randomBetween(0.9, 1.25)
      const lightnessBoost = randomBetween(0.85, 1.2)

      const hsl = { h: 0, s: 0, l: 0 }
      base.getHSL(hsl)

      return new Color()
        .setHSL(
          (hsl.h + hueShift + 1) % 1,
          Math.max(0, Math.min(1, hsl.s * saturationBoost)),
          Math.max(0, Math.min(1, hsl.l * lightnessBoost)),
        )
        .getStyle()
    })
  }, [dots, identity.colors, identity.radius])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * identity.rotationSpeed
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * identity.wobbleSpeed) * 0.12
    }
  })

  return (
    <group ref={groupRef}>
      {dots.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[identity.dotSize, 8, 8]} />
          <meshStandardMaterial
            color={colors[i]}
            emissive={colors[i]}
            emissiveIntensity={1}
            metalness={0.85}
            roughness={0.12}
          />
        </mesh>
      ))}
    </group>
  )
}

function NeuralZaps({
  identity,
  dots,
}: {
  identity: OrbIdentity
  dots: DotPosition[]
}) {
  const groupRef = useRef<THREE.Group>(null)
  const lineRef = useRef<THREE.LineSegments>(null)
  const lastBurstRef = useRef(0)
  const activePairsRef = useRef<Array<[number, number]>>([])

  const zapColor = useMemo(() => {
    return getPaletteColor(identity.colors, 0.5).getStyle()
  }, [identity.colors])

  useEffect(() => {
    activePairsRef.current = buildZapPairs(dots, identity.zapCount, identity.radius)
    lastBurstRef.current = 0
  }, [dots, identity.zapCount, identity.radius])

  useFrame((state) => {
    if (!groupRef.current || !lineRef.current) return

    groupRef.current.rotation.y = state.clock.elapsedTime * identity.rotationSpeed
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * identity.wobbleSpeed) * 0.12

    const elapsed = state.clock.elapsedTime

    if (
      lastBurstRef.current === 0 ||
      elapsed - lastBurstRef.current > identity.zapInterval + identity.zapDuration
    ) {
      activePairsRef.current = buildZapPairs(dots, identity.zapCount, identity.radius)
      lastBurstRef.current = elapsed
    }

    const burstAge = elapsed - lastBurstRef.current
    const phase = Math.min(1, burstAge / identity.zapDuration)
    const active = burstAge <= identity.zapDuration

    const material = lineRef.current.material as THREE.LineBasicMaterial
    const geometry = lineRef.current.geometry as THREE.BufferGeometry
    const positionAttr = geometry.getAttribute("position") as THREE.BufferAttribute

    const pulse = active ? Math.sin(Math.PI * phase) : 0
    const flicker = active ? 0.7 + Math.sin(elapsed * 35) * 0.25 : 0
    material.opacity = pulse * flicker * 0.95

    const pairs = active ? activePairsRef.current : []
    const array = positionAttr.array as Float32Array

    for (let i = 0; i < identity.zapCount; i++) {
      const offset = i * 6

      if (pairs[i]) {
        const [aIndex, bIndex] = pairs[i]
        const a = dots[aIndex]
        const b = dots[bIndex]

        array[offset] = a[0]
        array[offset + 1] = a[1]
        array[offset + 2] = a[2]
        array[offset + 3] = b[0]
        array[offset + 4] = b[1]
        array[offset + 5] = b[2]
      } else {
        array[offset] = 0
        array[offset + 1] = 0
        array[offset + 2] = 0
        array[offset + 3] = 0
        array[offset + 4] = 0
        array[offset + 5] = 0
      }
    }

    positionAttr.needsUpdate = true
  })

  const linePositions = useMemo(() => {
    return new Float32Array(identity.zapCount * 2 * 3)
  }, [identity.zapCount])

  return (
    <group ref={groupRef}>
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={zapColor}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}

function Scene({ identity }: { identity: OrbIdentity }) {
  const dots = useMemo(() => {
    return generateSphereDots(identity.dotCount, identity.radius)
  }, [identity.dotCount, identity.radius])

  return (
    <>
      <ambientLight intensity={0.75} />
      <pointLight position={[5, 5, 5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={1.2} color="#cccccc" />
      <pointLight position={[0, 0, 5]} intensity={1.7} color="#ffffff" />

      <NeuralZaps identity={identity} dots={dots} />
      <DottedSphere identity={identity} dots={dots} />
    </>
  )
}

export function ParticleOrb() {
  const [mounted, setMounted] = useState(false)
  const [identity, setIdentity] = useState<OrbIdentity | null>(null)

  useEffect(() => {
    setMounted(true)
    setIdentity(generateOrbIdentity())
  }, [])

  const regenerate = useCallback(() => {
    setIdentity(generateOrbIdentity())
  }, [])

  const glowBackground = useMemo(() => {
    if (!identity) return "transparent"

    const stops = identity.colors
      .map((color, index) => {
        const percent = Math.round((index / Math.max(1, identity.colors.length - 1)) * 58)
        return `${color} ${percent}%`
      })
      .join(", ")

    return `radial-gradient(circle, ${stops}, transparent 74%)`
  }, [identity])

  if (!mounted || !identity) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-56 w-56 rounded-full border border-white/15 bg-black p-2 shadow-2xl" />

        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground opacity-60"
        >
          <Shuffle className="h-4 w-4" />
          Generate identity
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-56 w-56 rounded-full border border-white/15 bg-black p-2 shadow-2xl">
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 25%, rgba(255,255,255,0.08), transparent 45%)",
          }}
        />

        <div
          className="pointer-events-none absolute inset-[2%] rounded-full blur-2xl"
          style={{
            opacity: identity.glowStrength,
            background: glowBackground,
          }}
        />

        <div
          className="pointer-events-none absolute inset-[10%] rounded-full blur-xl"
          style={{
            opacity: identity.glowStrength * 0.9,
            background: glowBackground,
          }}
        />

        <div className="relative h-full w-full overflow-hidden rounded-full bg-black">
          <Canvas
            camera={{ position: [0, 0, 4], fov: 45 }}
            style={{ background: "transparent" }}
            gl={{ alpha: true, antialias: true }}
          >
            <Scene identity={identity} />
          </Canvas>
        </div>
      </div>

      <button
        type="button"
        onClick={regenerate}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
      >
        <Shuffle className="h-4 w-4" />
        Generate identity
      </button>
    </div>
  )
}