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
  background: transparent;
  border: none;
  color: white;
  font-family: "MaTypo", sans-serif;
  font-size: 48px;
  text-align: center;
  width: 100%;

  &:focus {
    outline: none;
  }
`;

const TextOverlay = ({ onTextChange }) => {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      onTextChange({
        content: text,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
        },
      });
    }
  }, [text, onTextChange]);

  return (
    <TextContainer>
      <TextInput
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tapez votre texte..."
        autoFocus
      />
    </TextContainer>
  );
};

export default TextOverlay;
