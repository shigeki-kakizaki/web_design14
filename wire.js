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

function fireWireFixed() {
  if (wire.phase !== "none") return;

  wire.phase = "flying";
  wire.sx = player.x;
  wire.sy = player.y;
  wire.ex = player.x;
  wire.ey = player.y;

  const angle = 60 * Math.PI / 180; // 度 → ラジアン

  const dx = Math.cos(angle);
  const dy = -Math.sin(angle);

  wire.vx = dx * WIRE_SPEED;
  wire.vy = dy * WIRE_SPEED;
}

function updateWire(dt) {
  if (wire.phase !== "flying") return;

  wire.ex += wire.vx * dt;
  wire.ey += wire.vy * dt;

  const dx = wire.ex - wire.sx;
  const dy = wire.ey - wire.sy;
  const dist = Math.hypot(dx, dy);

  // 射程超え or 画面外で終了
  if (
    dist > MAX_WIRE_DIST ||
    wire.ex < 0 || wire.ex > GAME_WIDTH ||
    wire.ey < 0 || wire.ey > GAME_HEIGHT
  ) {
    resetWire();
  }
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
