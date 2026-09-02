document.getElementById("year").textContent = new Date().getFullYear();

const canvas = document.getElementById("court");
const ctx = canvas.getContext("2d");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const GRAVITY = 700;
const DRAG = 0.0028;
const MAX_SUB_STEP = 1 / 120;
const PREDICT_STEP = 1 / 240;
const PREDICT_HORIZON = 4;

const BIRD_RADIUS = 6;
const GROUND_MARGIN = 22;

const CAT_INSET = 44;
const CAT_NET_GAP = 50;
const CAT_MAX_SPEED = 240;
const CAT_ACCEL = 700;
const LEAN = 0.0006;
const SWING_DECAY = 4;

const RACKET_OFFSET_X = 33;
const RACKET_HEIGHT = 30;
const RACKET_REACH = 22;

const MIN_LAUNCH_ANGLE = (15 * Math.PI) / 180;
const MAX_LAUNCH_ANGLE = (40 * Math.PI) / 180;
const MIN_LAUNCH_SPEED = 350;
const MAX_LAUNCH_SPEED = 1100;
const AIM_ITERATIONS = 12;
const AIM_ATTEMPTS = 4;
const AIM_TOLERANCE = 40;
const LANDING_MARGIN = 20;

const POINTER_RADIUS = 22;
const KNOCK_SPEED = 260;

const RESPAWN_DELAY = 0.6;
const TIME_SCALE_MAX = 3;

const state = {
  width: 0,
  height: 0,
  pointer: null,
  bird: null,
  cats: [],
  timeScale: 1,
  simTime: 0,
  respawnAt: 0,
  lastTime: 0,
};

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

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
  state.cats.forEach(settleCat);
}

function groundY() {
  return state.height - GROUND_MARGIN;
}

function racketY() {
  return groundY() - RACKET_HEIGHT;
}

function netX() {
  return state.width / 2;
}

function catRange(cat) {
  if (cat.facing === 1) return { min: CAT_INSET, max: netX() - CAT_NET_GAP };
  return { min: netX() + CAT_NET_GAP, max: state.width - CAT_INSET };
}

function settleCat(cat) {
  const range = catRange(cat);
  cat.home = (range.min + range.max) / 2;
  cat.x = clamp(cat.x, range.min, range.max);
  cat.target = clamp(cat.target, range.min, range.max);
}

function createCat(facing) {
  const cat = { x: 0, vx: 0, facing, target: 0, swing: 0, home: 0 };
  const range = catRange(cat);
  cat.home = (range.min + range.max) / 2;
  cat.x = cat.home;
  cat.target = cat.home;
  return cat;
}

function leftCat() {
  return state.cats[0];
}

function rightCat() {
  return state.cats[1];
}

function opponentOf(cat) {
  return cat.facing === 1 ? rightCat() : leftCat();
}

function racketPoint(cat) {
  return { x: cat.x + cat.facing * RACKET_OFFSET_X, y: racketY() };
}

function integrate(body, dt) {
  const speed = Math.hypot(body.vx, body.vy);
  body.vx += -DRAG * speed * body.vx * dt;
  body.vy += (GRAVITY - DRAG * speed * body.vy) * dt;
  body.x += body.vx * dt;
  body.y += body.vy * dt;
}

function predictLandingX(source) {
  const targetY = racketY();
  const probe = { x: source.x, y: source.y, vx: source.vx, vy: source.vy };
  const steps = Math.ceil(PREDICT_HORIZON / PREDICT_STEP);
  for (let i = 0; i < steps; i += 1) {
    const prevX = probe.x;
    const prevY = probe.y;
    integrate(probe, PREDICT_STEP);
    if (probe.vy > 0 && prevY < targetY && probe.y >= targetY) {
      const span = probe.y - prevY;
      const fraction = span === 0 ? 0 : (targetY - prevY) / span;
      return prevX + (probe.x - prevX) * fraction;
    }
    if (probe.x < -20 || probe.x > state.width + 20) return null;
  }
  return null;
}

