import React, { useState, useEffect } from "react";
import WaveLine from "./WaveLine";
import TextOverlay from "./TextOverlay";

const WaveContainer = ({ baseColor = "#2196f3", waveCount = 5 }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [textInfluence, setTextInfluence] = useState({
    content: "",
    position: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: 0,
    },
  });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePos({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleTextChange = (textInfo) => {
    setTextInfluence({
      letters: textInfo.letters,
      content: textInfo.content,
    });
  };

  const generateWaveConfigs = () => {
    return Array.from({ length: waveCount }, (_, index) => {
      const progress = index / (waveCount - 1);
      return {
        amplitude: 20 + progress * 15,
        frequency: 0.015 + progress * 0.005,
        speed: 0.3 + progress * 0.2,
        offset: (index * Math.PI) / 3,
        phase: (index * Math.PI) / 4,
        deformationIntensity: 0.5 + progress * 2,
      };
    });
  };

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
        background: "#000",
      }}
    >
      {generateWaveConfigs().map((config, index) => {
        const yPosition = index * lineHeight;

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
