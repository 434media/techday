"use client"

import { Canvas } from "@react-three/fiber"
import { Effects } from "@react-three/drei"
import * as THREE from "three"
import { AdvancedParticles } from "./advanced-particles"
import { VignetteShader } from "../lib/vignette-shaders"

export function WebGLBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{
          position: [1.26, 2.66, -1.82],
          fov: 50,
          near: 0.01,
          far: 300,
        }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#ffffff"]} />
        <fog attach="fog" args={["#ffffff", 10, 30]} />

        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.4} color="#dc2626" />

        <AdvancedParticles
          speed={1.0}
          focus={3.8}
          aperture={1.79}
          size={512}
          noiseScale={0.6}
          noiseIntensity={0.52}
          timeScale={1.0}
          pointSize={10.0}
          opacity={0.7}
          planeScale={10.0}
          color={new THREE.Color("#dc2626")} // Red particles
        />

        <AdvancedParticles
          speed={0.8}
          focus={4.2}
          aperture={1.5}
          size={256}
          noiseScale={0.8}
          noiseIntensity={0.4}
          timeScale={0.8}
          pointSize={8.0}
          opacity={0.5}
          planeScale={8.0}
          color={new THREE.Color("#1a1a1a")} // Black particles
        />

        <AdvancedParticles
          speed={1.2}
          focus={3.5}
          aperture={2.0}
          size={256}
          noiseScale={0.5}
          noiseIntensity={0.6}
          timeScale={1.2}
          pointSize={6.0}
          opacity={0.6}
          planeScale={12.0}
          color={new THREE.Color("#ffffff")} // White particles
        />

        <Effects disableGamma>
          <shaderPass args={[VignetteShader]} uniforms-darkness-value={1.6} uniforms-offset-value={0.6} />
        </Effects>
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-white/60 pointer-events-none" />
    </div>
  )
}
