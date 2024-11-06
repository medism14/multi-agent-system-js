/** @format */
import Agent from "./Agent.js";

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
const modal = document.getElementById("modal");
const infectionMessage = document.getElementById("infectionMessage");
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
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 1000);
};

// Event for infect agent
document.addEventListener("agentInfected", (event) => {
  console.log(event.detail);
  const infectedName = event.detail;
  infectionMessage.textContent = `${infectedName}`;
  displayModal();
  
  if (timeoutInfectionMessage) {
    clearTimeout(timeoutInfectionMessage);
    timeoutInfectionMessage = setTimeout(() => {
      hideModal();
    }, 2000);
  } else {
    timeoutInfectionMessage = setTimeout(() => {
      hideModal();
    }, 2000);
  }
});

// Function to hide the modal
const displayModal = () => {
  modal.classList.remove("hidden");
  modal.classList.remove("fade-out");
};

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
};

/**
 * Create initial environment with 50 agents, one infected
 */
const createEnvironnement = async () => {
  let i = 0;
  let agent;
  const agentsArray = Object.entries(agentsNameAndImages);

  while (i < agentsArray.length) {
    try {
      agent = await new Agent(
        canvasWidth,
        canvasHeight,
        size,
        agentsArray[i][1],
        agentsArray[i][0]
      );
      if (i === 14) {
        agent.infectAgent();
      }
      agents.push(agent);
      agent.draw(ctx); // Draw the agent after it has been created
      i++;
    } catch (error) {
      console.error("Error creating agent:", error);
    }
  }
};

createEnvironnement();

/**
 * Animation loop - updates and redraws all agents
 */
const animateEnvironments = () => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  agents.forEach((agent) => {
    if (agent.state == "infected") {
      agent.isColliding(agents);
    }
    agent.run();
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
  // Clear the canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  clearInterval(intervalAnimation);

  // Reset values of buttons
  sizeButton.value = 50;
  size = calculConversion(minSize, maxSize, 50);
  speedButton.value = 50;
  speed = calculConversion(minSpeed, maxSpeed, 50);

  // Reset state variables
  intervalAnimation = null;
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
