import type { IntervalAnimationOptions } from "./interval-animation";
import { intervalAnimation } from "./interval-animation";
import type { AnimationHandle } from "./animation-handle";
import { Vector2 } from "three";

export interface MetaballsSystem {
  canvas: HTMLCanvasElement,
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

export function getMetaballsSystem(onUpdate: () => void): MetaballsSystem {

  const width = window.innerWidth;
  const height = window.innerHeight;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d")!;

  const balls = createBalls(20, width, height);

  const handle = intervalAnimation({
    onUpdate: (elapsed) => {
      console.log("fps", 1 / elapsed);
      moveBalls(balls, elapsed, width, height);
      drawPixels(width, height, balls, context);
      onUpdate();
    },
    onDispose: () => {
      balls.splice(0, balls.length);
    },
  });

  return {
    canvas,
    handle,
  };
}

function createBalls(amount: number, width: number, height: number): Ball[] {
  const balls: Ball[] = [];

  const radiuses = [40, 50, 60, 70, 80];

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
      textureOffsetX: ballCanvas.width >> 1,
      textureOffsetY: ballCanvas.height >> 1,
      texture: ballCanvas,
    });
  }

  return balls;
}

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

      imageData.data[index] = color % 255;
      imageData.data[index + 1] = color % 255;
      imageData.data[index + 2] = color % 255;
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
  // const { width, height } = imageData;
  context.globalCompositeOperation = "lighter";
  context.clearRect(0, 0, width, height);
  for (const ball of balls) {
    // >> 1 is the same as Math.floor(x / 2)
    context.drawImage(ball.texture, 0, 0, ball.texture.width, ball.texture.height, ball.x - ball.textureOffsetX, ball.y - ball.textureOffsetY, ball.texture.width, ball.texture.height);
  }
}
