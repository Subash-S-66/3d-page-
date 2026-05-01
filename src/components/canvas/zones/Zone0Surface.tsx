'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import * as THREE from 'three'

export default function Zone0Surface() {
  const waterRef = useRef<THREE.Mesh>(null)

  // Create a custom water material using a basic shader
  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color('#00ffff') },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float time;

      // Simplex noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

        i = mod289(i);
        vec4 p = permute( permute( permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        float n_ = 0.142857142857;
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
      }

      void main() {
        vUv = uv;
        vPosition = position;

        vec3 pos = position;
        // Add some noise to the surface
        float noise = snoise(vec3(pos.x * 0.5, pos.y * 0.5, time * 0.2)) * 0.5;
        pos.z += noise;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform vec3 color;
      uniform float time;

      void main() {
        // Simple caustics-like effect
        float intensity = sin(vPosition.x * 5.0 + time) * sin(vPosition.y * 5.0 + time) * 0.5 + 0.5;
        vec3 finalColor = mix(color, vec3(1.0), intensity * 0.3);

        gl_FragColor = vec4(finalColor, 0.8); // slight transparency
      }
    `,
    transparent: true,
  })

  useFrame((state) => {
    if (waterRef.current) {
      (waterRef.current.material as THREE.ShaderMaterial).uniforms.time.value = state.clock.elapsedTime
    }
  })

  return (
    <group>
      {/* Water Surface above camera */}
      <mesh ref={waterRef} position={[0, 4, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50, 64, 64]} />
        <primitive object={waterMaterial} attach="material" />
      </mesh>

      {/* SKS Logo */}
      <Float
        speed={2} // Animation speed
        rotationIntensity={0.2} // XYZ rotation intensity
        floatIntensity={0.5} // Up/down float intensity
        floatingRange={[-0.2, 0.2]} // Range of y-axis values
      >
        <Text
          position={[0, 0, -2]}
          fontSize={1.5}
          font="https://fonts.gstatic.com/s/fraunces/v31/6NUu8FxcPKMOIQbOw5ko7iQ-Bw.woff2"
          color="white"
          anchorX="center"
          anchorY="middle"
          material-toneMapped={false}
          material-emissive="white"
          material-emissiveIntensity={0.2}
        >
          SKS
        </Text>
      </Float>

      {/* Tagline */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <Text
          position={[0, -1.2, -2]}
          fontSize={0.2}
          font="https://fonts.gstatic.com/s/satoshi/v2/Satoshi-Regular.woff2"
          color="#aaddff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
        >
          THE DEEP DIVE PORTFOLIO
        </Text>
      </Float>
    </group>
  )
}
