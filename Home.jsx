import React, { useState, useEffect } from "react";
import "../styles/home.css";
import Card from "../components/Card";

const Home = () => {
  // Définition des données pour les 3 cartes
  const cardsData = [
    {
      width: "270px",
      title: "Etablissement",
      texts: [
        "Nous présentons des établissements qui prennent en charge les personnes souffrant de handicap et d'exclusion sociale.",
        "Certains établissements offrent des soins médicaux spécialisés.",
        "D'autres proposent des formations adaptées pour l'insertion professionnelle."
      ]
    },
    {
      width: "270px",
      title: "Offre d'emploi",
      texts: [
        "Nous offrons une liste d'emplois possibles pour les personnes handicapées cherchant du travail.",
        "Les entreprises partenaires garantissent des conditions de travail adaptées.",
        "Certaines offres concernent le télétravail pour plus de flexibilité."
      ]
    },
    {
      width: "270px",
      title: "Activités diverses",
      texts: [
        "Les communautés de personnes handicapées proposent des activités en groupe diverses et libres pour tout le monde.",
        "Les sports adaptés permettent de maintenir une bonne condition physique.",
        "Des ateliers de création artistique sont également disponibles."
      ]
    }
  ];

  // Index de la carte active (celle dont le texte est lu)
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [speech] = useState(window.speechSynthesis);

  // Fonction pour lancer la lecture d'un texte
  const speakText = (text) => {
    speech.cancel(); // Stop toute lecture en cours
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR"; // Voix en français
    speech.speak(utterance);
  };

  // À chaque changement de carte active, lire la concaténation de ses textes
  useEffect(() => {
    const cardText = cardsData[activeCardIndex].texts.join(" ");
    speakText(cardText);
  }, [activeCardIndex, speech]);

  // Gestion de la touche "F" pour passer à la carte suivante
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "KeyF") {
        event.preventDefault();
        setActiveCardIndex((prev) => (prev + 1) % cardsData.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cardsData.length]);

  return (
    <div className="home-container">
      <div className="top-div">
        <h1 className="title">Bienvenue sur Miahy Anao</h1>
        <p className="subtitle">
          Un centre qui vous apporte du social par Miahy Anao
        </p>
      </div>
      <div className="card-home">
        {cardsData.map((card, index) => (
          <Card
            key={index}
            width={card.width}
            title={card.title}
            texts={card.texts}
            active={index === activeCardIndex} // Pour indiquer visuellement la carte active
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
