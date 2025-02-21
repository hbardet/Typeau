import React from "react";

const RoundedButton = ({ icon, onClick, size, color, backgroundColor, borderColor, style }) => {
  const mergedStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: size,
    height: size,
    color,
    backgroundColor,
    border: `2px solid ${borderColor}`,
    borderRadius: "50%",
    cursor: "pointer",
    ...style,
  };

  return (
    <button onClick={onClick} style={mergedStyles}>
      {icon}
    </button>
  );
};

export default RoundedButton;

