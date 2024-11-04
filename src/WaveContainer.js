import React, { useState, useCallback, useMemo } from "react";
import WaveLine from "./WaveLine";
import TextOverlay from "./TextOverlay";

const WaveContainer = ({ baseColor = "#002b36", waveCount = 20 }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [textInfluence, setTextInfluence] = useState({
    content: "",
    position: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: 0,
    },
  });

  const handleMouseMove = useCallback((event) => {
    setMousePos({
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const handleTextChange = useCallback((textInfo) => {
    console.log("WaveContainer received text update:", textInfo);
    setTextInfluence(textInfo);
  }, []);

  const waveConfigs = useMemo(
    () =>
      Array.from({ length: waveCount }, (_, index) => {
        const progress = index / (waveCount - 1);
        return {
          amplitude: 20 + progress * 15,
          frequency: 0.015 + progress * 0.005,
          speed: 0.3 + progress * 0.2,
          offset: (index * Math.PI) / 3,
          phase: (index * Math.PI) / 4,
          deformationIntensity: 0.5 + progress * 2,
        };
      }),
    [waveCount],
  );

  const lineHeight = window.innerHeight / waveCount;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#fdf6e3",
      }}
      onMouseMove={handleMouseMove}
    >
      {waveConfigs.map((config, index) => {
        const yPosition = index * lineHeight;
        console.log("Rendering WaveLine with textInfluence:", textInfluence);

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              top: `${(100 / waveCount) * index}%`,
              left: 0,
              width: "100%",
              height: `${100 / waveCount}%`,
            }}
          >
            <WaveLine
              baseColor={baseColor}
              {...config}
              mouseX={mousePos.x}
              mouseY={mousePos.y}
              yPosition={yPosition}
              lineHeight={lineHeight}
              textInfluence={textInfluence}
            />
          </div>
        );
      })}
      <TextOverlay onTextChange={handleTextChange} />
    </div>
  );
};

export default WaveContainer;
