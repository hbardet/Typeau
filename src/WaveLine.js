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
  textInfluence = {
    content: "",
    position: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: 0,
    },
  },
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
              x * frequency + animationRef.current.time * speed + offset,
            );

        const verticalDistance = Math.abs(
          currentMouseY - (yPosition + lineHeight / 2),
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

        if (textInfluence.content && textInfluence.content.length > 0) {
          const centerX = width / 2;
          const centerY = window.innerHeight / 2;
          const verticalDistance = Math.abs(
            yPosition + lineHeight / 2 - centerY,
          );
          const verticalRadius = 100;

          // Facteur d'intensité basé sur la longueur du texte
          const intensityFactor = Math.min(textInfluence.content.length, 3); // Maximum 3x plus intense

          // Calcul de la largeur horizontale basée sur la longueur du texte
          const horizontalRadius = Math.min(
            width / 2,
            textInfluence.content.length * 20 + 200,
          );

          if (verticalDistance < verticalRadius) {
            const distanceX = Math.abs(x - centerX);

            if (distanceX < horizontalRadius) {
              const verticalFactor = 1 - verticalDistance / verticalRadius;
              const horizontalFactor = 1 - distanceX / horizontalRadius;

              // Effet principal avec intensité croissante
              const textEffect =
                Math.sin(distanceX * 0.03 + animationRef.current.time * 1.5) *
                Math.cos(distanceX * 0.02 + animationRef.current.time) *
                (30 * intensityFactor) * // Amplitude de base multipliée par le facteur d'intensité
                horizontalFactor *
                verticalFactor *
                (Math.min(textInfluence.content.length, 20) / 15); // Augmenté pour plus d'impact

              // Effet de rebond également influencé par la longueur
              const bounceEffect =
                Math.sin(animationRef.current.time * 2) *
                (15 * Math.sqrt(intensityFactor)) * // Augmentation plus douce de l'effet de rebond
                horizontalFactor *
                verticalFactor;

              // Ajout d'une ondulation supplémentaire pour les textes longs
              const complexityEffect =
                textInfluence.content.length > 5
                  ? Math.sin(distanceX * 0.05 + animationRef.current.time) *
                    (5 * intensityFactor) *
                    horizontalFactor *
                    verticalFactor
                  : 0;

              y += textEffect + bounceEffect + complexityEffect;
            }
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
  }, [
    amplitude,
    frequency,
    speed,
    offset,
    baseColor,
    deformationIntensity,
    yPosition,
    lineHeight,
    textInfluence,
  ]);

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
