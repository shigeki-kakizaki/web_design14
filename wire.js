"use strict";

const wire = {
  phase: "none", // none | flying | hooked
  sx: 0, sy: 0,
  ex: 0, ey: 0,
  vx: 0, vy: 0,
  length: 0
};

function resetWire() {
  wire.phase = "none";
  wire.sx = wire.sy = wire.ex = wire.ey = 0;
  wire.vx = wire.vy = 0;
  wire.length = 0;
}

function fireWireToMouse(mouseX, mouseY) {
  if (wire.phase !== "none") return;

  wire.phase = "flying";
  wire.sx = player.x;
  wire.sy = player.y;
  wire.ex = player.x;
  wire.ey = player.y;

  let dx = mouseX - player.x;
  let dy = mouseY - player.y;
  let len = Math.hypot(dx, dy) || 1;
  dx /= len;
  dy /= len;

  wire.vx = dx * WIRE_SPEED;
  wire.vy = dy * WIRE_SPEED;
  wire.length = 0;
}

function detachWire() {
  // ★14-3：解除＝ワイヤを外すだけ（速度は保持）
  // player.vx = 0;
  wire.phase = "none";
}

function updateWire(dt) {
  if (wire.phase === "flying") {
    wire.ex += wire.vx * dt;
    wire.ey += wire.vy * dt;

    const dx = wire.ex - wire.sx;
    const dy = wire.ey - wire.sy;
    const dist = Math.hypot(dx, dy);

    // 天井に届いたらフック
    if (wire.ey <= CEILING_HOOK_Y) {
      wire.phase = "hooked";
      wire.length = Math.hypot(player.x - wire.ex, player.y - wire.ey);
      if (wire.length < 60) wire.length = 60;
      return;
    }

    // 射程超え or 画面外
    if (
      dist > MAX_WIRE_DIST ||
      wire.ex < 0 || wire.ex > GAME_WIDTH ||
      wire.ey < 0 || wire.ey > GAME_HEIGHT
    ) {
      detachWire();
    }
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

  if (wire.phase === "hooked") {
    ctx.fillStyle = "#e6ff80";
    ctx.beginPath();
    ctx.arc(wire.ex, wire.ey, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}
