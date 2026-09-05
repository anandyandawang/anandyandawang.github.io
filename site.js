document.getElementById("year").textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TIME_SCALE_MAX = 3;
const REST_HEIGHT = 26;
const REST_PAUSE = 0.8;
const KEEP_UPS_VISIBLE_RATIO = 0.6;
const STATIC_BIRD_LIFT = 60;
const MIN_PER_SIDE = 1;
const MAX_PER_SIDE = 6;
const MIN_BIRDS = 1;
const MAX_BIRDS = 6;
const MATCH_SPEED = 1.6;
const MATCH_ACCEL = 2;
const SCORE_TOP = 12;
const SCORE_SIZE = 14;
const STICK_RADIUS = 30;
const STICK_DEADZONE = 12;
const SHOT_KEYS = {
  ArrowLeft: "drop",
  ArrowUp: "clear",
  ArrowRight: "drive",
  ArrowDown: "smash",
};
const STICK_SHOTS = { left: "drop", up: "clear", right: "drive", down: "smash" };
const OTHER_SIDE = { left: "right", right: "left" };
const WALK_KEYS = { KeyA: -1, KeyD: 1 };
const JUMP_KEYS = { KeyW: true, Space: true };

function racketLine(state) {
  return state.height - GROUND_MARGIN - RACKET_HEIGHT;
}

function scrollPace(element) {
  const rect = element.getBoundingClientRect();
  const courtCentre = rect.top + rect.height / 2;
  const viewportCentre = window.innerHeight / 2;
  const closeness = Math.min(Math.abs(courtCentre - viewportCentre) / viewportCentre, 1);
  return 1 + closeness * closeness * (TIME_SCALE_MAX - 1);
}

function drawNet(ctx, state, colors) {
  const y = state.height - GROUND_MARGIN;
  const net = state.width / 2;
  ctx.strokeStyle = colors.line;
  ctx.lineWidth = 1;
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

function serifStack() {
  return getComputedStyle(document.documentElement).getPropertyValue("--serif").trim();
}

function drawScoreboard(ctx, state, colors) {
  drawNet(ctx, state, colors);
  ctx.fillStyle = colors.inkSoft;
  ctx.font = SCORE_SIZE + "px " + serifStack();
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(state.score.left + " – " + state.score.right, state.width / 2, SCORE_TOP);
}

function serveBird(state) {
  const server = state.cats[Math.floor(Math.random() * state.cats.length)];
  if (!server) return { x: state.width / 2, y: racketLine(state), vx: 0, vy: 0 };
  return {
    x: server.x + server.facing * RACKET_OFFSET_X,
    y: racketLine(state),
    vx: 0,
    vy: 0,
  };
}

function restingBird(state) {
  return { x: state.width / 2, y: REST_HEIGHT, vx: 0, vy: 0, hold: REST_PAUSE };
}

function serveFrom(state, cat) {
  return {
    x: cat.x + cat.facing * RACKET_OFFSET_X,
    y: racketLine(state),
    vx: 0,
    vy: 0,
    holder: cat,
  };
}

function freeServer(state, side) {
  for (let i = 0; i < state.cats.length; i += 1) {
    const cat = state.cats[i];
    if (cat.side !== side || holdsBird(state, cat)) continue;
    return cat;
  }
  return null;
}

function matchServe(state) {
  const side = state.score.server || (state.player ? state.player.side : null);
  const server = freeServer(state, side) || freeServer(state, OTHER_SIDE[side]);
  if (server) return serveFrom(state, server);
  return serveBird(state);
}

const courtCanvas = document.getElementById("court");
const keepUpsCanvas = document.getElementById("keepups");
const drillCanvas = document.getElementById("drill");
const matchCanvas = document.getElementById("match");
const playCanvas = document.getElementById("play");

const rally = createCourt(courtCanvas, {
  teams: { left: 1, right: 1 },
  birds: 1,
  chooseShot: "rally",
  timeScale: () => scrollPace(courtCanvas),
  drawBackdrop: drawNet,
  initialBird: serveBird,
});

const keepups = createCourt(keepUpsCanvas, {
  teams: { solo: 1 },
  birds: 1,
  chooseShot: "keepUps",
  initialBird: restingBird,
  releaseOnStart: false,
});

const drill = createCourt(drillCanvas, {
  teams: { left: 1, right: 1 },
  birds: 1,
  chooseShot: "drill",
  drawBackdrop: drawNet,
  initialBird: serveBird,
  releaseOnStart: false,
});

const match = createCourt(matchCanvas, {
  teams: { left: 1, right: 1 },
  birds: 1,
  chooseShot: "match",
  movement: { speed: MATCH_SPEED, accel: MATCH_ACCEL },
  drawBackdrop: drawScoreboard,
  initialBird: matchServe,
  releaseOnStart: false,
});

const play = createCourt(playCanvas, {
  teams: { left: 1, right: 1 },
  birds: 1,
  chooseShot: "match",
  player: "left",
  pointer: false,
  movement: { speed: MATCH_SPEED, accel: MATCH_ACCEL },
  drawBackdrop: drawScoreboard,
  initialBird: matchServe,
  releaseOnStart: false,
});

const courts = { rally, keepups, drill, match, play };

function sideToFill(teams) {
  if (teams.solo > 0) return teams.solo < MAX_PER_SIDE ? "solo" : null;
  const side = teams.left <= teams.right ? "left" : "right";
  return teams[side] < MAX_PER_SIDE ? side : null;
}

function sideToDrain(teams) {
  if (teams.solo > 0) return teams.solo > MIN_PER_SIDE ? "solo" : null;
  const side = teams.right >= teams.left ? "right" : "left";
  return teams[side] > MIN_PER_SIDE ? side : null;
}

function addBirdTo(court) {
  if (court.state.birds.length < MAX_BIRDS) court.addBird();
}

function removeBirdFrom(court) {
  if (court.state.birds.length > MIN_BIRDS) court.removeBird();
}

const courtActions = {
  "add-cat": (court) => {
    const side = sideToFill(court.state.teams);
    if (side) court.addCat(side);
  },
  "remove-cat": (court) => {
    const side = sideToDrain(court.state.teams);
    if (side) court.removeCat(side);
  },
  "add-bird": addBirdTo,
  "remove-bird": removeBirdFrom,
};

const opponentActions = {
  "add-cat": (court) => {
    if (court.state.teams.right < MAX_PER_SIDE) court.addCat("right");
  },
  "remove-cat": (court) => {
    if (court.state.teams.right > MIN_PER_SIDE) court.removeCat("right");
  },
  "add-bird": addBirdTo,
  "remove-bird": removeBirdFrom,
};

function wireControls(court, row, actions) {
  if (!row) return;
  row.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const act = actions[button.dataset.action];
    if (!act) return;
    act(court);
    if (reducedMotion) court.render();
  });
}

