// Timeline: The Battle of Leyte Gulf (War in the Pacific).
// The American return to the Philippines and the largest naval battle of the war: the Leyte
// landings of 20 October 1944, the Japanese Shō-Gō plan, the submarine ambush in the Palawan
// Passage, the Sibuyan Sea, Halsey's run north, Surigao Strait, the Battle off Samar, Cape
// Engaño, the first kamikaze attacks, and the end of the campaign on Leyte in December 1944.
// Checked against the English Wikipedia articles "Battle of Leyte Gulf" (which now holds the
// Sibuyan Sea, Surigao Strait and Cape Engaño accounts), "Battle of Leyte", "Battle off Samar",
// "Japanese battleship Musashi", "USS Princeton (CVL-23)", "Takeo Kurita", "William Halsey Jr.",
// "Thomas C. Kinkaid", "Kamikaze", "USS Darter (SS-227)", "USS Dace (SS-247)", "USS St. Lo",
// "USS Johnston (DD-557)", "USS Gambier Bay", "Japanese battleship Yamashiro",
// "Japanese battleship Fusō", "Japanese aircraft carrier Zuikaku" and "HMAS Australia (D84)"
// (October 2026).
//
// Times are local battle-area times as the sources give them (shown as Philippine time). The
// accounts sometimes differ by several minutes (for example on when Kurita broke off off Samar);
// where they do, the "Battle of Leyte Gulf" and ship articles are followed and the time marked
// approximate. Event schema: see data/timelines/attack-on-hawaii.js.

