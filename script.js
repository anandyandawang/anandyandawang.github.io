document.getElementById("year").textContent = new Date().getFullYear();

const canvas = document.getElementById("court");
const ctx = canvas.getContext("2d");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ARC_HEIGHT_RATIO = 0.62;
const BASE_FLIGHT_SECONDS = 1.6;
const MAX_SPEED_MULTIPLIER = 3.2;
const CAT_INSET = 44;
const RACKET_REACH = 26;
const BIRD_RADIUS = 6;
const POINTER_RADIUS = 22;
const POINTER_PUSH = 420;
const RESPAWN_DELAY_MS = 500;

const state = {
  width: 0,
  height: 0,
  pointer: null,
  speedMultiplier: 1,
  bird: null,
  bounceTo: 1,
  swing: [0, 0],
  respawnAt: 0,
  lastTime: 0,
};

function palette() {
  const styles = getComputedStyle(document.documentElement);
  return {
    ink: styles.getPropertyValue("--ink").trim(),
    moss: styles.getPropertyValue("--moss").trim(),
    clay: styles.getPropertyValue("--clay").trim(),
    line: styles.getPropertyValue("--line").trim(),
  };
}

function resize() {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  state.width = rect.width;
  state.height = rect.height;
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function groundY() {
  return state.height - 22;
}

function catX(index) {
  return index === 0 ? CAT_INSET : state.width - CAT_INSET;
}

function racketY() {
  return groundY() - 26;
}

function spawnBird(fromCat) {
  state.bird = { x: catX(fromCat), y: racketY(), vx: 0, vy: 0, gravity: 0, spin: 0 };
  launchToward(fromCat === 0 ? 1 : 0);
}

function launchToward(targetCat) {
  const bird = state.bird;
  const flight = BASE_FLIGHT_SECONDS / state.speedMultiplier;
  const apex = racketY() * ARC_HEIGHT_RATIO;
  const dx = catX(targetCat) - bird.x;
  const dy = racketY() - bird.y;
  bird.gravity = (8 * apex) / (flight * flight);
  bird.vx = dx / flight;
  bird.vy = dy / flight - (bird.gravity * flight) / 2;
  state.bounceTo = targetCat;
  state.swing[targetCat === 0 ? 1 : 0] = 1;
}

function updateSpeedFromPointer() {
  if (!state.pointer) {
    state.speedMultiplier = 1;
    return;
  }
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const dx = state.pointer.pageX - centerX;
  const dy = state.pointer.pageY - centerY;
  const distance = Math.hypot(dx, dy);
  const reach = Math.hypot(centerX, centerY);
  const closeness = 1 - Math.min(distance / reach, 1);
  const eased = closeness * closeness;
  state.speedMultiplier = 1 + eased * (MAX_SPEED_MULTIPLIER - 1);
}

function pointerCollide(bird, dt) {
  if (!state.pointer || state.pointer.canvasX === null) return;
  const dx = bird.x - state.pointer.canvasX;
  const dy = bird.y - state.pointer.canvasY;
  const distance = Math.hypot(dx, dy);
  if (distance > POINTER_RADIUS + BIRD_RADIUS || distance === 0) return;
  const nx = dx / distance;
  const ny = dy / distance;
  bird.vx += nx * POINTER_PUSH * dt * 8;
  bird.vy += ny * POINTER_PUSH * dt * 8;
  bird.spin += 12;
}

function tryReturn(bird) {
  const target = state.bounceTo;
  const reachX = Math.abs(bird.x - catX(target)) <= RACKET_REACH;
  const reachY = Math.abs(bird.y - racketY()) <= RACKET_REACH * 1.4;
  const headingIn = target === 0 ? bird.vx < 0 : bird.vx > 0;
  if (reachX && reachY && headingIn) {
    launchToward(target === 0 ? 1 : 0);
  }
}

function step(dt) {
  updateSpeedFromPointer();
  state.swing = state.swing.map((s) => Math.max(0, s - dt * 4));

  const bird = state.bird;
  if (!bird) {
    if (performance.now() >= state.respawnAt) spawnBird(Math.random() < 0.5 ? 0 : 1);
    return;
  }

  bird.vy += bird.gravity * dt;
  bird.x += bird.vx * dt;
  bird.y += bird.vy * dt;
  bird.spin *= 0.92;

  pointerCollide(bird, dt);
  tryReturn(bird);

  const fell = bird.y >= groundY() - BIRD_RADIUS;
  const gone = bird.x < -20 || bird.x > state.width + 20 || bird.y < -120;
  if (fell || gone) {
    state.bird = null;
    state.respawnAt = performance.now() + RESPAWN_DELAY_MS;
  }
}

function drawCat(x, facing, swing, colors) {
  const y = groundY();
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.strokeStyle = colors.ink;
  ctx.fillStyle = colors.ink;
  ctx.lineWidth = 1.6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(-14, 0);
  ctx.quadraticCurveTo(-14, -20, 0, -20);
  ctx.quadraticCurveTo(12, -20, 12, 0);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-14, -4);
  ctx.quadraticCurveTo(-26, -6, -22, -20);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(6, -30, 10, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-2, -38);
  ctx.lineTo(-1, -47);
  ctx.lineTo(5, -39);
  ctx.moveTo(10, -39);
  ctx.lineTo(14, -47);
  ctx.lineTo(15, -38);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(4, -31, 1.2, 0, Math.PI * 2);
  ctx.arc(10, -31, 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(12, -28); ctx.lineTo(20, -30);
  ctx.moveTo(12, -26); ctx.lineTo(20, -25);
  ctx.stroke();

  const armAngle = -0.5 - swing * 1.2;
  ctx.translate(12, -18);
  ctx.rotate(armAngle);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(16, 0);
  ctx.stroke();
  ctx.strokeStyle = colors.moss;
  ctx.beginPath();
  ctx.ellipse(24, 0, 8, 6, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawBird(bird, colors) {
  const angle = Math.atan2(bird.vy, bird.vx) + Math.PI / 2 + bird.spin * 0.05;
  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate(angle);
  ctx.strokeStyle = colors.ink;
  ctx.fillStyle = colors.clay;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, 0, 3.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-3, -2); ctx.lineTo(-7, -14);
  ctx.moveTo(0, -3); ctx.lineTo(0, -15);
  ctx.moveTo(3, -2); ctx.lineTo(7, -14);
  ctx.stroke();
  ctx.restore();
}

function drawCourt(colors) {
  const y = groundY();
  ctx.strokeStyle = colors.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(16, y + 0.5);
  ctx.lineTo(state.width - 16, y + 0.5);
  ctx.stroke();

  const netX = state.width / 2;
  ctx.beginPath();
  ctx.moveTo(netX + 0.5, y);
  ctx.lineTo(netX + 0.5, y - 40);
  ctx.stroke();
  ctx.setLineDash([2, 3]);
  for (let i = 1; i <= 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(netX - 6, y - i * 10 + 0.5);
    ctx.lineTo(netX + 6, y - i * 10 + 0.5);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawPointer(colors) {
  if (!state.pointer || state.pointer.canvasX === null) return;
  ctx.strokeStyle = colors.moss;
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.arc(state.pointer.canvasX, state.pointer.canvasY, POINTER_RADIUS, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function render() {
  const colors = palette();
  ctx.clearRect(0, 0, state.width, state.height);
  drawCourt(colors);
  drawCat(catX(0), 1, state.swing[0], colors);
  drawCat(catX(1), -1, state.swing[1], colors);
  if (state.bird) drawBird(state.bird, colors);
  drawPointer(colors);
}

function frame(now) {
  const dt = Math.min((now - state.lastTime) / 1000, 0.05);
  state.lastTime = now;
  step(dt);
  render();
  requestAnimationFrame(frame);
}

function trackPointer(event) {
  const rect = canvas.getBoundingClientRect();
  const inside =
    event.clientX >= rect.left && event.clientX <= rect.right &&
    event.clientY >= rect.top && event.clientY <= rect.bottom;
  state.pointer = {
    pageX: event.clientX,
    pageY: event.clientY,
    canvasX: inside ? event.clientX - rect.left : null,
    canvasY: inside ? event.clientY - rect.top : null,
  };
}

window.addEventListener("pointermove", trackPointer, { passive: true });
window.addEventListener("pointerdown", trackPointer, { passive: true });
window.addEventListener("pointerleave", () => { state.pointer = null; });
document.addEventListener("mouseleave", () => { state.pointer = null; });
window.addEventListener("resize", resize);

resize();
if (reducedMotion) {
  state.bird = { x: state.width / 2, y: racketY() - 40, vx: 1, vy: 0, gravity: 0, spin: 0 };
  render();
} else {
  spawnBird(0);
  state.lastTime = performance.now();
  requestAnimationFrame(frame);
}
