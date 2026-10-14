// Timeline: The Attack on Hawaii (War in the Pacific).
// Loaded as a plain script (not fetched JSON) so the app works when opened
// directly from disk via file://. The timeline itself is declared in data/catalog.js.
//
// Event schema:
//   id        unique string (also used in deep links: index.html#1941-12-07/pearl-harbor)
//   date      'YYYY-MM-DD' local date at the event location
//   time      optional 'HH:MM' local time (24h); omit for date-only events
//   tz        time zone key from TIMEZONES in app.js (HST, JST, EST, ...)
//   sortTime  optional 'HH:MM' (in tz) that orders a date-only event within its day; not shown
//   approx    true when the time (or, for date-only events, the date) is approximate
//   title     short headline
//   type      key of TYPES in app.js: attack | loss | movement | intelligence | political |
//             invasion | home-front | construction | service
//   theater   'Pacific' | 'Asia' | 'Americas' | 'Europe'
//   location  { name, lat, lng }
//   zoom      max map zoom to use when flying to the event
//   summary   one-paragraph description
//   facts     optional array of [label, value] pairs
//   paths     optional array of { label, kind, coords: [[lat,lng],...] }
//             kind: 'strike' (animated dashes) | 'route' (solid)
//   link      optional { timeline, event, label } button that opens another timeline
//
// Events on the same day are ordered by absolute time (local time converted to GMT),
// so a day's sequence is true chronology even when it spans several time zones.

