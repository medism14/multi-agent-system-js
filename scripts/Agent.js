/** @format */

/**
 * Class representing an agent that moves around a canvas and can interact with other agents
 */
class Agent {
  #id; // Unique identifier for each agent
  #name; // Name of the agent
  #state = "normal"; // Current state of agent (normal or infected)
  #positionX; // X coordinate on canvas
  #positionY; // Y coordinate on canvas
  #canvasWidth; // Width of canvas agent moves in
  #canvasHeight; // Height of canvas agent moves in
  #radius; // Size of the agent
  #moveDirection = "top-left"; // Current movement direction
  #directions = [
    "top",
    "top-left",
    "left",
    "bottom-left",
    "bottom",
    "bottom-right",
    "right",
    "top-right",
  ]; // Possible movement directions
  #directionIteration = 2; // How many moves to make in current direction
  #speed = 5; // Movement speed
  static #numberOfAgents = 0; // Counter for total agents created
  static #numberOfAgentsInfected = 0; // Counter for total agents created
  #img; // Img of the agent
  /**
   * Create a new agent
   * @param {number} canvasWidth - Width of canvas
   * @param {number} canvasHeight - Height of canvas
   * @param {number} radius - Size of agent
   */
  constructor(canvasWidth, canvasHeight, radius, imgSrc, name) {
    this.#id = ++Agent.#numberOfAgents;
    this.#canvasWidth = canvasWidth;
    this.#canvasHeight = canvasHeight;
    this.#radius = radius;
    this.#positionX = this.getRandomX(canvasWidth);
    this.#positionY = this.getRandomY(canvasHeight);
    this.#name = name;

    // Set random initial direction
    const random = Math.floor(Math.random() * this.#directions.length);
    this.#moveDirection = this.#directions[random];

    // Load the image for the agent
    this.#img = new Image();
    this.#img.src = imgSrc;

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
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.#positionX, this.#positionY, this.#radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(
      this.#img,
      this.#positionX - this.#radius,
      this.#positionY - this.#radius,
      this.#radius * 2,
      this.#radius * 2
    );

    if (this.#state == "infected") {
      ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
      ctx.fill();
    }

    ctx.strokeStyle = this.#state === "normal" ? "#A9A9A9" : "#B3171C";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Update agent position based on movement direction
   */
  run() {
    if (Agent.#numberOfAgentsInfected >= 23) {
      console.log("Tout le monde est infecté");
    }

    const { moveX, moveY } = this.getRandomMove();
    this.#positionX += moveX;
    this.#positionY += moveY;
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

  getRandomMove() {
    let moveX = 0;
    let moveY = 0;
    let randomBorderChangeDirection = Math.floor(Math.random() * 6 - 2) + 2;
    let directionChange = "";

    // Check if we should change direction
    if (this.#directionIteration == 0) {
      let randomValue = Math.floor(Math.random() * 6 - 2) + 2;
      this.#directionIteration = randomValue;

      let randomForDirection = Math.floor(
        Math.random() * this.#directions.length
      );
      this.#moveDirection = this.#directions[randomForDirection];
    } else {
      this.#directionIteration--;
    }

    // Calculate movement based on direction and boundaries
    switch (this.#moveDirection) {
      case "top":
        if (this.#positionY <= this.#radius + this.#speed * 2) {
          moveY += this.#speed;
          directionChange = "bottom";
        } else {
          moveY -= this.#speed;
        }

        if (directionChange) {
          this.#moveDirection = directionChange;
          this.#directionIteration = randomBorderChangeDirection;
        }
        break;
      case "top-left":
        if (this.#positionY <= this.#radius + this.#speed * 2) {
          moveY += this.#speed;
          directionChange = "bottom";
        } else {
          moveY -= this.#speed;
        }

        if (this.#positionX <= this.#radius + this.#speed * 2) {
          moveX += this.#speed;
          if (directionChange) {
            directionChange = "right";
          } else {
            directionChange = "-right";
          }
        } else {
          moveX -= this.#speed;
        }
        if (directionChange) {
          this.#moveDirection = directionChange;
          this.#directionIteration = randomBorderChangeDirection;
        }
        break;
      case "left":
        if (this.#positionX <= this.#radius + this.#speed * 2) {
          moveX += this.#speed;
          directionChange = "right";
        } else {
          moveX -= this.#speed;
        }

        if (directionChange) {
          this.#moveDirection = directionChange;
          this.#directionIteration = randomBorderChangeDirection;
        }
        break;
      case "bottom-left":
        if (
          this.#positionY >=
          this.#canvasHeight - this.#radius - this.#speed * 2
        ) {
          moveY -= this.#speed;
          directionChange = "top";
        } else {
          moveY += this.#speed;
        }

        if (this.#positionX <= this.#radius + this.#speed * 2) {
          moveX += this.#speed;
          if (directionChange) {
            directionChange = "right";
          } else {
            directionChange = "-right";
          }
        } else {
          moveX -= this.#speed;
        }

        if (directionChange) {
          this.#moveDirection = directionChange;
          this.#directionIteration = randomBorderChangeDirection;
        }
        break;
      case "bottom":
        if (
          this.#positionY >=
          this.#canvasHeight - this.#radius - this.#speed * 2
        ) {
          moveY -= this.#speed;
          directionChange = "top";
        } else {
          moveY += this.#speed;
        }

        if (directionChange) {
          this.#moveDirection = directionChange;
          this.#directionIteration = randomBorderChangeDirection;
        }
        break;
      case "bottom-right":
        if (
          this.#positionY >=
          this.#canvasHeight - this.#radius - this.#speed * 2
        ) {
          moveY -= this.#speed;
          directionChange = "top";
        } else {
          moveY += this.#speed;
        }

        if (
          this.#positionX >=
          this.#canvasWidth - this.#radius - this.#speed * 2
        ) {
          moveX -= this.#speed;
          if (directionChange) {
            directionChange = "left";
          } else {
            directionChange = "-left";
          }
        } else {
          moveX += this.#speed;
        }

        if (directionChange) {
          this.#moveDirection = directionChange;
          this.#directionIteration = randomBorderChangeDirection;
        }
        break;
      case "right":
        if (
          this.#positionX >=
          this.#canvasWidth - this.#radius - this.#speed * 2
        ) {
          moveX -= this.#speed;
          directionChange = "left";
        } else {
          moveX += this.#speed;
        }

        if (directionChange) {
          this.#moveDirection = directionChange;
          this.#directionIteration = randomBorderChangeDirection;
        }
        break;
      case "top-right":
        if (this.#positionY <= this.#radius + this.#speed * 2) {
          moveY += this.#speed;
          directionChange = "bottom";
        } else {
          moveY -= this.#speed;
        }

        if (
          this.#positionX >=
          this.#canvasWidth - this.#radius - this.#speed * 2
        ) {
          moveX -= this.#speed;
          if (directionChange) {
            directionChange = "left";
          } else {
            directionChange = "-left";
          }
        } else {
          moveX += this.#speed;
        }

        if (directionChange) {
          this.#moveDirection = directionChange;
          this.#directionIteration = randomBorderChangeDirection;
        }
        break;
    }

    return { moveX, moveY };
  }

  /**
   * Generate random X coordinate within canvas bounds
   * @param {number} canvasWidth - Width of canvas
   * @returns {number} Random X coordinate
   */
  getRandomX(canvasWidth) {
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
  getRandomY(canvasHeight) {
    let randomValue = Math.random() * this.#canvasHeight;
    if (randomValue < this.#radius * 2) {
      randomValue = this.#radius * 2;
    }
    return Math.floor(randomValue - this.#radius);
  }

  /**
   * Get agent's current state information
   * @returns {Object} Object containing agent properties
   */
  getInfoAgent() {
    return {
      id: this.#id,
      state: this.#state,
      position: {
        x: this.#positionX,
        y: this.#positionY,
      },
      radius: this.#radius,
      moveDirection: this.#moveDirection,
    };
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

  get moveDirection() {
    return this.#moveDirection;
  }

  get directions() {
    return this.#directions;
  }

  get directionIteration() {
    return this.#directionIteration;
  }

  get speed() {
    return this.#speed;
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

  set moveDirection(direction) {
    this.#moveDirection = direction;
  }

  set directionIteration(iteration) {
    this.#directionIteration = iteration;
  }

  set speed(newSpeed) {
    this.#speed = newSpeed;
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
