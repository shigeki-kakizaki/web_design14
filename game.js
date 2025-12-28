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
      // ✅13-6：フック中 Space で引っ張りジャンプ（=解除を伴う）
      if (wire.phase === "hooked") {
        pullJumpFromWire();
      }
      break;

    case "x":
    case "X":
      // ❌14-3：Xでのフック解除は “削除” する（何もしない）
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

// ✅13-6：ワイヤ方向に引っ張るジャンプ（速度を加算して解除）
function pullJumpFromWire() {
  if (wire.phase !== "hooked") return;

  const ax = wire.ex;
  const ay = wire.ey;

  // プレイヤー→アンカー方向（ワイヤ方向）
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

  // ワイヤ方向へ加速（速度を加算）
  player.vx += dx * PULL_JUMP_SPEED;
  player.vy += dy * PULL_JUMP_SPEED;

  // 引っ張りジャンプは「解除を伴う」仕様（13-6）
  detachWire();
}

function update(dt) {
  updateWire(dt);

  if (wire.phase === "hooked") {
    // ✅14-2：フック後の振り子運動
    updatePlayerSwing(dt, wire);
  } else {
    // ✅入力なし：落下＋着地（滑り防止は player.js 側）
    updatePlayerNormal(dt);
  }
}

function drawBackground() {
  ctx.fillStyle = "#151a28";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // 天井ライン（フック位置）
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
  ctx.fillText("左クリック: ワイヤ発射 / Space: 引っ張りジャンプ（解除を伴う）", 20, 24);
  ctx.fillText("※X解除は未導入（14-3の機能を削除）", 20, 44);
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
