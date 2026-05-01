"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

const JOBS = [
  { title: "Senior AI Engineer", company: "CyberDyne", year: "2078 - Present", desc: "Leading the neural net optimization division.", position: 0.1 },
  { title: "WebGL Developer", company: "Meta", year: "2075 - 2078", desc: "Built the metaverse rendering engine.", position: 0.4 },
  { title: "Frontend Lead", company: "Vercel", year: "2072 - 2075", desc: "Created Next.js v45.", position: 0.7 },
  { title: "Junior Dev", company: "Startup.inc", year: "2070 - 2072", desc: "Wrote HTML in zero-gravity.", position: 0.95 },
];

function Track() {
  const { camera } = useThree();
  const tubeRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Create a winding path
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(5, 2, -10),
      new THREE.Vector3(-5, -2, -20),
      new THREE.Vector3(0, 0, -30),
      new THREE.Vector3(8, 4, -40),
      new THREE.Vector3(0, 0, -50),
    ]);
  }, []);

  // Update camera position based on scroll within the canvas container
  useFrame(() => {
    // We would normally use scrolltrigger here to drive a uniform or state,
    // but for simplicity we'll bind it to the window scroll directly
    // assuming the section is in view.
    const scrollY = window.scrollY;
    // Map scroll position to curve progress (very simplified)
    const progress = (Math.sin(scrollY * 0.001) * 0.5 + 0.5); // Ping pong for now, real implementation uses ScrollTrigger

    // In a real app we'd map the scroll perfectly to the curve
    const point = curve.getPointAt(Math.max(0.01, Math.min(0.99, progress * 0.5)));
    const lookAt = curve.getPointAt(Math.max(0.01, Math.min(0.99, progress * 0.5 + 0.05)));

    // Smooth camera movement
    camera.position.lerp(new THREE.Vector3(point.x, point.y + 2, point.z + 5), 0.05);
    camera.lookAt(lookAt);
  });

  return (
    <group>
      {/* Main Track */}
      <mesh ref={tubeRef}>
        <tubeGeometry args={[curve, 64, 0.2, 8, false]} />
        <meshStandardMaterial color="#A855F7" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Glowing Inner Rail */}
      <mesh ref={glowRef}>
        <tubeGeometry args={[curve, 64, 0.05, 8, false]} />
        <meshBasicMaterial color="#6EE7F7" />
      </mesh>

      {/* Stations */}
      {JOBS.map((job, i) => {
        const point = curve.getPointAt(job.position);
        return (
          <group key={i} position={[point.x, point.y, point.z]}>
            <mesh>
              <sphereGeometry args={[0.5, 32, 32]} />
              <meshStandardMaterial color="#FF6B6B" emissive="#FF6B6B" emissiveIntensity={0.5} />
            </mesh>
            <Html position={[1, 1, 0]} center>
              <div className="bg-primary/80 backdrop-blur-md border border-accent3/30 p-4 rounded-lg w-64 pointer-events-none">
                <div className="text-accent3 font-mono text-xs mb-1">{job.year}</div>
                <h3 className="text-white font-display text-xl font-bold">{job.title}</h3>
                <div className="text-white/60 text-sm mb-2">{job.company}</div>
                <p className="text-white/40 text-xs">{job.desc}</p>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function Experience() {
  return (
    <section className="relative w-full h-[300vh] pointer-events-none z-10">
      <div className="sticky top-0 w-full h-screen pointer-events-auto">
        <h2 className="absolute top-20 right-10 text-8xl font-display font-bold text-accent3 tracking-widest text-shadow-glow text-right pointer-events-none z-20">EXPERIENCE</h2>
        <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <Track />
        </Canvas>
      </div>
    </section>
  );
}