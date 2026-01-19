"use client"

import * as THREE from "three"
import { useRef, useState, useEffect, useMemo } from "react"
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber"
import { Environment, Lightformer, Html, RoundedBox } from "@react-three/drei"
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RapierRigidBody,
} from "@react-three/rapier"
import { MeshLineGeometry, MeshLineMaterial } from "meshline"
import Image from "next/image"

// Extend React Three Fiber with MeshLine components
extend({ MeshLineGeometry, MeshLineMaterial })

// Type declarations for meshline - using any to avoid complex type issues
declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, unknown>
      meshLineMaterial: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        color?: string
        lineWidth?: number
        resolution?: [number, number]
        depthTest?: boolean
        transparent?: boolean
        opacity?: number
      }
    }
  }
}

interface Lanyard3DProps {
  className?: string
}

export function Lanyard3D({ className = "" }: Lanyard3DProps) {
  return (
    <div className={`w-full h-[600px] md:h-[700px] ${className} touch-none`}>
      <Canvas camera={{ position: [0, 0, 13], fov: 25 }} dpr={[1, 2]}>
        <ambientLight intensity={Math.PI * 0.5} />
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  )
}

function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef<THREE.Mesh>(null)
  const band2 = useRef<THREE.Mesh>(null)
  const fixed = useRef<RapierRigidBody>(null)
  const j1 = useRef<RapierRigidBody & { lerped?: THREE.Vector3 }>(null)
  const j2 = useRef<RapierRigidBody & { lerped?: THREE.Vector3 }>(null)
  const j3 = useRef<RapierRigidBody & { lerped?: THREE.Vector3 }>(null)
  const card = useRef<RapierRigidBody>(null)
  
  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()
  
  // Improved segment physics for smoother, more natural rope behavior
  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  }
  
  const { width, height } = useThree((state) => state.size)
  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ])
    c.curveType = "chordal"
    return c
  })
  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false)
  const [hovered, setHovered] = useState(false)
  const [physicsReady, setPhysicsReady] = useState(false)
  
  // Setup rope joints connecting the segments
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  // Spherical joint connects rope to top of card
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.25, 0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab"
      return () => {
        document.body.style.cursor = "auto"
      }
    }
  }, [hovered, dragged])

  // Smooth drag offset for more natural interaction
  const dragOffset = useRef(new THREE.Vector3())
  const targetPos = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    if (dragged && card.current) {
      // Calculate target position from pointer
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      
      // Smooth interpolation toward target for natural feel
      targetPos.current.set(
        vec.x - dragged.x,
        vec.y - dragged.y,
        vec.z - dragged.z
      )
      
      const currentPos = card.current.translation()
      // Lerp for smoother motion (higher value = more responsive)
      const lerpFactor = Math.min(1, delta * 20)
      const smoothX = THREE.MathUtils.lerp(currentPos.x, targetPos.current.x, lerpFactor)
      const smoothY = THREE.MathUtils.lerp(currentPos.y, targetPos.current.y, lerpFactor)
      const smoothZ = THREE.MathUtils.lerp(currentPos.z, targetPos.current.z, lerpFactor)
      
      // Wake up all bodies when dragging
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current.setNextKinematicTranslation({
        x: smoothX,
        y: smoothY,
        z: smoothZ,
      })
    }
    
    if (fixed.current && j1.current && j2.current && j3.current && band.current && card.current) {
      const fixedPos = fixed.current.translation()
      const j1Pos = j1.current.translation()
      const j2Pos = j2.current.translation()
      const j3Pos = j3.current.translation()

      // Validate that all positions are valid numbers
      if (
        isNaN(fixedPos.x) || isNaN(fixedPos.y) || isNaN(fixedPos.z) ||
        isNaN(j1Pos.x) || isNaN(j1Pos.y) || isNaN(j1Pos.z) ||
        isNaN(j2Pos.x) || isNaN(j2Pos.y) || isNaN(j2Pos.z) ||
        isNaN(j3Pos.x) || isNaN(j3Pos.y) || isNaN(j3Pos.z)
      ) {
        return // Skip this frame if physics hasn't initialized yet
      }

      if (!physicsReady) {
        setPhysicsReady(true)
      }

      // Fix jitter when over-pulling the card with lerped positions
      ;[j1, j2, j3].forEach((ref) => {
        if (!ref.current) return
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation() as THREE.Vector3)
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation() as THREE.Vector3)))
        ref.current.lerped.lerp(ref.current.translation() as THREE.Vector3, delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })

      // Get card position for lanyard attachment point (top of card)
      const cardPos = card.current.translation()
      const cardRot = card.current.rotation()
      
      // Calculate lanyard attachment point (top center of card, accounting for rotation)
      const attachPoint = new THREE.Vector3(0, 1.25 * 2.25, 0) // Scaled by visual scale
      attachPoint.applyQuaternion(new THREE.Quaternion(cardRot.x, cardRot.y, cardRot.z, cardRot.w))
      attachPoint.add(new THREE.Vector3(cardPos.x, cardPos.y, cardPos.z))

      // Calculate catmull curve - lanyard goes from fixed anchor down to card
      curve.points[0].copy(fixedPos as THREE.Vector3)
      curve.points[1].copy(j1.current.lerped || j1Pos as THREE.Vector3)
      curve.points[2].copy(j2.current.lerped || j2Pos as THREE.Vector3)
      curve.points[3].copy(j3.current.lerped || j3Pos as THREE.Vector3)
      
      // Update meshline geometry
      const geometry = band.current.geometry as THREE.BufferGeometry & { setPoints: (points: THREE.Vector3[]) => void }
      if (geometry.setPoints) {
        geometry.setPoints(curve.getPoints(32))
      }
      
      // Update second band for gradient effect
      if (band2.current) {
        const geometry2 = band2.current.geometry as THREE.BufferGeometry & { setPoints: (points: THREE.Vector3[]) => void }
        if (geometry2.setPoints) {
          geometry2.setPoints(curve.getPoints(32))
        }
      }

      // Keep card facing forward
      ang.copy(card.current.angvel() as unknown as THREE.Vector3)
      rot.copy(card.current.rotation() as unknown as THREE.Vector3)
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true)
    }
  })

  return (
    <>
      {/* All rigid bodies inside a parent group positioned at top */}
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        
        {/* The badge card */}
        <RigidBody 
          position={[2, 0, 0]} 
          ref={card} 
          {...segmentProps} 
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.7, 1.0, 0.01]} />
          
          {/* Scale the visual group to make card larger while keeping physics small */}
          <group
            scale={2.5}
            position={[0, -1.1, -0.05]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => !dragged && setHovered(false)}
            onPointerUp={(e) => {
              e.stopPropagation()
              const target = e.target as Element & { releasePointerCapture?: (id: number) => void }
              target.releasePointerCapture?.(e.pointerId)
              setDragged(false)
              setHovered(false)
            }}
            onPointerDown={(e) => {
              e.stopPropagation()
              const target = e.target as Element & { setPointerCapture?: (id: number) => void }
              target.setPointerCapture?.(e.pointerId)
              if (card.current) {
                const cardTranslation = card.current.translation()
                dragOffset.current.copy(e.point).sub(new THREE.Vector3(cardTranslation.x, cardTranslation.y, cardTranslation.z))
                setDragged(new THREE.Vector3().copy(dragOffset.current))
              }
            }}
            onPointerMove={(e) => {
              // Ensure dragging continues even if pointer moves fast
              if (dragged) {
                e.stopPropagation()
              }
            }}
          >
            {/* Single 3D card mesh with proper front/back */}
            <RoundedBox 
              args={[1.4, 1.9, 0.05]} 
              radius={0.1} 
              smoothness={4}
            >
              <meshStandardMaterial 
                color="#1a1a1a" 
                metalness={0.2} 
                roughness={0.7}
                side={THREE.DoubleSide}
              />
            </RoundedBox>
            
            {/* Front of card - HTML content attached to front face */}
            <Html
              transform
              occlude="blending"
              position={[0, 0.02, 0.03]}
              scale={0.135}
              className="pointer-events-none select-none"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div 
                className="w-[145px] h-[195px] bg-[#1a1a1a] rounded-xl overflow-hidden flex flex-col"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {/* Logo at top */}
                <div className="pt-4 px-4">
                  <Image
                    src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/10Years_Red.svg"
                    alt="Tech Day 10 Years"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>

                {/* Main headline */}
                <div className="px-4 pt-3">
                  <h1 className="text-white text-[22px] font-bold leading-[1.1] tracking-tight">
                    Tech Day
                    <br />
                    <span className="text-[#dc2626]">&</span> Tech Fuel
                  </h1>
                  <p className="text-white/60 text-[11px] mt-1 font-medium">
                    April 9–10, 2026
                  </p>
                </div>

                {/* CTA Button */}
                <div className="px-4 pt-3">
                  <div className="flex items-center justify-center gap-1.5 w-full py-2 bg-white text-[#0a0a0a] font-semibold text-[10px] rounded-lg">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                    </svg>
                    Register Now
                  </div>
                </div>

                {/* Event details */}
                <div className="mt-auto px-4 pb-4 pt-2">
                  <div className="border-t border-white/10 pt-2">
                    <div className="grid grid-cols-2 gap-2 text-[8px]">
                      <div>
                        <p className="text-white/50 font-medium uppercase tracking-wide">Tech Day</p>
                        <p className="text-white font-semibold">April 9th</p>
                        <p className="text-white/70">Tech Port</p>
                      </div>
                      <div>
                        <p className="text-white/50 font-medium uppercase tracking-wide">Tech Fuel</p>
                        <p className="text-white font-semibold">April 10th</p>
                        <p className="text-white/70">Stable Hall</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Html>
            
            {/* Back of card - HTML content attached to back face */}
            <Html
              transform
              occlude="blending"
              position={[0, 0.02, -0.03]}
              rotation={[0, Math.PI, 0]}
              scale={0.135}
              className="pointer-events-none select-none"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div 
                className="w-[145px] h-[195px] bg-[#1a1a1a] rounded-xl overflow-hidden flex flex-col relative"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {/* Pixel Arrow SVG - Featured prominently on back */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-6">
                  <div className="relative w-full h-full opacity-40">
                    <Image
                      src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/arrowdown.svg"
                      alt="Tech Day Arrow"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a] via-[#1a1a1a]/70 to-transparent" />

                {/* Overlay content */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-end p-4 pb-6">
                  <div className="text-center">
                    <Image
                      src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/10Years_Red.svg"
                      alt="Tech Day 10 Years"
                      width={40}
                      height={40}
                      className="object-contain mx-auto mb-2"
                    />
                    <p className="text-white/60 font-medium text-[8px] tracking-widest uppercase">San Antonio, TX</p>
                    <h2 className="text-white text-[18px] font-bold tracking-tight mt-1">Tech Day 2026</h2>
                    <p className="text-[#dc2626] font-bold text-[12px] tracking-tight mt-0.5">&quot;Invented Here&quot;</p>
                  </div>
                </div>
              </div>
            </Html>
            
            {/* Badge Clip Base */}
            <mesh position={[0, 0.98, 0]}>
              <boxGeometry args={[0.25, 0.08, 0.1]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.15} />
            </mesh>
            {/* Clip Hook */}
            <mesh position={[0, 1.05, 0.02]}>
              <boxGeometry args={[0.12, 0.1, 0.04]} />
              <meshStandardMaterial color="#3a3a3a" metalness={0.9} roughness={0.15} />
            </mesh>
            {/* Clip Ring */}
            <mesh position={[0, 1.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.08, 0.025, 12, 24]} />
              <meshStandardMaterial color="#4a4a4a" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      
      {/* Lanyard band mesh - always render, physics will update points */}
      <mesh ref={band}>
        {/* @ts-ignore - meshline types */}
        <meshLineGeometry />
        {/* @ts-ignore - meshline types */}
        <meshLineMaterial
          color="#f97316"
          depthTest={true}
          resolution={[width, height]}
          lineWidth={3}
          transparent={false}
        />
      </mesh>
      
      {/* Additional lanyard strand for gradient effect */}
      <mesh ref={band2}>
        {/* @ts-ignore - meshline types */}
        <meshLineGeometry />
        {/* @ts-ignore - meshline types */}
        <meshLineMaterial
          color="#ec4899"
          depthTest={true}
          resolution={[width, height]}
          lineWidth={2.5}
          transparent={true}
          opacity={0.7}
        />
      </mesh>
    </>
  )
}
