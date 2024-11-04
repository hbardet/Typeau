import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const TextContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  height: 200px;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextInput = styled.input`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  border: none;
  color: #002b36;
  font-family: "MaTypo", sans-serif;
  font-size: 48px;
  text-align: center;
  padding: 0;
  min-width: 300px; // Largeur minimum
  width: auto;
  max-width: 80vw;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
  }
`;

const TextOverlay = ({ onTextChange }) => {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const updatePosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      onTextChange({
        content: text,
        position: {
          x: window.innerWidth / 2, // Centre exact de l'écran
          y: rect.top + rect.height / 2,
          width: rect.width,
        },
      });
    }
  };

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      onTextChange({
        content: newText,
        position: {
          x: window.innerWidth / 2, // Centre exact de l'écran
          y: rect.top + rect.height / 2,
          width: rect.width,
        },
      });
    }
  };

  useEffect(() => {
    updatePosition();
    const interval = setInterval(updatePosition, 100);
    return () => clearInterval(interval);
  }, [text]);

  useEffect(() => {
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  return (
    <TextContainer>
      <TextInput
        ref={inputRef}
        value={text}
        onChange={handleChange}
        placeholder="Tapez votre texte..."
        autoFocus
      />
    </TextContainer>
  );
};

export default TextOverlay;
