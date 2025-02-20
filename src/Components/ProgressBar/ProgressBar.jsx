import React from "react";

const ProgressBar = ({ currentIndex, setCurrentIndex, alphabet }) => {
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
        return (
          <div
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: isActive ? "40px" : "30px",
              height: isActive ? "40px" : "30px",
              borderRadius: "25%",
              backgroundColor: isActive ? "#4CAF50" : "#ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: isActive ? "20px" : "16px",
              transition: "all 0.3s ease",
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

