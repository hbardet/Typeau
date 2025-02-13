const WaveLine = ({
  ctx,
  baseColor = "#002b36",
  amplitude = 2,
  frequency = 0.02,
  speed = 0.05,
  offset = 0,
  time = 0,
  mouseX = 0,
  mouseY = 0,
  yPosition = 0,
  lineHeight = 0,
  width,
}) => {
  ctx.beginPath();
  ctx.moveTo(0, yPosition + lineHeight / 2);

  for (let x = 0; x <= width; x += 1) {
    let y =
      yPosition +
      lineHeight / 2 +
      amplitude * Math.sin(x * frequency + time * speed + offset);

    const verticalDistance = Math.abs(mouseY - (yPosition + lineHeight / 2));
    const verticalRadius = 50;

    if (verticalDistance < verticalRadius) {
      const radius = 100;
      const distanceX = Math.abs(x - mouseX);
      const distance = Math.sqrt(distanceX * distanceX);

      const verticalFactor = 1 - verticalDistance / verticalRadius;

      if (distance < radius) {
        // Apply a smoother influence to avoid sharp peaks
        const influence = (1 - distance / radius) * 10 * verticalFactor; // Reduced influence factor
        y += influence * Math.cos(distance * 0.1); // Use cosine for a smoother curve
      }
    }

    ctx.lineTo(x, y);
  }

  ctx.strokeStyle = baseColor;
  ctx.lineWidth = 1;
  ctx.stroke();

  return null;
};

export default WaveLine;
