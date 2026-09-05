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
const CAT_SPACING = 40;
const SPACING_ROUNDS = 4;
const TURN_PENALTY = 0.15;
const TURN_DRIFT = 20;
const ARRIVAL_TIE = 0.05;
const LEAN = 0.0006;
const FACING_MARGIN = 6;

const RACKET_OFFSET_X = 33;
const RACKET_HEIGHT = 30;
const RACKET_REACH = 22;
const RACKET_REST_ANGLE = -0.5;
const OVERHEAD_ANGLE = -1.15;
const OVERHEAD_OFFSET_X = 22;
const OVERHEAD_HEIGHT = 40;

const JUMP_HEIGHT = 30;
const JUMP_SPEED = Math.sqrt(2 * GRAVITY * JUMP_HEIGHT);
const JUMP_RISE_TIME = JUMP_SPEED / GRAVITY;
const JUMP_ALIGNMENT = 14;

const MIN_LAUNCH_ANGLE = (15 * Math.PI) / 180;
const MAX_LAUNCH_ANGLE = (40 * Math.PI) / 180;
const MIN_LAUNCH_SPEED = 350;
const MAX_LAUNCH_SPEED = 1100;
const LAUNCH_SPEED_PER_WIDTH = 1.7;
const AIM_ITERATIONS = 12;
const AIM_ATTEMPTS = 4;
const AIM_TOLERANCE = 40;
const LANDING_MARGIN = 20;

const WALL_BOUNCE = 0.55;

const KEEP_UP_TILTS = [-14, -10, -6, -3, 0, 3, 6, 10, 14];
const KEEP_UP_CEILING = 20;
const KEEP_UP_MIN_APEX = 0.55;
const KEEP_UP_MAX_APEX = 0.8;
const KEEP_UP_MIN_TARGET = 0.3;
const KEEP_UP_MAX_TARGET = 0.7;
const KEEP_UP_MIN_SPEED = 250;
const KEEP_UP_MAX_SPEED = 900;
const KEEP_UP_ITERATIONS = 12;

const DRILL_SEQUENCE = ["lift", "smash", "net"];
const DRILL_REACH_TILTS = [15, 20, 25, 30];
const LIFT_TILTS = [35, 40, 45, 50, 55, 60, 65, 70, 75];
const LIFT_APEX = 0.85;
const LIFT_FLOOR_DEPTH = 0.35;
const LIFT_MIN_DEPTH = 0.5;
const LIFT_MAX_DEPTH = 0.8;
const LIFT_POST = 0.5;
const SMASH_TILTS = [-32, -26, -20, -14, -8, -3, 4];
const SMASH_SPREAD = 12;
const SMASH_TOLERANCE = 10;
const SMASH_MAX_SPEED = 1500;
const SMASH_FOLLOW_THROUGH = 0.35;
const SMASH_POST = 0.25;
const NET_TILTS = [50, 55, 60, 65, 70, 75, 80];
const NET_FLOOR_DEPTH = 0;
const NET_APEX_MIN = 55;
const NET_APEX_MAX = 70;
const NET_MIN_DEPTH = 0.15;
const NET_MAX_DEPTH = 0.4;
const NET_POST = 0.5;

const GAME_POINTS = 21;
const MATCH_SMASH_TILTS = [-40, -34, -28, -22, -16, -10, -6];
const MATCH_SMASH_MAX_SPEED = 1800;
const MATCH_SMASH_INSET = 0.08;
const MATCH_SMASH_POST = 0.35;
const MATCH_DRIVE_TILTS = [15, 18, 21, 25];
const MATCH_DRIVE_MAX_SPEED = 1500;
const MATCH_DRIVE_POST = 0.5;
const MATCH_CLEAR_FLOOR_DEPTH = 0.35;
const MATCH_CLEAR_MIN_DEPTH = 0.7;
const MATCH_CLEAR_MAX_DEPTH = 0.9;
const MATCH_CLEAR_POST = 0.7;
const MATCH_DROP_TILTS = [30, 35, 40, 45, 50];
const MATCH_DROP_FLOOR_DEPTH = 0;
const MATCH_DROP_APEX = 0.4;
const MATCH_DROP_MIN_DEPTH = 0.1;
const MATCH_DROP_MAX_DEPTH = 0.3;
const MATCH_DROP_POST = 0.35;
const MATCH_NET_FLOOR_DEPTH = 0;
const MATCH_NET_MIN_DEPTH = 0.05;
const MATCH_NET_MAX_DEPTH = 0.2;
const MATCH_NET_POST = 0.35;
const MATCH_BEHIND_GAP = 75;
const MATCH_BACK_MARGIN = 14;
const MATCH_NET_ZONE = 0.5;
const MATCH_FRONT_DEPTH = 0.35;
const MATCH_DEEP_DEPTH = 0.55;
const MATCH_DEFEND_CLEAR = 0.7;
const MATCH_NET_CHANCE = 0.75;
const MATCH_DEEP_DROP = 0.6;
const MATCH_FRONT_CLEAR = 0.6;
const MATCH_MIX_DRIVE = 0.55;
const MATCH_MIX_DROP = 0.25;

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
const BOUNCE_RING_MIN_RADIUS = 3;
const BOUNCE_RING_MAX_RADIUS = 14;
const BOUNCE_RING_ALPHA = 0.35;
const MAX_RINGS = 2;
const STRETCH_DURATION = 0.14;
const STRETCH_ALONG = 1.35;
const STRETCH_ACROSS = 0.8;
const RECOIL_DURATION = 0.12;
const RECOIL_SCALE_X = 1.06;
const RECOIL_SCALE_Y = 0.92;
const KICK_DURATION = 0.06;
const KICK_DISTANCE = 1.5;

const CHEER_DURATION = 1.4;
const PUMP_RATE = 3;
const PUMP_LIFT = 5;
const PUMP_SWING = 0.15;
const HOP_HEIGHT = 10;
const HOP_SPEED = Math.sqrt(2 * GRAVITY * HOP_HEIGHT);
const HOP_REST = 0.1;
const HAPPY_EYE_RADIUS = 2.2;
const HAPPY_EYE_SPAN = 0.3;
const HAPPY_EYE_WIDTH = 1.4;

const SIDES = ["left", "right", "solo"];

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
    inkSoft: styles.getPropertyValue("--ink-soft").trim(),
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