function launchVelocity(angle, speed, direction) {
  return { vx: Math.cos(angle) * speed * direction, vy: -Math.sin(angle) * speed };
}

function landingForShot(origin, angle, speed, direction) {
  const velocity = launchVelocity(angle, speed, direction);
  return predictLandingX({ x: origin.x, y: origin.y, vx: velocity.vx, vy: velocity.vy });
}

function aimShot(origin, angle, direction, targetX) {
  let low = MIN_LAUNCH_SPEED;
  let high = MAX_LAUNCH_SPEED;
  let bestSpeed = (low + high) / 2;
  let bestError = Infinity;
  for (let i = 0; i < AIM_ITERATIONS; i += 1) {
    const speed = (low + high) / 2;
    const landing = landingForShot(origin, angle, speed, direction);
    const error = landing === null ? Infinity : Math.abs(landing - targetX);
    if (error < bestError) {
      bestError = error;
      bestSpeed = speed;
    }
    const overshoots =
      landing === null || (direction > 0 ? landing > targetX : landing < targetX);
    if (overshoots) high = speed;
    else low = speed;
  }
  return { angle, speed: bestSpeed, error: bestError };
}

function landingStrip(cat) {
  const range = catRange(cat);
  const shift = cat.facing * RACKET_OFFSET_X;
  let min = range.min + shift + LANDING_MARGIN;
  let max = range.max + shift - LANDING_MARGIN;
  if (min > max) {
    const middle = (min + max) / 2;
    min = middle;
    max = middle;
  }
  return { min, max };
}

function strikeFrom(cat) {
  const bird = state.bird;
  const origin = racketPoint(cat);
  const strip = landingStrip(opponentOf(cat));
  const targetX = strip.min + Math.random() * (strip.max - strip.min);
  let best = null;
  for (let attempt = 0; attempt < AIM_ATTEMPTS; attempt += 1) {
    const angle =
      MIN_LAUNCH_ANGLE + Math.random() * (MAX_LAUNCH_ANGLE - MIN_LAUNCH_ANGLE);
    const shot = aimShot(origin, angle, cat.facing, targetX);
    if (best === null || shot.error < best.error) best = shot;
    if (best.error <= AIM_TOLERANCE) break;
  }
  const velocity = launchVelocity(best.angle, best.speed, cat.facing);
  bird.x = origin.x;
  bird.y = origin.y;
  bird.vx = velocity.vx;
  bird.vy = velocity.vy;
  cat.swing = 1;
}

function serve() {
  const server = state.cats[Math.random() < 0.5 ? 0 : 1];
  const origin = racketPoint(server);
  state.bird = { x: origin.x, y: origin.y, vx: 0, vy: 0 };
  strikeFrom(server);
}

function updateCatTargets() {
  const bird = state.bird;
  const landing = bird ? predictLandingX(bird) : null;
  if (landing === null) {
    state.cats.forEach((cat) => {
      cat.target = cat.home;
    });
    return;
  }
  const receiver = landing < netX() ? leftCat() : rightCat();
  state.cats.forEach((cat) => {
    if (cat !== receiver) {
      cat.target = cat.home;
      return;
    }
    const range = catRange(cat);
    cat.target = clamp(landing - cat.facing * RACKET_OFFSET_X, range.min, range.max);
  });
}

function moveCat(cat, dt) {
  const range = catRange(cat);
  const delta = cat.target - cat.x;
  const direction = Math.sign(delta);
  const desired = clamp(
    direction * Math.sqrt(2 * CAT_ACCEL * Math.abs(delta)),
    -CAT_MAX_SPEED,
    CAT_MAX_SPEED
  );
  cat.vx += clamp(desired - cat.vx, -CAT_ACCEL * dt, CAT_ACCEL * dt);
  cat.x += cat.vx * dt;
  if (cat.x < range.min) {
    cat.x = range.min;
    cat.vx = 0;
  } else if (cat.x > range.max) {
    cat.x = range.max;
    cat.vx = 0;
  }
}

