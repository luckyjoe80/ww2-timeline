# WW2 Day by Day

The Second World War day by day on a zoomable world map. Pick a timeline, step or play through its events, and the map flies to each one with a panel of detail, links to Wikipedia and related events in other timelines. Atlases present subjects that are about places rather than dates, such as where the B-17 was built.

Plain HTML, CSS and JavaScript with [Leaflet](https://leafletjs.com/). No build step and no dependencies to install.

## Running it

Serve the folder with any static web server and open it in a browser, for example:

```bash
python -m http.server 8417
```

Then visit <http://localhost:8417>. Deep links work: `#battle-of-midway/1942-06-04/<event-id>` for a timeline event, `#b17-production/overview` for an atlas.

## Contents

| Group | Timeline / atlas | File |
| --- | --- | --- |
| War in the Pacific | The Road to Pearl Harbor | `data/timelines/road-to-pearl-harbor.js` |
| | The Attack on Hawaii | `data/timelines/attack-on-hawaii.js` |
| | From Pearl Harbor to Guadalcanal | `data/timelines/pearl-harbor-to-guadalcanal.js` |
| | The Road to Tokyo Bay | `data/timelines/road-to-tokyo-bay.js` |
| | Submarine Operations | `data/timelines/pacific-submarines.js` |
| Pacific Battles | The Fall of the Philippines | `data/timelines/philippines-1941-42.js` |
|  | Malaya and Singapore | `data/timelines/malaya-singapore.js` |
|  | The Battle of the Java Sea | `data/timelines/java-sea.js` |
|  | The Battle of the Coral Sea | `data/timelines/coral-sea.js` |
|  | The Battle of Midway | `data/timelines/battle-of-midway.js` |
|  | The Kokoda Track | `data/timelines/kokoda-track.js` |
|  | Guadalcanal | `data/timelines/guadalcanal.js` |
|  | Tarawa | `data/timelines/tarawa.js` |
|  | Imphal and Kohima | `data/timelines/imphal-kohima.js` |
|  | Saipan and the Philippine Sea | `data/timelines/saipan-philippine-sea.js` |
|  | The Battle of Leyte Gulf | `data/timelines/leyte-gulf.js` |
|  | The Kamikaze | `data/timelines/kamikaze.js` |
|  | Iwo Jima | `data/timelines/iwo-jima.js` |
|  | The Firebombing of Japan | `data/timelines/firebombing-of-japan.js` |
|  | Okinawa | `data/timelines/okinawa.js` |
| Technology | The Atomic Bomb | `data/timelines/atomic-bomb.js` |
|  | Radar | `data/timelines/radar.js` |
|  | Codes and Codebreaking | `data/timelines/codebreaking.js` |
|  | Submarine Technology | `data/timelines/submarine-technology.js` |
| Production | B-17 Production (atlas) | `data/atlases/b17-production.js` |
| Medals | Medal of Honor (every World War II award) | `data/timelines/medal-of-honor.js` |
| People | Isoroku Yamamoto | `data/timelines/yamamoto.js` |
| Ships | Battleship Yamato | `data/timelines/yamato.js` |

## Project layout

```
index.html              page shell and script order
app.js                  map, timeline bar, panel, overview, atlases, camera
styles.css              all styling
data/catalog.js         the picker's groups and per-timeline settings
data/wiki.js            phrase → Wikipedia article glossary for automatic links
data/places.js          period place labels shown on the map
data/intros.js          overview text and a line of atmosphere for each timeline
data/timelines/*.js     one file per timeline (fills WW2.events[id])
data/atlases/*.js       one file per atlas (fills WW2.atlases[id])
```

## Adding a timeline

1. Create `data/timelines/<id>.js` filling `WW2.events['<id>']`. The event schema is documented at the top of `data/timelines/attack-on-hawaii.js`.
2. Add an entry to `data/catalog.js` (options are documented at the top of that file).
3. Add a `<script>` tag for it in `index.html`, before `app.js`.
4. Add any new names to `data/wiki.js` so they link to Wikipedia.
5. Add its overview text and atmosphere line to `data/intros.js`.

A timeline can also color and filter by country instead of event type (`legend: 'country'`, with a `country` on each event, one or a list), and can offer a Connections view: a graph of story lanes with arrows from each event to those it led to (`stories` and `views` in the catalog, with `story` and `after` on each event). See the options at the top of `data/catalog.js` and the end of `data/timelines/codebreaking.js` for an example.

Optionally, direct the camera with a shot list (`scene`, `frame`, `shot`, `transition`); see "Shots" in `app.js` and the end of `data/timelines/battle-of-midway.js` for an example.

## Sources and credits

- Event text is written for this project and checked against the English Wikipedia articles named at the top of each data file. Times, dates and positions marked approximate are shown as such in the app.
- The Medal of Honor timeline is generated from Wikipedia by a build script; its event text is each recipient's official citation (a U.S. government work, in the public domain), as quoted in their article.
- Map tiles: Esri World Physical Map (source: US National Park Service) and World Shaded Relief, loaded from Esri's servers under their terms of use.
- Mapping library: Leaflet 1.9.4, loaded from cdnjs.
