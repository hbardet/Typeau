import CustomCarousel from "./Carousel";
import WaveContainer from "./WaveContainer";

function App() {
  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "#1143bf" }}>
      <audio id="audio" loop autoPlay>
        <source
          src={process.env.PUBLIC_URL + "/background-music.mp3"}
          type="audio/mpeg"
        />
      </audio>
      <CustomCarousel svgSize="100%" />
      <WaveContainer baseColor="#2480a7" waveCount={20} />
    </div>
  );
}

export default App;