function advanceBird(bird, dt, bounds) {
  integrate(bird, dt);
  let impact = null;
  if (bird.x < bounds.minX) {
    bird.x = bounds.minX;
    if (bird.vx < 0) bird.vx = -bird.vx * WALL_BOUNCE;
    impact = { x: bird.x, y: bird.y };
  } else if (bird.x > bounds.maxX) {
    bird.x = bounds.maxX;
    if (bird.vx > 0) bird.vx = -bird.vx * WALL_BOUNCE;
    impact = { x: bird.x, y: bird.y };
  }
  if (bird.y < bounds.minY) {
    bird.y = bounds.minY;
    if (bird.vy < 0) bird.vy = -bird.vy * WALL_BOUNCE;
    impact = { x: bird.x, y: bird.y };
  }
  return impact;
}

function velocityFor(angle, speed) {
  return { vx: Math.cos(angle) * speed, vy: -Math.sin(angle) * speed };
}

function absoluteAngle(tilt, facing) {
  return facing > 0 ? tilt : Math.PI - tilt;
}

function launchSpeedLimit(width) {
  return Math.max(MAX_LAUNCH_SPEED, LAUNCH_SPEED_PER_WIDTH * width);
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

function aimSpeedForLanding(court, origin, angle, facing, targetX, minSpeed, maxSpeed) {
  let low = typeof minSpeed === "number" ? minSpeed : MIN_LAUNCH_SPEED;
  let high = typeof maxSpeed === "number" ? maxSpeed : launchSpeedLimit(court.state.width);
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

function depthX(strip, facing, fraction) {
  const netEnd = facing > 0 ? strip.max : strip.min;
  const backEnd = facing > 0 ? strip.min : strip.max;
  return netEnd + fraction * (backEnd - netEnd);
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
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

function drillKindFor(bird) {
  return DRILL_SEQUENCE[bird.strikes % DRILL_SEQUENCE.length];
}

function opponentStrip(court, cat, floorDepth) {
  const opponent = court.opponentOf(cat);
  const strip = landingStrip(court, opponent);
  const floor = depthX(strip, opponent.facing, floorDepth);
  return { strip, facing: opponent.facing, floor };
}

function landsShort(landing, far) {
  if (landing === null) return true;
  return far.facing > 0
    ? landing > far.floor + AIM_TOLERANCE
    : landing < far.floor - AIM_TOLERANCE;
}

function bestArcShot(court, cat, tilts, origin, targetHeight, far, targetX) {
  let best = null;
  for (let i = 0; i < tilts.length; i += 1) {
    const angle = absoluteAngle((tilts[i] * Math.PI) / 180, cat.facing);
    const speed = aimSpeedForApex(origin, angle, targetHeight);
    const landing = landingForShot(court, origin, angle, speed);
    const error = landing === null ? Infinity : Math.abs(landing - targetX);
    if (best === null || error < best.error) best = { angle, speed, error, landing };
  }
  if (landsShort(best.landing, far)) return reachArcShot(court, cat, origin, far, targetX, best);
  return best;
}

function speedUnderCeiling(origin, tilt) {
  const headroom = origin.y - KEEP_UP_CEILING;
  return Math.sqrt(2 * GRAVITY * headroom) / Math.sin(tilt);
}

function flatArcShot(court, cat, origin, targetX, stayUnderCeiling, arced) {
  const limit = launchSpeedLimit(court.state.width);
  let best = arced;
  for (let i = 0; i < DRILL_REACH_TILTS.length; i += 1) {
    const tilt = (DRILL_REACH_TILTS[i] * Math.PI) / 180;
    const angle = absoluteAngle(tilt, cat.facing);
    const high = stayUnderCeiling
      ? clamp(speedUnderCeiling(origin, tilt), MIN_LAUNCH_SPEED, limit)
      : limit;
    const aim = aimSpeedForLanding(
      court,
      origin,
      angle,
      cat.facing,
      targetX,
      MIN_LAUNCH_SPEED,
      high
    );
    if (aim.error < best.error) best = { angle, speed: aim.speed, error: aim.error };
  }
  return best;
}

function reachArcShot(court, cat, origin, far, targetX, arced) {
  const under = flatArcShot(court, cat, origin, targetX, true, arced);
  if (!landsShort(landingForShot(court, origin, under.angle, under.speed), far)) return under;
  return flatArcShot(court, cat, origin, targetX, false, under);
}

function liftShot(court, cat) {
  const origin = court.reachPoint(cat);
  const far = opponentStrip(court, cat, LIFT_FLOOR_DEPTH);
  const targetX = depthX(far.strip, far.facing, randomBetween(LIFT_MIN_DEPTH, LIFT_MAX_DEPTH));
  const targetHeight = (origin.y - KEEP_UP_CEILING) * LIFT_APEX;
  const best = bestArcShot(court, cat, LIFT_TILTS, origin, targetHeight, far, targetX);
  return {
    angle: best.angle,
    speed: best.speed,
    kind: "lift",
    post: depthX(court.catRange(cat), cat.facing, LIFT_POST),
  };
}

function netShot(court, cat) {
  const origin = court.reachPoint(cat);
  const far = opponentStrip(court, cat, NET_FLOOR_DEPTH);
  const targetX = depthX(far.strip, far.facing, randomBetween(NET_MIN_DEPTH, NET_MAX_DEPTH));
  const targetHeight = randomBetween(NET_APEX_MIN, NET_APEX_MAX);
  const best = bestArcShot(court, cat, NET_TILTS, origin, targetHeight, far, targetX);
  return {
    angle: best.angle,
    speed: best.speed,
    kind: "net",
    post: depthX(court.catRange(cat), cat.facing, NET_POST),
  };
}

function smashShot(court, cat) {
  const origin = court.reachPoint(cat);
  const opponent = court.opponentOf(cat);
  const strip = landingStrip(court, opponent);
  const aimed = court.racketPoint(opponent).x + randomBetween(-SMASH_SPREAD, SMASH_SPREAD);
  const targetX = clamp(aimed, strip.min, strip.max);
  const limit = Math.max(SMASH_MAX_SPEED, launchSpeedLimit(court.state.width));
  let best = null;
  let steep = null;
  for (let i = 0; i < SMASH_TILTS.length; i += 1) {
    const angle = absoluteAngle((SMASH_TILTS[i] * Math.PI) / 180, cat.facing);
    const aim = aimSpeedForLanding(
      court,
      origin,
      angle,
      cat.facing,
      targetX,
      MIN_LAUNCH_SPEED,
      limit
    );
    if (best === null || aim.error < best.error) best = { angle, speed: aim.speed, error: aim.error };
    if (steep === null && aim.error <= SMASH_TOLERANCE) steep = { angle, speed: aim.speed };
  }
  const chosen = steep || best;
  return {
    angle: chosen.angle,
    speed: chosen.speed,
    kind: "smash",
    post: depthX(court.catRange(cat), cat.facing, SMASH_POST),
  };
}

function drillShot(court, cat, bird) {
  const kind = drillKindFor(bird);
  if (kind === "smash") return smashShot(court, cat);
  if (kind === "net") return netShot(court, cat);
  return liftShot(court, cat);
}

function drillStance(court, cat, bird) {
  return drillKindFor(bird) === "smash" ? "overhead" : "ground";
}

function opposingCats(court, cat) {
  const wanted = cat.side === "left" ? "right" : "left";
  const cats = court.state.cats;
  const found = [];
  for (let i = 0; i < cats.length; i += 1) {
    if (cats[i].side === wanted) found.push(cats[i]);
  }
  if (found.length === 0) found.push(court.opponentOf(cat));
  return found;
}

function guardXs(opponents) {
  const guards = [];
  for (let i = 0; i < opponents.length; i += 1) {
    guards.push(opponents[i].x + opponents[i].facing * RACKET_OFFSET_X);
  }
  return guards.sort((a, b) => a - b);
}

function gapFromGuards(x, guards) {
  let nearest = Infinity;
  for (let i = 0; i < guards.length; i += 1) {
    const distance = Math.abs(x - guards[i]);
    if (distance < nearest) nearest = distance;
  }
  return nearest;
}

function openCorner(strip, opponents) {
  const guards = guardXs(opponents);
  const candidates = [strip.min, strip.max];
  for (let i = 1; i < guards.length; i += 1) {
    candidates.push(clamp((guards[i - 1] + guards[i]) / 2, strip.min, strip.max));
  }
  let best = candidates[0];
  let bestGap = -Infinity;
  for (let i = 0; i < candidates.length; i += 1) {
    const gap = gapFromGuards(candidates[i], guards);
    if (gap > bestGap) {
      bestGap = gap;
      best = candidates[i];
    }
  }
  return best;
}

function deepestGuard(guards, facing) {
  let deepest = guards[0];
  for (let i = 1; i < guards.length; i += 1) {
    const farther = facing > 0 ? guards[i] < deepest : guards[i] > deepest;
    if (farther) deepest = guards[i];
  }
  return deepest;
}

function behindGuards(court, guards, facing) {
  const away = facing > 0 ? -1 : 1;
  const edge = away > 0 ? court.state.width - MATCH_BACK_MARGIN : MATCH_BACK_MARGIN;
  const wanted = deepestGuard(guards, facing) + away * MATCH_BEHIND_GAP;
  return away > 0 ? Math.min(wanted, edge) : Math.max(wanted, edge);
}

function attackCorner(court, strip, opponents) {
  const guards = guardXs(opponents);
  const behind = behindGuards(court, guards, opponents[0].facing);
  const corner = openCorner(strip, opponents);
  return gapFromGuards(behind, guards) > gapFromGuards(corner, guards) ? behind : corner;
}

function insetFromEnd(strip, x, fraction) {
  if (x !== strip.min && x !== strip.max) return x;
  const middle = (strip.min + strip.max) / 2;
  return x + Math.sign(middle - x) * (strip.max - strip.min) * fraction;
}

function bandTarget(far, opponents, minDepth, maxDepth) {
  const near = depthX(far.strip, far.facing, minDepth);
  const deep = depthX(far.strip, far.facing, maxDepth);
  const corner = openCorner(far.strip, opponents);
  return clamp(corner, Math.min(near, deep), Math.max(near, deep));
}

function depthOf(court, cat) {
  const range = court.catRange(cat);
  const netEnd = cat.facing > 0 ? range.max : range.min;
  const backEnd = cat.facing > 0 ? range.min : range.max;
  if (netEnd === backEnd) return 0;
  return clamp((cat.x - netEnd) / (backEnd - netEnd), 0, 1);
}

function frontDepthOf(court, opponents) {
  let front = 1;
  for (let i = 0; i < opponents.length; i += 1) {
    const depth = depthOf(court, opponents[i]);
    if (depth < front) front = depth;
  }
  return front;
}

function matchPost(court, cat, depth) {
  return depthX(court.catRange(cat), cat.facing, depth);
}

function matchSmash(court, cat, opponents) {
  const origin = court.reachPoint(cat);
  const strip = landingStrip(court, opponents[0]);
  const targetX = insetFromEnd(strip, attackCorner(court, strip, opponents), MATCH_SMASH_INSET);
  const limit = Math.max(MATCH_SMASH_MAX_SPEED, launchSpeedLimit(court.state.width));
  let best = null;
  let steep = null;
  for (let i = 0; i < MATCH_SMASH_TILTS.length; i += 1) {
    const angle = absoluteAngle((MATCH_SMASH_TILTS[i] * Math.PI) / 180, cat.facing);
    const aim = aimSpeedForLanding(
      court,
      origin,
      angle,
      cat.facing,
      targetX,
      MIN_LAUNCH_SPEED,
      limit
    );
    if (best === null || aim.error < best.error) best = { angle, speed: aim.speed, error: aim.error };
    if (steep === null && aim.error <= SMASH_TOLERANCE) steep = { angle, speed: aim.speed };
  }
  const chosen = steep || best;
  return {
    angle: chosen.angle,
    speed: chosen.speed,
    kind: "smash",
    post: matchPost(court, cat, MATCH_SMASH_POST),
  };
}

function matchDrive(court, cat, opponents) {
  const origin = court.reachPoint(cat);
  const strip = landingStrip(court, opponents[0]);
  const targetX = attackCorner(court, strip, opponents);
  const limit = Math.max(MATCH_DRIVE_MAX_SPEED, launchSpeedLimit(court.state.width));
  let best = null;
  for (let i = 0; i < MATCH_DRIVE_TILTS.length; i += 1) {
    const angle = absoluteAngle((MATCH_DRIVE_TILTS[i] * Math.PI) / 180, cat.facing);
    const aim = aimSpeedForLanding(
      court,
      origin,
      angle,
      cat.facing,
      targetX,
      MIN_LAUNCH_SPEED,
      limit
    );
    if (best === null || aim.error < best.error) best = { angle, speed: aim.speed, error: aim.error };
  }
  return {
    angle: best.angle,
    speed: best.speed,
    kind: "drive",
    post: matchPost(court, cat, MATCH_DRIVE_POST),
  };
}

function matchClear(court, cat) {
  const origin = court.reachPoint(cat);
  const far = opponentStrip(court, cat, MATCH_CLEAR_FLOOR_DEPTH);
  const depth = randomBetween(MATCH_CLEAR_MIN_DEPTH, MATCH_CLEAR_MAX_DEPTH);
  const targetX = depthX(far.strip, far.facing, depth);
  const targetHeight = (origin.y - KEEP_UP_CEILING) * LIFT_APEX;
  const best = bestArcShot(court, cat, LIFT_TILTS, origin, targetHeight, far, targetX);
  return {
    angle: best.angle,
    speed: best.speed,
    kind: "clear",
    post: matchPost(court, cat, MATCH_CLEAR_POST),
  };
}

function matchDrop(court, cat, opponents) {
  const origin = court.reachPoint(cat);
  const far = opponentStrip(court, cat, MATCH_DROP_FLOOR_DEPTH);
  const targetX = bandTarget(far, opponents, MATCH_DROP_MIN_DEPTH, MATCH_DROP_MAX_DEPTH);
  const targetHeight = (origin.y - KEEP_UP_CEILING) * MATCH_DROP_APEX;
  const best = bestArcShot(court, cat, MATCH_DROP_TILTS, origin, targetHeight, far, targetX);
  return {
    angle: best.angle,
    speed: best.speed,
    kind: "drop",
    post: matchPost(court, cat, MATCH_DROP_POST),
  };
}

function matchNetShot(court, cat, opponents) {
  const origin = court.reachPoint(cat);
  const far = opponentStrip(court, cat, MATCH_NET_FLOOR_DEPTH);
  const targetX = bandTarget(far, opponents, MATCH_NET_MIN_DEPTH, MATCH_NET_MAX_DEPTH);
  const targetHeight = randomBetween(NET_APEX_MIN, NET_APEX_MAX);
  const best = bestArcShot(court, cat, NET_TILTS, origin, targetHeight, far, targetX);
  return {
    angle: best.angle,
    speed: best.speed,
    kind: "net",
    post: matchPost(court, cat, MATCH_NET_POST),
  };
}

function chooseMatchKind(court, cat, bird, opponents) {
  const catDepth = depthOf(court, cat);
  const frontDepth = frontDepthOf(court, opponents);
  const roll = Math.random();
  if (bird.shot === "smash") {
    if (catDepth <= MATCH_NET_ZONE && roll >= MATCH_DEFEND_CLEAR) return "net";
    return "clear";
  }
  if (catDepth <= MATCH_NET_ZONE && frontDepth >= MATCH_DEEP_DEPTH) {
    return roll < MATCH_NET_CHANCE ? "net" : "drive";
  }
  if (catDepth >= MATCH_DEEP_DEPTH && frontDepth >= MATCH_DEEP_DEPTH) {
    return roll < MATCH_DEEP_DROP ? "drop" : "drive";
  }
  if (frontDepth <= MATCH_FRONT_DEPTH) {
    return roll < MATCH_FRONT_CLEAR ? "clear" : "drive";
  }
  if (roll < MATCH_MIX_DRIVE) return "drive";
  if (roll < MATCH_MIX_DRIVE + MATCH_MIX_DROP) return "drop";
  return "clear";
}

function matchShot(court, cat, bird) {
  const opponents = opposingCats(court, cat);
  if (cat.stance === "overhead") return matchSmash(court, cat, opponents);
  const kind = chooseMatchKind(court, cat, bird, opponents);
  if (kind === "clear") return matchClear(court, cat);
  if (kind === "drop") return matchDrop(court, cat, opponents);
  if (kind === "net") return matchNetShot(court, cat, opponents);
  return matchDrive(court, cat, opponents);
}

function smashOn(court, cat, bird) {
  if (cat.rise > 0) return true;
  const height = court.groundY() - OVERHEAD_HEIGHT - JUMP_HEIGHT;
  const crossing = court.predictCrossingAt(bird, height);
  if (crossing === null) return false;
  const range = court.catRange(cat);
  const target = clamp(crossing.x - cat.facing * OVERHEAD_OFFSET_X, range.min, range.max);
  return Math.abs(target - cat.x) / court.state.movement.maxSpeed <= crossing.time;
}

function matchStance(court, cat, bird) {
  return smashOn(court, cat, bird) ? "overhead" : "ground";
}

function groundStance() {
  return "ground";
}

const SHOT_STRATEGIES = {
  rally: { shot: rallyShot, stance: groundStance },
  keepUps: { shot: keepUpShot, stance: groundStance },
  drill: { shot: drillShot, stance: drillStance },
  match: { shot: matchShot, stance: matchStance },
};

function resolveStrategy(choice) {
  if (typeof choice === "function") return { shot: choice, stance: groundStance };
  if (choice && typeof choice.shot === "function") {
    const stance = typeof choice.stance === "function" ? choice.stance : groundStance;
    return { shot: choice.shot, stance };
  }
  return SHOT_STRATEGIES[choice] || SHOT_STRATEGIES.rally;
}

function isCheering(state, cat) {
  if (!state.celebration || !cat.cheer) return false;
  if (cat.side !== state.celebration.side) return false;
  return cat.receiving === null;
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

function drawCat(ctx, cat, ground, colors, state) {
  const swing = Math.pow(cat.swing, SWING_SNAP);
  const recoil = decay(progress(cat.recoilElapsed, RECOIL_DURATION));
  const cheering = isCheering(state, cat);
  const pumping = cheering && cat.cheer === "pump";
  const pump = pumping ? (1 - Math.cos(state.simTime * PUMP_RATE * Math.PI * 2)) / 2 : 0;
  const restAngle = cat.stance === "overhead" ? OVERHEAD_ANGLE : RACKET_REST_ANGLE;
  const racketAngle = pumping
    ? OVERHEAD_ANGLE + PUMP_SWING * pump
    : restAngle + (cat.swingFrom - restAngle) * swing;
  ctx.save();
  ctx.translate(cat.x, ground - cat.rise);
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

  if (cheering) {
    ctx.lineWidth = HAPPY_EYE_WIDTH;
    ctx.beginPath();
    ctx.arc(4, -31, HAPPY_EYE_RADIUS, Math.PI + HAPPY_EYE_SPAN, Math.PI * 2 - HAPPY_EYE_SPAN);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(10, -31, HAPPY_EYE_RADIUS, Math.PI + HAPPY_EYE_SPAN, Math.PI * 2 - HAPPY_EYE_SPAN);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(4, -31, 1.2, 0, Math.PI * 2);
    ctx.arc(10, -31, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(12, -28); ctx.lineTo(20, -30);
  ctx.moveTo(12, -26); ctx.lineTo(20, -25);
  ctx.stroke();

  ctx.translate(12, -18 - PUMP_LIFT * pump);
  ctx.rotate(racketAngle);
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
    const radius = ring.minRadius + (ring.maxRadius - ring.minRadius) * easeOut(p);
    ctx.globalAlpha = ring.alpha * (1 - p * p);
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function createCourt(canvas, options) {
  const settings = options || {};
  const ctx = canvas.getContext("2d");
  const strategy = resolveStrategy(settings.chooseShot);
  const chooseShot = strategy.shot;
  const chooseStance = strategy.stance;
  const paceOf = settings.timeScale || (() => 1);
  const movement = settings.movement || {};
  const speedFactor = typeof movement.speed === "number" ? movement.speed : 1;
  const accelFactor = typeof movement.accel === "number" ? movement.accel : 1;

  const state = {
    width: 0,
    height: 0,
    pointer: null,
    cats: [],
    birds: [],
    teams: { left: 0, right: 0, solo: 0 },
    movement: { maxSpeed: CAT_MAX_SPEED * speedFactor, accel: CAT_ACCEL * accelFactor },
    score: { left: 0, right: 0, server: null, winner: null },
    effects: [],
    kick: null,
    celebration: null,
    timeScale: 1,
    simTime: 0,
    hitStop: 0,
    gate: 0,
    hits: 0,
    misses: 0,
    lastTime: 0,
    frameId: 0,
    get bird() {
      const first = state.birds[0];
      return first && first.inPlay ? first : null;
    },
    set bird(value) {
      if (!value) {
        if (state.birds[0]) retire(state.birds[0]);
        return;
      }
      if (state.birds.length) state.birds[0] = adopt(value);
      else state.birds.push(adopt(value));
    },
  };

  function groundY() {
    return state.height - GROUND_MARGIN;
  }

  function racketY() {
    return groundY() - RACKET_HEIGHT;
  }

  function span(min, max) {
    if (min > max) {
      const middle = (min + max) / 2;
      return { min: middle, max: middle };
    }
    return { min, max };
  }

  function rangeForSide(side) {
    const netX = state.width / 2;
    if (side === "left") return span(CAT_INSET, netX - CAT_NET_GAP);
    if (side === "right") return span(netX + CAT_NET_GAP, state.width - CAT_INSET);
    return span(CAT_INSET, state.width - CAT_INSET);
  }

  function catRange(cat) {
    return rangeForSide(cat.side);
  }

  function sideOf(spec) {
    if (SIDES.indexOf(spec.side) >= 0) return spec.side;
    return "solo";
  }

  function createCat(spec) {
    const side = sideOf(spec);
    const cat = {
      side,
      slot: 0,
      index: 0,
      x: 0,
      vx: 0,
      facing: side === "right" ? -1 : 1,
      facesBird: spec.facesBird === undefined ? side === "solo" : spec.facesBird === true,
      target: 0,
      home: 0,
      post: null,
      stance: "ground",
      rise: 0,
      riseSpeed: 0,
      groundedFor: 0,
      cheer: null,
      swing: 0,
      swingFrom: RACKET_REST_ANGLE - SWING_ARC,
      swingElapsed: SWING_DURATION,
      recoilElapsed: RECOIL_DURATION,
      receiving: null,
    };
    if (spec.facing === 1 || spec.facing === -1) cat.facing = spec.facing;
    return cat;
  }

  function placeCat(cat) {
    const range = catRange(cat);
    const peers = Math.max(1, state.teams[cat.side]);
    cat.home = range.min + ((cat.slot + 0.5) / peers) * (range.max - range.min);
    if (cat.x < range.min) {
      cat.x = range.min;
      cat.vx = 0;
    } else if (cat.x > range.max) {
      cat.x = range.max;
      cat.vx = 0;
    }
    cat.target = clamp(cat.target, range.min, range.max);
    if (cat.post !== null) cat.post = clamp(cat.post, range.min, range.max);
  }

  function layoutCats() {
    const counts = { left: 0, right: 0, solo: 0 };
    for (let i = 0; i < state.cats.length; i += 1) {
      const cat = state.cats[i];
      cat.index = i;
      cat.slot = counts[cat.side];
      counts[cat.side] += 1;
    }
    state.teams = counts;
    for (let i = 0; i < state.cats.length; i += 1) placeCat(state.cats[i]);
  }

  function fillingSide() {
    if (state.teams.solo > 0) return "solo";
    return state.teams.left <= state.teams.right ? "left" : "right";
  }

  function crowdedSide() {
    if (state.teams.solo > 0) return "solo";
    return state.teams.right >= state.teams.left ? "right" : "left";
  }

  function addCat(side) {
    const cat = createCat({ side: side || fillingSide() });
    state.cats.push(cat);
    layoutCats();
    cat.x = cat.home;
    cat.target = cat.home;
    cat.vx = 0;
    return cat;
  }

  function removeCat(side) {
    const wanted = side || crowdedSide();
    for (let i = state.cats.length - 1; i >= 0; i -= 1) {
      if (state.cats[i].side !== wanted) continue;
      const gone = state.cats.splice(i, 1)[0];
      for (let b = 0; b < state.birds.length; b += 1) {
        if (state.birds[b].receiver === gone) state.birds[b].receiver = null;
        if (state.birds[b].keeper === gone) state.birds[b].keeper = null;
        if (state.birds[b].striker === gone) state.birds[b].striker = null;
      }
      layoutCats();
      return gone;
    }
    return null;
  }

  function setTeams(counts) {
    for (let i = 0; i < SIDES.length; i += 1) {
      const side = SIDES[i];
      const wanted = counts[side];
      if (typeof wanted !== "number") continue;
      while (state.teams[side] < wanted) addCat(side);
      while (state.teams[side] > wanted) removeCat(side);
    }
    return state.teams;
  }

  function racketPoint(cat) {
    return { x: cat.x + cat.facing * RACKET_OFFSET_X, y: racketY() };
  }

  function reachPoint(cat) {
    if (cat.stance === "overhead") {
      return {
        x: cat.x + cat.facing * OVERHEAD_OFFSET_X,
        y: groundY() - OVERHEAD_HEIGHT - cat.rise,
      };
    }
    return { x: cat.x + cat.facing * RACKET_OFFSET_X, y: racketY() - cat.rise };
  }

  function reachHeightFor(cat) {
    if (cat.stance === "overhead") return groundY() - OVERHEAD_HEIGHT - JUMP_HEIGHT;
    return racketY();
  }

  function opponentOf(cat) {
    const wanted = cat.side === "left" ? "right" : "left";
    for (let i = 0; i < state.cats.length; i += 1) {
      if (state.cats[i].side === wanted) return state.cats[i];
    }
    for (let i = 0; i < state.cats.length; i += 1) {
      if (state.cats[i] !== cat) return state.cats[i];
    }
    return cat;
  }

  function birdBounds() {
    return { minX: BIRD_RADIUS, maxX: state.width - BIRD_RADIUS, minY: BIRD_RADIUS };
  }

  function predictCrossingAt(source, targetY) {
    const bounds = birdBounds();
    const probe = { x: source.x, y: source.y, vx: source.vx, vy: source.vy };
    const steps = Math.ceil(PREDICT_HORIZON / PREDICT_STEP);
    for (let i = 0; i < steps; i += 1) {
      const prevX = probe.x;
      const prevY = probe.y;
      advanceBird(probe, PREDICT_STEP, bounds);
      if (probe.vy > 0 && prevY < targetY && probe.y >= targetY) {
        const reach = probe.y - prevY;
        const fraction = reach === 0 ? 0 : (targetY - prevY) / reach;
        return {
          x: prevX + (probe.x - prevX) * fraction,
          time: (i + fraction) * PREDICT_STEP,
        };
      }
    }
    return null;
  }

  function predictCrossing(source) {
    return predictCrossingAt(source, racketY());
  }

  function predictLandingX(source) {
    const crossing = predictCrossing(source);
    return crossing === null ? null : crossing.x;
  }

  function makeBird() {
    return {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      inPlay: false,
      holdUntil: 0,
      respawnAt: 0,
      stretchElapsed: STRETCH_DURATION,
      strikes: 0,
      shot: null,
      crossing: null,
      receiver: null,
      keeper: null,
      striker: null,
    };
  }

  function adopt(source) {
    const bird = makeBird();
    const keys = Object.keys(source);
    for (let i = 0; i < keys.length; i += 1) bird[keys[i]] = source[keys[i]];
    bird.inPlay = true;
    return bird;
  }

  function serve(bird) {
    if (state.score.winner) {
      state.score.left = 0;
      state.score.right = 0;
      state.score.winner = null;
    }
    const placement = settings.initialBird(state);
    bird.x = placement.x;
    bird.y = placement.y;
    bird.vx = placement.vx || 0;
    bird.vy = placement.vy || 0;
    bird.stretchElapsed = STRETCH_DURATION;
    bird.holdUntil = state.simTime + (placement.hold || 0);
    bird.respawnAt = 0;
    bird.strikes = 0;
    bird.shot = null;
    bird.striker = null;
    bird.crossing = null;
    bird.receiver = null;
    bird.keeper = null;
    bird.inPlay = true;
    return bird;
  }

  function anyBirdInPlay() {
    for (let i = 0; i < state.birds.length; i += 1) {
      if (state.birds[i].inPlay) return true;
    }
    return false;
  }

  function clearPosts() {
    for (let i = 0; i < state.cats.length; i += 1) state.cats[i].post = null;
  }

  function celebrate(bird) {
    if (anyBirdInPlay()) return false;
    clearPosts();
    if (state.teams.left < 1 || state.teams.right < 1) return false;
    const side = bird.x < state.width / 2 ? "right" : "left";
    state.score[side] += 1;
    state.score.server = side;
    if (state.score[side] >= GAME_POINTS) state.score.winner = side;
    state.celebration = { side, until: state.simTime + CHEER_DURATION };
    for (let i = 0; i < state.cats.length; i += 1) {
      const cat = state.cats[i];
      if (cat.side !== side) continue;
      cat.cheer = Math.random() < 0.5 ? "pump" : "hop";
      cat.groundedFor = 0;
      cat.vx = 0;
      cat.target = cat.x;
    }
    return true;
  }

  function ageCelebration() {
    if (!state.celebration || state.simTime < state.celebration.until) return;
    state.celebration = null;
    for (let i = 0; i < state.cats.length; i += 1) state.cats[i].cheer = null;
  }

  function retire(bird) {
    if (!bird.inPlay) return;
    bird.inPlay = false;
    bird.crossing = null;
    bird.receiver = null;
    bird.keeper = null;
    const cheered = celebrate(bird);
    bird.respawnAt = state.simTime + (cheered ? CHEER_DURATION : RESPAWN_DELAY);
    state.misses += 1;
    if (settings.onMiss) settings.onMiss(court);
  }

  function addBird() {
    const bird = makeBird();
    state.birds.push(bird);
    serve(bird);
    return bird;
  }

  function removeBird() {
    const gone = state.birds.pop();
    if (!gone) return null;
    if (gone.receiver) gone.receiver.receiving = null;
    return gone;
  }

  function isHeld(bird) {
    return state.simTime < bird.holdUntil || state.simTime < state.gate;
  }

  function addRing(x, y, minRadius, maxRadius, alpha) {
    state.effects.push({ x, y, elapsed: 0, minRadius, maxRadius, alpha });
    const cap = MAX_RINGS * Math.max(1, state.birds.length);
    while (state.effects.length > cap) state.effects.shift();
  }

  function strike(cat, bird) {
    const origin = reachPoint(cat);
    const shot = chooseShot(court, cat, bird);
    const range = catRange(cat);
    bird.strikes += 1;
    bird.shot = typeof shot.kind === "string" ? shot.kind : null;
    cat.swingFrom = cat.stance === "overhead" ? SMASH_FOLLOW_THROUGH : RACKET_REST_ANGLE - SWING_ARC;
    cat.post = typeof shot.post === "number" ? clamp(shot.post, range.min, range.max) : null;
    bird.striker = cat;
    const velocity = velocityFor(shot.angle, shot.speed);
    bird.x = origin.x;
    bird.y = origin.y;
    bird.vx = velocity.vx;
    bird.vy = velocity.vy;
    bird.stretchElapsed = 0;
    cat.swing = 1;
    cat.swingElapsed = 0;
    cat.recoilElapsed = 0;
    addRing(origin.x, origin.y, RING_MIN_RADIUS, RING_MAX_RADIUS, RING_ALPHA);
    const speed = Math.hypot(velocity.vx, velocity.vy) || 1;
    state.kick = {
      x: (-velocity.vx / speed) * KICK_DISTANCE,
      y: (-velocity.vy / speed) * KICK_DISTANCE,
      elapsed: 0,
    };
    state.hits += 1;
    state.hitStop = HIT_STOP;
  }

  function racketTargetFor(cat, x) {
    const range = catRange(cat);
    const offset = cat.stance === "overhead" ? OVERHEAD_OFFSET_X : RACKET_OFFSET_X;
    return clamp(x - cat.facing * offset, range.min, range.max);
  }

  function arrivalTime(cat, x) {
    const delta = racketTargetFor(cat, x) - cat.x;
    const travel = Math.abs(delta) / state.movement.maxSpeed;
    const turning = cat.vx * delta < 0 && Math.abs(cat.vx) > TURN_DRIFT;
    return turning ? travel + TURN_PENALTY : travel;
  }

  function readyCats(crossing) {
    const side = crossing.x < state.width / 2 ? "left" : "right";
    const ready = [];
    for (let i = 0; i < state.cats.length; i += 1) {
      const cat = state.cats[i];
      if (cat.receiving) continue;
      if (cat.side !== "solo" && cat.side !== side) continue;
      ready.push({ cat, time: arrivalTime(cat, crossing.x) });
    }
    return ready;
  }

  function freeCatFor(bird) {
    const ready = readyCats(bird.crossing);
    let bestTime = Infinity;
    for (let i = 0; i < ready.length; i += 1) {
      if (ready[i].time < bestTime) bestTime = ready[i].time;
    }
    let choice = null;
    for (let i = 0; i < ready.length; i += 1) {
      if (ready[i].time > bestTime + ARRIVAL_TIE) continue;
      if (ready[i].cat === bird.keeper) return ready[i].cat;
      if (choice === null) choice = ready[i].cat;
    }
    return choice;
  }

  function updateAssignments() {
    const waiting = [];
    for (let i = 0; i < state.birds.length; i += 1) {
      const bird = state.birds[i];
      bird.keeper = bird.receiver;
      bird.receiver = null;
      bird.crossing = bird.inPlay && !isHeld(bird) ? predictCrossing(bird) : null;
      if (bird.crossing) waiting.push(bird);
    }
    for (let i = 0; i < state.cats.length; i += 1) state.cats[i].receiving = null;
    waiting.sort((a, b) => a.crossing.time - b.crossing.time);
    for (let i = 0; i < waiting.length; i += 1) {
      const bird = waiting[i];
      const cat = freeCatFor(bird);
      if (!cat) continue;
      cat.receiving = bird;
      bird.receiver = cat;
    }
    untangle();
    applyStances();
  }

  function applyStances() {
    for (let i = 0; i < state.cats.length; i += 1) {
      const cat = state.cats[i];
      if (!cat.receiving) {
        cat.stance = "ground";
        continue;
      }
      const bird = cat.receiving;
      cat.stance = chooseStance(court, cat, bird) === "overhead" ? "overhead" : "ground";
      if (cat.stance !== "overhead") continue;
      const raised = predictCrossingAt(bird, reachHeightFor(cat));
      if (raised) bird.crossing = raised;
    }
  }

  function untangle() {
    const cats = state.cats;
    for (let pass = 0; pass < cats.length; pass += 1) {
      let swapped = false;
      for (let i = 0; i < cats.length; i += 1) {
        for (let j = i + 1; j < cats.length; j += 1) {
          const near = cats[i];
          const far = cats[j];
          if (near.side !== far.side || !near.receiving || !far.receiving) continue;
          const order = (near.x - far.x) * (near.receiving.crossing.x - far.receiving.crossing.x);
          if (order >= 0) continue;
          const bird = near.receiving;
          near.receiving = far.receiving;
          far.receiving = bird;
          near.receiving.receiver = near;
          far.receiving.receiver = far;
          swapped = true;
        }
      }
      if (!swapped) return;
    }
  }

  function aimCats() {
    for (let i = 0; i < state.cats.length; i += 1) {
      const cat = state.cats[i];
      if (cat.receiving) cat.target = racketTargetFor(cat, cat.receiving.crossing.x);
      else if (isCheering(state, cat)) cat.target = cat.x;
      else if (cat.post !== null) cat.target = cat.post;
      else cat.target = cat.home;
    }
  }

  function byPriority(a, b) {
    const claimed = (a.receiving ? 0 : 1) - (b.receiving ? 0 : 1);
    if (claimed !== 0) return claimed;
    return a.index - b.index;
  }

  function sideSign(held, mover) {
    if (Math.abs(mover.x - held.x) > CAT_SPACING / 2) return Math.sign(mover.x - held.x);
    if (mover.home !== held.home) return Math.sign(mover.home - held.home);
    return mover.index >= held.index ? 1 : -1;
  }

  function passingLane(held, mover) {
    if (Math.abs(held.vx) <= TURN_DRIFT) return 0;
    const lead = Math.sign(held.vx);
    return (held.target - mover.x) * lead > 0 ? -lead : 0;
  }

  function roomOn(anchor, away, range) {
    return away > 0 ? range.max - anchor : anchor - range.min;
  }

  function withRoom(anchor, away, range) {
    return roomOn(anchor, away, range) >= CAT_SPACING ? away : -away;
  }

  function crowds(a, b) {
    return Math.abs(a - b) < CAT_SPACING;
  }

  function clearOf(mover, anchor, away, range) {
    const clear = anchor + away * CAT_SPACING;
    const kept = away > 0 ? Math.max(mover.target, clear) : Math.min(mover.target, clear);
    return clamp(kept, range.min, range.max);
  }

  function separate(held, mover) {
    const range = catRange(mover);
    if (crowds(mover.target, held.target)) {
      const formation = withRoom(held.target, sideSign(held, mover), range);
      mover.target = clearOf(mover, held.target, formation, range);
    }
    if (!crowds(mover.x, held.x)) return;
    const lane = passingLane(held, mover);
    if (lane === 0 && !crowds(mover.target, held.x)) return;
    const dodge = lane !== 0 ? lane : withRoom(held.x, sideSign(held, mover), range);
    mover.target = clearOf(mover, held.x, dodge, range);
  }

  function spaceTeammates() {
    const order = state.cats.slice().sort(byPriority);
    for (let j = 1; j < order.length; j += 1) {
      for (let round = 0; round < SPACING_ROUNDS; round += 1) {
        let shifted = false;
        for (let i = 0; i < j; i += 1) {
          if (order[i].side !== order[j].side) continue;
          const before = order[j].target;
          separate(order[i], order[j]);
          if (order[j].target !== before) shifted = true;
        }
        if (!shifted) break;
      }
    }
  }

  function nearestBirdX(cat) {
    let best = null;
    let bestDistance = Infinity;
    for (let i = 0; i < state.birds.length; i += 1) {
      const bird = state.birds[i];
      if (!bird.inPlay) continue;
      const distance = Math.abs(bird.x - cat.x);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = bird.x;
      }
    }
    return best;
  }

  function faceCat(cat) {
    if (!cat.facesBird) return;
    const focus = cat.receiving ? cat.receiving.crossing.x : nearestBirdX(cat);
    if (focus === null) return;
    if (focus > cat.x + FACING_MARGIN) cat.facing = 1;
    else if (focus < cat.x - FACING_MARGIN) cat.facing = -1;
  }

  function wantsJump(cat) {
    if (cat.stance !== "overhead" || !cat.receiving) return false;
    if (cat.receiving.crossing.time > JUMP_RISE_TIME) return false;
    return Math.abs(cat.target - cat.x) <= JUMP_ALIGNMENT;
  }

  function raiseCat(cat, dt) {
    if (cat.rise > 0 || cat.riseSpeed !== 0) {
      cat.riseSpeed -= GRAVITY * dt;
      cat.rise += cat.riseSpeed * dt;
      if (cat.rise <= 0) {
        cat.rise = 0;
        cat.riseSpeed = 0;
        cat.groundedFor = 0;
      }
      return;
    }
    cat.groundedFor += dt;
    if (wantsJump(cat)) {
      cat.riseSpeed = JUMP_SPEED;
      cat.groundedFor = 0;
      return;
    }
    if (cat.cheer === "hop" && isCheering(state, cat) && cat.groundedFor >= HOP_REST) {
      cat.riseSpeed = HOP_SPEED;
      cat.groundedFor = 0;
    }
  }

  function moveCat(cat, dt) {
    const range = catRange(cat);
    if (cat.rise <= 0) {
      const delta = cat.target - cat.x;
      const direction = Math.sign(delta);
      const desired = clamp(
        direction * Math.sqrt(2 * state.movement.accel * Math.abs(delta)),
        -state.movement.maxSpeed,
        state.movement.maxSpeed
      );
      cat.vx += clamp(desired - cat.vx, -state.movement.accel * dt, state.movement.accel * dt);
    }
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
    const bounds = birdBounds();
    const pushedX = state.pointer.canvasX + nx * (POINTER_RADIUS + BIRD_RADIUS);
    const pushedY = state.pointer.canvasY + ny * (POINTER_RADIUS + BIRD_RADIUS);
    const againstWall = pushedX < bounds.minX || pushedX > bounds.maxX;
    const againstCeiling = pushedY < bounds.minY;
    if (againstWall || againstCeiling) {
      slideAlongBoundary(bird, againstWall);
      return;
    }
    bird.x = pushedX;
    bird.y = pushedY;
    const along = bird.vx * nx + bird.vy * ny;
    if (along < KNOCK_SPEED) {
      const boost = KNOCK_SPEED - along;
      bird.vx += nx * boost;
      bird.vy += ny * boost;
    }
  }

  function slideAlongBoundary(bird, againstWall) {
    if (againstWall) {
      bird.vy = Math.max(bird.vy, KNOCK_SPEED);
      return;
    }
    const away = bird.x >= state.pointer.canvasX ? 1 : -1;
    bird.vx = away * Math.max(Math.abs(bird.vx), KNOCK_SPEED);
  }

  function tryStrikes(bird) {
    const descending = bird.vy > 0;
    for (let i = 0; i < state.cats.length; i += 1) {
      const cat = state.cats[i];
      const point = reachPoint(cat);
      if (Math.hypot(bird.x - point.x, bird.y - point.y) > RACKET_REACH) {
        if (bird.striker === cat) bird.striker = null;
        continue;
      }
      if (!descending || bird.striker === cat) continue;
      strike(cat, bird);
      return;
    }
  }

  function ageEffects(dt) {
    for (let i = 0; i < state.cats.length; i += 1) {
      const cat = state.cats[i];
      cat.swingElapsed += dt;
      cat.recoilElapsed += dt;
      cat.swing = decay(progress(cat.swingElapsed, SWING_DURATION));
    }
    for (let i = 0; i < state.birds.length; i += 1) state.birds[i].stretchElapsed += dt;
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
    ageCelebration();
    updateAssignments();
    for (let i = 0; i < state.cats.length; i += 1) faceCat(state.cats[i]);
    aimCats();
    spaceTeammates();
    for (let i = 0; i < state.cats.length; i += 1) {
      raiseCat(state.cats[i], dt);
      moveCat(state.cats[i], dt);
    }

    const bounds = birdBounds();
    const floor = groundY() - BIRD_RADIUS;
    for (let i = 0; i < state.birds.length; i += 1) {
      const bird = state.birds[i];
      if (!bird.inPlay) {
        if (state.simTime >= bird.respawnAt) serve(bird);
        continue;
      }
      if (isHeld(bird)) continue;
      const impact = advanceBird(bird, dt, bounds);
      if (impact) {
        addRing(
          impact.x,
          impact.y,
          BOUNCE_RING_MIN_RADIUS,
          BOUNCE_RING_MAX_RADIUS,
          BOUNCE_RING_ALPHA
        );
      }
      pointerKnock(bird);
      tryStrikes(bird);
      if (bird.y >= floor) retire(bird);
    }
  }

  function step(realDt) {
    state.timeScale = paceOf();
    if (state.hitStop > 0) {
      state.hitStop = Math.max(0, state.hitStop - realDt);
      return;
    }
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
    const ground = groundY();
    const lineup = state.cats.slice().sort((a, b) => a.x - b.x);
    ctx.clearRect(0, 0, state.width, state.height);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    drawGround(ctx, state, colors);
    if (settings.drawBackdrop) settings.drawBackdrop(ctx, state, colors);
    for (let i = 0; i < lineup.length; i += 1) drawCat(ctx, lineup[i], ground, colors, state);
    for (let i = 0; i < state.birds.length; i += 1) {
      if (state.birds[i].inPlay) drawBird(ctx, state.birds[i], colors);
    }
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
    state.gate = state.simTime;
    for (let i = 0; i < state.birds.length; i += 1) {
      state.birds[i].holdUntil = Math.min(state.birds[i].holdUntil, state.simTime);
    }
  }

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    state.width = rect.width;
    state.height = rect.height;
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    layoutCats();
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
    reachPoint,
    catRange,
    opponentOf,
    predictLandingX,
    predictCrossing,
    predictCrossingAt,
    addCat,
    removeCat,
    setTeams,
    addBird,
    removeBird,
  };

  function buildCats() {
    if (Array.isArray(settings.cats)) {
      for (let i = 0; i < settings.cats.length; i += 1) {
        state.cats.push(createCat(settings.cats[i]));
      }
    } else {
      const teams = settings.teams || { left: 1, right: 1 };
      for (let i = 0; i < SIDES.length; i += 1) {
        const side = SIDES[i];
        const wanted = teams[side] || 0;
        for (let k = 0; k < wanted; k += 1) state.cats.push(createCat({ side }));
      }
    }
    layoutCats();
    for (let i = 0; i < state.cats.length; i += 1) {
      state.cats[i].x = state.cats[i].home;
      state.cats[i].target = state.cats[i].home;
    }
  }

  resize();
  if (settings.releaseOnStart === false) state.gate = Infinity;
  buildCats();
  const wanted = typeof settings.birds === "number" ? settings.birds : 1;
  for (let i = 0; i < wanted; i += 1) addBird();

  canvas.addEventListener("pointermove", trackPointer, { passive: true });
  canvas.addEventListener("pointerdown", trackPointer, { passive: true });
  canvas.addEventListener("pointerleave", forgetPointer);
  canvas.addEventListener("pointercancel", forgetPointer);
  if (typeof ResizeObserver === "function") new ResizeObserver(resize).observe(canvas);
  else window.addEventListener("resize", resize);

  return court;
}
