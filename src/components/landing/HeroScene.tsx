import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei"
import { useMemo, useRef } from "react"
import * as THREE from "three"

const CYAN = "#009BC9"
const GOLD = "#C9A227"
const RED = "#8B1A1A"

function Particles({ count = 120 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    return arr
  }, [count])

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3)
    const palette = [
      new THREE.Color(CYAN),
      new THREE.Color(GOLD),
      new THREE.Color("#ffffff"),
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
    mesh.current.rotation.y = state.clock.elapsedTime * 0.04
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function CoreOrb() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.15
    ref.current.rotation.z = state.clock.elapsedTime * 0.05
  })

  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.6}>
      <Sphere ref={ref} args={[1.35, 64, 64]} scale={1}>
        <MeshDistortMaterial
          color={CYAN}
          attach="material"
          distort={0.35}
          speed={1.8}
          roughness={0.2}
          metalness={0.55}
          emissive={CYAN}
          emissiveIntensity={0.25}
        />
      </Sphere>
      <Sphere args={[1.55, 32, 32]}>
        <meshBasicMaterial color={GOLD} transparent opacity={0.08} wireframe />
      </Sphere>
    </Float>
  )
}

function Rings() {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.x = state.clock.elapsedTime * 0.12
    group.current.rotation.y = state.clock.elapsedTime * 0.08
  })

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[2.1, 0.02, 16, 100]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 5, 0]}>
        <torusGeometry args={[2.45, 0.015, 16, 100]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 1.7, -Math.PI / 6, 0]}>
        <torusGeometry args={[2.75, 0.012, 16, 80]} />
        <meshBasicMaterial color={RED} transparent opacity={0.25} />
      </mesh>
    </group>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-0">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.45} />
        <pointLight position={[4, 4, 4]} intensity={1.2} color={CYAN} />
        <pointLight position={[-4, -2, 2]} intensity={0.6} color={GOLD} />
        <pointLight position={[0, 3, -2]} intensity={0.4} color={RED} />
        <CoreOrb />
        <Rings />
        <Particles count={140} />
      </Canvas>
    </div>
  )
}
