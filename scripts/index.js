/** @format */
import Agent from "./Agent.js";
import MoveBehavior from "./MoveBehavior.js";
import DrawPerson from "./DrawPerson.js";
import DrawVirus from "./DrawVirus.js";

/**
 * Calcule une valeur entre min et max basée sur un pourcentage
 * @param {number} min - Valeur minimum
 * @param {number} max - Valeur maximum 
 * @param {number} percentage - Pourcentage entre 1-100
 * @returns {number} Valeur calculée
 */
const calculConversion = (min, max, percentage) => {
  return min + ((percentage - 1) / (100 - 1)) * (max - min);
};

const agentsNameAndImages = {
  Astadjam: "../images/ASTADJAM.png",
  Romain: "../images/BALZANO.png",
  Yahya: "../images/BATHILY.png",
  Louiza: "../images/BELARIF.png",
  Kaoutar: "../images/BENAMEUR.png",
  Ilyas: "../images/BENSALEM.png",
  ThomasB: "../images/BOVY.png",
  CHAKER: "../images/CHAKER.png",
  Anthony: "../images/COLIN.png",
  Marie: "../images/EVEILLE.png",
  Donat: "../images/FORTINI.png",
  ThomasG: "../images/GARAU.png",
  Livia: "../images/GRAZIETTI.png",
  Yasmine: "../images/HAMADENE.png",
  Ismael: "../images/ISMAEL.png",
  Ambroise: "../images/KILIMOU.png",
  Lucas: "../images/LECULIER.jpg",
  Marchise: "../images/MARCHISELLI.png",
  Antoine: "../images/MARECHAL.png",
  Theo: "../images/PIACENTINI.png",
  Vitali: "../images/RENKAS.png",
  Pascal: "../images/VIGNEAU.png",
  "Paul-Antoine": "../images/VINCIGUERRA.png",
};

// Récupération des éléments DOM
const startButton = document.getElementById("startButton");
const restoreButton = document.getElementById("restoreButton");
const pauseResumeButton = document.getElementById("pauseResumeButton");
const sizeButton = document.getElementById("sizeButton");
const speedButton = document.getElementById("speedButton");
const restartButton = document.getElementById("restartButton");
const modal = document.getElementById("modal");
const infectionMessage = document.getElementById("infectionMessage");
const modalFinish = document.getElementById("modalFinish");
let timeoutInfectionMessage;

// Récupération des éléments du canvas et configuration du contexte
const canvasParent = document.getElementById("canvasParent");
const gameCanvas = document.getElementById("gameCanvas");
const canvasWidth = canvasParent.clientWidth;
const canvasHeight = canvasParent.clientHeight;
const ctx = gameCanvas.getContext("2d");

// Initialisation des variables d'état
let intervalAnimation = null;
let actualState = null;
var agents = [];
var virus = [];

// Constantes pour les plages de taille et de vitesse des agents
const minSize = 5;
const maxSize = 35;
const minSpeed = 100;
const maxSpeed = 20;

// Initialisation de la taille et de la vitesse basées sur les valeurs des curseurs
let size = calculConversion(minSize, maxSize, sizeButton.value);
let speed = calculConversion(minSpeed, maxSpeed, speedButton.value);

/**
 * Initialise les dimensions du canvas et son affichage
 */
const InitCanvas = () => {
  gameCanvas.width = canvasWidth;
  gameCanvas.height = canvasHeight;
  gameCanvas.style.display = "block";
};

InitCanvas();

//// Écouteurs d'événements
// Fonction pour masquer la modal
const hideModal = () => {
  modal.classList.add("fade-out");
};

// Fonction pour afficher la modal
const displayModal = () => {
  if (modal.classList.contains("hidden")) {
    modal.classList.remove("hidden");
  }
  modal.classList.remove("fade-out");
};

// Fonction pour afficher la modalFinish
const displayModalFinish = () => {
  modalFinish.classList.remove("hidden");
  modalFinish.classList.remove("fade-out");
};

// Fonction pour masquer la modalFinish
const hideModalFinish = () => {
  modalFinish.classList.add("hidden");
  modalFinish.classList.add("fade-out");
};

// Événement pour l'infection d'un agent
document.addEventListener("agentInfected", (event) => {
  const infectedName = event.detail;
  infectionMessage.textContent = `${infectedName}`;

  if (timeoutInfectionMessage) {
    clearTimeout(timeoutInfectionMessage);
  }

  displayModal();

  timeoutInfectionMessage = setTimeout(() => {
    hideModal();
  }, 2000);
});

document.addEventListener("finishSimulation", () => {
  clearInterval(intervalAnimation);
  intervalAnimation = null;
  animateEnvironments(true);
  displayModalFinish();
});

/**
 * Démarre l'animation quand le bouton start est cliqué, si non en pause
 */
startButton.addEventListener("click", () => {
  if (actualState != "pause") {
    runAnimation();
  }
});

