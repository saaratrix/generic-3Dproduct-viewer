import type { IntervalAnimationOptions } from "../animations/interval-animation";
import { intervalAnimation } from "../animations/interval-animation";
import type { AnimationHandle } from "../animations/animation-handle";
import { RGBAFormat, ShaderMaterial, Texture, Vector2, WebGLRenderTarget } from "three";
import type { WebGLRenderer } from "three";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";
import type { AnimatedTextureBlurOutlinePass } from "../AnimatedTextureBlurOutlinePass";

// This file was just for fun playing around with different outline effects and with meta balls :)

export interface MetaballsSystem {
  canvas: HTMLCanvasElement,
  renderTarget: WebGLRenderTarget,
  handle: AnimationHandle<IntervalAnimationOptions>
}

interface Ball {
  radius: number;
  x: number;
  y: number;
  direction: Vector2;

  textureOffsetX: number,
  textureOffsetY: number,
  /**
   * Pre calculated texture for performance.
   */
  texture: HTMLCanvasElement,
}

export function getMetaballsSystem(renderer: WebGLRenderer, outlinePass: AnimatedTextureBlurOutlinePass, onUpdate?: () => void): MetaballsSystem {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d")!;
  context.globalCompositeOperation = "lighter";

  const renderTarget = new WebGLRenderTarget(width, height, {
    format: RGBAFormat,
  });
  renderTarget.texture.name = "metaballs";
  renderTarget.texture.generateMipmaps = false;

  const metaballsTexture = new Texture(canvas);

  let hueOffset = 0;
  // 1 cycle in x seconds.
  const hueOffsetSpeed = 1 / 30;

  const shaderMaterial = createMetaballsShaderMaterial(metaballsTexture, hueOffset);
  const fsQuad = new FullScreenQuad(shaderMaterial);

  const balls = createBalls(12, width, height);

  const handle = intervalAnimation({
    onUpdate: (elapsed) => {
      moveBalls(balls, elapsed, width, height);
      hueOffset += elapsed * hueOffsetSpeed;
      if (hueOffset > 1) {
        hueOffset--;
      }

      if (outlinePass.shouldRenderOutline()) {
        shaderMaterial.uniforms.hueOffset.value = hueOffset;
        drawPixels(width, height, balls, context);
        metaballsTexture.needsUpdate = true;
        drawColours(fsQuad, renderer, renderTarget);
      }

      if (onUpdate) {
        onUpdate();
      }
    },
    onDispose: () => {
      balls.splice(0, balls.length);
      fsQuad.dispose();
      metaballsTexture.dispose();
      renderTarget.dispose();
      shaderMaterial.dispose();
    },
  });

  return {
    canvas,
    renderTarget,
    handle,
  };
}

