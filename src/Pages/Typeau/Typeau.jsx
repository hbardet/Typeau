import { Button } from "antd";
import { useEffect, useRef, useState } from "react";
import CustomCarousel from "../../Components/Carousel/Carousel";
import WaveContainer from "../../Components/WaveContainer/WaveContainer";

function createListSvg(basePath) {
  const svgList = [];
  for (let i = 0; i < 26; i++) {
    svgList.push(
      `${process.env.PUBLIC_URL}/character/${basePath}/${String.fromCharCode(97 + i)}_${basePath}.svg`,
    );
  }
  return svgList;
}

const svgListLower = createListSvg("lowercase");
const svgListUpper = createListSvg("uppercase");

function Typeau() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [showFirstCarousel, setShowFirstCarousel] = useState(true);
  const [index, setIndex] = useState(0);
  const [character, setCharacter] = useState("a");

  const toggleCarousel = () => {
    setShowFirstCarousel(!showFirstCarousel);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
      if (audio) {
        audio.play().catch((error) => {
        console.log("Erreur de lecture automatique:", error);
        setIsPlaying(false);
      });
    }

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);


  useEffect(() => {
    const currentIndex = index;
    const characterCode = showFirstCarousel
      ? 97 + currentIndex
      : 65 + currentIndex;
    setCharacter(String.fromCharCode(characterCode));
  }, [showFirstCarousel, index]);

  const path = process.env.PUBLIC_URL + "/background-music.mp3";

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        overflow: "auto",
        backgroundColor: "#1143bf",
      }}
    >
      <audio ref={audioRef} src={path} loop autoPlay />
      <div style={{ height: "100vh", position: "relative" }}>
        {showFirstCarousel ? (
          <CustomCarousel
            svgList={svgListLower}
            svgSize="200%"
            setCurrentIndex={setIndex}
          />
        ) : (
          <CustomCarousel
            svgList={svgListUpper}
            svgSize="200%"
            setCurrentIndex={setIndex}
          />
        )}
      </div>
      <WaveContainer baseColor="#2480a7" waveCount={20} />
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <Button
          onClick={togglePlay}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "50px",
            height: "50px",
            borderRadius: "25",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isPlaying ? "🔊" : "🔇"}
        </Button>
        <Button
          type="primary"
          onClick={toggleCarousel}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "50px",
            height: "50px",
            borderRadius: "25",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {character}
        </Button>
      </div>
    </div>
  );
}

export default Typeau;