wireControls(rally, document.querySelector('[data-controls="rally"]'), courtActions);
wireControls(keepups, document.querySelector('[data-controls="keepups"]'), courtActions);
wireControls(drill, document.querySelector('[data-controls="drill"]'), courtActions);
wireControls(match, document.querySelector('[data-controls="match"]'), courtActions);
wireControls(play, document.querySelector('[data-controls="play"]'), opponentActions);

function shotForKey(code) {
  const shot = SHOT_KEYS[code];
  return typeof shot === "string" ? shot : null;
}

function wirePlayerKeys(court, canvas) {
  const walking = { KeyA: false, KeyD: false };
  const loaded = [];

  function sendMove() {
    let move = 0;
    if (walking.KeyD) move += WALK_KEYS.KeyD;
    if (walking.KeyA) move += WALK_KEYS.KeyA;
    court.control({ move });
  }

  function sendShot() {
    const code = loaded.length > 0 ? loaded[loaded.length - 1] : null;
    court.control({ shot: code ? shotForKey(code) : null });
  }

  canvas.addEventListener("keydown", (event) => {
    const code = event.code;
    if (typeof WALK_KEYS[code] === "number") {
      walking[code] = true;
      sendMove();
    } else if (JUMP_KEYS[code]) {
      if (!event.repeat) court.control({ jump: true });
    } else if (shotForKey(code)) {
      if (loaded.indexOf(code) < 0) loaded.push(code);
      sendShot();
    } else {
      return;
    }
    event.preventDefault();
  });

  canvas.addEventListener("keyup", (event) => {
    const code = event.code;
    if (typeof WALK_KEYS[code] === "number") {
      walking[code] = false;
      sendMove();
    } else if (shotForKey(code)) {
      const at = loaded.indexOf(code);
      if (at >= 0) loaded.splice(at, 1);
      sendShot();
    } else if (!JUMP_KEYS[code]) {
      return;
    }
    event.preventDefault();
  });

  canvas.addEventListener("blur", () => {
    walking.KeyA = false;
    walking.KeyD = false;
    loaded.length = 0;
    court.control({ move: 0, shot: null });
  });
}

