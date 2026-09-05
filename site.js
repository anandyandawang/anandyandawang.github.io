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

function matchServe(state) {
  const server = state.score.server;
  for (let i = 0; i < state.cats.length; i += 1) {
    const cat = state.cats[i];
    if (cat.side !== server) continue;
    return {
      x: cat.x + cat.facing * RACKET_OFFSET_X,
      y: racketLine(state),
      vx: 0,
      vy: 0,
    };
  }
  return serveBird(state);
}

const courtCanvas = document.getElementById("court");
const keepUpsCanvas = document.getElementById("keepups");
const drillCanvas = document.getElementById("drill");
const matchCanvas = document.getElementById("match");

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

const courts = { rally, keepups, drill, match };

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

const courtActions = {
  "add-cat": (court) => {
    const side = sideToFill(court.state.teams);
    if (side) court.addCat(side);
  },
  "remove-cat": (court) => {
    const side = sideToDrain(court.state.teams);
    if (side) court.removeCat(side);
  },
  "add-bird": (court) => {
    if (court.state.birds.length < MAX_BIRDS) court.addBird();
  },
  "remove-bird": (court) => {
    if (court.state.birds.length > MIN_BIRDS) court.removeBird();
  },
};

function wireControls(court, row) {
  if (!row) return;
  row.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const act = courtActions[button.dataset.action];
    if (!act) return;
    act(court);
    if (reducedMotion) court.render();
  });
}

wireControls(rally, document.querySelector('[data-controls="rally"]'));
wireControls(keepups, document.querySelector('[data-controls="keepups"]'));
wireControls(drill, document.querySelector('[data-controls="drill"]'));
wireControls(match, document.querySelector('[data-controls="match"]'));

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
} else {
  rally.start();
  keepups.start();
  drill.start();
  match.start();
  watchForRelease(keepups, keepUpsCanvas);
  watchForRelease(drill, drillCanvas);
  watchForRelease(match, matchCanvas);
}
