import WaveContainer from "./WaveContainer";
import CustomCarousel from "./Carousel";

function App() {
  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "#1143bf" }}>
      <CustomCarousel svgSize="100%" />
      <WaveContainer baseColor="#2480a7" waveCount={20} />
    </div>
  );
}

export default App;
