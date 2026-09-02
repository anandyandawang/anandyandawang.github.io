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
const FACING_MARGIN = 6;

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

const KEEP_UP_TILTS = [-14, -10, -6, -3, 0, 3, 6, 10, 14];
const KEEP_UP_CEILING = 20;
const KEEP_UP_MIN_APEX = 0.55;
const KEEP_UP_MAX_APEX = 0.8;
const KEEP_UP_MIN_TARGET = 0.3;
const KEEP_UP_MAX_TARGET = 0.7;
const KEEP_UP_MIN_SPEED = 250;
const KEEP_UP_MAX_SPEED = 900;
const KEEP_UP_ITERATIONS = 12;

const POINTER_RADIUS = 22;
const KNOCK_SPEED = 260;
const RESPAWN_DELAY = 0.6;

const HIT_STOP = 0.045;
const SWING_DURATION = 0.28;
const SWING_SNAP = 1.6;
const SWING_ARC = 1.2;
const RING_DURATION = 0.28;
const RING_MIN_RADIUS = 4;
const RING_MAX_RADIUS = 26;
const RING_ALPHA = 0.55;
const MAX_RINGS = 2;
const STRETCH_DURATION = 0.14;
const STRETCH_ALONG = 1.35;
const STRETCH_ACROSS = 0.8;
const RECOIL_DURATION = 0.12;
const RECOIL_SCALE_X = 1.06;
const RECOIL_SCALE_Y = 0.92;
const KICK_DURATION = 0.06;
const KICK_DISTANCE = 1.5;

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function progress(elapsed, duration) {
  return clamp(elapsed / duration, 0, 1);
}

function easeOut(p) {
  return 1 - (1 - p) * (1 - p);
}

