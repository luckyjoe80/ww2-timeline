// Timeline: The Battle of Midway (War in the Pacific).
// From Yamamoto's plan and the American code-breakers to the loss of four Japanese carriers
// and Yorktown, 4–7 June 1942, and the Aleutian operation alongside it.
// Checked against the English Wikipedia articles "Battle of Midway", the four Japanese carriers,
// "USS Yorktown (CV-5)", "USS Enterprise (CV-6)", "Japanese cruiser Mikuma", "Station HYPO",
// "Operation K", "Aleutian Islands campaign", "USS Nautilus (SS-168)", "Japanese submarine I-168"
// and the biographies of Henderson, Fleming and Tinker (October 2026).
//
// Times are local battle-area times as the sources give them (shown as Midway time). Accounts
// differ by an hour or more on some moments; where they do, the "Battle of Midway" and carrier
// articles are followed. Event schema: see data/timelines/attack-on-hawaii.js.

(function () {
  const P = {
    hashirajima: { name: 'Hashirajima anchorage, Hiroshima Bay', lat: 33.97, lng: 132.43 },
    pearl: { name: 'Pearl Harbor, Oahu', lat: 21.35, lng: -157.95 },
    hypo: { name: 'Station HYPO, Pearl Harbor', lat: 21.355, lng: -157.96 },
    midway: { name: 'Midway Atoll', lat: 28.21, lng: -177.37 },
    eastern: { name: 'Eastern Island airfield, Midway', lat: 28.205, lng: -177.33 },
    kidoButai: { name: 'Kidō Butai, about 250 nmi northwest of Midway', lat: 30.6, lng: -179.0 },
    tf16: { name: 'Task Force 16, northeast of Midway (approx.)', lat: 31.6, lng: -175.0 },
    tf17: { name: 'Task Force 17, northeast of Midway (approx.)', lat: 31.8, lng: -175.0 },
    pointLuck: { name: '"Point Luck", northeast of Midway (approx.)', lat: 32.0, lng: -173.0 },
    akagi: { name: 'Where Akagi sank', lat: 30.5, lng: -178.667 },
    kaga: { name: 'Where Kaga sank', lat: 30.383, lng: -179.283 },
    soryu: { name: 'Where Sōryū sank', lat: 30.633, lng: -179.217 },
    hiryu: { name: 'North of the Kidō Butai’s battle position (approx.)', lat: 31.4, lng: -179.2 },
    yorktown: { name: 'Northeast of Midway (approx.)', lat: 30.6, lng: -176.6 },
    mikuma: { name: 'Where Mikuma sank, west of Midway', lat: 29.333, lng: 173.5 },
    dutch: { name: 'Dutch Harbor, Unalaska Island, Alaska', lat: 53.89, lng: -166.54 },
    kiska: { name: 'Kiska, Aleutian Islands', lat: 51.98, lng: 177.5 },
    attu: { name: 'Attu, Aleutian Islands', lat: 52.9, lng: 173.2 },
    tokyo: { name: 'Tokyo', lat: 35.68, lng: 139.76 },
  };

  const ev = (date, title, type, location, zoom, summary, extra = {}) => ({
    id: extra.id || `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}`,
    date, title, type, location, zoom, summary,
    theater: extra.theater || 'Pacific',
    ...extra,
  });
  const at = (time, extra = {}) => ({ time, tz: 'MID', ...extra });
  const ord = (sortTime) => ({ sortTime, tz: 'MID' }); // order within the day only; no time shown

  WW2.events['battle-of-midway'] = [
    // ---------- Background ----------
    ev('1942-04-05', 'Yamamoto’s Operation MI is adopted', 'political', P.hashirajima, 6,
      'In April, after months of argument between the Army, the Naval General Staff and the Combined Fleet, Yamamoto wins approval for his plan with a thinly veiled threat to resign. Japan will take Midway, at the far northwest end of the Hawaiian chain, to draw out the U.S. Pacific Fleet’s carriers and destroy them. To win Army support, the Navy agrees to invade Attu and Kiska in the Aleutian Islands at the same time.',
      { approx: true, facts: [['Code name', 'Operation MI (Midway); Operation AL (Aleutians)'], ['Aim', 'Destroy the American carrier force']] }),
    ev('1942-04-18', 'The Doolittle Raid', 'attack', P.tokyo, 6,
      'Sixteen USAAF B-25 Mitchell bombers launched from USS Hornet bomb Tokyo and other Japanese cities. The damage is slight, but the raid shocks Japan’s leaders and sharpens Yamamoto’s concern about the American carriers, which he sees as the main threat in the Pacific.',
      { link: { timeline: 'yamamoto', event: '1942-04-18-the-doolittle-raid-strikes-tokyo', label: 'See the raid in Isoroku Yamamoto' } }),
    ev('1942-05-08', 'Coral Sea leaves two carriers behind', 'loss',
      { name: 'Coral Sea', lat: -15.5, lng: 156.0 }, 5,
      'The Battle of the Coral Sea ends. Shōkaku is badly damaged and Zuikaku has lost almost half her air group, so Japan’s two newest carriers will miss Midway. The Americans lose Lexington, and Yorktown is damaged badly enough that the Japanese believe she has been sunk.'),

    // ---------- Code-breaking and preparation ----------
    ev('1942-05-20', '“AF is short on water”', 'intelligence', P.hypo, 12,
      'Japanese messages have referred for weeks to an operation against objective “AF”. To prove that AF is Midway, Commander Joseph Rochefort’s team at Station HYPO has the base at Midway report by undersea cable, then broadcast uncoded, that its water purification plant has broken down. Within 24 hours a Japanese message reports that AF is short of water. HYPO also works out that the attack will come on 4 or 5 June and gives Admiral Nimitz the Japanese order of battle.',
      { approx: true, facts: [['Code', 'JN-25b, partly broken'], ['Ruse devised by', 'Wilfred J. Holmes']] }),
    ev('1942-05-24', 'Japan changes its naval code, too late', 'intelligence', P.hypo, 12,
      'A new Japanese codebook comes into use after a delay. It takes the code-breakers several days to break into it, but the crucial messages about Midway have already been read. The Americans will meet the attack knowing where, when and in what strength the Japanese are coming.'),
    ev('1942-05-26', 'Enterprise and Hornet return to Pearl Harbor', 'movement', P.pearl, 11,
      'Recalled from the South Pacific, Enterprise returns to Pearl Harbor and begins intensive preparation for the expected attack on Midway. Vice Admiral William Halsey has been stricken with shingles, so command of Task Force 16 passes to his escort commander, Rear Admiral Raymond Spruance.'),
    ev('1942-05-27', 'Kidō Butai sails from Japan', 'movement', P.hashirajima, 6,
      'Vice Admiral Chūichi Nagumo’s carrier striking force, Akagi, Kaga, Hiryū and Sōryū, leaves the Inland Sea for Midway with 248 aircraft. A one-day delay in its sailing means the Aleutian attack will open a day before the strike on Midway. (Some of the carrier histories give 25 May for the departure.)',
      { facts: [['Commander', 'Vice Admiral Chūichi Nagumo (in Akagi)'], ['Carriers', 'Akagi, Kaga (Carrier Division 1); Hiryū, Sōryū (Carrier Division 2)'], ['Aircraft', '248']],
        paths: [{ label: 'Kidō Butai toward Midway (approximate)', kind: 'route', coords: [[33.97, 132.43], [33, 145], [33, 160], [32, 175], [30.6, -179.0]] }] }),
    ev('1942-05-27', 'Yamamoto follows in Yamato', 'movement', P.hashirajima, 6,
      'Yamamoto’s Main Body of battleships trails Nagumo’s carriers by several hundred miles. His forces are spread across four widely separated groups, too far apart to support one another.',
      { link: { timeline: 'yamato', event: '1942-05-27-sails-for-midway', label: 'See this in Battleship Yamato' } }),
    ev('1942-05-27', 'Damaged Yorktown reaches Pearl Harbor', 'movement', P.pearl, 12,
      'Yorktown arrives from the Coral Sea and enters dry dock the next day. Inspectors estimate months of work, but the Pearl Harbor Naval Shipyard works around the clock and in 72 hours makes her fit for two or three weeks of operations. Her flight deck is patched and whole sections of internal frames are cut out and replaced.'),
    ev('1942-05-28', 'Task Force 16 sails', 'movement', P.pearl, 9,
      'Enterprise leaves Pearl Harbor as Spruance’s flagship, with Hornet, under orders “to hold Midway and inflict maximum damage on the enemy by strong attrition tactics”.',
      { paths: [{ label: 'Task Force 16 to Point Luck (approximate)', kind: 'route', coords: [[21.35, -157.95], [26, -165], [32.0, -173.0]] }] }),
    ev('1942-05-30', 'Yorktown sails with repair crews still aboard', 'movement', P.pearl, 9,
      'Yorktown sails as the core of Task Force 17 under Rear Admiral Frank Jack Fletcher, with workers from the repair ship Vestal still aboard. Her rebuilt air group draws on squadrons from Saratoga, with Lieutenant Commander John Thach leading the fighters.',
      { paths: [{ label: 'Task Force 17 to Point Luck (approximate)', kind: 'route', coords: [[21.35, -157.95], [26, -165], [32.0, -173.0]] }] }),
    ev('1942-05-30', 'Operation K is called off', 'intelligence',
      { name: 'French Frigate Shoals', lat: 23.75, lng: -166.15 }, 9,
      'Japan planned to send flying boats to scout Pearl Harbor for the American carriers, refuelling from submarines at French Frigate Shoals. The submarine I-123 finds the shoals watched by American warships and the plan is cancelled, leaving the Japanese with no knowledge of the American carriers’ movements.'),
    ev('1942-05-31', 'I-168 scouts Midway', 'intelligence', P.midway, 9,
      'The submarine I-168, one of 13 in the Advance Expeditionary Force, reconnoitres Kure Atoll and then Midway itself. The rest of the Japanese submarine picket line is late getting into position.',
      { link: { timeline: 'pacific-submarines', event: '1942-06-06-i-168-finishes-off-uss-yorktown', label: 'See I-168 in Submarine Operations' } }),
    ev('1942-06-02', 'The American carriers meet at Point Luck', 'movement', P.pointLuck, 7,
      'Task Forces 16 and 17 rendezvous northeast of Midway at “Point Luck”, unseen by the late Japanese submarines. Fletcher, the senior officer, is in tactical command. Yorktown keeps station about 10 miles north of Spruance’s carriers.',
      { approx: true, facts: [['U.S. carriers', 'Enterprise, Hornet (TF 16); Yorktown (TF 17)'], ['Midway’s aircraft', '122, including 31 PBYs, 17 B-17s and four torpedo-armed B-26s']] }),

    // ---------- 3 June ----------
    ev('1942-06-03', 'Japanese carrier planes strike Dutch Harbor', 'attack', P.dutch, 8,
      'Operation AL opens in the Aleutians a day before the Midway strike. In fog and darkness only half of the B5N strike force from the carriers Jun’yō and Ryūjō finds the U.S. naval base, the first arriving at 05:45 local time. Met by heavy anti-aircraft fire and fighters, they do little damage.',
      { theater: 'Aleutians', ...ord('05:45') }),
    ev('1942-06-03', 'A PBY finds the invasion force', 'intelligence',
      { name: 'About 500 nmi west-southwest of Midway', lat: 25.5, lng: 173.5 }, 5,
      'Ensign Jack Reid, flying a PBY of patrol squadron VP-44, sights the Japanese Occupation Force about 500 nmi west-southwest of Midway. He reports it as the Main Force.',
      at('09:00', { approx: true })),
    ev('1942-06-03', 'B-17s attack the transports', 'attack',
      { name: 'About 570 nmi west of Midway', lat: 27.8, lng: 172.6 }, 5,
      'Nine B-17s take off from Midway at 12:30 and three hours later find Rear Admiral Raizō Tanaka’s transport group 570 nmi to the west. Their crews claim hits on four ships, but none is hit.',
      at('15:30', { approx: true })),

    // ---------- 4 June ----------
    ev('1942-06-04', 'A PBY torpedoes Akebono Maru', 'attack',
      { name: 'Japanese transport group, west of Midway (approx.)', lat: 27.9, lng: 174.0 }, 6,
      'A torpedo from a night-flying PBY hits the oil tanker Akebono Maru, the first hit of the battle. It is the only successful American air-launched torpedo attack at Midway.',
      at('01:00', { approx: true })),
    ev('1942-06-04', 'Nagumo launches against Midway', 'attack', P.kidoButai, 7,
      'From about 250 nmi northwest of Midway, Nagumo launches 36 D3A dive bombers and 36 B5N bombers escorted by 36 Zero fighters. He sends out only seven search planes, one of them from Tone half an hour late, too few to cover their sectors properly.',
      at('04:30', { facts: [['Strike', '36 D3A, 36 B5N, 36 A6M Zero'], ['Searches', '7 aircraft (an eighth from Tone 30 minutes late)']] })),
    ev('1942-06-04', '“Two carriers” sighted', 'intelligence', P.kidoButai, 6,
      'Eleven PBYs leave Midway on their search patterns as the Japanese strike takes off. One reports two Japanese carriers; ten minutes later another spots the incoming strike.',
      at('05:34')),
    ev('1942-06-04', 'Midway’s radar picks up the raid', 'intelligence', P.eastern, 11,
      'Radar on Midway detects the Japanese 93 nautical miles out. Every aircraft that can fly is scrambled: the bombers head for the carriers and the fighters stay to defend the island.',
      at('05:53')),
    ev('1942-06-04', 'Marine fighters meet the raid', 'loss',
      { name: 'Over the sea northwest of Midway', lat: 28.6, lng: -177.7 }, 9,
      'The Marine fighters of VMF-221 under Major Floyd B. Parks, six F4F Wildcats and twenty F2A Buffalos, intercept the Japanese at 06:20. They shoot down four B5Ns and a Zero, but within minutes two F4Fs and thirteen F2As are destroyed, and only two of the survivors remain airworthy. Parks is among the dead.',
      at('06:20')),
    ev('1942-06-04', 'Japanese bombs fall on Midway', 'attack', P.eastern, 12,
      'Japanese carrier aircraft bomb and heavily damage the base, while intense anti-aircraft fire destroys three of them and damages many more. Of the 108 Japanese aircraft in the attack, 11 are lost and 43 damaged. The airfield can still be used, and the strike leader reports that a second attack will be needed before troops can land.',
      at('06:34')),
    ev('1942-06-04', 'Midway’s bombers attack the carriers', 'attack', P.kidoButai, 7,
      'Six TBF Avengers of VT-8, four torpedo-armed B-26s, Marine dive bombers and B-17s attack the carrier force in turn. None scores a hit. A damaged B-26 narrowly misses Akagi’s bridge before crashing into the sea. Major Lofton R. Henderson is killed leading his inexperienced SBD squadron; the airfield on Guadalcanal will later be named after him.',
      at('07:10', { facts: [['U.S. losses', '5 Avengers, 2 SB2Us, 8 SBDs, 2 B-26s'], ['Japanese losses', '3 Zeros']] })),
    ev('1942-06-04', 'The American carriers launch', 'movement', P.tf16, 7,
      'On his staff’s advice, Spruance launches at about 07:00 to catch the Japanese carriers while their strike is being recovered. Enterprise and Hornet finish launching by 07:55. Fletcher, recovering his scouts first, follows from Yorktown, which is not finished until 09:08.',
      at('07:00')),
    ev('1942-06-04', 'Nagumo orders his reserve re-armed for Midway', 'intelligence', P.kidoButai, 7,
      'Nagumo orders the reserve aircraft, armed with torpedoes in case American warships appear, to be re-armed with bombs for a second strike on Midway. The work is slow, and bombs and torpedoes end up stacked around the hangars instead of stowed in the magazines.',
      at('07:15')),
    ev('1942-06-04', 'Tone’s scout finds American ships', 'intelligence', P.kidoButai, 7,
      'The late scout from Tone reports a sizeable American force to the east without saying what it is. Nagumo probably receives the report around 08:00, reverses the re-arming order and asks for the ships’ types. Confirmation that a carrier is present arrives only at 08:20. He decides to recover his Midway strike first and then attack with a properly armed force.',
      at('07:40')),
    ev('1942-06-04', 'Nautilus attacks the battleship Kirishima', 'attack', P.kidoButai, 8,
      'The old submarine Nautilus closes the Japanese fleet, attacks the battleship Kirishima without success and is depth-charged by the destroyer Arashi. Arashi’s high-speed run back to the carriers will later lead the Enterprise dive bombers to their targets.',
      at('08:00')),
    ev('1942-06-04', 'Torpedo Eight is wiped out', 'loss', P.kidoButai, 8,
      'Lieutenant Commander John C. Waldron’s Torpedo Squadron 8 from Hornet finds the carriers and attacks without fighter escort. All 15 of its TBD Devastators are shot down. Ensign George H. Gay Jr. is the only survivor of its 30 aircrew. Torpedo squadrons from Enterprise and Yorktown follow and are cut to pieces too, scoring no hits.',
      at('09:20', { facts: [['VT-8', '15 of 15 lost'], ['VT-6', '9 of 14 lost'], ['VT-3', '10 of 12 lost']] })),
    ev('1942-06-04', 'Yorktown’s torpedo planes draw off the Zeros', 'attack', P.kidoButai, 8,
      'Torpedo Squadron 3 from Yorktown, led by Lieutenant Commander Lance Massey, approaches from the southeast and draws most of the Japanese combat air patrol low and away to that side of the fleet. The torpedo attacks score no hits, but they leave the Zeros out of position and short of fuel and ammunition.',
      at('10:00')),
    ev('1942-06-04', 'Dive bombers wreck Kaga, Akagi and Sōryū', 'attack', P.kidoButai, 8,
      'Air Group Commander Wade McClusky, low on fuel, follows the wake of the destroyer Arashi to the carriers. Three dive-bomber squadrons arrive almost together, unopposed, while the Japanese hangar decks are full of fuelled and armed aircraft. Both Enterprise squadrons dive on Kaga by mistake; Lieutenant Richard Halsey Best and two wingmen pull out and put a single bomb into Akagi. Yorktown’s VB-3 under Lieutenant Commander Maxwell Leslie hits Sōryū. Within six minutes Sōryū and Kaga are ablaze from stem to stern.',
      at('10:22', { facts: [['Enterprise', 'VB-6 and VS-6 (McClusky)'], ['Yorktown', 'VB-3 (Leslie)'], ['Hits', 'Kaga 3–5, Akagi 1, Sōryū at least 3']] })),
    ev('1942-06-04', 'Nagumo leaves the burning Akagi', 'movement', P.akagi, 8,
      'Nagumo is reluctant to leave his flagship, but his chief of staff, Ryūnosuke Kusaka, persuades him. He shifts his flag to the light cruiser Nagara.',
      at('10:46')),
    ev('1942-06-04', 'Hiryū strikes back', 'attack', P.kidoButai, 7,
      'Hiryū, the only undamaged Japanese carrier, launches 18 D3A dive bombers and six Zeros. They follow the returning American aircraft to the first carrier they find, Yorktown.',
      at('10:54')),
    ev('1942-06-04', 'Three bombs hit Yorktown', 'attack', P.yorktown, 8,
      'Radar picks up the raid and Yorktown’s Wildcats break it up, but seven dive bombers get through and score three hits. One blows a hole in the flight deck and another goes down the funnel and puts out the fires in most of her boilers. Fletcher moves his staff to the cruiser Astoria. Within about an hour the damage-control teams have her under way at 19 knots and operating aircraft again.',
      at('12:00', { approx: true })),
    ev('1942-06-04', 'Two torpedoes cripple Yorktown', 'loss', P.yorktown, 8,
      'Hiryū’s second strike, ten B5Ns and six Zeros, finds Yorktown so well repaired that its pilots think she is an undamaged carrier. Two torpedoes knock out her power and she lists 23 degrees to port. Her crew is ordered to abandon ship. The Japanese now believe they have sunk two American carriers.',
      at('14:40', { approx: true })),
    ev('1942-06-04', 'Dive bombers set Hiryū ablaze', 'attack', P.hiryu, 8,
      'A Yorktown scout plane has found Hiryū. Enterprise launches 24 dive bombers, including Yorktown’s orphaned VB-3, and the Japanese do not see them until 17:01. Four bombs, perhaps five, hit Hiryū, one of them from Dusty Kleiss, and leave her burning and unable to fly aircraft. Hornet’s strike, launched late, hits nothing.',
      at('17:01')),
    ev('1942-06-04', 'Sōryū is scuttled', 'loss', P.soryu, 9,
      'Abandoned since mid-morning and still afloat by evening, Sōryū is torpedoed by the destroyer Isokaze so the escorts can be used that night. 711 of her 1,103 crew are killed, including Captain Yanagimoto, who chose to stay aboard. It is the highest death rate of the four carriers.',
      at('19:15')),
    ev('1942-06-04', 'Kaga is scuttled', 'loss', P.kaga, 9,
      'Her survivors taken off in the afternoon, Kaga is finished by two torpedoes from the destroyer Hagikaze and sinks stern first. 811 of her crew are killed, including Captain Jisaku Okada, who died when a bomb hit her bridge.',
      at('19:25')),
    ev('1942-06-04', 'Dutch Harbor is bombed again', 'attack', P.dutch, 8,
      'The Japanese carrier planes return to Dutch Harbor, better organized this time. By the afternoon its oil storage tanks are burning, the hospital is partly demolished and a beached barracks ship is damaged.',
      { theater: 'Aleutians', ...ord('15:00') }),
    ev('1942-06-04', 'Spruance turns east for the night', 'movement', P.tf16, 7,
      'With Yorktown abandoned, Fletcher hands operational command to Spruance. Fearing a night action with Japanese surface ships, Spruance withdraws east and turns back west at midnight. Yamamoto sends his surface forces east to find him and detaches cruisers to shell Midway, but they find nothing.',
      ord('20:00')),

    // ---------- 5 June ----------
    ev('1942-06-05', 'Tambor’s vague report; Mogami and Mikuma collide', 'intelligence',
      { name: 'About 90 nmi west of Midway', lat: 28.2, lng: -179.1 }, 8,
      'The submarine Tambor sights “four large ships” but cannot identify them, and her report leaves Spruance guessing. They are the cruisers sent to bombard Midway. At 02:55 they receive Yamamoto’s order to retire; dodging Tambor, Mogami and Mikuma collide and Mogami’s bow is badly damaged.',
      at('02:15')),
    ev('1942-06-05', 'Yamamoto orders Akagi scuttled', 'loss', P.akagi, 9,
      'At 04:50 Yamamoto orders the burning Akagi sunk: “I was once the captain of Akagi, and it is with heartfelt regret that I must now order that she be sunk.” Four destroyers each fire a torpedo and she goes down bow first at 05:20. 267 of her crew have been killed.',
      at('05:20', { link: { timeline: 'yamamoto', event: '1942-06-05-calls-off-the-midway-operation', label: 'See this in Isoroku Yamamoto' } })),
    ev('1942-06-05', 'Hiryū sinks with Yamaguchi aboard', 'loss', P.hiryu, 9,
      'Abandoned at 03:15 and torpedoed at 05:10, Hiryū is still afloat when a plane from Hōshō finds her at about 07:00, with men still aboard who never got the order to leave. She sinks around 09:12. Rear Admiral Tamon Yamaguchi and Captain Tomeo Kaku stay aboard. Thirty-nine men escape in a cutter that drifts for 14 days before a PBY finds it.',
      at('09:12', { approx: true })),
    ev('1942-06-05', 'Fleming dives on Mikuma', 'attack',
      { name: 'Retiring Japanese cruisers, west of Midway (approx.)', lat: 28.8, lng: 176.0 }, 7,
      'Marine aircraft from Midway attack the damaged cruisers. Captain Richard E. Fleming, who took over VMSB-241 after Henderson’s death, dives to 400 feet to press home his attack and is killed. He is awarded the Medal of Honor posthumously.',
      ord('08:00')),
    ev('1942-06-05', 'Searching in vain', 'movement', P.tf16, 7,
      'Spruance’s searches fail to find Yamamoto’s forces. A late strike misses the Japanese main body and fails to hit a straggling destroyer. The planes return after dark and Spruance orders Enterprise and Hornet to turn on their lights to bring them in.',
      ord('18:00')),

    // ---------- 6–7 June ----------
    ev('1942-06-06', 'Dive bombers sink Mikuma', 'loss', P.mikuma, 7,
      'Still steaming west in the hope of reaching air cover from Wake Island, Mikuma and Mogami are attacked by dive bombers from Hornet and Enterprise. Mikuma is sunk with about 700 of her crew; Mogami survives severe damage and gets home for repairs. Two of Mikuma’s men are rescued from a raft by the submarine Trout on 9 June.',
      ord('09:00')),
    ev('1942-06-06', 'I-168 torpedoes Yorktown and Hammann', 'loss', P.yorktown, 9,
      'Yorktown is under tow by the fleet tug Vireo and salvage looks hopeful when I-168 slips through the destroyer screen. Two torpedoes hit Yorktown; a third breaks the destroyer Hammann, lying alongside to supply power, in two. Her own depth charges explode as she sinks and 80 men are killed.',
      { ...ord('15:30'), link: { timeline: 'pacific-submarines', event: '1942-06-06-i-168-finishes-off-uss-yorktown', label: 'See I-168 in Submarine Operations' } }),
    ev('1942-06-06', 'Japan occupies Kiska', 'invasion', P.kiska, 8,
      'Japanese troops land on Kiska in the Aleutians, the first invasion of U.S. territory in North America since the War of 1812. Attu follows the next day.',
      { theater: 'Aleutians' }),
    ev('1942-06-07', 'Yorktown sinks', 'loss', P.yorktown, 9,
      'Yorktown stays afloat through the night, but by 05:30 her list is rapidly increasing. She rolls onto her port side and capsizes and sinks at 07:01. Robert Ballard will find her wreck in 1998. The battle is over.',
      at('07:01', { facts: [['Total dead', 'Japan 3,057; United States 307'], ['Ships lost', 'Japan: 4 carriers, 1 heavy cruiser. U.S.: 1 carrier, 1 destroyer']] })),
    ev('1942-06-07', 'Japan occupies Attu', 'invasion', P.attu, 8,
      'Japanese forces occupy Attu, the westernmost of the Aleutians, meeting little resistance from its Unangax (Aleut) inhabitants.',
      { theater: 'Aleutians' }),
    ev('1942-06-07', 'General Tinker is lost', 'loss', P.midway, 8,
      'Major General Clarence L. Tinker, commander of the Seventh Air Force, leads a force of LB-30 bombers from Hawaii against the retreating Japanese. His aircraft goes out of control and is lost near Midway. He is the first U.S. Army general officer killed in a battle in the war.',
      ord('12:00')),

    // ---------- Aftermath ----------
    ev('1942-06-08', 'Fletcher shifts to Saratoga', 'movement',
      { name: 'East of Midway (approx.)', lat: 30.0, lng: -170.0 }, 6,
      'Saratoga arrives too late to fight but brings replacement aircraft. Fletcher transfers his flag to her that afternoon and resumes command of the carrier force, which keeps searching to make sure the Japanese are no longer heading for Midway.'),
    ev('1942-06-10', 'Tokyo hides the defeat', 'political', P.tokyo, 8,
      'The Navy gives the military liaison conference an incomplete account of the battle and the public is told of a great victory. Only Emperor Hirohito and the highest naval staff learn the true losses. The same day the American carriers leave the area for Pearl Harbor.'),
    ev('1942-06-14', 'The fleet returns in secret', 'political', P.hashirajima, 9,
      'The Combined Fleet reaches Hashirajima. The wounded are taken to naval hospitals as “secret patients”, isolated from other patients and their families, and many survivors are sent to units in the South Pacific without home leave. Japan has lost four fleet carriers, two-thirds of its fleet carrier force, and many of its most experienced aircrew.'),
  ];

  // ---------- Shot list ----------
  // Camera direction for the battle (see "Shots" in app.js). Events not listed use the
  // automatic framing.
  const pt = (place) => [place.lat, place.lng];
  const SHOTS = {
    // 3 June: the Aleutians are a separate storyline, so cut to them and back.
    'Japanese carrier planes strike Dutch Harbor': { transition: 'cut' },
    'A PBY finds the invasion force': { frame: [pt(P.midway)] }, // how far out it is

    // 4 June, dawn: the reveal. Nagumo launches, with the American carriers already waiting
    // unseen to the northeast.
    'Nagumo launches against Midway': { shot: 'wide', transition: 'pull-back', frame: [pt(P.tf16), pt(P.midway)] },
    // The raid: the carriers and the atoll in one frame while the strike flies in...
    '“Two carriers” sighted': { scene: 'raid' },
    'Midway’s radar picks up the raid': { scene: 'raid' },
    'Marine fighters meet the raid': { scene: 'raid' },
    // ...then down onto the island as the bombs fall.
    'Japanese bombs fall on Midway': { shot: 'tight', transition: 'fly' },
    // Both fleets in view while Nagumo hesitates, unaware the American strike is airborne.
    'The American carriers launch': { scene: 'two-fleets', frame: [pt(P.midway)] },
    'Midway’s bombers attack the carriers': { scene: 'two-fleets' },
    'Nagumo orders his reserve re-armed for Midway': { scene: 'two-fleets' },
    'Tone’s scout finds American ships': { scene: 'two-fleets' },
    // Close on the Kidō Butai for the attacks that destroy it.
    'Nautilus attacks the battleship Kirishima': { scene: 'carrier-attack', transition: 'fly' },
    'Torpedo Eight is wiped out': { scene: 'carrier-attack' },
    'Yorktown’s torpedo planes draw off the Zeros': { scene: 'carrier-attack' },
    'Dive bombers wreck Kaga, Akagi and Sōryū': { scene: 'carrier-attack', frame: [pt(P.kaga), pt(P.soryu)] },
    'Nagumo leaves the burning Akagi': { scene: 'carrier-attack' },
    // Hiryū's counterstrikes: the lone carrier and Yorktown in one frame.
    'Hiryū strikes back': { scene: 'counterstrike' },
    'Three bombs hit Yorktown': { scene: 'counterstrike' },
    'Two torpedoes cripple Yorktown': { scene: 'counterstrike' },
    'Dutch Harbor is bombed again': { transition: 'cut' },
    'Dive bombers set Hiryū ablaze': { shot: 'tight' },
    'Sōryū is scuttled': { scene: 'scuttled' },
    'Kaga is scuttled': { scene: 'scuttled' },
    // Night: the fleets pull apart.
    'Spruance turns east for the night': { shot: 'wide', frame: [pt(P.kidoButai)] },

    // 5–7 June
    'Yamamoto orders Akagi scuttled': { scene: 'carriers-sink' },
    'Hiryū sinks with Yamaguchi aboard': { scene: 'carriers-sink' },
    'I-168 torpedoes Yorktown and Hammann': { shot: 'tight' },
    'Japan occupies Kiska': { transition: 'cut' },
    'Yorktown sinks': { shot: 'tight' },
    'Japan occupies Attu': { transition: 'cut' },
  };
  const events = WW2.events['battle-of-midway'];
  for (const [title, shot] of Object.entries(SHOTS)) {
    const e = events.find((x) => x.title === title);
    if (!e) throw new Error(`battle-of-midway shot list: no event titled "${title}"`);
    Object.assign(e, shot);
  }
})();
