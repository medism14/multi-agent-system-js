/** @format */

/**
 * Classe représentant un agent qui se déplace sur un canvas et peut interagir avec d'autres agents
 */
class Agent {
  #id; // Identifiant unique pour chaque agent
  #name; // Nom de l'agent
  #state; // État actuel de l'agent (normal, infecté ou virus)
  #positionX; // Coordonnée X sur le canvas
  #positionY; // Coordonnée Y sur le canvas
  #canvasWidth; // Largeur du canvas dans lequel l'agent se déplace
  #canvasHeight; // Hauteur du canvas dans lequel l'agent se déplace
  #radius; // Taille de l'agent
  static #numberOfAgents = 0; // Compteur du nombre total d'agents créés
  static #numberOfAgentsInfected = 0; // Compteur du nombre total d'agents infectés
  #img; // Image de l'agent
  #behaviors = []; // Les comportements des agents

  /**
   * Crée un nouvel agent
   * @param {number} canvasWidth - Largeur du canvas
   * @param {number} canvasHeight - Hauteur du canvas
   * @param {number} radius - Taille de l'agent
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

    // Charge l'image pour l'agent
    this.#img = new Image();
    this.#img.src = config.imgSrc;

    this.#behaviors = config.behaviors;

    // Retourne une Promise qui se résout quand l'image est chargée
    return new Promise((resolve, reject) => {
      this.#img.onload = () => resolve(this); // Résout avec l'instance de l'agent
      this.#img.onerror = () => reject(new Error("Failed to load image"));
    });
  }

  /**
   * Dessine l'agent sur le canvas
   * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
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
   * Vérifie les collisions avec d'autres agents et les infecte potentiellement
   * @param {Agent[]} othersAgents - Tableau des autres agents à vérifier pour les collisions
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
   * Change l'état de l'agent à infecté
   */
  infectAgent() {
    this.#state = "infected";
    Agent.#numberOfAgentsInfected++;
    const event = new CustomEvent("agentInfected", { detail: this.#name });
    document.dispatchEvent(event);
  }

  /**
   * Calcule le prochain mouvement en fonction de la direction actuelle et des limites du canvas
   * @returns {Object} Objet contenant les valeurs de déplacement X et Y
   */

  /**
   * Met à jour la position de l'agent en fonction de la direction du mouvement
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
   * Génère une coordonnée X aléatoire dans les limites du canvas
   * @param {number} canvasWidth - Largeur du canvas
   * @returns {number} Coordonnée X aléatoire
   */
  getRandomX() {
    let randomValue = Math.random() * this.#canvasWidth;
    if (randomValue < this.#radius * 2) {
      randomValue = this.#radius * 2;
    }

    return Math.floor(randomValue - this.#radius);
  }

  /**
   * Génère une coordonnée Y aléatoire dans les limites du canvas
   * @param {number} canvasHeight - Hauteur du canvas
   * @returns {number} Coordonnée Y aléatoire
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

  // Getters additionnels
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
