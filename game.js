"use strict";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const mouse = { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 };
let lastTime = 0;

function handleKeyDown(e) {
  switch (e.key) {
    case " ":
      // ❌13-6：引っ張りジャンプはまだ無い
      break;

    case "x":
    case "X":
      // ❌14-3：X解除はまだ無い
      break;
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
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mousedown", handleMouseDown);

function update(dt) {
  updateWire(dt);

  if (wire.phase === "hooked") {
    // ★13-6段階：フックしたら「そのまま」（振り子なし・固定もしない）
    // 物理更新を止める＝落下もしない
    player.vx = 0;
    player.vy = 0;
    player.onGround = false;
    return;
  }

  // 入力なし：落下＋着地（滑り防止は player.js 側）
  updatePlayerNormal(dt);
}

function drawBackground() {
  ctx.fillStyle = "#151a28";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // 天井ライン
  ctx.strokeStyle = "#444";
  ctx.beginPath();
  ctx.moveTo(0, CEILING_HOOK_Y);
  ctx.lineTo(GAME_WIDTH, CEILING_HOOK_Y);
  ctx.stroke();

  // 地面
  ctx.fillStyle = "#30384a";
  ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);

  // 足場
  ctx.fillStyle = "#3b465e";
  ctx.fillRect(120, 320, 200, 20);
}

function drawHUD() {
  ctx.fillStyle = "#fff";
  ctx.font = "14px system-ui";
  ctx.fillText("左クリック: ワイヤ発射 / Space: 引っ張りジャンプ", 20, 24);
  ctx.fillText("※13-6版：フック中は固定ぶら下がり（振り子はまだ無い）", 20, 44);
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
