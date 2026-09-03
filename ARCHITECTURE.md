# architecture

A static site with no build step: plain HTML, one stylesheet, and two classic scripts loaded in order. Everything runs in the browser; GitHub Pages serves the files as they are.

## files

| file | role |
| --- | --- |
| `index.html` | all page content, the two court frames and their control rows |
| `style.css` | design tokens, type, layout, court frames and controls |
| `engine.js` | the court engine: physics, cats, shots, hit feel, drawing. Knows nothing about the page |
| `site.js` | page glue: builds the two courts, scroll pace, keep-ups release, control buttons |
| `favicon.svg` | shuttlecock icon |
| `DESIGN.md` | design guidelines |
| `ARCHITECTURE.md` | this file |

`engine.js` loads first and defines `createCourt` plus the tuning constants as top-level bindings. `site.js` loads second and uses them. No modules, no bundler, no dependencies.

## the engine

`createCourt(canvas, options)` returns a court that owns one canvas. Options:

| option | meaning |
| --- | --- |
| `teams` | `{ left, right, solo }` cat counts. Left and right cats face the net and stay in their half; solo cats roam the whole width and turn to face the bird |
| `birds` | how many shuttlecocks to serve at start |
| `chooseShot` | `"rally"`, `"keepUps"`, or a function `(court, cat) => { angle, speed }` |
| `timeScale` | `() => number`, a multiplier applied to simulated time every frame |
| `drawBackdrop` | `(ctx, state, colors) => void`, court furniture such as the net |
| `initialBird` | `(state) => { x, y, vx, vy, hold }`, where a bird appears when served or respawned; `hold` keeps it still for that many seconds |
| `releaseOnStart` | `false` keeps birds held until `court.release()` is called |

The court exposes `state`, `start()`, `stop()`, `release()`, `step(dt)`, `render()`, `addCat(side)`, `removeCat(side)`, `setTeams(counts)`, `addBird()`, `removeBird()`, and a few geometry helpers (`groundY`, `racketY`, `racketPoint`, `catRange`, `predictCrossing`).

### state

- `state.cats`: `{ side, index, x, vx, facing, home, target, receiving }` plus effect timers. Ranges derive from the side; homes are spread evenly across the side's range.
- `state.birds`: `{ x, y, vx, vy, inPlay, holdUntil, respawnAt, crossing, receiver }` plus effect timers. `state.bird` is a getter for the first bird in play, kept for tests.
- `state.effects`: impact rings. `state.kick`: the current court kick. `state.hits`, `state.misses`, `state.simTime`, `state.timeScale`, `state.pointer`, `state.width`, `state.height`.

### one frame

1. Read `options.timeScale()` and the canvas size.
2. Sub-step the simulation so no step exceeds 1/120 s of simulated time. A hit-stop pauses simulated time for a few real milliseconds.
3. For each bird in play: `advanceBird` integrates gravity and quadratic drag, then reflects off the left wall, right wall and ceiling with restitution. The floor is a miss: the bird retires, waits `RESPAWN_DELAY`, and is placed again by `initialBird`.
4. Pointer knock: a bird overlapping the pointer ring is pushed out to the ring's edge, clamped inside the walls, and given at least `KNOCK_SPEED` away from the pointer.
5. Assignment: every bird's next crossing of racket height is predicted with the same `advanceBird`, so bounces are accounted for. Birds are sorted by time to crossing; each is given the free cat on the landing side with the shortest estimated arrival time. Everyone else targets home. Same-side cats keep `CAT_SPACING` apart by adjusting targets, never positions.
6. Steering: each cat accelerates toward its target with capped acceleration and speed and decelerates to arrive, clamped to its range.
7. Strikes: a descending bird within `RACKET_REACH` of a cat's racket point is struck. The shot strategy picks a target and searches the launch speed with the predictor so the shot lands where intended: the rally aims into the opponent's reachable strip, keep-ups aims for an apex height and a landing near the middle.
8. Effects age: swing, ring, stretch, recoil, kick.
9. Render: ground, backdrop, cats left to right, birds, rings, pointer ring, all under the kick translation.

Reduced motion renders one still frame and never starts the loop.

### hit feel

Every strike, on every court, triggers the same small set: hit-stop, racket whip, expanding ring, bird stretch along its velocity, cat squash, and a 1.5 px kick of the whole court. Bounces get a smaller, fainter ring. The constants live at the top of `engine.js`; there is no per-court override on purpose, so the two courts always feel the same.

## the page

`site.js`:

- builds the rally on `#court` with `teams: { left: 1, right: 1 }`, a net backdrop, serve-from-a-cat placement, and a `timeScale` that grows with the court's distance from the middle of the viewport (1 at the centre, up to 3 near the edges);
- builds the keep-ups on `#keepups` with `teams: { solo: 1 }`, the keep-ups shot strategy, rest-at-the-top placement, and a release that fires from an `IntersectionObserver` once the square is 60 % visible;
- wires the `+cat −cat +bird −bird` rows: cats are added to the emptier side and removed from the fuller one, within 1 to 6 per side; birds within 1 to 6.

Each canvas sits inside `div.court-frame`, which carries the border, background and a native CSS `resize: both` grip. A `ResizeObserver` in the engine re-measures the canvas, recomputes ranges and homes, and keeps the rally going through the resize. The wide frame lives in a full-bleed wrapper so it can grow past the text column.

## adding a court

1. Add a `div.court-frame` with a canvas to `index.html`, and a control row if wanted.
2. Call `createCourt` in `site.js` with a `teams` shape, a shot strategy and a bird placement.
3. Add the court to the `courts` object so tests can reach it.

A 2v2 court is `teams: { left: 2, right: 2 }`; more birds is `birds: 3`. Nothing else changes.

## testing

There is no test runner in the repo. Development used headless Chromium through Playwright to sample `courts.rally.state` and `courts.keepups.state` over time, and to record clips. Any script can reach the courts by name from `page.evaluate` because they are top-level bindings of a classic script.
