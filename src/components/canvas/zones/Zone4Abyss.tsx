'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// The Abyss Creature is a massive, slow-moving blob with text scrolling across it
function AbyssCreature() {
  const meshRef = useRef<THREE.Mesh>(null)

  // Custom shader for the blob's surface
  const blobMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color('#0a0a0a') },
      color2: { value: new THREE.Color('#1a1a2e') },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float time;

      // Simplex noise (simplified for brevity)
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
        vNormal = normal;

        // Displace vertices using noise to create a breathing/blob effect
        float noise = snoise(position * 0.5 + time * 0.2);
        vec3 pos = position + normal * noise * 1.5;

        vPosition = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;

      void main() {
        // Create procedural text/veins pattern
        float pattern = sin(vUv.y * 50.0 + time) * sin(vUv.x * 50.0 + time);
        pattern = smoothstep(0.8, 1.0, pattern);

        // Base color mixed with pattern
        vec3 baseColor = mix(color1, color2, vUv.y);
        vec3 finalColor = mix(baseColor, vec3(0.5, 0.5, 0.6), pattern * 0.3);

        // Add fake rim lighting
        float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
        rim = smoothstep(0.6, 1.0, rim);
        finalColor += vec3(0.1, 0.1, 0.2) * rim;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    wireframe: false,
  }), [])

  useFrame((state) => {
    if (meshRef.current) {
      // 8-second breathing cycle as requested
      const t = state.clock.elapsedTime
      blobMaterial.uniforms.time.value = t
      meshRef.current.rotation.y = t * 0.05
      meshRef.current.rotation.z = Math.sin(t * 0.1) * 0.1
    }
  })

  return (
    <group position={[0, -5, -15]}>
      <mesh ref={meshRef} material={blobMaterial}>
        {/* Massive icosahedron that will be displaced into a blob */}
        <icosahedronGeometry args={[8, 32]} />
      </mesh>

      {/* The "Portal Eye" - a glowing sphere embedded in the creature */}
      <mesh position={[0, 0, 7.5]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#000000" />
        {/* Inner glow */}
        <mesh position={[0, 0, 0.2]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.5} />
        </mesh>
      </mesh>

      {/* Very faint ambient light so it's barely visible in the void */}
      <pointLight color="#111122" intensity={0.5} distance={20} />
    </group>
  )
}

export default function Zone4Abyss() {
  return (
    <group>
      {/* This zone is supposed to be mostly void */}
      <AbyssCreature />
    </group>
  )
}
