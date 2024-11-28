import { useEffect, useRef, useState } from "react";
import CustomCarousel from "./Carousel";
import WaveContainer from "./WaveContainer";

function App() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log("Erreur de lecture automatique:", error);
        setIsPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  const path = process.env.PUBLIC_URL + "/background-music.mp3";
  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "#1143bf" }}>
      <audio ref={audioRef} src={path} loop autoPlay />
      <button
        onClick={togglePlay}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: "#ffffff",
          border: "none",
          cursor: "pointer",
        }}
      >
        {isPlaying ? "🔇 Mute" : "🔊 Play"}
      </button>
      <CustomCarousel svgSize="100%" />
      <WaveContainer baseColor="#2480a7" waveCount={20} />
    </div>
  );
}

export default App;
