// WaveLine.js
import React from "react";

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
      const radius = 50;
      const distanceX = Math.abs(x - mouseX);
      const distance = Math.sqrt(distanceX * distanceX);

      const verticalFactor = 1 - verticalDistance / verticalRadius;

      if (distance < radius) {
        const influence = (1 - distance / radius) * 15 * verticalFactor;
        y += influence * Math.sin(distance * .1);
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

