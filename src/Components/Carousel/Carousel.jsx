import React, { useState, useRef, useEffect } from "react";
import "./Carousel.css";

const CustomCarousel = ({
  svgSize = "20%",
  svgList = [],
  currentIndex = 0,
  setCurrentIndex,
}) => {
  // Extended list with clones at start and end.
  const extendedSvgList = [svgList[svgList.length - 1], ...svgList, svgList[0]];

  // Internal index starts at 1 (first real slide)
  const [index, setIndex] = useState(1);
  const [dragStart, setDragStart] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const containerRef = useRef(null);
  const prevParentIndexRef = useRef(currentIndex);

  // When parent's currentIndex changes, decide on a target internal index.
  // Use a circular difference calculation (alphabet length = 26).
  useEffect(() => {
    const old = prevParentIndexRef.current;
    const newP = currentIndex;
    let diff = newP - old;
    if (diff > 13) diff = diff - 26;
    if (diff < -13) diff = diff + 26;

    // If moving backward (from A to Z)
    if (diff < 0 && old === 0 && newP === 25) {
      setIndex(0);
    }
    // If moving forward (from Z to A)
    else if (diff > 0 && old === 25 && newP === 0) {
      setIndex(extendedSvgList.length - 1);
    } else {
      // In all other cases, the internal index matches parent's index + 1.
      setIndex(newP + 1);
    }
    prevParentIndexRef.current = newP;
  }, [currentIndex, extendedSvgList.length]);

  // Propagate internal index changes back to the parent mapping internal index to parent's range.
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

  // Re-enable CSS transition after an instant jump.
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
      <button onClick={slidePrev} style={{ ...buttonStyle, left: "10px" }}>
        Previous
      </button>
      <button onClick={slideNext} style={{ ...buttonStyle, right: "10px" }}>
        Next
      </button>
    </div>
  );
};

const buttonStyle = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "#fff",
  border: "none",
  padding: "10px",
  cursor: "pointer",
  zIndex: 1,
};

export default CustomCarousel;
