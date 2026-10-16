(function () {
  'use strict';

  // ---------- Config ----------
  const DAY_MS = 86400000;
  const EPOCH = Date.UTC(1900, 0, 1);      // day 0 for internal day numbers
  const WAR_START = Date.UTC(1939, 8, 1);  // 1 Sep 1939 – invasion of Poland
  const WAR_END = Date.UTC(1945, 8, 2);    // 2 Sep 1945 – Japanese surrender
  // Playback pause on each event: time for the map to fly there plus time to read the panel.
  // Moving between events: pull back to show where we're going, hold, then fly in.
  const OUT_MS = 3600;
  const HOLD_MS = 800;
  const IN_MS = 4500;
  const FLY_MS = OUT_MS + HOLD_MS + IN_MS;
  const PULL_MARGIN_ZOOM = 0.75;  // pull back this much beyond the view that frames both places
  const DIRECT_ZOOM_GAP = 1.5;    // if that view is within this of the destination, fly straight there
  const SAME_PLACE_M = 2000;      // moves shorter than this skip the pull-back
  // Events farther than this from any labelled place are "at sea". The camera frames them with
  // their neighbours in the sequence (the action around them), or failing that the nearest
  // place, so the view isn't just water. Land beyond the max is too far to be useful context.
  const CONTEXT_MIN_M = 30000;
  const CONTEXT_MAX_M = 1200000;
  const NEIGHBOR_STEPS = 3;        // events either side considered as neighbours...
  const NEIGHBOR_DAYS = 1;         // ...if within this many days...
  const NEIGHBOR_M = 900000;       // ...and this far away
  const AT_SEA_MAX_ZOOM = 5;       // at sea with nothing around, frame no closer than this
  const AT_SEA_CONTEXT_MAX_ZOOM = 8; // at sea with neighbours or land framed
  const READING_MS_PER_WORD = 300; // ~200 words per minute, an unhurried reading pace
  const MIN_DWELL_MS = 4000;
  const MAX_DWELL_MS = 30000;
  const EMPTY_DAY_MS = 250;      // playback pace across days with no events (4 days a second)

  const TYPES = {
    attack: { label: 'Attack', color: '#c8402f' },
    loss: { label: 'Ship sunk or damaged', color: '#8e2a5c' },
    movement: { label: 'Fleet & aircraft movement', color: '#d08a2c' },
    intelligence: { label: 'Intelligence & warnings', color: '#7b5ea7' },
    political: { label: 'Political & diplomatic', color: '#3f78b5' },
    invasion: { label: 'Invasion & landings', color: '#7f6a3f' },
    'home-front': { label: 'Home front', color: '#2f8f8a' },
    construction: { label: 'Ship construction', color: '#5d7f99' },
    service: { label: 'Ship service & voyages', color: '#5a8a4e' },
    life: { label: 'Life & career', color: '#b08d57' },
  };

  // Countries for timelines whose legend is by country (catalog `legend: 'country'`), grouped
  // by side: Allied in cool colours, Axis in warm ones, so the sides read at a glance.
  const SIDES = {
    Allied: {
      'Britain': '#4f9bd6',
      'United States': '#3157a6',
      'Poland': '#4fb3a4',
      'Australia': '#6aa85a',
      'Soviet Union': '#9a7cc9',
      'Netherlands': '#9fbf8a',
    },
    Axis: {
      'Germany': '#c8402f',
      'Japan': '#e0a43c',
      'Italy': '#b8682a',
    },
  };
  const COUNTRY_COLORS = Object.assign({}, ...Object.values(SIDES));
  // A marker shared by several countries is split into equal slices of their colours.
  const splitFill = (colors) => `linear-gradient(90deg, ${colors.map((c, i) =>
    `${c} ${(i * 100) / colors.length}% ${((i + 1) * 100) / colors.length}%`).join(', ')})`;

  // 1941 offsets in minutes from GMT. Hawaii was on GMT−10:30 until 1947.
  const TIMEZONES = {
    HST: { offset: -630, label: 'Hawaii' },
    EST: { offset: -300, label: 'Eastern' },
    // US "war time" (year-round daylight saving, February 1942 – September 1945).
    EWT: { offset: -240, label: 'Eastern War Time' },
    CWT: { offset: -300, label: 'Central War Time' },
    MWT: { offset: -360, label: 'Mountain War Time' },
    PWT: { offset: -420, label: 'Pacific War Time' },
    JST: { offset: 540, label: 'Tokyo' },
    MYT: { offset: 450, label: 'Malaya' },
    ICT: { offset: 420, label: 'Thailand' },
    CHN: { offset: 480, label: 'China coast' },
    HKT: { offset: 480, label: 'Hong Kong' },
    PHT: { offset: 480, label: 'Manila' },
    ChST: { offset: 600, label: 'Guam' },
    WAKE: { offset: 720, label: 'Wake' },
    MID: { offset: -660, label: 'Midway' },
    SOL: { offset: 660, label: 'Solomons' },
    PNG: { offset: 600, label: 'Papua' },
    JAVA: { offset: 450, label: 'Java' },
    BURMA: { offset: 390, label: 'Burma' },
    IND: { offset: 330, label: 'India' },
    OKI: { offset: 540, label: 'Okinawa' },
    BST: { offset: 60, label: 'London' },
    CEST: { offset: 120, label: 'Central European' },
    GMT: { offset: 0, label: 'GMT' },
  };

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // ---------- Date helpers (all UTC, day-granular) ----------
  const parseISO = (s) => {
    const [y, m, d] = s.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  const toISO = (ms) => new Date(ms).toISOString().slice(0, 10);
  const dayToMs = (day) => EPOCH + day * DAY_MS;
  const msToDay = (ms) => Math.round((ms - EPOCH) / DAY_MS);
  const pad = (n) => String(n).padStart(2, '0');
  const fmtInt = (n) => n.toLocaleString('en-US');
  const formatLong = (ms) => {
    const d = new Date(ms);
    return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  };
  const formatShort = (ms) => {
    const d = new Date(ms);
    return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()].slice(0, 3)}`;
  };
  const formatMed = (ms) => `${formatShort(ms)} ${new Date(ms).getUTCFullYear()}`;
  const WAR_START_DAY = msToDay(WAR_START);
  const WAR_END_DAY = msToDay(WAR_END);

  // ---------- Data ----------
  // Each timeline: { meta, events, byDay, byId, start, end }. Each event gets
  // day (by local date), abs (GMT instant, for ordering within a day) and index.
  const timelines = new Map();

  function prepareTimeline(meta) {
    const events = ((window.WW2 && WW2.events[meta.id]) || [])
      .map((e) => {
        const tz = TIMEZONES[e.tz] || TIMEZONES.GMT;
        // `sortTime` places an event without a stated time within its day (not displayed).
        const [hh, mm] = (e.time || e.sortTime || '12:00').split(':').map(Number);
        const dateMs = parseISO(e.date);
        return {
          ...e,
          // Timeline-level Wikipedia overrides apply to every event, under the event's own.
          wiki: meta.wiki || e.wiki ? { ...meta.wiki, ...e.wiki } : undefined,
          tzInfo: tz,
          day: msToDay(dateMs),
          abs: dateMs + (hh * 60 + mm - tz.offset) * 60000,
          // A timeline can color by theater (e.g. by navy) or by country instead of by event type.
          // `country` may list several (an event involving both sides); the first sets the colour.
          color: (meta.legend === 'country' && COUNTRY_COLORS[[].concat(e.country)[0]])
            || (meta.colors && meta.colors[e.theater]) || (TYPES[e.type] || TYPES.attack).color,
          fill: meta.legend === 'country' && Array.isArray(e.country) && e.country.length > 1
            ? splitFill(e.country.map((c) => COUNTRY_COLORS[c] || '#888')) : null,
        };
      })
      .sort((a, b) => a.day - b.day || a.abs - b.abs);
    events.forEach((e, i) => { e.index = i; });

    const byDay = new Map();
    for (const e of events) {
      if (!byDay.has(e.day)) byDay.set(e.day, []);
      byDay.get(e.day).push(e);
    }
    return {
      meta,
      events,
      byDay,
      byId: new Map(events.map((e) => [e.id, e])),
      start: events.length ? events[0].day : WAR_START_DAY,
      end: events.length ? events[events.length - 1].day : WAR_END_DAY,
    };
  }

  const catalog = (window.WW2 && WW2.catalog) || [];
  const atlases = new Map(); // atlas id -> { meta } (data lives in WW2.atlases)
  (function collect(nodes) {
    for (const n of nodes) {
      if (n.children) collect(n.children);
      else if (n.kind === 'atlas') atlases.set(n.id, { meta: n });
      else timelines.set(n.id, prepareTimeline(n));
    }
  })(catalog);

  // Overall navigable range: every timeline plus the whole war.
  const MIN_DAY = Math.min(WAR_START_DAY, ...[...timelines.values()].map((t) => t.start)) - 30;
  const MAX_DAY = Math.max(WAR_END_DAY, ...[...timelines.values()].map((t) => t.end));
  const clampDay = (d) => Math.max(MIN_DAY, Math.min(MAX_DAY, d));
  const DEFAULT_TIMELINE = ([...timelines.values()].find((t) => t.meta.default) || [...timelines.values()][0]).meta.id;

  // ---------- Wikipedia links ----------
  // Links the first mention of each article in an event's text, using the glossary in
  // data/wiki.js plus any per-event `wiki` overrides (null suppresses a glossary entry).
  const WIKI = (window.WW2 && WW2.wiki) || {};
  const reEscape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function buildLinker(dict) {
    // Text is HTML-escaped before matching, so match against escaped phrases too.
    const titles = new Map(Object.entries(dict).filter(([, t]) => t).map(([k, t]) => [esc(k), t]));
    const alts = [...titles.keys()].sort((a, b) => b.length - a.length).map(reEscape).join('|');
    // Whole words only; allow a plural "s" (Zeros, B-17s).
    const re = new RegExp(`(?<![\\p{L}\\p{N}])(?:${alts})s?(?![\\p{L}\\p{N}])`, 'gu');
    return { titles, re };
  }
  const globalLinker = buildLinker(WIKI);
  const linkerFor = (ev) => (ev.wiki ? (ev._linker ||= buildLinker({ ...WIKI, ...ev.wiki })) : globalLinker);

  // Returns escaped HTML. `used` (a Set of titles) is shared across one event's fields.
  function linkify(text, ev, used) {
    const { titles, re } = linkerFor(ev);
    return esc(text).replace(re, (m) => {
      const title = titles.get(m) || (m.endsWith('s') ? titles.get(m.slice(0, -1)) : undefined);
      if (!title || used.has(title)) return m;
      used.add(title);
      const href = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(title).replace(/%2C/g, ',');
      return `<a class="wiki" href="${href}" target="_blank" rel="noopener noreferrer" title="Wikipedia: ${esc(title.replace(/_/g, ' '))}">${m}</a>`;
    });
  }

  function localTimeLabel(ev) {
    if (!ev.time) return ev.approx ? 'date approximate' : '';
    return `${ev.approx ? 'c. ' : ''}${ev.time} ${ev.tzInfo.label} time`;
  }
  function gmtLabel(ev) {
    const d = new Date(ev.abs);
    const sameDate = toISO(ev.abs) === ev.date;
    return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} GMT${sameDate ? '' : ' ' + formatShort(ev.abs)}`;
  }

  // ---------- DOM ----------
  const $ = (id) => document.getElementById(id);
  const slider = $('slider');
  const playBtn = $('btn-play');
  const panel = $('panel');
  const panelBody = $('panel-body');
  const dayStrip = $('day-strip');
  const dayChips = $('day-strip-chips');
  const menuToggle = $('menu-toggle');

  // ---------- Map ----------
  const map = L.map('map', {
    center: [25, 10],
    zoom: 2,
    minZoom: 1.5, // raised to one world's width once the map has a size (see setWorld)
    maxZoom: 13, // as far as the shaded relief goes: no satellite views
    maxBoundsViscosity: 1, // the edges of the world are hard stops
    bounceAtZoomLimits: false, // a pinch can't overshoot the minimum zoom and reveal another copy
    zoomSnap: 0.5,
    zoomControl: false,
  });
  L.control.zoom({ position: 'topleft' }).addTo(map);

  // The map is one finite world (see setWorld): markers, labels, framing, flights and the
  // limits on panning and zooming all live in that single window. The tiles alone wrap, as
  // scenery, so wherever the view runs past an edge (behind the text panel, or mid-flight)
  // the map simply continues instead of showing blank.
  let worldCenter = 0;
  const WorldTiles = L.TileLayer;
  const worldTiles = [];
  // Shared by both tile layers: keep more off-screen tiles so panning back is instant. (They
  // still load at each zoom level a flight passes through; prefetchView warms those levels.)
  const TILE_OPTIONS = { keepBuffer: 6 };

  // Physical base map: no modern borders or place names to clash with a 1940s view. Its data
  // is only ~1.2 km per pixel, so it gets soft from about z7 and tiles stop at z8; from
  // RELIEF_FROM_ZOOM the shaded relief below takes over (this layer stays underneath as a
  // placeholder while relief tiles load).
  const RELIEF_FROM_ZOOM = 7;
  worldTiles.push(new WorldTiles('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
    ...TILE_OPTIONS,
    maxNativeZoom: 8,
    attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
  }).addTo(map));

  // Shaded relief from RELIEF_FROM_ZOOM to the map's maximum, z13: worldwide, and like the
  // physical map free of modern roads and names.
  // It crossfades in over the zoom level below RELIEF_FROM_ZOOM rather than switching at once:
  // a hard switch swaps every tile in a single frame, which flashes as camera moves pass it.
  const RELIEF_FADE = 1; // zoom levels to fade across, ending fully opaque at RELIEF_FROM_ZOOM
  const relief = new WorldTiles('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', {
    ...TILE_OPTIONS,
    minZoom: RELIEF_FROM_ZOOM - RELIEF_FADE - 0.5, // loaded a little before it starts to show
    maxNativeZoom: 13,
    attribution: 'Relief &copy; Esri',
  }).addTo(map);
  worldTiles.push(relief);
  const reliefOpacity = (z) => Math.min(1, Math.max(0, (z - (RELIEF_FROM_ZOOM - RELIEF_FADE)) / RELIEF_FADE));
  map.on('zoom', () => relief.setOpacity(reliefOpacity(map.getZoom())));          // each frame of a flight
  map.on('zoomanim', (e) => relief.setOpacity(reliefOpacity(e.zoom)));           // wheel/button zooms (CSS-animated)
  relief.setOpacity(reliefOpacity(map.getZoom()));

  window.ww2Map = map; // handy for debugging in the console

  // Warm the browser cache with the tiles a camera move will show, so they're there when it
  // arrives instead of loading in patches. `bounds` and `opts` are as for fitBounds. With
  // `fromZoom`, also warm each whole zoom level between it and the landing zoom, around the
  // landing point: a flight passes through those levels on its way in (or out).
  let prefetched = [];
  function prefetchView(bounds, opts = {}, fromZoom = null) {
    const size = map.getSize();
    if (!size.x || !bounds.isValid()) return;
    const { center, zoom: landing } = map._getBoundsCenterZoom(bounds, opts);
    const zooms = [landing];
    if (fromZoom !== null) {
      const lo = Math.min(fromZoom, landing);
      const hi = Math.max(fromZoom, landing);
      for (let z = Math.ceil(lo); z < hi; z++) if (Math.abs(z - landing) <= 4) zooms.push(z); // the last few levels matter most
    }
    const imgs = [];
    for (const zoom of zooms) imgs.push(...tilesFor(center, zoom, size));
    prefetched = imgs; // hold references until the next move
  }
  function tilesFor(center, zoom, size) {
    const half = size.divideBy(2);
    const mid = map.project(center, zoom);
    const imgs = [];
    for (const layer of worldTiles) {
      if (zoom < (layer.options.minZoom ?? 0)) continue;
      const z = Math.min(Math.round(zoom), layer.options.maxNativeZoom ?? zoom);
      const scale = 2 ** (z - zoom);
      const n = 2 ** z;
      const min = mid.subtract(half).multiplyBy(scale).divideBy(256).floor();
      const max = mid.add(half).multiplyBy(scale).divideBy(256).floor();
      for (let y = Math.max(0, min.y); y <= Math.min(n - 1, max.y); y++) {
        for (let x = min.x; x <= max.x; x++) {
          const img = new Image();
          img.src = L.Util.template(layer._url, { z, y, x: ((x % n) + n) % n });
          imgs.push(img);
        }
      }
    }
    return imgs;
  }

  // Leaflet keeps the view inside maxBounds on every moveend, including the one fired when the
  // map is resized (e.g. the bar below it changes height on a timeline switch). Mid-flight that
  // snaps the view and kills the flight, so skip the check while flying; it runs when the flight
  // lands, as the flight's own moveend goes through _moveEnd.
  const leafletFlyTo = map.flyTo;
  map.flyTo = function (...args) { this._ww2Flying = true; return leafletFlyTo.apply(this, args); };
  const leafletMoveEnd = map._moveEnd;
  map._moveEnd = function (...args) { this._ww2Flying = false; return leafletMoveEnd.apply(this, args); };
  // And keep it inside without animating: an animated nudge can still be running when the app
  // frames a view (e.g. at startup) and carry on sliding the map off the framed event.
  map._panInsideMaxBounds = function () {
    if (this._ww2Flying || this._enforcingBounds || !this.options.maxBounds) return;
    this.panInsideBounds(this.options.maxBounds, { animate: false });
  };

  // ---------- One finite world ----------
  // The map shows a single copy of the world, 360° wide, centered on a longitude chosen per
  // timeline or atlas (catalog `centerLng`, or the middle of its events), so a Pacific
  // timeline isn't split at 180°. Everything drawn is moved into that window with wrapLng.
  const wrapLng = (lng) => lng + Math.round((worldCenter - lng) / 360) * 360;
  const wrapLatLng = (lat, lng) => L.latLng(lat, wrapLng(lng));
  function setWorld(centerLng) {
    const c = Math.round(centerLng);
    worldCenter = c;
    // Not setMaxBounds: it starts an animated pan inside the new bounds, which cancels the fly
    // (or undoes the fit) that always follows a switch of world. Set the bounds and keep the
    // usual moveend check instead; the view lands inside them anyway.
    if (!map.options.maxBounds) map.on('moveend', map._panInsideMaxBounds);
    updateMinZoom();
    updateWorldBounds();
    fitMini();
  }
  // How far the view may go: the single world, plus, past its east edge, the width of the text
  // panel at that zoom. An event near the edge can then still be framed in the open map left
  // of the panel; whatever blank lies beyond the edge stays behind the panel.
  function worldBounds(z) {
    const room = window.innerWidth > 640 && !panel.hidden ? panelRoom() : 0;
    const extra = (room / (256 * 2 ** z)) * 360;
    return L.latLngBounds([[-85, worldCenter - 180], [85, worldCenter + 180 + extra]]);
  }
  function updateWorldBounds() { map.options.maxBounds = worldBounds(map.getZoom()); }
  map.on('zoomend', updateWorldBounds);
  // Never zoom out past the point where one world no longer fills the map.
  function updateMinZoom() {
    const { x, y } = map.getSize();
    if (!x || !y) return;
    const min = Math.max(Math.log2(x / 256), Math.log2(y / 256));
    // Not setMinZoom: it animates up to a raised minimum, and that animation can land after a
    // fit made in the meantime (e.g. at startup) and undo it. Jump there instead.
    if (min === map.options.minZoom) return;
    map.options.minZoom = min;
    if (map.getZoom() < min) map.setView(map.getCenter(), min, { animate: false });
    map.fire('zoomlevelschange');
  }

  // ---------- Overview inset ----------
  // A small, fixed world map (centered like the main map) with a box showing the main map's view.
  const MINI_LAT = 15;
  const miniEl = document.getElementById('minimap');
  const mini = L.map(miniEl, {
    zoomControl: false, attributionControl: false,
    dragging: false, scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false,
    keyboard: false, touchZoom: false, zoomSnap: 0, minZoom: -2, inertia: false,
  });
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
    minZoom: -2, maxNativeZoom: 8,
  }).addTo(mini);
  // Three copies of the box (±360°) so it still shows when the view straddles the inset's edge.
  const viewBoxes = [-360, 0, 360].map(() =>
    L.rectangle([[0, 0], [0, 0]], { color: '#c8402f', weight: 2, fillColor: '#c8402f', fillOpacity: 0.15, interactive: false }).addTo(mini));
  // When zoomed in so far that the box would be a speck, show a marker instead.
  const viewDot = L.circleMarker([0, 0], { radius: 5, color: '#c8402f', weight: 2, fillColor: '#c8402f', fillOpacity: 0.6, interactive: false });

  function fitMini() {
    mini.invalidateSize();
    // Show the whole world's width.
    mini.setView([MINI_LAT, worldCenter], Math.log2(miniEl.clientWidth / 256), { animate: false });
    updateMini();
  }
  function updateMini() {
    if (!miniEl.clientWidth || !mini._loaded) return; // inset not sized yet (or hidden on phones)
    const b = map.getBounds();
    const south = Math.max(-85, b.getSouth());
    const north = Math.min(85, b.getNorth());
    let west = b.getWest();
    let east = b.getEast();
    if (east - west >= 360) {
      west = worldCenter - 180;
      east = worldCenter + 180;
    } else {
      const shift = Math.round((worldCenter - (west + east) / 2) / 360) * 360; // into the inset's world copy
      west += shift;
      east += shift;
    }
    [-360, 0, 360].forEach((s, i) => viewBoxes[i].setBounds([[south, west + s], [north, east + s]]));
    const sw = mini.latLngToContainerPoint([south, west]);
    const ne = mini.latLngToContainerPoint([north, east]);
    const tiny = Math.abs(ne.x - sw.x) < 8 && Math.abs(ne.y - sw.y) < 8;
    viewBoxes.forEach((r) => r.setStyle({ opacity: tiny ? 0 : 1, fillOpacity: tiny ? 0 : 0.15 }));
    if (tiny) viewDot.setLatLng([(south + north) / 2, (west + east) / 2]).addTo(mini);
    else viewDot.remove();
  }
  map.on('move zoom', updateMini);
  // Clicking the inset recenters the main map there, keeping its zoom.
  mini.on('click', (e) => { pause(); map.flyTo(e.latlng, map.getZoom(), { duration: 1 }); });
  new ResizeObserver(fitMini).observe(miniEl);

  L.control.scale({ imperial: true, metric: true, position: 'bottomleft' }).addTo(map);

  // Legend lists only the categories (event types, or the timeline's own `colors` keys) used
  // by the current timeline, and doubles as a filter: hidden categories disappear from the map,
  // the timeline bar, the day strip, stepping and playback.
  let legendDiv;
  const hiddenKeys = new Set(); // legend categories currently hidden
  // An event's legend categories: its type or theater, or its countries (one or several).
  const legendKeys = (e) => (tl.meta.filter === 'story' ? [e.story]
    : tl.meta.legend === 'country' ? [].concat(e.country) : [tl.meta.colors ? e.theater : e.type]);
  const legendKey = (e) => legendKeys(e)[0]; // the main one, which sets its colour
  // A legend group (a side, for country legends) and the categories it holds.
  const groupKeys = (side) => Object.keys(SIDES[side] || {});
  const isShown = (e) => legendKeys(e).some((k) => !hiddenKeys.has(k)); // shown if any of its categories is
  const inPeriod = (e) => e.day >= view.start && e.day <= view.end; // within the bar's zoomed period
  let shown = []; // the current timeline's events that pass the filter, in order
  const legend = L.control({ position: 'bottomleft' });
  legend.onAdd = () => {
    legendDiv = L.DomUtil.create('div', 'legend');
    L.DomEvent.disableClickPropagation(legendDiv);
    return legendDiv;
  };
  legend.addTo(map);
  function renderLegend() {
    if (tl.meta.filter === 'story') return renderStoryLegend();
    if (tl.meta.legend === 'country') return renderCountryLegend();
    const entries = tl.meta.colors
      ? Object.entries(tl.meta.colors).map(([key, color]) => ({ key, label: key, color }))
      : Object.entries(TYPES).map(([key, t]) => ({ key, label: t.label, color: t.color }));
    // Categories come from the whole timeline; counts from the period shown on the bar.
    const present = new Set(tl.events.map(legendKey));
    const counts = {};
    for (const e of tl.events) if (inPeriod(e)) counts[legendKey(e)] = (counts[legendKey(e)] || 0) + 1;
    const used = entries.filter((t) => present.has(t.key));
    // Always present (disabled when nothing is hidden) so the legend never changes size.
    const showAll = `<button type="button" class="legend-showall" data-show-all ${hiddenKeys.size ? '' : 'disabled'}>Show all</button>`;
    legendDiv.innerHTML = `<div class="legend-hint"><span>${overview ? 'Hover to preview · ' : ''}Click to select</span>${showAll}</div>` + used.map((t) =>
      `<button type="button" class="legend-item${hiddenKeys.has(t.key) ? ' off' : ''}" data-key="${esc(t.key)}" aria-pressed="${!hiddenKeys.has(t.key)}">
        <i style="background:${t.color}"></i>${esc(t.label)}<span class="legend-count">${counts[t.key] || 0}</span></button>`).join('');
  }
  // Stories as the filter (one click focuses on a single story), with a key to the country
  // colours the events keep.
  function renderStoryLegend() {
    const present = new Set(tl.events.map((e) => e.story));
    const counts = {};
    for (const e of tl.events) if (inPeriod(e)) counts[e.story] = (counts[e.story] || 0) + 1;
    const showAll = `<button type="button" class="legend-showall" data-show-all ${hiddenKeys.size ? '' : 'disabled'}>Show all</button>`;
    const stories = Object.entries(tl.meta.stories).filter(([id]) => present.has(id)).map(([id, label]) =>
      `<button type="button" class="legend-item story${hiddenKeys.has(id) ? ' off' : ''}" data-key="${esc(id)}" aria-pressed="${!hiddenKeys.has(id)}">
        <i></i>${esc(label)}<span class="legend-count">${counts[id] || 0}</span></button>`).join('');
    const countries = [...new Set(tl.events.flatMap((e) => [].concat(e.country || [])))];
    const key = countries.length
      ? `<div class="legend-key">${Object.values(SIDES).flatMap((side) => Object.entries(side))
        .filter(([c]) => countries.includes(c)).map(([c, color]) => `<span><i style="background:${color}"></i>${esc(c)}</span>`).join('')}</div>`
      : '';
    legendDiv.innerHTML = `<div class="legend-hint"><span>${overview ? 'Hover to preview · ' : ''}Click a story to focus on it</span>${showAll}</div>${stories}${key}`;
  }

  // Countries listed under their side. A side's heading selects or clears all its countries.
  function renderCountryLegend() {
    const present = new Set(tl.events.flatMap(legendKeys));
    const counts = {};
    for (const e of tl.events) if (inPeriod(e)) for (const k of legendKeys(e)) counts[k] = (counts[k] || 0) + 1;
    const showAll = `<button type="button" class="legend-showall" data-show-all ${hiddenKeys.size ? '' : 'disabled'}>Show all</button>`;
    const item = (key, color) =>
      `<button type="button" class="legend-item${hiddenKeys.has(key) ? ' off' : ''}" data-key="${esc(key)}" aria-pressed="${!hiddenKeys.has(key)}">
        <i style="background:${color}"></i>${esc(key)}<span class="legend-count">${counts[key] || 0}</span></button>`;
    const groups = Object.entries(SIDES).map(([side, countries]) => {
      const keys = Object.keys(countries).filter((k) => present.has(k));
      if (!keys.length) return '';
      // A side's count is of events, so one shared by two of its countries counts once.
      const total = tl.events.filter((e) => inPeriod(e) && legendKeys(e).some((k) => keys.includes(k))).length;
      const off = keys.every((k) => hiddenKeys.has(k));
      return `<button type="button" class="legend-group${off ? ' off' : ''}" data-group="${esc(side)}" aria-pressed="${!off}">${esc(side)}<span class="legend-count">${total}</span></button>`
        + keys.map((k) => item(k, countries[k])).join('');
    }).join('');
    legendDiv.innerHTML = `<div class="legend-hint"><span>${overview ? 'Hover to preview · ' : ''}Click to select</span>${showAll}</div>` + groups;
  }

  // Click selects: with everything showing, a click shows only that category (what the hover
  // preview showed); further clicks add or remove categories; removing the last shows all again.
  legendDiv.addEventListener('click', (e) => {
    if (atlas) {
      atlasLegendClick(e);
      return;
    }
    previewKey = null; // let the result of the click show straight away
    if (e.target.closest('[data-show-all]')) {
      hiddenKeys.clear();
      applyFilter();
      return;
    }
    const keys = [...legendDiv.querySelectorAll('[data-key]')].map((b) => b.dataset.key);
    const group = e.target.closest('[data-group]');
    if (group) {
      // A side works like one category: alone first, then added or removed as a whole.
      const mine = groupKeys(group.dataset.group).filter((k) => keys.includes(k));
      if (hiddenKeys.size === 0) keys.filter((k) => !mine.includes(k)).forEach((k) => hiddenKeys.add(k));
      else if (mine.some((k) => hiddenKeys.has(k))) mine.forEach((k) => hiddenKeys.delete(k));
      else {
        mine.forEach((k) => hiddenKeys.add(k));
        if (keys.every((k) => hiddenKeys.has(k))) hiddenKeys.clear();
      }
      applyFilter();
      return;
    }
    const btn = e.target.closest('[data-key]');
    if (!btn) return;
    const key = btn.dataset.key;
    if (hiddenKeys.size === 0) {
      keys.filter((k) => k !== key).forEach((k) => hiddenKeys.add(k));
    } else if (hiddenKeys.has(key)) {
      hiddenKeys.delete(key);
    } else {
      hiddenKeys.add(key);
      if (keys.every((k) => hiddenKeys.has(k))) hiddenKeys.clear();
    }
    applyFilter();
  });

  // In overview, hovering a legend entry temporarily shows only that category's dots.
  let previewKey = null;
  function setPreview(key) {
    if (atlas) {
      if (key === atlasPreview) return;
      atlasPreview = key;
      renderAtlasMap();
      return;
    }
    if (!overview || key === previewKey) return;
    previewKey = key;
    buildOverview();
  }
  legendDiv.addEventListener('pointerover', (e) => {
    const group = e.target.closest('[data-group]');
    setPreview(group ? `side:${group.dataset.group}` : e.target.closest('[data-key]')?.dataset.key || null);
  });
  // Whether an event belongs to the hovered legend entry (a category, or a whole side).
  const inPreview = (ev) => legendKeys(ev).some((k) => (previewKey.startsWith('side:')
    ? groupKeys(previewKey.slice(5)).includes(k)
    : k === previewKey));
  legendDiv.addEventListener('pointerleave', () => setPreview(null));

  // Re-apply the legend filter everywhere. If the selected event is now hidden, deselect it.
  function applyFilter() {
    shown = tl.events.filter(isShown);
    if (selected && !isShown(selected)) selected = null;
    map.closePopup();
    renderLegend();
    buildTrack();
    if (overview) buildOverview();
    render();
  }

  // ---------- Place labels ----------
  // Period place names from data/places.js. Each label exists in three world copies so it
  // shows up beside events whose views cross the antimeridian.
  const PLACES = ((window.WW2 && WW2.places) || []).map(([name, lat, lng, minZoom, maxZoom = Infinity]) => ({ name, lat, lng, minZoom, maxZoom }));
  const placeLabels = PLACES.flatMap((p) => [-360, 0, 360].map((shift) => ({
    minZoom: p.minZoom,
    maxZoom: p.maxZoom,
    marker: L.marker([p.lat, p.lng + shift], {
      icon: L.divIcon({ className: 'place-label', html: `<i></i><span>${esc(p.name)}</span>`, iconSize: null }),
      interactive: false,
      keyboard: false,
      zIndexOffset: -1000,
    }),
  })));
  function updatePlaceLabels() {
    const z = map.getZoom();
    for (const l of placeLabels) {
      const show = z >= l.minZoom && z <= l.maxZoom;
      if (show !== map.hasLayer(l.marker)) show ? l.marker.addTo(map) : l.marker.remove();
    }
  }
  map.on('zoomend', updatePlaceLabels);
  updatePlaceLabels();

  // The nearest labelled place to a point, with its longitude moved into the point's world copy.
  function nearestPlace(latlng) {
    let best = null;
    for (const p of PLACES) {
      const lng = p.lng + Math.round((latlng.lng - p.lng) / 360) * 360;
      const d = latlng.distanceTo([p.lat, lng]);
      if (!best || d < best.dist) best = { ...p, lng, dist: d };
    }
    return best;
  }

  // Make consecutive points continuous across the antimeridian, then shift the whole
  // line by ±360° so it sits in the same world copy as the event's marker.
  function unwrap(coords, refLng) {
    const out = [];
    for (const [lat, lng0] of coords) {
      let lng = lng0;
      if (out.length) {
        const prev = out[out.length - 1][1];
        while (lng - prev > 180) lng -= 360;
        while (lng - prev < -180) lng += 360;
      }
      out.push([lat, lng]);
    }
    let best = 0;
    let bestDist = Infinity;
    for (const shift of [-360, 0, 360]) {
      const d = Math.min(...out.map(([, lng]) => Math.abs(lng + shift - refLng)));
      if (d < bestDist) { bestDist = d; best = shift; }
    }
    return out.map(([lat, lng]) => [lat, lng + best]);
  }

  // Per event (keyed by event object): a marker, shown while the event is recent,
  // and a path group, shown only on the event's own day.
  const layers = new Map();
  for (const t of timelines.values()) {
    for (const ev of t.events) {
      const icon = L.divIcon({
        className: 'event-marker',
        html: `<div class="ring" style="--marker-color:${ev.color}"></div><div class="dot" style="--marker-color:${ev.color}${ev.fill ? `;--marker-fill:${ev.fill}` : ''}"></div>`,
        iconSize: [28, 28],
      });
      const when = [formatLong(dayToMs(ev.day)), localTimeLabel(ev)].filter(Boolean).join(' · ');
      const marker = L.marker([ev.location.lat, ev.location.lng], { icon, title: ev.title, riseOnHover: true })
        .bindTooltip(`<strong>${esc(ev.title)}</strong><br><span class="tip-time">${esc(when)}</span>`, {
          className: 'event-tip', direction: 'top', offset: [0, -10],
        })
        .on('click', () => { pause(); selectEvent(ev); });

      const paths = (ev.paths || []).map((p) =>
        L.polyline(unwrap(p.coords, ev.location.lng), {
          color: ev.color,
          weight: 3,
          opacity: 0.9,
          dashArray: p.kind === 'strike' ? '8 4' : null,
          className: p.kind === 'strike' ? 'path-strike' : '',
        }).bindTooltip(esc(p.label), { className: 'event-tip', sticky: true })
      );

      layers.set(ev, { marker, paths, pathGroup: L.layerGroup(paths), shown: false, pathsShown: false });
    }
  }

  function hideLayers(ev) {
    const lyr = layers.get(ev);
    if (lyr.shown) { lyr.marker.remove(); lyr.shown = false; }
    if (lyr.pathsShown) { lyr.pathGroup.remove(); lyr.pathsShown = false; }
  }

  // ---------- State ----------
  let tl = null;           // current timeline
  let currentDay = WAR_START_DAY;
  let selected = null;     // the event shown in the panel / highlighted on the map
  let panelClosed = false; // user dismissed the panel for the current selection
  let playing = false;
  let playTimer = null;
  let countdown = null;    // { start, end } of the current playback pause, for the panel countdown
  let countdownTimer = null;
  let view = { start: MIN_DAY, end: MAX_DAY };
  let stripDay = null;
  let mapReady = false;

  const eventsOn = (day) => (tl.byDay.get(day) || []).filter(isShown);

  // ---------- Timelines ----------
  function setTimeline(id, { dateISO, eventId, fly = true } = {}) {
    if (atlases.has(id)) {
      enterAtlas(id, 0, { overview: true });
      return;
    }
    // Opening a timeline shows its overview; a deep link or cross-timeline link to a
    // particular day or event goes straight there instead.
    const startInOverview = !eventId && !dateISO;
    exitAtlas();
    pause();
    if (tl) tl.events.forEach(hideLayers);
    tl = timelines.get(id) || timelines.get(DEFAULT_TIMELINE);
    forgetShot();
    setWorld(tl.meta.centerLng ?? overviewCenterLng(tl.events));
    for (const e of tl.events) {
      const lyr = layers.get(e);
      lyr.marker.setLatLng(wrapLatLng(e.location.lat, e.location.lng));
      (e.paths || []).forEach((p, i) => lyr.paths[i].setLatLngs(unwrap(p.coords, wrapLng(e.location.lng))));
    }
    stripDay = null;
    $('timeline-title').textContent = tl.meta.title;
    setView((tl.meta.views || [])[0]);
    hiddenKeys.clear();
    shown = tl.events.slice();
    renderLegend();
    renderPicker();

    const ev = eventId ? tl.byId.get(eventId) : null;
    const day = dateISO ? msToDay(parseISO(dateISO)) : ev ? ev.day : tl.start;
    currentDay = clampDay(day);
    setTrackZoom({ kind: 'all' }, currentDay);
    goToDay(currentDay, { fly: false });
    if (ev && ev.day === currentDay) selectEvent(ev, { fly: false });
    if (startInOverview) enterOverview({ animate: fly && mapReady });
    else if (fly && mapReady && selected) flyToEvent(selected);
  }

  // ---------- Navigation ----------
  // Go to a day and select its first (or last) event, if any.
  function goToDay(day, { pick = 'first', fly = true } = {}) {
    exitOverview();
    currentDay = clampDay(day);
    const today = eventsOn(currentDay);
    selected = today.length ? (pick === 'last' ? today[today.length - 1] : today[0]) : null;
    panelClosed = false;
    ensureInView(currentDay);
    render();
    if (fly && selected) flyToEvent(selected);
  }

  function selectEvent(ev, { fly = true } = {}) {
    exitOverview();
    selected = ev;
    panelClosed = false;
    if (ev.day !== currentDay) {
      currentDay = ev.day;
      ensureInView(currentDay);
    }
    render();
    if (fly) flyToEvent(ev);
  }

  // Step through individual events in order, crossing days as needed.
  function adjacentEvent(direction) {
    if (selected && selected.day === currentDay && isShown(selected)) return shown[shown.indexOf(selected) + direction];
    if (direction > 0) return shown.find((e) => e.day >= currentDay);
    return [...shown].reverse().find((e) => e.day < currentDay);
  }

  function stepEvent(direction) {
    const target = adjacentEvent(direction);
    if (target) selectEvent(target);
  }

  // ---------- Focal flights ----------
  // Leaflet's flyTo animates the map's centre, so an event framed off-centre (left of the panel)
  // drifts to the middle of the screen mid-flight and only slides into place at the end. This
  // flies the same smooth zoom-out/zoom-in curve (van Wijk & Nuij, as Leaflet does) but on a
  // focal point held at a fixed spot on screen: where the subject will sit when the flight lands.
  function flyFocal(subject, targetZoom, focusPt, durationMs, { inWorld = false } = {}) {
    map._stop();
    const size = map.getSize();
    const delta = size.divideBy(2).subtract(focusPt); // map centre relative to the focal spot, in px
    const startZoom = map.getZoom();
    const from = map.project(map.containerPointToLatLng(focusPt), startZoom);
    const to = map.project(subject, startZoom);
    // Each frame stays inside the single world: on a long flight the straight path would
    // otherwise swing the view past the world's edge, sweeping blank map across the screen.
    const centerFor = (focalPx, z) => softLimitCenter(map.project(map.unproject(focalPx, startZoom), z).add(delta), z);
    const w0 = Math.max(size.x, size.y);
    const w1 = w0 * map.getZoomScale(startZoom, targetZoom);
    const u1 = to.distanceTo(from) || 1;
    const rho = 1.42, rho2 = rho * rho;
    const sinh = (n) => (Math.exp(n) - Math.exp(-n)) / 2;
    const cosh = (n) => (Math.exp(n) + Math.exp(-n)) / 2;
    const tanh = (n) => sinh(n) / cosh(n);
    const rr = (i) => {
      const s1 = i ? -1 : 1, s2 = i ? w1 : w0;
      const b = (w1 * w1 - w0 * w0 + s1 * rho2 * rho2 * u1 * u1) / (2 * s2 * rho2 * u1);
      const sq = Math.sqrt(b * b + 1) - b;
      return sq < 1e-9 ? -18 : Math.log(sq);
    };
    const r0 = rr(0);
    const S = (rr(1) - r0) / rho;
    const w = (t) => w0 * (cosh(r0) / cosh(r0 + rho * t));
    const u = (t) => (w0 * (cosh(r0) * tanh(r0 + rho * t) - sinh(r0))) / rho2;
    // Near the world view the view can barely shift, and a straight path runs into the world's
    // edges. `inWorld` flights (centre to centre) instead move through the room the view has at
    // each zoom: position is a fraction of that room, which narrows smoothly as the camera pulls
    // out, so the path never meets an edge and its speed never jumps.
    const room = (z) => {
      const half = size.divideBy(2), mb = worldBounds(z);
      const nw = map.project(mb.getNorthWest(), z).add(half), se = map.project(mb.getSouthEast(), z).subtract(half);
      return { nw, se };
    };
    const frac = (v, a, b) => (b > a ? Math.min(1, Math.max(0, (v - a) / (b - a))) : 0.5);
    const at = (f, a, b) => (b > a ? a + f * (b - a) : (a + b) / 2);
    let n0, n1;
    if (inWorld && map.options.maxBounds) {
      const r0w = room(startZoom), r1w = room(targetZoom);
      const c0 = map.project(map.getCenter(), startZoom), c1 = map.project(subject, targetZoom);
      n0 = L.point(frac(c0.x, r0w.nw.x, r0w.se.x), frac(c0.y, r0w.nw.y, r0w.se.y));
      n1 = L.point(frac(c1.x, r1w.nw.x, r1w.se.x), frac(c1.y, r1w.nw.y, r1w.se.y));
    }
    const inWorldCenter = (p, z) => {
      const r = room(z), n = n0.add(n1.subtract(n0).multiplyBy(p));
      return map.unproject(L.point(at(n.x, r.nw.x, r.se.x), at(n.y, r.nw.y, r.se.y)), z);
    };
    const land = () => map._move(n0 ? subject : centerFor(to, targetZoom), targetZoom)._moveEnd(true);
    if (!isFinite(S) || S <= 0) { map._moveStart(true, false); land(); return; }
    map._ww2Flying = true;
    map._moveStart(true, false);
    const t0 = performance.now();
    const frame = () => {
      const t = (performance.now() - t0) / durationMs;
      if (t > 1) return land();
      map._flyToFrame = L.Util.requestAnimFrame(frame); // map._stop() cancels it, as for flyTo
      // Ease in and out: each move starts from rest as well as settling, so a pull-back's
      // zoom-out, hold and zoom-in read as one motion instead of lurching into each phase.
      const st = (0.5 - 0.5 * Math.cos(Math.PI * t)) * S;
      const z = Math.max(map.getMinZoom(), map.getScaleZoom(w0 / w(st), startZoom));
      const p = u(st) / u1;
      map._move(n0 ? inWorldCenter(p, z) : centerFor(from.add(to.subtract(from).multiplyBy(p)), z), z, { flyTo: true });
    };
    frame();
  }
  // Keep a view centre (pixel point at zoom z) inside the world, easing into the edges rather
  // than stopping hard at them: a hard stop jolts the camera where it engages and releases.
  // Away from the edges the centre is untouched; within half a screen of one it is drawn in
  // smoothly (matching position and speed where the cushion begins), never quite reaching it.
  function softLimitCenter(px, z) {
    if (!map.options.maxBounds) return map.unproject(px, z);
    const mb = worldBounds(z);
    const half = map.getSize().divideBy(2);
    const nw = map.project(mb.getNorthWest(), z), se = map.project(mb.getSouthEast(), z);
    const axis = (v, a, b) => {
      const lo = a + v.h, hi = b - v.h;
      if (hi <= lo) return (a + b) / 2; // the world is no bigger than the view: centre it
      const cushion = Math.min((hi - lo) / 2, v.h / 2); // in screen pixels, so close-ups are untouched
      if (v.x < lo + cushion) return lo + cushion * Math.exp((v.x - lo - cushion) / cushion);
      if (v.x > hi - cushion) return hi - cushion * Math.exp((hi - cushion - v.x) / cushion);
      return v.x;
    };
    return map.unproject(L.point(axis({ x: px.x, h: half.x }, nw.x, se.x), axis({ x: px.y, h: half.y }, nw.y, se.y)), z);
  }
  // Fly to frame `bounds` (as fitBounds with `opts`), keeping `subject` at its landing spot on screen.
  function flyToBoundsFocal(bounds, opts, subject, durationMs) {
    let { center, zoom } = map._getBoundsCenterZoom(bounds, opts);
    // Land where the world's edges allow (fully zoomed out, the view can't shift past them).
    if (map.options.maxBounds) center = map._limitCenter(center, zoom, worldBounds(zoom));
    // To or from (nearly) the world view, fly centre to centre through the room the view has.
    if (Math.min(zoom, map.getZoom()) < map.getMinZoom() + 1) {
      return flyFocal(center, zoom, map.getSize().divideBy(2), durationMs, { inWorld: true });
    }
    const focusPt = map.project(subject, zoom).subtract(map.project(center, zoom)).add(map.getSize().divideBy(2));
    flyFocal(subject, zoom, focusPt, durationMs);
  }

  // ---------- Shots ----------
  // Timelines can direct the camera with optional per-event fields; anything left out falls
  // back to the automatic framing below.
  //   scene       id shared by events that hold one frame (all their locations and frames);
  //               stepping between them doesn't move the camera
  //   frame       extra things to keep in view: event ids, place names from data/places.js,
  //               or [lat, lng]
  //   shot        'wide' (pull out for context or a reveal) or 'tight' (just this event)
  //   transition  'cut' (jump with a quick fade, to and from this event: a parallel storyline),
  //               'fly' (one direct move here) or 'pull-back' (out, hold, in, even for short hops)
  const eventPoints = (e) => [
    wrapLatLng(e.location.lat, e.location.lng),
    ...layers.get(e).paths.flatMap((p) => p.getLatLngs()),
  ];
  function framePoints(e) {
    return (e.frame || []).map((f) => {
      if (Array.isArray(f)) return wrapLatLng(f[0], f[1]);
      const other = tl.byId.get(f);
      if (other) return wrapLatLng(other.location.lat, other.location.lng);
      const place = PLACES.find((q) => q.name === f);
      return place ? wrapLatLng(place.lat, place.lng) : null;
    }).filter(Boolean);
  }

  // What to frame for an event: { pts, maxZoom, key } (key is set for scenes).
  function shotFor(ev) {
    if (ev.scene) {
      const members = tl.events.filter((e) => e.scene === ev.scene);
      return {
        pts: members.flatMap((e) => [...eventPoints(e), ...framePoints(e)]),
        maxZoom: Math.min(AT_SEA_CONTEXT_MAX_ZOOM, Math.max(...members.map((e) => e.zoom || 6))),
        key: `${tl.meta.id}:${ev.scene}`,
      };
    }
    const pts = [...eventPoints(ev), ...framePoints(ev)];
    let context = !!ev.frame;
    // At sea, also frame the action around it (or the nearest land) so the view isn't just water.
    const near = nearestPlace(pts[0]);
    const atSea = near && near.dist > CONTEXT_MIN_M;
    if (atSea && !context && ev.shot !== 'tight') {
      const i = shown.indexOf(ev);
      const neighbors = (i < 0 ? [] : shown.slice(Math.max(0, i - NEIGHBOR_STEPS), i + NEIGHBOR_STEPS + 1))
        .filter((e) => e !== ev && Math.abs(e.day - ev.day) <= NEIGHBOR_DAYS)
        .map((e) => wrapLatLng(e.location.lat, e.location.lng))
        .filter((p) => p.distanceTo(pts[0]) < NEIGHBOR_M);
      if (neighbors.length) { pts.push(...neighbors); context = true; }
      else if (near.dist < CONTEXT_MAX_M) { pts.push(L.latLng(near.lat, near.lng)); context = true; }
    }
    const maxZoom = atSea && ev.shot !== 'tight'
      ? Math.min(ev.zoom || 6, context ? AT_SEA_CONTEXT_MAX_ZOOM : AT_SEA_MAX_ZOOM)
      : ev.zoom || 6;
    return { pts, maxZoom, key: null };
  }

  // Frame the event (see shotFor), leaving room for the panel.
  function flyToEvent(ev, animate = true) {
    if (!map.getSize().x) return; // no size yet (e.g. hidden tab): the initial fit runs once it has one
    appFramed = true;
    const shot = shotFor(ev);
    const { pts } = shot;
    const size = map.getSize();
    const wide = window.innerWidth > 640;
    const panelH = panel.hidden ? 0 : panel.offsetHeight;
    const right = wide ? panelRoom() : 40;
    const left = 40;
    const opts = {
      maxZoom: shot.maxZoom - (ev.shot === 'wide' ? 1 : 0),
      paddingTopLeft: [left, 40],
      paddingBottomRight: wide ? [right, 40] : [40, Math.min(panelH + 20, size.y * 0.65)],
    };
    const margin = { tight: 0.1, wide: 0.45 }[ev.shot] ?? 0.2;
    const bounds = L.latLngBounds(pts).pad(pts.length > 1 ? margin : 0);
    const seq = ++flySeq; // a newer move cancels any pending steps of this one
    const to = pts[0];
    // Measure from the previous event's location; the map center is offset to leave room for the panel.
    const from = lastFlyTarget || map.getCenter();
    const prev = lastFlyEvent;
    const sameScene = shot.key && shot.key === lastShotKey;
    lastFlyTarget = to;
    lastFlyEvent = ev;
    lastShotKey = shot.key;
    if (!animate) {
      map.fitBounds(bounds, { ...opts, animate: false });
      return;
    }
    if (sameScene) return; // hold the scene's frame
    cameraBusy(OUT_MS + HOLD_MS + IN_MS);
    hideLabelsDuringMove(seq, OUT_MS + HOLD_MS + IN_MS);
    prefetchView(bounds, opts, map.getZoom()); // where this move lands, and the levels on the way

    // A cut: jump straight there behind a quick fade (into or out of a parallel storyline).
    if (ev.transition === 'cut' || (prev && prev.transition === 'cut' && prev !== ev)) {
      map.fitBounds(bounds, { ...opts, animate: false });
      showLabelsAfterMove(seq); // a cut doesn't travel
      const pane = map.getContainer();
      pane.classList.remove('cut-in');
      void pane.offsetWidth; // restart the animation
      pane.classList.add('cut-in');
      return;
    }

    const flyIn = () => {
      if (seq !== flySeq) return;
      map.once('moveend', () => showLabelsAfterMove(seq)); // before the call: it may land at once
      flyToBoundsFocal(bounds, opts, to, IN_MS);
    };
    if (ev.transition === 'fly') return flyIn();
    const forcePull = ev.transition === 'pull-back';
    if (!forcePull && from.distanceTo(to) < SAME_PLACE_M) return flyIn();
    // Pull back only as far as it takes to see both where we are and where we're going
    // (plus a little margin), so a short hop stays local and an ocean crossing goes wide.
    const padding = L.point(opts.paddingTopLeft).add(opts.paddingBottomRight);
    const destZoom = Math.min(map.getBoundsZoom(bounds, false, padding), opts.maxZoom);
    const both = L.latLngBounds([from, ...pts]);
    let pullZoom = Math.max(map.getMinZoom(), map.getBoundsZoom(both, false, padding) - PULL_MARGIN_ZOOM);
    if (forcePull) pullZoom = Math.max(map.getMinZoom(), Math.min(pullZoom, destZoom - 2));
    else {
      if (pullZoom >= destZoom - DIRECT_ZOOM_GAP) return flyIn(); // close by: one smooth move
      if (map.getZoom() <= pullZoom + 0.25 && map.getBounds().contains(to)) return flyIn(); // already out far enough
    }

    // Pull back to frame both places, hold, then fly in.
    const pullOpts = { paddingTopLeft: opts.paddingTopLeft, paddingBottomRight: opts.paddingBottomRight, maxZoom: pullZoom };
    const kept = prefetched;
    prefetchView(both, pullOpts, map.getZoom()); // the zoom-out
    kept.push(...prefetched);
    prefetchView(bounds, opts, pullZoom);        // the zoom back in from the pulled-back view
    prefetched = kept.concat(prefetched);
    flyToBoundsFocal(both, pullOpts, to, OUT_MS);
    let held = false;
    const hold = () => {
      if (held || seq !== flySeq) return;
      held = true;
      setTimeout(flyIn, HOLD_MS);
    };
    map.once('moveend', hold);
    setTimeout(hold, OUT_MS + 300); // in case the pull-back didn't need to move at all
  }
  // Place names are hidden while the camera travels: they're only re-picked for the zoom when
  // a move ends, so a zoom-out would carry close-up labels along and crowd them together.
  const mapEl = map.getContainer();
  let labelsHeldBy = 0;
  function hideLabelsDuringMove(seq, ms) {
    labelsHeldBy = seq;
    mapEl.classList.add('labels-hidden');
    setTimeout(() => showLabelsAfterMove(seq), ms + 1500); // in case the landing is never seen
  }
  function showLabelsAfterMove(seq) {
    if (seq === labelsHeldBy) mapEl.classList.remove('labels-hidden');
  }
  let flySeq = 0;
  let lastFlyTarget = null;
  let lastFlyEvent = null;
  let lastShotKey = null;
  // After the camera moves for any other reason, the next event gets a fresh shot.
  function forgetShot() { lastShotKey = null; lastFlyEvent = null; }
  // Whether the view is still the one the app framed (so a resize should reframe it), or the
  // user has since moved the map themselves.
  let appFramed = false;
  // Until when an animated camera move (including its pauses) is under way; resizes in that
  // time don't reframe, or they'd snap the view to the destination mid-move.
  let cameraBusyUntil = 0;
  const cameraBusy = (ms) => { cameraBusyUntil = performance.now() + ms + 300; };
  const userMoved = () => { appFramed = false; forgetShot(); labelsHeldBy = 0; mapEl.classList.remove('labels-hidden'); };
  map.on('dragstart dblclick', userMoved);
  map.getContainer().addEventListener('wheel', userMoved, { passive: true });
  map.getContainer().querySelector('.leaflet-control-zoom')?.addEventListener('click', userMoved);
  miniEl.addEventListener('click', userMoved);

  // ---------- Rendering ----------
  function render() {
    const ms = dayToMs(currentDay);
    slider.value = currentDay;
    $('current-date').textContent = formatLong(ms);
    $('weekday').textContent = WEEKDAYS[new Date(ms).getUTCDay()];
    $('war-day').textContent = warDayLabel(currentDay);
    // In the overview the link is just the timeline, so reloading or sharing it opens the overview.
    history.replaceState(null, '', overview ? `#${tl.meta.id}` : `#${tl.meta.id}/${toISO(ms)}${selected ? '/' + selected.id : ''}`);

    renderMarkers();
    renderPanel();
    fitPanel();
    updateWorldBounds(); // the room past the world's edge depends on whether the panel is open
    renderDayStrip();
    renderStepButtons();
    renderMapCrumbs();
    if (viewMode === 'connections') renderGraph();
  }

  function warDayLabel(day) {
    if (day < WAR_START_DAY) {
      const n = WAR_START_DAY - day;
      return n > 730 ? `${(n / 365.25).toFixed(1)} years before the war` : `${fmtInt(n)} days before the war`;
    }
    if (day > WAR_END_DAY) {
      const n = day - WAR_END_DAY;
      return n > 730 ? `${(n / 365.25).toFixed(1)} years after the war` : `${fmtInt(n)} days after the war`;
    }
    return `Day ${fmtInt(day - WAR_START_DAY + 1)} of the war`;
  }

  function renderMarkers() {
    if (overview) {
      tl.events.forEach(hideLayers); // the overview draws its own dots
      return;
    }
    // The story so far: every event up to the current one (or, on a day with no event
    // selected, up to the end of that day). Later events appear as you reach them.
    const now = selected && selected.day === currentDay ? selected : null;
    const reached = (e) => (now ? e.index <= now.index : e.day <= currentDay);
    const numbers = new Map(shown.map((e, i) => [e, i + 1])); // as in the panel's "x of N"
    for (const ev of tl.events) {
      const lyr = layers.get(ev);
      const age = currentDay - ev.day;
      const visible = isShown(ev) && reached(ev);
      if (visible !== lyr.shown) {
        visible ? lyr.marker.addTo(map) : lyr.marker.remove();
        lyr.shown = visible;
      }
      // Courses and strike lines belong to the moment: only the current event shows them.
      const showPaths = visible && ev === now && lyr.paths.length > 0;
      if (showPaths !== lyr.pathsShown) {
        showPaths ? lyr.pathGroup.addTo(map) : lyr.pathGroup.remove();
        lyr.pathsShown = showPaths;
      }
      if (visible) {
        const el = lyr.marker.getElement();
        const n = String(numbers.get(ev));
        const dot = el.querySelector('.dot');
        if (dot.textContent !== n) dot.textContent = n;
        el.classList.toggle('past', now ? ev !== now : age > 0);
        el.classList.toggle('selected', ev === selected);
        lyr.marker.setZIndexOffset(ev === selected ? 1000 : age === 0 ? 500 : 0);
      }
    }
  }

  // Long text: first step the type size down a little to fit; beyond that the panel scrolls
  // (wheel, touch or keys) with no scrollbar, its edges fading where there's more to read.
  const PANEL_MIN_SCALE = 0.8;
  function fitPanel() {
    panel.scrollTop = 0;
    if (panel.hidden) return;
    let scale = 1;
    panel.style.setProperty('--panel-scale', scale);
    while (panel.scrollHeight > panel.clientHeight + 1 && scale > PANEL_MIN_SCALE) {
      scale = Math.round((scale - 0.05) * 100) / 100;
      panel.style.setProperty('--panel-scale', scale);
    }
    updatePanelFades();
  }
  function updatePanelFades() {
    const more = panel.scrollHeight - panel.clientHeight;
    panel.classList.toggle('more-above', more > 1 && panel.scrollTop > 4);
    panel.classList.toggle('more-below', more > 1 && panel.scrollTop < more - 4);
  }
  panel.addEventListener('scroll', updatePanelFades, { passive: true });
  // Room the camera leaves on the right for the panel, so events sit in the open map to its left.
  function panelRoom() {
    const w = panel.offsetWidth || Math.min(680, Math.max(420, window.innerWidth * 0.4));
    return w + 12 + 40; // the panel's right margin plus a gap
  }

  // How long a timeline runs, in words.
  function durationLabel(days) {
    if (days <= 62) return `${days} days`;
    if (days < 730) return `about ${Math.round(days / 30.44)} months`;
    return `about ${Math.round(days / 365.25)} years`;
  }

  // In the overview the panel describes the whole timeline: a line of atmosphere and what it
  // covers (both from data/intros.js, else the catalog description), its span and a way in.
  function renderOverviewPanel() {
    const evs = tl.events;
    const ctx = tl.linkCtx || (tl.linkCtx = { wiki: tl.meta.wiki });
    const used = new Set();
    const intro = [].concat((WW2.intros && WW2.intros[tl.meta.id]) || tl.meta.description || []);
    const flavor = WW2.flavor && WW2.flavor[tl.meta.id];
    const perDay = new Map();
    for (const e of evs) perDay.set(e.day, (perDay.get(e.day) || 0) + 1);
    let busiest = null;
    for (const [day, n] of perDay) if (!busiest || n > busiest.n) busiest = { day, n };
    const places = new Set(evs.map((e) => e.location.name)).size;
    const span = tl.start === tl.end
      ? formatLong(dayToMs(tl.start))
      : `${formatLong(dayToMs(tl.start))} – ${formatLong(dayToMs(tl.end))}`;
    panel.style.setProperty('--marker-color', '#e0a43c');
    panelBody.innerHTML = `
      ${backButton()}
      <span class="tag">Overview</span>
      <h2>${esc(tl.meta.title)}</h2>
      <div class="meta"><strong>${span}</strong><br>
        ${fmtInt(evs.length)} events on ${fmtInt(perDay.size)} days · ${fmtInt(places)} places</div>
      ${flavor ? `<p class="flavor">${esc(flavor)}</p>` : ''}
      ${intro.map((t) => `<p>${linkify(t, ctx, used)}</p>`).join('')}
      ${tl.meta.stories ? `<p class="views-hint"><strong>Connections</strong> shows how the events led to one another, story by story; <strong>Map</strong> shows where they happened. Switch between them below.</p>` : ''}
      <dl>
        <dt>Span</dt><dd>${durationLabel(tl.end - tl.start + 1)}</dd>
        ${busiest && busiest.n > 1 ? `<dt>Busiest day</dt><dd>${formatLong(dayToMs(busiest.day))}, ${busiest.n} events</dd>` : ''}
      </dl>
      <button class="panel-link" data-ov-start>Start the timeline →</button>`;
    panel.hidden = false;
  }

  // For timelines with connections: the events this one follows from, and those that follow it.
  function connectionLinks(ev) {
    if (!tl.meta.stories) return '';
    const before = (ev.after || []).map((id) => tl.byId.get(id)).filter(Boolean);
    const after = tl.events.filter((e) => (e.after || []).includes(ev.id));
    if (!before.length && !after.length) return '';
    const list = (evs) => evs.map((e) =>
      `<button type="button" data-goto="${esc(e.id)}" style="--c:${e.color}"><i></i>${esc(e.title)}<small>${esc(formatMed(dayToMs(e.day)))}</small></button>`).join('');
    return `<div class="connections">
      ${before.length ? `<div><span>Because of</span>${list(before)}</div>` : ''}
      ${after.length ? `<div><span>Led to</span>${list(after)}</div>` : ''}
    </div>`;
  }

  function renderPanel() {
    if (overview) {
      if (overviewPanelClosed) panel.hidden = true;
      else renderOverviewPanel();
      return;
    }
    if (!selected || selected.day !== currentDay || panelClosed) {
      panel.hidden = true;
      return;
    }
    const ev = selected;
    const pos = shown.indexOf(ev); // position among the events the filter shows
    const used = new Set();
    const summary = linkify(ev.summary, ev, used);
    const facts = (ev.facts || []).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${linkify(v, ev, used)}</dd>`).join('');
    const when = ev.time
      ? `<strong>${esc(localTimeLabel(ev))}</strong> · ${gmtLabel(ev)}<br>`
      : ev.approx ? '<strong>Date approximate</strong><br>' : '';
    panel.style.setProperty('--marker-color', ev.color);
    panelBody.innerHTML = `
      <div class="countdown" hidden><div class="countdown-bar"><i></i></div><span></span></div>
      ${backButton()}
      <div class="panel-nav">
        <button data-jump="first" aria-label="First event" title="First event" ${pos === 0 ? 'disabled' : ''}>«</button>
        <button data-step="-1" aria-label="Previous event" ${pos === 0 ? 'disabled' : ''}>‹</button>
        <span>${pos + 1} of ${shown.length}</span>
        <button data-step="1" aria-label="Next event" ${pos === shown.length - 1 ? 'disabled' : ''}>›</button>
        <button data-jump="last" aria-label="Last event" title="Last event" ${pos === shown.length - 1 ? 'disabled' : ''}>»</button>
      </div>
      <span class="tag">${esc((tl.meta.stories && tl.meta.stories[ev.story]) || (TYPES[ev.type] || TYPES.attack).label)} · ${esc(tl.meta.legend === 'country' && ev.country ? [].concat(ev.country).join(' & ') : ev.theater)}</span>
      <h2>${esc(ev.title)}</h2>
      <div class="meta">${when}${esc(ev.location.name)}</div>
      <p>${summary}</p>
      ${facts ? `<dl>${facts}</dl>` : ''}
      ${connectionLinks(ev)}
      ${ev.link && timelines.has(ev.link.timeline)
        ? `<button class="panel-link" data-link-timeline="${esc(ev.link.timeline)}" data-link-event="${esc(ev.link.event || '')}">${esc(ev.link.label)} →</button>`
        : ''}`;
    panel.hidden = false;
  }

  function renderDayStrip() {
    const today = eventsOn(currentDay);
    dayStrip.hidden = today.length < 2;
    if (today.length < 2) { stripDay = null; return; }

    if (stripDay !== currentDay) {
      stripDay = currentDay;
      $('day-strip-label').textContent = `${today.length} events on ${formatShort(dayToMs(currentDay))}`;
      dayChips.innerHTML = '';
      for (const ev of today) {
        const b = document.createElement('button');
        b.style.setProperty('--marker-color', ev.color);
        b.title = [localTimeLabel(ev), ev.title].filter(Boolean).join(' · ');
        b.dataset.id = ev.id;
        dayChips.appendChild(b);
      }
    }
    for (const b of dayChips.children) b.classList.toggle('selected', selected && b.dataset.id === selected.id);
  }

  // The Previous/Next event buttons preview where they will go.
  function renderStepButtons() {
    const prev = $('btn-prev');
    const next = $('btn-next');
    const inOverview = overview || (atlas && atlasOverview);
    document.body.classList.toggle('in-overview', !!inOverview);
    $('btn-start').textContent = atlas ? 'Start the tour ›' : 'Start timeline ›';
    if (atlas && atlasOverview) {
      prev.textContent = '‹ Previous chapter';
      next.textContent = 'Start the tour ›';
      prev.disabled = true;
      next.disabled = false;
      prev.title = '';
      next.title = 'Go to chapter 1 (→)';
      return;
    }
    if (atlas) {
      prev.textContent = '‹ Previous chapter';
      next.textContent = 'Next chapter ›';
      prev.disabled = atlasChapter === 0;
      next.disabled = atlasChapter === atlas.data.tour.length - 1;
      prev.title = 'Previous chapter (←)';
      next.title = 'Next chapter (→)';
      return;
    }
    if (overview) {
      prev.textContent = '‹ Previous group';
      next.textContent = 'Next group ›';
      prev.disabled = ovIndex <= 0;
      next.disabled = ovIndex >= ovPlaces.length - 1;
      prev.title = 'Previous group, in order of each group’s first event (←)';
      next.title = 'Next group, in order of each group’s first event (→)';
      return;
    }
    prev.textContent = '‹ Previous event';
    next.textContent = 'Next event ›';
    for (const [id, dir, word, key] of [['btn-prev', -1, 'Previous', '←'], ['btn-next', 1, 'Next', '→']]) {
      const btn = $(id);
      const target = adjacentEvent(dir);
      btn.disabled = !target;
      btn.title = target
        ? `${word}: ${[formatMed(dayToMs(target.day)), localTimeLabel(target)].filter(Boolean).join(', ')} · ${target.title} (${key})`
        : `No ${dir > 0 ? 'later' : 'earlier'} events`;
    }
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---------- Timeline track ----------
  // The bar shows the whole timeline, one year, or one month. Clicking a year or month label
  // on the bar drills in; the breadcrumb above it drills back out.
  let trackZoom = { kind: 'all' };

  function zoomView(z, day) {
    if (z.kind === 'year') return { start: msToDay(Date.UTC(z.year, 0, 1)), end: msToDay(Date.UTC(z.year, 11, 31)) };
    if (z.kind === 'month') return { start: msToDay(Date.UTC(z.year, z.month, 1)), end: msToDay(Date.UTC(z.year, z.month + 1, 0)) };
    const start = Math.min(tl.start, day);
    const end = Math.max(tl.end, day);
    const span = Math.max(30, end - start);
    const padDays = Math.round(span * 0.03) + 1;
    return { start: clampDay(start - padDays), end: clampDay(start + span + padDays) };
  }

  function setTrackZoom(z, day = currentDay) {
    trackZoom = z;
    view = zoomView(z, day);
    buildTrack();
    renderCrumbs();
    renderLegend();
  }

  // Drill in from a label or out from the breadcrumb. In overview, the dots follow the new
  // period. Otherwise, if the current day isn't in it, go to the period's first event so the
  // selection and the bar agree.
  function drillTo(z) {
    setTrackZoom(z);
    if (overview) {
      map.closePopup();
      buildOverview();
      fitOverview();
      return;
    }
    if (currentDay < view.start || currentDay > view.end) {
      pause();
      const first = shown.find((e) => e.day >= view.start && e.day <= view.end);
      goToDay(first ? first.day : view.start);
    }
  }

  // Keep the current day on the bar: follow it to its year or month at the same zoom level.
  function ensureInView(day) {
    if (day >= view.start && day <= view.end) return;
    const d = new Date(dayToMs(day));
    if (trackZoom.kind === 'year') setTrackZoom({ kind: 'year', year: d.getUTCFullYear() }, day);
    else if (trackZoom.kind === 'month') setTrackZoom({ kind: 'month', year: d.getUTCFullYear(), month: d.getUTCMonth() }, day);
    else setTrackZoom({ kind: 'all' }, day);
  }

  function renderCrumbs() {
    const el = $('track-crumbs');
    const z = trackZoom;
    if (z.kind === 'all') {
      el.innerHTML = '<span class="crumb current">Whole timeline</span><span class="crumb-hint">Click a year or month on the bar to zoom in</span>';
      return;
    }
    // Levels you can go back to are buttons; where you are is a filled tag.
    const parts = ['<button type="button" class="crumb" data-zoom="all" title="Zoom out to the whole timeline">‹ Whole timeline</button>'];
    if (z.kind === 'year') {
      parts.push(`<span class="crumb current">${z.year}</span>`);
    } else {
      parts.push(`<button type="button" class="crumb" data-zoom="year" data-year="${z.year}" title="Zoom out to ${z.year}">‹ ${z.year}</button>`);
      parts.push(`<span class="crumb current">${MONTHS[z.month]} ${z.year}</span>`);
    }
    el.innerHTML = parts.join('');
  }

  const zoomFrom = (el) => ({
    kind: el.dataset.zoom,
    year: el.dataset.year ? Number(el.dataset.year) : undefined,
    month: el.dataset.month ? Number(el.dataset.month) : undefined,
  });

  function buildTrack() {
    const { start, end } = view;
    const span = end - start;
    slider.min = start;
    slider.max = end;
    slider.value = currentDay;
    const pct = (day) => ((day - start) / span) * 100;

    // Labels scale with the period shown. Year and month labels are buttons that drill in.
    const labels = $('track-labels');
    labels.innerHTML = '';
    const addLabel = (day, text, major, zoom) => {
      if (day < start || day > end) return;
      const s = document.createElement(zoom ? 'button' : 'span');
      s.style.left = pct(day) + '%';
      s.textContent = text;
      if (zoom) {
        s.type = 'button';
        s.className = 'zoomable' + (major ? ' major' : '');
        s.dataset.zoom = zoom.kind;
        s.dataset.year = zoom.year;
        if (zoom.month !== undefined) s.dataset.month = zoom.month;
        s.title = `Zoom into ${zoom.kind === 'year' ? zoom.year : `${MONTHS[zoom.month]} ${zoom.year}`}`;
      } else if (major) {
        s.className = 'major';
      }
      labels.appendChild(s);
    };
    const y0 = new Date(dayToMs(start)).getUTCFullYear();
    const y1 = new Date(dayToMs(end)).getUTCFullYear();

    if (trackZoom.kind === 'year') {
      // Month names centered in each month.
      for (let m = 0; m < 12; m++) {
        addLabel(msToDay(Date.UTC(trackZoom.year, m, 15)), MONTHS[m].slice(0, 3), false, { kind: 'month', year: trackZoom.year, month: m });
      }
    } else if (trackZoom.kind === 'month') {
      for (let d = start; d <= end; d++) {
        const date = new Date(dayToMs(d)).getUTCDate();
        if (date === 1 || (date % 5 === 0 && date < 30)) addLabel(d, date, date === 1);
      }
    } else if (span > 800) {
      // Every year if there's room (short '16 form between decades when tight), else every 5 or 10.
      const pxPerYear = (labels.clientWidth || 700) / (span / 365.25);
      const step = pxPerYear >= 18 ? 1 : pxPerYear >= 7 ? 5 : 10;
      for (let y = Math.ceil((y0 + 1) / step) * step; y <= y1; y += step) {
        const decade = y % 10 === 0;
        const text = step === 1 && pxPerYear < 34 ? `’${String(y).slice(2)}` : String(y);
        addLabel(msToDay(Date.UTC(y, 0, 1)), text, decade, { kind: 'year', year: y });
      }
    } else if (span > 45) {
      const s0 = new Date(dayToMs(start));
      for (let m = s0.getUTCMonth() + 1; ; m++) {
        const d = msToDay(Date.UTC(s0.getUTCFullYear(), m, 1));
        if (d > end) break;
        const dt = new Date(dayToMs(d));
        const month = dt.getUTCMonth();
        const year = dt.getUTCFullYear();
        if (month === 0) addLabel(d, String(year), true, { kind: 'year', year });
        else addLabel(d, MONTHS[month].slice(0, 3), false, { kind: 'month', year, month });
      }
    } else {
      for (let d = start; d <= end; d++) {
        const dt = new Date(dayToMs(d));
        if (dt.getUTCDate() === 1) addLabel(d, `${MONTHS[dt.getUTCMonth()].slice(0, 3)} ${dt.getUTCFullYear()}`, true, { kind: 'month', year: dt.getUTCFullYear(), month: dt.getUTCMonth() });
        else if (dt.getUTCDate() % 5 === 0 && dt.getUTCDate() < 30) addLabel(d, dt.getUTCDate(), false);
      }
    }

    // One tick per day that has events, colored by the day's first event.
    const ticks = $('event-ticks');
    ticks.innerHTML = '';
    for (const [day, all] of tl.byDay) {
      if (day < start || day > end) continue;
      const list = all.filter(isShown);
      if (!list.length) continue;
      const btn = document.createElement('button');
      btn.className = 'tick' + (list.length >= 5 ? ' busy' : '');
      btn.style.left = pct(day) + '%';
      btn.style.setProperty('--marker-color', list[0].color);
      btn.title = list.length === 1
        ? `${formatMed(dayToMs(day))}: ${list[0].title}`
        : `${formatMed(dayToMs(day))}: ${list.length} events`;
      btn.addEventListener('click', () => { pause(); goToDay(day); });
      ticks.appendChild(btn);
    }
  }

  // ---------- Overview ----------
  // Every event in the timeline on one map as large dots, grouped where they would overlap
  // on screen (regrouped as you zoom). Click a dot to list its events and jump to one.
  const OV_CLUSTER_PX = 46; // wide enough that mixed-group clusters don't collide
  const overviewLayer = L.layerGroup();
  const overviewBtn = $('btn-overview');
  let overview = false;
  let overviewPanelClosed = false; // user dismissed the overview's text panel
  let ovPlaces = []; // overview dots in order of each one's first event
  let ovIndex = -1;  // which of them Previous/Next group has reached

  // Center longitude for showing all the events: the middle of the narrowest band of
  // longitude that contains them, found by cutting the globe at the widest empty gap.
  function overviewCenterLng(evs) {
    const lngs = [...new Set(evs.map((e) => ((((e.location.lng + 180) % 360) + 360) % 360) - 180))].sort((a, b) => a - b);
    if (lngs.length < 2) return lngs[0] || 0;
    let gap = -1;
    let at = 0;
    lngs.forEach((a, i) => {
      const b = i + 1 < lngs.length ? lngs[i + 1] : lngs[0] + 360;
      if (b - a > gap) { gap = b - a; at = i; }
    });
    const start = lngs[(at + 1) % lngs.length];
    return start + (360 - gap) / 2;
  }
  // Event position inside the map's single world window.
  const ovLatLng = (e) => wrapLatLng(e.location.lat, e.location.lng);

  function enterOverview({ animate = true } = {}) {
    pause();
    overview = true;
    overviewPanelClosed = false;
    flySeq++; // cancel any camera move in progress
    overviewBtn.setAttribute('aria-pressed', 'true');
    document.body.classList.add('overview-mode');
    render();
    renderLegend();
    overviewLayer.addTo(map);
    buildOverview();
    fitOverview(animate);
  }

  // The events an overview frames: all of them if they fit in the open map (its width less
  // `padX`) at the widest zoom; otherwise the stretch of that width holding the most events,
  // so a timeline spread across the globe opens on where most of it happens.
  function overviewFocus(evs, padX) {
    const z = map.getMinZoom();
    const open = map.getSize().x - padX;
    if (!evs.length) return evs;
    const xs = evs.map((e) => map.project(ovLatLng(e), z).x);
    if (Math.max(...xs) - Math.min(...xs) <= open) return evs;
    // Otherwise take the stretch holding the most events, a little narrower than the open map, so the fit zooms in a
    // touch: at the widest zoom the map can't pan, and the stretch couldn't be centred.
    const width = open * 0.8 - 2 * OV_CLUSTER_PX;
    const pts = evs.map((e, i) => ({ e, x: xs[i] })).sort((a, b) => a.x - b.x);
    let best = [0, 0];
    for (let i = 0, j = 0; i < pts.length; i++) {
      while (pts[i].x - pts[j].x > width) j++; // keep pts[j..i] within the width
      if (i - j > best[1] - best[0]) best = [j, i];
    }
    return pts.slice(best[0], best[1] + 1).map((p) => p.e);
  }

  // Frame the events in the period shown on the bar (the whole timeline unless zoomed in).
  function fitOverview(animate = true) {
    forgetShot();
    appFramed = true;
    const evs = tl.events.filter(inPeriod);
    const target = evs.length ? evs : tl.events;
    if (!map.getSize().x) return; // no size yet (e.g. hidden tab)
    // Pixel padding only (no percentage pad): whole-war timelines span nearly the globe.
    const left = 50;
    // Leave room on the right for the overview's text panel.
    const right = window.innerWidth > 640 && !panel.hidden ? panelRoom() : 50;
    const bounds = L.latLngBounds(overviewFocus(target, left + right).map(ovLatLng));
    const opts = { paddingTopLeft: [left, 50], paddingBottomRight: [right, 50], maxZoom: 6 };
    if (animate) {
      const seq = ++flySeq;
      cameraBusy(1200);
      hideLabelsDuringMove(seq, 1200);
      map.once('moveend', () => showLabelsAfterMove(seq));
      prefetchView(bounds, opts, map.getZoom());
      map.flyToBounds(bounds, { ...opts, duration: 1.2 });
    }
    else map.fitBounds(bounds, { ...opts, animate: false });
  }

  function exitOverview() {
    if (!overview) return;
    overview = false;
    previewKey = null;
    overviewBtn.setAttribute('aria-pressed', 'false');
    document.body.classList.remove('overview-mode');
    map.closePopup();
    overviewLayer.clearLayers();
    overviewLayer.remove();
    renderLegend();
    renderMapCrumbs();
  }

  // Leave an overview for the beginning: the first event (of the period on the bar, if it's
  // zoomed in), or an atlas's first chapter.
  function startFromOverview() {
    if (atlas) return showChapter(0);
    const first = shown.find(inPeriod) || shown[0];
    if (first) selectEvent(first);
  }

  function toggleOverview() {
    if (atlas) {
      if (atlasOverview) showChapter(atlasChapter);
      else showAtlasOverview();
      return;
    }
    if (overview) {
      exitOverview();
      render();
      if (selected) flyToEvent(selected);
    } else {
      enterOverview();
    }
  }

  function buildOverview() {
    if (!overview) return;
    overviewLayer.clearLayers();
    const z = map.getZoom();
    const clusters = [];
    ovPlaces = [];
    ovIndex = -1;
    for (const ev of tl.events) {
      const passes = previewKey ? inPreview(ev) : isShown(ev); // hover preview overrides the filter
      if (!passes || !inPeriod(ev)) continue; // filtered via the legend, or outside the bar's period
      const p = map.project(ovLatLng(ev), z);
      let c = clusters.find((cl) => cl.p.distanceTo(p) < OV_CLUSTER_PX);
      if (!c) {
        c = { p, sum: L.point(0, 0), events: [] };
        clusters.push(c);
      }
      c.events.push(ev);
      c.sum = c.sum.add(p);
      c.p = c.sum.divideBy(c.events.length);
    }
    for (const c of clusters) {
      const evs = c.events; // already in chronological order
      const n = evs.length;
      const size = Math.round(Math.min(64, 18 + 9 * Math.sqrt(n)));
      // One part per legend category in the group, largest first.
      const byKey = {};
      for (const e of evs) {
        const k = legendKey(e);
        byKey[k] = byKey[k] || { color: e.color, label: tl.meta.filter === 'story' ? tl.meta.stories[k] || k : tl.meta.colors || tl.meta.legend ? k : (TYPES[k] || TYPES.attack).label, count: 0 };
        byKey[k].count++;
      }
      const parts = Object.values(byKey).sort((a, b) => b.count - a.count);
      // Name a group after the labelled place most of its events are nearest to (e.g. "Washington",
      // "Oahu"); a single location keeps its own name.
      const names = [...new Set(evs.map((e) => e.location.name))];
      let place = names[0];
      if (names.length > 1) {
        const votes = {};
        for (const e of evs) {
          const near = nearestPlace(L.latLng(e.location.lat, e.location.lng));
          if (near.dist < 400000) votes[near.name] = (votes[near.name] || 0) + 1;
        }
        const top = Object.entries(votes).sort((a, b) => b[1] - a[1])[0];
        place = top ? top[0] : `${names[0]} and nearby`;
      }
      const first = formatMed(dayToMs(evs[0].day));
      const last = formatMed(dayToMs(evs[n - 1].day));
      const when = first === last ? first : `${first} – ${last}`;
      const breakdown = parts.length > 1
        ? `<div class="tip-parts">${parts.map((p) => `<span><i style="background:${p.color}"></i>${esc(p.label)} ${p.count}</span>`).join('')}</div>`
        : '';
      const tip = n === 1
        ? `<strong>${esc(evs[0].title)}</strong><br><span class="tip-time">${esc(place)} · ${when}</span>`
        : `<strong>${esc(place)}</strong><br><span class="tip-time">${n} events · ${when}</span>${breakdown}`;
      const { html, box } = groupIcon(parts, n, size);
      const list = evs.map((e) => `<li><button data-ov-event="${esc(e.id)}" style="--c:${e.color}">
            <span class="ov-date">${formatMed(dayToMs(e.day))}${e.time ? ' · ' + e.time : ''}</span>${esc(e.title)}
          </button></li>`).join('');

      const marker = L.marker(map.unproject(c.p, z), {
        icon: L.divIcon({ className: 'ov-marker', html, iconSize: [box, box] }),
        zIndexOffset: -n, // small groups on top of big ones
        riseOnHover: true,
      })
        .bindTooltip(tip, { className: 'event-tip', direction: 'top', offset: [0, -box / 2] })
        .bindPopup(`<div class="ov-head">${esc(place)}<small>${n} event${n > 1 ? 's' : ''} · ${when}</small></div>
          <ul class="ov-list">${list}</ul>`, { className: 'ov-popup', maxWidth: 340, minWidth: 260 });
      marker.on('click', () => { ovIndex = ovPlaces.indexOf(marker); renderStepButtons(); });
      marker.firstEvent = evs[0];
      overviewLayer.addLayer(marker);
      ovPlaces.push(marker);
    }
    ovPlaces.sort((a, b) => a.firstEvent.day - b.firstEvent.day || a.firstEvent.abs - b.firstEvent.abs);
    renderStepButtons();
  }
  map.on('zoomend', buildOverview);

  // A group's icon: one circle if it's all one category; otherwise a cluster of slightly
  // offset circles, one per category (up to four), sized by share, with the total on top.
  function groupIcon(parts, n, size) {
    if (parts.length === 1) {
      return { html: `<div class="ov-dot" style="--c:${parts[0].color}">${n > 1 ? n : ''}</div>`, box: size };
    }
    const shown_ = parts.slice(0, 4);
    const offset = size * 0.3;
    const circles = shown_.map((p, i) => {
      const d = Math.max(12, Math.round(size * Math.sqrt(p.count / n) * 1.1));
      // Largest in the middle at the back; the rest around it, spread evenly.
      const angle = i === 0 ? 0 : -Math.PI / 4 + ((i - 1) * 2 * Math.PI) / (shown_.length - 1);
      const r = i === 0 ? 0 : offset;
      const dx = Math.round(Math.cos(angle) * r);
      const dy = Math.round(Math.sin(angle) * r);
      return `<i style="--c:${p.color};width:${d}px;height:${d}px;left:calc(50% + ${dx}px);top:calc(50% + ${dy}px)"></i>`;
    }).join('');
    const box = Math.round(size + offset * 1.4);
    return { html: `<div class="ov-stack">${circles}<span class="ov-count">${n}</span></div>`, box };
  }

  // Previous/Next group: open each dot's list in turn, in order of its first event.
  function stepPlace(direction) {
    if (!ovPlaces.length) return;
    ovIndex = ovIndex < 0
      ? (direction > 0 ? 0 : ovPlaces.length - 1)
      : Math.max(0, Math.min(ovPlaces.length - 1, ovIndex + direction));
    ovPlaces[ovIndex].openPopup();
    renderStepButtons();
  }

  // Choosing an event from a dot's list leaves the overview and goes to it.
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-ov-event]');
    if (btn) { pause(); selectEvent(tl.byId.get(btn.dataset.ovEvent)); }
  });

  // ---------- Playback ----------
  function dwellFor(ev) {
    const text = [ev.title, ev.summary, ...(ev.facts || []).flat()].join(' ');
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.min(MAX_DWELL_MS, Math.max(MIN_DWELL_MS, FLY_MS + words * READING_MS_PER_WORD));
  }

  function play() {
    exitOverview();
    if (currentDay >= view.end) goToDay(view.start, { fly: false });
    playing = true;
    playBtn.textContent = '❚❚';
    scheduleStep(selected ? MIN_DWELL_MS / 2 : EMPTY_DAY_MS); // current event is already on screen
  }

  function pause() {
    playing = false;
    clearTimeout(playTimer);
    playBtn.textContent = '▶';
    countdown = null;
    clearInterval(countdownTimer);
    renderCountdown();
  }

  // While playing, the panel shows how long until playback moves on. The bar is one
  // compositor-driven transform transition (smooth even while the map is flying);
  // the timer only updates the seconds text.
  function renderCountdown() {
    const el = panelBody.querySelector('.countdown');
    if (!el) return;
    const now = performance.now();
    el.hidden = !countdown || now >= countdown.end;
    if (el.hidden) return;
    const left = countdown.end - now;
    const bar = el.querySelector('i');
    if (bar.dataset.end !== String(countdown.end)) {
      // New countdown, or the panel was re-rendered: jump to the current fraction, then animate to empty.
      bar.dataset.end = countdown.end;
      bar.style.transition = 'none';
      bar.style.transform = `scaleX(${left / (countdown.end - countdown.start)})`;
      bar.getBoundingClientRect(); // commit the starting state before transitioning
      bar.style.transition = `transform ${left}ms linear`;
      bar.style.transform = 'scaleX(0)';
    }
    el.querySelector('span').textContent = `Next in ${Math.ceil(left / 1000)}s · Space to pause`;
  }

  function scheduleStep(delay) {
    clearTimeout(playTimer);
    clearInterval(countdownTimer);
    // Only count down real pauses on an event, not the quick ticks across empty days.
    countdown = delay >= 1000 && selected ? { start: performance.now(), end: performance.now() + delay } : null;
    renderCountdown();
    if (countdown) countdownTimer = setInterval(renderCountdown, 250);
    playTimer = setTimeout(() => {
      if (!playing) return;
      const base = EMPTY_DAY_MS;
      const today = eventsOn(currentDay);
      const pos = selected && selected.day === currentDay ? today.indexOf(selected) : -1;
      if (pos >= 0 && pos < today.length - 1) {
        selectEvent(today[pos + 1]);
        return scheduleStep(Math.max(base, dwellFor(selected)));
      }
      const next = shown.find((e) => e.day > currentDay);
      if (!next) return pause();
      const daysPerSecond = 1000 / base;
      const gap = next.day - currentDay;
      if (gap > daysPerSecond * 4) {
        goToDay(next.day);
      } else {
        goToDay(currentDay + 1);
      }
      scheduleStep(selected ? Math.max(base, dwellFor(selected)) : base);
    }, delay);
  }

  // ---------- Atlases ----------
  // An atlas presents places (sites with roles and descriptions, a guided tour of chapters,
  // and charts of sourced figures) instead of a sequence of dated events. It reuses the map,
  // panel, legend and Previous/Next buttons; the timeline bar is swapped for charts.
  let atlas = null;              // { meta, data, byId, markers } while an atlas is open
  let atlasChapter = 0;
  let atlasSite = null;          // site shown in the panel, or null to show the chapter
  const atlasHidden = new Set(); // roles hidden via the legend
  let atlasOverview = false;     // showing every place at once instead of a chapter
  let atlasPreview = null;       // role previewed by hovering the legend
  const atlasLayer = L.layerGroup();
  const siteColor = (s) => s.color || atlas.data.roles[s.role].color;
  const siteRadius = (s) => (s.output ? 6 + Math.sqrt(s.output) / 5 : s.role === 'ferry' ? 6 : 8);
  const atlasRoleShown = (role) => (atlasPreview ? role === atlasPreview : !atlasHidden.has(role));

  function enterAtlas(id, chapter = 0, { overview: startInOverview = false } = {}) {
    const wasOverview = overview || atlasOverview || startInOverview; // stay in overview across switches
    pause();
    exitOverview();
    if (tl) tl.events.forEach(hideLayers);
    flySeq++;
    const data = WW2.atlases[id];
    atlas = { meta: atlases.get(id).meta, data, byId: new Map(data.sites.map((s) => [s.id, s])) };
    setWorld(atlas.meta.centerLng ?? overviewCenterLng(data.sites.map((s) => ({ location: s }))));
    atlas.linkCtx = { wiki: data.wiki }; // reused so linkify caches the atlas's link list
    atlasHidden.clear();
    atlasPreview = null;
    document.body.classList.add('atlas-mode');
    $('timeline-title').textContent = atlas.meta.title;
    setView('map');
    $('weekday').textContent = data.subtitle || '';
    $('current-date').textContent = data.period || '';
    $('war-day').textContent = data.headline || '';
    buildAtlasLayers();
    atlasLayer.addTo(map);
    renderPicker();
    renderAtlasLegend();
    atlasOverview = false;
    if (wasOverview) showAtlasOverview({ fly: mapReady });
    else showChapter(Math.max(0, Math.min(data.tour.length - 1, chapter)), { fly: mapReady });
  }

  // Overview: every place at once, and a summary with the chapter list.
  function showAtlasOverview({ fly = true } = {}) {
    atlasOverview = true;
    atlasSite = null;
    overviewBtn.setAttribute('aria-pressed', 'true');
    renderAtlasPanel();
    fitPanel();
    renderAtlasMap();
    renderAtlasBar();
    renderStepButtons();
    history.replaceState(null, '', `#${atlas.meta.id}/overview`);
    renderMapCrumbs();
    if (fly) flyAtlas();
  }

  function exitAtlas() {
    if (!atlas) return;
    atlas = null;
    atlasOverview = false;
    overviewBtn.setAttribute('aria-pressed', 'false');
    atlasLayer.clearLayers();
    atlasLayer.remove();
    document.body.classList.remove('atlas-mode');
    $('atlas-bar').innerHTML = '';
  }

  function buildAtlasLayers() {
    atlasLayer.clearLayers();
    const { data } = atlas;
    atlas.markers = new Map(data.sites.map((s) => {
      const role = data.roles[s.role];
      const marker = L.circleMarker(wrapLatLng(s.lat, s.lng), {
        radius: siteRadius(s), color: '#fff6e4', weight: 2, fillColor: siteColor(s), fillOpacity: 0.9,
      })
        .bindTooltip(`<strong>${esc(s.name)}</strong><br><span class="tip-time">${esc(role.label)}${s.output ? ` · ${fmtInt(s.output)} ${esc(data.unit || 'built')}` : ''}</span>`,
          { className: 'event-tip', direction: 'top' })
        .on('click', () => showSite(s.id));
      return [s.id, marker];
    }));
  }

  // Highlight the chapter's (or the open site's) places; fade the rest.
  function renderAtlasMap() {
    const ch = atlas.data.tour[atlasChapter];
    const all = atlasOverview && !atlasSite;
    const focusSites = new Set(atlasSite ? [atlasSite] : all ? atlas.data.sites.map((s) => s.id) : ch.sites);
    for (const s of atlas.data.sites) {
      const m = atlas.markers.get(s.id);
      const show = atlasRoleShown(s.role);
      if (show !== atlasLayer.hasLayer(m)) show ? atlasLayer.addLayer(m) : atlasLayer.removeLayer(m);
      if (!show) continue;
      const focus = focusSites.has(s.id);
      m.setStyle({ fillOpacity: focus ? 0.95 : 0.3, opacity: focus ? 1 : 0.35, weight: focus ? 2.5 : 1 });
      if (focus) m.bringToFront();
    }
  }

  function flyAtlas(animate = true) {
    forgetShot();
    appFramed = true;
    if (!map.getSize().x) return;
    const ids = atlasSite ? [atlasSite]
      : atlasOverview ? atlas.data.sites.filter((s) => atlasRoleShown(s.role)).map((s) => s.id)
      : atlas.data.tour[atlasChapter].sites;
    const bounds = L.latLngBounds(ids.map((id) => atlas.byId.get(id)).map((s) => wrapLatLng(s.lat, s.lng)));
    const wide = window.innerWidth > 640;
    const opts = {
      paddingTopLeft: [50, 60],
      paddingBottomRight: [wide ? panelRoom() : 50, 60],
      maxZoom: atlasSite ? 8 : 6,
    };
    flySeq++;
    if (animate) { cameraBusy(1400); prefetchView(bounds, opts, map.getZoom()); map.flyToBounds(bounds, { ...opts, duration: 1.4 }); }
    else map.fitBounds(bounds, { ...opts, animate: false });
  }

  function showChapter(i, { fly = true } = {}) {
    atlasChapter = i;
    atlasSite = null;
    atlasOverview = false;
    overviewBtn.setAttribute('aria-pressed', 'false');
    renderAtlasPanel();
    fitPanel();
    renderAtlasMap();
    renderAtlasBar();
    renderStepButtons();
    renderMapCrumbs();
    history.replaceState(null, '', `#${atlas.meta.id}/${i + 1}`);
    if (fly) flyAtlas();
  }

  function showSite(id) {
    atlasSite = id;
    renderAtlasPanel();
    fitPanel();
    renderAtlasMap();
    renderAtlasBar();
    renderMapCrumbs();
    flyAtlas();
  }

  function renderAtlasPanel() {
    const { data } = atlas;
    const ch = data.tour[atlasChapter];
    const used = new Set();
    if (atlasSite) {
      const s = atlas.byId.get(atlasSite);
      const role = data.roles[s.role];
      const facts = (s.facts || []).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${linkify(v, atlas.linkCtx, used)}</dd>`).join('');
      panel.style.setProperty('--marker-color', siteColor(s));
      panelBody.innerHTML = `
        <span class="tag">${esc(role.label)}</span>
        <h2>${esc(s.name)}</h2>
        <div class="meta">${esc(s.org)}${s.approx ? '<br><strong>Location approximate</strong>' : ''}</div>
        ${s.unverified ? '<div class="unverified-badge">Not verified against a source</div>' : ''}
        <p>${linkify(s.summary, atlas.linkCtx, used)}</p>
        ${facts ? `<dl>${facts}</dl>` : ''}
        ${s.source ? `<div class="source-note">${esc(s.source)}</div>` : ''}`;
    } else if (atlasOverview) {
      const counts = {};
      for (const s of data.sites) counts[s.role] = (counts[s.role] || 0) + 1;
      const unverified = data.sites.filter((s) => s.unverified).length;
      const chapters = data.tour.map((c, i) =>
        `<li><button data-atlas-chapter="${i}" style="--c:#e0a43c">${esc(c.title)}<small>Chapter ${i + 1} · ${c.sites.length} places${c.unverified ? ' · includes unverified details' : ''}</small></button></li>`).join('');
      panel.style.setProperty('--marker-color', '#e0a43c');
      panelBody.innerHTML = `
        <span class="tag">${esc(atlas.meta.title)} · Overview</span>
        <h2>${esc(data.subtitle || atlas.meta.title)}</h2>
        <div class="meta"><strong>${esc(data.headline || '')}</strong> · ${esc(data.period || '')}<br>
          ${data.sites.length} places · ${data.tour.length} chapters</div>
        ${atlas.meta.description ? `<p>${linkify(atlas.meta.description, atlas.linkCtx, used)}</p>` : ''}
        <dl>${Object.entries(data.roles).filter(([k]) => counts[k]).map(([k, r]) => `<dt>${esc(r.label)}</dt><dd>${counts[k]}</dd>`).join('')}</dl>
        ${unverified ? `<div class="source-note">${unverified} of the places include details not verified against a source; each is marked in its panel.</div>` : ''}
        <ul class="atlas-sites">${chapters}</ul>`;
    } else {
      const sites = ch.sites.map((id) => atlas.byId.get(id)).map((s) =>
        `<li><button data-atlas-site="${esc(s.id)}" style="--c:${siteColor(s)}">${esc(s.name)}<small>${esc(data.roles[s.role].label)}${s.unverified ? ' · not verified' : ''}</small></button></li>`).join('');
      panel.style.setProperty('--marker-color', '#e0a43c');
      panelBody.innerHTML = `
        <div class="panel-nav">
          <button data-atlas-step="-1" aria-label="Previous chapter" ${atlasChapter === 0 ? 'disabled' : ''}>‹</button>
          <span>Chapter ${atlasChapter + 1} of ${data.tour.length}</span>
          <button data-atlas-step="1" aria-label="Next chapter" ${atlasChapter === data.tour.length - 1 ? 'disabled' : ''}>›</button>
        </div>
        <span class="tag">${esc(atlas.meta.title)}</span>
        <h2>${esc(ch.title)}</h2>
        ${ch.unverified ? '<div class="unverified-badge">Includes details not verified against a source</div>' : ''}
        <p>${linkify(ch.text, atlas.linkCtx, used)}</p>
        <ul class="atlas-sites">${sites}</ul>`;
    }
    panel.hidden = false;
  }

  // The bottom bar: stacked bars of sourced figures; each segment opens its site.
  function renderAtlasBar() {
    $('atlas-bar').innerHTML = atlas.data.charts.map((c) => {
      const rows = c.bars.map((b) => {
        const total = b.segments.reduce((sum, sg) => sum + sg.value, 0);
        const segs = b.segments.map((sg) => {
          const s = atlas.byId.get(sg.site);
          return `<button class="atlas-seg${atlasSite === s.id ? ' active' : ''}" data-atlas-site="${esc(s.id)}"
            style="flex:${sg.value} 1 0;--c:${siteColor(s)}" title="${esc(s.name)}: ${fmtInt(sg.value)}"><span>${esc(s.name)} · ${fmtInt(sg.value)}</span></button>`;
        }).join('');
        return `<div class="atlas-row"><span class="atlas-row-label">${esc(b.label)}<small>${fmtInt(total)}</small></span><div class="atlas-segs">${segs}</div></div>`;
      }).join('');
      return `<div class="atlas-chart"><div class="atlas-chart-title">${esc(c.title)}</div>${rows}${c.note ? `<div class="atlas-note">${esc(c.note)}</div>` : ''}</div>`;
    }).join('');
  }

  function renderAtlasLegend() {
    const counts = {};
    for (const s of atlas.data.sites) counts[s.role] = (counts[s.role] || 0) + 1;
    const showAll = `<button type="button" class="legend-showall" data-show-all ${atlasHidden.size ? '' : 'disabled'}>Show all</button>`;
    legendDiv.innerHTML = `<div class="legend-hint"><span>Hover to preview · Click to select</span>${showAll}</div>` +
      Object.entries(atlas.data.roles).filter(([k]) => counts[k]).map(([k, r]) =>
        `<button type="button" class="legend-item${atlasHidden.has(k) ? ' off' : ''}" data-key="${esc(k)}" aria-pressed="${!atlasHidden.has(k)}">
          <i style="background:${r.color}"></i>${esc(r.label)}<span class="legend-count">${counts[k]}</span></button>`).join('');
  }

  // Same selection rules as the timeline legend, applied to the atlas's roles.
  function atlasLegendClick(e) {
    atlasPreview = null;
    if (e.target.closest('[data-show-all]')) {
      atlasHidden.clear();
    } else {
      const btn = e.target.closest('[data-key]');
      if (!btn) return;
      const key = btn.dataset.key;
      const keys = [...legendDiv.querySelectorAll('[data-key]')].map((b) => b.dataset.key);
      if (atlasHidden.size === 0) keys.filter((k) => k !== key).forEach((k) => atlasHidden.add(k));
      else if (atlasHidden.has(key)) atlasHidden.delete(key);
      else {
        atlasHidden.add(key);
        if (keys.every((k) => atlasHidden.has(k))) atlasHidden.clear();
      }
    }
    renderAtlasLegend();
    renderAtlasMap();
  }

  $('atlas-bar').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-atlas-site]');
    if (btn && atlas) showSite(btn.dataset.atlasSite);
  });

  // ---------- Breadcrumbs (top-left of the map) ----------
  // Where you are, with a way back: Overview › Chapter › Place in an atlas, and
  // Overview › Event in a timeline. Every step but the last is clickable.
  function renderMapCrumbs() {
    const crumb = (label, action) => action
      ? `<button type="button" class="crumb" data-crumb="${action}" title="${esc(label)}">${esc(label)}</button>`
      : `<span class="crumb current" title="${esc(label)}">${esc(label)}</span>`;
    const parts = [];
    if (atlas) {
      parts.push(crumb('Overview', atlasOverview && !atlasSite ? null : 'overview'));
      if (!atlasOverview) parts.push(crumb(`Chapter ${atlasChapter + 1}: ${atlas.data.tour[atlasChapter].title}`, atlasSite ? 'chapter' : null));
      if (atlasSite) parts.push(crumb(atlas.byId.get(atlasSite).name, null));
    } else if (tl) {
      parts.push(crumb('Overview', overview ? null : 'overview'));
      if (!overview && selected && selected.day === currentDay) parts.push(crumb(selected.title, null));
    }
    $('map-crumbs').innerHTML = parts.join('<span class="crumb-sep">›</span>');
  }
  $('map-crumbs').addEventListener('click', (e) => {
    const action = e.target.closest('[data-crumb]')?.dataset.crumb;
    if (action === 'overview') {
      if (atlas) showAtlasOverview();
      else if (!overview) enterOverview();
    } else if (action === 'chapter') {
      showChapter(atlasChapter);
    }
  });

  // ---------- Wiring ----------
  playBtn.addEventListener('click', () => (playing ? pause() : play()));
  function step(dir) {
    if (atlas && atlasOverview) {
      if (dir > 0) showChapter(0);
    } else if (atlas) {
      const i = atlasChapter + dir;
      if (i >= 0 && i < atlas.data.tour.length) showChapter(i);
    } else if (overview) {
      stepPlace(dir);
    } else {
      pause();
      stepEvent(dir);
    }
  }
  $('btn-prev').addEventListener('click', () => step(-1));
  $('btn-start').addEventListener('click', startFromOverview);
  $('btn-next').addEventListener('click', () => step(1));
  overviewBtn.addEventListener('click', toggleOverview);
  $('panel-close').addEventListener('click', () => {
    if (atlas) { panel.hidden = true; return; }
    if (overview) overviewPanelClosed = true;
    else panelClosed = true;
    renderPanel();
    updateWorldBounds();
    if (overview) fitOverview(); // the map can use the panel's room now
    else if (!map._ww2Flying) map.panInsideBounds(map.options.maxBounds); // no blank map in the open
  });

  panelBody.addEventListener('click', (e) => {
    if (atlas) {
      const chapterStep = e.target.closest('[data-atlas-step]');
      if (chapterStep) return step(Number(chapterStep.dataset.atlasStep));
      const site = e.target.closest('[data-atlas-site]');
      if (site) return showSite(site.dataset.atlasSite);
      const chapterLink = e.target.closest('[data-atlas-chapter]');
      if (chapterLink) return showChapter(Number(chapterLink.dataset.atlasChapter));
      return;
    }
    if (e.target.closest('[data-ov-start]')) return startFromOverview();
    const go = e.target.closest('[data-goto]');
    if (go) { pause(); return selectEvent(tl.byId.get(go.dataset.goto)); }
    const stepBtn = e.target.closest('[data-step]'); // (not "step": that would shadow step() above)
    if (stepBtn) { pause(); stepEvent(Number(stepBtn.dataset.step)); return; }
    const jumpBtn = e.target.closest('[data-jump]');
    if (jumpBtn && shown.length) {
      pause();
      const target = jumpBtn.dataset.jump === 'first' ? shown[0] : shown[shown.length - 1];
      selectEvent(target);
      return;
    }
    if (e.target.closest('[data-back]')) return history.back(); // popstate goes back (see below)
    const link = e.target.closest('[data-link-timeline]');
    if (link) followLink(link.dataset.linkTimeline, link.dataset.linkEvent);
  });

  // ---------- Back from a cross-timeline link ----------
  // Following a link into another timeline remembers where it came from. The panel then
  // offers a way back, and so does the browser's Back button: each link adds a history
  // entry, and going back through it returns to the timeline and event (or overview) left.
  const backStack = [];
  function followLink(timelineId, eventId) {
    backStack.push({
      timeline: tl.meta.id, title: tl.meta.title,
      eventId: overview || !selected ? null : selected.id,
      eventTitle: overview || !selected ? 'Overview' : selected.title,
    });
    history.pushState({ ww2Back: backStack.length }, '', location.href); // render() then rewrites this new entry
    setTimeline(timelineId, { eventId });
  }
  function backButton() {
    const b = backStack[backStack.length - 1];
    return b ? `<button class="panel-back" data-back title="Back to ${esc(b.title)}: ${esc(b.eventTitle)}">← Back to ${esc(b.title)}<small>${esc(b.eventTitle)}</small></button>` : '';
  }
  window.addEventListener('popstate', () => {
    const b = backStack.pop();
    if (!b) { // an older entry (the picker clears the list): open what its link points to
      const [id, date, eventId] = location.hash.slice(1).split('/');
      if (timelines.has(id)) setTimeline(id, /^\d{4}-\d{2}-\d{2}$/.test(date || '') ? { dateISO: date, eventId } : {});
      else if (atlases.has(id)) setTimeline(id);
      return;
    }
    const ev = b.eventId && timelines.get(b.timeline).byId.get(b.eventId);
    setTimeline(b.timeline, ev ? { eventId: ev.id, dateISO: ev.date } : {});
  });
  dayChips.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-id]');
    if (btn) { pause(); selectEvent(tl.byId.get(btn.dataset.id)); }
  });

  // ---------- Timeline picker (modal) ----------
  // Two views. "By group": groups from the catalog on the left, the chosen group's timelines
  // and atlases on the right as cards. "All, by date": every timeline in one list ordered by
  // start date within its group, each row with its span on a shared time axis so they can be compared.
  // Searching matches titles and descriptions in either view.
  const picker = $('picker');
  const pickerSearch = $('picker-search');
  const pickerGroups = catalog.filter((n) => n.children);
  let pickerGroup = 0;
  let pickerView = 'groups';
  try { if (localStorage.getItem('ww2.pickerView') === 'list') pickerView = 'list'; } catch (e) { /* no storage */ }
  const currentId = () => (atlas ? atlas.meta.id : tl && tl.meta.id);

  function leafSummary(n) {
    if (atlases.has(n.id)) {
      const a = WW2.atlases[n.id];
      return { kind: 'Atlas', meta: `${a.sites.length} places · ${a.tour.length} chapters · ${a.period || ''}` };
    }
    const t = timelines.get(n.id);
    const years = [t.start, t.end].map((d) => new Date(dayToMs(d)).getUTCFullYear());
    return { kind: 'Timeline', meta: `${t.events.length} events · ${years[0] === years[1] ? years[0] : `${years[0]}–${years[1]}`}` };
  }

  function itemCard(n) {
    const { kind, meta } = leafSummary(n);
    const current = n.id === currentId();
    return `<button class="picker-item${current ? ' current' : ''}" data-pick="${esc(n.id)}">
      <span class="picker-kind">${kind}${current ? ' · showing now' : ''}</span>
      <strong>${esc(n.title)}</strong>
      ${n.description ? `<span class="picker-desc">${esc(n.description)}</span>` : ''}
      <small>${esc(meta)}</small>
    </button>`;
  }

  // The list view's shared axis: the Pacific war with a little either side. Spans that run
  // past it are clipped, with an arrow on the clipped end.
  const AXIS_START = msToDay(parseISO('1941-01-01'));
  const AXIS_END = msToDay(parseISO('1946-01-01'));
  const axisPct = (day) => ((Math.max(AXIS_START, Math.min(AXIS_END, day)) - AXIS_START) / (AXIS_END - AXIS_START)) * 100;
  const monthYear = (day) => {
    const d = new Date(dayToMs(day));
    return `${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCFullYear()}`;
  };
  const spanLabel = (a, b) => {
    const [x, y] = [monthYear(a), monthYear(b)];
    return x === y ? x : `${x} – ${y}`;
  };
  const byStart = (a, b) => (!a.t - !b.t) || (a.t && (a.t.start - b.t.start || a.t.end - b.t.end)) || 0;
  const listGroups = pickerGroups.map((g) => ({
    g, entries: g.children.map((n) => ({ n, g, t: timelines.get(n.id) })).sort(byStart),
  }));

  function listRow({ n, g, t }) {
    const current = n.id === currentId();
    if (!t) {
      const a = WW2.atlases[n.id];
      return `<button class="list-row${current ? ' current' : ''}" data-pick="${esc(n.id)}">
        <span class="list-name" title="${esc(g.title)}"><strong>${esc(n.title)}</strong></span>
        <span class="list-dates">${esc((a && a.period) || '')}<small>atlas</small></span>
        <span class="list-track list-track-none"></span>
      </button>`;
    }
    const l = axisPct(t.start), r = axisPct(t.end);
    const clip = `${t.start < AXIS_START ? ' clip-l' : ''}${t.end > AXIS_END ? ' clip-r' : ''}`;
    return `<button class="list-row${current ? ' current' : ''}" data-pick="${esc(n.id)}" data-l="${l}" data-w="${Math.max(r - l, 0.4)}">
      <span class="list-name" title="${esc(g.title)}"><strong>${esc(n.title)}</strong></span>
      <span class="list-dates">${spanLabel(t.start, t.end)}<small>${t.events.length} events</small></span>
      <span class="list-track"><span class="list-bar${clip}" style="left:${l}%;width:${Math.max(r - l, 0.4)}%"></span></span>
    </button>`;
  }

  function renderList(matches) {
    const list = $('picker-list');
    const sections = listGroups.map(({ g, entries }) => ({ g, rows: entries.filter((x) => matches(x.n)) })).filter((x) => x.rows.length);
    const years = [];
    for (let y = 1941; y <= 1945; y++) years.push(`<span style="left:${axisPct(msToDay(parseISO(`${y}-01-01`)))}%">${y}</span>`);
    list.innerHTML = sections.length
      ? `<div class="list-head"><span>Timeline</span><span>Covers</span><span class="list-axis">${years.join('')}</span></div>
         <div class="list-rows">${sections.map(({ g, rows }) =>
           `<h3 class="list-group">${esc(g.title)}</h3>${rows.map(listRow).join('')}`).join('')}</div>`
      : `<p class="picker-none">Nothing matches “${esc(pickerSearch.value.trim())}”.</p>`;
    setListBand(list.querySelector('.list-row.current'));
    updateListFades();
  }

  // A faint band across every row marks the hovered timeline's span (or the current one's).
  function setListBand(row) {
    const list = $('picker-list');
    const on = row && row.dataset.l != null;
    list.style.setProperty('--band-l', on ? `${row.dataset.l}%` : '0');
    list.style.setProperty('--band-w', on ? `${row.dataset.w}%` : '0');
  }

  function updateListFades() {
    const box = $('picker-list').querySelector('.list-rows');
    if (!box) return;
    box.classList.toggle('more-above', box.scrollTop > 2);
    box.classList.toggle('more-below', box.scrollTop + box.clientHeight < box.scrollHeight - 2);
  }

  function renderPicker() {
    if (picker.hidden) return;
    const q = pickerSearch.value.trim().toLowerCase();
    const matches = (n) => !q || `${n.title} ${n.description || ''}`.toLowerCase().includes(q);
    const list = pickerView === 'list';
    $('picker-body').hidden = list;
    $('picker-list').hidden = !list;
    $('tab-groups').setAttribute('aria-selected', String(!list));
    $('tab-list').setAttribute('aria-selected', String(list));
    if (list) return renderList(matches);
    $('picker-groups').innerHTML = pickerGroups.map((g, i) => {
      const count = g.children.filter(matches).length;
      return `<button class="picker-group${!q && i === pickerGroup ? ' active' : ''}${q && !count ? ' empty' : ''}" data-group="${i}">
        ${esc(g.title)}<span>${count}</span></button>`;
    }).join('');
    const items = $('picker-items');
    if (q) {
      const sections = pickerGroups.map((g) => ({ g, hits: g.children.filter(matches) })).filter((x) => x.hits.length);
      items.innerHTML = sections.length
        ? sections.map(({ g, hits }) => `<h3>${esc(g.title)}</h3><div class="picker-grid">${hits.map(itemCard).join('')}</div>`).join('')
        : `<p class="picker-none">Nothing matches “${esc(pickerSearch.value.trim())}”.</p>`;
    } else {
      const g = pickerGroups[pickerGroup];
      items.innerHTML = `<h3>${esc(g.title)}</h3><div class="picker-grid">${g.children.map(itemCard).join('')}</div>`;
    }
  }

  function openPicker() {
    const at = pickerGroups.findIndex((g) => g.children.some((n) => n.id === currentId()));
    pickerGroup = at >= 0 ? at : 0;
    pickerSearch.value = '';
    picker.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    renderPicker();
    pickerSearch.focus();
  }

  function closePicker() {
    picker.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.focus();
  }

  menuToggle.addEventListener('click', openPicker);
  $('picker-list').addEventListener('mouseover', (e) => {
    const row = e.target.closest('.list-row');
    if (row) setListBand(row);
  });
  $('picker-list').addEventListener('mouseleave', () => setListBand($('picker-list').querySelector('.list-row.current')));
  $('picker-list').addEventListener('scroll', updateListFades, true);
  new ResizeObserver(updateListFades).observe($('picker-list'));
  pickerSearch.addEventListener('input', renderPicker);
  picker.addEventListener('click', (e) => {
    if (e.target.closest('[data-picker-close]')) return closePicker();
    const tab = e.target.closest('[data-view]');
    if (tab) {
      pickerView = tab.dataset.view;
      try { localStorage.setItem('ww2.pickerView', pickerView); } catch (err) { /* no storage */ }
      renderPicker();
      return pickerSearch.focus();
    }
    const group = e.target.closest('[data-group]');
    if (group) {
      pickerSearch.value = '';
      pickerGroup = Number(group.dataset.group);
      return renderPicker();
    }
    const item = e.target.closest('[data-pick]');
    if (item) {
      closePicker();
      if (item.dataset.pick !== currentId()) { backStack.length = 0; setTimeline(item.dataset.pick); }
    }
  });
  // Enter in the search box opens the first match.
  pickerSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') picker.querySelector(`${pickerView === 'list' ? '#picker-list' : '#picker-body'} [data-pick]`)?.click();
  });

  // Year labels depend on the bar's width.
  new ResizeObserver(() => { if (tl) buildTrack(); }).observe($('track-labels'));
  $('track-labels').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-zoom]');
    if (btn) drillTo(zoomFrom(btn));
  });
  $('track-crumbs').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-zoom]');
    if (btn) drillTo(zoomFrom(btn));
  });

  document.addEventListener('keydown', (e) => {
    if (!picker.hidden) {
      if (e.key === 'Escape') closePicker();
      return; // the dialog is modal: no map or timeline shortcuts while it's open
    }
    if (e.target.matches?.('select, textarea, input:not([type=range])')) return;
    if (e.key === ' ') { e.preventDefault(); if (!atlas) playing ? pause() : play(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === 'o' || e.key === 'O') toggleOverview();
    else if (e.key === 'Enter' && (overview || atlasOverview) && !e.target.closest?.('button, a')) startFromOverview();
    else if (e.key === 'Escape') {
      if (atlas && atlasOverview) showChapter(atlasChapter);
      else if (atlas) panel.hidden = true;
      else if (overview) toggleOverview();
      else { if (overview) overviewPanelClosed = true; else panelClosed = true; renderPanel(); fitPanel(); }
    }
  });

  // ---------- Connections view ----------
  // For timelines with `stories` (see data/catalog.js): the events as a graph instead of a map.
  // Stories are lanes, time runs left to right (one step per event, so busy years get room),
  // and arrows run from each event to the ones it led to. Selecting an event lights up its
  // whole chain, what led to it and what followed, and fades the rest. The map keeps working
  // underneath, so the inset in the corner shows where each event happened.
  const graphEl = L.DomUtil.create('div', 'graph', map.getContainer());
  graphEl.hidden = true;
  L.DomEvent.disableClickPropagation(graphEl);
  L.DomEvent.disableScrollPropagation(graphEl);
  L.DomEvent.on(graphEl, 'pointerdown touchstart', L.DomEvent.stopPropagation);
  let viewMode = 'map';
  let graphPan = 0; // horizontal offset of the graph's content, in px
  const viewToggle = $('view-toggle');

  function setView(mode) {
    const can = !!(tl && !atlas && tl.meta.stories);
    viewMode = can && mode === 'connections' ? 'connections' : 'map';
    graphEl.hidden = viewMode !== 'connections';
    document.body.classList.toggle('graph-view', viewMode === 'connections');
    viewToggle.hidden = !can;
    for (const b of viewToggle.querySelectorAll('[data-view]')) b.setAttribute('aria-pressed', String(b.dataset.view === viewMode));
    if (viewMode === 'connections') { graphPan = 0; graphKey = null; renderGraph({ recenter: true }); }
  }
  viewToggle.addEventListener('click', (e) => {
    const b = e.target.closest('[data-view]');
    if (b) setView(b.dataset.view);
  });

  // An event's chain: every event it follows from, and every event that follows from it.
  function chainOf(ev) {
    const next = new Map();
    for (const e of tl.events) for (const id of e.after || []) {
      if (!next.has(id)) next.set(id, []);
      next.get(id).push(e.id);
    }
    const seen = new Set([ev.id]);
    const walk = (ids, up) => {
      for (const id of ids) {
        if (seen.has(id)) continue;
        seen.add(id);
        walk(up ? tl.byId.get(id).after || [] : next.get(id) || [], up);
      }
    };
    walk(ev.after || [], true);
    walk(next.get(ev.id) || [], false);
    return seen;
  }

  // The graph is drawn once per layout (timeline, size, overview or not, panel open or not) and
  // then updated in place, so moving between events animates: the view glides along, chains
  // fade in and out, and the selected event's story lane brightens.
  let graphKey = null;   // the layout currently drawn
  let graph = null;      // its geometry
  let graphLabelsKey = null;
  let graphManual = false; // the user has dragged or scrolled since the last selection
  let graphSelId = null;

  function renderGraph({ recenter = false, instant = false } = {}) {
    if (graphEl.hidden || !tl || !tl.meta.stories) return;
    const W = graphEl.clientWidth, H = graphEl.clientHeight;
    if (!W || !H) return;
    const fit = overview || !selected;
    const right = window.innerWidth > 640 && !panel.hidden ? panelRoom() : 24;
    const legendW = legendDiv && legendDiv.offsetWidth ? legendDiv.offsetWidth : 190;
    const key = [tl.meta.id, W, H, fit, right, legendW].join('|');
    if (key !== graphKey) {
      buildGraph(W, H, fit, right, legendW);
      graphKey = key;
      graphLabelsKey = null;
      instant = true;
      recenter = true;
    }
    updateGraph({ recenter, instant });
  }

  function buildGraph(W, H, fit, right, legendW) {
    const stories = Object.entries(tl.meta.stories);
    const lane = new Map(stories.map(([id], i) => [id, i]));
    const evs = tl.events;
    // The legend sits at the bottom left, so the graph starts to its right; lane names are
    // captions at the top of each lane.
    const labelW = legendW + 30, top = 30, bottom = 14;
    const free = Math.max(120, W - labelW - right);
    const laneH = (H - top - bottom) / stories.length;
    // Overview: the whole graph fits beside the panel. Following events: room to read a chain.
    const step = fit ? free / evs.length : Math.max(26, free / evs.length);
    const gx = (i) => step * (i + 0.5);
    const gy = (e) => top + laneH * ((lane.get(e.story) ?? 0) + 0.5);
    const r = Math.max(4, Math.min(9, step * 0.34));
    graph = { W, H, labelW, top, free, step, width: step * evs.length, gx, gy, r };

    const lanes = stories.map(([id], i) =>
      `<rect class="lane${i % 2 ? ' odd' : ''}" data-lane="${esc(id)}" x="0" y="${top + laneH * i}" width="${W}" height="${laneH}"/>`).join('');
    let content = '';
    let year = null, lastLabel = -Infinity;
    evs.forEach((e, i) => {
      const yr = e.date.slice(0, 4);
      if (yr === year) return;
      year = yr;
      const x = gx(i) - step / 2;
      content += `<line class="year" x1="${x}" y1="${top - 6}" x2="${x}" y2="${H - bottom}"/>`;
      if (x - lastLabel >= 34) { // where years are crowded, label only some of them
        content += `<text class="year-label" x="${x + 4}" y="${top - 10}">${yr}</text>`;
        lastLabel = x;
      }
    });
    // Arrows only between neighbouring events of one story, straight along its lane; the other
    // connections are listed in the panel ("Because of", "Led to") and still light up the chain.
    for (const e of evs) {
      for (const id of e.after || []) {
        const from = tl.byId.get(id);
        if (from.story !== e.story || evs.some((m) => m.story === e.story && m.index > from.index && m.index < e.index)) continue;
        const x1 = gx(from.index), x2 = gx(e.index), y = gy(e);
        content += `<path class="edge" data-from="${esc(from.id)}" data-to="${esc(e.id)}" d="M${x1 + r},${y} L${x2 - r - 3},${y}" marker-end="url(#arrow)"/>`;
      }
    }
    for (const e of evs) {
      const cs = [].concat(e.country || []).map((c) => COUNTRY_COLORS[c]).filter(Boolean);
      content += `<g class="node" data-ev="${esc(e.id)}" transform="translate(${gx(e.index)},${gy(e)})">`
        + `<title>${esc(e.title)} · ${esc(formatMed(dayToMs(e.day)))}</title>`
        + `<circle r="${r}" style="fill:${cs[0] || e.color}"/>`
        + (cs.length > 1 ? `<path d="M0,${-r} A${r},${r} 0 0 1 0,${r} Z" style="fill:${cs[1]}"/>` : '')
        + (r >= 7 ? '<text class="num" dy="0.35em"></text>' : '')
        + '</g>';
    }
    graphEl.innerHTML = `<svg width="${W}" height="${H}" role="img" aria-label="Connections between events">
      <defs>
        <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="arrow"/></marker>
        <marker id="arrow-hot" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="arrow hot"/></marker>
        <clipPath id="graph-clip"><rect x="${labelW - 4}" y="0" width="${W - labelW + 4}" height="${H}"/></clipPath>
      </defs>
      ${lanes}
      <g clip-path="url(#graph-clip)"><g class="graph-pan">
        <g class="now" style="opacity:0"><rect class="now-past" x="-100000" y="${top - 6}" width="100000" height="${H - top - bottom + 6}"/>
          <line class="now-line" x1="0" y1="${top - 6}" x2="0" y2="${H - bottom}"/><text class="now-date" x="5" y="${H - bottom - 6}"></text></g>
        ${content}</g></g>
      <g class="graph-pan graph-labels"></g>
      ${stories.map(([id, label], i) => `<line class="lane-rule" x1="${labelW - 4}" y1="${top + laneH * i}" x2="${W}" y2="${top + laneH * i}"/>`
        + `<text class="lane-label" data-lane-label="${esc(id)}" x="${labelW}" y="${top + laneH * i + 18}">${esc(label)}</text>`).join('')}
    </svg>`;
  }

  function updateGraph({ recenter, instant }) {
    const g = graph;
    const sel = selected && !overview ? selected : null;
    if ((sel && sel.id) !== graphSelId) { graphSelId = sel && sel.id; graphManual = false; }
    // Keep the selected event in the open part of the view (unless the user is moving about).
    if (!sel) graphPan = 0;
    else if (!graphManual) {
      const sx = g.gx(sel.index) + graphPan;
      if (recenter || sx < g.step * 2 || sx > g.free - g.step * 2) graphPan = g.free * 0.42 - g.gx(sel.index);
    }
    graphPan = Math.max(Math.min(0, g.free - g.width), Math.min(0, graphPan));
    for (const el of graphEl.querySelectorAll('.graph-pan')) {
      el.classList.toggle('instant', !!instant);
      el.style.transform = `translate(${g.labelW + graphPan}px, 0px)`;
    }

    // Time so far: a line that glides to the selected event as you step, shading the past.
    const now = graphEl.querySelector('.now');
    now.classList.toggle('instant', !!instant);
    now.style.opacity = sel ? 1 : 0;
    if (sel) {
      now.style.transform = `translate(${g.gx(sel.index)}px, 0px)`;
      now.querySelector('.now-date').textContent = formatMed(dayToMs(sel.day));
    }

    const chain = sel ? chainOf(sel) : null;
    for (const lane of graphEl.querySelectorAll('[data-lane]')) lane.classList.toggle('current', !!(sel && lane.dataset.lane === sel.story));
    for (const label of graphEl.querySelectorAll('[data-lane-label]')) {
      label.classList.toggle('current', !!(sel && label.dataset.laneLabel === sel.story));
      label.classList.toggle('off', tl.meta.filter === 'story' && hiddenKeys.has(label.dataset.laneLabel));
    }
    for (const node of graphEl.querySelectorAll('.node')) {
      const e = tl.byId.get(node.dataset.ev);
      node.classList.toggle('selected', e === sel);
      node.classList.toggle('dim', !!(chain && !chain.has(e.id)));
      node.classList.toggle('off', !isShown(e));
      node.classList.toggle('future', !!(sel && e.index > sel.index));
      const num = node.querySelector('.num');
      if (num) { const n = shown.indexOf(e); num.textContent = n >= 0 ? n + 1 : ''; }
    }
    for (const edge of graphEl.querySelectorAll('.edge')) {
      const from = tl.byId.get(edge.dataset.from), to = tl.byId.get(edge.dataset.to);
      const hot = !!(chain && chain.has(from.id) && chain.has(to.id));
      edge.classList.toggle('hot', hot);
      edge.classList.toggle('dim', !!(chain && !hot));
      edge.classList.toggle('off', !isShown(from) || !isShown(to));
      edge.setAttribute('marker-end', `url(#arrow${hot ? '-hot' : ''})`);
    }

    // Names along the selected chain, kept inside the visible area (one that would run off an
    // edge slides inward), alternating above and below to limit overlap. Redrawn, with a fade,
    // only when the chain or the view changes.
    const labelsKey = [sel && sel.id, Math.round(graphPan), [...hiddenKeys].join()].join('|');
    if (labelsKey === graphLabelsKey) return;
    graphLabelsKey = labelsKey;
    const lo = -graphPan + 6, hi = -graphPan + g.free - 6;
    let html = '';
    tl.events.filter((e) => chain && chain.has(e.id)).forEach((e, k) => {
      const t = e.title.length > 34 ? e.title.slice(0, 33) + '…' : e.title;
      const half = t.length * 3.1; // about half the label's width at 11px
      const x = Math.max(lo + half, Math.min(hi - half, g.gx(e.index)));
      // Above, unless that would run into the lane's header at its left end.
      const header = (tl.meta.stories[e.story] || '').length * 8.5 + 16;
      const above = k % 2 === 0 && x - half > lo + header;
      const y = g.gy(e) + (above ? -g.r - 9 : g.r + 16);
      html += `<text class="node-label${e === sel ? ' sel' : ''}" x="${x}" y="${y}">${esc(t)}</text>`;
    });
    graphEl.querySelector('.graph-labels').innerHTML = html;
  }

  // Click an event to select it; drag or scroll sideways to move along the graph.
  let graphDrag = null, graphDragged = false;
  graphEl.addEventListener('click', (e) => {
    if (graphDragged) return;
    const header = e.target.closest('[data-lane-label]');
    if (header && tl.meta.filter === 'story') {
      legendDiv.querySelector(`[data-key="${CSS.escape(header.dataset.laneLabel)}"]`)?.click();
      return;
    }
    const node = e.target.closest('[data-ev]');
    if (node) { pause(); selectEvent(tl.byId.get(node.dataset.ev)); }
  });
  graphEl.addEventListener('pointerdown', (e) => { graphDrag = { x: e.clientX, pan: graphPan }; graphDragged = false; });
  window.addEventListener('pointermove', (e) => {
    if (!graphDrag) return;
    const dx = e.clientX - graphDrag.x;
    if (Math.abs(dx) > 4) graphDragged = true;
    if (graphDragged) { graphPan = graphDrag.pan + dx; graphManual = true; renderGraph({ instant: true }); }
  });
  window.addEventListener('pointerup', () => { graphDrag = null; setTimeout(() => { graphDragged = false; }, 0); });
  graphEl.addEventListener('wheel', (e) => {
    e.preventDefault();
    graphPan -= Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    graphManual = true;
    renderGraph({ instant: true });
  }, { passive: false });
  new ResizeObserver(() => renderGraph()).observe(graphEl);

  // ---------- Init ----------
  // Deep links: #timeline-id/YYYY-MM-DD/event-id (older links #YYYY-MM-DD/event-id still work).
  const parts = location.hash.slice(1).split('/').filter(Boolean);
  if (parts.length && !timelines.has(parts[0]) && /^\d{4}-\d{2}-\d{2}$/.test(parts[0])) parts.unshift(DEFAULT_TIMELINE);
  const [hashTimeline, hashDate, hashEvent] = parts;
  setTimeline(timelines.has(hashTimeline) ? hashTimeline : DEFAULT_TIMELINE, {
    dateISO: /^\d{4}-\d{2}-\d{2}$/.test(hashDate || '') ? hashDate : undefined,
    eventId: hashEvent,
    fly: false,
  });
  // Atlases deep-link as #atlas-id/chapter-number.
  if (atlases.has(hashTimeline)) enterAtlas(hashTimeline, (Number(hashDate) || 1) - 1, { overview: hashDate === 'overview' });

  // The map can't fit bounds until it has real dimensions (e.g. page opened in a
  // background tab), and Leaflet only watches window resizes, so watch the container.
  // Whenever it resizes (the layout settling at startup, the bar below changing height, the
  // window resizing), reframe the current view unless the user has moved the map since, or a
  // camera flight is under way (it lands close enough).
  function reframe() {
    if (atlas) flyAtlas(false);
    else if (overview) fitOverview(false);
    else if (selected) flyToEvent(selected, false);
  }
  let resizeFrame = 0;
  let lateReframe = 0;
  new ResizeObserver(() => {
    map.invalidateSize();
    updateMinZoom();
    fitPanel();
    const { x, y } = map.getSize();
    if (!x || !y) return;
    const first = !mapReady;
    mapReady = true;
    const busyFor = cameraBusyUntil - performance.now();
    if (first || (appFramed && !map._ww2Flying && busyFor <= 0)) {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(reframe); // once per frame, after layout settles
    } else if (appFramed && busyFor > 0) {
      // Mid-move: catch up once the move has finished.
      clearTimeout(lateReframe);
      lateReframe = setTimeout(() => {
        if (appFramed && !map._ww2Flying && performance.now() > cameraBusyUntil) reframe();
      }, busyFor + 50);
    }
  }).observe($('map'));
})();
