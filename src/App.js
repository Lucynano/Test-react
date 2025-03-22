import React, { useState, useEffect } from "react";

const SpeechSynthesis = () => {
  const paragraphs = [
    "Bonjour et bienvenue sur notre site ! Nous espérons que vous passerez un bon moment ici.",
    "La synthèse vocale est une technologie fascinante qui permet de donner une voix aux textes écrits.",
    "Avec cette application, vous pouvez écouter n'importe quel texte en français en un simple clic.",
    "haha"
  ];

  const [voices, setVoices] = useState([]);
  const [voice, setVoice] = useState(null);
  const [speakingIndex, setSpeakingIndex] = useState(null); // Indique quel paragraphe est en train d'être lu

  // Charger les voix
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        const frenchVoice = availableVoices.find((v) => v.lang.includes("fr"));
        if (frenchVoice) setVoice(frenchVoice);
      } else {
        setTimeout(loadVoices, 100); // Réessayer après un court délai
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text, index) => {
    if (!text || !voice) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setSpeakingIndex(index);
    utterance.onend = () => setSpeakingIndex(null);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeakingIndex(null);
  };

  // Écouteur d'événements pour la touche "Espace"
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        event.preventDefault(); // Empêche le défilement de la page

        if (speakingIndex === null) {
          // Lire le premier paragraphe si aucun n'est en lecture
          speak(paragraphs[0], 0);
        } else {
          // Lire le paragraphe suivant si possible
          const nextIndex = speakingIndex + 1;
          if (nextIndex < paragraphs.length) {
            speak(paragraphs[nextIndex], nextIndex);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [speakingIndex, voice]); // Dépend de l'état de lecture et de la voix

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", textAlign: "center" }}>
      <h2>Synthèse vocale en français</h2>
      {paragraphs.map((para, index) => (
        <div key={index} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <p>{para}</p>
          <button onClick={() => speak(para, index)} disabled={speakingIndex === index} style={{ marginRight: "10px" }}>
            🎙️ Écouter
          </button>
          <button onClick={stopSpeaking} disabled={speakingIndex !== index}>
            ⛔ Arrêter
          </button>
        </div>
      ))}
      <p style={{ marginTop: "20px", fontSize: "14px", color: "#777" }}>
        🚀 Appuyez sur <strong>Espace</strong> pour lire le texte.
      </p>
    </div>
  );
};

export default SpeechSynthesis;
