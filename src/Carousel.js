import React from "react";
import { Carousel, Row, Col } from "antd";
import "./Carousel.css"; // Fichier CSS pour styles personnalisés

const CustomCarousel = ({ svgSize = "100px" }) => {
  const svgPaths = [
    `${process.env.PUBLIC_URL}/character/lowercase/a_lowercase.svg`,
    `${process.env.PUBLIC_URL}/character/lowercase/b_lowercase.svg`,
    `${process.env.PUBLIC_URL}/character/lowercase/c_lowercase.svg`,
  ];

  return (
    <Carousel arrows style={{ height: "100vh", background: "transparent" }}>
      {svgPaths.map((svgPath, index) => (
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
  );
};

export default CustomCarousel;