(function () {
  const P = {
    pearl: { name: 'Pearl Harbor, Oahu', lat: 21.35, lng: -157.95 },
    formosa: { name: 'Formosa (Taiwan)', lat: 23.7, lng: 121.0 },
    suluan: { name: 'Suluan Island, mouth of Leyte Gulf', lat: 10.756, lng: 125.959 },
    redBeach: { name: 'Red Beach, Palo, Leyte', lat: 11.172, lng: 125.012 },
    dulag: { name: 'Dulag, Leyte', lat: 10.95, lng: 125.03 },
    tacloban: { name: 'Tacloban, Leyte', lat: 11.24, lng: 125.0 },
    leyteGulf: { name: 'Leyte Gulf', lat: 10.9, lng: 125.3 },
    mabalacat: { name: 'Mabalacat airfield, Luzon', lat: 15.22, lng: 120.57 },
    brunei: { name: 'Brunei Bay, Borneo', lat: 5.1, lng: 115.1 },
    ulithi: { name: 'Ulithi Atoll', lat: 10.0, lng: 139.7 },
    palawan: { name: 'Palawan Passage, off Palawan (approx.)', lat: 9.6, lng: 117.4 },
    bombayShoal: { name: 'Bombay Shoal, Palawan Passage', lat: 9.456, lng: 116.933 },
    tg383: { name: 'Task Group 38.3, east of Luzon', lat: 15.35, lng: 123.517 },
    sibuyan: { name: 'Sibuyan Sea, where Musashi sank', lat: 13.117, lng: 122.533 },
    sanBernardino: { name: 'San Bernardino Strait', lat: 12.55, lng: 124.25 },
    newJersey: { name: 'Third Fleet, east of Luzon (approx.)', lat: 16.5, lng: 125.5 },
    bohol: { name: 'Mindanao Sea, off Bohol (approx.)', lat: 9.6, lng: 124.6 },
    surigaoSouth: { name: 'Surigao Strait, southern approaches (approx.)', lat: 10.05, lng: 125.35 },
    surigao: { name: 'Surigao Strait', lat: 10.167, lng: 125.383 },
    battleLine: { name: 'Oldendorf’s battle line, north end of Surigao Strait (approx.)', lat: 10.5, lng: 125.4 },
    taffy1: { name: 'Taffy 1, east of Mindanao (approx.)', lat: 9.7, lng: 126.3 },
    taffy3: { name: 'Taffy 3, east of Samar (approx.)', lat: 11.8, lng: 126.0 },
    johnston: { name: 'Where USS Johnston sank, off Samar', lat: 11.77, lng: 126.15 },
    gambierBay: { name: 'Where USS Gambier Bay sank, off Samar', lat: 11.517, lng: 126.2 },
    stLo: { name: 'Where USS St. Lo sank, off Samar', lat: 11.02, lng: 126.04 },
    northernForce: { name: 'Ozawa’s Northern Force, off Cape Engaño (approx.)', lat: 19.0, lng: 126.0 },
    zuikaku: { name: 'Where Zuikaku sank, off Cape Engaño', lat: 19.333, lng: 125.85 },
    ormoc: { name: 'Ormoc, Leyte', lat: 11.0, lng: 124.61 },
    palompon: { name: 'Palompon, Leyte', lat: 11.05, lng: 124.39 },
  };

  const ev = (date, title, type, location, zoom, summary, extra = {}) => ({
    id: extra.id || `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}`,
    date, title, type, location, zoom, summary,
    theater: extra.theater || 'Pacific',
    ...extra,
  });
  const at = (time, extra = {}) => ({ time, tz: 'PHT', ...extra });
  const ord = (sortTime) => ({ sortTime, tz: 'PHT' }); // order within the day only; no time shown

  WW2.events['leyte-gulf'] = [
    // ---------- Background ----------
    ev('1944-07-27', 'Roosevelt, MacArthur and Nimitz meet in Hawaii', 'political', P.pearl, 9,
      'In July 1944 President Roosevelt meets General Douglas MacArthur and Admiral Chester Nimitz in Hawaii. Admiral King and Nimitz have favoured bypassing the Philippines and invading Formosa; MacArthur insists on keeping his 1942 promise to return. The meeting points toward the Philippines, though the argument runs on for two more months before Nimitz comes round and Leyte, in the central islands, is chosen.',
      { approx: true }),
    ev('1944-10-12', 'Three days of air battle over Formosa', 'attack', P.formosa, 6,
      'Halsey’s carriers open a series of raids on Formosa and the Ryukyus to keep their airfields from interfering with the Leyte landings. Japan answers under its Shō-Gō 2 plan with wave after wave of air attacks on the Third Fleet. In three days the Japanese lose about 600 aircraft, nearly all their air strength in the region.',
      { facts: [['Japanese aircraft lost', 'About 600 in three days']] }),

    // ---------- The landings ----------
    ev('1944-10-17', 'Rangers seize the islands at the mouth of Leyte Gulf', 'invasion', P.suluan, 10,
      'Minesweeping begins at dawn and the 6th Rangers move against three small islands guarding Leyte Gulf. Delayed by a storm, they are ashore on Suluan and Dinagat by 08:05. On Suluan they scatter a small garrison and destroy a radio station; Dinagat is empty, and Homonhon is taken unopposed the next day. The Rangers put up navigation lights for the transports to follow.',
      at('08:05')),
    ev('1944-10-18', 'Japan switches to Shō-Gō 1', 'political', P.brunei, 6,
      'With the Americans at the entrance to Leyte Gulf, the Combined Fleet’s commander, Admiral Soemu Toyoda, turns to Shō-Gō 1, the plan for the Philippines. Vice Admiral Jisaburō Ozawa’s carriers, with very few aircraft, will act as bait to draw Halsey’s fast carriers away to the north. Meanwhile Vice Admiral Takeo Kurita’s Center Force will come through the San Bernardino Strait and the Southern Force under Vice Admirals Nishimura and Shima through the Surigao Strait, to fall on the landing area from two sides.',
      { approx: true, facts: [['Northern Force', 'Ozawa: 4 carriers with 108 aircraft, decoy'], ['Center Force', 'Kurita: 5 battleships incl. Yamato and Musashi'], ['Southern Force', 'Nishimura and Shima, via Surigao Strait']] }),
    ev('1944-10-19', 'Ōnishi proposes suicide attacks', 'political', P.mabalacat, 10,
      'The 1st Air Fleet in the Philippines has only about 40 aircraft left. At a meeting at Mabalacat airfield, its commander, Vice Admiral Takijirō Ōnishi, tells the officers of the 201st Flying Group that the only sure way to stop the American carriers is to fit Zeros with 250 kg bombs and crash them into the flight decks. Twenty-three student pilots volunteer, and Lieutenant Yukio Seki is chosen to lead the Special Attack Unit.',
      { facts: [['1st Air Fleet strength', '41 aircraft, 34 of them Zeros']] }),
    ev('1944-10-20', 'A-day: the Sixth Army lands on Leyte', 'invasion', P.redBeach, 11,
      'After four hours of naval gunfire, Lieutenant General Walter Krueger’s Sixth Army lands at 10:00. X Corps comes ashore on a four-mile front between Tacloban airfield and the Palo River; 15 miles to the south XXIV Corps lands near Dulag. The swamps behind the beaches slow the troops as much as Japanese fire, and within an hour most sectors can take heavy vehicles.',
      at('10:00', { facts: [['North', 'X Corps: 1st Cavalry Division, 24th Infantry Division'], ['South', 'XXIV Corps: 7th and 96th Infantry Divisions'], ['Sixth Army', 'About 202,500 men']],
        paths: [{ label: 'Landing beaches (approximate)', kind: 'route', coords: [[11.24, 125.03], [11.17, 125.02], [10.95, 125.04]] }] })),
    ev('1944-10-20', '“People of the Philippines, I have returned!”', 'political', P.redBeach, 12,
      'By 13:30 the 24th Division’s beach is secure enough for MacArthur to wade ashore onto Red Beach. He broadcasts to the Filipino people that, by the grace of God, American forces stand again on Philippine soil.',
      at('13:30', { link: { timeline: 'road-to-tokyo-bay', event: '1944-10-20-macarthur-returns-to-the-philippines', label: 'See this in The Road to Tokyo Bay' } })),
    ev('1944-10-21', 'A plane crashes into HMAS Australia', 'loss', P.leyteGulf, 10,
      'At about 06:00 Japanese aircraft attack the Allied ships off the beaches. A damaged Aichi D3A flies low up the side of the heavy cruiser HMAS Australia and strikes her foremast, showering the bridge with burning fuel. Thirty men are killed, including her captain, Emile Dechaineux, and Commodore John Collins is among the wounded. Most witnesses think it is a deliberate ramming, and some count it as the first kamikaze attack.',
      at('06:00', { approx: true, facts: [['Killed', '30'], ['Wounded', '62, including Commodore Collins']] })),
    ev('1944-10-21', 'Tacloban taken; Yamashita commits to Leyte', 'invasion', P.tacloban, 11,
      'The 1st Cavalry Division secures Tacloban, the provincial capital. General Tomoyuki Yamashita decides to make Leyte the decisive battle for the Philippines and orders the 35th Army to fight it in concert with the navy, pouring in reinforcements through Ormoc on the west coast.'),

    // ---------- The fleets sail ----------
    ev('1944-10-22', 'Kurita’s Center Force sails from Brunei', 'movement', P.brunei, 6,
      'Kurita leaves Brunei Bay with the most powerful force Japan can still muster, but without a single aircraft carrier. Because of the distance, he cannot reach Leyte Gulf until five days after the landings, and he privately believes the mission a waste of ships and lives.',
      { facts: [['Battleships', 'Yamato, Musashi, Nagato, Kongō, Haruna'], ['Heavy cruisers', '10'], ['Light cruisers', '2'], ['Destroyers', '15']],
        link: { timeline: 'yamato', event: '1944-10-22-sails-from-brunei-for-leyte-gulf', label: 'See this in Battleship Yamato' },
        paths: [{ label: 'Center Force toward Leyte Gulf (approximate)', kind: 'route', coords: [[5.1, 115.1], [9.6, 117.4], [12.0, 120.5], [13.1, 122.5], [12.55, 124.25], [11.8, 126.0]] }] }),
    ev('1944-10-22', 'Nishimura sails for Surigao Strait', 'movement', P.brunei, 6,
      'Vice Admiral Shōji Nishimura’s old battleships Yamashiro and Fusō, the heavy cruiser Mogami and four destroyers leave Brunei at about 15:00, heading east into the Sulu Sea. Vice Admiral Kiyohide Shima’s Second Striking Force, with two heavy cruisers, a light cruiser and four destroyers, is coming separately from Mako in the Pescadores. Radio silence will keep the two from coordinating.',
      at('15:00', { paths: [{ label: 'Southern Force toward Surigao Strait (approximate)', kind: 'route', coords: [[5.1, 115.1], [7.5, 119.5], [9.0, 122.5], [9.6, 124.6], [10.17, 125.38]] }] })),
    ev('1944-10-22', 'Halsey sends two carrier groups to Ulithi', 'movement', P.ulithi, 6,
      'Halsey detaches two of his four carrier groups to Ulithi to provision and rearm. When the submarines report Kurita he recalls one, but lets Vice Admiral John S. McCain’s group, the strongest of all, carry on until the 24th. For most of the battle the Third Fleet is without nearly 40 percent of its air strength.',
      { approx: true }),

    // ---------- 23 October: Palawan Passage ----------
    ev('1944-10-23', 'Darter’s radar finds the Center Force', 'intelligence', P.palawan, 8,
      'The submarines Darter and Dace are on the surface together off Palawan when Darter’s radar picks up Kurita’s ships at 30,000 yards. Darter sends the first of three contact reports, the first news of the Japanese fleet in days. At least one is picked up aboard Yamato, but Kurita takes no proper anti-submarine precautions. The two boats race ahead at full power for a dawn attack.',
      at('01:16')),
    ev('1944-10-23', 'Darter sinks Kurita’s flagship Atago', 'loss', P.palawan, 9,
      'Darter fires six torpedoes and at least four hit the heavy cruiser Atago, Kurita’s flagship. She sinks so quickly that the admiral has to swim for it; the destroyer Kishinami picks him up. Ten minutes later Darter’s stern tubes put two torpedoes into Atago’s sister Takao, which turns back toward Brunei.',
      at('05:24', { link: { timeline: 'pacific-submarines', event: '1944-10-23-darter-and-dace-ambush-kurita-s-fleet', label: 'See this in Submarine Operations' } })),
    ev('1944-10-23', 'Dace sinks Maya', 'loss', P.palawan, 9,
      'Dace hits the heavy cruiser Maya with four torpedoes, and she goes down quickly with heavy loss of life, then dives deep to escape the destroyers’ counterattack. Hundreds of Maya’s survivors are taken aboard Musashi. Kurita, only recently recovered from dengue fever, moves his flag to Yamato.',
      at('05:56', { link: { timeline: 'yamato', event: '1944-10-23-kurita-moves-his-flag-to-yamato', label: 'See this in Battleship Yamato' } })),

    // ---------- 24 October: Sibuyan Sea ----------
    ev('1944-10-24', 'Ōnishi’s air strikes hit Sherman’s carriers', 'attack', P.tg383, 8,
      'From Luzon, Ōnishi sends three waves of 50 to 60 aircraft each against Rear Admiral Frederick Sherman’s Task Group 38.3. The Hellcats break them up; Commander David McCampbell of Essex shoots down nine attackers in a single action, a record, and lands almost out of fuel on Langley.',
      ord('08:00')),
    ev('1944-10-24', 'A single bomb wrecks Princeton', 'loss', P.tg383, 9,
      'One Yokosuka D4Y “Judy” slips through and puts a 250 kg bomb into the light carrier Princeton. It explodes among six fuelled and armed Avengers in her hangar, the sprinklers fail, and fire spreads with a string of secondary explosions. The cruiser Birmingham and three destroyers stay with her to fight the fires.',
      at('09:38')),
    ev('1944-10-24', 'Intrepid’s planes find Musashi', 'attack', P.sibuyan, 9,
      'Spotted crossing the Sibuyan Sea, the Center Force has no air cover. Helldivers and Avengers from Intrepid and Cabot attack at about 10:30, hitting Nagato, Yamato and Musashi; Musashi takes a bomb on her forward turret and a torpedo amidships. The heavy cruiser Myōkō is badly damaged and limps away to Borneo.',
      at('10:27')),
    ev('1944-10-24', 'Wave after wave strikes Musashi', 'attack', P.sibuyan, 9,
      'Through the afternoon the American strikes concentrate on Musashi. Aircraft from Essex and Lexington attack at 13:31, then Enterprise’s dive bombers and torpedo planes, then at 15:25 a strike of 37 aircraft from Intrepid, Franklin and Cabot that scores 13 bomb and 11 torpedo hits. Her speed falls to 6 knots, her bow is awash and her rudder jams.',
      at('13:31', { facts: [['Sorties against Center Force', '259 on 24 October'], ['Hits on Musashi', 'About 19 torpedoes and 17 bombs']] })),
    ev('1944-10-24', '“Will be formed as Task Force 34”', 'intelligence', P.newJersey, 7,
      'Aboard the battleship New Jersey, Halsey signals a contingency plan: four battleships with cruisers and destroyers under Vice Admiral Willis A. Lee “will be formed” as Task Force 34 to fight at the San Bernardino Strait. He means it as a future option, but Kinkaid, who intercepts the message, and Nimitz at Pearl Harbor both read it as an order already carried out.',
      at('15:12')),
    ev('1944-10-24', 'Princeton blows up beside Birmingham', 'loss', P.tg383, 10,
      'With the fires nearly under control, a huge explosion, probably in Princeton’s aft bomb stowage, tears through the carrier and sweeps the crowded decks of Birmingham, alongside to help. The cruiser has 241 killed and 412 wounded and has to leave for repairs.',
      at('15:23', { facts: [['Birmingham', '241 killed, 412 wounded']] })),
    ev('1944-10-24', 'Kurita turns away', 'movement', P.sibuyan, 8,
      'Six hours behind schedule and facing more air attacks in the narrow strait ahead, Kurita turns west, leaving the crippled Musashi to fend for herself at 15:30. To Halsey’s fliers it looks like a retreat.',
      at('15:30')),
    ev('1944-10-24', 'The decoy is found at last', 'intelligence', P.northernForce, 6,
      'Busy with Kurita and the air attacks from Luzon, Halsey’s scouts do not find Ozawa’s carriers until 16:40. The one Japanese force that wants to be seen is the last one sighted. Halsey believes it is the main threat and a chance to destroy Japan’s last carriers.',
      at('16:40')),
    ev('1944-10-24', 'Halsey’s clarification goes out by voice radio', 'intelligence', P.newJersey, 7,
      'Halsey tells his own commanders that Task Force 34 will be formed only if the enemy comes through the strait, and when he orders it. He sends this by short-range voice radio, so Kinkaid never hears it, and no copy goes to Nimitz or King.',
      at('17:10')),
    ev('1944-10-24', 'Kurita turns back toward the strait', 'movement', P.sibuyan, 8,
      'Out of reach of the aircraft, Kurita reverses course again for the San Bernardino Strait. At 16:21 he passes the crippled Musashi, down by the bow and heading north, and leaves a heavy cruiser and two destroyers with her.',
      at('17:15')),
    ev('1944-10-24', 'Princeton is scuttled', 'loss', P.tg383, 10,
      'With the fires out of control and her crew taken off, Princeton is torpedoed by the cruiser Reno after the destroyer Irwin’s torpedoes malfunction. She is the largest American ship lost at Leyte Gulf: 108 of her men are killed and 1,361 rescued.',
      at('17:50', { facts: [['Killed', '108'], ['Rescued', '1,361'], ['Aircraft lost with her', '17 Hellcats, 12 Avengers']] })),
    ev('1944-10-24', 'Musashi capsizes', 'loss', P.sibuyan, 10,
      'Musashi’s engines stop before she can be beached. Her crew is ordered to abandon ship at 19:30 as the list reaches 30 degrees, and six minutes later she rolls over and sinks in 1,350 metres of water. Her captain, Rear Admiral Toshihira Inoguchi, goes down with her; 1,376 of her 2,399 men are rescued. Her wreck will be found in 2015.',
      at('19:36', { facts: [['Crew', '2,399'], ['Rescued', '1,376'], ['Hits', 'About 19 torpedoes and 17 bombs']],
        link: { timeline: 'road-to-tokyo-bay', event: '1944-10-24-musashi-sunk-in-the-sibuyan-sea', label: 'See this in The Road to Tokyo Bay' } })),
    ev('1944-10-24', '“Counting on divine assistance”', 'political', P.northernForce, 6,
      'Ozawa, having intercepted a message describing Kurita’s withdrawal, has begun to pull back too. At 20:00 Toyoda orders all forces to attack, trusting in divine help, and Ozawa turns south again to make sure Halsey takes the bait.',
      at('20:00')),
    ev('1944-10-24', 'Halsey runs north with everything', 'movement', P.newJersey, 6,
      'Halsey signals that the Center Force is heavily damaged and that he is going north with three groups to attack the carriers at dawn. Kinkaid and Nimitz assume Task Force 34 is staying behind; in fact every battleship, cruiser and destroyer goes north. Reports from a night scout from Independence that Kurita is heading for the strait, and that its navigation lights are lit again, are brushed aside, as is Lee’s warning that Ozawa is a decoy. Nothing is left to guard San Bernardino Strait.',
      { ...ord('20:30'), approx: true, facts: [['Going north', '5 fleet carriers, 5 light carriers, 6 battleships, 8 cruisers, 41 destroyers']],
        paths: [{ label: 'Third Fleet runs north (approximate)', kind: 'route', coords: [[13.5, 125.5], [16.5, 125.5], [18.5, 126.0]] }] }),
    ev('1944-10-24', 'PT boats find Nishimura', 'intelligence', P.bohol, 9,
      'PT-131 makes contact with the Southern Force off Bohol. For three and a half hours the PT boats attack as Nishimura steams north. They score no hits, but their reports tell Rear Admiral Jesse Oldendorf exactly what is coming.',
      at('22:36')),

    // ---------- 25 October: Surigao Strait ----------
    ev('1944-10-25', 'Darter runs aground on Bombay Shoal', 'loss', P.bombayShoal, 11,
      'Shadowing the damaged Takao, Darter grounds on Bombay Shoal just after midnight. She cannot be got off; her whole crew is taken aboard Dace, and attempts over the next week to destroy the wreck all fail.',
      at('00:10', { approx: true })),
    ev('1944-10-25', 'Nishimura enters the strait', 'movement', P.surigaoSouth, 9,
      'Nishimura enters Surigao Strait at 02:00 with Shima 25 miles behind and Kurita still hours away. Waiting at the northern end is Oldendorf’s force: six old battleships, five of them survivors of Pearl Harbor, eight cruisers and 28 destroyers.',
      at('02:00', { facts: [['U.S. battleships', 'West Virginia, Maryland, Mississippi, Tennessee, California, Pennsylvania'], ['Japanese', 'Yamashiro, Fusō, Mogami and 4 destroyers']] })),
    ev('1944-10-25', 'Halsey forms Task Force 34', 'movement', P.newJersey, 7,
      'Far to the north, Halsey finally detaches Lee’s six battleships as Task Force 34, and they draw ahead of the carriers to finish off whatever the air strikes leave of Ozawa. Mitscher now has tactical command of the carriers.',
      at('02:40')),
    ev('1944-10-25', 'Kurita comes through the strait unopposed', 'movement', P.sanBernardino, 9,
      'The Center Force emerges from San Bernardino Strait and turns south along the coast of Samar. It still has four battleships, six heavy cruisers, two light cruisers and eleven destroyers. In its path are only the escort carriers of Seventh Fleet.',
      at('03:00')),
    ev('1944-10-25', 'Destroyer torpedoes cripple the Southern Force', 'attack', P.surigaoSouth, 10,
      'American destroyers attack from both sides of the strait. Torpedoes, possibly from Melvin, hit Fusō at 03:09 and she falls out of line, burning, and sinks within 40 minutes. Yamashiro is hit but steams on. Two of Nishimura’s destroyers are sunk and Asagumo is crippled.',
      at('03:09')),
    ev('1944-10-25', 'The last battleship salvoes', 'attack', P.battleLine, 10,
      'At 03:53 West Virginia opens fire with radar control at 22,800 yards and hits Yamashiro with her first salvo; California and Tennessee join in two minutes later, with the flanking cruisers. Oldendorf has crossed the Japanese T. Mississippi fires a single full salvo, the last ever fired by a battleship at another battleship.',
      at('03:53', { facts: [['West Virginia', '93 rounds of 16-inch'], ['Louisville (cruiser)', '333 rounds of 8-inch']] })),
    ev('1944-10-25', 'Yamashiro sinks with Nishimura', 'loss', P.surigao, 10,
      'Hit by a torpedo from the destroyer Bennion at 04:05, Yamashiro capsizes in minutes and sinks at about 04:20 with Nishimura aboard. Only about ten of her men survive. Mogami and the destroyer Shigure stagger south; Shigure is the only one of Nishimura’s seven ships to escape.',
      at('04:20', { facts: [['Southern Force', 'Six of seven ships lost'], ['U.S. losses', '39 killed, PT-493 sunk']] })),
    ev('1944-10-25', 'Shima turns back', 'movement', P.surigaoSouth, 10,
      'Shima’s force arrives astern. PT-137 torpedoes the light cruiser Abukuma, and seeing the burning wrecks ahead, Shima orders a retreat before coming within range. His flagship Nachi collides with Mogami, which is finished off after dawn by carrier aircraft and a torpedo from the destroyer Akebono.',
      { ...ord('04:30'), approx: true }),

    // ---------- 25 October: Off Samar ----------
    ev('1944-10-25', '“The biggest battleship I ever saw”', 'intelligence', P.taffy3, 9,
      'Ensign William Brooks, flying an anti-submarine patrol from St. Lo, sights ships he expects to be Halsey’s, then sees pagoda masts. At 06:45 the Japanese come upon Taffy 3, Rear Admiral Clifton Sprague’s six escort carriers, three destroyers and four destroyer escorts, achieving complete surprise.',
      at('06:37', { facts: [['Taffy 3', '6 escort carriers, 3 destroyers, 4 destroyer escorts'], ['Aircraft', 'About 165, mostly Wildcats and Avengers']] })),
    ev('1944-10-25', 'Taffy 3 runs for a rain squall', 'movement', P.taffy3, 9,
      'Sprague turns east, launches every aircraft he has and makes smoke. Yamato opens fire at about 07:00, her only surface action. Believing he has caught Halsey’s fleet carriers, Kurita orders a “General Attack”, which breaks his fleet into independent groups. At about 07:20 the American carriers reach a squall and the Japanese fire slackens.',
      at('06:50', { link: { timeline: 'yamato', event: '1944-10-25-yamato-s-guns-fire-on-enemy-ships-off-sa', label: 'See this in Battleship Yamato' } })),
    ev('1944-10-25', 'Johnston charges alone', 'attack', P.taffy3, 10,
      'On his own initiative Commander Ernest E. Evans turns the destroyer Johnston toward the Japanese fleet at full speed. At 07:27 one of her ten torpedoes blows the bow off the heavy cruiser Kumano, and Suzuya is slowed while helping her. Minutes later Yamato’s shells cripple Johnston, but she hides in a squall and fights on.',
      at('07:15')),
    ev('1944-10-25', '“Small boys attack”', 'attack', P.taffy3, 10,
      'Sprague sends the rest of his screen against the Japanese. Hoel, Heermann and the destroyer escort Samuel B. Roberts make torpedo runs against battleships and cruisers, forcing them to turn away and drawing their fire from the carriers. Meanwhile all 16 escort carriers of the three Taffys launch whatever they have against the unescorted Japanese, even planes armed only with machine guns or depth charges. Lieutenant Commander Robert Copeland tells Roberts’ crew to expect a fight against overwhelming odds from which survival cannot be expected.',
      at('07:16')),
    ev('1944-10-25', 'Kamikazes hit Taffy 1', 'attack', P.taffy1, 9,
      'Far to the south, Taffy 1’s escort carriers are supporting the pursuit from Surigao Strait when the first planned kamikaze attacks of the war arrive from Davao. Santee is hit first, killing 16 men, then torpedoed by a submarine; Suwannee is crashed soon after, with 71 killed. A second kamikaze hits Suwannee around noon the next day, starting a fire that burns for nine hours; her losses reach 107 dead.',
      { ...ord('07:45'), approx: true }),
    ev('1944-10-25', 'Mitscher’s first strike hits Ozawa', 'attack', P.northernForce, 8,
      'Mitscher has launched 180 aircraft at dawn before the Northern Force is even found. Scouts locate it at 07:10, and at 08:00 the strike goes in, its fighters wiping out Ozawa’s combat air patrol of about 30 planes. Ozawa’s dawn strike of 75 aircraft has already been shot down or scattered to Luzon without doing any harm.',
      at('08:00')),
    ev('1944-10-25', '“My situation is critical”', 'intelligence', P.leyteGulf, 8,
      'From shortly after 08:00 Kinkaid sends one appeal after another, some in plain language, for Halsey’s fast battleships and air strikes. One reports that the Seventh Fleet’s own battleships are low on ammunition. Halsey later says the messages reached him late and out of order; he does not see the most urgent until about 10:00.',
      at('08:22')),
    ev('1944-10-25', 'Hoel goes down', 'loss', P.taffy3, 10,
      'After more than 40 shell hits from Yamato, Nagato and the cruisers, Hoel is dead in the water and on fire. She rolls over and sinks at 08:55 with 253 of her crew. Samuel B. Roberts, out of ammunition, is stopped by Kongō’s shells and sinks by the stern with 90 men.',
      at('08:55', { facts: [['Hoel', '253 lost'], ['Samuel B. Roberts', '90 lost']] })),
    ev('1944-10-25', 'Gambier Bay capsizes', 'loss', P.gambierBay, 10,
      'At the rear of the formation, the escort carrier Gambier Bay becomes the main target of Yamato’s guns and the Japanese cruisers. A hit at 08:43 leaves her dead in the water. She capsizes at 09:07 and sinks four minutes later with 147 men, the only U.S. carrier sunk by naval gunfire in the war.',
      at('09:07', { facts: [['Lost', '147']] })),
    ev('1944-10-25', '“All ships, my course north, speed 20”', 'movement', P.taffy3, 9,
      'Kurita has lost three heavy cruisers and control of his scattered force; Yamato, turning away from torpedoes, has fallen behind. Believing he has sunk several fleet carriers and that Halsey is closing in, he breaks off the action. Later he turns away toward the San Bernardino Strait, leaving the shipping in Leyte Gulf untouched.',
      at('09:20', { approx: true })),
    ev('1944-10-25', 'Johnston sinks', 'loss', P.johnston, 10,
      'Covering the sinking Gambier Bay, the wrecked Johnston steers to block a Japanese destroyer attack until she is shot to pieces. Abandon ship is ordered at 09:45, and she sinks just after 10:00 with 186 men. Witnesses see the captain of the destroyer Yukikaze salute her as she goes. Evans is not among the survivors and receives the Medal of Honor posthumously.',
      at('10:00', { facts: [['Lost', '186, including Commander Evans']],
        link: { timeline: 'medal-of-honor', event: '1944-10-25-evans-ernest-e', label: 'See Commander Evans in the Medal of Honor' } })),
    ev('1944-10-25', '“Where is Task Force 34? The world wonders”', 'intelligence', P.newJersey, 7,
      'Nimitz, following the battle from Pearl Harbor, asks Halsey where Task Force 34 is. Halsey’s signalmen leave in the closing words “the world wonders”, padding meant to confuse Japanese code-breakers. Halsey takes them as a rebuke, throws his cap on the deck and has to be calmed by his chief of staff, Rear Admiral Robert Carney.',
      { ...ord('10:00'), approx: true }),
    ev('1944-10-25', 'A kamikaze sinks St. Lo', 'loss', P.stLo, 10,
      'At 10:50 the Shikishima Special Attack Unit strikes Taffy 3. A Zero, probably flown by Lieutenant Seki, crashes into St. Lo’s flight deck at 10:51; its bomb sets off fires among aircraft being refuelled and rearmed, then her torpedo and bomb magazines explode. She sinks half an hour later with 113 men, the first major warship sunk by a kamikaze. Kalinin Bay, Kitkun Bay and White Plains are also hit.',
      at('10:51', { facts: [['Lost', '113']],
        link: { timeline: 'road-to-tokyo-bay', event: '1944-10-25-off-samar-and-the-first-kamikazes', label: 'See this in The Road to Tokyo Bay' } })),

    // ---------- 25 October: Cape Engaño ----------
    ev('1944-10-25', 'Halsey turns Task Force 34 south', 'movement', P.newJersey, 7,
      'More than three hours after the first appeals, with Lee’s battleships almost in gun range of Ozawa’s ships, Halsey orders Task Force 34 south toward Samar. Two and a half hours are then lost refuelling its destroyers. At 12:26 he signals that the Japanese navy has been beaten, routed and broken.',
      at('11:15')),
    ev('1944-10-25', 'Zuikaku sinks', 'loss', P.zuikaku, 9,
      'Hit by seven torpedoes and nine bombs, Ozawa’s flagship Zuikaku, the last survivor of the six carriers that attacked Pearl Harbor, lists heavily and Ozawa moves to the cruiser Ōyodo. Abandon ship is ordered at 13:58, and she rolls over and sinks at 14:14 with 843 men. The light carriers Zuihō and Chitose and the destroyer Akizuki are sunk too.',
      at('14:14', { facts: [['Sorties against the Northern Force', '527'], ['Zuikaku', '843 lost, 862 rescued']] })),
    ev('1944-10-25', 'DuBose’s cruisers finish off the cripples', 'attack', P.northernForce, 8,
      'Cruisers and destroyers under Rear Admiral DuBose, sent after the remnants of the Northern Force, sink the crippled light carrier Chiyoda at about 17:00 and the destroyer Hatsuzuki at 20:59 after a stubborn fight. At about 23:10 the submarine Jallao sinks the light cruiser Tama, the last act of the Battle off Cape Engaño.',
      at('17:00', { approx: true })),

    // ---------- 26 October and after ----------
    ev('1944-10-26', 'Nowaki is caught off the strait', 'loss', P.sanBernardino, 9,
      'At 16:22 the day before, Halsey sent his two fastest battleships, Iowa and New Jersey, racing south under Rear Admiral Oscar Badger, too late to catch Kurita. Just after midnight Badger’s cruisers and destroyers find the destroyer Nowaki, the last straggler of the Center Force, off San Bernardino Strait. She is sunk with all hands, including the survivors she had rescued from Chikuma. Through the day carrier aircraft hit the retreating Japanese ships, sinking the light cruiser Noshiro.',
      at('00:30', { approx: true })),
    ev('1944-10-27', 'Taffy 3’s survivors are rescued at last', 'loss', P.taffy3, 9,
      'A search plane reports the survivors of Gambier Bay, Hoel, Johnston and Samuel B. Roberts in the wrong position, and many are not picked up until 27 October, after two days in the water. Many have died of exposure, thirst and shark attacks. Taffy 3 has lost more than 1,500 men in all.',
      { facts: [['U.S. ships lost at Leyte Gulf', 'Princeton, Gambier Bay, St. Lo, Johnston, Hoel, Samuel B. Roberts, PT-493'], ['Japanese ships lost', '26, including 4 carriers, 3 battleships, 6 heavy cruisers']] }),
    ev('1944-10-26', 'The Japanese navy is broken', 'political', P.leyteGulf, 7,
      'The battle has cost Japan the greatest loss of ships and men in its navy’s history and secured the Leyte beachhead from the sea. Of Kurita’s five battleships, only Yamato and Haruna come home fit to fight. Short of fuel, the surviving ships will spend most of the rest of the war in port, while Japan turns to the kamikaze.',
      ord('23:00')),

    // ---------- The campaign ashore ----------
    ev('1944-12-07', 'The 77th Division lands at Ormoc', 'invasion', P.ormoc, 10,
      'Japan has managed to land more than 34,000 troops on Leyte through Ormoc. The 77th Infantry Division lands unopposed south of the town at 07:00, while kamikazes attack its convoy in 16 raids. Ormoc falls on 10 December.',
      at('07:00')),
    ev('1944-12-25', 'Palompon falls; Leyte is declared secure', 'invasion', P.palompon, 10,
      'A battalion of the 77th Division lands at Palompon, the last port open to the Japanese, at 07:20 and takes it within four hours. MacArthur announces the end of organised resistance on Leyte and hands the island to the Eighth Army the next day, though mopping up goes on for months.',
      at('07:20')),
  ];

  // ---------- Shot list ----------
  // Camera direction for the battle (see "Shots" in app.js). Events not listed use the
  // automatic framing.
  const pt = (place) => [place.lat, place.lng];
  const SHOTS = {
    // The plan: all three Japanese forces and the beachhead in one frame.
    'Japan switches to Shō-Gō 1': { shot: 'wide', transition: 'pull-back', frame: [pt(P.brunei), pt(P.northernForce), pt(P.leyteGulf)] },
    'Kurita’s Center Force sails from Brunei': { scene: 'sortie', frame: [pt(P.leyteGulf)] },
    'Nishimura sails for Surigao Strait': { scene: 'sortie' },
    // Palawan Passage
    'Darter’s radar finds the Center Force': { scene: 'palawan', transition: 'fly' },
    'Darter sinks Kurita’s flagship Atago': { scene: 'palawan' },
    'Dace sinks Maya': { scene: 'palawan' },
    // 24 October: Musashi and Princeton, far apart, in one frame
    'Intrepid’s planes find Musashi': { scene: 'sibuyan', frame: [pt(P.tg383)] },
    'Wave after wave strikes Musashi': { scene: 'sibuyan' },
    'Musashi capsizes': { shot: 'tight' },
    // The run north: the open strait and the decoy in one frame
    'Halsey runs north with everything': { shot: 'wide', frame: [pt(P.sanBernardino), pt(P.northernForce)] },
    // Surigao Strait
    'Destroyer torpedoes cripple the Southern Force': { scene: 'surigao', frame: [pt(P.battleLine)] },
    'The last battleship salvoes': { scene: 'surigao' },
    'Yamashiro sinks with Nishimura': { scene: 'surigao' },
    // Off Samar
    '“The biggest battleship I ever saw”': { shot: 'wide', transition: 'pull-back', frame: [pt(P.sanBernardino), pt(P.leyteGulf)] },
    'Johnston charges alone': { scene: 'samar' },
    '“Small boys attack”': { scene: 'samar' },
    'Hoel goes down': { scene: 'samar' },
    'Gambier Bay capsizes': { scene: 'samar' },
    'Johnston sinks': { shot: 'tight' },
    'A kamikaze sinks St. Lo': { shot: 'tight' },
    // Cape Engaño: Halsey's battleships turning back, too far away
    'Halsey turns Task Force 34 south': { shot: 'wide', frame: [pt(P.taffy3)] },
  };
  const events = WW2.events['leyte-gulf'];
  for (const [title, shot] of Object.entries(SHOTS)) {
    const e = events.find((x) => x.title === title);
    if (!e) throw new Error(`leyte-gulf shot list: no event titled "${title}"`);
    Object.assign(e, shot);
  }
})();
