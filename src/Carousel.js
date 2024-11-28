import React, { useState } from "react";
import { Carousel, Row, Col, Button } from "antd";
import "./Carousel.css";

const CustomCarousel = ({
  svgSize = "20%",
  svgList = [],
  currentIndex = 0,
  setCurrentIndex,
}) => {
  return (
    <div style={{ height: "100vh", position: "relative" }}>
      <Carousel
        arrows
        beforeChange={(from, to) => setCurrentIndex(to)}
        style={{ width: "100%", height: "100vh", background: "transparent" }}
      >
        {svgList.map((svgPath, index) => (
          <div key={index} className="carousel-slide">
            <Row justify="center" align="middle" style={{ height: "100%" }}>
              <Col>
                <img
                  src={svgPath}
                  alt={`SVG ${index + 1}`}
                  style={{ width: svgSize, height: svgSize }}
                />
              </Col>
            </Row>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CustomCarousel;
