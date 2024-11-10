/** @format */
import Agent from "./Agent.js";
import MoveBehavior from "./MoveBehavior.js";
import DrawPerson from "./DrawPerson.js";
import DrawVirus from "./DrawVirus.js";

/**
 * Calculates a value between min and max based on a percentage
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} percentage - Percentage between 1-100
 * @returns {number} Calculated value
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

// Get DOM elements for buttons
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

// Get canvas elements and set up context
const canvasParent = document.getElementById("canvasParent");
const gameCanvas = document.getElementById("gameCanvas");
const canvasWidth = canvasParent.clientWidth;
const canvasHeight = canvasParent.clientHeight;
const ctx = gameCanvas.getContext("2d");

// Initialize state variables
let intervalAnimation = null;
var agents = [];
let actualState = null;
var virus = [];

// Constants for agent size and speed ranges
const minSize = 5;
const maxSize = 35;
const minSpeed = 100;
const maxSpeed = 20;

// Initialize size and speed based on slider values
let size = calculConversion(minSize, maxSize, sizeButton.value);
let speed = calculConversion(minSpeed, maxSpeed, speedButton.value);

/**
 * Initialize canvas dimensions and display
 */
const InitCanvas = () => {
  gameCanvas.width = canvasWidth;
  gameCanvas.height = canvasHeight;
  gameCanvas.style.display = "block";
};

InitCanvas();

//// Event Listeners
// Function to hide the modal
const hideModal = () => {
  modal.classList.add("fade-out");
};

// Function to display the modal
const displayModal = () => {
  if (modal.classList.contains("hidden")) {
    modal.classList.remove("hidden");
  }
  modal.classList.remove("fade-out");
};

// Function to display the modalFinish
const displayModalFinish = () => {
  modalFinish.classList.remove("hidden");
  modalFinish.classList.remove("fade-out");
};

// Function to display the modalFinish
const hideModalFinish = () => {
  modalFinish.classList.add("hidden");
  modalFinish.classList.add("fade-out");
};

// Event for infect agent
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
 * Start animation when start button clicked, if not paused
 */
startButton.addEventListener("click", () => {
  if (actualState != "pause") {
    runAnimation();
  }
});

/**
 * Reset simulation when restore button clicked
 */
restoreButton.addEventListener("click", () => {
  restore();
});

restartButton.addEventListener("click", () => {
  hideModalFinish();
  restore();
});

/**
 * Toggle between pause/resume when button clicked
 */
pauseResumeButton.addEventListener("click", () => {
  if (actualState == "run") {
    pause();
  } else if (actualState == "pause") {
    resume();
  }
});

/**
 * Update agent sizes when size slider changes
 */
sizeButton.addEventListener("input", (event) => {
  if (agents.length > 0) {
    let percentage = event.target.value;
    size = minSize + ((percentage - 1) / (100 - 1)) * (maxSize - minSize);
    changeSize(size);
  }
});

/**
 * Update animation speed when speed slider changes
 */
speedButton.addEventListener("input", (event) => {
  speed =
    minSpeed + ((event.target.value - 1) / (100 - 1)) * (maxSpeed - minSpeed);

  if (actualState == "run") {
    pause();
  }
});

/**
 * Update the size of all agents
 * @param {number} size - New radius for agents
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
 * Create initial environment with 50 agents, one infected
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
 * Animation loop - updates and redraws all agents
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
 * Start the animation loop
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
 * Reset the simulation to initial state
 */
const restore = () => {
  // Clear the canvas and animations
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  clearInterval(intervalAnimation);
  intervalAnimation = null;

  // Reset state variables
  agents.length = 0;
  actualState = null;
  Agent.restoreAgent();

  // Reset pause button appearance
  pauseResumeButton.textContent = "Mettre en pause";
  pauseResumeButton.classList.remove(
    "text-white",
    "bg-[#296DB1]",
    "hover:bg-[#205992]"
  );

  // Create new environment
  setTimeout(() => {
    createEnvironnement();
  }, 50);
};

/**
 * Pause the animation
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
 * Resume the animation
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
