import React, { useState, useRef, useEffect } from "react";
import "./Carousel.css";

const NEXT_ICON = `${process.env.PUBLIC_URL}/assets/next.svg`;
const PREV_ICON = `${process.env.PUBLIC_URL}/assets/previous.svg`;

const CustomCarousel = ({
  svgSize = "20%",
  svgList = [],
  currentIndex = 0,
  setCurrentIndex,
}) => {
  // Extended list with clones at start and end for circular looping.
  const extendedSvgList = [svgList[svgList.length - 1], ...svgList, svgList[0]];

  // Internal index (offset by 1 because of the clone at the beginning)
  const [index, setIndex] = useState(1);
  const [dragStart, setDragStart] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const containerRef = useRef(null);
  const prevParentIndexRef = useRef(currentIndex);

  // STATES FOR BUTTON ANIMATION
  const [leftButtonOffset, setLeftButtonOffset] = useState(0);
  const [rightButtonOffset, setRightButtonOffset] = useState(0);

  // Animate button offsets based on a wave-like formula.
  useEffect(() => {
    let rafId;
    let start = null;
    function animate(timestamp) {
      if (start === null) start = timestamp;
      const time = (timestamp - start) / 1000; // in seconds
      const amplitude = 10; // vertical offset amplitude in px
      const frequency = 0.5; // control speed of oscillation

      // Left button uses phase 0, right button uses phase π so they move oppositely.
      setLeftButtonOffset(amplitude * Math.sin(time * frequency));
      setRightButtonOffset(amplitude * Math.sin(time * frequency + Math.PI));
      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // When parent's currentIndex changes, determine the internal (extended) index.
  useEffect(() => {
    const old = prevParentIndexRef.current;
    const newP = currentIndex;
    let diff = newP - old;
    // Account for wrapping with 26 letters.
    if (diff > 13) diff = diff - 26;
    if (diff < -13) diff = diff + 26;

    // If moving backward (A → Z)
    if (diff < 0 && old === 0 && newP === 25) {
      setIndex(0);
    }
    // If moving forward (Z → A)
    else if (diff > 0 && old === 25 && newP === 0) {
      setIndex(extendedSvgList.length - 1);
    } else {
      setIndex(newP + 1);
    }

    prevParentIndexRef.current = newP;
  }, [currentIndex, extendedSvgList.length]);

  // Propagate the internal index back to parent's currentIndex (mapping back to 0…25)
  useEffect(() => {
    if (index === 0) {
      setCurrentIndex(extendedSvgList.length - 3);
    } else if (index === extendedSvgList.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(index - 1);
    }
  }, [index, extendedSvgList.length, setCurrentIndex]);

  const handleDragStart = (clientX) => {
    setDragStart(clientX);
  };

  const handleDragMove = (clientX) => {
    if (dragStart !== null) {
      setDragOffset(clientX - dragStart);
    }
  };

  const handleDragEnd = () => {
    if (dragStart !== null && containerRef.current) {
      const threshold = containerRef.current.offsetWidth * 0.25;
      if (dragOffset > threshold) {
        slidePrev();
      } else if (dragOffset < -threshold) {
        slideNext();
      }
      setDragStart(null);
      setDragOffset(0);
    }
  };

  const handleMouseDown = (e) => handleDragStart(e.clientX);
  const handleMouseMove = (e) => handleDragMove(e.clientX);
  const handleMouseUp = () => handleDragEnd();
  const handleTouchStart = (e) => handleDragStart(e.touches[0].clientX);
  const handleTouchMove = (e) => handleDragMove(e.touches[0].clientX);
  const handleTouchEnd = () => handleDragEnd();

  const slideNext = () => {
    setIndex((prev) => prev + 1);
    setIsTransitionEnabled(true);
  };

  const slidePrev = () => {
    setIndex((prev) => prev - 1);
    setIsTransitionEnabled(true);
  };

  const handleTransitionEnd = () => {
    if (index === extendedSvgList.length - 1) {
      // Jump from cloned slide at the right to the first real slide.
      setIsTransitionEnabled(false);
      setIndex(1);
    } else if (index === 0) {
      // Jump from cloned slide at the left to the last real slide.
      setIsTransitionEnabled(false);
      setIndex(extendedSvgList.length - 2);
    }
  };

  useEffect(() => {
    if (!isTransitionEnabled) {
      const timer = setTimeout(() => {
        setIsTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitionEnabled]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        cursor: "grab",
      }}
    >
      <div
        className="carousel-container"
        onTransitionEnd={handleTransitionEnd}
        style={{
          display: "flex",
          transition:
            isTransitionEnabled && dragStart === null
              ? "transform 0.5s ease-in-out"
              : "none",
          transform: `translateX(calc(-${index * 100}% + ${dragOffset}px))`,
        }}
      >
        {extendedSvgList.map((svgPath, idx) => (
          <div
            key={idx}
            className="carousel-slide"
            style={{
              minWidth: "100%",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={svgPath}
              alt={`SVG ${idx}`}
              draggable="false"
              style={{
                width: "50%",
                height: "50%",
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
              }}
            />
          </div>
        ))}
      </div>
      <button
        onClick={slidePrev}
        style={{
          ...buttonStyle,
          transform: `translateY(${leftButtonOffset}px) translateY(-50%)`,
        }}
      >
       <img
        src={PREV_ICON}
        alt="Button"
        draggable="false"
        style={{
          width: "300%",
          height: "300%",
          userSelect: "none",
        }}
      />
      </button>
      <button
        onClick={slideNext}
        style={{
          ...buttonStyle,
          right: "40px",
          transform: `translateY(${rightButtonOffset}px) translateY(-50%)`,
        }}
      >
       <img
        src={NEXT_ICON}
        alt="Button"
        draggable="false"
        style={{
          width: "300%",
          height: "300%",
          userSelect: "none",
        }}
      />
      </button>
    </div>
  );
};

const buttonStyle = {
  position: "absolute",
  top: "50%",
  backgroundColor: "rgba(0, 0, 0, 0)",
  color: "#fff",
  border: "none",
  padding: "10px",
  cursor: "pointer",
  zIndex: 1,
};

export default CustomCarousel;

