# working on this repo

A static personal site: plain HTML, one stylesheet, two classic scripts, no build step, no dependencies. Read `ARCHITECTURE.md` (how the court engine and the page fit together) and `DESIGN.md` (the look, the motion rules, the copy voice) before changing anything.

## keep the docs true

`ARCHITECTURE.md`, `DESIGN.md` and `README.md` describe the code as it is. Any change that touches what they describe must update them in the same change:

- a new or changed `createCourt` option, court method, state field, shot strategy or shot result field goes into `ARCHITECTURE.md`;
- a new visual cue, colour use, motion rule or piece of copy goes into `DESIGN.md`;
- a new file or a new court on the page goes into the file tables of `README.md` and `ARCHITECTURE.md`.

Before finishing, reread the sections you touched and check every option, field and method they name exists under that name in the code.

## checking a change

There is no test runner. Open `index.html` in headless Chromium through Playwright (`require('/opt/node22/lib/node_modules/playwright')` works in the web environment), listen for page errors, and drive a court deterministically: `court.stop()`, `court.release()`, then `court.step(1/120)` in a loop while sampling `court.state`. The courts are reachable as `courts.rally`, `courts.keepups` and `courts.drill`. Check the default wide frame and the 150 px-tall mobile frame (a 390 px-wide viewport). Reduced motion must still render a still frame on every canvas.

## style

Match the existing code exactly: classic `function` declarations, `const` and `let`, `for` loops with `i += 1`, constants in capitals at the top of `engine.js`, colours only through the palette tokens. Hint copy is lowercase, short, and has no exclamation marks.
