// Timeline: Malaya and Singapore (War in the Pacific).
// The Malayan campaign and the Fall of Singapore, 8 December 1941 – 15 February 1942: the
// landings at Kota Bharu and Singora, the loss of Force Z, Jitra, Kampar, Slim River, the
// fighting in Johore, the retreat across the causeway, the battle on Singapore Island and the
// surrender, with a little lead-up and aftermath (Sook Ching, the fates of the two commanders).
// Checked against the English Wikipedia articles "Malayan campaign", "Fall of Singapore",
// "Sinking of Prince of Wales and Repulse", "Battle of Kota Bharu", "Japanese invasion of
// Thailand", "Battle of Jitra", "Battle of Kampar", "Battle of Slim River", "Battle of Muar",
// "Battle of Gemas", "Parit Sulong Massacre", "Battle off Endau", "Johor–Singapore Causeway",
// "Battle of Sarimbun Beach", "Battle of Kranji", "Battle of Bukit Timah", "Battle of Pasir
// Panjang", "Sook Ching", "Tomoyuki Yamashita" and "Arthur Percival" (October 2026).
//
// Times are local times as the sources give them, shown as Malaya time (Thailand time for
// Singora). The sources do not always say which clock they use, and some Japanese accounts run
// on Tokyo time; where they disagree (notably the hour of the surrender) the event is left
// date-only or marked approximate. Event schema: see data/timelines/attack-on-hawaii.js.