function stickOffset(element, event) {
  const rect = element.getBoundingClientRect();
  const dx = event.clientX - (rect.left + rect.width / 2);
  const dy = event.clientY - (rect.top + rect.height / 2);
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length <= STICK_RADIUS) return { dx, dy };
  return { dx: (dx / length) * STICK_RADIUS, dy: (dy / length) * STICK_RADIUS };
}

function stickDirection(offset) {
  if (!offset) return null;
  if (Math.sqrt(offset.dx * offset.dx + offset.dy * offset.dy) <= STICK_DEADZONE) return null;
  if (Math.abs(offset.dx) >= Math.abs(offset.dy)) return offset.dx < 0 ? "left" : "right";
  return offset.dy < 0 ? "up" : "down";
}

function wireStick(element, onChange) {
  if (!element) return function () {};
  const knob = element.querySelector(".knob");
  let activeId = null;

  function placeKnob(dx, dy) {
    knob.style.setProperty("--dx", dx + "px");
    knob.style.setProperty("--dy", dy + "px");
  }

  function follow(event) {
    const offset = stickOffset(element, event);
    placeKnob(offset.dx, offset.dy);
    onChange(offset);
  }

  function release() {
    if (activeId === null) return;
    activeId = null;
    placeKnob(0, 0);
    onChange(null);
  }

  function letGo(event) {
    if (event.pointerId !== activeId) return;
    release();
  }

  function holdsAnotherFinger(pointerId) {
    if (activeId === null || activeId === pointerId) return false;
    return element.hasPointerCapture(activeId);
  }

  element.addEventListener("pointerdown", (event) => {
    if (holdsAnotherFinger(event.pointerId)) return;
    activeId = event.pointerId;
    element.setPointerCapture(event.pointerId);
    follow(event);
    event.preventDefault();
  });
  element.addEventListener("pointermove", (event) => {
    if (event.pointerId !== activeId) return;
    follow(event);
  });
  element.addEventListener("pointerup", letGo);
  element.addEventListener("pointercancel", letGo);
  element.addEventListener("lostpointercapture", letGo);
  return release;
}

function selectionHasText() {
  const selection = document.getSelection();
  return selection !== null && !selection.isCollapsed;
}

function wirePlayerSticks(court, sticks) {
  if (!sticks) return;
  let pushedUp = false;

  const releaseMove = wireStick(sticks.querySelector('[data-stick="move"]'), (offset) => {
    if (!offset) {
      pushedUp = false;
      court.control({ move: 0 });
      return;
    }
    const move = Math.abs(offset.dx) > STICK_DEADZONE ? Math.sign(offset.dx) : 0;
    const up = offset.dy < -STICK_DEADZONE;
    if (up && !pushedUp) court.control({ move, jump: true });
    else court.control({ move });
    pushedUp = up;
  });

  const releaseShot = wireStick(sticks.querySelector('[data-stick="shot"]'), (offset) => {
    const direction = stickDirection(offset);
    court.control({ shot: direction ? STICK_SHOTS[direction] : null });
  });

  function releaseBoth() {
    releaseMove();
    releaseShot();
  }

  sticks.addEventListener("contextmenu", (event) => event.preventDefault());
  window.addEventListener("blur", releaseBoth);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) releaseBoth();
  });
  document.addEventListener("selectionchange", () => {
    if (selectionHasText()) releaseBoth();
  });
}

if (!reducedMotion) {
  wirePlayerKeys(play, playCanvas);
  wirePlayerSticks(play, document.querySelector('[data-sticks="play"]'));
}

function watchForRelease(court, element) {
  const watcher = new IntersectionObserver((entries) => {
    for (let i = 0; i < entries.length; i += 1) {
      if (entries[i].intersectionRatio < KEEP_UPS_VISIBLE_RATIO) continue;
      court.release();
      watcher.disconnect();
      return;
    }
  }, { threshold: [KEEP_UPS_VISIBLE_RATIO] });
  watcher.observe(element);
}

if (reducedMotion) {
  const still = rally.state.birds[0];
  still.x = rally.state.width / 2;
  still.y = racketLine(rally.state) - STATIC_BIRD_LIFT;
  still.vx = 300;
  still.vy = -60;
  still.stretchElapsed = STRETCH_DURATION;
  rally.render();
  keepups.render();
  drill.render();
  match.render();
  play.render();
} else {
  rally.start();
  keepups.start();
  drill.start();
  match.start();
  play.start();
  watchForRelease(keepups, keepUpsCanvas);
  watchForRelease(drill, drillCanvas);
  watchForRelease(match, matchCanvas);
  watchForRelease(play, playCanvas);
}