function pointerKnock(bird) {
  if (!state.pointer || state.pointer.canvasX === null) return;
  const dx = bird.x - state.pointer.canvasX;
  const dy = bird.y - state.pointer.canvasY;
  const distance = Math.hypot(dx, dy);
  if (distance === 0 || distance > POINTER_RADIUS + BIRD_RADIUS) return;
  const nx = dx / distance;
  const ny = dy / distance;
  bird.x = state.pointer.canvasX + nx * (POINTER_RADIUS + BIRD_RADIUS);
  bird.y = state.pointer.canvasY + ny * (POINTER_RADIUS + BIRD_RADIUS);
  const along = bird.vx * nx + bird.vy * ny;
  if (along < KNOCK_SPEED) {
    const boost = KNOCK_SPEED - along;
    bird.vx += nx * boost;
    bird.vy += ny * boost;
  }
}

function tryStrikes() {
  const bird = state.bird;
  for (let i = 0; i < state.cats.length; i += 1) {
    const cat = state.cats[i];
    if (cat.facing * bird.vx > 0) continue;
    const point = racketPoint(cat);
    if (Math.hypot(bird.x - point.x, bird.y - point.y) > RACKET_REACH) continue;
    strikeFrom(cat);
    return;
  }
}

function birdIsDone(bird) {
  const fell = bird.y >= groundY() - BIRD_RADIUS;
  const gone = bird.x < -20 || bird.x > state.width + 20 || bird.y < -150;
  return fell || gone;
}

function stepSimulation(dt) {
  state.simTime += dt;
  state.cats.forEach((cat) => {
    cat.swing = Math.max(0, cat.swing - dt * SWING_DECAY);
  });

  updateCatTargets();
  state.cats.forEach((cat) => moveCat(cat, dt));

  const bird = state.bird;
  if (!bird) {
    if (state.simTime >= state.respawnAt) serve();
    return;
  }

  integrate(bird, dt);
  pointerKnock(bird);
  tryStrikes();

  if (birdIsDone(bird)) {
    state.bird = null;
    state.respawnAt = state.simTime + RESPAWN_DELAY;
  }
}

function updateTimeScale() {
  const rect = canvas.getBoundingClientRect();
  const courtCentre = rect.top + rect.height / 2;
  const viewportCentre = window.innerHeight / 2;
  const closeness = Math.min(
    Math.abs(courtCentre - viewportCentre) / viewportCentre,
    1
  );
  state.timeScale = 1 + closeness * closeness * (TIME_SCALE_MAX - 1);
}

function drawCat(cat, colors) {
  const swing = cat.swing;
  ctx.save();
  ctx.translate(cat.x, groundY());
  ctx.rotate(cat.vx * LEAN);
  ctx.scale(cat.facing, 1);
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
  const angle = Math.atan2(bird.vy, bird.vx) - Math.PI / 2;
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

  const net = netX();
  ctx.beginPath();
  ctx.moveTo(net + 0.5, y);
  ctx.lineTo(net + 0.5, y - 40);
  ctx.stroke();
  ctx.setLineDash([2, 3]);
  for (let i = 1; i <= 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(net - 6, y - i * 10 + 0.5);
    ctx.lineTo(net + 6, y - i * 10 + 0.5);
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
  state.cats.forEach((cat) => drawCat(cat, colors));
  if (state.bird) drawBird(state.bird, colors);
  drawPointer(colors);
}

function frame(now) {
  const realDt = Math.min((now - state.lastTime) / 1000, 0.05);
  state.lastTime = now;
  updateTimeScale();
  const simDt = realDt * state.timeScale;
  const steps = Math.max(1, Math.ceil(simDt / MAX_SUB_STEP));
  const dt = simDt / steps;
  for (let i = 0; i < steps; i += 1) stepSimulation(dt);
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
state.cats = [createCat(1), createCat(-1)];
if (reducedMotion) {
  state.bird = { x: netX(), y: racketY() - 60, vx: 300, vy: -60 };
  render();
} else {
  serve();
  state.lastTime = performance.now();
  requestAnimationFrame(frame);
}