function decay(p) {
  return (1 - p) * (1 - p);
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

function integrate(body, dt) {
  const speed = Math.hypot(body.vx, body.vy);
  body.vx += -DRAG * speed * body.vx * dt;
  body.vy += (GRAVITY - DRAG * speed * body.vy) * dt;
  body.x += body.vx * dt;
  body.y += body.vy * dt;
}

function velocityFor(angle, speed) {
  return { vx: Math.cos(angle) * speed, vy: -Math.sin(angle) * speed };
}

function absoluteAngle(tilt, facing) {
  return facing > 0 ? tilt : Math.PI - tilt;
}

function landingForShot(court, origin, angle, speed) {
  const velocity = velocityFor(angle, speed);
  return court.predictLandingX({ x: origin.x, y: origin.y, vx: velocity.vx, vy: velocity.vy });
}

function apexHeightForShot(origin, angle, speed) {
  const velocity = velocityFor(angle, speed);
  const probe = { x: origin.x, y: origin.y, vx: velocity.vx, vy: velocity.vy };
  let top = origin.y;
  const steps = Math.ceil(PREDICT_HORIZON / PREDICT_STEP);
  for (let i = 0; i < steps; i += 1) {
    integrate(probe, PREDICT_STEP);
    if (probe.y < top) top = probe.y;
    if (probe.vy >= 0) break;
  }
  return origin.y - top;
}

function aimSpeedForLanding(court, origin, angle, facing, targetX) {
  let low = MIN_LAUNCH_SPEED;
  let high = MAX_LAUNCH_SPEED;
  let bestSpeed = (low + high) / 2;
  let bestError = Infinity;
  for (let i = 0; i < AIM_ITERATIONS; i += 1) {
    const speed = (low + high) / 2;
    const landing = landingForShot(court, origin, angle, speed);
    const error = landing === null ? Infinity : Math.abs(landing - targetX);
    if (error < bestError) {
      bestError = error;
      bestSpeed = speed;
    }
    const overshoots =
      landing === null || (facing > 0 ? landing > targetX : landing < targetX);
    if (overshoots) high = speed;
    else low = speed;
  }
  return { speed: bestSpeed, error: bestError };
}

function aimSpeedForApex(origin, angle, targetHeight) {
  let low = KEEP_UP_MIN_SPEED;
  let high = KEEP_UP_MAX_SPEED;
  let bestSpeed = (low + high) / 2;
  let bestError = Infinity;
  for (let i = 0; i < KEEP_UP_ITERATIONS; i += 1) {
    const speed = (low + high) / 2;
    const height = apexHeightForShot(origin, angle, speed);
    const error = Math.abs(height - targetHeight);
    if (error < bestError) {
      bestError = error;
      bestSpeed = speed;
    }
    if (height < targetHeight) low = speed;
    else high = speed;
  }
  return bestSpeed;
}

function landingStrip(court, cat) {
  const range = court.catRange(cat);
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

function rallyShot(court, cat) {
  const origin = court.racketPoint(cat);
  const strip = landingStrip(court, court.opponentOf(cat));
  const targetX = strip.min + Math.random() * (strip.max - strip.min);
  let best = null;
  for (let attempt = 0; attempt < AIM_ATTEMPTS; attempt += 1) {
    const tilt =
      MIN_LAUNCH_ANGLE + Math.random() * (MAX_LAUNCH_ANGLE - MIN_LAUNCH_ANGLE);
    const angle = absoluteAngle(tilt, cat.facing);
    const aim = aimSpeedForLanding(court, origin, angle, cat.facing, targetX);
    if (best === null || aim.error < best.error) {
      best = { angle, speed: aim.speed, error: aim.error };
    }
    if (best.error <= AIM_TOLERANCE) break;
  }
  return { angle: best.angle, speed: best.speed };
}

function keepUpShot(court, cat) {
  const state = court.state;
  const origin = court.racketPoint(cat);
  const headroom = origin.y - KEEP_UP_CEILING;
  const spread = KEEP_UP_MAX_APEX - KEEP_UP_MIN_APEX;
  const targetHeight = headroom * (KEEP_UP_MIN_APEX + Math.random() * spread);
  const reach = KEEP_UP_MAX_TARGET - KEEP_UP_MIN_TARGET;
  const targetX = state.width * (KEEP_UP_MIN_TARGET + Math.random() * reach);
  let best = null;
  for (let i = 0; i < KEEP_UP_TILTS.length; i += 1) {
    const angle = Math.PI / 2 - (KEEP_UP_TILTS[i] * Math.PI) / 180;
    const speed = aimSpeedForApex(origin, angle, targetHeight);
    const landing = landingForShot(court, origin, angle, speed);
    const error = landing === null ? Infinity : Math.abs(landing - targetX);
    if (best === null || error < best.error) best = { angle, speed, error };
  }
  return { angle: best.angle, speed: best.speed };
}

const SHOT_STRATEGIES = { rally: rallyShot, keepUps: keepUpShot };

function resolveStrategy(choice) {
  if (typeof choice === "function") return choice;
  return SHOT_STRATEGIES[choice] || rallyShot;
}

function drawGround(ctx, state, colors) {
  const y = state.height - GROUND_MARGIN;
  ctx.strokeStyle = colors.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(16, y + 0.5);
  ctx.lineTo(state.width - 16, y + 0.5);
  ctx.stroke();
}

function drawCat(ctx, cat, ground, colors) {
  const swing = Math.pow(cat.swing, SWING_SNAP);
  const recoil = decay(progress(cat.recoilElapsed, RECOIL_DURATION));
  ctx.save();
  ctx.translate(cat.x, ground);
  ctx.scale(1 + (RECOIL_SCALE_X - 1) * recoil, 1 + (RECOIL_SCALE_Y - 1) * recoil);
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

  ctx.translate(12, -18);
  ctx.rotate(-0.5 - swing * SWING_ARC);
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

function drawBird(ctx, bird, colors) {
  const speed = Math.hypot(bird.vx, bird.vy);
  const heading = speed < 0.001 ? Math.PI / 2 : Math.atan2(bird.vy, bird.vx);
  const elapsed = typeof bird.stretchElapsed === "number" ? bird.stretchElapsed : STRETCH_DURATION;
  const stretch = decay(progress(elapsed, STRETCH_DURATION));
  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate(heading - Math.PI / 2);
  ctx.scale(1 + (STRETCH_ACROSS - 1) * stretch, 1 + (STRETCH_ALONG - 1) * stretch);
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

function drawRings(ctx, effects, colors) {
  ctx.strokeStyle = colors.moss;
  ctx.lineWidth = 1;
  for (let i = 0; i < effects.length; i += 1) {
    const ring = effects[i];
    const p = progress(ring.elapsed, RING_DURATION);
    const radius = RING_MIN_RADIUS + (RING_MAX_RADIUS - RING_MIN_RADIUS) * easeOut(p);
    ctx.globalAlpha = RING_ALPHA * (1 - p * p);
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function createCourt(canvas, options) {
  const settings = options || {};
  const ctx = canvas.getContext("2d");
  const chooseShot = resolveStrategy(settings.chooseShot);
  const paceOf = settings.timeScale || (() => 1);

  const state = {
    width: 0,
    height: 0,
    pointer: null,
    bird: null,
    cats: [],
    effects: [],
    kick: null,
    timeScale: 1,
    simTime: 0,
    hitStop: 0,
    respawnAt: 0,
    holdUntil: 0,
    hits: 0,
    misses: 0,
    lastTime: 0,
    frameId: 0,
  };

  function groundY() {
    return state.height - GROUND_MARGIN;
  }

  function racketY() {
    return groundY() - RACKET_HEIGHT;
  }

  function catRange(cat) {
    const range = cat.range(state);
    if (range.min > range.max) {
      const middle = (range.min + range.max) / 2;
      return { min: middle, max: middle };
    }
    return range;
  }

  function settleCat(cat) {
    const range = catRange(cat);
    cat.home = (range.min + range.max) / 2;
    cat.x = clamp(cat.x, range.min, range.max);
    cat.target = clamp(cat.target, range.min, range.max);
  }

  function createCat(spec) {
    const cat = {
      x: 0,
      vx: 0,
      facing: spec.facing,
      facesBird: spec.facesBird === true,
      range: spec.range,
      target: 0,
      swing: 0,
      swingElapsed: SWING_DURATION,
      recoilElapsed: RECOIL_DURATION,
      home: 0,
    };
    settleCat(cat);
    cat.x = cat.home;
    cat.target = cat.home;
    return cat;
  }

  function racketPoint(cat) {
    return { x: cat.x + cat.facing * RACKET_OFFSET_X, y: racketY() };
  }

  function opponentOf(cat) {
    for (let i = 0; i < state.cats.length; i += 1) {
      if (state.cats[i] !== cat) return state.cats[i];
    }
    return cat;
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

  function isHeld() {
    return state.simTime < state.holdUntil;
  }

  function spawn() {
    const placement = settings.initialBird(state);
    state.bird = {
      x: placement.x,
      y: placement.y,
      vx: placement.vx || 0,
      vy: placement.vy || 0,
      stretchElapsed: STRETCH_DURATION,
    };
    state.holdUntil = state.simTime + (placement.hold || 0);
  }

  function addRing(x, y) {
    state.effects.push({ x, y, elapsed: 0 });
    while (state.effects.length > MAX_RINGS) state.effects.shift();
  }

  function strike(cat) {
    const bird = state.bird;
    const origin = racketPoint(cat);
    const shot = chooseShot(court, cat);
    const velocity = velocityFor(shot.angle, shot.speed);
    bird.x = origin.x;
    bird.y = origin.y;
    bird.vx = velocity.vx;
    bird.vy = velocity.vy;
    bird.stretchElapsed = 0;
    cat.swing = 1;
    cat.swingElapsed = 0;
    cat.recoilElapsed = 0;
    addRing(origin.x, origin.y);
    const speed = Math.hypot(velocity.vx, velocity.vy) || 1;
    state.kick = {
      x: (-velocity.vx / speed) * KICK_DISTANCE,
      y: (-velocity.vy / speed) * KICK_DISTANCE,
      elapsed: 0,
    };
    state.hits += 1;
    state.hitStop = HIT_STOP;
  }

  function chooseReceiver(landing) {
    let best = null;
    let bestError = Infinity;
    for (let i = 0; i < state.cats.length; i += 1) {
      const cat = state.cats[i];
      const range = catRange(cat);
      const wanted = landing - cat.facing * RACKET_OFFSET_X;
      const error = Math.abs(clamp(wanted, range.min, range.max) - wanted);
      if (error < bestError) {
        bestError = error;
        best = cat;
      }
    }
    return best;
  }

  function birdSide(landing) {
    if (landing !== null) return landing;
    return state.bird ? state.bird.x : null;
  }

  function faceBird(cat, landing) {
    if (!cat.facesBird) return;
    const side = birdSide(landing);
    if (side === null) return;
    if (side > cat.x + FACING_MARGIN) cat.facing = 1;
    else if (side < cat.x - FACING_MARGIN) cat.facing = -1;
  }

  function updateTargets(landing) {
    const receiver = landing === null ? null : chooseReceiver(landing);
    for (let i = 0; i < state.cats.length; i += 1) {
      const cat = state.cats[i];
      if (cat !== receiver) {
        cat.target = cat.home;
        continue;
      }
      const range = catRange(cat);
      cat.target = clamp(landing - cat.facing * RACKET_OFFSET_X, range.min, range.max);
    }
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
    if (bird.vy <= 0) return;
    for (let i = 0; i < state.cats.length; i += 1) {
      const cat = state.cats[i];
      const point = racketPoint(cat);
      if (Math.hypot(bird.x - point.x, bird.y - point.y) > RACKET_REACH) continue;
      strike(cat);
      return;
    }
  }

  function birdIsDone(bird) {
    const fell = bird.y >= groundY() - BIRD_RADIUS;
    const gone = bird.x < -20 || bird.x > state.width + 20 || bird.y < -150;
    return fell || gone;
  }

  function ageEffects(dt) {
    for (let i = 0; i < state.cats.length; i += 1) {
      const cat = state.cats[i];
      cat.swingElapsed += dt;
      cat.recoilElapsed += dt;
      cat.swing = decay(progress(cat.swingElapsed, SWING_DURATION));
    }
    if (state.bird) state.bird.stretchElapsed += dt;
    for (let i = state.effects.length - 1; i >= 0; i -= 1) {
      state.effects[i].elapsed += dt;
      if (state.effects[i].elapsed >= RING_DURATION) state.effects.splice(i, 1);
    }
    if (state.kick) {
      state.kick.elapsed += dt;
      if (state.kick.elapsed >= KICK_DURATION) state.kick = null;
    }
  }

  function advance(dt) {
    state.simTime += dt;
    ageEffects(dt);
    const landing = state.bird && !isHeld() ? predictLandingX(state.bird) : null;
    for (let i = 0; i < state.cats.length; i += 1) faceBird(state.cats[i], landing);
    updateTargets(landing);
    for (let i = 0; i < state.cats.length; i += 1) moveCat(state.cats[i], dt);

    const bird = state.bird;
    if (!bird) {
      if (state.simTime >= state.respawnAt) spawn();
      return;
    }
    if (isHeld()) return;

    integrate(bird, dt);
    pointerKnock(bird);
    tryStrikes();

    if (birdIsDone(state.bird)) {
      state.bird = null;
      state.misses += 1;
      state.respawnAt = state.simTime + RESPAWN_DELAY;
      if (settings.onMiss) settings.onMiss(court);
    }
  }

  function step(realDt) {
    if (state.hitStop > 0) {
      state.hitStop = Math.max(0, state.hitStop - realDt);
      return;
    }
    state.timeScale = paceOf();
    const simDt = realDt * state.timeScale;
    const steps = Math.max(1, Math.ceil(simDt / MAX_SUB_STEP));
    const dt = simDt / steps;
    for (let i = 0; i < steps; i += 1) {
      advance(dt);
      if (state.hitStop > 0) break;
    }
  }

  function kickOffset() {
    if (!state.kick) return { x: 0, y: 0 };
    const amount = decay(progress(state.kick.elapsed, KICK_DURATION));
    return { x: state.kick.x * amount, y: state.kick.y * amount };
  }

  function drawPointer(colors) {
    if (!state.pointer || state.pointer.canvasX === null) return;
    ctx.strokeStyle = colors.moss;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(state.pointer.canvasX, state.pointer.canvasY, POINTER_RADIUS, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function render() {
    const colors = palette();
    const offset = kickOffset();
    ctx.clearRect(0, 0, state.width, state.height);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    drawGround(ctx, state, colors);
    if (settings.drawBackdrop) settings.drawBackdrop(ctx, state, colors);
    for (let i = 0; i < state.cats.length; i += 1) drawCat(ctx, state.cats[i], groundY(), colors);
    if (state.bird) drawBird(ctx, state.bird, colors);
    drawRings(ctx, state.effects, colors);
    drawPointer(colors);
    ctx.restore();
  }

  function frame(now) {
    const realDt = Math.min((now - state.lastTime) / 1000, 0.05);
    state.lastTime = now;
    step(realDt);
    render();
    state.frameId = requestAnimationFrame(frame);
  }

  function start() {
    if (state.frameId) return;
    state.lastTime = performance.now();
    state.frameId = requestAnimationFrame(frame);
  }

  function stop() {
    if (state.frameId) cancelAnimationFrame(state.frameId);
    state.frameId = 0;
  }

  function release() {
    state.holdUntil = state.simTime;
  }

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    state.width = rect.width;
    state.height = rect.height;
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    for (let i = 0; i < state.cats.length; i += 1) settleCat(state.cats[i]);
    if (!state.frameId && state.cats.length) render();
  }

  function trackPointer(event) {
    const rect = canvas.getBoundingClientRect();
    state.pointer = {
      canvasX: event.clientX - rect.left,
      canvasY: event.clientY - rect.top,
    };
  }

  function forgetPointer() {
    state.pointer = null;
  }

  const court = {
    state,
    step,
    render,
    start,
    stop,
    release,
    groundY,
    racketY,
    racketPoint,
    catRange,
    opponentOf,
    predictLandingX,
  };

  resize();
  state.cats = (settings.cats || []).map(createCat);
  spawn();
  if (settings.releaseOnStart === false) state.holdUntil = Infinity;

  canvas.addEventListener("pointermove", trackPointer, { passive: true });
  canvas.addEventListener("pointerdown", trackPointer, { passive: true });
  canvas.addEventListener("pointerleave", forgetPointer);
  canvas.addEventListener("pointercancel", forgetPointer);
  if (typeof ResizeObserver === "function") new ResizeObserver(resize).observe(canvas);
  else window.addEventListener("resize", resize);

  return court;
}
