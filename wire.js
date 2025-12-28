"use strict";

const wire = {
  phase: "none", // none | flying
  sx: 0, sy: 0,
  ex: 0, ey: 0,
  vx: 0, vy: 0
};

function resetWire() {
  wire.phase = "none";
  wire.sx = wire.sy = wire.ex = wire.ey = 0;
  wire.vx = wire.vy = 0;
}


function updateWire(dt) {
  if (wire.phase !== "flying") return;


}

function drawWire(ctx) {
  if (wire.phase === "none") return;

  ctx.strokeStyle = "#7ef5e1";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(wire.ex, wire.ey);
  ctx.stroke();
}
