"use strict";

const player = {
  x: 150,
  y: 300,
  prevY: 300,
  vx: 0,
  vy: 0,
  r: 16,
  onGround: false,
  dir: 1
};

function resetPlayer() {
  player.x = 150;
  player.y = 300;
  player.prevY = 300;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.dir = 1;
}

// 通常状態（地上/空中）
function updatePlayerNormal(dt, keys) {
  player.prevY = player.y;

  // 入力があるときだけ上書き（空中慣性を残す）
  if (keys.left) {
    player.vx = -MOVE_SPEED;
    player.dir = -1;
  } else if (keys.right) {
    player.vx = MOVE_SPEED;
    player.dir = 1;
  }

  // 重力
  player.vy += GRAVITY * dt;

  // 位置更新
  player.x += player.vx * dt;
  player.y += player.vy * dt;

  // 地面
  if (player.y + player.r > GROUND_Y) {
    player.y = GROUND_Y - player.r;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  // 足場（上から乗る）
  const platX = 120;
  const platY = 320;
  const platW = 200;

  if (player.vy >= 0) {
    const prevBottom = player.prevY + player.r;
    const currBottom = player.y + player.r;

    const withinX = (player.x > platX && player.x < platX + platW);
    const crossedTop = (prevBottom <= platY && currBottom >= platY);

    if (withinX && crossedTop) {
      player.y = platY - player.r;
      player.vy = 0;
      player.onGround = true;
    }
  }

  // 地上で入力なしなら停止
  if (player.onGround && !keys.left && !keys.right) {
    player.vx = 0;
  }

  // 画面端
  if (player.x - player.r < 0) player.x = player.r;
  if (player.x + player.r > GAME_WIDTH) player.x = GAME_WIDTH - player.r;
}

// フック中（振り子運動：14-2相当）
// ★ 14-5の「左右キーでこぐ加速」を入れない
function updatePlayerSwing(dt, wire) {
  player.prevY = player.y;

  const ax = wire.ex;
  const ay = wire.ey;
  const R = wire.length;

  // 重力
  player.vy += GRAVITY * dt;

  // 位置更新（いったん自由落下）
  player.x += player.vx * dt;
  player.y += player.vy * dt;

  // アンカー→プレイヤー
  let dx = player.x - ax;
  let dy = player.y - ay;
  let dist = Math.hypot(dx, dy);

  if (dist === 0) {
    dist = 0.0001;
    dx = 0;
    dy = 1;
  }

  dx /= dist;
  dy /= dist;

  // 円周上に戻す
  player.x = ax + dx * R;
  player.y = ay + dy * R;

  // ロープ方向成分を消して接線方向だけ残す（振り子っぽさ）
  const vr = player.vx * dx + player.vy * dy;
  player.vx -= vr * dx;
  player.vy -= vr * dy;

  player.onGround = false;
}

function drawPlayer(ctx) {
  ctx.fillStyle = "#ffb347";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(player.x + player.dir * player.r, player.y);
  ctx.stroke();
}