(function () {
  const P = {
    hainan: { name: 'Sanya (Samah), Hainan Island', lat: 18.25, lng: 109.5 },
    singapore: { name: 'Singapore', lat: 1.29, lng: 103.85 },
    navalBase: { name: 'Singapore Naval Base, Sembawang', lat: 1.46, lng: 103.83 },
    gulf: { name: 'Gulf of Siam, off southern Indochina (approx.)', lat: 8.5, lng: 104.0 },
    kotaBharu: { name: 'Kota Bharu, Kelantan', lat: 6.13, lng: 102.24 },
    sabak: { name: 'Badang and Sabak beaches, Kota Bharu (approx.)', lat: 6.17, lng: 102.32 },
    singora: { name: 'Singora (Songkhla), Thailand', lat: 7.206, lng: 100.597 },
    krohcol: { name: 'Kroh–Pattani road, Thai border (approx.)', lat: 5.75, lng: 101.0 },
    alorStar: { name: 'Alor Star, Kedah', lat: 6.118, lng: 100.369 },
    forceZSea: { name: 'South China Sea, east of the Anambas route (approx.)', lat: 5.5, lng: 105.5 },
    forceZNight: { name: 'South China Sea, off the Malayan east coast (approx.)', lat: 6.5, lng: 104.3 },
    forceZ: { name: 'Off Kuantan, where Force Z was sunk', lat: 3.56, lng: 104.478 },
    kuantan: { name: 'Kuantan, Pahang', lat: 3.817, lng: 103.333 },
    changlun: { name: 'Changlun and Asun, north of Jitra (approx.)', lat: 6.4, lng: 100.43 },
    jitra: { name: 'Jitra, Kedah', lat: 6.268, lng: 100.422 },
    penang: { name: 'Penang', lat: 5.414, lng: 100.329 },
    kualaLumpur: { name: 'Kuala Lumpur', lat: 3.148, lng: 101.695 },
    kampar: { name: 'Kampar, Perak', lat: 4.3, lng: 101.15 },
    telokAnson: { name: 'Telok Anson (Teluk Intan), Perak', lat: 4.033, lng: 101.017 },
    trolak: { name: 'Trolak, north of the Slim River (approx.)', lat: 3.9, lng: 101.38 },
    slimBridge: { name: 'Slim River road bridge (approx.)', lat: 3.83, lng: 101.41 },
    gemencheh: { name: 'Gemencheh Bridge, west of Gemas (approx.)', lat: 2.58, lng: 102.53 },
    muar: { name: 'Muar, Johore', lat: 2.05, lng: 102.57 },
    bakri: { name: 'Bakri, southeast of Muar (approx.)', lat: 2.03, lng: 102.65 },
    paritSulong: { name: 'Parit Sulong, Johore', lat: 1.982, lng: 102.878 },
    endau: { name: 'Endau, Johore', lat: 2.65, lng: 103.62 },
    causeway: { name: 'Johor–Singapore Causeway', lat: 1.4525, lng: 103.7686 },
    serene: { name: 'Istana Bukit Serene, Johor Bahru', lat: 1.4635, lng: 103.7286 },
    ubin: { name: 'Pulau Ubin, Singapore', lat: 1.409, lng: 103.96 },
    sarimbun: { name: 'Sarimbun Beach, northwest Singapore (approx.)', lat: 1.43, lng: 103.69 },
    tengah: { name: 'Tengah airfield, Singapore', lat: 1.387, lng: 103.709 },
    kranji: { name: 'Kranji River mouth, Singapore (approx.)', lat: 1.44, lng: 103.74 },
    bukitTimah: { name: 'Bukit Timah, Singapore', lat: 1.34, lng: 103.776 },
    pasirPanjang: { name: 'Pasir Panjang Ridge, Singapore', lat: 1.283, lng: 103.787 },
    bukitChandu: { name: 'Bukit Chandu, Pasir Panjang', lat: 1.2797, lng: 103.7887 },
    alexandra: { name: 'Alexandra Hospital, Singapore', lat: 1.2867, lng: 103.8014 },
    fortCanning: { name: 'The Battlebox, Fort Canning, Singapore', lat: 1.2961, lng: 103.8462 },
    ford: { name: 'Ford Motor Factory, Bukit Timah, Singapore', lat: 1.3533, lng: 103.7695 },
    changi: { name: 'Changi Beach, Singapore', lat: 1.39, lng: 103.99 },
    tokyoBay: { name: 'USS Missouri, Tokyo Bay', lat: 35.35, lng: 139.75 },
    luzon: { name: 'Luzon, Philippines', lat: 14.6, lng: 121.0 },
  };

  const ev = (date, title, type, location, zoom, summary, extra = {}) => ({
    id: extra.id || `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}`,
    date, title, type, location, zoom, summary,
    theater: extra.theater || 'Asia',
    ...extra,
  });
  const at = (time, extra = {}) => ({ time, tz: 'MYT', ...extra });
  const ord = (sortTime, tz = 'MYT') => ({ sortTime, tz }); // order within the day only; no time shown

  WW2.events['malaya-singapore'] = [
    // ---------- Lead-up ----------
    ev('1941-12-02', 'Force Z reaches Singapore', 'movement', P.navalBase, 11,
      'The battleship Prince of Wales and the battlecruiser Repulse arrive at Singapore with four destroyers, the first battle fleet ever based there. They were meant to come with the carrier Indomitable, but she ran aground off Jamaica in November, so the squadron has no air cover of its own. Admiral Sir Tom Phillips takes command as Commander-in-Chief of the Eastern Fleet.',
      { facts: [['Ships', 'Prince of Wales, Repulse; destroyers Electra, Express, Encounter, Jupiter'], ['Commander', 'Admiral Sir Tom Phillips']] }),
    ev('1941-12-04', 'The invasion convoy sails from Hainan', 'movement', P.hainan, 6,
      'Troopships carrying Lieutenant General Tomoyuki Yamashita’s 25th Army leave Samah harbour on Hainan Island, and more ships join from Indochina. Yamashita has about a third of the strength of the British forces in Malaya and plans a fast “driving charge” down the peninsula to win before that difference can count.',
      { paths: [{ label: 'Invasion convoy toward Malaya and Thailand (approximate)', kind: 'route', coords: [[18.25, 109.5], [12.5, 106.5], [8.5, 103.5], [7.2, 100.6]] }] }),
    ev('1941-12-06', 'The convoy is sighted but left alone', 'intelligence', P.gulf, 6,
      'Hudsons of No. 1 Squadron RAAF spot the Japanese invasion fleet at sea. Its destination is unclear, and Sir Robert Brooke-Popham, the British commander in the Far East, is under instructions to avoid offensive action until British territory is attacked, and does not allow it to be bombed. He also hesitates to launch Operation Matador, the planned advance into southern Thailand.',
      { approx: true }),
    ev('1941-12-07', 'A Catalina is shot down', 'loss', P.gulf, 6,
      'A Catalina flying boat of No. 205 Squadron RAF finds the convoy again but is shot down by Japanese fighters before it can report. Its captain, Flying Officer Patrick Bedell, and his seven crew are the first Allied dead of the war with Japan.'),

    // ---------- 8 December: invasion ----------
    ev('1941-12-08', 'Japanese troops land at Kota Bharu', 'invasion', P.sabak, 11,
      'Three transports anchor off Kota Bharu with about 5,200 men of the Takumi Detachment and open the landing with a bombardment. Indian troops of the 3/17th Dogras fire on the landing craft from pillboxes and trenches, and the first waves are pinned down on the beaches before they break through. In absolute time this is more than an hour before the first bombs fall on Pearl Harbor.',
      at('00:30', { facts: [['Japanese', 'Takumi Detachment (18th Division), about 5,200 men'], ['Defenders', '8th Indian Infantry Brigade (Brigadier B. W. Key)']],
        link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1941-12-08-japanese-landings-at-kota-bharu-malaya', label: 'See the landings in Pearl Harbor to Guadalcanal' } })),
    ev('1941-12-08', 'Hudsons hit the transports', 'attack', P.kotaBharu, 10,
      'Hudson bombers of No. 1 Squadron RAAF from the airfield at Kota Bharu attack the troopships in the first air attack of the Pacific War. All three transports are damaged and Awazisan Maru is left burning and abandoned, for the loss of two Hudsons. One damaged Hudson crashes into a landing craft full of troops.',
      at('01:18')),
    ev('1941-12-08', 'Singapore is bombed', 'attack', P.singapore, 11,
      'Seventeen Japanese bombers from Indochina carry out the first air raid on Singapore, hitting the city centre, the naval base and the northern airfields. Prince of Wales and Repulse fire at them from the harbour without effect. It is now clear that bombers based in Indochina can reach the island.',
      at('04:00')),
    ev('1941-12-08', 'The main landings at Singora and Pattani', 'invasion', P.singora, 9,
      'The Japanese 5th Division comes ashore at Singora and Pattani in southern Thailand, the main blow of the invasion. Thai troops and police resist for some hours until their government orders a ceasefire. From here the division will strike southwest across the border into Kedah.',
      ord('04:00', 'ICT')),
    ev('1941-12-08', 'Airfields in the north are wrecked', 'attack', P.alorStar, 9,
      'Japanese bombers concentrate on the RAF and RAAF airfields at Alor Star, Sungai Petani and Butterworth. About 60 Allied aircraft are lost on the first day, most of them on the ground. Within a week the Japanese have control of the air over Malaya.',
      ord('10:00')),
    ev('1941-12-08', 'Krohcol crosses into Thailand', 'movement', P.krohcol, 9,
      'With Operation Matador abandoned, a smaller column, Krohcol, is sent across the border to seize a stretch of the road from Pattani known as “the Ledge”. It sets off late and is held up by Thai police, and the Japanese 5th Division beats it to its objective.',
      ord('14:00')),
    ev('1941-12-08', 'Force Z sails north', 'movement', P.navalBase, 8,
      'Phillips takes Prince of Wales, Repulse and four destroyers out of Singapore to attack the Japanese invasion shipping off Singora, hoping to strike on 10 December. He has been told fighter cover cannot be guaranteed, and has turned down offers from the RAAF and RNZAF fighter squadrons to keep aircraft over his ships.',
      at('17:10', { paths: [{ label: 'Force Z’s sortie (approximate)', kind: 'route', coords: [[1.46, 103.83], [2.9, 105.8], [5.5, 105.5], [6.8, 104.6]] }] })),

    // ---------- 9 December ----------
    ev('1941-12-09', 'Kota Bharu falls', 'invasion', P.kotaBharu, 10,
      'Despite heavy losses on the beaches, the Takumi Detachment has three battalions ashore. Brigadier Key’s counter-attacks fail, his airfield has been evacuated, and the Japanese take the town. Key is allowed to withdraw, and Japanese fighters are soon flying from the captured airfields.'),
    ev('1941-12-09', 'A lone Blenheim bombs Singora', 'attack', P.singora, 9,
      'A raid on the Japanese-held airfield at Singora is caught on take-off by Japanese aircraft, and all but one of the Blenheim bombers are shot down or disabled. The survivor, flown by Arthur Scarf, presses on alone and bombs Singora.',
      ord('12:00')),
    ev('1941-12-09', 'A submarine finds Force Z', 'intelligence', P.forceZSea, 6,
      'The Japanese submarine I-65 sights Force Z and shadows it for five hours, radioing its position. The 22nd Air Flotilla near Saigon, loading bombs for a raid on Singapore, switches its bombers to torpedoes, and Vice Admiral Jisaburō Ozawa sends his transports back toward Cam Ranh Bay.',
      at('14:00', { wiki: { 'I-65': 'Japanese_submarine_I-165' } })),
    ev('1941-12-09', 'Phillips turns back', 'movement', P.forceZNight, 7,
      'Japanese seaplanes have found the ships, and a flare dropped in the darkness convinces Phillips he has lost surprise. He calls off the operation and heads back toward Singapore. A Japanese cruiser force passes only a few miles away without either side seeing the other.',
      at('20:55')),

    // ---------- 10 December: Force Z ----------
    ev('1941-12-10', 'A false report draws Force Z to Kuantan', 'intelligence', P.kuantan, 9,
      'A signal reports Japanese landings at Kuantan, halfway up the east coast. Phillips turns toward it without saying so by radio, to keep his position secret, so no fighters are sent. A destroyer and the battleship’s Walrus floatplane find nothing there.',
      at('00:50')),
    ev('1941-12-10', 'A scout plane finds the ships', 'intelligence', P.forceZ, 8,
      'Dozens of Japanese bombers have been searching too far south. Ensign Masato Hoashi, flying a scout to the north of them, finds Force Z and reports its exact position, and the bombers turn toward it.',
      at('10:15')),
    ev('1941-12-10', 'The first bombs hit Repulse', 'attack', P.forceZ, 9,
      'Short of fuel, the Japanese attack in small groups as they arrive. Eight G3M bombers go for Repulse and score one hit, which does little damage. She keeps going at 25 knots.',
      at('11:13')),
    ev('1941-12-10', 'A torpedo cripples Prince of Wales', 'attack', P.forceZ, 9,
      'Seventeen torpedo-carrying G3Ms attack both ships. One torpedo strikes Prince of Wales where her outer port propeller shaft leaves the hull. The turning shaft tears open the ship from inside, she takes on some 2,400 tons of water and lists to port, and she loses power to her steering, pumps and most of her anti-aircraft guns.',
      at('11:40')),
    ev('1941-12-10', 'Repulse sinks', 'loss', P.forceZ, 9,
      'Twenty-six G4M bombers attack from both sides. Repulse has dodged 19 torpedoes, but she is caught in a pincer and hit by at least four. Captain William Tennant orders his men over the side, and she rolls over and goes down within minutes.',
      at('12:33', { facts: [['Lost', '513 of 1,309 crew'], ['Attackers', 'G4Ms of the Kanoya Air Group']] })),
    ev('1941-12-10', 'Prince of Wales sinks', 'loss', P.forceZ, 9,
      'Hit by three more torpedoes and a bomb that explodes among the wounded, Prince of Wales capsizes and sinks as the destroyer Express takes off survivors. Phillips and Captain John Leach go down with her. The ten Buffalo fighters sent to cover Force Z arrive just as she sinks. She and Repulse are the first capital ships defending themselves at sea to be sunk by aircraft alone.',
      at('13:18', { facts: [['Lost', '327 of 1,612 crew'], ['Total dead', '840'], ['Japanese losses', '3 aircraft in the attack, a fourth on landing']] })),

    // ---------- The north-west: Jitra ----------
    ev('1941-12-11', 'Tanks scatter the Punjabis at Changlun', 'attack', P.changlun, 11,
      'The vanguard of the 5th Division, led by Lieutenant Colonel Saeki with tanks, comes down the trunk road from Thailand. In a downpour its tanks drive into the 1/14th Punjab as it is loading into lorries, and only about 270 men get away. That evening the 2/1st Gurkhas at Asun are broken in turn.'),
    ev('1941-12-12', 'The battle at Jitra', 'attack', P.jitra, 11,
      'The 11th Indian Division holds a line at Jitra 14 miles long, across flooded rice fields and rubber estates, with trenches waterlogged and telephone lines failing. Saeki attacks the Leicesters and Jats, drives a wedge between them, and overruns a company of the Jats. In the evening Percival lets Major General David Murray-Lyon withdraw to Gurun.',
      { ...ord('19:30'), facts: [['British', '11th Indian Division (Murray-Lyon)'], ['Japanese', 'Saeki Detachment, 5th Division']] }),
    ev('1941-12-13', 'The retreat from Jitra', 'loss', P.jitra, 10,
      'Orders to withdraw fail to reach many forward companies, and the night retreat costs the division more men than the battle itself. Some units are still in their positions at daylight; others escape across country or by boat down the coast. The Japanese capture large stocks of supplies, and Percival orders the remaining aircraft in Malaya held back to defend Singapore.'),
    ev('1941-12-17', 'Penang is abandoned', 'political', P.penang, 10,
      'Bombed daily since the start of the invasion, with more than 2,000 civilians killed in the raids, Penang is given up on the orders of the British command. The Europeans are evacuated while the local population is left behind, and boats, supplies and a working radio station fall into Japanese hands. The episode badly damages British standing in Malaya.'),
    ev('1941-12-23', 'Murray-Lyon is relieved', 'political', P.kualaLumpur, 7,
      'The commander of the 11th Indian Division is removed after the defeats in Kedah. By the end of the first week of January all of northern Malaya is in Japanese hands.'),

    // ---------- Kampar and Slim River ----------
    ev('1942-01-01', 'The stand at Kampar', 'attack', P.kampar, 11,
      'The 11th Indian Division holds the hills above Kampar, a strong position the Japanese want to take as a New Year’s gift for the Emperor. The 41st Infantry Regiment attacks the British Battalion, formed from the survivors of the Leicesters and East Surreys, and trenches change hands at bayonet point. Well-placed artillery inflicts heavy losses; it is the first serious check the Japanese suffer in Malaya.',
      { facts: [['Battle', '30 December 1941 – 2 January 1942'], ['British', '11th Indian Division (Major General Archie Paris)']] }),
    ev('1942-01-02', 'Landings outflank Kampar', 'invasion', P.telokAnson, 10,
      'Unable to break through at Kampar, Yamashita lands troops on the west coast behind it and takes Telok Anson. With his line of retreat threatened, Paris abandons the Kampar position and falls back to the Slim River.'),
    ev('1942-01-03', 'Hurricanes arrive in Singapore', 'movement', P.singapore, 10,
      'Fifty-one crated Hurricane fighters and 24 pilots reach Singapore and are assembled within days. By now the Buffalo squadrons have been overwhelmed, and the Hurricanes, slowed by heavy dust filters, also begin to suffer severe losses.'),
    ev('1942-01-07', 'Tanks break through at Slim River', 'attack', P.trolak, 11,
      'In heavy rain, Major Toyosaku Shimada leads about 20 tanks straight down the road in a night attack, an unusual tactic, with infantry close behind. They smash through the Hyderabads’ roadblocks, push past the 5/2nd Punjab, and split the 2nd Argyll and Sutherland Highlanders at Trolak, some of whose men mistake the first tanks for their own carriers.',
      at('03:30')),
    ev('1942-01-07', 'Lieutenant Watanabe takes the bridge', 'attack', P.slimBridge, 11,
      'Shimada’s leading tanks catch two marching battalions in column and cut them down, then race on through the gun lines to the Slim River road bridge, where Lieutenant Sadanobu Watanabe cuts the wires to the demolition charges with his sword. In a single morning two Indian brigades are destroyed and the way to Kuala Lumpur is open.',
      at('08:30', { facts: [['British losses', 'About 3,200 men and much irreplaceable equipment'], ['Distance', 'About 19 miles of road and two bridges taken']] })),
    ev('1942-01-11', 'Kuala Lumpur is occupied', 'invasion', P.kualaLumpur, 10,
      'The Japanese enter Kuala Lumpur without a fight. General Archibald Wavell, the new Allied supreme commander, has ordered central Malaya given up; the battered 11th Indian Division goes into reserve, and the Australian 8th Division under Major General Gordon Bennett is to make the next stand in Johore.'),

    // ---------- Johore ----------
    ev('1942-01-14', 'The ambush at Gemencheh Bridge', 'attack', P.gemencheh, 11,
      'B Company of the Australian 2/30th Battalion springs an ambush as hundreds of Japanese troops, many on bicycles, cross a wooden bridge west of Gemas. The bridge is blown and the column is raked with fire for about 20 minutes before the company pulls back. The Japanese repair the bridge within hours, but in this and the fighting at Gemas over the next two days they lose several hundred men.',
      at('16:00', { facts: [['Australians', '2/30th Battalion (Lieutenant Colonel Frederick Galleghan)'], ['Japanese casualties', 'Up to about 800 in the wider battle']] })),
    ev('1942-01-16', 'Muar falls', 'invasion', P.muar, 11,
      'On the west coast, Japanese troops cross the Muar River in captured barges and outflank the newly arrived, half-trained 45th Indian Brigade. The commanders of two of its battalions are killed, and by nightfall the town and harbour are in Japanese hands.'),
    ev('1942-01-20', 'The fighting withdrawal from Bakri', 'movement', P.bakri, 11,
      'With Brigadier Duncan and an Australian battalion commander killed, Lieutenant Colonel Charles Anderson takes command of the Indian and Australian troops around Bakri. His column, carrying its wounded, fights through one roadblock after another toward Yong Peng.',
      at('07:00')),
    ev('1942-01-21', '“Every man for himself” at Parit Sulong', 'loss', P.paritSulong, 12,
      'Anderson’s column takes the village of Parit Sulong but cannot force the bridge, the only way out, and the Japanese refuse to let two ambulances of dying men through. Anderson orders those who can walk to scatter into the jungle. About 150 men too badly wounded to move are left behind to surrender. Anderson will be awarded the Victoria Cross for the withdrawal.',
      ord('17:00')),
    ev('1942-01-22', 'The Parit Sulong massacre', 'loss', P.paritSulong, 12,
      'Soldiers of the Imperial Guards Division kill about 150 wounded Australian and Indian prisoners at Parit Sulong. Only a couple survive. The fighting around Muar has cost the Allies some 3,000 men and the whole of the 45th Indian Brigade.'),
    ev('1942-01-26', 'Air attacks on the Endau convoy', 'attack', P.endau, 10,
      'A Japanese convoy landing troops at Endau on the east coast is attacked by the obsolete Vildebeest biplanes and other aircraft that Singapore has left. They suffer heavy losses and do little damage; that night a Royal Navy attempt with two destroyers to break up the landings also fails and one destroyer is sunk.'),
    ev('1942-01-27', 'Percival orders the retreat to Singapore', 'political', P.singapore, 9,
      'With the last defensive line in Johore under attack along its whole length, Percival gets Wavell’s permission to withdraw across the Johore Strait to Singapore Island. Earlier he refused to build fixed defences in Johore or on the island’s north shore, arguing that they were bad for morale.'),
    ev('1942-01-31', 'The causeway is blown', 'movement', P.causeway, 12,
      'The last organised Allied troops cross from Johore to Singapore in the early hours. The final unit over, the 2nd Argylls, is piped across by two of its pipers. Royal Engineers then blow a gap about 70 feet wide in the causeway, which also cuts the water pipeline from the mainland. In less than two months nearly 50,000 Commonwealth troops have been killed or captured.',
      { facts: [['Distance advanced', 'About 650 miles from Singora to the strait']] }),

    // ---------- Singapore Island ----------
    ev('1942-02-03', 'The shelling of the island begins', 'attack', P.serene, 11,
      'Japanese artillery begins shelling the island and air attacks grow heavier. Yamashita directs the battle from the Sultan of Johor’s palace at Istana Bukit Serene, which overlooks the north of the island. Australian gunners can see it, but Bennett refuses permission to fire on the Sultan’s palace.'),
    ev('1942-02-07', 'A feint at Pulau Ubin', 'invasion', P.ubin, 11,
      'Four hundred Imperial Guards land on Pulau Ubin in the northeast, meeting little resistance. Together with deliberate troop movements on that side of the strait, it reinforces Percival’s belief that the main attack will come in the northeast, where he has placed the fresh British 18th Division. The Australian patrols that have found Japanese troops massing opposite the northwest are not heeded.'),
    ev('1942-02-08', 'The Japanese cross the Johore Strait', 'invasion', P.sarimbun, 11,
      'After a day of intense shelling that cuts the Australians’ telephone lines, the first assault waves of the 5th and 18th Divisions cross the narrow western strait in barges and collapsible boats against the 22nd Australian Brigade. Machine-gunners of the 2/4th Battalion open fire, but the beach searchlights are never switched on. About 13,000 Japanese troops get ashore during the night against about 3,000 Australians, and more follow after dawn.',
      at('20:30', { approx: true, facts: [['Defenders', '22nd Australian Brigade (Brigadier Harold Taylor)'], ['Japanese', '5th and 18th Divisions']],
        link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1942-02-08-japanese-troops-cross-to-singapore-islan', label: 'See the crossing in Pearl Harbor to Guadalcanal' } })),
    ev('1942-02-09', 'Tengah airfield is lost', 'loss', P.tengah, 11,
      'The Australians fall back from the coast through the night in small groups, many of them cut off. Around midday the Japanese take Tengah, the island’s largest airfield. Above it, the last ten Hurricanes from Kallang fight the Japanese air cover; that evening the survivors are withdrawn to Sumatra and no more Allied fighters are seen over Singapore.',
      ord('12:00')),
    ev('1942-02-10', 'Burning oil in the Kranji River', 'attack', P.kranji, 12,
      'The Imperial Guards cross late on the 9th between the Kranji River and the causeway. Oil let out of the Woodlands depot is set alight in the water, and many Japanese are burned to death; their commander, Takuma Nishimura, asks to call off the attack but Yamashita refuses. Then the 27th Australian Brigade, out of touch with its flank, pulls back from the shore, leaving the Japanese free to land and begin repairing the causeway.',
      ord('02:00')),
    ev('1942-02-10', 'Churchill demands a fight to the end', 'political', P.singapore, 9,
      'The Jurong line west of Bukit Timah collapses through misunderstood orders, and Wavell orders Percival to retake it. That evening Churchill cables Wavell that there must be no thought of saving the troops or the population and that commanders should die with their troops.',
      ord('20:00')),
    ev('1942-02-11', 'Bukit Timah falls', 'loss', P.bukitTimah, 12,
      'Before dawn the Japanese fall on X Battalion, a scratch unit of Australian reinforcements waiting to counter-attack, and kill or wound two-thirds of it. Chinese volunteers of Dalforce fight hand to hand alongside British troops, but the Japanese take Bukit Timah and with it the garrison’s main food and fuel depots. Yamashita calls on Percival to give up a “meaningless and desperate resistance”.',
      { facts: [['Japanese supplies', 'Running low'], ['Percival’s orders', 'No general surrender (Wavell)']] }),
    ev('1942-02-13', 'A perimeter around the city', 'movement', P.pasirPanjang, 11,
      'Overnight the defenders pull back from the beaches and Changi to a 28-mile perimeter around Singapore city. On the southwest edge, the 1st Malaya Brigade meets the Japanese 18th Division on Pasir Panjang Ridge in the afternoon. The same day military police shoot Captain Patrick Heenan, a British air liaison officer convicted of spying for the Japanese, at Keppel Harbour.',
      ord('14:00')),
    ev('1942-02-14', 'The Alexandra Hospital massacre', 'loss', P.alexandra, 12,
      'Japanese troops break through near Alexandra Barracks and enter the military hospital. A British officer approaching under a white flag is bayoneted, and soldiers, doctors and nurses are killed, some on the operating table. About 200 more staff and patients are taken away, held overnight without water and bayoneted the next morning.',
      at('13:00', { approx: true })),
    ev('1942-02-14', 'The Malay Regiment at Bukit Chandu', 'attack', P.bukitChandu, 12,
      'C Company of the Malay Regiment, under Second Lieutenant Adnan Saidi, holds Bukit Chandu, the hill covering the Alexandra depots. It sees through a Japanese attempt to approach in Indian Army uniforms, then is overwhelmed by a mass assault with tanks. Adnan, badly wounded, is captured and killed. The regiment loses 159 men in the campaign, most of them in these last days.',
      { ...ord('16:00'), approx: true }),

    // ---------- 15 February: surrender ----------
    ev('1942-02-15', 'The last conference at Fort Canning', 'political', P.fortCanning, 12,
      'A million civilians are crowded into the small area still held, the water supply is close to failing, and food, petrol and ammunition are running out. In the underground Battlebox, Percival offers his commanders a counter-attack to retake the reservoirs and depots, or surrender. All agree a counter-attack is impossible. They do not know the Japanese are near the end of their own ammunition.',
      at('09:30')),
    ev('1942-02-15', 'Percival surrenders at the Ford factory', 'political', P.ford, 12,
      'Percival walks under a white flag to Yamashita’s headquarters in the Ford Motor Factory at Bukit Timah. After a short dispute Yamashita agrees that 1,000 British troops may stay armed to keep order, and Percival accepts unconditional surrender in the early evening; accounts give the time as between 17:15 and 18:10. Firing is to stop at 20:30. Churchill will call it the worst disaster and largest capitulation in British history.',
      { ...ord('18:00'), facts: [['Prisoners', 'About 80,000 on the island, after some 50,000 lost in Malaya'], ['Allied losses in the campaign', 'About 130,000–139,000, most of them captured'], ['Japanese casualties', 'About 9,700–14,800']],
        link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1942-02-15-singapore-surrenders', label: 'See the surrender in Pearl Harbor to Guadalcanal' } }),
    ev('1942-02-15', 'Bennett escapes', 'movement', P.singapore, 10,
      'On hearing of the surrender, Gordon Bennett hands command of the 8th Australian Division to his artillery commander and leaves by small boat with some of his staff, eventually reaching Australia. Between 15,000 and 20,000 Australian soldiers go into captivity.',
      ord('22:00')),

    // ---------- Aftermath ----------
    ev('1942-02-18', 'Sook Ching begins', 'loss', P.changi, 11,
      'The Kempeitai and army units begin screening Chinese men aged 18 to 50 across Singapore, now renamed Syonan-to. Those judged “anti-Japanese”, often on no real criteria at all, are taken to beaches such as Changi and shot. The killings continue until 4 March and spread to Malaya. Japan later admitted to no more than about 6,000 deaths; Lee Kuan Yew, who narrowly escaped being a victim, put the verifiable toll at about 70,000 including Malaya.',
      { facts: [['Dates', '18 February – 4 March 1942'], ['Carried out by', 'Kempeitai and units of the 25th Army']] }),
    ev('1945-09-02', 'Percival watches Japan surrender', 'political', P.tokyoBay, 10,
      'Freed from a prison camp in Manchuria, Percival stands behind General Douglas MacArthur alongside the American general Jonathan Wainwright as Japan signs the instrument of surrender aboard USS Missouri. MacArthur gives him one of the pens he used.',
      { theater: 'Pacific', link: { timeline: 'road-to-tokyo-bay', event: '1945-09-02-surrender-aboard-uss-missouri', label: 'See the surrender in The Road to Tokyo Bay' } }),
    ev('1946-02-23', 'Yamashita is hanged', 'political', P.luzon, 7,
      'The “Tiger of Malaya”, later commander in the Philippines, is hanged there after a U.S. military commission convicts him of war crimes. He is not tried for the crimes committed by his troops in Malaya and Singapore, and how far he was responsible for Sook Ching remains disputed.'),
  ];

  // ---------- Shot list ----------
  // Camera direction (see "Shots" in app.js). Events not listed use the automatic framing.
  const pt = (place) => [place.lat, place.lng];
  const SHOTS = {
    // The opening night: the whole invasion front in one frame.
    'The invasion convoy sails from Hainan': { shot: 'wide', frame: [pt(P.hainan), pt(P.singapore)] },
    'Japanese troops land at Kota Bharu': { shot: 'tight', transition: 'fly' },
    'Singapore is bombed': { frame: [pt(P.kotaBharu), pt(P.singapore)] },
    'The main landings at Singora and Pattani': { shot: 'wide', transition: 'pull-back', frame: [pt(P.singora), pt(P.kotaBharu)] },
    // Force Z: the sortie and the hunt, then down onto the ships.
    'Force Z sails north': { scene: 'force-z-sortie', frame: [pt(P.navalBase), pt(P.forceZNight)] },
    'A submarine finds Force Z': { scene: 'force-z-sortie' },
    'Phillips turns back': { scene: 'force-z-sortie' },
    'A false report draws Force Z to Kuantan': { frame: [pt(P.kuantan), pt(P.forceZNight)] },
    'The first bombs hit Repulse': { scene: 'force-z-sunk', shot: 'tight' },
    'A torpedo cripples Prince of Wales': { scene: 'force-z-sunk' },
    'Repulse sinks': { scene: 'force-z-sunk' },
    'Prince of Wales sinks': { scene: 'force-z-sunk' },
    // Slim River: the night drive down the road to the bridge.
    'Tanks break through at Slim River': { scene: 'slim-river', frame: [pt(P.trolak), pt(P.slimBridge)] },
    'Lieutenant Watanabe takes the bridge': { scene: 'slim-river' },
    // Back out to show how far the advance has come.
    'The causeway is blown': { shot: 'wide', transition: 'pull-back', frame: [pt(P.singora), pt(P.causeway)] },
    // The island battle: the northwest shore, then in toward the city.
    'The Japanese cross the Johore Strait': { scene: 'crossing', frame: [pt(P.sarimbun), pt(P.causeway)] },
    'Tengah airfield is lost': { scene: 'crossing' },
    'Burning oil in the Kranji River': { scene: 'crossing' },
    'The Alexandra Hospital massacre': { scene: 'last-days', frame: [pt(P.bukitChandu), pt(P.alexandra)] },
    'The Malay Regiment at Bukit Chandu': { scene: 'last-days' },
    'The last conference at Fort Canning': { shot: 'tight', transition: 'fly' },
    'Percival surrenders at the Ford factory': { shot: 'tight', transition: 'fly' },
  };
  const events = WW2.events['malaya-singapore'];
  for (const [title, shot] of Object.entries(SHOTS)) {
    const e = events.find((x) => x.title === title);
    if (!e) throw new Error(`malaya-singapore shot list: no event titled "${title}"`);
    Object.assign(e, shot);
  }
})();
