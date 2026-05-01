#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  // Mouse warp effect
  vec2 mouseOffset = (uMouse - 0.5) * 2.0;
  float distToMouse = length(uv - mouseOffset);
  float warp = exp(-distToMouse * 2.0) * 0.5;

  vec2 warpedUv = uv + normalize(uv - mouseOffset) * warp * 0.1;

  // Layered simplex noise for nebula effect
  float noise1 = snoise3(vec3(warpedUv * 1.5, uTime * 0.05));
  float noise2 = snoise3(vec3(warpedUv * 3.0 - noise1 * 0.5, uTime * 0.08 + 10.0));
  float noise3 = snoise3(vec3(warpedUv * 6.0 + noise2 * 0.5, uTime * 0.1 + 20.0));

  float finalNoise = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);
  finalNoise = finalNoise * 0.5 + 0.5; // map to 0-1

  // Create organic breathing effect
  float breath = sin(uTime * 0.5) * 0.1 + 0.9;

  // Color mix based on noise
  vec3 color = mix(uColor1, uColor2, finalNoise);

  // Add some dark void
  color *= smoothstep(0.1, 0.8, finalNoise * breath);

  // Deep void background
  vec3 bgColor = vec3(0.04, 0.04, 0.06); // #0A0A0F approx
  color = max(color, bgColor);

  gl_FragColor = vec4(color, 1.0);
}