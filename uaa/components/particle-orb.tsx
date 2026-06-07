"use client"

import { useRef, useMemo, useState, useCallback, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Color } from "three"
import type * as THREE from "three"
import { Shuffle } from "lucide-react"

type OrbIdentity = {
  colors: string[]
  dotCount: number

  // Fixed sizing so each generated orb stays the same overall size
  dotSize: number
  radius: number

  // Randomized personality traits
  rotationSpeed: number
  wobbleSpeed: number
  glowStrength: number
}

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

    // Keep these fixed so the orb does not change overall size
    dotSize: 0.032,
    radius: 1.2,

    // These can vary so each orb still feels unique
    rotationSpeed: randomBetween(0.04, 0.16),
    wobbleSpeed: randomBetween(0.03, 0.11),
    glowStrength: randomBetween(0.12, 0.28),
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

function DottedSphere({ identity }: { identity: OrbIdentity }) {
  const groupRef = useRef<THREE.Group>(null)

  const dots = useMemo(() => {
    const positions: [number, number, number][] = []
    const phi = Math.PI * (3 - Math.sqrt(5))

    for (let i = 0; i < identity.dotCount; i++) {
      const y = 1 - (i / Math.max(1, identity.dotCount - 1)) * 2
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = phi * i

      const x = Math.cos(theta) * radiusAtY * identity.radius
      const z = Math.sin(theta) * radiusAtY * identity.radius

      positions.push([x, y * identity.radius, z])
    }

    return positions
  }, [identity.dotCount, identity.radius])

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
            emissiveIntensity={0.9}
            metalness={0.85}
            roughness={0.12}
          />
        </mesh>
      ))}
    </group>
  )
}

function Scene({ identity }: { identity: OrbIdentity }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={1} color="#cccccc" />
      <pointLight position={[0, 0, 5]} intensity={1.5} color="#ffffff" />

      <DottedSphere identity={identity} />
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
        const percent = Math.round((index / Math.max(1, identity.colors.length - 1)) * 55)
        return `${color} ${percent}%`
      })
      .join(", ")

    return `radial-gradient(circle, ${stops}, transparent 75%)`
  }, [identity])

  if (!mounted || !identity) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-48 h-48 relative" />

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
      <div className="w-48 h-48 relative">
        <div
          className="absolute inset-[-8%] rounded-full blur-xl pointer-events-none"
          style={{
            opacity: identity.glowStrength,
            background: glowBackground,
          }}
        />

        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true }}
        >
          <Scene identity={identity} />
        </Canvas>
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