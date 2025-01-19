/** @format */

/**
 * Classe gérant le comportement de déplacement des agents
 */
class MoveBehavior {
  #directions = [
    "top",
    "top-left", 
    "left",
    "bottom-left",
    "bottom", 
    "bottom-right",
    "right",
    "top-right",
  ];
  #directionIteration = 2;
  #moveDirection;
  #speed = 5;

  /**
   * Crée un nouveau comportement de déplacement
   * @param {number} speed - Vitesse de déplacement
   * @param {string[]} directions - Tableau des directions possibles
   */
  constructor(speed, directions) {
    this.#speed = speed;
    this.#directions = directions;
    const random = Math.floor(Math.random() * this.#directions.length);
    this.#moveDirection = this.#directions[random];
  }

  /**
   * Calcule le prochain déplacement aléatoire en tenant compte des limites du canvas
   * @param {number} positionX - Position X actuelle
   * @param {number} positionY - Position Y actuelle  
   * @param {number} radius - Rayon de l'agent
   * @param {number} canvasWidth - Largeur du canvas
   * @param {number} canvasHeight - Hauteur du canvas
   * @returns {Object} Déplacement en X et Y
   */
  getRandomMove(positionX, positionY, radius, canvasWidth, canvasHeight,) {
    let moveX = 0;
    let moveY = 0;
    let randomBorderChangeDirection = Math.floor(Math.random() * 4) + 6;
    let directionChange = "";

    // Vérifie s'il faut changer de direction
    if (this.#directionIteration <= 0) {
      let randomValue = Math.floor(Math.random() * 4) + 6;
      this.#directionIteration = randomValue;

      let randomForDirection = Math.floor(
        Math.random() * this.#directions.length
      );
      this.#moveDirection = this.#directions[randomForDirection];
    } else {
      this.#directionIteration--;
    }

    // Calcule le mouvement selon la direction et les limites
    switch (this.#moveDirection) {
      case "top":
        if (positionY <= radius + this.#speed * 2) {
          moveY = this.#speed;
          directionChange = "bottom";
        } else {
          moveY = -this.#speed;
        }

        if (directionChange) {
          this.#moveDirection = directionChange;
          this.#directionIteration = randomBorderChangeDirection;
        }
        break;
      case "top-left":
        if (positionY <= radius + this.#speed * 2) {
          moveY = this.#speed;
          directionChange = "bottom";
        } else {
          moveY = -this.#speed;
        }

        if (positionX <= radius + this.#speed * 2) {
          moveX = this.#speed;
          directionChange = directionChange ? "bottom-right" : "top-right";
        } else {
          moveX = -this.#speed;
        }
        if (directionChange) {
          this.#moveDirection = directionChange;
          this.#directionIteration = randomBorderChangeDirection;
        }
        break;
      case "left":
        if (positionX <= radius + this.#speed * 2) {
          moveX = this.#speed;
          directionChange = "right";
        } else {
          moveX = -this.#speed;
        }

        if (directionChange) {
          this.#moveDirection = directionChange;
          this.#directionIteration = randomBorderChangeDirection;
        }
        break;
      case "bottom-left":
        if (positionY >= canvasHeight - radius - this.#speed * 2) {
          moveY = -this.#speed;
          directionChange = "top";
        } else {
          moveY = this.#speed;
        }

        if (positionX <= radius + this.#speed * 2) {
          moveX = this.#speed;
          directionChange = directionChange ? "top-right" : "bottom-right";
        } else {
          moveX = -this.#speed;
        }

        if (directionChange) {
          this.#moveDirection = directionChange;
          this.#directionIteration = randomBorderChangeDirection;
        }
        break;
      case "bottom":
        if (positionY >= canvasHeight - radius - this.#speed * 2) {
          moveY = -this.#speed;
          directionChange = "top";
        } else {
          moveY = this.#speed;
        }

        if (directionChange) {
          this.#moveDirection = directionChange;
          this.#directionIteration = randomBorderChangeDirection;
        }
        break;
      case "bottom-right":
        if (positionY >= canvasHeight - radius - this.#speed * 2) {
          moveY = -this.#speed;
          directionChange = "top";
        } else {
          moveY = this.#speed;
        }

        if (positionX >= canvasWidth - radius - this.#speed * 2) {
          moveX = -this.#speed;
          directionChange = directionChange ? "top-left" : "bottom-left";
        } else {
          moveX = this.#speed;
        }

        if (directionChange) {
          this.#moveDirection = directionChange;
          this.#directionIteration = randomBorderChangeDirection;
        }
        break;
      case "right":
        if (positionX >= canvasWidth - radius - this.#speed * 2) {
          moveX = -this.#speed;
          directionChange = "left";
        } else {
          moveX = this.#speed;
        }

        if (directionChange) {
          this.#moveDirection = directionChange;
          this.#directionIteration = randomBorderChangeDirection;
        }
        break;
      case "top-right":
        if (positionY <= radius + this.#speed * 2) {
          moveY = this.#speed;
          directionChange = "bottom";
        } else {
          moveY = -this.#speed;
        }

        if (positionX >= canvasWidth - radius - this.#speed * 2) {
          moveX = -this.#speed;
          directionChange = directionChange ? "bottom-left" : "top-left";
        } else {
          moveX = this.#speed;
        }

        if (directionChange) {
          this.#moveDirection = directionChange;
          this.#directionIteration = randomBorderChangeDirection;
        }
        break;
    }

    // S'assure qu'il y a toujours un mouvement
    if (moveX === 0 && moveY === 0) {
      moveX = this.#speed;
      moveY = this.#speed;
    }

    return { moveX, moveY };
  }
}

export default MoveBehavior;