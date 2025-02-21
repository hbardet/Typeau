import { useEffect, useRef, useState } from "react";
import CustomCarousel from "../../Components/Carousel/Carousel";
import WaveContainer from "../../Components/WaveContainer/WaveContainer";
import RoundedButton from "../../Components/RoundedButton/RoundedButton";
import ProgressBar from "../../Components/ProgressBar/ProgressBar";

const PLAY_ICON = `${process.env.PUBLIC_URL}/assets/son.svg`;
const PAUSE_ICON = `${process.env.PUBLIC_URL}/assets/mute.svg`;
const LOWERCASE_ICON = `${process.env.PUBLIC_URL}/assets/lowercase.svg`;
const UPPERCASE_ICON = `${process.env.PUBLIC_URL}/assets/uppercase.svg`;

function createListSvg(basePath) {
  const svgList = [];
  for (let i = 0; i < 26; i++) {
    svgList.push(`${process.env.PUBLIC_URL}/character/${basePath}/${String.fromCharCode(97 + i)}_${basePath}.svg`);
  }
  return svgList;
}

const svgListLower = createListSvg("lowercase");
const svgListUpper = createListSvg("uppercase");

function Typeau() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFirstCarousel, setShowFirstCarousel] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
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
    const characterCode = showFirstCarousel ? 97 + currentIndex : 65 + currentIndex;
    setCharacter(String.fromCharCode(characterCode));
  }, [showFirstCarousel, currentIndex]);

  const path = process.env.PUBLIC_URL + "/background-music.mp3";
  const alphabetList = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        overflow: "auto",
        backgroundColor: "#1143bf",
        position: "relative",
      }}
    >
      <audio ref={audioRef} src={path} loop autoPlay />
      <div style={{ height: "100vh", padding: "20px" }}>
        <CustomCarousel
          svgList={showFirstCarousel ? svgListLower : svgListUpper}
          svgSize="50%"
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
        <WaveContainer />
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 20px",
          zIndex: 20,
          pointerEvents: "auto",
          backgroundColor: "transparent",
        }}
      >
       <RoundedButton
          icon={isPlaying ? PLAY_ICON :  PAUSE_ICON}
          onClick={togglePlay}
          size={100}
          color="#fff"
          backgroundColor="#2480A7"
          borderColor="#2480A7"
          style={{}}
        />
        <div style={{ flexGrow: 1, margin: "0 20px" }}>
          <ProgressBar currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} alphabet={alphabetList} />
        </div>
        <RoundedButton
          icon={showFirstCarousel ? LOWERCASE_ICON : UPPERCASE_ICON}
          onClick={toggleCarousel}
          size={100}
          color="#fff"
          backgroundColor="#2480A7"
          borderColor="#2480A7"
          style={{}}
        />
      </div>
    </div>
  );
}

export default Typeau;

