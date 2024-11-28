import { useEffect, useRef } from "react";
import CustomCarousel from "./Carousel";
import WaveContainer from "./WaveContainer";

function App() {
  const audioRef = useRef(null);

  useEffect(() => {
    // Créer l'élément audio
    const audio = new Audio();
    audioRef.current = audio;

    // Configurer l'audio
    audio.src = process.env.PUBLIC_URL + "/background-music.mp3";
    audio.loop = true;
    audio.autoplay = true;
    audio.volume = 0.7;
    // Forcer le mode "muted" initialement peut aider à contourner les restrictions
    audio.muted = false;

    const playAudio = async () => {
      try {
        // Tenter plusieurs approches pour démarrer l'audio
        await audio.load();
        await audio.play();

        // Si la lecture réussit, on peut ajuster le volume
        audio.muted = false;
        console.log("Audio démarré avec succès");
      } catch (error) {
        console.log("Erreur initiale de lecture:", error);
        // En cas d'échec, on réessaie après un court délai
        setTimeout(() => {
          audio
            .play()
            .catch((e) => console.log("Nouvelle tentative échouée:", e));
        }, 1000);
      }
    };

    // Démarrer l'audio immédiatement
    playAudio();

    // Ajouter des gestionnaires d'événements supplémentaires
    audio.addEventListener("canplaythrough", () => {
      audio
        .play()
        .catch((e) => console.log("Erreur lors de canplaythrough:", e));
    });

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "#1143bf" }}>
      <CustomCarousel svgSize="100%" />
      <WaveContainer baseColor="#2480a7" waveCount={20} />
    </div>
  );
}

export default App;
