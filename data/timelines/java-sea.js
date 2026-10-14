// Timeline: The Battle of the Java Sea (War in the Pacific).
// The naval defence of the Dutch East Indies by the ABDA forces, January – March 1942: the
// destroyer raid at Balikpapan, the air attacks of February, Badung Strait, the Battle of the
// Java Sea hour by hour, the loss of Houston and Perth in the Sunda Strait, the end of Exeter in
// the Second Battle of the Java Sea, and the invasion and surrender of Java.
// Checked against the English Wikipedia articles "Battle of the Java Sea", "Battle of Sunda
// Strait", "Second Battle of the Java Sea", "Battle of Badung Strait", "Battle of Balikpapan
// (1942)", "Battle of Java (1942)", "Karel Doorman", "American-British-Dutch-Australian Command",
// "USS Houston (CA-30)", "HMAS Perth (D29)", "HMS Exeter (68)" and "HNLMS De Ruyter (1935)"
// (October 2026).
//
// Times are local times as the sources give them (shown as Java time). The accounts disagree by
// up to half an hour on several moments of 27 February, notably the hit on Exeter (16:38–17:08);
// those events are marked approximate. Times for Balikpapan and Badung Strait are used only to
// order events within the day. Event schema: see data/timelines/attack-on-hawaii.js.

