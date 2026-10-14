// Timeline: Guadalcanal (War in the Pacific).
// The six-month struggle for Guadalcanal on land, at sea and in the air, from the Japanese
// airfield at Lunga Point and the Allied landings of 7 August 1942 to Operation Ke and the
// island being declared secure on 9 February 1943.
// Checked against the English Wikipedia articles "Guadalcanal campaign", "Battle of Tulagi and
// Gavutu–Tanambogo", "Battle of Savo Island", "Henderson Field (Guadalcanal)", "Cactus Air Force",
// "Battle of the Tenaru", "Battle of the Eastern Solomons", "Tokyo Express", "Battle of Edson's
// Ridge", "USS Wasp (CV-7)", "Battle of Cape Esperance", "Battle for Henderson Field", "Battle of
// the Santa Cruz Islands", "Naval Battle of Guadalcanal", "Battle of Tassafaronga", "Battle of
// Rennell Island" and "Operation Ke" (October 2026).
//
// Times are local Solomons times as the sources give them. Accounts of the night actions differ
// by a few minutes; the battle articles are followed. Event schema: see
// data/timelines/attack-on-hawaii.js.

(function () {
  const P = {
    lunga: { name: 'Lunga Point, Guadalcanal', lat: -9.417, lng: 160.033 },
    henderson: { name: 'Henderson Field, Guadalcanal', lat: -9.428, lng: 160.055 },
    beach: { name: 'Landing beaches between Koli Point and Lunga Point (approx.)', lat: -9.41, lng: 160.1 },
    tulagi: { name: 'Tulagi', lat: -9.101, lng: 160.147 },
    gavutu: { name: 'Gavutu and Tanambogo', lat: -9.114, lng: 160.187 },
    savo: { name: 'Off Savo Island', lat: -9.133, lng: 159.817 },
    savoNorth: { name: 'North of Savo Island (approx.)', lat: -9.08, lng: 159.83 },
    ironbottom: { name: 'Ironbottom Sound, between Guadalcanal and Savo Island', lat: -9.186, lng: 159.895 },
    taivu: { name: 'Taivu Point, Guadalcanal (approx.)', lat: -9.40, lng: 160.38 },
    tenaru: { name: 'Alligator Creek, east side of the Lunga perimeter', lat: -9.429, lng: 160.083 },
    matanikau: { name: 'Mouth of the Matanikau River', lat: -9.425, lng: 159.967 },
    pointCruz: { name: 'Point Cruz, Guadalcanal', lat: -9.433, lng: 159.95 },
    kokumbona: { name: 'Kokumbona, Guadalcanal', lat: -9.427, lng: 159.914 },
    ridge: { name: 'Edson’s Ridge, south of Henderson Field', lat: -9.447, lng: 160.048 },
    southPerimeter: { name: 'Southern Lunga perimeter, near Edson’s Ridge (approx.)', lat: -9.455, lng: 160.055 },
    koli: { name: 'Koli Point, Guadalcanal (approx.)', lat: -9.40, lng: 160.15 },
    aola: { name: 'Aola Bay, Guadalcanal (approx.)', lat: -9.52, lng: 160.48 },
    tassafaronga: { name: 'Tassafaronga Point, Guadalcanal', lat: -9.368, lng: 159.864 },
    tassaBattle: { name: 'Off Tassafaronga, Ironbottom Sound', lat: -9.2, lng: 159.83 },
    capeEsperance: { name: 'Off Cape Esperance, Guadalcanal', lat: -9.1, lng: 159.65 },
    capeEsperanceLand: { name: 'Cape Esperance, Guadalcanal', lat: -9.25, lng: 159.7 },
    kamimbo: { name: 'Kamimbo, western Guadalcanal (approx.)', lat: -9.27, lng: 159.66 },
    austen: { name: 'Mount Austen, Guadalcanal (approx.)', lat: -9.46, lng: 160.0 },
    slot: { name: 'The Slot (New Georgia Sound) (approx.)', lat: -8.2, lng: 158.6 },
    shortlands: { name: 'Shortland Islands (approx.)', lat: -7.05, lng: 155.8 },
    rabaul: { name: 'Rabaul, New Britain', lat: -4.2, lng: 152.183 },
    truk: { name: 'Truk Lagoon', lat: 7.415, lng: 151.735 },
    tokyo: { name: 'Imperial Palace, Tokyo', lat: 35.685, lng: 139.753 },
    fiji: { name: 'Off Koro Island, Fiji (approx.)', lat: -17.3, lng: 179.4 },
    espiritu: { name: 'Espiritu Santo, New Hebrides', lat: -15.417, lng: 166.9 },
    noumea: { name: 'Nouméa, New Caledonia', lat: -22.276, lng: 166.458 },
    kako: { name: 'Where Kako sank, off New Ireland', lat: -2.467, lng: 152.183 },
    ryujo: { name: 'Where Ryūjō sank, north of the Solomons', lat: -6.167, lng: 160.833 },
    easternSolomons: { name: 'U.S. carriers east of the Solomons (approx.)', lat: -8.4, lng: 162.5 },
    wasp: { name: 'Where Wasp sank, southeast of San Cristobal', lat: -12.416, lng: 164.133 },
    santaCruz: { name: 'North of the Santa Cruz Islands', lat: -8.0, lng: 164.0 },
    hornet: { name: 'Where Hornet sank, north of the Santa Cruz Islands', lat: -8.64, lng: 166.709 },
    juneau: { name: 'Where Juneau sank, south of Guadalcanal', lat: -10.567, lng: 161.067 },
    hiei: { name: 'Where Hiei sank, northwest of Savo Island', lat: -9.067, lng: 159.75 },
    rennell: { name: 'Near Rennell Island', lat: -11.417, lng: 160.933 },
  };

  const ev = (date, title, type, location, zoom, summary, extra = {}) => ({
    id: extra.id || `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}`,
    date, title, type, location, zoom, summary,
    theater: extra.theater || 'Pacific',
    ...extra,
  });
  const at = (time, extra = {}) => ({ time, tz: 'SOL', ...extra });
  const ord = (sortTime) => ({ sortTime, tz: 'SOL' }); // order within the day only; no time shown

  WW2.events['guadalcanal'] = [
    // ---------- Background ----------
    ev('1942-07-06', 'Japan starts an airfield on Guadalcanal', 'movement', P.lunga, 11,
      'Two Japanese naval construction units, more than 2,500 men originally meant to build on Midway, land at Lunga Point and begin work a few days later on an airfield. From there, long-range bombers could threaten the sea routes between the United States and Australia. Coastwatchers report the work, and the Allies add Guadalcanal to their plans for an offensive in the Solomons.',
      { facts: [['Japanese code name', 'RXI'], ['Personnel on the island by August', 'About 2,800, including some 2,200 Korean forced labourers and trustees']] }),
    ev('1942-07-31', 'The Watchtower force sails from Fiji', 'movement', P.fiji, 6,
      'Some 75 American and Australian warships and transports, assembled near Fiji on 26 July, set out for the Solomons after a single rehearsal landing. Vice Admiral Frank Jack Fletcher commands the expeditionary force from the carrier Saratoga, Rear Admiral Richmond K. Turner the amphibious ships, and Major General Alexander Vandegrift the 16,000 troops of the 1st Marine Division. Supplies have been cut from 90 days to 60, and the Marines call it “Operation Shoestring”.',
      { facts: [['Operation', 'Watchtower'], ['Code name for Guadalcanal', 'Cactus']],
        paths: [{ label: 'Watchtower force to the Solomons (approximate)', kind: 'route', coords: [[-17.3, 179.4], [-15.0, 170.0], [-11.5, 162.5], [-9.6, 160.2], [-9.41, 160.1]] }] }),

    // ---------- The landings ----------
    ev('1942-08-07', 'Marines land on Tulagi', 'invasion', P.tulagi, 11,
      'Bad weather has hidden the invasion fleet. After a naval bombardment, Merritt Edson’s 1st Raider Battalion and a battalion of the 5th Marines come ashore unopposed on Tulagi’s western shore at 08:00, but the 886 naval troops on Tulagi, Gavutu and Tanambogo fight almost to the last man. Carrier aircraft destroy 15 seaplanes at their moorings.',
      at('08:00')),
    ev('1942-08-07', 'Vandegrift lands on Guadalcanal', 'invasion', P.beach, 10,
      'Vandegrift and 11,000 Marines land between Koli Point and Lunga Point and meet almost no resistance. The Japanese construction troops and their guards have fled west towards the Matanikau River after the bombardment.',
      at('09:10', { link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1942-08-07-marines-land-on-guadalcanal-and-tulagi', label: 'See the landings in From Pearl Harbor to Guadalcanal' } })),
    ev('1942-08-07', 'Paratroopers assault Gavutu', 'attack', P.gavutu, 12,
      'The 397 men of the 1st Parachute Battalion, fighting as infantry, land on Gavutu at noon. The bombardment has wrecked the seaplane ramp, so the boats are forced to land them where they come under heavy fire. Tanambogo, joined to Gavutu by a causeway, holds out until 9 August.',
      at('12:00')),
    ev('1942-08-08', 'The airfield is taken', 'invasion', P.henderson, 12,
      'The Marines reach the nearly finished airfield and secure it by 16:00. The Japanese have left behind food, intact construction equipment and vehicles. Air attacks from Rabaul set the transport George F. Elliott on fire, and Tulagi is declared secure. That evening Fletcher, worried about his fighter losses and fuel, withdraws his carriers, and Turner decides his transports must leave in the morning.',
      at('16:00')),

    // ---------- Savo Island ----------
    ev('1942-08-09', '“Strange ships entering the harbor!”', 'attack', P.savo, 10,
      'Vice Admiral Gunichi Mikawa’s seven cruisers and a destroyer, sighted on the way but misidentified, slip past the picket destroyers and launch torpedoes at the southern Allied group. The destroyer Patterson radios a warning, flares light up the cruisers, and within minutes Canberra is wrecked by shells and torpedoes. A torpedo hits Chicago’s bow; she steams away from the fight without warning the other ships.',
      at('01:43', { facts: [['Japanese force', '5 heavy cruisers, 2 light cruisers, 1 destroyer'], ['Allied commander', 'Rear Admiral Victor Crutchley (away at a conference)']] })),
    ev('1942-08-09', 'The northern cruisers are caught asleep', 'loss', P.savoNorth, 10,
      'Mikawa’s ships, now in two columns, turn their searchlights on the three American cruisers north of Savo, whose captains are asleep. Astoria, Quincy and Vincennes are smashed by gunfire and torpedoes in about 20 minutes. Quincy sinks at 02:38 and Vincennes at 02:50.',
      at('01:50')),
    ev('1942-08-09', 'Mikawa turns for home', 'movement', P.savoNorth, 9,
      'With his ships scattered and believing American carriers are near, Mikawa decides not to go after the defenceless transports and orders a withdrawal at 02:20, so as to be out of air range by daylight. It proves a crucial mistake. Canberra is scuttled at dawn, and Astoria sinks at 12:15. That evening the transports leave with less than half the Marines’ supplies unloaded.',
      at('02:20', { facts: [['Allied losses', 'Astoria, Quincy, Vincennes and Canberra sunk; about 1,000 killed'], ['Japanese losses', 'Moderate damage to one cruiser']] })),
    ev('1942-08-10', 'S-44 sinks Kako', 'loss', P.kako, 8,
      'Nearly home at Kavieng, the cruiser Kako, one of Mikawa’s victors, is torpedoed and sunk by the old American submarine S-44. Her companions rescue all but 71 of her crew.',
      at('08:10', { link: { timeline: 'pacific-submarines', event: '1942-08-10-s-44-sinks-the-cruiser-kako', label: 'See this in Submarine Operations' } })),

    // ---------- Holding the perimeter ----------
    ev('1942-08-12', 'Henderson Field', 'service', P.henderson, 12,
      'Working with captured Japanese equipment, the Marines finish the airfield and name it after Major Lofton R. Henderson, killed leading a dive-bomber squadron at Midway. A Navy PBY becomes the first aircraft to land. The Marines are on two meals a day, and dysentery soon spreads through the perimeter.'),
    ev('1942-08-12', 'The Goettge patrol is wiped out', 'loss', P.pointCruz, 12,
      'A 25-man patrol of mostly intelligence personnel under Lieutenant Colonel Frank Goettge lands by boat west of the perimeter, partly hoping to accept the surrender of Japanese troops there. Japanese naval troops attack it almost at once; only three men swim back.',
      ord('19:00')),
    ev('1942-08-19', 'The Ichiki detachment lands', 'invasion', P.taivu, 10,
      'Six destroyers land the first 917 men of Colonel Kiyonao Ichiki’s regiment at Taivu Point, east of the Marines, at 01:00. Confident that the Americans are few, Ichiki decides to attack without waiting for the rest of his force. At noon a Marine patrol ambushes his scouting party near Koli Point; on the other side of the perimeter, three Marine companies raid across the Matanikau River.',
      at('01:00')),
    ev('1942-08-20', 'The Cactus Air Force arrives', 'service', P.henderson, 12,
      'The escort carrier Long Island flies off 19 Wildcats of VMF-223 under Major John L. Smith and 12 Dauntlesses of VMSB-232 to Henderson Field, its first permanent aircraft. Named after the island’s code name, the “Cactus Air Force” goes into action the next day, when almost daily raids from Rabaul begin. Five Army P-400 fighters follow on 22 August.',
      { link: { timeline: 'medal-of-honor', event: '1942-08-01-smith-john-l', label: 'See John L. Smith in Medal of Honor' } }),
    ev('1942-08-21', 'The Battle of the Tenaru', 'attack', P.tenaru, 12,
      'Warned minutes earlier by the scout Jacob Vouza, Marines on the west bank of Alligator Creek meet Ichiki’s night charge across the sandbar with machine guns and canister from 37 mm guns. A second charge at 02:30 and an attempt through the surf at dawn also fail. After daybreak the Marines counter-attack, and in the afternoon light tanks sweep the coconut grove. By 17:00 resistance has ended; about 800 of Ichiki’s men are dead, Ichiki among them.',
      at('01:30', { facts: [['Japanese', 'About 800 of 917 killed'], ['Prisoners', 'About 15']] })),

    // ---------- Eastern Solomons ----------
    ev('1942-08-24', 'Saratoga’s planes sink Ryūjō', 'attack', P.ryujo, 7,
      'Yamamoto sends a carrier force south to cover a troop convoy, with the light carrier Ryūjō sent ahead to strike Henderson Field. Her planes run into the Cactus Air Force over the airfield, while Saratoga’s strike hits the carrier with several bombs and probably a torpedo. She is abandoned and sinks after nightfall.',
      ord('15:00')),
    ev('1942-08-24', 'Three bombs hit Enterprise', 'attack', P.easternSolomons, 7,
      'A scout from Chikuma finds the American carriers, and 27 dive bombers from Shōkaku and Zuikaku get through the Wildcats. Three bombs hit Enterprise between 16:29 and 16:46; the first alone kills 35 men. Her crew has her flying aircraft again in an hour, but she must go to Pearl Harbor for repairs. Japan loses about 75 aircraft and many experienced aircrew.',
      at('16:29')),
    ev('1942-08-25', 'Henderson’s planes turn back Tanaka’s convoy', 'attack', P.slot, 7,
      'Dive bombers from Henderson Field catch Rear Admiral Raizō Tanaka’s troop convoy 150 miles out. His flagship Jintsū is badly hit and Tanaka knocked unconscious; the transport Kinryu Maru is hit and later sinks, and B-17s sink the destroyer Mutsuki as she comes alongside to help. The convoy retreats to the Shortland Islands. From now on Japan cannot run slow ships to Guadalcanal by day.',
      at('08:05')),

    // ---------- The Tokyo Express ----------
    ev('1942-08-29', 'The Tokyo Express begins', 'movement', P.slot, 7,
      'Japan switches to running troops in by fast destroyer, at night, down “the Slot” from the Shortlands, landing them and getting out of air range by dawn. The Americans call it the Tokyo Express; the Japanese call it “rat transportation”. By 4 September almost 5,000 men of Major General Kiyotake Kawaguchi’s brigade and other units are ashore at Taivu Point, though without heavy equipment.',
      { approx: true }),
    ev('1942-09-03', 'Geiger takes over the air war', 'service', P.henderson, 12,
      'Brigadier General Roy Geiger of the 1st Marine Aircraft Wing lands in a transport plane and takes command of all aircraft at Henderson Field. Air battles with bombers from Rabaul are fought almost daily; coastwatchers on Bougainville and New Georgia give warning of each raid, and most downed American airmen are rescued while most Japanese are not.'),
    ev('1942-09-05', 'Little and Gregory are sunk', 'loss', P.lunga, 10,
      'Two old destroyers converted to fast transports, which have been landing Raiders and supplies, are patrolling off Lunga at night when three Japanese destroyers arrive to shell the airfield. A U.S. patrol plane mistakes the destroyers for a submarine and drops flares that silhouette Little and Gregory instead. Both are sunk; their captains and the division commander are among the dead.',
      { ...ord('01:00'), approx: true }),
    ev('1942-09-08', 'Edson raids Tasimboko', 'attack', P.taivu, 11,
      'Acting on reports from Martin Clemens’ island scouts, Edson’s Raiders land near Taivu at 05:20 and seize the village of Tasimboko. They find Kawaguchi’s supply base, destroy it, and return with documents showing at least 3,000 Japanese are on the island preparing to attack.',
      at('05:20')),

    // ---------- Edson's Ridge ----------
    ev('1942-09-12', 'Kawaguchi strikes the ridge', 'attack', P.ridge, 12,
      'Edson and Vandegrift’s operations officer have guessed that the attack will come along a grassy coral ridge south of the airfield, and Edson’s Raiders and Parachutists are dug in on it. At 21:30 a cruiser and three destroyers shell the perimeter, and one of Kawaguchi’s battalions pushes a Raider company back, but his other units, delayed in the jungle, never reach their start lines.',
      at('21:30')),
    ev('1942-09-13', 'The stand on Hill 123', 'attack', P.ridge, 13,
      'On a moonless night about 3,000 of Kawaguchi’s men attack some 830 Marines. Pushed back to Hill 123, the Marines form a horseshoe and, with artillery firing close in front of them, throw back charge after charge, some ending in hand-to-hand fighting. A few Japanese reach the edge of the airfield. Edson stands just behind the firing line all night; he and Major Kenneth Bailey receive the Medal of Honor.',
      at('21:00', { facts: [['Japanese losses', 'About 830 killed'], ['Marine losses', '104–111 killed']],
        link: { timeline: 'medal-of-honor', event: '1942-09-13-edson-merritt-a', label: 'See Merritt Edson in Medal of Honor' } })),
    ev('1942-09-14', 'Kawaguchi retreats into the jungle', 'movement', P.ridge, 11,
      'By dawn Kawaguchi’s brigade is spent. At 13:05 he leads the survivors away, and they begin a gruelling march west to the Matanikau, carrying their wounded. In Tokyo the army and navy staffs conclude that Guadalcanal may become the decisive battle of the war, and the troops within reach of Port Moresby on the Kokoda Track are told to withdraw.',
      at('13:05')),
    ev('1942-09-15', 'I-19 sinks Wasp', 'loss', P.wasp, 8,
      'While covering a convoy bringing the 7th Marines, the carrier Wasp is hit by two or three torpedoes from the submarine I-19 at about 14:45. Gasoline fires and explosions drive her crew off; she is scuttled that evening with 193 dead. The same salvo damages the battleship North Carolina and the destroyer O’Brien. Hornet is now the only American carrier in the South Pacific.',
      at('14:45', { link: { timeline: 'pacific-submarines', event: '1942-09-15-i-19-sinks-uss-wasp-with-one-salvo', label: 'See this in Submarine Operations' } })),
    ev('1942-09-18', 'The 7th Marines arrive', 'movement', P.lunga, 10,
      'A convoy lands 4,157 men of the 3rd Provisional Marine Brigade with vehicles, fuel, ammunition and rations. Vandegrift can at last build a continuous line around the Lunga perimeter.'),
    ev('1942-09-27', 'Munro covers the Marines’ escape', 'loss', P.pointCruz, 12,
      'An attack across the Matanikau is thrown back, and three Marine companies are cut off near Point Cruz. They are rescued with the help of the destroyer Monssen and Coast Guard landing craft. Signalman Douglas Munro is killed steering his boat between the Japanese and the escaping Marines, becoming the only Coast Guardsman awarded the Medal of Honor.',
      { link: { timeline: 'medal-of-honor', event: '1942-09-27-munro-douglas-a', label: 'See Douglas Munro in Medal of Honor' } }),
    ev('1942-10-07', 'The Marines push across the Matanikau', 'attack', P.matanikau, 11,
      'Between 6 and 9 October a larger Marine force crosses the Matanikau and mauls the newly landed 4th Infantry Regiment of the Japanese 2nd Division. The Japanese are pushed back from the east bank, upsetting the preparations for their next offensive.',
      { approx: true }),

    // ---------- Cape Esperance and "The Night" ----------
    ev('1942-10-11', 'The Battle of Cape Esperance', 'attack', P.capeEsperance, 10,
      'Covering a reinforcement convoy, Rear Admiral Norman Scott’s cruisers and destroyers pick up Rear Admiral Aritomo Gotō’s bombardment force on radar near Savo Island. Gotō takes them for friendly ships. The Americans open fire at 23:46, wrecking the flagship Aoba and mortally wounding Gotō, then sinking the cruiser Furutaka and the destroyer Fubuki. Boise is badly damaged and the destroyer Duncan, caught between both sides, is lost. Meanwhile the Japanese convoy lands its troops unseen.',
      at('23:46')),
    ev('1942-10-13', 'The Army arrives', 'movement', P.lunga, 10,
      'The 2,837 men of the 164th Infantry Regiment of the Americal Division land on schedule, the first U.S. Army troops on Guadalcanal.'),
    ev('1942-10-14', '“The Night”: battleships shell Henderson Field', 'attack', P.henderson, 11,
      'The battleships Kongō and Haruna under Vice Admiral Takeo Kurita open fire on the airfield from about ten miles out at 01:33. In about 83 minutes they fire 973 14-inch shells, wrecking both runways, burning most of the aviation fuel and destroying 48 of the Cactus Air Force’s 90 aircraft. Forty-one men are killed. One runway is working again within hours.',
      at('01:33', { facts: [['Shells', '973 × 14-inch'], ['Aircraft destroyed', '48 of 90']] })),
    ev('1942-10-15', 'Convoy ships burn at Tassafaronga', 'attack', P.tassafaronga, 11,
      'Six Japanese cargo ships begin unloading 4,500 troops, tanks and heavy artillery at Tassafaronga at midnight. All day, aircraft flying on fuel drained from wrecks and hidden caches bomb and strafe them, destroying three. The rest leave that night with all the troops and about two-thirds of the supplies ashore.'),
    ev('1942-10-18', 'Halsey replaces Ghormley', 'political', P.noumea, 9,
      'Judging that Vice Admiral Robert L. Ghormley has become too pessimistic, Admiral Nimitz replaces him with Vice Admiral William Halsey as commander of the South Pacific Area. Halsey, known throughout the fleet as a fighter, at once begins planning to bring the Japanese navy to battle.'),

    // ---------- The Battle for Henderson Field ----------
    ev('1942-10-23', 'Tanks attack at the Matanikau', 'attack', P.matanikau, 12,
      'The main offensive has been postponed, but the message does not reach Major General Tadashi Sumiyoshi’s units on the coast. At dusk nine tanks and two infantry battalions attack across the sandbar at the mouth of the Matanikau. Marine anti-tank guns and artillery destroy all the tanks and cut down the infantry.',
      ord('18:00')),
    ev('1942-10-25', 'Basilone and Puller hold the southern line', 'attack', P.southPerimeter, 12,
      'After a week’s march along the jungle trail cut for them, the “Maruyama Road”, General Masao Maruyama’s troops reach the south of the perimeter in heavy rain and attack Lieutenant Colonel Chesty Puller’s battalion of the 7th Marines. At 01:15 a machine-gun section under Sergeant John Basilone destroys almost an entire Japanese company. Soldiers of the 164th Infantry are fed into Puller’s line in the dark, and a Japanese salient is wiped out after daybreak.',
      at('01:15', { link: { timeline: 'medal-of-honor', event: '1942-10-24-basilone-john', label: 'See John Basilone in Medal of Honor' } })),
    ev('1942-10-25', 'Japanese destroyers attack off Lunga', 'attack', P.lunga, 11,
      'Believing a false report that the airfield has been taken, Japanese warships move in by day. Destroyers sink a tug and a patrol boat off Lunga Point before shore guns drive them off, and Cactus Air Force dive bombers cripple the light cruiser Yura, which is scuttled that night. Carrier and land-based aircraft attack the airfield in six waves.',
      at('10:14')),
    ev('1942-10-26', 'Hyakutake calls off the offensive', 'movement', P.southPerimeter, 11,
      'Through the night Maruyama throws his reserve regiment at Puller’s and Hall’s lines, and near the Matanikau Platoon Sergeant Mitchell Paige’s machine-gun section holds a ridge. At 08:00 Lieutenant General Harukichi Hyakutake ends the attacks. More than 1,500 Japanese bodies lie in front of the southern line; the Americans have lost about 80 killed.',
      at('08:00', { facts: [['Japanese losses', '2,200–3,000 killed'], ['American losses', 'About 80 killed']] })),

    // ---------- Santa Cruz ----------
    ev('1942-10-26', 'Santa Cruz: Hornet is crippled', 'loss', P.santaCruz, 7,
      'The carrier fleets find each other north of the Santa Cruz Islands. American dive bombers wreck Shōkaku’s flight deck, but at 09:12 Japanese bombers hit Hornet, and two torpedoes and a crashing bomber leave her dead in the water. A second wave hits Enterprise twice, and Rear Admiral Thomas Kinkaid withdraws, leaving Hornet behind.',
      at('09:12', { facts: [['U.S. carriers', 'Enterprise, Hornet'], ['Japanese carriers', 'Shōkaku, Zuikaku, Zuihō, Jun’yō']] })),
    ev('1942-10-27', 'Hornet sinks', 'loss', P.hornet, 8,
      'American destroyers fail to scuttle the burning Hornet and leave as Japanese warships approach; Japanese destroyers finish her with torpedoes, and she sinks at 01:35. The Japanese have won the battle in ships but lost 148 aircrew, more than at Midway, and their carriers play no further part at Guadalcanal.',
      at('01:35', { facts: [['U.S. losses', 'Hornet and a destroyer sunk; 81 aircraft, 26 aircrew'], ['Japanese losses', '99 aircraft, 148 aircrew']] })),

    // ---------- November ----------
    ev('1942-11-04', 'Carlson’s Raiders set out from Aola', 'movement', P.aola, 10,
      'Lieutenant Colonel Evans Carlson’s 2nd Raider Battalion lands at Aola Bay. Sent after the Japanese escaping from Koli Point, it begins a 29-day patrol back to the Lunga perimeter, killing almost 500 Japanese for the loss of 16 Raiders. In a separate fight, between 9 and 12 November, Americans trap and destroy part of Colonel Toshinari Shōji’s force at Koli Point.'),
    ev('1942-11-13', 'Naval Battle of Guadalcanal: the first night', 'attack', P.ironbottom, 10,
      'Rear Admiral Daniel Callaghan’s cruisers and destroyers meet Vice Admiral Hiroaki Abe’s battleships Hiei and Kirishima, sent to shell Henderson Field. The fleets run into each other in pitch darkness, and when Japanese searchlights come on the battle becomes a close-range brawl. Callaghan and Rear Admiral Norman Scott are both killed, and the cruisers Atlanta and Juneau and four destroyers are lost or doomed. Abe, wounded, withdraws without bombarding the airfield.',
      at('01:48')),
    ev('1942-11-13', 'I-26 sinks Juneau', 'loss', P.juneau, 8,
      'Leaving the area with the damaged San Francisco, the cruiser Juneau, already hit by a torpedo in the night, is struck again by a torpedo from the submarine I-26 and blows up. More than 100 survivors wait eight days for rescue; only ten live. The five Sullivan brothers are among the dead.',
      { ...ord('11:00'), link: { timeline: 'pacific-submarines', event: '1942-11-13-i-26-sinks-uss-juneau', label: 'See this in Submarine Operations' } }),
    ev('1942-11-13', 'Hiei sinks', 'loss', P.hiei, 9,
      'The crippled Hiei is attacked all day by Marine torpedo planes, Enterprise aircraft and B-17s. She sinks northwest of Savo Island late that evening, perhaps scuttled by her own crew. Yamamoto, reportedly furious, relieves Abe of command; the troop convoy has already been held back a day.',
      ord('22:00')),
    ev('1942-11-14', 'Aircraft destroy Tanaka’s transports', 'attack', P.slot, 7,
      'Mikawa’s cruisers shell Henderson Field in the night but fail to close it. In daylight aircraft from Henderson and Enterprise sink the cruiser Kinugasa, then attack Tanaka’s eleven transports in the Slot again and again. Seven are sunk; destroyers rescue most of the troops. Tanaka presses on after dark with the last four.',
      ord('09:00')),
    ev('1942-11-14', 'Washington ambushes Kirishima', 'attack', P.ironbottom, 10,
      'Halsey sends the battleships Washington and South Dakota under Rear Admiral Willis A. Lee. Vice Admiral Nobutake Kondō’s force sinks three of Lee’s four destroyers, and South Dakota, hit by electrical failures, is battered by gunfire. Unseen, Washington closes and hits Kirishima with a storm of 16-inch shells around midnight. Kondō withdraws, and Kirishima sinks early on 15 November.',
      at('22:55', { facts: [['U.S. losses', 'Destroyers Walke, Preston, Benham'], ['Japanese losses', 'Kirishima, destroyer Ayanami']] })),
    ev('1942-11-15', 'The last transports beach at Tassafaronga', 'loss', P.tassafaronga, 11,
      'Tanaka’s four surviving transports run themselves aground at 04:00. From 05:55 aircraft and artillery destroy them and most of their cargo. Only 2,000–3,000 troops get ashore, and Japan’s November offensive is cancelled: the last serious attempt to retake Henderson Field has failed.',
      at('05:55', { link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1942-11-15-naval-battle-of-guadalcanal-the-decision', label: 'See this in From Pearl Harbor to Guadalcanal' } })),
    ev('1942-11-30', 'The Battle of Tassafaronga', 'loss', P.tassaBattle, 10,
      'Tanaka brings eight destroyers to drop drums of food off Tassafaronga. Rear Admiral Carleton H. Wright’s cruisers detect them on radar, but Wright hesitates before allowing his destroyers to fire torpedoes, and they miss. American gunfire sinks the destroyer Takanami; the other Japanese destroyers turn and fire 44 torpedoes. Northampton is sunk and Minneapolis, New Orleans and Pensacola are crippled. None of the food is landed.',
      at('23:21', { facts: [['U.S. losses', 'Northampton sunk; Minneapolis, New Orleans, Pensacola badly damaged'], ['Japanese losses', 'Destroyer Takanami']] })),

    // ---------- December: the decision ----------
    ev('1942-12-09', 'The Army takes over from the Marines', 'movement', P.lunga, 10,
      'During December the exhausted 1st Marine Division is withdrawn to recover. Army Major General Alexander Patch replaces Vandegrift, and the Army’s XIV Corps, with the 25th Infantry and Americal Divisions and the 2nd Marine Division, takes over the fighting.',
      { approx: true }),
    ev('1942-12-12', 'The Japanese navy proposes giving up Guadalcanal', 'political', P.rabaul, 6,
      'Hyakutake’s troops are losing about 50 men a day to hunger, disease and attack, and drum runs and submarines cannot feed them. Tanaka privately tells Mikawa the island can no longer be supplied by sea. The Navy proposes abandoning Guadalcanal, and staff officers sent to Rabaul agree.'),
    ev('1942-12-18', 'The fight for Mount Austen begins', 'attack', P.austen, 11,
      'American soldiers attack the Japanese on Mount Austen, inland of the airfield. A fortified pocket the Japanese call the Gifu stops them, and the offensive is halted on 4 January.'),
    ev('1942-12-31', 'The emperor approves withdrawal', 'political', P.tokyo, 11,
      'Briefed by the army and navy chiefs of staff, Emperor Hirohito formally endorses the decision to leave Guadalcanal. Planning begins for a secret evacuation, Operation Ke, in late January. Fewer than 15,000 Japanese remain on the island.',
      { link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1942-12-31-japan-decides-to-leave-guadalcanal', label: 'See this in From Pearl Harbor to Guadalcanal' } }),

    // ---------- January – February 1943 ----------
    ev('1943-01-10', 'The Galloping Horse and the Sea Horse', 'attack', P.austen, 11,
      'Patch renews the offensive against Mount Austen and two neighbouring ridges named for their shapes on aerial photographs. After brutal fighting all three are taken by 23 January, with about 250 American and some 3,000 Japanese dead.'),
    ev('1943-01-14', 'A rear guard lands with the order to leave', 'movement', P.kokumbona, 10,
      'A Tokyo Express run lands a battalion to act as rear guard. With it comes a staff officer from Rabaul, who reaches Hyakutake’s headquarters at Kokumbona the next evening with the evacuation order; the 17th Army accepts it, reluctantly, on 16 January. Allied intelligence notices the gathering ships and aircraft but reads them as preparation for a new offensive.'),
    ev('1943-01-23', 'Kokumbona falls', 'attack', P.kokumbona, 11,
      'The 25th Infantry Division takes the hills overlooking Kokumbona, headquarters of the Japanese 17th Army, and captures the village. The Japanese fall back west towards Cape Esperance behind their rear guard.'),
    ev('1943-01-30', 'Rennell Island: Chicago is sunk', 'loss', P.rennell, 8,
      'Japanese torpedo bombers attacking at dusk on 29 January cripple the cruiser Chicago, a survivor of Savo Island. The next afternoon a second wave sinks her as she is towed away, and damages the destroyer La Vallette. Halsey pulls back his ships, leaving the waters off Guadalcanal open for the evacuation.',
      ord('16:00')),
    ev('1943-02-01', 'Operation Ke: the first evacuation run', 'movement', P.capeEsperanceLand, 10,
      'Twenty destroyers under Rear Admiral Shintarō Hashimoto run down the Slot. Off Cape Esperance and Kamimbo, barges ferry ragged, starving soldiers out to the ships; PT boats fight them for hours and three are sunk. By 01:58 4,935 men are aboard. The destroyer Makigumo, hit by a torpedo or mine, is scuttled. Earlier that day dive bombers sank the American destroyer De Haven.',
      at('22:40')),
    ev('1943-02-04', 'Hyakutake leaves Guadalcanal', 'movement', P.capeEsperanceLand, 10,
      'The second run goes undisturbed. Hyakutake, his staff and 3,921 men, mostly from the 2nd Division, are taken off and reach Bougainville the next day. The Americans still believe the Japanese are bringing in reinforcements.'),
    ev('1943-02-07', 'The last Japanese troops slip away', 'movement', P.kamimbo, 10,
      'Exactly six months after the American landings, 18 destroyers load the final 1,972 soldiers at Kamimbo by 00:03 on 8 February. Sailors row along the shore for another 90 minutes calling out to make sure no one is left. In all 10,652 men have been evacuated, of about 36,000 sent to the island.',
      { ...ord('23:00'), link: { timeline: 'yamamoto', event: '1943-02-07-guadalcanal-evacuated', label: 'See this in Isoroku Yamamoto' } }),
    ev('1943-02-09', 'Guadalcanal secured', 'political', P.capeEsperanceLand, 10,
      'American columns from the north and south coasts meet at Tenaro village at 16:50, finding only sick and dying Japanese. Patch signals Halsey that the Japanese on Guadalcanal have been totally defeated. The campaign is over: the Allies have taken the initiative in the Pacific and will not give it back.',
      at('16:50', { facts: [['Japanese evacuated', '10,652 of about 36,000 sent to the island'], ['Duration', '7 August 1942 – 9 February 1943']],
        link: { timeline: 'road-to-tokyo-bay', event: '1943-02-09-guadalcanal-secured', label: 'Continue in The Road to Tokyo Bay' } })),
  ];

  // ---------- Shot list ----------
  // Camera direction for the campaign (see "Shots" in app.js). Events not listed use the
  // automatic framing.
  const pt = (place) => [place.lat, place.lng];
  const SHOTS = {
    // Landings: Tulagi and Guadalcanal across the sound in one frame.
    'Marines land on Tulagi': { scene: 'landings', frame: [pt(P.tulagi), pt(P.beach)] },
    'Vandegrift lands on Guadalcanal': { scene: 'landings' },
    'Paratroopers assault Gavutu': { shot: 'tight', transition: 'fly' },
    // Savo: the two cruiser groups either side of the island.
    '“Strange ships entering the harbor!”': { scene: 'savo', frame: [pt(P.savo), pt(P.savoNorth), pt(P.lunga)] },
    'The northern cruisers are caught asleep': { scene: 'savo' },
    'Mikawa turns for home': { scene: 'savo' },
    'S-44 sinks Kako': { shot: 'wide', transition: 'pull-back', frame: [pt(P.savo)] },
    // Eastern Solomons: the carrier battle seen against Guadalcanal.
    'Saratoga’s planes sink Ryūjō': { scene: 'eastern-solomons', frame: [pt(P.ryujo), pt(P.easternSolomons), pt(P.henderson)] },
    'Three bombs hit Enterprise': { scene: 'eastern-solomons' },
    // Edson's Ridge, close in.
    'Kawaguchi strikes the ridge': { scene: 'ridge', shot: 'tight' },
    'The stand on Hill 123': { scene: 'ridge' },
    'I-19 sinks Wasp': { shot: 'wide', transition: 'pull-back', frame: [pt(P.henderson)] },
    // Henderson Field battle on the perimeter.
    'Basilone and Puller hold the southern line': { scene: 'perimeter', frame: [pt(P.southPerimeter), pt(P.lunga)] },
    'Japanese destroyers attack off Lunga': { scene: 'perimeter' },
    'Hyakutake calls off the offensive': { scene: 'perimeter' },
    'Santa Cruz: Hornet is crippled': { shot: 'wide', transition: 'pull-back', frame: [pt(P.henderson)] },
    // Naval Battle of Guadalcanal: Ironbottom Sound and the Slot.
    'Naval Battle of Guadalcanal: the first night': { scene: 'november', frame: [pt(P.ironbottom), pt(P.savo), pt(P.lunga)] },
    'Hiei sinks': { scene: 'november' },
    'Washington ambushes Kirishima': { scene: 'november' },
    'The last transports beach at Tassafaronga': { shot: 'tight', transition: 'fly' },
    // Operation Ke at the western tip.
    'Operation Ke: the first evacuation run': { scene: 'ke', frame: [pt(P.capeEsperanceLand), pt(P.kamimbo)] },
    'Hyakutake leaves Guadalcanal': { scene: 'ke' },
    'The last Japanese troops slip away': { scene: 'ke' },
  };
  const events = WW2.events['guadalcanal'];
  for (const [title, shot] of Object.entries(SHOTS)) {
    const e = events.find((x) => x.title === title);
    if (!e) throw new Error(`guadalcanal shot list: no event titled "${title}"`);
    Object.assign(e, shot);
  }
})();
