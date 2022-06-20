export function generateSingleColorTexture(stroke: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d")!;
  context.fillStyle = stroke;
  context.fillRect(0, 0, 1, 1);

  return canvas;
}
