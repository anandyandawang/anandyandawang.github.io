document.getElementById("year").textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TIME_SCALE_MAX = 3;
const REST_HEIGHT = 26;
const REST_PAUSE = 0.8;
const KEEP_UPS_VISIBLE_RATIO = 0.6;
const STATIC_BIRD_LIFT = 60;

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

function serveBird(state) {
  const server = state.cats[Math.random() < 0.5 ? 0 : 1];
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

const courtCanvas = document.getElementById("court");
const keepUpsCanvas = document.getElementById("keepups");

const rally = createCourt(courtCanvas, {
  cats: [
    { facing: 1, range: (state) => ({ min: CAT_INSET, max: state.width / 2 - CAT_NET_GAP }) },
    { facing: -1, range: (state) => ({ min: state.width / 2 + CAT_NET_GAP, max: state.width - CAT_INSET }) },
  ],
  chooseShot: "rally",
  timeScale: () => scrollPace(courtCanvas),
  drawBackdrop: drawNet,
  initialBird: serveBird,
});

const keepups = createCourt(keepUpsCanvas, {
  cats: [
    {
      facing: 1,
      facesBird: true,
      range: (state) => ({ min: CAT_INSET, max: state.width - CAT_INSET }),
    },
  ],
  chooseShot: "keepUps",
  initialBird: restingBird,
  releaseOnStart: false,
});

const courts = { rally, keepups };

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
  rally.state.bird = {
    x: rally.state.width / 2,
    y: racketLine(rally.state) - STATIC_BIRD_LIFT,
    vx: 300,
    vy: -60,
    stretchElapsed: STRETCH_DURATION,
  };
  rally.render();
  keepups.render();
} else {
  rally.start();
  keepups.start();
  watchForRelease(keepups, keepUpsCanvas);
}
