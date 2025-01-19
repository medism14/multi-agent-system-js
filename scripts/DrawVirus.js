/** @format */

/**
 * Classe pour dessiner un virus sur le canvas
 */
class DrawVirus {
  /**
   * Dessine le virus sur le canvas
   * @param {CanvasRenderingContext2D} ctx - Le contexte du canvas
   * @param {number} positionX - Position X du virus
   * @param {number} positionY - Position Y du virus
   * @param {number} radius - Rayon du virus
   * @param {HTMLImageElement} img - Image du virus
   */
  draw(ctx, positionX, positionY, radius, img) {
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

    ctx.strokeStyle = "#B3171C";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }
}

export default DrawVirus;
