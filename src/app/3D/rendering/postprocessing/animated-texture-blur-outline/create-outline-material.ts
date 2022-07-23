import { AnimatedTextureBlurOutlineOutputMode } from "./animated-texture-blur-outline-output-mode";
import { ShaderMaterial } from "three";
import type { Texture } from "three";

export interface CreateOutlineMaterialParameters {
  outputMode: AnimatedTextureBlurOutlineOutputMode;
  hoverTexture: Texture;
  selectedTexture: Texture;
  startU: number;
  tileCount: number;
}

export function createOutlineMaterial(options: CreateOutlineMaterialParameters): ShaderMaterial {
  const fragmentShader = createOutlineFragmentShader(options.outputMode);

  return new ShaderMaterial({
    vertexShader:
      `varying vec2 vUv;
        varying vec3 worldPosition;
        void main() {
          vUv = uv;
          worldPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,

    fragmentShader,
    uniforms: {
      maskTexture: { value: null },
      blurTexture: { value: null },
      blurHalfTexture: { value: null },
      hoverTexture: { value: options.hoverTexture },
      selectedTexture: { value: options.selectedTexture },
      startU: { value: options.startU },
      tileCount: { value: options.tileCount },
    },
    transparent: true,
  });
}

function createOutlineFragmentShader(outputMode: AnimatedTextureBlurOutlineOutputMode): string {
  let fragmentShader = `
    varying vec2 vUv;
    varying vec3 worldPosition;

    uniform sampler2D maskTexture;
    uniform sampler2D blurTexture;
    uniform sampler2D blurHalfTexture;

    uniform sampler2D hoverTexture;
    uniform sampler2D selectedTexture;

    uniform float startU;
    uniform float tileCount;

    vec4 getOutlineColor(float mask, float blur, vec3 outlineColor)
    {
      float blurOutline = clamp((blur - mask) * 2.5, 0.0, 1.0);
      return vec4(outlineColor.x * blurOutline, outlineColor.y * blurOutline, outlineColor.z * blurOutline, blurOutline);
    }

    void main() {
      vec4 maskColor = texture2D(maskTexture, vUv);
      vec4 blurColor = texture2D(blurTexture, vUv);
      vec4 blurHalfColor = texture2D(blurHalfTexture, vUv);

      vec3 combinedBlur = min(blurColor.xyz + blurHalfColor.xyz, vec3(1.0, 1.0, 1.0));

      vec2 clampedUv = vec2(worldPosition.xy * 0.5 + 0.5);
      // 1.5 would be u = 0.5 because the outline texture is looping.
      float u = startU + tileCount * clampedUv.x;
      vec2 uv = vec2(u, clampedUv.y);

      vec4 hoverColor = texture2D(hoverTexture, uv);
      vec4 selectedColor = texture2D(selectedTexture, uv);

      vec4 hover = getOutlineColor(maskColor.r, combinedBlur.r, vec3(hoverColor.xyz));
      vec4 selected = getOutlineColor(maskColor.g, combinedBlur.g, vec3(selectedColor.xyz));
    `;

  switch (outputMode) {
    case AnimatedTextureBlurOutlineOutputMode.Normal:
      fragmentShader += `
          gl_FragColor = vec4(hover.xyz + selected.xyz, max(hover.w, selected.w));
        }`;
      break;
    case AnimatedTextureBlurOutlineOutputMode.HoverTexture:
      fragmentShader += `
          gl_FragColor = vec4(hoverColor.xyz, 1.0);
        }`;
      break;
    case AnimatedTextureBlurOutlineOutputMode.SelectedTexture:
      fragmentShader += `
          gl_FragColor = vec4(selectedColor.xyz, 1.0);
        }`;
      break;
  }

  return fragmentShader;
}
