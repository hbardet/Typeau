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
  const extendedSvgList = [svgList[svgList.length - 1], ...svgList, svgList[0]];

  const [index, setIndex] = useState(1);
  const [dragStart, setDragStart] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const containerRef = useRef(null);
  const prevParentIndexRef = useRef(currentIndex);

  const [leftButtonOffset, setLeftButtonOffset] = useState(0);
  const [rightButtonOffset, setRightButtonOffset] = useState(0);

  useEffect(() => {
    let rafId;
    let start = null;
    function animate(timestamp) {
      if (start === null) start = timestamp;
      const time = (timestamp - start) / 1000;
      const amplitude = 10;
      const frequency = 0.5;

      setLeftButtonOffset(amplitude * Math.sin(time * frequency));
      setRightButtonOffset(amplitude * Math.sin(time * frequency + Math.PI));
      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const old = prevParentIndexRef.current;
    const newP = currentIndex;
    let diff = newP - old;
    if (diff > 13) diff = diff - 26;
    if (diff < -13) diff = diff + 26;

    if (diff < 0 && old === 0 && newP === 25) {
      setIndex(0);
    } else if (diff > 0 && old === 25 && newP === 0) {
      setIndex(extendedSvgList.length - 1);
    } else {
      setIndex(newP + 1);
    }

    prevParentIndexRef.current = newP;
  }, [currentIndex, extendedSvgList.length]);

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
      setIsTransitionEnabled(false);
      setIndex(1);
    } else if (index === 0) {
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
          left: "20px", // Adjust the gap from the left edge
          transform: `translateY(${leftButtonOffset}px) translateY(-50%)`,
        }}
      >
        <img
          src={PREV_ICON}
          alt="Button"
          draggable="false"
          style={{
            width: "5vw", // Use viewport width for consistent sizing
            height: "5vw",
            userSelect: "none",
            objectFit: "contain",
          }}
        />
      </button>
      <button
        onClick={slideNext}
        style={{
          ...buttonStyle,
          right: "20px", // Adjust the gap from the right edge
          transform: `translateY(${rightButtonOffset}px) translateY(-50%)`,
        }}
      >
        <img
          src={NEXT_ICON}
          alt="Button"
          draggable="false"
          style={{
            width: "5vw", // Use viewport width for consistent sizing
            height: "5vw",
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
