export function generateRainbowTexture(): HTMLImageElement {
  const rainbowImage = new Image(800, 600);
  rainbowImage.src = "assets/rainbow.png";

  return rainbowImage;
}
