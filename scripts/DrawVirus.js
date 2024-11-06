/** @format */

class DrawVirus {
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