/**
 * Réinitialise la simulation quand le bouton restore est cliqué
 */
restoreButton.addEventListener("click", () => {
  restore();
});

restartButton.addEventListener("click", () => {
  hideModalFinish();
  restore();
});

/**
 * Bascule entre pause/reprise quand le bouton est cliqué
 */
pauseResumeButton.addEventListener("click", () => {
  if (actualState == "run") {
    pause();
  } else if (actualState == "pause") {
    resume();
  }
});

/**
 * Met à jour la taille des agents quand le curseur de taille change
 */
sizeButton.addEventListener("input", (event) => {
  if (agents.length > 0) {
    let percentage = event.target.value;
    size = minSize + ((percentage - 1) / (100 - 1)) * (maxSize - minSize);
    changeSize(size);
  }
});

/**
 * Met à jour la vitesse d'animation quand le curseur de vitesse change
 */
speedButton.addEventListener("input", (event) => {
  speed =
    minSpeed + ((event.target.value - 1) / (100 - 1)) * (maxSpeed - minSpeed);

  if (actualState == "run") {
    pause();
  }
});

/**
 * Met à jour la taille de tous les agents
 * @param {number} size - Nouveau rayon pour les agents
 */
const changeSize = (size) => {
  if (actualState == "run") {
    pause();
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  agents.forEach((agent) => {
    agent.radius = size;
    agent.draw(ctx);
  });

  virus.forEach((agent) => {
    agent.radius = size;
    agent.draw(ctx);
  });
};

/**
 * Crée l'environnement initial avec tous les agents
 */
const createEnvironnement = async () => {
  const agentsArray = Object.entries(agentsNameAndImages);

  // Création personne
  for (let i = 0; i < agentsArray.length; i++) {
    try {
      const config = {
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        radius: size,
        behaviors: {
          move: new MoveBehavior(5, [
            "top",
            "top-left",
            "left",
            "bottom-left",
            "bottom",
            "bottom-right",
            "right",
            "top-right",
          ]),
          drawAgent: new DrawPerson(),
        },
      };

      const agent = await new Agent({
        ...config,
        imgSrc: agentsArray[i][1],
        name: agentsArray[i][0],
      });
      agents.push(agent);
      agent.draw(ctx);
    } catch (error) {
      console.error("Erreur lors de la création de l'agent :", error);
    }
  }

  for (let i = 0; i < 3; i++) {
    try {
      const config = {
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        radius: size,
        state: "virus",
        behaviors: {
          drawAgent: new DrawVirus(),
        },
      };

      const agent = await new Agent({
        ...config,
        imgSrc: "../images/virus.png",
        name: `Virus ${i}`,
      });
      agent.draw(ctx);
      virus.push(agent);
    } catch (error) {
      console.error("Erreur lors de la création de l'agent :", error);
    }
  }
};

createEnvironnement();

document.addEventListener("removeVirus", (event) => {
  const id = event.detail;
  virus = virus.filter((virus) => virus.id !== id);
});

/**
 * Boucle d'animation - met à jour et redessine tous les agents
 */
const animateEnvironments = (last) => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  agents.forEach((agent) => {
    if (agent.state == "infected") {
      agent.isColliding(agents);
    }
    agent.run(last);
    agent.draw(ctx);
  });

  virus.forEach((agent) => {
    agent.isColliding(agents);
    agent.draw(ctx);
  });
};

/**
 * Démarre la boucle d'animation
 */
const runAnimation = () => {
  actualState = "run";
  if (!intervalAnimation) {
    intervalAnimation = setInterval(() => {
      animateEnvironments();
    }, speed);
  }
};

/**
 * Réinitialise la simulation à l'état initial
 */
const restore = () => {
  // Efface le canvas et les animations
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  clearInterval(intervalAnimation);
  intervalAnimation = null;

  // Réinitialise les variables d'état
  agents.length = 0;
  virus.length = 0;
  actualState = null;
  Agent.restoreAgent();

  // Réinitialise l'apparence du bouton pause
  pauseResumeButton.textContent = "Mettre en pause";
  pauseResumeButton.classList.remove(
    "text-white",
    "bg-[#296DB1]",
    "hover:bg-[#205992]"
  );

  // Crée un nouvel environnement
  setTimeout(() => {
    createEnvironnement();
  }, 50);
};

/**
 * Met l'animation en pause
 */
const pause = () => {
  clearInterval(intervalAnimation);
  intervalAnimation = null;
  actualState = "pause";
  pauseResumeButton.textContent = "Reprendre";
  pauseResumeButton.classList.add(
    "text-white",
    "bg-[#296DB1]",
    "hover:bg-[#205992]"
  );
};

/**
 * Reprend l'animation
 */
const resume = () => {
  runAnimation();
  actualState = "run";
  pauseResumeButton.textContent = "Mettre en pause";
  pauseResumeButton.classList.remove(
    "text-white",
    "bg-[#296DB1]",
    "hover:bg-[#205992]"
  );
};
