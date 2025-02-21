import React, { useState, useEffect } from "react";

const ProgressBar = ({ currentIndex, setCurrentIndex, alphabet }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [time, setTime] = useState(0);

  // Update the time continuously for vertical oscillation.
  useEffect(() => {
    let rafId;
    const start = performance.now();
    const animate = () => {
      const newTime = (performance.now() - start) / 1000; // time in seconds
      setTime(newTime);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Wave parameters.
  const verticalAmplitude = 5; // vertical movement in pixels
  const verticalFrequency = 2; // radians per second
  const verticalPhaseStep = Math.PI / 6; // phase offset per button

  const getVerticalOffset = (idx) => {
    return verticalAmplitude * Math.sin(time * verticalFrequency + idx * verticalPhaseStep);
  };

  // Hover (dock) effect parameters.
  const getScale = (idx) => {
    if (hoveredIndex === null) return 1;
    const diff = Math.abs(idx - hoveredIndex);
    if (diff === 0) return 1.5;
    if (diff === 1) return 1.2;
    return 1;
  };

  const getTranslationX = (idx) => {
    if (hoveredIndex === null) return 0;
    const diff = idx - hoveredIndex;
    if (Math.abs(diff) > 1) return 0;
    return diff * 5;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
      }}
    >
      {alphabet.map((letter, idx) => {
        const isActive = idx === currentIndex;
        const scale = getScale(idx);
        const translationX = getTranslationX(idx);
        const verticalOffset = getVerticalOffset(idx);
        return (
          <div
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              width: isActive ? "40px" : "30px",
              height: isActive ? "40px" : "30px",
              borderRadius: "25%",
              backgroundColor: isActive ? "#2480A7" : "#ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: isActive ? "20px" : "16px",
              color: isActive ? "#fff" : "#1143BF",
              transition: "all 0.3s ease",
              // If active, set transformOrigin so scaling grows upward.
              transformOrigin: isActive ? "bottom center" : "center",
              transform: `translateX(${translationX}px) translateY(${verticalOffset}px) scale(${scale})`,
            }}
          >
            {letter.toUpperCase()}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;

