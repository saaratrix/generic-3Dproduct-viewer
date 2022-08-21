import type { WebGLRenderTarget } from 'three';

export interface ColorBlurOutlineTextures {
  hover?: HTMLImageElement | HTMLCanvasElement | WebGLRenderTarget;
  selected?: HTMLImageElement | HTMLCanvasElement | WebGLRenderTarget;
}
