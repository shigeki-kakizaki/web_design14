"use strict";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const mouse = { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 };
let lastTime = 0;

// 13-4：キー操作はまだ無い（ワイヤ発射だけ）
function handleKeyDown(e) {}

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
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mousedown", handleMouseDown);

function update(dt) {
  updateWire(dt);
  updatePlayerNormal(dt);
}

function drawBackground() {
  ctx.fillStyle = "#151a28";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // 地面
  ctx.fillStyle = "#30384a";
  ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);

  // 足場（13-4では「高い初期位置」に使ってもOK）
  ctx.fillStyle = "#3b465e";
  ctx.fillRect(120, 320, 200, 20);
}

function drawHUD() {
  ctx.fillStyle = "#fff";
  ctx.font = "14px system-ui";
  ctx.fillText("左クリック: マウス方向にワイヤ発射（一定距離で消える）", 20, 24);
  ctx.fillText("※13-4：フックなし / 引っ張りジャンプなし / 解除なし", 20, 44);
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
