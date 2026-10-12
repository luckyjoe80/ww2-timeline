// Catalog of timelines, shown as the tree menu on the left.
// Groups have `children`; leaves are timelines whose events live in
// data/timelines/<id>.js (each file fills WW2.events[<id>]).
//
// Timeline options:
//   id, title, description
//   default       true for the timeline shown when no deep link is given
//   defaultEvent  event id to open first (otherwise the first event)
//   pastWindow    days a past event's marker stays on the map (default 45)
//   wiki          Wikipedia overrides for every event in the timeline (see data/wiki.js)
//   colors        { theater: color } to color markers and the legend by theater instead of type
//   centerLng     longitude at the middle of the (single, finite) map; defaults to the middle of the events
//   kind          'atlas' for a places-and-flows view (data in data/atlases/<id>.js) instead of a timeline

window.WW2 = {
  events: {},
  catalog: [
    {
      title: 'War in the Pacific',
      children: [
        {
          id: 'road-to-pearl-harbor',
          title: 'The Road to Pearl Harbor',
          description: 'The ships of the Pacific Fleet, from keel-laying to their moorings on 6 December 1941.',
          pastWindow: 100000, // keep every shipyard and voyage on the map as the fleet gathers
        },
        {
          id: 'attack-on-hawaii',
          title: 'The Attack on Hawaii',
          description: 'The Kido Butai’s voyage, the attack hour by hour, and the war it started.',
          default: true,
          defaultEvent: 'pearl-harbor',
        },
        {
          id: 'battle-of-midway',
          title: 'The Battle of Midway',
          description: 'Code-breaking, four carriers lost in a day, and the end of Yorktown, May–June 1942.',
          defaultEvent: '1942-06-04-dive-bombers-wreck-kaga-akagi-and-s-ry',
          wiki: { Fletcher: 'Frank_Jack_Fletcher', Yamaguchi: 'Tamon_Yamaguchi', Akebono: null, Best: null },
        },
        {
          id: 'pacific-submarines',
          title: 'Submarine Operations',
          description: 'Submarine warfare in the Pacific and Southeast Asia by every navy involved, 1941–1946.',
          pastWindow: 100000,
          colors: {
            'U.S. Navy': '#3f78b5',
            'Imperial Japanese Navy': '#c8402f',
            'Royal Navy': '#2f8f8a',
            'Royal Netherlands Navy': '#d98a2b',
            'Kriegsmarine': '#8a8a8a',
            'Regia Marina': '#5a8a4e',
            'Soviet Navy': '#8e2a5c',
          },
        },
      ],
    },
    {
      title: 'Production',
      children: [
        {
          id: 'b17-production',
          kind: 'atlas',
          title: 'B-17 Production',
          description: 'Where and how the 12,731 Flying Fortresses were built, finished and flown to war.',
        },
      ],
    },
    {
      title: 'People',
      children: [
        {
          id: 'yamamoto',
          title: 'Isoroku Yamamoto',
          description: 'The Combined Fleet commander who planned Pearl Harbor, from Nagaoka to Bougainville.',
          pastWindow: 100000,
          wiki: { Yamamoto: null, 'Isoroku Yamamoto': null }, // don't link the subject in his own timeline
        },
      ],
    },
    {
      title: 'Ships',
      children: [
        {
          id: 'yamato',
          title: 'Battleship Yamato',
          description: 'The largest battleship ever built, from secret construction at Kure to her sinking in 1945.',
          pastWindow: 100000,
          wiki: { Yamato: null }, // linked once, on the keel-laying event
        },
      ],
    },
  ],
};