function createMetaballsShaderMaterial(texture: Texture, hueOffset: number): ShaderMaterial {
  // Source for hsv2rgb: https://stackoverflow.com/a/17897228/2437350
  // More information: http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
  //                   http://lolengine.net/blog/2013/01/13/fast-rgb-to-hsv

  const fragmentShader = `varying vec2 vUv;
    uniform sampler2D metaballsTexture;
    uniform float hueOffset;

    // All components are in the range [0…1], including hue.
    vec3 hsv2rgb(vec3 c)
    {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
      vec4 metaballsColor = texture2D(metaballsTexture, vUv);
      float hueModifier = ceil(metaballsColor.y) * ceil(max(metaballsColor.x - 0.1, 0.0));
      vec3 hsv = vec3(
        hueModifier * metaballsColor.x + (1.0 - hueModifier) * hueOffset,
        1.0,
        1.0
      );
      vec3 color = hsv2rgb(hsv);

      gl_FragColor = vec4(color.xyz, 1.0);
    }
  `;

  return new ShaderMaterial({
    vertexShader: `varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
    fragmentShader,
    uniforms: {
      metaballsTexture: { value: texture },
      hueOffset: { value: hueOffset },
    },
  });
}

function createBalls(amount: number, width: number, height: number): Ball[] {
  const balls: Ball[] = [];

  const radiuses = [20, 40, 60, 80, 100];
  // const radiuses = [100];
  const ballCanvases: Map<number, HTMLCanvasElement> = new Map();

  for (let i = 0; i < amount; i++) {
    const radius = radiuses[Math.round(Math.random() * (radiuses.length - 1))];

    let ballCanvas = ballCanvases.get(radius);
    if (!ballCanvas) {
      ballCanvas = createBallCanvas(radius);
      ballCanvases.set(radius, ballCanvas);
    }

    balls.push({
      radius,
      x: Math.random() * (width - 200) + 100,
      y: Math.random() * (height - 200) + 100,
      direction: new Vector2(Math.random() * 300 + 100, Math.random() * 300 + 100),
      // >> 1 is the same as Math.floor(width / 2)
      textureOffsetX: ballCanvas.width >> 1,
      textureOffsetY: ballCanvas.height >> 1,
      texture: ballCanvas,
    });
  }

  return balls;
}

// Optimization idea came from this post: https://codereview.stackexchange.com/a/160759
function createBallCanvas(radius: number): HTMLCanvasElement {
  const width = radius * 8;
  const height = radius * 8;

  const centerX = width * 0.5;
  const centerY = height * 0.5;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = width;
  canvas.style.backgroundColor = "black";
  const context = canvas.getContext("2d")!;

  const outsideLength = (width / 2) - radius;
  const easing = (t: number): number => t * t;

  const imageData = context.createImageData(width, height);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const index = (x + y * width) * 4;

      const distanceX = centerX - x;
      const distanceY = centerY - y;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const length = radius / distance;
      // let color: number = (radius / distance - Math.sqrt(distance) / width * 10) * 255;
      let color: number;
      if (length < 1) {
        // Since a square is 1.41 in length we need to cap the distance or the easing method would start increasing again.
        const falloffLength = Math.min((distance - radius), outsideLength);
        // We do 1 - value because,
        // 1 is at the closest pixel to the metaball.
        // 0 as far as we can go.
        const falloffMultiplier = easing(1 - falloffLength / outsideLength);
        color = falloffMultiplier * length * 255;
      } else {
        color = length * 255;
      }

      // Set the HSV colour values for the shader.
      // Hue
      imageData.data[index] = color;
      // saturation
      imageData.data[index + 1] = color;
      // value
      imageData.data[index + 2] = 0;
      // alpha
      imageData.data[index + 3] = 255;
    }
  }

  context.putImageData(imageData, 0, 0);
  return canvas;
}

function moveBalls(balls: Ball[], elapsed: number, width: number, height: number): void {
  for (const ball of balls) {
    ball.x += ball.direction.x * elapsed;
    ball.y += ball.direction.y * elapsed;

    if (ball.x > width) {
      ball.x = width;
      ball.direction.x *= -1;
    } else if (ball.x < 0) {
      ball.x = 0;
      ball.direction.x *= -1;
    }

    if (ball.y > height) {
      ball.y = height;
      ball.direction.y *= -1;
    } else if (ball.y < 0) {
      ball.y = 0;
      ball.direction.y *= -1;
    }
  }
}

function drawPixels(width: number, height: number, balls: Ball[], context: CanvasRenderingContext2D): void {
  context.clearRect(0, 0, width, height);
  for (const ball of balls) {
    context.drawImage(ball.texture, 0, 0, ball.texture.width, ball.texture.height, ball.x - ball.textureOffsetX, ball.y - ball.textureOffsetY, ball.texture.width, ball.texture.height);
  }
}

function drawColours(fsQuad: FullScreenQuad, renderer: WebGLRenderer, renderTarget: WebGLRenderTarget): void {
  const oldRenderTarget = renderer.getRenderTarget();
  renderer.setRenderTarget(renderTarget);
  renderer.clear();
  fsQuad.render(renderer);
  renderer.setRenderTarget(oldRenderTarget);
}
