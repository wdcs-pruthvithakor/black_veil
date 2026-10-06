# BLACK VEIL // Global Research & Anomaly Database

An interactive, cinematic and fictional intelligence archive. Open `index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

There is no build step. Three.js r128 loads from cdnjs and fonts load from Google Fonts. Everything else is local.

## Structure

| Path | Purpose |
|---|---|
| `index.html` | Landing/boot screen, loader, app shell, panels |
| `css/main.css` | Visual system, threat-level states, responsive layouts (desktop/tablet/mobile dossier), reduced motion |
| `data/world.js` | Natural Earth 110m land outlines (public domain), converted to `[lon,lat]` rings |
| `data/archive.js` | All content: sites, projects, specimens, documents, real cases, incidents, timeline |
| `js/globe.js` | WebGL globe (dot-matrix land, markers, arcs, drag/zoom/pinch) with a 2D fallback |
| `js/views.js` | Department views, investigation panel, document viewer (zoom/rotate/lens/UV/decrypt/compare) |
| `js/monitor.js` | Live Monitor: map, radar, time series, hydrophone, spectrogram, bio alerts |
| `js/story.js` | Investigation state, correlation, hidden narrative, endings, terminal |
| `js/audio.js` | Synthesized Web Audio sound design. Off by default |
| `js/fx.js` | Glitch/decrypt text, camera cuts, procedural satellite and evidence imagery, microscopy |

## Fact vs fiction

Every entry carries a label: **DOCUMENTED**, **UNVERIFIED**, **FICTIONALIZED** or **CLASSIFIED-STYLE FICTION**.
The *Unexplained* department contains only factual summaries of real cases, such as Tunguska, Roswell, the Wow! signal, Sverdlovsk, Vela and Nimitz. All facilities, projects, specimens and documents are invented.

## Controls

`` ` `` terminal · `M` sound · `Esc` close · Arrow keys in timeline · In documents: `+`/`-` zoom, `R` rotate, `U` UV light.
Progress is saved in `localStorage`. Use **Archive → Purge session** to reset.

<details><summary>Spoilers: the path to the reveal</summary>

1. Open 5 or more Black Veil files to trigger **CORRELATION DETECTED**. This unlocks *The Black Veil Protocol* and the hidden *Project Lantern*.
2. Play or read the Morse code in **Project ECHO**. In the terminal, `decode - .... .-. . ... .... --- .-.. -..` gives `THRESHOLD`.
3. Enter the passphrase in **Project ZERO** (or run `unlock THRESHOLD`).
4. Trace `-48.88 -123.39` (Zero's button, the near-invisible coordinates in the nav, or `trace -48.88 -123.39`) to reach **SITE NULL** and the two endings.

Extras: the Konami code, clicking the logo 7 times, `ls -a` / `cat .veil`, UV light on documents, compare mode, idling, and visiting at 03:17 UTC.
</details>
# black_veil
