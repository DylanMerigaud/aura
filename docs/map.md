# AURA WORLD TOUR map screen

A self contained Three.js module that draws the tour map: a stylized world plane and five
stops as 3D pins with Age of Empires 2 style label plates. One stop is unlocked with a
glowing ring and up to three stars, the others are locked behind a padlock, a dark
silhouette and a SOON stamp.

Files:

- `src/map/index.ts` - the module, pure helpers plus the renderer.
- `src/map/map.css` - the screen frame around the canvas (title, hint, vignette).
- `tests/map/*.test.ts` - layout math, unlock and star state, screen to stop picking.

Nothing is fetched at runtime: the continents, the ocean gradient, the plates and the
stamp are all generated in code.

## Usage

```html
<link rel="stylesheet" href="/src/map/map.css" />

<div class="aura-map">
  <canvas class="aura-map__canvas" id="map"></canvas>
  <div class="aura-map__veil"></div>
  <h1 class="aura-map__title">Aura World Tour</h1>
  <p class="aura-map__subtitle">Pick your stage</p>
  <p class="aura-map__hint">Tap a stop</p>
</div>
```

```ts
import { createMap, DEFAULT_STOPS } from "./map/index";

const map = createMap(document.getElementById("map") as HTMLCanvasElement, {
  stops: DEFAULT_STOPS,
  unlocked: ["chatelet"],
  stars: { chatelet: 2 },
  onSelect: (stopId) => startLevel(stopId),
  onLocked: (stopId) => playLockedSound(stopId),
  characterFactory: (stopId) => buildRig(stopId), // optional
});

window.addEventListener("resize", map.resize);
```

## API

`createMap(canvas: HTMLCanvasElement, opts): MapHandle`

| Option | Type | Meaning |
| --- | --- | --- |
| `stops` | `Stop[]` | Stops to place. Empty falls back to `DEFAULT_STOPS`. |
| `unlocked` | `string[]` | Ids of the stops that are playable. |
| `stars` | `Record<string, number>` | Stars per stop, clamped to 0 to 3, locked stops keep 0. |
| `onSelect` | `(stopId: string) => void` | Tap on an unlocked stop. |
| `onLocked` | `(stopId: string) => void` | Tap on a locked stop. The pin also shakes and stamps SOON. |
| `characterFactory` | `(stopId: string) => THREE.Object3D` | Optional. Stands the game rig on the stop instead of the capsule. Locked stops get the silhouette material. |
| `size` | `{width, height}` | Plane size in world units, defaults to 40 by 20. |

`MapHandle`:

- `resize()` - reads the canvas client size and updates the renderer and the camera.
- `setStars(stopId, stars)` - repaints the star row, clamped to 0 to 3.
- `unlock(stopId)` - swaps the padlock for the glowing ring, shows the star row and
  hides the default capsule placeholder. A rig from `characterFactory` stays on the stop.
- `destroy()` - stops the loop, removes the listeners, disposes the geometries,
  the materials, the canvas textures and the renderer.

A `Stop` is `{id, name, city?, lon, lat}`. Longitude and latitude are degrees.

## Scene

- Ocean: one plane with a procedural vertical gradient canvas texture, dark blue.
- Continents: six simplified outlines embedded in `CONTINENTS` as lon and lat rings,
  extruded together into a single geometry, so all land is one draw call.
- Grid: a faint `GridHelper` over the ocean.
- Stop: a group carrying the pin cone, the ring, the figure, the padlock, the plate
  sprite, three star sprites and the SOON stamp sprite. The group holds
  `userData.stopId`, which is what picking reads.

Plates are drawn once per stop into a 512 by 160 canvas: rounded plate, bold condensed
white text with a dark outline, city line in gold.

## Interaction

- The camera drifts slowly around the centre of the map.
- Hover or press eases the drift to a stop (`driftWeight`) and eases the camera towards
  the stop.
- Tap on an unlocked stop calls `onSelect(stopId)`.
- Tap on a locked stop calls `onLocked(stopId)`, shakes the pin for half a second and
  fades a SOON stamp above it.

## Performance

Target is 60 fps on a laptop.

- Draw calls stay under 50: ocean, land and grid are 3, and each of the five stops adds
  the pin, the ring or the padlock, the figure, the plate and three stars. Measured in
  Chrome on the five default stops it sits between 20 and 30 per frame.
- Geometries and materials are created once and shared across the stops.
- The frame loop allocates nothing: the raycaster, the ndc point, the rect and the two
  vectors used for the camera are preallocated, and the loop only writes into existing
  objects.
- The pixel ratio is capped at 2.

## Layout math

`lonLatToMap` is an equirectangular projection onto the plane: east is +x, north is -z.
`layoutStops` then runs a few relaxation passes so that two stops in the same city, such
as Chatelet and Barbes, stay at least `MIN_PIN_GAP` world units apart and their plates
stay readable.

## Tests

```bash
npm run test:map
```

- `tests/map/layout.test.ts` - projection, clamping, pin spacing, star slots, drift easing,
  the embedded continent rings.
- `tests/map/state.test.ts` - unlock and star state, clamping, locked stops never earn stars.
- `tests/map/pick.test.ts` - pointer to normalized device coordinates and stop lookup
  through a mocked raycaster, including hits on child objects of a stop group.

The tests cover the pure helpers only, so they run without a GPU or a DOM.
