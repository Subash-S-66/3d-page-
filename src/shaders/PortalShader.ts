export const portalVertexShader = `
varying vec2 vUv;
varying vec4 vScreenPos;

void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vScreenPos = gl_Position;
}
`;

export const portalFragmentShader = `
uniform sampler2D tDiffuse;
uniform vec2 resolution;

varying vec2 vUv;
varying vec4 vScreenPos;

void main() {
  // Calculate screen-space coordinates
  vec2 screenUv = (vScreenPos.xy / vScreenPos.w + 1.0) / 2.0;

  // Sample the render target
  vec4 texColor = texture2D(tDiffuse, screenUv);

  gl_FragColor = texColor;

  // Optional: Add chromatic aberration or noise near edges here later
}
`;
