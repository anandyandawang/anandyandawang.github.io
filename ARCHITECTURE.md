# architecture

A static site with no build step: plain HTML, one stylesheet, and two classic scripts loaded in order. Everything runs in the browser; GitHub Pages serves the files as they are.

## files

| file | role |
| --- | --- |
| `index.html` | all page content, the five court frames, their control rows and the play court's two sticks |
| `style.css` | design tokens, type, layout, court frames, sticks and controls |
| `engine.js` | the court engine: physics, cats, shots, hit feel, drawing. Knows nothing about the page, the keys or the sticks |
| `site.js` | page glue: builds the five courts, scroll pace, release-on-visibility, control buttons, the play court's keys and sticks |
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
| `chooseShot` | `"rally"`, `"keepUps"`, `"drill"`, `"match"`, a function `(court, cat, bird) => shot`, or an object `{ shot, stance }`. An unrecognised string falls back to rally |
| `movement` | `{ speed, accel }`, multipliers on `CAT_MAX_SPEED` and `CAT_ACCEL`, both defaulting to `1`. The resolved px/s and px/s² land on `state.movement` and are what steering and arrival estimates use |
| `timeScale` | `() => number`, a multiplier applied to simulated time every frame |
| `drawBackdrop` | `(ctx, state, colors) => void`, court furniture such as the net |
| `initialBird` | `(state) => { x, y, vx, vy, hold, holder }`, where a bird appears when served or respawned; `hold` keeps it still for that many seconds, `holder` is the cat it waits at |
| `releaseOnStart` | `false` keeps birds held until `court.release()` is called |
| `player` | `"left"` or `"right"`: the first cat built on that side is driven by the visitor instead of the AI. Any other value, no value, or an empty side means no player |
| `pointer` | `false` skips the canvas pointer listeners, so `state.pointer` stays `null`, no pointer ring draws and the knock never happens. Absent or `true` keeps today's behaviour |

A shot function returns `{ angle, speed, kind?, post? }`. `kind` is a string recorded on the bird (`null` when absent, so a caller can tell what was just hit). `post` is an absolute x the cat idles at after the strike instead of walking home, clamped to the cat's range; it is ignored when not a number. A stance function `(court, cat, bird) => "ground" | "overhead"` is asked every frame for an AI cat that is receiving a bird; anything other than `"overhead"` reads as `"ground"`. The player is the exception: its stance comes from its input and the function is never asked for it. Passing a bare function as `chooseShot` keeps the ground stance; passing `{ shot, stance }` uses both, defaulting `stance` to ground when omitted.

A placement may name a `holder`: the cat the served bird waits at. `serve` stores it on `bird.holder`, and every sub-step a held bird has a holder it is pinned to `reachPoint(holder)` with no velocity, so the bird walks with the cat and rises with it when it jumps. A bird held by the player stays held until the player loads a shot (`holder.input.shot !== null`), on top of the usual `hold` and gate rules; a bird held by an AI cat is held only by those. The first sub-step a bird is not held, `bird.holder` is cleared and the bird falls from the racket as any served bird does.

The court exposes `state`, `start()`, `stop()`, `release()`, `control(input)`, `step(dt)`, `render()`, `addCat(side)`, `removeCat(side)`, `setTeams(counts)`, `addBird()`, `removeBird()`, and a few geometry helpers (`groundY`, `racketY`, `racketPoint`, `reachPoint`, `catRange`, `opponentOf`, `predictCrossing`, `predictCrossingAt`, `predictLandingX`).

- `reachPoint(cat)` is the point the cat can actually strike from: ground stance is `racketPoint(cat)` shifted up by `cat.rise`; overhead stance is `{ x: cat.x + cat.facing * OVERHEAD_OFFSET_X, y: groundY() - OVERHEAD_HEIGHT - cat.rise }`. `racketPoint` stays the plain ground geometry helper: the rally and keep-ups shots still launch from it and a smash aims at an opponent's racket x through it, but nothing is pinned to it any more, and `site.js` computes the same point inline in `serveBird` and `serveFrom`.
- `predictCrossingAt(source, targetY)` generalises crossing prediction to any height; `predictCrossing(source)` is `predictCrossingAt(source, racketY())`.
- `control(input)` merges fields into the player's input and returns it, or returns `null` on a court with no player. `move` is any number, stored as its `Math.sign` (-1, 0, 1), and non-numbers are ignored; `jump: true` requests one jump, consumed by the next sub-step; `shot` is one of `PLAYER_SHOTS` (`"clear"`, `"drop"`, `"drive"`, `"smash"`) or `null`, and anything else leaves the loaded shot as it was.
- `removeCat(side)` never removes the player, so a side holding the player never drops below one cat: the call returns `null` instead, and `setTeams` stops draining that side when it does.

