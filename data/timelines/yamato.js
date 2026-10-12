// Timeline: Battleship Yamato (Ships).
// The largest battleship ever built, from secret construction at Kure to her sinking in 1945.
// Checked against the English Wikipedia articles "Japanese battleship Yamato" and
// "Japanese battleship Musashi" (October 2026). Event schema: see data/timelines/attack-on-hawaii.js.

(function () {
  const P = {
    kure: { name: 'Kure Naval Arsenal, Hiroshima Prefecture', lat: 34.236, lng: 132.553 },
    hashirajima: { name: 'Hashirajima anchorage, Hiroshima Bay', lat: 33.97, lng: 132.43 },
    truk: { name: 'Truk Lagoon, Caroline Islands', lat: 7.42, lng: 151.78 },
    wreck: { name: 'East China Sea, about 290 km southwest of Kyushu', lat: 30.37, lng: 128.07 },
    samar: { name: 'Off Samar, Philippines', lat: 11.7, lng: 126.4 },
  };

  const ev = (date, title, type, location, zoom, summary, extra = {}) => ({
    id: extra.id || `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}`,
    date, title, type, location, zoom, summary,
    theater: extra.theater || 'Pacific',
    ...extra,
  });

  const SPECS = [
    ['Class', 'Yamato-class battleship (with sister Musashi)'],
    ['Displacement', 'Nearly 72,000 tonnes full load'],
    ['Main guns', 'Nine 46 cm (18.1 in) Type 94, the largest ever mounted on a warship'],
    ['Gun range', '42 km (26 mi)'],
    ['Top speed', '27.4 knots (on trials, late 1941)'],
    ['Builder', 'Kure Naval Arsenal'],
  ];

  WW2.events.yamato = [
    // ---------------- Design and construction ----------------
    ev('1936-12-31', 'Japan leaves the naval treaty system', 'political',
      { name: 'Tokyo', lat: 35.685, lng: 139.753 }, 10,
      'Japan has renounced the Washington Naval Treaty, which limited the size and power of battleships, and it lapses at the end of 1936. Knowing Japan could never match the output of American shipyards, the Imperial Japanese Navy designs a class of 70,000-ton battleships able to engage several enemy battleships at once.',
      { theater: 'Asia' }),
    ev('1937-11-04', 'Yamato laid down in secret at Kure', 'construction', P.kure, 14,
      'The keel of Yamato is laid at the Kure Naval Arsenal in a dock that had to be deepened by a metre and fitted with 350-tonne gantry cranes for her enormous hull. Extreme secrecy surrounds the work, and a canopy is built over part of the dock to screen the ship from view.',
      { wiki: { Yamato: 'Japanese_battleship_Yamato' }, facts: SPECS }),
    ev('1938-03-29', 'Sister ship Musashi laid down at Nagasaki', 'construction',
      { name: 'Mitsubishi shipyard, Nagasaki', lat: 32.73, lng: 129.86 }, 13,
      'The second ship of the class, “Battleship No. 2”, is laid down at Mitsubishi’s Nagasaki shipyard. Throughout construction a 408-tonne curtain of hemp rope hides the slipway from outsiders.',
      { theater: 'Asia', facts: [['Ship', 'Musashi'], ['Fate', 'Sunk at the Battle of the Sibuyan Sea, 24 October 1944']] }),
    ev('1940-08-08', 'Yamato launched', 'construction', P.kure, 14,
      'Yamato is launched at Kure with Captain Miyazato Shutoku in command.'),
    ev('1941-12-16', 'Yamato commissioned', 'construction', P.kure, 14,
      'After sea trials in which she reaches 27.4 knots, Yamato is commissioned months ahead of schedule, just over a week after Pearl Harbor. The ceremony is more austere than usual because the navy still wants to conceal her characteristics. Under Captain Gihachi Takayanagi she joins Nagato and Mutsu in the 1st Battleship Division.',
      { facts: SPECS }),

    // ---------------- Flagship ----------------
    ev('1942-02-12', 'Becomes flagship of the Combined Fleet', 'movement', P.hashirajima, 10,
      'Admiral Isoroku Yamamoto makes Yamato the flagship of the Combined Fleet.',
      { link: { timeline: 'yamamoto', event: '1942-02-12-moves-his-flag-to-the-battleship-yamato', label: 'See this in Isoroku Yamamoto' } }),
    ev('1942-05-27', 'Sails for Midway', 'movement', P.hashirajima, 5,
      'After taking part in war games, Yamato leaves Hiroshima Bay with Yamamoto’s main battleship group for the attack on Midway. American code-breakers already know Japan’s intentions.',
      { paths: [{ label: 'Main battleship group toward Midway (approximate)', kind: 'route', coords: [[33.97, 132.43], [31, 150], [31, 170], [31, -178]] }] }),
    ev('1942-06-04', 'Too far away to fight at Midway', 'movement',
      { name: 'Far west of Midway', lat: 32.0, lng: 172.0 }, 5,
      'Yamamoto commands from Yamato’s bridge, but his plan has scattered his forces, and the battleship group is too far away to take part. Japan loses four fleet carriers and 332 aircraft. On 5 June Yamamoto orders the surviving ships home.',
      { approx: true, link: { timeline: 'yamamoto', event: '1942-06-04-disaster-at-the-battle-of-midway', label: 'See Midway in Isoroku Yamamoto' } }),
    ev('1942-08-28', 'Arrives at Truk after a submarine attack', 'movement', P.truk, 9,
      'Eleven days after leaving Kure, Yamato is sighted by the U.S. submarine Flying Fish, whose four torpedoes all miss, and she reaches Truk the same day. She stays there through the Guadalcanal campaign: she lacks suitable ammunition for shore bombardment, the waters around Guadalcanal are uncharted, and she burns enormous amounts of fuel.'),
    ev('1943-02-11', 'Musashi takes over as flagship', 'movement', P.truk, 9,
      'Yamato is replaced as Combined Fleet flagship by her sister Musashi. Two months later Yamamoto is killed over Bougainville.'),
    ev('1943-05-14', 'Back in Japan for a refit', 'service', P.kure, 12,
      'Having spent only a single day away from Truk since August, Yamato sails for Japan on 8 May and reaches Kure on 14 May for inspection, repairs and, in July, significant upgrades. She returns to Truk in August.'),
    ev('1943-12-25', 'Torpedoed by USS Skate', 'attack',
      { name: 'Approaches to Truk', lat: 9.5, lng: 150.5 }, 7,
      'Pressed into service as a transport, Yamato is ferrying troops and equipment from Yokosuka to Truk when the submarine Skate fires four torpedoes. One strikes her starboard side aft, ripping a hole 25 metres across and flooding the upper magazine of her rear turret. She takes on about 3,000 tons of water but reaches Truk later that day.',
      { approx: true }),
    ev('1944-03-18', 'Refitted as an anti-aircraft platform', 'service', P.kure, 12,
      'After repairs to the torpedo damage, Yamato is dry-docked at Kure for upgrades. Two of her 155 mm turrets are replaced with 127 mm anti-aircraft guns, the number of 25 mm anti-aircraft guns rises to 162, and new air-search and gunnery radars are fitted.'),

    // ---------------- 1944 battles ----------------
    ev('1944-06-19', 'Battle of the Philippine Sea', 'attack',
      { name: 'Philippine Sea, west of the Marianas', lat: 15.0, lng: 137.0 }, 5,
      'Yamato escorts Vice Admiral Jisaburō Ozawa’s Mobile Fleet in the battle American pilots call the “Great Marianas Turkey Shoot”. Japan loses three carriers and 426 aircraft. Yamato’s only significant contribution is mistakenly opening fire on returning Japanese aircraft.'),
    ev('1944-10-22', 'Sails from Brunei for Leyte Gulf', 'movement',
      { name: 'Brunei Bay, Borneo', lat: 5.05, lng: 115.05 }, 8,
      'Yamato and Musashi sail with Vice Admiral Takeo Kurita’s Center Force under Operation Shō-Gō to attack the American landings on Leyte. A few days earlier Yamato was coated in black camouflage, made largely from soot from her own funnel, for the night passage of the San Bernardino Strait.',
      { theater: 'Asia', paths: [{ label: 'Center Force route toward Leyte (approximate)', kind: 'route', coords: [[5.05, 115.05], [9.5, 117.3], [12.5, 121.5], [13.1, 122.5], [12.6, 124.2], [11.7, 126.4]] }] }),
    ev('1944-10-23', 'Kurita moves his flag to Yamato', 'loss',
      { name: 'Palawan Passage, Philippines', lat: 9.5, lng: 117.3 }, 8,
      'In the Palawan Passage the U.S. submarines Darter and Dace sink two heavy cruisers, including Kurita’s flagship Atago, and cripple a third. Kurita survives the sinking and transfers his flag to Yamato.',
      { approx: true, theater: 'Asia' }),
    ev('1944-10-24', 'Musashi sunk in the Sibuyan Sea', 'loss',
      { name: 'Sibuyan Sea, Philippines', lat: 13.12, lng: 122.53 }, 8,
      'American carrier aircraft fly 259 sorties against Center Force. Bombers from USS Essex hit Yamato with two armor-piercing bombs, but she stays in the fight. Musashi becomes the focus of the attacks. Hit by an estimated 19 torpedoes and 17 bombs, she capsizes that evening. Only 1,376 of her 2,399 crew are rescued.',
      { time: '19:36', tz: 'PHT', approx: true, theater: 'Asia' }),
    ev('1944-10-25', 'Yamato’s guns fire on enemy ships off Samar', 'attack', P.samar, 7,
      'After dawn, Center Force runs into Taffy 3, a group of six escort carriers, three destroyers and four destroyer escorts. Yamato opens fire from 32,000 metres, her first and only surface action. Her shells cripple the destroyer Johnston and hit the escort carrier Gambier Bay repeatedly. Fearing more air attacks and believing he faces fleet carriers, Kurita retreats, leaving the American troop transports untouched.',
      {
        time: '06:57', tz: 'PHT', approx: true, theater: 'Asia',
        facts: [
          ['U.S. losses', 'USS Gambier Bay, USS Johnston, USS Hoel, USS Samuel B. Roberts'],
          ['Yamato’s part', 'Sank or helped sink all but Samuel B. Roberts'],
          ['Japanese losses', 'Heavy cruisers Suzuya, Chōkai and Chikuma'],
        ],
      }),
    ev('1944-11-21', 'Survives a submarine attack on the way home', 'loss',
      { name: 'East China Sea, north of Formosa', lat: 26.2, lng: 121.4 }, 7,
      'Now flagship of the Second Fleet, Yamato is withdrawing to Kure when her group is attacked by the submarine Sealion, which sinks the battleship Kongō and the destroyer Urakaze. Yamato reaches Kure and is dry-docked for repairs and anti-aircraft upgrades. Captain Kōsaku Aruga takes command on 25 November.',
      { approx: true, theater: 'Asia' }),

    // ---------------- 1945: Ten-Go ----------------
    ev('1945-03-19', 'Damaged in the carrier raid on Kure', 'attack', P.kure, 12,
      'Aircraft of U.S. Task Group 58.1 attack Kure harbor and hit 16 warships. Yamato, maneuvering slowly in the Nasami Channel, suffers only minor damage from near misses and one bomb that strikes her bridge.'),
    ev('1945-04-06', 'Sails on Operation Ten-Go', 'movement',
      { name: 'Tokuyama, Yamaguchi Prefecture', lat: 34.03, lng: 131.8 }, 9,
      'With Allied forces landing on Okinawa, Yamato sails as the “Surface Special Attack Force” with the cruiser Yahagi and eight destroyers. They are to attack the invasion fleet alongside kamikaze aircraft, then beach Yamato as an unsinkable gun emplacement and fight until destroyed. The plan allowed only enough fuel for a one-way voyage, but local commanders issued 60% of capacity.',
      {
        time: '15:20', tz: 'JST',
        facts: [['Commander', 'Vice Adm. Seiichi Itō'], ['Captain', 'Kōsaku Aruga'], ['Force', 'Yamato, Yahagi, 8 destroyers']],
        paths: [{ label: 'Ten-Go route (approximate)', kind: 'route', coords: [[34.03, 131.8], [32.9, 132.1], [31.2, 131.0], [30.6, 128.6], [30.37, 128.07]] }],
      }),
    ev('1945-04-06', 'Spotted in the Bungo Strait', 'intelligence',
      { name: 'Bungo Strait', lat: 32.9, lng: 132.1 }, 8,
      'The Allies have already decoded the plan. The submarines Threadfin and Hackleback sight the force in the Bungo Strait and report its position, but cannot attack because of its speed and zigzagging. Admiral Raymond Spruance readies six battleships, but the strike is given to Admiral Marc Mitscher’s carriers.',
      { time: '20:00', tz: 'JST', approx: true }),
    ev('1945-04-07', 'Carrier aircraft attack', 'attack', P.wreck, 8,
      'About 280 American bombers and torpedo bombers arrive over the force around 12:30, and the first attack begins at 12:37. Within minutes bombs wreck anti-aircraft mounts and the radar room and torpedoes strike her port side. Further waves at about 13:00 and 13:40 leave Yamato listing heavily, unable to fire her main guns, and stuck in a turn.',
      { time: '12:37', tz: 'JST' }),
    ev('1945-04-07', 'Yamato sinks', 'loss', P.wreck, 8,
      'The order to abandon ship comes at 14:02, and Yahagi sinks at 14:05. At 14:23 Yamato capsizes. As she rolls past 120°, one of her forward magazines detonates in a tremendous explosion. An estimated 3,055 of her 3,332 crew are killed, including Vice Admiral Itō and Captain Aruga, who both choose to go down with the ship. Four surviving destroyers pick up the few survivors.',
      {
        time: '14:23', tz: 'JST',
        facts: [['Killed', 'An estimated 3,055 of 3,332'], ['Hits', 'At least 11 torpedoes and 6 bombs'], ['Survivor account', 'Requiem for Battleship Yamato, by Yoshida Mitsuru']],
      }),

    // ---------------- Wreck and legacy ----------------
    ev('1968-04-01', 'Memorial erected on Tokunoshima', 'service',
      { name: 'Cape Inutabu, Tokunoshima, Amami Islands', lat: 27.67, lng: 128.88 }, 11,
      'A memorial tower is erected at Cape Inutabu on Tokunoshima to commemorate those lost in Operation Ten-Go.',
      { approx: true }),
    ev('1974-10-06', 'Space Battleship Yamato premieres', 'service',
      { name: 'Tokyo', lat: 35.685, lng: 139.753 }, 10,
      'Leiji Matsumoto’s television series reimagines Yamato rebuilt as a starship on a quest to save Earth. It spawns films and sequels, popularizes space opera, and as Star Blazers helps establish anime in North America.',
      { approx: true, wiki: { 'television series': 'Space_Battleship_Yamato' } }),
    ev('1984-08-01', 'Wreck identified', 'service', P.wreck, 8,
      'A 1982 expedition finds wreckage that cannot be clearly identified. A second expedition two years later records photographs and video that one of the battleship’s designers, Shigeru Makino, confirms show Yamato. She lies under 340 metres of water in two main pieces, a bow section and a separate stern.',
      { approx: true }),
    ev('2005-04-23', 'Yamato Museum opens in Kure', 'service',
      { name: 'Yamato Museum, Kure', lat: 34.241, lng: 132.556 }, 15,
      'The museum opens near the site of the old Kure shipyards. Its centerpiece is a 26.3-metre, 1:10 scale model of the battleship. Later that year Toei’s film Yamato, marking 60 years since the war’s end, becomes a box-office success.',
      { approx: true, wiki: { 'film Yamato': 'Yamato_(film)' } }),
    ev('2016-05-01', 'Digital survey of the wreck', 'service', P.wreck, 8,
      'A survey with digital imaging confirms the identification and shows details such as the Imperial chrysanthemum on her bow, a massive propeller and a detached main gun turret. A video of the survey is shown at the Yamato Museum.',
      { approx: true }),
  ];
})();
