"use strict";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const keys = { left: false, right: false };
const mouse = { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 };

let lastTime = 0;

function handleKeyDown(e) {
  switch (e.key) {
    case "ArrowLeft":
      keys.left = true;
      player.dir = -1;
      break;
    case "ArrowRight":
      keys.right = true;
      player.dir = 1;
      break;
    case " ":
      if (wire.phase === "hooked") {
        pullJumpFromWire();
      } else if (player.onGround) {
        player.vy = JUMP_SPEED;
        player.onGround = false;
      }
      break;
    case "x":
    case "X":
      if (wire.phase === "hooked" || wire.phase === "flying") {
        detachWire();
      }
      break;
  }
}

function handleKeyUp(e) {
  switch (e.key) {
    case "ArrowLeft": keys.left = false; break;
    case "ArrowRight": keys.right = false; break;
  }
}

function handleMouseMove(e) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
}

function handleMouseDown(e) {
  if (e.button === 0) {
    fireWireToMouse(mouse.x, mouse.y);
  }
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mousedown", handleMouseDown);

// フック中のワイヤ方向ジャンプ（前回確定版）
function pullJumpFromWire() {
  if (wire.phase !== "hooked") return;

  const ax = wire.ex;
  const ay = wire.ey;

  // プレイヤー → アンカー方向（ワイヤ方向）
  let dx = ax - player.x;
  let dy = ay - player.y;
  let dist = Math.hypot(dx, dy);

  if (dist === 0) {
    dist = 0.0001;
    dx = 0;
    dy = -1;
  }

  dx /= dist;
  dy /= dist;

  player.vx += dx * PULL_JUMP_SPEED;
  player.vy += dy * PULL_JUMP_SPEED;

  detachWire();
}

function update(dt) {
  updateWire(dt);

  if (wire.phase === "hooked") {
    // ★ 14-4版：スイング操作なし
    updatePlayerSwing(dt, wire);
  } else {
    updatePlayerNormal(dt, keys);
  }
}

function drawBackground() {
  ctx.fillStyle = "#151a28";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.strokeStyle = "#444";
  ctx.beginPath();
  ctx.moveTo(0, CEILING_HOOK_Y);
  ctx.lineTo(GAME_WIDTH, CEILING_HOOK_Y);
  ctx.stroke();

  ctx.fillStyle = "#30384a";
  ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);

  ctx.fillStyle = "#3b465e";
  ctx.fillRect(120, 320, 200, 20);
}

function drawHUD() {
  ctx.fillStyle = "#fff";
  ctx.font = "14px system-ui";
  ctx.fillText("←→: 移動 / Space: ジャンプ（フック中はワイヤ方向ジャンプ）", 20, 24);
  ctx.fillText("左クリック: ワイヤ発射 / X: ワイヤ解除", 20, 44);
  ctx.fillText("※ 14-4版：フック中の“こぐ操作(スイング)”はまだ無い", 20, 64);
}

function draw() {
  drawBackground();
  drawWire(ctx);
  drawPlayer(ctx);
  drawHUD();
}

function loop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}

resetPlayer();
resetWire();
requestAnimationFrame(loop);
