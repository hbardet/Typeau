import React, { useEffect, useRef, useCallback, useMemo } from "react";
import WaveLine from "../WaveLine/WaveLine";

const WaveContainer = ({ baseColor = "#002b36", waveCount = 20 }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  const waveTimesRef = useRef([]);

  useEffect(() => {
    waveTimesRef.current = Array(waveCount).fill(0);
  }, [waveCount]);

  const waveConfigs = useMemo(
    () =>
      Array.from({ length: waveCount }, (_, index) => {
        const progress = 2 / (waveCount - 1);
        const progressIndex = index / (waveCount - 1);
        return {
          amplitude: 2 + progress * 15,
          frequency: 0.015 + progress * 0.005,
          speed: 0.3 + progressIndex * 0.02,
          offset: (index * Math.PI) / 3,
        };
      }),
    [waveCount],
  );

  const handleMouseMove = useCallback((event) => {
    mouseRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      const width = window.innerWidth;
      const totalHeight = window.innerHeight;
      const lineHeight = totalHeight / waveCount;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      waveConfigs.forEach((config, index) => {
        const yPosition = index * lineHeight;

        // Rendu de chaque ligne en passant le contexte
        WaveLine({
          ctx,
          baseColor,
          ...config,
          time: waveTimesRef.current[index],
          mouseX: mouseRef.current.x,
          mouseY: mouseRef.current.y,
          yPosition,
          lineHeight,
          width,
        });

        waveTimesRef.current[index] += 0.05;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [baseColor, waveCount, waveConfigs]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "transparent",
      }}
      onMouseMove={handleMouseMove}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default WaveContainer;