(function () {
  // Frequently used places.
  const P = {
    tokyo: { name: 'Tokyo, Japan', lat: 35.685, lng: 139.753 },
    hashirajima: { name: 'Hashirajima anchorage, Hiroshima Bay (flagship Nagato)', lat: 33.97, lng: 132.43 },
    hitokappu: { name: 'Hitokappu Bay, Etorofu, Kuril Islands', lat: 44.92, lng: 147.63 },
    launch: { name: 'Kido Butai launch point, ~230 nmi north of Oahu', lat: 26.0, lng: -158.0 },
    pearl: { name: 'Pearl Harbor, Oahu', lat: 21.3649, lng: -157.9496 },
    entrance: { name: 'Entrance to Pearl Harbor', lat: 21.275, lng: -157.972 },
    fordIsland: { name: 'Naval Air Station Ford Island', lat: 21.364, lng: -157.961 },
    hickam: { name: 'Hickam Field', lat: 21.335, lng: -157.955 },
    wheeler: { name: 'Wheeler Field', lat: 21.481, lng: -158.038 },
    kaneohe: { name: 'Naval Air Station Kaneohe Bay', lat: 21.45, lng: -157.768 },
    ewa: { name: 'Marine Corps Air Station Ewa', lat: 21.323, lng: -158.048 },
    bellows: { name: 'Bellows Field', lat: 21.364, lng: -157.712 },
    haleiwa: { name: 'Haleiwa auxiliary airfield', lat: 21.584, lng: -158.104 },
    shafter: { name: 'Fort Shafter, Honolulu', lat: 21.345, lng: -157.881 },
    honolulu: { name: 'Honolulu, Oahu', lat: 21.3069, lng: -157.8583 },
    drydock: { name: 'Drydock No. 1, Pearl Harbor Navy Yard', lat: 21.3547, lng: -157.9467 },
    dock1010: { name: '1010 Dock, Pearl Harbor Navy Yard', lat: 21.3565, lng: -157.95 },
  };

  // Battleship Row berths (south-east side of Ford Island).
  const ROW = {
    california: { name: 'Berth F-3, Battleship Row', lat: 21.3594, lng: -157.9592 },
    oklahoma: { name: 'Berth F-5 (outboard), Battleship Row', lat: 21.3617, lng: -157.9545 },
    maryland: { name: 'Berth F-5 (inboard), Battleship Row', lat: 21.3625, lng: -157.9552 },
    westVirginia: { name: 'Berth F-6 (outboard), Battleship Row', lat: 21.3631, lng: -157.9523 },
    tennessee: { name: 'Berth F-6 (inboard), Battleship Row', lat: 21.3639, lng: -157.953 },
    arizona: { name: 'Berth F-7, Battleship Row', lat: 21.365, lng: -157.95 },
    nevada: { name: 'Berth F-8, Battleship Row', lat: 21.3666, lng: -157.9477 },
    utah: { name: 'Berth F-11, west side of Ford Island', lat: 21.3687, lng: -157.9619 },
    raleigh: { name: 'Berth F-12, west side of Ford Island', lat: 21.3707, lng: -157.9604 },
  };

  const APPROACH = {
    label: 'Kido Butai approach route (approximate)',
    kind: 'route',
    coords: [[44.92, 147.63], [43.5, 155], [42.5, 165], [42, 175], [42, -175], [42, -165], [38, -160], [32, -158], [26, -158]],
  };
  const STRIKE = {
    label: 'Japanese air strike route from the carriers',
    kind: 'strike',
    coords: [[26.0, -158.0], [23.5, -158.1], [21.3649, -157.9496]],
  };
  const WITHDRAWAL = {
    label: 'Kido Butai withdrawal route (approximate)',
    kind: 'route',
    coords: [[26, -158], [30, -162], [34, -170], [33, 180], [31, 170], [30, 160], [32, 145], [33.97, 132.43]],
  };

  const E = (date, time, tz, title, type, location, zoom, summary, extra = {}) => ({
    id: extra.id || `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}`,
    date, time, tz, title, type, location, zoom, summary,
    theater: extra.theater || 'Pacific',
    ...extra,
  });

  WW2.events['attack-on-hawaii'] = [
    // ---------------- Planning and approach ----------------
    E('1941-11-05', '12:00', 'JST', 'War plan approved; Combined Fleet Order No. 1', 'political', P.tokyo, 11,
      'An Imperial Conference resolves to go to war if negotiations with the United States fail by early December. The same day Admiral Isoroku Yamamoto issues Combined Fleet Top Secret Order No. 1, setting out the opening operations including the strike on Pearl Harbor.',
      { approx: true, theater: 'Asia' }),
    E('1941-11-17', '12:00', 'JST', 'Yamamoto addresses the strike force aviators', 'political',
      { name: 'Saeki Bay, Kyushu (aboard Akagi)', lat: 32.95, lng: 131.95 }, 9,
      'Yamamoto visits the carrier Akagi in Saeki Bay and addresses the assembled aircrews and officers, warning them that the Americans would be formidable opponents.',
      { approx: true }),
    E('1941-11-18', '12:00', 'JST', 'Carriers slip out of home waters', 'movement',
      { name: 'Saeki Bay, Kyushu', lat: 32.95, lng: 131.95 }, 7,
      'The ships of the Kido Butai leave the Inland Sea individually and by different routes, bound for a remote anchorage in the Kurils. Radio operators left behind keep up simulated carrier traffic to make the fleet appear to still be in home waters.',
      { approx: true }),
    E('1941-11-18', '20:00', 'JST', 'Midget submarine force departs Kure', 'movement',
      { name: 'Kure Naval District', lat: 34.24, lng: 132.56 }, 9,
      'Five large I-class submarines (I-16, I-18, I-20, I-22 and I-24), each carrying a two-man Type A midget submarine on its deck, sail for Hawaii. The midgets are to penetrate the harbor and attack alongside the aircraft.',
      { approx: true }),
    E('1941-11-22', '12:00', 'JST', 'Kido Butai assembles at Hitokappu Bay', 'movement', P.hitokappu, 8,
      'By 22 November the six carriers and their escorts have gathered in the bleak, snow-covered anchorage of Hitokappu Bay on Etorofu, far from merchant shipping routes.',
      { approx: true }),
    E('1941-11-23', '12:00', 'JST', 'Target revealed to commanders', 'political', P.hitokappu, 8,
      'Vice Admiral Chūichi Nagumo briefs his captains and air commanders aboard Akagi. Aircrews study scale models of Oahu and Pearl Harbor and rehearse the plan.',
      { approx: true }),
    E('1941-11-26', '06:00', 'JST', 'Kido Butai sorties from Hitokappu Bay', 'movement', P.hitokappu, 4,
      'The strike force weighs anchor in fog and heads east into the North Pacific under strict radio silence, on a northern route chosen to avoid shipping. It can still be recalled if negotiations succeed.',
      {
        facts: [
          ['Commander', 'Vice Adm. Chūichi Nagumo'],
          ['Carriers', 'Akagi, Kaga, Sōryū, Hiryū, Shōkaku, Zuikaku'],
          ['Battleships', 'Hiei, Kirishima'],
          ['Cruisers', 'Tone, Chikuma (heavy); Abukuma (light)'],
          ['Others', '9 destroyers, 3 submarines, supply tankers'],
          ['Aircraft', 'About 400 embarked'],
        ],
        paths: [APPROACH],
      }),


    E('1941-11-27', '15:00', 'HST', 'Army in Hawaii goes on sabotage alert', 'intelligence', P.shafter, 12,
      'After an Army warning from Washington, Lt. Gen. Walter Short orders Alert No. 1, guarding against sabotage by local agents. Aircraft are parked tightly together so they are easier to guard, which makes them easy targets from the air.',
      { approx: true }),
    E('1941-11-28', '07:00', 'HST', 'USS Enterprise sails for Wake Island', 'movement', P.pearl, 9,
      'Task Force 8 under Vice Adm. William Halsey leaves Pearl Harbor to deliver Marine Wildcat fighters of VMF-211 to Wake Island. The carrier’s absence spares it on 7 December.',
      { approx: true }),
    E('1941-12-01', '14:00', 'JST', 'Imperial Conference decides on war', 'political', P.tokyo, 11,
      'With negotiations deadlocked, an Imperial Conference in the presence of Emperor Hirohito gives final sanction for war against the United States, Britain and the Netherlands.',
      { approx: true, theater: 'Asia' }),
    E('1941-12-02', '17:30', 'JST', '"Climb Mount Niitaka 1208"', 'political', P.hashirajima, 9,
      'Yamamoto’s flagship transmits the coded signal Niitakayama nobore 1208, confirming that hostilities will begin on 8 December, Japan time. The Kido Butai is now committed.',
      { approx: true }),
    E('1941-12-03', '12:00', 'JST', 'Fleet refuels in heavy seas', 'movement',
      { name: 'North Pacific, near the date line (approx.)', lat: 42.0, lng: 178.0 }, 5,
      'The task force refuels from its tankers in rough North Pacific weather, a difficult operation that had worried planners. Several men are swept overboard during the voyage.',
      { approx: true }),
    E('1941-12-05', '08:00', 'HST', 'USS Lexington sails for Midway', 'movement', P.pearl, 9,
      'Task Force 12, built around the carrier Lexington, leaves Pearl Harbor to ferry Marine scout bombers to Midway. With Enterprise also at sea, no U.S. carriers will be in port on Sunday morning.',
      { approx: true }),
    E('1941-12-06', '08:00', 'HST', 'Final refueling; dash south begins', 'movement',
      { name: 'North of Hawaii (approx.)', lat: 32.0, lng: -158.0 }, 5,
      'The strike force tops off its tanks for the last time and the tankers turn back. The carriers and escorts then turn south and run toward Oahu at high speed through the night.',
      { approx: true, paths: [APPROACH] }),
    E('1941-12-06', '18:00', 'HST', 'Spy’s last report on the fleet', 'intelligence',
      { name: 'Japanese Consulate, Nuuanu Avenue, Honolulu', lat: 21.318, lng: -157.852 }, 13,
      'Takeo Yoshikawa, a naval intelligence officer posing as a consular clerk, sends his final report on the warships in Pearl Harbor, noting no barrage balloons, no torpedo nets around the battleships, and that the carriers are absent.',
      { approx: true }),



    // ---------------- 7 December: before the attack ----------------
    E('1941-12-07', '03:42', 'HST', 'USS Condor sights a periscope', 'intelligence', { ...P.entrance, name: 'Off the entrance to Pearl Harbor' }, 12,
      'The minesweeper Condor spots what appears to be a submarine periscope less than two miles off the harbor entrance and signals the destroyer USS Ward, which searches without success.'),
    E('1941-12-07', '05:30', 'HST', 'Cruisers launch scout floatplanes', 'movement', P.launch, 6,
      'The heavy cruisers Tone and Chikuma launch reconnaissance floatplanes to check Pearl Harbor and the Lahaina anchorage at Maui for the U.S. fleet ahead of the main strike.',
      { approx: true }),
    E('1941-12-07', '06:00', 'HST', 'First wave launches', 'attack', P.launch, 6,
      'In pre-dawn darkness and a heavy swell, the six carriers turn into the wind and launch the first wave. Commander Mitsuo Fuchida leads it toward Oahu.',
      {
        facts: [
          ['Aircraft', '183'],
          ['Level bombers', '49 Nakajima B5N'],
          ['Torpedo bombers', '40 Nakajima B5N'],
          ['Dive bombers', '51 Aichi D3A'],
          ['Fighters', '43 Mitsubishi A6M Zero'],
          ['Leader', 'Cmdr. Mitsuo Fuchida'],
        ],
        paths: [STRIKE],
      }),
    E('1941-12-07', '06:15', 'HST', 'Enterprise launches scout bombers toward Oahu', 'movement',
      { name: 'USS Enterprise, ~200 nmi west of Oahu', lat: 21.3, lng: -161.6 }, 6,
      'Returning from Wake, Enterprise launches 18 SBD Dauntless dive bombers to scout ahead and land at Ford Island. They will fly straight into the attack.',
      { approx: true, paths: [{ label: 'Enterprise SBD flight to Ford Island', kind: 'route', coords: [[21.3, -161.6], [21.36, -157.96]] }] }),
    E('1941-12-07', '06:30', 'HST', 'USS Antares spots a midget submarine', 'intelligence', { ...P.entrance, name: 'Approach to Pearl Harbor' }, 12,
      'The supply ship Antares, towing a barge toward the harbor, sees a small submarine apparently trying to follow it through the anti-submarine net. Ward and a patrolling PBY flying boat are alerted.'),
    E('1941-12-07', '06:45', 'HST', 'USS Ward fires the first American shots', 'attack', { ...P.entrance, name: 'Off the entrance to Pearl Harbor' }, 12,
      'The destroyer Ward opens fire on the midget submarine, hitting its conning tower with its second shot, then drops depth charges. The midget sinks. These are the first American shots of the Pacific War, more than an hour before the air attack.',
      { facts: [['Ship', 'USS Ward (DD-139)'], ['Commander', 'Lt. William Outerbridge'], ['Wreck found', '2002, by the Hawaii Undersea Research Laboratory']] }),
    E('1941-12-07', '06:53', 'HST', 'Ward reports the attack; warning moves slowly', 'intelligence', { ...P.entrance, name: 'Off the entrance to Pearl Harbor' }, 12,
      'Ward radios that it has attacked, fired upon and depth-charged a submarine in the defensive sea area. The report is relayed and questioned, and it climbs the chain of command too slowly to raise a general alarm.'),
    E('1941-12-07', '07:02', 'HST', 'Opana radar detects incoming aircraft', 'intelligence',
      { name: 'Opana Point radar station, northern Oahu', lat: 21.695, lng: -157.992 }, 12,
      'Privates Joseph Lockard and George Elliott, keeping a mobile SCR-270 radar on after its scheduled shutdown for training, see the largest return they have ever seen, about 137 miles north. They phone the Information Center at Fort Shafter.',
      { facts: [['Range', '~137 miles'], ['Bearing', '3° east of north'], ['Radar', 'SCR-270B mobile set']] }),
    E('1941-12-07', '07:15', 'HST', 'Second wave launches', 'attack', P.launch, 6,
      'The second wave of 167 aircraft, led by Lt. Cmdr. Shigekazu Shimazaki, takes off. It has no torpedo bombers, since the harbor’s defenses are expected to be alert by the time it arrives.',
      {
        facts: [['Aircraft', '167'], ['Level bombers', '54 Nakajima B5N'], ['Dive bombers', '78 Aichi D3A'], ['Fighters', '35 Mitsubishi A6M Zero']],
        paths: [STRIKE],
      }),
    E('1941-12-07', '07:20', 'HST', '"Don’t worry about it"', 'intelligence', P.shafter, 12,
      'Lt. Kermit Tyler, on only his second shift at the Information Center, assumes the radar contact is a flight of B-17 bombers due in from California and tells the operators not to worry about it.'),
    E('1941-12-07', '07:40', 'HST', 'Kimmel learns of Ward’s report', 'intelligence',
      { name: 'Adm. Kimmel’s quarters, Makalapa', lat: 21.358, lng: -157.938 }, 13,
      'Admiral Kimmel is told of the destroyer’s action and prepares to go to headquarters. Within minutes the first bombs are falling.',
      { approx: true }),
    E('1941-12-07', '07:40', 'HST', 'Fuchida fires the deployment flare', 'attack',
      { name: 'Off Kahuku Point, northern Oahu', lat: 21.712, lng: -157.979 }, 11,
      'Seeing no defending fighters, Fuchida fires a single “black dragon” flare to signal that surprise has been achieved. Thinking the signal was missed, he fires another, and some dive bombers take it as the signal for a surprise-lost attack. They attack at the same time as the torpedo planes.'),
    E('1941-12-07', '07:48', 'HST', 'Kaneohe Naval Air Station attacked', 'attack', P.kaneohe, 13,
      'The first bombs and bullets of the air attack fall on Kaneohe Bay, where Zero fighters strafe the PBY Catalina patrol planes moored and parked along the bay. Nearly all of the station’s flying boats are destroyed or damaged.'),
    E('1941-12-07', '07:49', 'HST', '"To, to, to": attack ordered', 'attack',
      { name: 'Over northern Oahu', lat: 21.55, lng: -158.05 }, 10,
      'Fuchida signals “To, to, to” (charge) to his formation. The groups split off toward the harbor and the airfields.'),
    E('1941-12-07', '07:51', 'HST', 'Wheeler Field hit', 'attack', P.wheeler, 13,
      'Dive bombers and fighters hit Wheeler Field, the Army’s main fighter base, where P-40s and P-36s are parked wingtip to wingtip as an anti-sabotage measure. Hangars and dozens of fighters are destroyed in minutes.'),
    E('1941-12-07', '07:53', 'HST', '"Tora! Tora! Tora!"', 'attack',
      { name: 'Over Pearl Harbor', lat: 21.38, lng: -157.98 }, 10,
      'Fuchida radios the code words Tora! Tora! Tora!, reporting that complete surprise has been achieved. The signal is picked up as far away as Yamamoto’s flagship in Japan.'),
    E('1941-12-07', '07:53', 'HST', 'Marine air station at Ewa strafed', 'attack', P.ewa, 13,
      'Zeros sweep across Ewa Mooring Mast Field, setting fire to most of the Marine Corps aircraft parked there before they can take off.',
      { approx: true }),
    E('1941-12-07', '07:55', 'HST', 'Attack on Pearl Harbor', 'attack', P.pearl, 13,
      'Japanese carrier aircraft strike the U.S. Pacific Fleet at its moorings in Pearl Harbor. Torpedo bombers attack Battleship Row while dive bombers hit Ford Island, Hickam and the Navy Yard. In under two hours, 19 U.S. ships are sunk or damaged. The next day the United States declares war on Japan.',
      {
        id: 'pearl-harbor',
        link: { timeline: 'road-to-pearl-harbor', event: 'last-night-of-peace', label: 'How these ships got here: The Road to Pearl Harbor' },
        facts: [
          ['Attacker', 'Empire of Japan (Kido Butai, Vice Adm. Chūichi Nagumo)'],
          ['Defender', 'United States (Pacific Fleet, Adm. Husband E. Kimmel)'],
          ['Aircraft', '353 in two waves, launched from 6 carriers'],
          ['U.S. killed', '2,403 (including 68 civilians)'],
          ['U.S. wounded', '1,178'],
          ['U.S. ships', '8 battleships damaged, 4 sunk; 19 ships sunk or damaged in all'],
          ['U.S. aircraft', '188 destroyed, 159 damaged'],
          ['Japanese losses', '29 aircraft, 5 midget submarines, 64 killed'],
        ],
        paths: [STRIKE],
      }),
    E('1941-12-07', '07:55', 'HST', 'Hickam Field bombed', 'attack', P.hickam, 13,
      'Dive bombers hit the hangar line and the huge consolidated barracks at Hickam, the Army’s main bomber base, as men head to breakfast. It suffers the heaviest Army casualties of the day.',
      { approx: true }),
    E('1941-12-07', '07:55', 'HST', 'Ford Island Naval Air Station bombed', 'attack', P.fordIsland, 14,
      'Dive bombers strike the hangars and seaplane ramps of Ford Island in the middle of the harbor, destroying patrol planes and leaving fuel fires burning.'),
    E('1941-12-07', '07:55', 'HST', 'John Finn mans a machine gun at Kaneohe', 'attack', P.kaneohe, 13,
      'Chief Ordnanceman John Finn sets up a .50-caliber machine gun on an exposed instruction stand and fires at strafing Zeros for over two hours despite more than 20 wounds. He receives the first Medal of Honor of World War II.',
      { approx: true }),
    E('1941-12-07', '07:58', 'HST', '"AIR RAID PEARL HARBOR. THIS IS NOT DRILL"', 'intelligence', P.fordIsland, 14,
      'Lt. Cmdr. Logan Ramsey, at the Ford Island command center, has the famous alert broadcast to all ships and stations as bombs fall on the seaplane base.'),
    E('1941-12-07', '07:58', 'HST', 'USS Helena torpedoed at 1010 Dock', 'loss', P.dock1010, 15,
      'A torpedo aimed at the berth where the battleship Pennsylvania usually lies hits the light cruiser Helena. The blast also opens the hull of the old minelayer Oglala, moored alongside.',
      { approx: true }),
    E('1941-12-07', '08:00', 'HST', 'Morning colors aboard USS Nevada', 'attack', ROW.nevada, 15,
      'Nevada’s band begins The Star-Spangled Banner for 08:00 colors just as torpedo planes roar overhead. The musicians keep playing to the end under fire, then run for cover.',
      { approx: true }),
    E('1941-12-07', '08:00', 'HST', 'B-17s from California arrive mid-attack', 'movement', P.hickam, 12,
      'Twelve B-17 bombers on a ferry flight from Hamilton Field, unarmed and low on fuel, arrive in the middle of the raid. Their crews land wherever they can, including Bellows Field and a golf course. One is destroyed on landing at Hickam.',
      { approx: true }),
    E('1941-12-07', '08:00', 'HST', 'USS Raleigh torpedoed', 'loss', ROW.raleigh, 15,
      'The light cruiser Raleigh is hit by a torpedo amidships and begins to flood. Her crew counterfloods, jettisons topside weight and keeps her from capsizing. No crew are killed.',
      { approx: true }),
    E('1941-12-07', '08:05', 'HST', 'USS California hit', 'loss', ROW.california, 15,
      'California, at the southern end of Battleship Row with many watertight hatches open for inspection, is struck by two torpedoes and a bomb. Despite fire and flooding she stays afloat for three days, then settles into the mud. 100 crew are killed.',
      { approx: true, wiki: { California: 'USS_California_(BB-44)' }, facts: [['Killed', '100'], ['Fate', 'Raised, rebuilt; served through the war']] }),
    E('1941-12-07', '08:06', 'HST', 'USS West Virginia torpedoed', 'loss', ROW.westVirginia, 15,
      'West Virginia takes up to seven torpedoes and two bombs. Quick counterflooding by her crew keeps her upright and she settles on the bottom on an even keel. Captain Mervyn Bennion is mortally wounded on the bridge. 106 crew are killed.',
      { approx: true, facts: [['Killed', '106'], ['Fate', 'Raised, rebuilt; present at the Japanese surrender in 1945']] }),
    E('1941-12-07', '08:08', 'HST', 'USS Oklahoma capsizes', 'loss', ROW.oklahoma, 15,
      'Hit by as many as nine torpedoes, Oklahoma rolls over within about twelve minutes, trapping hundreds of men inside the hull. 429 of her crew are killed, the second-highest toll of any ship.',
      { approx: true, facts: [['Killed', '429'], ['Fate', 'Righted 1943; sank under tow to the scrapyard, 1947']] }),
    E('1941-12-07', '08:10', 'HST', 'USS Arizona explodes', 'loss', ROW.arizona, 15,
      'A 1,760-lb armor-piercing bomb dropped by a level bomber penetrates Arizona’s deck near the No. 2 turret and detonates her forward magazines. The explosion destroys the front of the ship. 1,177 men are killed, nearly half of all Americans who die in the attack.',
      { facts: [['Killed', '1,177'], ['Fate', 'Never raised; now the USS Arizona Memorial'], ['Captain', 'Franklin Van Valkenburgh (killed; Medal of Honor)'], ['Also killed', 'Rear Adm. Isaac C. Kidd']] }),
    E('1941-12-07', '08:12', 'HST', 'USS Utah capsizes', 'loss', ROW.utah, 15,
      'The old target ship Utah, moored where Japanese pilots had hoped to find an aircraft carrier, is hit by two torpedoes and rolls over. 58 crew are killed. Chief Watertender Peter Tomich stays below to keep the boilers safe and is awarded the Medal of Honor posthumously.',
      { facts: [['Killed', '58'], ['Fate', 'Never raised; memorial at Ford Island']] }),
    E('1941-12-07', '08:15', 'HST', 'Doris Miller fights back aboard West Virginia', 'attack', ROW.westVirginia, 15,
      'Mess Attendant Doris Miller helps carry the mortally wounded Captain Bennion to cover, then mans an unattended anti-aircraft machine gun until ordered to abandon ship. He is the first Black American to receive the Navy Cross.',
      { approx: true }),
    E('1941-12-07', '08:15', 'HST', 'Welch and Taylor take off from Haleiwa', 'attack', P.haleiwa, 12,
      'Second Lieutenants George Welch and Kenneth Taylor drive to the small Haleiwa auxiliary field, where their P-40s had been dispersed, and take off to engage the attackers. Between them they are credited with several kills.',
      { approx: true }),
    E('1941-12-07', '08:20', 'HST', 'USS Tennessee and USS Maryland bombed', 'loss', ROW.tennessee, 15,
      'Moored inboard and shielded from torpedoes, Tennessee and Maryland are each hit by two bombs. Tennessee is pinned between the sunken West Virginia and the burning oil from Arizona. Damage is moderate. Tennessee loses 5 men and Maryland 4.',
      { approx: true }),
    E('1941-12-07', '08:20', 'HST', 'Enterprise’s scout bombers fly into the battle', 'attack', P.ewa, 11,
      'The Dauntlesses from Enterprise arrive over Oahu in the middle of the raid. Several are shot down by Japanese fighters, and at least one by American anti-aircraft fire.',
      { approx: true }),
    E('1941-12-07', '08:30', 'HST', 'Bellows Field strafed', 'attack', P.bellows, 13,
      'A lone fighter strafes the small field at Bellows on the windward coast. Later the second wave returns in force, catching pilots trying to get their aircraft into the air.',
      { approx: true }),
    E('1941-12-07', '08:40', 'HST', 'USS Nevada gets underway', 'movement', ROW.nevada, 14,
      'Despite a torpedo hit, Nevada builds steam with only junior officers aboard and backs out of her berth. She is the only battleship to get underway, steaming past the burning Arizona toward the channel to cheers from men in the water.',
      { approx: true }),
    E('1941-12-07', '08:43', 'HST', 'USS Monaghan rams a midget submarine', 'attack',
      { name: 'North of Ford Island, Pearl Harbor', lat: 21.375, lng: -157.965 }, 14,
      'A midget submarine that has slipped into the harbor fires torpedoes at the seaplane tender Curtiss. They miss. The destroyer Monaghan rams the submarine and finishes it with depth charges.',
      { approx: true }),
    E('1941-12-07', '08:54', 'HST', 'Second wave strikes', 'attack', P.pearl, 12,
      'Shimazaki’s second wave arrives over a harbor now shrouded in smoke and alive with anti-aircraft fire. Level bombers hit the air stations while dive bombers go after ships in the harbor.'),
    E('1941-12-07', '09:06', 'HST', 'Pennsylvania and destroyers hit in drydock', 'loss', P.drydock, 15,
      'Bombs strike the fleet flagship Pennsylvania in Drydock No. 1. The destroyers Cassin and Downes in the dock with her are wrecked by bombs and fire, and Cassin topples onto Downes.',
      { approx: true }),
    E('1941-12-07', '09:10', 'HST', 'Nevada beached at Hospital Point', 'loss',
      { name: 'Hospital Point, Pearl Harbor channel', lat: 21.348, lng: -157.964 }, 14,
      'Dive bombers concentrate on Nevada, hoping to sink her and block the channel. Badly damaged and on fire, she is deliberately run aground at Hospital Point. 60 crew are killed.',
      { approx: true, facts: [['Killed', '60'], ['Fate', 'Refloated; supported the Normandy landings in 1944']] }),
    E('1941-12-07', '09:30', 'HST', 'USS Shaw’s magazine explodes', 'loss',
      { name: 'Floating drydock YFD-2, Pearl Harbor', lat: 21.3522, lng: -157.9525 }, 15,
      'Fires set by bombs reach the destroyer Shaw’s forward magazine in the floating drydock, setting off one of the most photographed explosions of the war. Her bow is blown off, but she is later repaired.'),
    E('1941-12-07', '09:30', 'HST', 'Anti-aircraft shells fall on Honolulu', 'home-front', P.honolulu, 13,
      'U.S. anti-aircraft shells with faulty fuzes fall into Honolulu and explode, starting fires and killing civilians. Most of the 68 civilians killed that day are victims of this friendly fire.',
      { approx: true }),
    E('1941-12-07', '09:45', 'HST', 'Last attackers withdraw', 'attack', P.pearl, 10,
      'The final Japanese aircraft leave Oahu to rejoin the carriers. In about two hours, more than 2,400 Americans have been killed.',
      { approx: true }),
    E('1941-12-07', '10:00', 'HST', 'USS Oglala capsizes', 'loss', P.dock1010, 15,
      'Her hull opened by the torpedo that hit Helena, the elderly minelayer Oglala is towed clear of the cruiser and rolls over at the dock.',
      { approx: true }),



    E('1941-12-07', '11:45', 'HST', 'Marshall’s warning arrives, hours too late', 'intelligence', P.shafter, 12,
      'The telegram, received in Honolulu as the attack began, is delivered to Fort Shafter by a motorcycle messenger. It is not decoded and seen by Gen. Short until mid-afternoon.',
      { approx: true }),
    E('1941-12-07', '13:30', 'HST', 'Nishikaichi crash-lands on Niihau', 'home-front',
      { name: 'Niihau, Hawaii', lat: 21.9, lng: -160.15 }, 10,
      'Airman Shigenori Nishikaichi, his damaged Zero unable to reach the carriers, lands on the isolated island of Niihau. The days-long standoff that follows, the Niihau incident, ends with his death.',
      { approx: true }),
    E('1941-12-07', '13:30', 'HST', 'Nagumo decides against a third strike', 'movement', P.launch, 5,
      'With his aircraft recovered and his carriers undamaged, Nagumo chooses not to launch another attack. He fears the unlocated U.S. carriers and his fleet’s vulnerability. The oil tank farms, repair shops and submarine base are left intact, which later proves critical. The fleet withdraws to the northwest.',
      { approx: true, paths: [WITHDRAWAL] }),



    E('1941-12-07', '15:30', 'HST', 'Martial law declared in Hawaii', 'home-front',
      { name: 'ʻIolani Palace, Honolulu (Territorial government)', lat: 21.3068, lng: -157.859 }, 14,
      'Territorial Governor Joseph Poindexter proclaims martial law and suspends habeas corpus. Gen. Short becomes military governor. Military rule will last nearly three years.'),
    E('1941-12-07', '18:00', 'HST', 'Arrests of Japanese community leaders begin', 'home-front', P.honolulu, 12,
      'FBI agents and military police begin detaining Japanese community leaders, priests, teachers and businessmen in Hawaii from pre-compiled lists. Similar arrests begin on the mainland.',
      { approx: true }),

    E('1941-12-07', '21:00', 'HST', 'Friendly fire downs Enterprise fighters', 'attack', P.fordIsland, 12,
      'Six F4F Wildcats from Enterprise attempt to land at Ford Island after dark. Jittery gunners across the harbor open fire, shooting down several and killing some of their pilots.',
      { approx: true }),



    // ---------------- 8 December ----------------
    E('1941-12-08', '00:15', 'JST', 'Roosevelt’s message reaches Tokyo, too late', 'political', P.tokyo, 12,
      'Ambassador Joseph Grew delivers Roosevelt’s appeal to Foreign Minister Shigenori Tōgō around midnight, after hours of delay. By the time it reaches the Emperor, the strike force is already launching.',
      { approx: true, theater: 'Asia' }),




    E('1941-12-08', '05:40', 'HST', 'Kazuo Sakamaki captured: first Japanese POW', 'home-front',
      { name: 'Waimanalo, near Bellows Field', lat: 21.355, lng: -157.705 }, 13,
      'After his midget submarine (HA-19) runs aground on a reef, Ensign Kazuo Sakamaki swims ashore exhausted and is captured by Cpl. David Akui of the Hawaii National Guard. He becomes America’s first prisoner of war of the Pacific War.',
      { approx: true }),


    E('1941-12-08', '11:45', 'JST', 'Imperial Rescript declares war', 'political', P.tokyo, 11,
      'The Emperor’s rescript declaring war on the United States and the British Empire is issued and broadcast. Japanese newspapers trumpet the victory at Hawaii.',
      { approx: true, theater: 'Asia' }),




    E('1941-12-08', '13:30', 'HST', 'Survivors cut free from Oklahoma’s hull', 'home-front', ROW.oklahoma, 15,
      'Navy Yard workers led by civilian Julio DeCastro cut through the overturned hull of Oklahoma after hearing tapping from inside. Over about 36 hours they rescue 32 trapped sailors.',
      { approx: true }),


    E('1941-12-08', '17:00', 'HST', 'Enterprise returns to a shattered harbor', 'movement', P.pearl, 12,
      'Enterprise enters Pearl Harbor at dusk past the wreckage and burning oil. Halsey is reported to have vowed that, by the war’s end, Japanese would be spoken only in hell. The carrier refuels and sails again before dawn.',
      { approx: true }),

    // ---------------- Aftermath ----------------










    E('1941-12-17', '12:00', 'HST', 'Kimmel and Short relieved; Nimitz named', 'political',
      { name: 'CINCPAC headquarters, Submarine Base Pearl Harbor', lat: 21.353, lng: -157.94 }, 13,
      'Adm. Kimmel and Lt. Gen. Short are relieved of command. Adm. Chester W. Nimitz is named the new Commander in Chief of the Pacific Fleet.',
      { approx: true }),

    E('1941-12-23', '12:00', 'JST', 'Kido Butai returns to Japan', 'movement', P.hashirajima, 6,
      'The Pearl Harbor strike force arrives back in the Inland Sea to a heroes’ welcome, having lost no ships. Within months the same carriers will strike Darwin and Ceylon.',
      { approx: true, paths: [WITHDRAWAL] }),

    E('1941-12-31', '10:00', 'HST', 'Nimitz takes command aboard USS Grayling', 'political',
      { name: 'USS Grayling, Submarine Base Pearl Harbor', lat: 21.352, lng: -157.942 }, 14,
      'With the battleships sunk, Adm. Nimitz takes command of the Pacific Fleet on the deck of the submarine Grayling. He will lead it to victory at Midway six months later.',
      { approx: true }),
  ];
})();