### state

- `state.cats`: `{ side, slot, index, x, vx, facing, facesBird, home, target, post, stance, rise, riseSpeed, groundedFor, cheer, receiving }` plus effect timers. Ranges derive from the side; homes are spread evenly across the side's range. `slot` is the cat's place within its side and spreads the homes; `facesBird` is true for solo cats, which turn to face the nearest bird. `stance` is `"ground"` or `"overhead"`, recomputed every frame from the strategy (an AI cat that is not receiving is always `"ground"`; the player's stance comes from its input, so it can be overhead while it is not receiving). `rise` is px above the ground line (never negative), `riseSpeed` is px/s with positive meaning up, `groundedFor` is seconds since landing and drives the cheer hop's rest. `post` is the absolute x a cat idles at after a strike, or `null`. `cheer` is `null`, `"pump"` or `"hop"`. `swingFrom` (the racket angle at the moment of the last strike) also lives here, initialised so an untouched cat draws exactly as before. `input` is `null` on an AI cat and `{ move, jump, shot }` on the player.
- `state.player`: the player cat, or `null`. It is claimed once, at build time, from the first cat on the `player` side, so a later `addCat` on a side that started empty does not create one.
- `state.birds`: `{ x, y, vx, vy, inPlay, holdUntil, respawnAt, strikes, shot, crossing, receiver, keeper, striker, holder }` plus effect timers. `strikes` counts hits since the last serve, reset in `serve`, incremented in `strike` after the shot strategy has run. `shot` is the `kind` string of the last strike, or `null`. `striker` is the cat that last hit this bird, cleared once the bird leaves that cat's reach (so a cat cannot re-hit its own falling smash) and cleared in `serve` and when the cat is removed. `keeper` is the cat that received this bird on the previous sub-step, remembered so a tie in arrival time inside `ARRIVAL_TIE` goes back to the same cat, and cleared in `serve`, when the bird retires, and when that cat is removed. `holder` is the cat a served bird waits at, taken from the placement in `serve`, cleared the first sub-step the bird is no longer held, in `strike`, and when the holder is removed. `state.bird` is a getter for the first bird in play, kept for tests.
- `state.movement`: `{ maxSpeed, accel }` in px/s and px/s², resolved once from the `movement` option. Every cat on the court steers by these numbers; a court that passes no `movement` gets the plain `CAT_MAX_SPEED` and `CAT_ACCEL`.
- `state.score`: `{ left, right, server, winner }`. Counted on every court that has cats on both sides, whether or not it draws the score; `server` is the side that won the last point, `winner` is the side that has reached `GAME_POINTS` and is cleared on the next serve. Solo courts never score.
- `state.effects`: impact rings. `state.kick`: the current court kick. `state.celebration`: `null`, or `{ side, until }` while a side is cheering after winning a point. `state.hits`, `state.misses`, `state.simTime`, `state.timeScale`, `state.teams` (the live `{ left, right, solo }` counts the control rows read), `state.gate` (the simulated time before which every bird is held; `Infinity` until `release()` on a `releaseOnStart: false` court), `state.pointer`, `state.width`, `state.height`.

### one frame

1. Read `options.timeScale()` and the canvas size.
2. Sub-step the simulation so no step exceeds 1/120 s of simulated time. A hit-stop pauses simulated time for a few real milliseconds.
3. For each bird in play: `advanceBird` integrates gravity and quadratic drag, then reflects off the left wall, right wall and ceiling with restitution. The floor is a miss: the bird retires, a celebration starts if the point ends a rally with cats on both sides, and the bird waits `RESPAWN_DELAY` (or, mid-cheer, until the cheer ends) before `initialBird` places it again. A held bird does not move at all; while it has a `holder` it is pinned to that cat's `reachPoint` with no velocity, so a waiting serve follows the cat, up and down a jump included.
4. Pointer knock: a bird overlapping the pointer ring is pushed out to the ring's edge, clamped inside the walls, and given at least `KNOCK_SPEED` away from the pointer.
5. Assignment: every bird's next crossing of racket height is predicted with the same `advanceBird`, so bounces are accounted for. Birds are sorted by time to crossing; each is given the free cat on the landing side with the shortest estimated arrival time. Once a cat is assigned, its stance is asked of the strategy; an overhead stance recomputes the bird's crossing at the height the raised racket reaches (falling back to the racket-height crossing when that misses). Everyone else targets home or, if cheering, stays put. Same-side cats keep `CAT_SPACING` apart by adjusting targets, never positions. The player is assigned birds like any cat: assignment is purely by arrival time, so the free cat on the landing side with the shortest estimated arrival takes the bird, which on the play court is the player whenever it is free, since it is alone on its side. Its stance comes from its input rather than the strategy: `"overhead"` exactly while `input.shot === "smash"`, receiving or not, so the racket is already up. Spacing never displaces the player either — a cat with input sorts first.
6. Steering: each cat accelerates toward its target with capped acceleration and speed and decelerates to arrive, clamped to its range; a receiving cat aims for the bird's crossing, a cheering cat aims for its own x, everyone else aims for its `post` when set or its `home` otherwise. A grounded cat in overhead stance jumps when its bird is nearly at reach height and it is close enough to its target; while airborne it keeps its horizontal velocity but cannot accelerate, and gravity brings it back down. The player steers by its input instead: `range.max` (the right end of its half) while `input.move` is positive, `range.min` (the left end) while it is negative, its own x when it is `0` or the cat is cheering, so it accelerates and decelerates under the same caps and never uses `home` or `post`. It never jumps by itself; each sub-step an `input.jump` request is consumed, and the jump happens only if the cat is grounded and not mid cheer-hop.
7. Strikes: a descending bird within `RACKET_REACH` of a cat's `reachPoint` is struck. The shot strategy picks a target and searches the launch speed with the predictor so the shot lands where intended: the rally aims into the opponent's reachable strip, keep-ups aims for an apex height and a landing near the middle, the drill cycles lift, smash and net, the match picks a kind from where everyone is standing. The player is skipped while `input.shot` is `null` — the bird passes it and drops — and with a shot loaded it strikes like any cat, except that the shot comes from `playerShot` instead of the court's `chooseShot`.
8. Effects age: swing, ring, stretch, recoil, kick, and the celebration itself — cleared, along with every cheering cat's cheer, on the first sub-step at or after its `until` time.
9. Render: ground, backdrop, cats left to right, birds, rings, pointer ring, all under the kick translation.

Reduced motion renders one still frame and never starts the loop.

### the drill

The drill court's shot strategy cycles a bird through three kinds, in order, forever: `lift`, `smash`, `net`. The kind for a bird's next strike is `DRILL_SEQUENCE[bird.strikes % 3]`, so it is decided per bird and does not care which cat happens to be free — the server lifts, the far side smashes it down, the server nets it back up, and the far side lifts next. A lift and a net shot are hit from the ground and arc the bird up and over into a chosen depth of the opponent's court; a smash is hit overhead, at the top of a jump, and drives the bird down and fast at the opponent's racket. An arc's height is capped by the ceiling, so on a very wide frame the target can sit past what a lift or a net shot can reach. When the arc would land short of the opponent's court the shot is retried flat and fast: first at the quickest speed that still keeps it under the ceiling, then, if that is short too, at the same speed limit the rally uses. A smash aims with that limit as well, so it can still reach a deep opponent on a wide court. After each strike the cat retreats to a `post` — a fixed depth of its own court appropriate to what it just hit (deep after a lift to defend the smash, near the net after a smash to block the net shot, mid-court after a net shot) — instead of walking all the way home, so it is already roughly in position for its next turn.

### the match

The match court's cats play each other for points. Its strategy is the pair `matchShot` and `matchStance`, registered as `"match"` in `SHOT_STRATEGIES`, and it reads the whole court rather than a fixed sequence: `opposingCats` collects every cat on the other side (falling back to `opponentOf` when that side is empty), so the same rules hold at 1v1, 2v2 and 6v6.

`matchStance` is asked every frame while a cat is receiving. It answers `"overhead"` when a smash is on: `predictCrossingAt` finds where the bird descends through the smash height (`groundY() - OVERHEAD_HEIGHT - JUMP_HEIGHT`, the height an overhead racket reaches at the top of a jump) and the cat is either already airborne (`rise > 0`) or can cover the distance from `cat.x` to the clamped overhead racket target at `state.movement.maxSpeed` within the crossing's time. Otherwise `"ground"`. Keeping the overhead stance while airborne matters: flipping to ground mid-jump would make a cat hit a ground shot out of the air.

`matchShot` returns `{ angle, speed, kind, post }` like the drill's shots. An overhead strike is always a `smash`; a ground strike picks one of four kinds from the situation:

| kind | what it is | where it aims | `post` |
| --- | --- | --- | --- |
| `smash` | overhead, at the top of a jump, steep and very fast | the attack corner, pulled `MATCH_SMASH_INSET` of the strip in when it is a wall end of the strip so it stays on the court; the steepest of `MATCH_SMASH_TILTS` whose landing error is within `SMASH_TOLERANCE`, or the closest one of them otherwise. Every tilt in that list points down, and the shallowest of them is there so a smash from the back of the court can still reach instead of burying itself in the net; capped by `MATCH_SMASH_MAX_SPEED` or `launchSpeedLimit`, whichever is larger | forward, to cover the block |
| `drive` | flat and fast | the attack corner, `MATCH_DRIVE_TILTS`, capped by `MATCH_DRIVE_MAX_SPEED` or `launchSpeedLimit`, whichever is larger | mid-court |
| `clear` | high and deep, buys time and resets the rally | the back of the opponents' strip, between `MATCH_CLEAR_MIN_DEPTH` and `MATCH_CLEAR_MAX_DEPTH` of it, `LIFT_TILTS` and the drill's `LIFT_APEX` through `bestArcShot` | deep, ready for the smash it invites |
| `drop` | soft, from mid or back court into the front | the open side of the front of the strip, `MATCH_DROP_TILTS` and `MATCH_DROP_APEX` of the headroom | forward |
| `net` | tight, just over the net | the front of the strip, `NET_TILTS` and an apex between `NET_APEX_MIN` and `NET_APEX_MAX` | forward |

The **open corner** is the x in the opponents' strip farthest from any opponent's racket x (`x + facing * RACKET_OFFSET_X`). The candidates are the two ends of the strip and the midpoints between neighbouring opponents; the one with the largest distance to the nearest racket x wins. A drop and a net shot aim at that corner, clamped into their depth band.

A smash and a drive aim at the **attack corner** instead, which is the open corner or the space behind the defence, whichever is farther from the nearest racket. That space is `MATCH_BEHIND_GAP` past the deepest opponent, kept `MATCH_BACK_MARGIN` clear of the back wall, and it sits past the end of the landing strip: the strip stops where a defender standing at the back of its range can still reach, so on a crowded court every x inside it is covered and the only way through is behind them. On an open court the ends of the strip are farther from the one defender than that space is, so the attack corner is the open corner and nothing changes; the deep ball is what a side crowded with cats gets hit with.

The **situation** is two depths, both fractions of a cat's own range measured from the net end (0 at the net, 1 at the back wall): `catDepth`, how deep the striker stands, and `frontDepth`, the smallest depth among the opponents. A ground strike then chooses, in order, rolling `Math.random()` once so play is not deterministic:

1. defending a smash (the bird's `shot` is `"smash"`) — `net` 30 % of the time when the striker is inside `MATCH_NET_ZONE`, otherwise `clear`;
2. striker inside `MATCH_NET_ZONE` and the nearest opponent at or behind `MATCH_DEEP_DEPTH` — `net` 75 %, else `drive`;
3. striker at or behind `MATCH_DEEP_DEPTH` and the nearest opponent deep too — `drop` 60 %, else `drive`;
4. opponents forward, at or inside `MATCH_FRONT_DEPTH` — `clear` over them 60 %, else `drive` past them;
5. otherwise `drive` 55 %, `drop` 25 %, `clear` 20 %.

Every kind carries a `post` computed with `depthX` on the striker's own range, so footwork is part of the shot: the cat recovers to a base depth chosen for the reply it expects instead of walking home.

The score lives in `state.score`. `celebrate` gives the winning side a point, makes it `score.server`, and sets `score.winner` when its count reaches `GAME_POINTS` (21). `serve` clears a finished game: with a `winner` set it puts `left` and `right` back to `0` and `winner` to `null`, leaving `server` alone, so the game winner serves the first point of the next game. The point's own bird is held back for the whole cheer, and the celebration is cleared earlier in the same sub-step that respawns it, so the court reads 21 for the length of the cheer and the next serve starts 0 – 0. `site.js` draws the score, and `matchServe` puts the next bird at the racket of a free cat on `score.server`'s side, naming that cat as its `holder` so the bird sits there while the serve is held. Free means not already holding a bird in play: `freeServer` skips a cat with a serve on its racket, and with the whole serving side busy the next bird is served from the other side. With nobody free, or with no side named at all — nobody has served yet and the court has no player, which is the match's first bird — the placement falls back to the random `serveBird`. On the match court the holders are AI cats, cleared on the first unheld sub-step, so nothing changes there; on the play court an extra bird is served from the AI side while the player still waits on its own.

### the play

The play court is the match with the left cat driven by the visitor: the same `"match"` strategy for the right side, the same movement multipliers, the same scoreboard, first to `GAME_POINTS`. The engine knows nothing about keys or sticks; the page sends `court.control` and the court reads `state.player.input`.

A shot is pre-loaded, not swung: the visitor holds a direction ahead of time, and when the bird comes within `RACKET_REACH` of the player's `reachPoint` the loaded shot plays exactly as an AI strike does. `playerShot` maps the loaded shot onto the match's own shot functions, so a player's shot aims like the match cat's:

| loaded shot | direction | kind | where it aims |
| --- | --- | --- | --- |
| `"drop"` | left | `net` inside `MATCH_NET_ZONE`, `drop` otherwise | `matchNetShot` or `matchDrop`: the open corner, clamped into the front of the opponents' strip |
| `"clear"` | up | `clear` | `matchClear`: the back of the opponents' strip, a lift from the front and a clear from the back |
| `"drive"` | right | `drive` | `matchDrive`: the attack corner, flat and fast |
| `"smash"` | down | `smash` | `matchSmash`: the attack corner, steep and fast, a net kill from the ground and a real smash from the top of a jump |

With nothing loaded (`input.shot === null`) the player never swings: the bird passes it and drops for the point. `"smash"` is the one loaded shot that changes the stance, to `"overhead"`, so the racket goes up as soon as it is loaded and stays up until it is let go.

The serve waits. `matchServe` names a free cat on the serving side as the bird's `holder` — the player's side when no side has served yet — so when the player is the server the bird sits at its racket, walks with it and rises with its jumps until a shot is loaded; then it drops and is struck with that shot. A bird added while the player still holds its serve goes to the free cat on the other side instead of stacking on the player's racket.

The racket says what is loaded. `restRacketAngle` is asked with the state so it can see a serve: a player holding a bird in play draws its racket level at `RACKET_REST_ANGLE`, the serve resting on it. Otherwise the player gets `IDLE_RACKET_ANGLE` (`0.2`, the racket hanging) with nothing loaded, and `READY_ANGLES[input.shot]` with a shot on: `-0.2` for a drop, `RACKET_REST_ANGLE` for a drive, `-0.8` for a clear, `OVERHEAD_ANGLE` for a smash. AI cats keep the old overhead-or-rest angle, and the swing interpolation and the cheer pump are unchanged.

The court's control row adds and removes opponents only: `+cat` and `−cat` act on the right side, within 1 to 6. The player is never removed, so the left side stays at one cat.

### the cheer

When a bird hits the floor and no bird is left in play on a court with cats on both sides, the side that did not lose the point celebrates: `state.celebration` is set with a 1.4 second `until`, each of its cats gets a `cheer` of `"pump"` or `"hop"` (chosen at random) and stops where it stands, and the respawn is delayed to match. A cheering cat draws happy eye-arcs instead of dot eyes; a `"pump"` cat holds its racket up and pumps it in a short rhythmic loop, a `"hop"` cat does small vertical hops with the same gravity as the drill's jump. The losing side just walks home. Once the cheer ends the celebration and every cat's cheer clear together, and the next bird is served as usual. Solo courts (the keep-ups) never celebrate.

### hit feel

Every strike, on every court, triggers the same small set: hit-stop, racket whip, expanding ring, bird stretch along its velocity, cat squash, and a 1.5 px kick of the whole court. Bounces get a smaller, fainter ring. The constants live at the top of `engine.js`; there is no per-court override on purpose, so every court always feels the same.

## the page

`site.js`:

- builds the rally on `#court` with `teams: { left: 1, right: 1 }`, a net backdrop, serve-from-a-cat placement, and a `timeScale` that grows with the court's distance from the middle of the viewport (1 at the centre, up to 3 near the edges);
- builds the keep-ups on `#keepups` with `teams: { solo: 1 }`, the keep-ups shot strategy, rest-at-the-top placement, and a release that fires from an `IntersectionObserver` once the square is 60 % visible;
- builds the drill on `#drill`, in the skills section, with `teams: { left: 1, right: 1 }`, a net backdrop, the `"drill"` shot strategy, serve-from-a-cat placement, constant pace (no `timeScale`), and the same 60 % visibility release as the keep-ups;
- builds the match on `#match`, in the work section, with `teams: { left: 1, right: 1 }`, the `"match"` shot strategy, a `movement` of `{ speed: MATCH_SPEED, accel: MATCH_ACCEL }`, a `drawScoreboard` backdrop that draws the net and then the score, `matchServe` placement, constant pace, and the same 60 % visibility release as the keep-ups;
- builds the play on `#play`, in the projects section, with `teams: { left: 1, right: 1 }`, the `"match"` shot strategy, `player: "left"`, `pointer: false`, the match's `movement`, the `drawScoreboard` backdrop, `matchServe` placement, constant pace, and the same 60 % visibility release as the keep-ups;
- wires the `+cat −cat +bird −bird` rows on all five courts through an actions table: the four AI courts use `courtActions`, where cats are added to the emptier side and removed from the fuller one, within 1 to 6 per side; the play uses `opponentActions`, which adds and removes on the right side only. Birds are within 1 to 6 everywhere;
- wires the play court's keys on its canvas, which carries `tabindex="0"` so a click or a tab focuses it: `a` and `d` walk (both held is a stand still), `w` or the space bar jumps on a non-repeat keydown (both sit in `JUMP_KEYS`, so a reflex space is handled here and never scrolls the page mid-rally), and the four arrows load a shot through `SHOT_KEYS` — the held arrows are kept in press order and the most recently pressed one still held wins, `null` when none is. `preventDefault` is called only for handled keys, so the page still scrolls with the arrows when the court is not focused, and a `blur` clears the walk and the loaded shot;
- wires the play court's two sticks, shown on touch devices only: `wireStick` captures the pointer, clamps the offset from the stick's centre to `STICK_RADIUS` (30 px) and writes it to the knob's `--dx` and `--dy`. The move stick walks when `|dx|` passes `STICK_DEADZONE` (12 px) and requests a jump each time `dy` crosses into `dy < -STICK_DEADZONE`; the shot stick loads `STICK_SHOTS[stickDirection(offset)]`, the dominant axis outside the deadzone, and `null` inside it or on release. A stick follows the one pointer it captured: a second finger on the same ring is ignored until that one lifts;
- wires neither the keys nor the sticks under reduced motion, where the play court is a still frame and nothing drives it, so the arrows scroll the page as they do anywhere else.

Each canvas sits inside `div.court-frame`, which carries the border, background and a native CSS `resize: both` grip. A `ResizeObserver` in the engine re-measures the canvas, recomputes ranges and homes, and keeps play going through the resize. The wide frame lives in a full-bleed wrapper so it can grow past the text column. The play canvas's own focus outline is off and `.court-frame:focus-within` turns the frame border `--sage` instead, so the frame is the focus cue. The play frame also drops the crosshair for the default cursor, because its pointer is off and there is nothing to aim at.

## adding a court

1. Add a `div.court-frame` with a canvas to `index.html`, and a control row if wanted.
2. Call `createCourt` in `site.js` with a `teams` shape, a shot strategy and a bird placement.
3. Add the court to the `courts` object so tests can reach it.

A 2v2 court is `teams: { left: 2, right: 2 }`; more birds is `birds: 3`. A court the visitor drives is `player: "left"` (usually with `pointer: false`) plus something on the page calling `court.control`. Nothing else changes.

## testing

There is no test runner in the repo. Development used headless Chromium through Playwright to sample `courts.rally.state`, `courts.keepups.state`, `courts.drill.state`, `courts.match.state` and `courts.play.state` over time, and to record clips. The play court is driven without keys or sticks by calling `courts.play.control({ move, jump, shot })` between `courts.play.step(1 / 120)` calls after `stop()` and `release()`. Any script can reach the courts by name from `page.evaluate` because they are top-level bindings of a classic script.
