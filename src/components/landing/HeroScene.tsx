import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei"
import { useMemo, useRef } from "react"
import * as THREE from "three"

const CYAN = "#009BC9"
const GOLD = "#C9A227"
const RED = "#8B1A1A"

function Particles({ count = 180 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 2.5 + Math.random() * 8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3)
    const palette = [
      new THREE.Color(CYAN),
      new THREE.Color(GOLD),
      new THREE.Color("#e8f7fc"),
      new THREE.Color(RED),
    ]
    for (let i = 0; i < count; i++) {
      const c = palette[i % palette.length]
      arr[i * 3] = c.r
      arr[i * 3 + 1] = c.g
      arr[i * 3 + 2] = c.b
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.y = state.clock.elapsedTime * 0.03
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.06) * 0.06
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function CoreOrb() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.12
  })

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.45}>
      <Sphere ref={ref} args={[1.2, 64, 64]}>
        <MeshDistortMaterial
          color={CYAN}
          attach="material"
          distort={0.28}
          speed={1.5}
          roughness={0.15}
          metalness={0.65}
          emissive={CYAN}
          emissiveIntensity={0.35}
        />
      </Sphere>
      <Sphere args={[1.45, 32, 32]}>
        <meshBasicMaterial color={GOLD} transparent opacity={0.06} wireframe />
      </Sphere>
    </Float>
  )
}

function Rings() {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.x = state.clock.elapsedTime * 0.1
    group.current.rotation.y = state.clock.elapsedTime * 0.07
  })

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2.3, 0.2, 0]}>
        <torusGeometry args={[2.0, 0.015, 16, 120]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 3.2, Math.PI / 4, 0.3]}>
        <torusGeometry args={[2.35, 0.012, 16, 100]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 1.6, -0.4, 0.1]}>
        <torusGeometry args={[2.7, 0.01, 16, 80]} />
        <meshBasicMaterial color={RED} transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[5, 4, 4]} intensity={1.4} color={CYAN} />
        <pointLight position={[-4, -2, 3]} intensity={0.55} color={GOLD} />
        <pointLight position={[0, 4, -3]} intensity={0.35} color={RED} />
        <CoreOrb />
        <Rings />
        <Particles count={160} />
      </Canvas>
    </div>
  )
}
