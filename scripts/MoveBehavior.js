/** @format */

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

  constructor(speed, directions) {
    this.#speed = speed;
    this.#directions = directions;
    const random = Math.floor(Math.random() * this.#directions.length);
    this.#moveDirection = this.#directions[random];
  }

  getRandomMove(positionX, positionY, radius, canvasWidth, canvasHeight,) {
    let moveX = 0;
    let moveY = 0;
    let randomBorderChangeDirection = Math.floor(Math.random() * 4) + 6;
    let directionChange = "";

    // Check if we should change direction
    if (this.#directionIteration == 0) {
      let randomValue = Math.floor(Math.random() * 4) + 6;
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
        if (positionY <= radius + this.#speed * 2) {
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
        if (positionY <= radius + this.#speed * 2) {
          moveY += this.#speed;
          directionChange = "bottom";
        } else {
          moveY -= this.#speed;
        }

        if (positionX <= radius + this.#speed * 2) {
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
        if (positionX <= radius + this.#speed * 2) {
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
        if (positionY >= canvasHeight - radius - this.#speed * 2) {
          moveY -= this.#speed;
          directionChange = "top";
        } else {
          moveY += this.#speed;
        }

        if (positionX <= radius + this.#speed * 2) {
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
        if (positionY >= canvasHeight - radius - this.#speed * 2) {
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
        if (positionY >= canvasHeight - radius - this.#speed * 2) {
          moveY -= this.#speed;
          directionChange = "top";
        } else {
          moveY += this.#speed;
        }

        if (positionX >= canvasWidth - radius - this.#speed * 2) {
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
        if (positionX >= canvasWidth - radius - this.#speed * 2) {
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
        if (positionY <= radius + this.#speed * 2) {
          moveY += this.#speed;
          directionChange = "bottom";
        } else {
          moveY -= this.#speed;
        }

        if (positionX >= canvasWidth - radius - this.#speed * 2) {
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
}

export default MoveBehavior;