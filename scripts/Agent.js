/** @format */

/**
 * Class representing an agent that moves around a canvas and can interact with other agents
 */
class Agent {
  #id; // Unique identifier for each agent
  #name; // Name of the agent
  #state; // Current state of agent (normal or infected or virus)
  #positionX; // X coordinate on canvas
  #positionY; // Y coordinate on canvas
  #canvasWidth; // Width of canvas agent moves in
  #canvasHeight; // Height of canvas agent moves in
  #radius; // Size of the agent
  static #numberOfAgents = 0; // Counter for total agents created
  static #numberOfAgentsInfected = 0; // Counter for total agents created
  #img; // Img of the agent
  #behaviors = [];

  /**
   * Create a new agent
   * @param {number} canvasWidth - Width of canvas
   * @param {number} canvasHeight - Height of canvas
   * @param {number} radius - Size of agent
   */
  constructor(config) {
    this.#id = ++Agent.#numberOfAgents;
    this.#canvasWidth = config.canvasWidth;
    this.#canvasHeight = config.canvasHeight;
    this.#radius = config.radius;
    this.#positionX = this.getRandomX(config.canvasWidth);
    this.#positionY = this.getRandomY(config.canvasHeight);
    this.#name = config.name;
    this.#state = config.state ?? "normal";

    // Load the image for the agent
    this.#img = new Image();
    this.#img.src = config.imgSrc;

    this.#behaviors = config.behaviors;

    // Return a Promise that resolves when the image is loaded
    return new Promise((resolve, reject) => {
      this.#img.onload = () => resolve(this); // Resolve with the agent instance
      this.#img.onerror = () => reject(new Error("Failed to load image"));
    });
  }

  /**
   * Draw agent on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    this.#behaviors.drawAgent.draw(
      ctx,
      this.#positionX,
      this.#positionY,
      this.#radius,
      this.#img,
      this.#state
    );
  }

  /**
   * Check for collisions with other agents and potentially infect them
   * @param {Agent[]} othersAgents - Array of other agents to check collisions with
   */
  isColliding(othersAgents) {
    othersAgents.forEach((agent) => {
      let dx = this.#positionX - agent.positionX;
      let dy = this.#positionY - agent.positionY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (
        distance < this.#radius + agent.radius &&
        Math.random() >= 0.2 &&
        agent.state == "normal"
      ) {
        agent.infectAgent();
        if (this.#state == "virus") {
          const event = new CustomEvent("removeVirus", {
            detail: this.#id,
          });
          document.dispatchEvent(event);
        }
      }
    });
  }

  /**
   * Change agent state to infected
   */
  infectAgent() {
    this.#state = "infected";
    Agent.#numberOfAgentsInfected++;
    if (this.#name != "Ismael") {
      const event = new CustomEvent("agentInfected", { detail: this.#name });
      document.dispatchEvent(event);
    }
  }

  /**
   * Calculate next movement based on current direction and canvas boundaries
   * @returns {Object} Object containing X and Y movement values
   */

  /**
   * Update agent position based on movement direction
   */

  run(last) {
    if (this.#behaviors.move) {
      if (Agent.#numberOfAgentsInfected >= 23 && !last) {
        const event = new CustomEvent("finishSimulation");
        document.dispatchEvent(event);
      }

      // Le problème est ici - behaviors n'est pas un objet avec getRandomMove
      const { moveX, moveY } = this.#behaviors.move.getRandomMove(
        this.#positionX,
        this.#positionY,
        this.#radius,
        this.#canvasWidth,
        this.#canvasHeight
      );

      this.#positionX += moveX;
      this.#positionY += moveY;
    }
  }

  /**
   * Generate random X coordinate within canvas bounds
   * @param {number} canvasWidth - Width of canvas
   * @returns {number} Random X coordinate
   */
  getRandomX() {
    let randomValue = Math.random() * this.#canvasWidth;
    if (randomValue < this.#radius * 2) {
      randomValue = this.#radius * 2;
    }

    return Math.floor(randomValue - this.#radius);
  }

  /**
   * Generate random Y coordinate within canvas bounds
   * @param {number} canvasHeight - Height of canvas
   * @returns {number} Random Y coordinate
   */
  getRandomY() {
    let randomValue = Math.random() * this.#canvasHeight;
    if (randomValue < this.#radius * 2) {
      randomValue = this.#radius * 2;
    }
    return Math.floor(randomValue - this.#radius);
  }

  static restoreAgent() {
    this.#numberOfAgents = 0;
    this.#numberOfAgentsInfected = 0;
  }

  // Getters
  get id() {
    return this.#id;
  }

  get state() {
    return this.#state;
  }

  get positionX() {
    return this.#positionX;
  }

  get positionY() {
    return this.#positionY;
  }

  get canvasWidth() {
    return this.#canvasWidth;
  }

  get canvasHeight() {
    return this.#canvasHeight;
  }

  get radius() {
    return this.#radius;
  }

  // Setters
  set state(newState) {
    this.#state = newState;
  }

  set positionX(newX) {
    this.#positionX = newX;
  }

  set positionY(newY) {
    this.#positionY = newY;
  }

  set canvasWidth(width) {
    this.#canvasWidth = width;
  }

  set canvasHeight(height) {
    this.#canvasHeight = height;
  }

  set radius(newRadius) {
    this.#radius = newRadius;
  }

  // Additional Getters
  get numberOfAgents() {
    return Agent.#numberOfAgents;
  }

  get numberOfAgentsInfected() {
    return Agent.#numberOfAgentsInfected;
  }

  // Setters
  set numberOfAgents(value) {
    Agent.#numberOfAgents = value;
  }

  set numberOfAgentsInfected(value) {
    Agent.#numberOfAgentsInfected = value;
  }
}

export default Agent;
