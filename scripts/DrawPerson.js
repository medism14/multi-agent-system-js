/** @format */

/**
 * Classe pour dessiner une personne sur le canvas
 */
class DrawPerson {
  /**
   * Dessine la personne sur le canvas
   * @param {CanvasRenderingContext2D} ctx - Le contexte du canvas
   * @param {number} positionX - Position X de la personne
   * @param {number} positionY - Position Y de la personne 
   * @param {number} radius - Rayon de la personne
   * @param {Image} img - Image de la personne
   * @param {string} state - État de la personne (normal ou infecté)
   */
  draw(ctx, positionX, positionY, radius, img, state) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(positionX, positionY, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(
      img,
      positionX - radius,
      positionY - radius,
      radius * 2,
      radius * 2
    );

    if (state == "infected") {
      ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
      ctx.fill();
    }

    ctx.strokeStyle = state === "normal" ? "#A9A9A9" : "#B3171C";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }
}

export default DrawPerson;
