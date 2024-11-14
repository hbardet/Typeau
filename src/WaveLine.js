import React, { useEffect, useRef } from "react";

const WaveLine = ({
  baseColor = "#002b36",
  amplitude = 25,
  frequency = 0.02,
  speed = 0.05,
  offset = 0,
  phase = 0,
  deformationIntensity = 1,
  mouseX = 0,
  mouseY = 0,
  yPosition = 0,
  lineHeight = 0,
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef({ time: phase });
  const mouseRef = useRef({ x: mouseX, y: mouseY });

  useEffect(() => {
    mouseRef.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrame;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight / 4;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawWave = () => {
      const width = canvas.width;
      const height = canvas.height;
      const { x: currentMouseX, y: currentMouseY } = mouseRef.current;

      ctx.beginPath();
      ctx.moveTo(0, height / 2);

      for (let x = 0; x <= width; x += 1) {
        let y =
          height / 2 +
          amplitude *
            Math.sin(
              x * frequency + animationRef.current.time * speed + offset
            );

        const verticalDistance = Math.abs(
          currentMouseY - (yPosition + lineHeight / 2)
        );
        const verticalRadius = 50;

        if (verticalDistance < verticalRadius) {
          const radius = 100;
          const distanceX = Math.abs(x - currentMouseX);
          const distance = Math.sqrt(distanceX * distanceX);

          const verticalFactor = 1 - verticalDistance / verticalRadius;

          if (distance < radius) {
            const influence = (1 - distance / radius) * 30 * verticalFactor;
            y += influence * Math.sin(distance * 0.1);
          }
        }

        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = baseColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawWave();
      animationRef.current.time += 0.05;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, [amplitude, frequency, speed, offset, baseColor, yPosition, lineHeight]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        left: 0,
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default WaveLine;
