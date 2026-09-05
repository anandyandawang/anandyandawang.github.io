# design guidelines

This site is a minimalist personal page in a Japandi mood: calm, earthy, mostly empty. Everything on it should feel like it could be removed without anyone being surprised, except the few things that make it personal.

## principles

1. **Less, then a little less.** One column, a handful of sections, hairline dividers. If a new element does not earn its place, it does not get one.
2. **Earthy and quiet.** Warm paper backgrounds, ink-green text, one moss accent, one clay accent. No pure black, no pure white, no saturated colour.
3. **Lowercase and plain.** Headings, navigation, buttons and hints are lowercase. Copy is short, honest and free of buzzwords.
4. **Small delights, rarely.** The cats and shuttlecocks appear in a few deliberate spots. They are drawn with the same thin ink line as everything else and never shout.
5. **Motion has physics.** Anything that moves obeys a believable model: drag, gravity, acceleration limits. Nothing tweens on a timer for decoration.
6. **Respect the visitor.** Reduced-motion users get a still frame. Nothing autoplays sound. Nothing blocks reading.

## colour

Colours live as CSS custom properties in `style.css`. Use the tokens, never raw hex values in components.

| token | light | dark | use |
| --- | --- | --- | --- |
| `--paper` | `#f3f0e8` | `#1d221e` | page background, eye highlights |
| `--paper-2` | `#ebe7dc` | `#232a25` | court backgrounds |
| `--ink` | `#26302a` | `#e6e2d6` | text, outlines |
| `--ink-soft` | `#5b675f` | `#a7b0a3` | secondary text, hints, the match score |
| `--moss` | `#6b7f5e` | `#9db08a` | accent: headings, racket heads, impact rings, hover |
| `--sage` | `#a8b596` | `#6b7f5e` | soft accent: card hover borders, sleeping cat |
| `--clay` | `#c8b39a` | `#a89178` | warm accent: shuttlecock cork |
| `--line` | `#d9d4c7` | `#333b34` | hairlines, borders, court floor and net |

Rules: one accent per element. Fills are rare; the cork of the shuttlecock is the only solid fill in the animations. Blush, shadows and gradients are out.

## type

- Headings use the serif stack (`Iowan Old Style`, Palatino, Georgia), regular weight, lowercase.
- Body uses the system sans stack at about 17px with generous line height.
- Hints and captions are small (0.78rem) and set in `--ink-soft` at reduced opacity.
- Placeholders the owner still has to fill are written in square brackets, for example `[Your Name]`.

## layout

- Single centred column, `--max` = 42rem, side padding 1.25rem.
- Sections are separated by a 1px `--line` rule and 2.5rem of padding.
- Grids collapse to one column below 520px.
- Courts are bordered boxes with a 4px radius on `--paper-2`, with a one-line hint underneath.

## the cats and the bird

The animations share one drawing vocabulary:

- Line weight 1.6px for outlines, 1px for whiskers, round caps and joins, `--ink` colour.
- The cat is the minimal baseline: round head, two triangle ears, two dot eyes, two whiskers per side, a rounded body, a curled tail, one arm holding a racket whose head is a `--moss` ellipse. A subtle lean while moving, a racket raised overhead while a cat waits to smash, happy eye-arcs when a cat is cheering after a point, and a raised, pumped racket in one of the two cheers, are the only extra cues. A big-eyed "chibi" version was tried and rejected as off-theme.
- The shuttlecock is a `--clay` cork with three ink feather lines. It always flies cork first.
- The court is a `--line` floor and, wherever cats face each other across a net — the rally, the drill and the match — a short dashed net. Only the solo keep-ups goes without one.
- The match court draws its score at the top centre, in the serif stack at 14px in `--ink-soft`, as `left – right` with an en dash. It is the one piece of text inside a court: no box, no labels, no names, and no other court shows it.
- The pointer inside a court is a faint `--moss` ring, nothing more.

## motion and feel

- The shuttlecock uses gravity plus quadratic air drag, so it leaves the racket fast and flat and then drops steeply. The rally at the middle of the page runs at a realistic pace.
- Cats move with capped acceleration and deceleration and settle at a target; they never snap or teleport.
- Jumps and hops obey gravity like everything else: a cat that leaves the ground rises and falls under the same acceleration as the shuttlecock. A smash is hit at the top of a small jump, not from a fixed pose.
- The match cats move and hit harder than the rally's: a higher speed and acceleration cap for the cats, faster drives and smashes for the bird. It reads as effort, not as a different clock — the match runs at constant pace like the drill, and the physics underneath is the same.
- Pace can change with where a court sits in the viewport (realistic at the middle, faster near the edges) but never with the pointer.
- The cheer is short, about a second and a half, and only happens after a point ends. The racket pump is the one deliberate rhythmic motion on the site; everything else moves once, toward a target, and stops.
- Hits get a small, identical dose of feedback on every court: a brief hit-stop, a fast racket whip, one thin expanding ring, a short stretch of the bird along its path, a slight squash of the cat, and a one-pixel kick of the whole court. Each effect lasts well under a third of a second. If it can be described as a "particle effect", it is too much.
- `prefers-reduced-motion: reduce` renders a single still frame.

## copy voice

Short sentences, lowercase headings, no exclamation marks. Hints tell the visitor what they can do in as few words as possible, for example "nudge the bird." The match says what the rules are and then gets out of the way: "a match. first to twenty-one. nudge the bird."
