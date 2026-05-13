"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function Core() {
  const mesh = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.12;
    mesh.current.rotation.y += delta * 0.18;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.65, 3]} />
      <MeshDistortMaterial
        color="#22d3ee"
        emissive="#10b981"
        emissiveIntensity={0.35}
        metalness={0.9}
        roughness={0.18}
        distort={0.45}
        speed={2.4}
      />
    </mesh>
  );
}

export function HeroBackdrop3D() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-[0.55]">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 38 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 6]} intensity={1.1} color="#a855f7" />
        <pointLight position={[-6, -2, 4]} intensity={1.25} color="#34d399" />
        <Core />
      </Canvas>
    </div>
  );
}
