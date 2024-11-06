/** @format */

class DrawPerson {
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