(function () {
  const P = {
    singapore: { name: 'Singapore', lat: 1.29, lng: 103.85 },
    lembang: { name: 'ABDA headquarters, Lembang, Java', lat: -6.81, lng: 107.62 },
    bandung: { name: 'Bandung, Java', lat: -6.91, lng: 107.61 },
    tarakan: { name: 'Tarakan, Borneo', lat: 3.3, lng: 117.6 },
    balikpapan: { name: 'Off Balikpapan, Borneo', lat: -1.246, lng: 116.822 },
    makassar: { name: 'Makassar Strait, off Balikpapan (approx.)', lat: -1.0, lng: 117.4 },
    kangean: { name: 'Flores Sea, off the Kangean Islands (approx.)', lat: -7.1, lng: 115.6 },
    oosthaven: { name: 'Oosthaven (Bandar Lampung), Sumatra', lat: -5.45, lng: 105.26 },
    bangka: { name: 'Off Bangka Island (approx.)', lat: -2.4, lng: 107.0 },
    timorSea: { name: 'Timor Sea, between Darwin and Timor (approx.)', lat: -11.5, lng: 127.5 },
    darwin: { name: 'Darwin, Northern Territory, Australia', lat: -12.46, lng: 130.84 },
    bali: { name: 'Southern Bali (approx.)', lat: -8.68, lng: 115.25 },
    badung: { name: 'Badung Strait, off Bali', lat: -8.631, lng: 115.388 },
    surabaya: { name: 'Surabaya naval base, Java', lat: -7.2, lng: 112.73 },
    madura: { name: 'Java Sea, north of Madura (approx.)', lat: -6.4, lng: 113.2 },
    approach: { name: 'Java Sea, north of Surabaya (approx.)', lat: -6.6, lng: 112.7 },
    battle: { name: 'Java Sea, the afternoon battle (approx.)', lat: -6.3, lng: 112.4 },
    jupiter: { name: 'Off the north coast of Java, near Tuban (approx.)', lat: -6.75, lng: 112.1 },
    deRuyter: { name: 'Where De Ruyter sank', lat: -5.982, lng: 112.066 },
    javaWreck: { name: 'Where the cruiser Java sank (approx.)', lat: -5.95, lng: 112.1 },
    priok: { name: 'Tanjung Priok, port of Batavia', lat: -6.1, lng: 106.88 },
    stNicholas: { name: 'Off St Nicholas Point, Bantam Bay', lat: -5.87, lng: 106.05 },
    bantam: { name: 'Bantam Bay, northwest Java', lat: -5.95, lng: 106.15 },
    perth: { name: 'Where HMAS Perth sank', lat: -5.862, lng: 106.131 },
    houston: { name: 'Where USS Houston sank', lat: -5.813, lng: 106.132 },
    evertsen: { name: 'Sunda Strait, off the Sumatran coast (approx.)', lat: -5.9, lng: 105.55 },
    merak: { name: 'Merak, northwest Java', lat: -5.93, lng: 106.0 },
    kragan: { name: 'Kragan, north coast of central Java', lat: -6.67, lng: 111.63 },
    kalidjati: { name: 'Kalidjati airfield, Java', lat: -6.53, lng: 107.66 },
    exeter: { name: 'About 90 miles northwest of Bawean (approx.)', lat: -4.75, lng: 111.6 },
    pope: { name: 'North of Bawean, east of Exeter’s last position (approx.)', lat: -4.6, lng: 111.95 },
    baliStrait: { name: 'Bali Strait', lat: -8.3, lng: 114.42 },
    southJava: { name: 'Indian Ocean, south of Java (approx.)', lat: -9.8, lng: 110.0 },
    tjilatjap: { name: 'Tjilatjap (Cilacap), south coast of Java', lat: -7.73, lng: 109.0 },
    fremantle: { name: 'Fremantle, Western Australia', lat: -32.05, lng: 115.75 },
    houstonTx: { name: 'Houston, Texas', lat: 29.76, lng: -95.37 },
  };

  const ev = (date, title, type, location, zoom, summary, extra = {}) => ({
    id: extra.id || `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}`,
    date, title, type, location, zoom, summary,
    theater: extra.theater || 'Asia',
    ...extra,
  });
  const at = (time, extra = {}) => ({ time, tz: 'JAVA', ...extra });
  const ord = (sortTime) => ({ sortTime, tz: 'JAVA' }); // order within the day only; no time shown

  WW2.events['java-sea'] = [
    // ---------- ABDA ----------
    ev('1942-01-07', 'Wavell arrives to lead ABDA', 'political', P.singapore, 9,
      'General Sir Archibald Wavell reaches Singapore as supreme commander of the new American-British-Dutch-Australian Command, ABDACOM, agreed at the Arcadia Conference. His task is to hold the “Malay Barrier” from Malaya through the Dutch East Indies with forces from four nations that use different equipment, have never trained together and answer to governments with different priorities.',
      { facts: [['Supreme commander', 'Gen. Sir Archibald Wavell'], ['Naval forces (ABDAFLOAT)', 'Adm. Thomas C. Hart, U.S. Navy'], ['Land forces', 'Lt Gen. Hein ter Poorten, KNIL']] }),
    ev('1942-01-18', 'ABDA headquarters moves to Java', 'movement', P.lembang, 10,
      'Wavell moves his headquarters from Singapore to Lembang, near Bandung in the hills of western Java. The air headquarters later moves into Bandung itself, which makes cooperation between the air and naval forces harder.'),

    // ---------- Balikpapan ----------
    ev('1942-01-21', 'The Balikpapan invasion fleet sails', 'movement', P.tarakan, 8,
      'Having taken Tarakan, the Japanese send an invasion fleet of a light cruiser, ten destroyers and sixteen transports south toward the oil port of Balikpapan, whose refineries and wells the Dutch have already wrecked. The same day the American cruiser Boise tears her hull on an uncharted reef, and she and the slow Marblehead drop out of the striking force sent to meet the convoy.',
      { ...ord('17:00'), paths: [{ label: 'Invasion fleet to Balikpapan (approximate)', kind: 'route', coords: [[3.3, 117.6], [1.5, 118.3], [-1.0, 117.4], [-1.246, 116.822]] }] }),
    ev('1942-01-23', 'Dutch bombers sink a transport', 'attack', P.makassar, 8,
      'A PBY Catalina finds the convoy at midday. That afternoon waves of Dutch Martin B-10 bombers with Buffalo escorts attack through bad weather; the third wave sinks the transport Nana Maru and damages Tatsugami Maru. In the evening the first Japanese troops begin to land behind the Dutch lines.',
      ord('16:25')),
    ev('1942-01-24', 'K XVIII torpedoes a troopship', 'attack', P.balikpapan, 10,
      'The Dutch submarine K XVIII attacks the anchorage. Her first torpedoes miss the cruiser Naka, but another sinks the transport Tsuruga Maru with 39 soldiers aboard. Naka and the destroyers leave the transports to hunt the submarine, opening the way for the Americans.',
      ord('00:40')),
    ev('1942-01-24', 'Four destroyers raid the Balikpapan anchorage', 'attack', P.balikpapan, 11,
      'Four old American destroyers under Commander Paul Talbot, John D. Ford, Pope, Parrott and Paul Jones, pass Naka’s destroyers, which take them for friendly ships, and find the transports silhouetted against the burning oil installations. In about forty minutes of torpedo and gun attacks they sink Sumanoura Maru, Tatsugami Maru and Kuretake Maru and badly damage a patrol boat, then escape. Faulty Mark 15 torpedoes and high-speed attacks mean only seven of 48 torpedoes hit.',
      { ...ord('03:00'), facts: [['Torpedoes fired', '48, seven hits'], ['Sunk that night', 'Three transports (four, counting the submarine’s victim)'], ['American damage', 'One shell hit on John D. Ford, four wounded']] }),
    ev('1942-01-25', 'Balikpapan falls', 'invasion', P.balikpapan, 10,
      'Japanese troops enter Balikpapan unopposed and link up after dark. The raid has cost them ships and men but has not slowed the invasion. Of 1,100 Dutch defenders who retreat inland, only about 200 reach the airfield at Samarinda II.',
      ord('04:00')),

    // ---------- February ----------
    ev('1942-02-04', 'Bombers turn back the Striking Force', 'attack', P.kangean, 8,
      'Rear-Admiral Karel Doorman takes the ABDA Striking Force north to stop the invasion of Makassar. With no air cover, it is caught off the Kangean Islands by more than fifty Japanese bombers. A bomb knocks out Houston’s after turret, killing about four dozen men, and Marblehead is damaged so badly she has to leave the theatre. Doorman calls off the operation.',
      { facts: [['Also called', 'Battle of Makassar Strait, or of the Flores Sea'], ['Houston', 'No. 3 turret disabled; six of nine 8-inch guns left']] }),
    ev('1942-02-12', 'Helfrich takes command at sea', 'political', P.lembang, 10,
      'Admiral Hart gives up command of the ABDA naval forces and the Dutch Vice Admiral Conrad Helfrich replaces him, determined to fight for Java.'),
    ev('1942-02-14', 'The Striking Force sails for Palembang', 'movement', P.oosthaven, 8,
      'Japanese convoys are reported heading for Palembang and its oil refineries in Sumatra. Doorman leads Exeter, four light cruisers and nine destroyers out of Oosthaven and through the Gaspar Strait, where the Dutch destroyer Van Ghent runs onto a rock in poor visibility and has to be abandoned.',
      { paths: [{ label: 'Striking Force toward Bangka (approximate)', kind: 'route', coords: [[-5.45, 105.26], [-4.0, 106.6], [-2.9, 107.2], [-2.4, 107.0]] }] }),
    ev('1942-02-15', 'Air attacks off Bangka', 'attack', P.bangka, 8,
      'Found by Japanese aircraft in the morning, the force is bombed in waves by carrier planes from Ryūjō and land-based bombers. Near misses damage Exeter’s floatplane but no ship is seriously hit. Convinced that he cannot go on under Japanese air supremacy, Doorman reverses course for Tanjung Priok shortly before 13:00. The attacks go on until dark. The same day Singapore surrenders.',
      { approx: true, ...ord('10:30') }),
    ev('1942-02-16', 'Houston shields the Timor convoy', 'attack', P.timorSea, 7,
      'Houston is escorting troop reinforcements from Darwin to Koepang on Timor when the convoy is attacked by bombers and flying boats. Her anti-aircraft fire, using good ammunition taken over from Boise, shoots down seven of the 44 planes in the second wave. Fearing carriers and an imminent invasion of Timor, ABDA orders the convoy back to Darwin.',
      { wiki: { Darwin: 'Darwin,_Northern_Territory' },
        link: { timeline: 'medal-of-honor', event: '1942-02-04-rooks-albert-h', label: 'Captain Albert H. Rooks in the Medal of Honor timeline' } }),
    ev('1942-02-18', 'Japanese troops land on Bali', 'invasion', P.bali, 9,
      'A battalion of the Japanese 48th Division lands on Bali, taking the airfield near Denpasar intact. From there Japanese aircraft can reach the naval base at Surabaya. Doorman has to strike at once with whatever ships are within reach, in separate waves.'),
    ev('1942-02-19', 'Darwin is bombed', 'attack', P.darwin, 9,
      'Japanese carrier and land-based aircraft devastate Darwin, sinking ships that had sailed with Houston’s convoy. The port can no longer support the fight for the East Indies. Houston, already on her way back to Java, escapes the raid.'),
    ev('1942-02-19', 'Badung Strait: Piet Hein is sunk', 'loss', P.badung, 10,
      'Doorman’s first wave, De Ruyter and the cruiser Java with three destroyers, enters Badung Strait at night. The cruisers exchange fire with the Japanese destroyers Asashio and Ōshio and steam on, but the destroyers following behind are caught. Piet Hein is crippled by gunfire and torpedoed, and the two American destroyers are driven off. In the darkness the two Japanese destroyers briefly fire on each other.',
      ord('23:00')),
    ev('1942-02-20', 'Badung Strait: the second wave', 'attack', P.badung, 10,
      'The Dutch cruiser Tromp and four American destroyers attack next. Their torpedoes miss; Tromp is hit several times and badly damaged, Stewart is damaged, and Michishio is crippled on the way out. Four Japanese destroyers have beaten off a much larger force and protected their transports. Bali is lost.',
      { ...ord('01:09'), facts: [['Allied losses', 'Piet Hein sunk; Tromp and Stewart damaged'], ['Japanese losses', 'Michishio crippled, Ōshio damaged']] }),
    ev('1942-02-25', 'Wavell hands over and ABDA dissolves', 'political', P.lembang, 10,
      'With Singapore gone and the Malay Barrier broken, Wavell resigns as supreme commander and returns to India, leaving the defence of the East Indies to the local commanders. The same day Helfrich orders every available warship to join Doorman’s Eastern Striking Force at Surabaya; Exeter, Perth and three British destroyers sail at once.'),
    ev('1942-02-26', 'Doorman sweeps the Java Sea', 'movement', P.madura, 8,
      'With Exeter and Perth arrived, Doorman’s whole force of five cruisers and nine destroyers leaves Surabaya in the evening to find the eastern invasion convoy reported that morning. The Japanese are further north than expected and the night search finds nothing.',
      { ...at('18:30'), facts: [['Heavy cruisers', 'HMS Exeter, USS Houston'], ['Light cruisers', 'HNLMS De Ruyter (flag), HNLMS Java, HMAS Perth'], ['Destroyers', 'Electra, Encounter, Jupiter (RN); Kortenaer, Witte de With (RNN); Alden, John D. Edwards, John D. Ford, Paul Jones (USN)']] }),

    // ---------- 27 February ----------
    ev('1942-02-27', 'Shadowed, the Allied force turns for port', 'intelligence', P.approach, 8,
      'Japanese scout planes find Doorman’s ships and track them all morning. Doorman orders a return to Surabaya at 10:30. In the afternoon bombers of the Kanoya Air Group attack and miss.',
      at('09:35')),
    ev('1942-02-27', 'Doorman turns back to fight', 'movement', P.approach, 9,
      'As his leading ships are entering harbour, Doorman receives reports of enemy ships about 90 miles to the north and turns his force around to attack. The Japanese commander, Rear Admiral Takeo Takagi, sends the convoy’s two destroyer flotillas, led by the light cruisers Jintsū and Naka, to join his heavy cruisers Nachi and Haguro. Communication across Doorman’s four navies is poor and only Exeter has radar.',
      { approx: true, ...ord('15:00'), facts: [['Japanese', 'Heavy cruisers Nachi, Haguro; light cruisers Jintsū, Naka; 14 destroyers'], ['Japanese commander', 'Rear Admiral Takeo Takagi']] }),
    ev('1942-02-27', 'The battle opens at long range', 'attack', P.battle, 9,
      'The lookouts sight each other at long range. Takagi’s heavy cruisers open fire first; Electra fires the first Allied shots at Jintsū at about 16:00. For an hour neither side hits much. Haguro puts a dud through De Ruyter and Nachi hits Houston twice, while the Japanese flotillas fire dozens of Long Lance torpedoes at extreme range, all of which miss or explode early.',
      at('15:47', { approx: true })),
    ev('1942-02-27', 'Haguro cripples Exeter', 'attack', P.battle, 10,
      'A shell from Haguro bursts in one of Exeter’s boiler rooms, putting six of her eight boilers out of action. She slows and swings out of line, and the cruisers behind her, thinking they have missed an order, turn after her, leaving De Ruyter heading toward the enemy alone. The Allied line falls into confusion. (Sources give the time as anywhere from 16:38 to 17:08.)',
      at('17:00', { approx: true })),
    ev('1942-02-27', 'Kortenaer is torpedoed', 'loss', P.battle, 10,
      'One of Haguro’s torpedoes, fired from about 22,000 yards, strikes the Dutch destroyer Kortenaer. She breaks in two and sinks within moments. It is the only Japanese torpedo hit of the afternoon and perhaps the longest-range torpedo hit in naval history. Doorman signals the scattered ships to follow him.',
      at('17:15', { approx: true, facts: [['Killed', '66'], ['Rescued later', '113 survivors, by HMS Encounter']] })),
    ev('1942-02-27', 'Electra is sunk', 'loss', P.battle, 10,
      'Three British destroyers turn back through the smoke to cover the crippled Exeter. Electra fights the destroyer Asagumo at close range and leaves her dead in the water, but is herself wrecked by Asagumo and Minegumo and goes down.',
      at('17:46')),
    ev('1942-02-27', 'The American destroyers attack', 'attack', P.battle, 10,
      'The four American destroyers charge out of the smoke and fire their torpedoes at Nachi and Haguro, all of which miss. As darkness falls Takagi breaks contact, wary of the minefields off Surabaya. Exeter, escorted by Witte de With, limps back toward port.',
      at('18:10')),
    ev('1942-02-27', 'Out of torpedoes, the U.S. destroyers leave', 'movement', P.jupiter, 9,
      'After nightfall Doorman turns back toward the convoy, but the four American destroyers are low on fuel and have used all their torpedoes. They head for Surabaya.',
      at('21:15', { approx: true })),
    ev('1942-02-27', 'Jupiter hits a mine', 'loss', P.jupiter, 10,
      'Running west close along the coast of Java, the destroyer Jupiter blows up and sinks, probably on a mine laid by the Dutch minelayer Gouden Leeuw. 84 of her men are lost.',
      at('21:25', { approx: true })),
    ev('1942-02-27', 'Encounter picks up Kortenaer’s survivors', 'movement', P.battle, 9,
      'Heading north again, the cruisers pass men in the water: 113 survivors of Kortenaer. Encounter, the last destroyer with the force, is ordered to rescue them and take them to Surabaya. Doorman continues with four cruisers and no escort, still tracked by a Japanese floatplane.',
      at('22:00', { approx: true })),
    ev('1942-02-27', 'The cruiser Java is blown apart', 'loss', P.javaWreck, 10,
      'Nachi and Haguro, low on shells, close in the dark and fire twelve torpedoes. A torpedo from Nachi hits the cruiser Java, last in line, and sets off a magazine; the explosion blows away a hundred feet of her stern and she sinks in about fifteen minutes. Only 19 of her crew survive.',
      at('23:32')),
    ev('1942-02-27', 'De Ruyter is torpedoed', 'loss', P.deRuyter, 10,
      'Minutes later a torpedo from Haguro hits the flagship De Ruyter, cutting all power and starting a great fire. Before she sinks, Doorman orders Houston and Perth to withdraw to Tanjung Priok. The Japanese cheer from their decks and turn back to the convoy.',
      at('23:36', { approx: true })),

    // ---------- 28 February ----------
    ev('1942-02-28', 'De Ruyter sinks with Doorman', 'loss', P.deRuyter, 10,
      'Fire and flooding overwhelm De Ruyter over two to three hours. Doorman and her captain, Eugène Lacomblé, stay aboard and go down with the ship; 344 of her crew die. The Allied Striking Force has been destroyed and the eastern invasion convoy has lost only a day.',
      { approx: true, ...ord('02:00'), facts: [['Allied ships sunk, 27–28 Feb.', 'De Ruyter, Java, Kortenaer, Electra, Jupiter'], ['Japanese ships sunk', 'None']],
        link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1942-02-27-battle-of-the-java-sea', label: 'See this in From Pearl Harbor to Guadalcanal' } }),
    ev('1942-02-28', 'Houston and Perth reach Tanjung Priok', 'movement', P.priok, 11,
      'The two surviving cruisers reach Batavia’s port at midday. There is too little oil to fill their tanks and no ammunition to replace what they fired; Perth has 160 six-inch shells left.',
      at('13:30')),
    ev('1942-02-28', 'Houston and Perth sail for the Sunda Strait', 'movement', P.priok, 9,
      'Ordered to Tjilatjap on Java’s south coast, the cruisers sail at dusk under Perth’s Captain Hector Waller, expecting to meet nothing worse than Australian corvettes. The Dutch destroyer Evertsen, waiting for orders, follows some two hours behind. Unknown to them, the Japanese western invasion force is gathering in Bantam Bay.',
      { ...at('19:00'), paths: [{ label: 'Houston and Perth toward the Sunda Strait', kind: 'route', coords: [[-6.1, 106.88], [-5.95, 106.5], [-5.87, 106.05]] }] }),
    ev('1942-02-28', 'Exeter leaves Surabaya for Ceylon', 'movement', P.surabaya, 9,
      'After emergency repairs, Exeter sails at dusk with Encounter and the American destroyer Pope, hoping to escape west through the Sunda Strait. Her draught forces her to use the main northern channel into the Java Sea. Witte de With cannot sail because of mechanical trouble.'),
    ev('1942-02-28', 'The U.S. destroyers slip out through the Bali Strait', 'movement', P.baliStrait, 9,
      'The four American destroyers of the Java Sea battle leave Surabaya by its shallow eastern channel and head south through the Bali Strait. After a brief exchange of fire with Japanese destroyers they get clear; they will be the only Allied ships of the battle to survive the campaign.',
      { ...ord('21:00'), paths: [{ label: 'DesDiv 58 to Australia (approximate)', kind: 'route', coords: [[-7.2, 112.73], [-7.6, 114.2], [-8.3, 114.42], [-9.5, 114.6], [-20, 113], [-32.05, 115.75]] }] }),
    ev('1942-02-28', 'Perth sights a destroyer off St Nicholas Point', 'intelligence', P.stNicholas, 11,
      'Halfway across the mouth of Bantam Bay, Perth sights a ship ahead and challenges it, expecting a corvette. The reply is unintelligible; the ship is a Japanese destroyer, which turns away under smoke. Waller opens fire, and within minutes destroyers, the cruiser Natori and the heavy cruisers Mogami and Mikuma are closing from every side.',
      at('23:06')),
    ev('1942-02-28', 'Surrounded in Bantam Bay', 'attack', P.bantam, 11,
      'For an hour Houston and Perth fight off torpedo attacks from all directions. Perth hits the bridge of Shirayuki and Harukaze is hit at least three times. Dozens of torpedoes miss, and Houston’s crew carry shells by hand from the wrecked after turret to the forward guns as ammunition runs out.',
      at('23:40', { approx: true })),

    // ---------- 1 March ----------
    ev('1942-03-01', 'Mogami’s torpedoes hit the Japanese transports', 'loss', P.bantam, 11,
      'Torpedoes from Mogami that miss the Allied cruisers run on into the anchorage, sinking a minesweeper and several transports. One carries the Sixteenth Army’s commander, Lieutenant General Hitoshi Imamura, who has to jump into the sea and is rescued. Friendly fire does the Japanese more damage than the Allied guns.',
      at('00:05')),
    ev('1942-03-01', 'HMAS Perth sinks', 'loss', P.perth, 11,
      'Waller tries to force a way through to the strait. Four torpedoes hit Perth within minutes, probably from Harukaze, Shirakumo and Murakumo, and she capsizes and sinks under close-range fire. Waller is among 353 killed; most survivors become prisoners, and about a third of them die in captivity.',
      at('00:25', { facts: [['Killed', '353, including Captain Hector Waller'], ['Survivors', '328, nearly all taken prisoner']] })),
    ev('1942-03-01', 'USS Houston goes down', 'loss', P.houston, 11,
      'Fighting on alone, Houston is struck by several torpedoes and many shells. Captain Albert H. Rooks is killed by a bursting shell; soon afterwards Japanese destroyers close in and the ship rolls over and sinks. Of 1,061 aboard, 368 survive, to be put to work on the Burma Railway. Rooks receives the Medal of Honor and Chaplain George S. Rentz, who gave his lifejacket to a young sailor, the Navy Cross.',
      at('00:45', { approx: true, facts: [['Killed', '696'], ['Survivors', '368, of whom 77 die in captivity']],
        link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1942-03-01-houston-and-perth-lost-in-the-sunda-stra', label: 'See this in From Pearl Harbor to Guadalcanal' } })),
    ev('1942-03-01', 'Evertsen is run aground', 'loss', P.evertsen, 10,
      'Following too late to join the cruisers, Evertsen sees the gunfire and steers along the Sumatran coast to slip through the strait. Murakumo and Shirakumo catch her with searchlights and set her on fire. Her captain runs her onto a reef and the crew get ashore before her after magazine explodes.',
      { approx: true, ...ord('01:00') }),
    ev('1942-03-01', 'The Japanese land in western Java', 'invasion', P.merak, 10,
      'The Japanese 2nd Division begins landing at Merak, at the northwest tip of Java, while another force lands further east at Eretan Wetan and seizes Kalidjati airfield the same day. Japanese fighter and ground-attack aircraft move onto the field the next day. The Sixteenth Army puts 23,500 men ashore in the west against some 27,000 Dutch and Allied troops.',
      at('01:30')),
    ev('1942-03-01', 'The eastern landings at Kragan', 'invasion', P.kragan, 10,
      'The convoy that Doorman tried to stop lands the 48th Division at Kragan on Java’s north coast. A Dutch cavalry squadron resists briefly. Columns head for Rembang, the oilfield at Cepu and Blora.',
      at('03:45')),
    ev('1942-03-01', 'Exeter is trapped', 'intelligence', P.exeter, 9,
      'Exeter, Encounter and Pope have spent the early morning dodging Japanese ships northwest of Bawean. At 09:35 Nachi and Haguro appear from the south, then Ashigara and Myōkō with more destroyers from the northwest. The cruisers open fire at 10:20 as the Allied ships run east under smoke.',
      at('09:35', { facts: [['Japanese', 'Heavy cruisers Nachi, Haguro, Ashigara, Myōkō; destroyers Kawakaze, Yamakaze, Inazuma, Akebono']] })),
    ev('1942-03-01', 'Exeter is sunk', 'loss', P.exeter, 10,
      'A shell bursts in Exeter’s forward boiler room and she loses all power. Captain Oliver Gordon orders her scuttled, and the destroyer Inazuma puts two torpedoes into her. She capsizes and sinks, the ship that had fought Admiral Graf Spee at the River Plate.',
      at('11:40', { facts: [['Crippling hit', 'About 11:20'], ['Rescued by the Japanese', '652 of her crew, including Captain Gordon']] })),
    ev('1942-03-01', 'Encounter is scuttled', 'loss', P.exeter, 10,
      'Encounter has turned back to lay smoke over Exeter instead of escaping. Shell hits wreck her steering and set her on fire, and her captain, Lieutenant Commander Eric Morgan, orders her scuttled.',
      at('12:10', { approx: true })),
    ev('1942-03-01', 'Pope is sunk from the air', 'loss', P.pope, 9,
      'Pope reaches a rain squall and gets away, but aircraft from the carrier Ryūjō find her soon after noon. Crippled by bombs, she is sunk. Just over 800 men of the three ships are picked up by the Japanese; 190 of them later die as prisoners.',
      at('13:50', { approx: true })),
    ev('1942-03-01', 'Helfrich dissolves the Allied naval forces', 'political', P.bandung, 8,
      'With the Striking Force gone, Helfrich releases the American ships to make for Exmouth Gulf in Australia and the British ships to make for India. Damaged Dutch submarines are sent to Ceylon; the rest are to fight on, break out or be scuttled. Ships escaping south of Java are now hunted by Japanese carriers, battleships and cruisers.',
      ord('18:00')),

    // ---------- The last days ----------
    ev('1942-03-02', 'Dutch ships are scuttled at Surabaya', 'loss', P.surabaya, 10,
      'Witte de With, unable to leave, is bombed and sunk at Surabaya. Over the next week some 50 Dutch ships that cannot escape are scuttled there to keep them from the Japanese, and the naval air base and airfield are destroyed. The Royal Netherlands Navy in Asia is reduced to a few submarines and small ships.'),
    ev('1942-03-02', 'Cruisers hunt the ships fleeing south of Java', 'loss', P.southJava, 6,
      'A Japanese squadron of the heavy cruisers Takao, Atago and Maya with the destroyers Nowaki and Arashi sweeps the waters south of Java for escaping ships. On 2 March they sink the destroyers USS Pillsbury, with all hands, and HMS Stronghold; on 3 March the gunboat USS Asheville, with one survivor.',
      { approx: true }),
    ev('1942-03-04', 'Yarra’s convoy is destroyed', 'loss', P.southJava, 6,
      'The same squadron catches a small convoy bound for Australia. The Australian sloop HMAS Yarra, its escort, is sunk with a tanker, a depot ship and two minesweepers, and two freighters are captured. The squadron claims 16 ships sunk or taken in four days.'),
    ev('1942-03-04', 'The four destroyers reach Fremantle', 'movement', P.fremantle, 9,
      'John D. Edwards, John D. Ford, Alden and Paul Jones arrive safely in Fremantle, the only Allied warships of the Battle of the Java Sea to survive.',
      { link: { timeline: 'pacific-submarines', event: '1942-03-01-asiatic-fleet-submarines-withdraw-to-aus', label: 'The Asiatic Fleet’s submarines also withdraw to Australia' } }),
    ev('1942-03-08', 'Tjilatjap and Surabaya fall', 'invasion', P.tjilatjap, 9,
      'Japanese columns that crossed the Solo and Brantas rivers and entered Yogyakarta on 5 March reach the south-coast port of Tjilatjap and the naval base at Surabaya. The same day the Japanese send the Dutch their surrender terms.'),
    ev('1942-03-09', 'The KNIL announces the end of resistance', 'political', P.bandung, 10,
      'Major General Jacob Pesman, deputy to the Dutch commander Hein ter Poorten, broadcasts that the Japanese have broken through to the Bandung plateau and resistance can no longer continue. The Japanese demand overall surrender and disarmament, and their troops enter Bandung.'),
    ev('1942-03-12', 'The Allies surrender Java', 'political', P.bandung, 10,
      'Allied commanders sign the formal surrender at Japanese headquarters in Bandung, and some 8,000 British and Australian troops surrender in the mountains to the east. More than 82,000 Allied servicemen become prisoners. Japan holds Java and, with the Dutch East Indies, one of the largest oil-producing regions in the world.',
      { facts: [['Prisoners', '82,618: 66,219 Dutch East Indies, 10,626 British, 4,890 Australian, 883 American']],
        link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1942-03-12-the-allies-surrender-java', label: 'See this in From Pearl Harbor to Guadalcanal' } }),

    // ---------- Afterwards ----------
    ev('1942-05-30', 'The Houston Volunteers', 'home-front', P.houstonTx, 11,
      'Houston’s fate is still unknown in the United States. In downtown Houston, a thousand new Navy recruits, the Houston Volunteers, are sworn in to replace her crew. In October a new light cruiser under construction is renamed Houston. The full story of her last fight emerges only when her survivors are freed in 1945.',
      { theater: 'Pacific', wiki: { Houston: null } }),
    ev('1942-06-05', 'Doorman receives the Military William Order', 'service',
      P.deRuyter, 8,
      'Karel Doorman is posthumously made a Knight 3rd class of the Military William Order. He is remembered for the signal usually rendered “I am attacking, follow me”, though it was a looser version of an order to his scattered ships to follow him. Four Dutch warships will later bear his name.'),
  ];

  // ---------- Shot list ----------
  // Camera direction for the battle (see "Shots" in app.js). Events not listed use the
  // automatic framing.
  const pt = (place) => [place.lat, place.lng];
  const SHOTS = {
    // The barrier: Borneo to Java in one frame for the January–February moves.
    'Four destroyers raid the Balikpapan anchorage': { shot: 'tight', transition: 'fly' },
    'Houston shields the Timor convoy': { frame: [pt(P.darwin)] },

    // 26–27 February: the approach, the afternoon battle, then the night.
    'Doorman sweeps the Java Sea': { shot: 'wide', transition: 'pull-back', frame: [pt(P.surabaya), pt(P.battle)] },
    'Shadowed, the Allied force turns for port': { scene: 'approach', frame: [pt(P.surabaya)] },
    'Doorman turns back to fight': { scene: 'approach' },
    'The battle opens at long range': { scene: 'afternoon', transition: 'fly' },
    'Haguro cripples Exeter': { scene: 'afternoon' },
    'Kortenaer is torpedoed': { scene: 'afternoon' },
    'Electra is sunk': { scene: 'afternoon' },
    'The American destroyers attack': { scene: 'afternoon' },
    'Out of torpedoes, the U.S. destroyers leave': { scene: 'night', frame: [pt(P.battle), pt(P.deRuyter)] },
    'Jupiter hits a mine': { scene: 'night' },
    'Encounter picks up Kortenaer’s survivors': { scene: 'night' },
    'The cruiser Java is blown apart': { shot: 'tight', transition: 'fly' },
    'De Ruyter is torpedoed': { shot: 'tight' },

    // 28 February – 1 March: Sunda Strait.
    'Houston and Perth sail for the Sunda Strait': { shot: 'wide', transition: 'pull-back', frame: [pt(P.bantam)] },
    'Perth sights a destroyer off St Nicholas Point': { scene: 'sunda', transition: 'fly' },
    'Surrounded in Bantam Bay': { scene: 'sunda' },
    'Mogami’s torpedoes hit the Japanese transports': { scene: 'sunda' },
    'HMAS Perth sinks': { scene: 'sunda' },
    'USS Houston goes down': { scene: 'sunda' },

    // 1 March: Exeter's last fight.
    'Exeter is trapped': { scene: 'exeter', transition: 'fly' },
    'Exeter is sunk': { scene: 'exeter' },
    'Encounter is scuttled': { scene: 'exeter' },
    'Pope is sunk from the air': { scene: 'exeter' },
  };
  const events = WW2.events['java-sea'];
  for (const [title, shot] of Object.entries(SHOTS)) {
    const e = events.find((x) => x.title === title);
    if (!e) throw new Error(`java-sea shot list: no event titled "${title}"`);
    Object.assign(e, shot);
  }
})();
