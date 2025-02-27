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
  const letterAudioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showFirstCarousel, setShowFirstCarousel] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [character, setCharacter] = useState("a");
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  const toggleCarousel = () => {
    setShowFirstCarousel(!showFirstCarousel);
  };

  const togglePlay = () => {
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause();
      } else {
        // Vérifier si l'audio est chargé avant de jouer
        if (audioLoaded) {
          currentAudio.play().catch(e => {
            console.error("Error playing audio:", e);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update character when index or case changes
  useEffect(() => {
    const characterCode = showFirstCarousel ? 97 + currentIndex : 65 + currentIndex;
    setCharacter(String.fromCharCode(characterCode));
  }, [showFirstCarousel, currentIndex]);

  // Gérer le chargement et la lecture du son de la lettre
  useEffect(() => {
    // Fonction pour créer et charger l'audio
    const loadLetterAudio = () => {
      // Définir les fonctions de gestion d'événements d'abord
      function handleCanPlay() {
        console.log("Audio can play:", letterSoundPath);
        setAudioLoaded(true);
        if (isPlaying) {
          audio.play().catch(e => {
            console.error("Error playing audio after load:", e);
          });
        }
      }
      
      function handleError(e) {
        console.error("Error loading audio:", letterSoundPath, e);
        setAudioLoaded(false);
      }
      
      // Arrêter l'audio actuel s'il existe
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.removeEventListener('canplaythrough', handleCanPlay);
        currentAudio.removeEventListener('error', handleError);
      }

      // Créer le chemin du fichier audio
      const letterChar = String.fromCharCode(97 + currentIndex).toLowerCase();
      const letterSoundPath = `${process.env.PUBLIC_URL}/sound/${letterChar}_sound.mp3`;
      
      console.log("Loading audio:", letterSoundPath);
      
      // Créer un nouvel élément audio
      const audio = new Audio();
      
      // Configurer les gestionnaires d'événements
      audio.addEventListener('canplaythrough', handleCanPlay);
      audio.addEventListener('error', handleError);
      
      // Configurer l'audio
      audio.src = letterSoundPath;
      audio.loop = true;
      
      // Mettre à jour les références
      letterAudioRef.current = audio;
      setCurrentAudio(audio);
      setAudioLoaded(false);
      
      // Commencer à charger l'audio
      audio.load();
      
      // Fonction de nettoyage
      return () => {
        audio.removeEventListener('canplaythrough', handleCanPlay);
        audio.removeEventListener('error', handleError);
      };
    };
    
    loadLetterAudio();
    
    // Nettoyage lors du démontage du composant
    return () => {
      if (letterAudioRef.current) {
        letterAudioRef.current.pause();
        letterAudioRef.current = null;
      }
    };
  }, [currentIndex, isPlaying]);

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
          icon={isPlaying ? PLAY_ICON : PAUSE_ICON}
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

