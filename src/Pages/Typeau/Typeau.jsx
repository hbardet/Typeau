import { useEffect, useRef, useState } from "react";
import CustomCarousel from "../../Components/Carousel/Carousel";
import WaveContainer from "../../Components/WaveContainer/WaveContainer";
import RoundedButton from "../../Components/RoundedButton/RoundedButton";
import ProgressBar from "../../Components/ProgressBar/ProgressBar";

const PLAY_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21" />
  </svg>
);

const PAUSE_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const UPPERCASE_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="3" y="20" fontSize="18" fill="currentColor" fontWeight="bold">
      A
    </text>
    <text x="12" y="18" fontSize="14" fill="currentColor" fontWeight="bold">
      a
    </text>
  </svg>
);

const LOWERCASE_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="3" y="18" fontSize="14" fill="currentColor" fontWeight="bold">
      A
    </text>
    <text x="10" y="20" fontSize="18" fill="currentColor" fontWeight="bold">
      a
    </text>
  </svg>
);

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
      
      {/* Unified bottom container holding both the progress bar and the rounded buttons */}
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
          padding: "0 20px",
          zIndex: 20,
          pointerEvents: "auto",
          backgroundColor: "transparent", // Transparent; adjust if needed
        }}
      >
        <RoundedButton
          icon={isPlaying ? PAUSE_ICON : PLAY_ICON}
          onClick={togglePlay}
          size={50}
          color="#fff"
          backgroundColor="#4CAF50"
          borderColor="#3e8e41"
          style={{}}
        />
        <div style={{ flexGrow: 1, margin: "0 20px" }}>
          <ProgressBar currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} alphabet={alphabetList} />
        </div>
        <RoundedButton
          icon={showFirstCarousel ? LOWERCASE_ICON : UPPERCASE_ICON}
          onClick={toggleCarousel}
          size={50}
          color="#fff"
          backgroundColor="#03A9F4"
          borderColor="#039BE5"
          style={{}}
        />
      </div>
    </div>
  );
}

export default Typeau;

