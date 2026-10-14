// Timeline: The Battle of Okinawa, Operation Iceberg (War in the Pacific).
// From the landings in the Kerama Islands on 26 March 1945 and L-Day on 1 April, through the
// drive north, Ie Shima, Kakazu Ridge, the Shuri Line and Sugar Loaf Hill, the fall of Shuri and
// the last stand in the south, to the deaths of Buckner and Ushijima and the end of organized
// resistance on 22 June. Alongside it: the kamikaze (Kikusui) campaign against the fleet and
// Operation Ten-Go, Yamato's last sortie, and the cost to Okinawa's civilians.
// Checked against the English Wikipedia articles "Battle of Okinawa", "Operation Ten-Go",
// "Kamikaze", "USS Bunker Hill (CV-17)", "Mitsuru Ushijima", "Simon Bolivar Buckner Jr.",
// "Ernie Pyle", "Iejima", "Desmond Doss", "Edward J. Moskala", "6th Marine Division",
// "Minoru Ōta", "Shuri Castle", "Kerama Islands", "Giretsu Kuteitai", "Himeyuri students",
// "Isamu Chō" and "Claudius Miller Easley" (October 2026). (Wikipedia has no separate articles
// on Kakazu Ridge, Sugar Loaf Hill or the fighting on Ie Shima; those are covered in the main
// battle article.)
//
// Times are local (Okinawa and Japan share the same clock); most events are date-only, with
// sortTime used just to order a day's events. Event schema: see data/timelines/attack-on-hawaii.js.

(function () {
  const P = {
    oahu: { name: 'Oahu, Hawaii', lat: 21.47, lng: -158.0 },
    kerama: { name: 'Kerama Islands, west of Okinawa', lat: 26.2, lng: 127.333 },
    tokashiki: { name: 'Tokashiki Island, Kerama Islands', lat: 26.2, lng: 127.36 },
    sakishima: { name: 'Sakishima Islands (approx.)', lat: 24.6, lng: 125.0 },
    keise: { name: 'Keise Shima, west of Naha (approx.)', lat: 26.2, lng: 127.57 },
    hagushi: { name: 'Hagushi beaches, west coast of Okinawa (approx.)', lat: 26.37, lng: 127.73 },
    minatoga: { name: 'Off the Minatoga beaches, southeast Okinawa (approx.)', lat: 26.12, lng: 127.8 },
    yontan: { name: 'Yontan (Yomitan) airfield', lat: 26.4, lng: 127.75 },
    ishikawa: { name: 'Ishikawa Isthmus', lat: 26.43, lng: 127.83 },
    motobu: { name: 'Mount Yae-Take, Motobu Peninsula (approx.)', lat: 26.65, lng: 127.94 },
    hedo: { name: 'Hedo Point, northern tip of Okinawa', lat: 26.87, lng: 128.26 },
    ieShima: { name: 'Ie Shima (Iejima)', lat: 26.716, lng: 127.79 },
    pyle: { name: 'Ernie Pyle memorial, southern Ie Shima (approx.)', lat: 26.705, lng: 127.8 },
    outposts: { name: 'Cactus Ridge and the Pinnacle, northwest of Shuri (approx.)', lat: 26.27, lng: 127.75 },
    kakazu: { name: 'Kakazu Ridge', lat: 26.259, lng: 127.737 },
    maeda: { name: 'Maeda Escarpment ("Hacksaw Ridge"), near Urasoe (approx.)', lat: 26.248, lng: 127.738 },
    shuriLine: { name: 'The Shuri Line, southern Okinawa (approx.)', lat: 26.22, lng: 127.73 },
    conical: { name: 'Conical Hill', lat: 26.21, lng: 127.75 },
    sugarLoaf: { name: 'Sugar Loaf Hill', lat: 26.222, lng: 127.696 },
    naha: { name: 'Naha', lat: 26.212, lng: 127.68 },
    shuri: { name: 'Shuri Castle', lat: 26.217, lng: 127.7195 },
    oroku: { name: 'Japanese naval headquarters, Oroku Peninsula (approx.)', lat: 26.187, lng: 127.672 },
    south: { name: 'Southern tip of Okinawa, southeast of Itoman (approx.)', lat: 26.1, lng: 127.71 },
    kuniyoshi: { name: 'Near Kuniyoshi, Itoman (approx.)', lat: 26.11, lng: 127.69 },
    ihara: { name: 'Ihara, southern Okinawa (approx.)', lat: 26.103, lng: 127.696 },
    hill89: { name: 'Hill 89, Mabuni (approx.)', lat: 26.095, lng: 127.725 },
    kadena: { name: 'Kadena airfield', lat: 26.355, lng: 127.768 },
    fleet: { name: 'The invasion fleet off Okinawa (approx.)', lat: 26.5, lng: 127.5 },
    tf58: { name: 'Task Force 58, east of Okinawa (approx.)', lat: 26.8, lng: 129.0 },
    kyushu: { name: 'Kyushu airfields, southern Japan (approx.)', lat: 31.6, lng: 130.6 },
    kure: { name: 'Kure, Hiroshima Bay', lat: 34.23, lng: 132.56 },
    tokuyama: { name: 'Tokuyama, southern Honshu', lat: 34.04, lng: 131.8 },
    bungo: { name: 'Bungo Strait', lat: 33.0, lng: 132.1 },
    tenGo: { name: 'East China Sea, southwest of Kyushu', lat: 30.37, lng: 128.07 },
    iheya: { name: 'Off Iheyajima, north of Okinawa (approx.)', lat: 27.04, lng: 127.97 },
    mabuni: { name: 'Cornerstone of Peace, Mabuni', lat: 26.095, lng: 127.725 },
  };

  const ev = (date, title, type, location, zoom, summary, extra = {}) => ({
    id: extra.id || `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}`,
    date, title, type, location, zoom, summary,
    theater: extra.theater || 'Pacific',
    ...extra,
  });
  const at = (time, extra = {}) => ({ time, tz: 'OKI', ...extra });
  const atJ = (time, extra = {}) => ({ time, tz: 'JST', ...extra }); // Ten-Go, off Kyushu
  const ord = (sortTime) => ({ sortTime, tz: 'OKI' }); // order within the day only; no time shown

  WW2.events.okinawa = [
    // ---------- Lead-up ----------
    ev('1944-07-15', 'Buckner forms the Tenth Army', 'political', P.oahu, 8,
      'Lieutenant General Simon Bolivar Buckner Jr., fresh from the Aleutians, is sent to Hawaii to build the Tenth Army from Army and Marine Corps divisions. It is meant to invade Taiwan, but when that plan is dropped its target becomes Okinawa, the main island of the Ryukyus, about 550 km from the Japanese home islands.',
      { approx: true, facts: [['Commander', 'Lt. Gen. Simon Bolivar Buckner Jr.'], ['Original target', 'Taiwan (Operation Causeway, cancelled)']] }),
    ev('1945-03-23', 'Schoolgirls mobilized as nurses', 'home-front', P.south, 10,
      'The Japanese Army mobilizes 222 students and 18 teachers from two girls’ schools as a nursing unit, later known as the Himeyuri students. They are told they will be safe and that the Americans will be beaten easily; instead they will work in front-line cave hospitals. Some 1,780 schoolboys aged 14 to 17 are also drafted into the Iron and Blood Imperial Corps, and about 39,000 Okinawans in all are pressed into the defence.',
      { facts: [['Japanese 32nd Army', 'About 67,000–77,000 regulars, 9,000 naval troops, 39,000 Okinawan conscripts and labourers'], ['Commander', 'Lt. Gen. Mitsuru Ushijima']] }),

    // ---------- Kerama Islands ----------
    ev('1945-03-26', 'The 77th Division lands in the Kerama Islands', 'invasion', P.kerama, 10,
      'The first Americans ashore in the campaign are soldiers of the 77th Infantry Division, who land in the Kerama Islands about 24 km west of Okinawa. In five days they secure the group, giving the fleet a sheltered anchorage and removing a base for suicide boats, for the loss of 27 dead and 81 wounded. The Japanese lose more than 650 dead and captured.',
      { facts: [['U.S. losses', '27 killed, 81 wounded'], ['Japanese losses', 'Over 650 killed or captured']] }),
    ev('1945-03-26', 'The British Pacific Fleet strikes the Sakishimas', 'attack', P.sakishima, 7,
      'Operating as Task Force 57, the British Pacific Fleet, with Australian, New Zealand and Canadian ships among it, begins neutralizing Japanese airfields in the Sakishima Islands on the southern flank. Its armoured-deck carriers will shrug off several kamikaze hits with only brief interruptions.'),
    ev('1945-03-28', 'Mass suicide on Tokashiki', 'loss', P.tokashiki, 11,
      'After the American landing, 394 civilians on Tokashiki Island are forced by Japanese soldiers to kill themselves. They are among the first of the mass suicides that will mark the battle, driven by Japanese propaganda that the Americans will kill and rape, and in many cases by soldiers who hand out grenades.'),
    ev('1945-03-29', 'Yamato’s squadron moves to Tokuyama', 'movement', P.kure, 8,
      'Pressed by the Emperor’s question of what the Navy will do for Okinawa, the Combined Fleet under Admiral Soemu Toyoda plans a one-way sortie: Yamato and her escorts are to fight through to Okinawa, run aground and fight as shore batteries. The ships leave Kure for Tokuyama. Their commander, Vice Admiral Seiichi Itō, thinks the plan futile and refuses to order it carried out.',
      { paths: [{ label: 'Kure to Tokuyama', kind: 'route', coords: [[34.23, 132.56], [33.95, 132.2], [34.04, 131.8]] }] }),
    ev('1945-03-31', 'Long Toms on Keise Shima', 'movement', P.keise, 11,
      'Marines of the Amphibious Reconnaissance Battalion land unopposed on Keise Shima, four islets about 13 km west of Naha. Batteries of 155 mm “Long Tom” guns follow, able to reach the southern half of Okinawa.'),

    // ---------- L-Day ----------
    ev('1945-04-01', 'L-Day: the Tenth Army lands at Hagushi', 'invasion', P.hagushi, 10,
      'In the largest amphibious assault of the Pacific War, XXIV Corps and III Amphibious Corps land on the Hagushi beaches on Okinawa’s west coast. Ushijima has chosen not to fight at the water’s edge, and the troops walk ashore almost unopposed. The plan is to make Okinawa the springboard for the invasion of Japan.',
      { ...ord('08:30'),
        facts: [['Tenth Army', '182,821 personnel at the start'], ['Divisions', 'Army 7th, 27th, 77th, 96th; Marine 1st, 2nd, 6th'], ['Fleet', '18 battleships, 27 cruisers, 177 destroyers and escorts, 39 carriers']],
        link: { timeline: 'road-to-tokyo-bay', event: '1945-04-01-okinawa-invaded', label: 'See this in Road to Tokyo Bay' } }),
    ev('1945-04-01', 'A feint off the Minatoga beaches', 'movement', P.minatoga, 10,
      'The 2nd Marine Division stages a demonstration landing off the southeast coast to make the Japanese think the real attack is coming there and to hold their reserves in place.',
      ord('08:00')),
    ev('1945-04-01', 'Kadena and Yontan airfields fall within hours', 'attack', P.yontan, 11,
      'The landing force sweeps across the narrow middle of the island and captures the Kadena and Yontan airfields within hours. The 6th Marine Division, landing on the left, meets only light resistance. With opposition so weak, Buckner moves straight on to the next phase of his plan: the seizure of the north.',
      ord('14:00')),

    // ---------- Ten-Go and Kikusui ----------
    ev('1945-04-05', 'Kusaka talks the commanders round', 'political', P.tokuyama, 10,
      'Vice Admiral Ryūnosuke Kusaka flies to Tokuyama. The captains, hearing the plan for the first time, side with Itō in rejecting it, until Kusaka says the sortie will draw American aircraft away from the Army’s kamikaze attacks and that the nation’s leaders, the Emperor among them, expect the Navy to do its utmost. The crews are offered the chance to stay behind; none do, though about 80 new, sick or infirm men, including 67 cadets, are sent ashore.',
      { facts: [['Ten-Go force', 'Yamato, light cruiser Yahagi, 8 destroyers'], ['Plan', 'Beach at Okinawa and fight as shore batteries']] }),
    ev('1945-04-06', 'Kikusui: the massed kamikaze attacks begin', 'attack', P.fleet, 8,
      'After a quiet first few days, about 400 Japanese aircraft from Kyushu attack the fleet off Okinawa in the first of the mass Kikusui (“floating chrysanthemum”) raids. The radar picket destroyers stationed around the island bear the brunt. Between 6 April and 22 June the Japanese will fly 1,465 kamikaze sorties in large raids from Kyushu, plus hundreds of individual ones from Kyushu and Formosa.',
      { ...ord('15:00'),
        facts: [['Large-raid kamikazes', '1,465 from Kyushu, 6 April – 22 June'], ['Individual sorties', '185 from Kyushu, 250 from Formosa']],
        paths: [{ label: 'Raids from Kyushu (approximate)', kind: 'strike', coords: [[31.6, 130.6], [29.0, 129.0], [26.5, 127.6]] }] }),
    ev('1945-04-06', 'Yamato sails from Tokuyama', 'movement', P.tokuyama, 8,
      'Yamato, with Itō aboard, the light cruiser Yahagi and eight destroyers leave Tokuyama with almost all the fuel left in the port. Code-breakers have already warned the Americans that the attack is coming.',
      atJ('16:00', { link: { timeline: 'yamato', event: '1945-04-06-sails-on-operation-ten-go', label: 'See this in Battleship Yamato' } })),
    ev('1945-04-06', 'Submarines shadow the squadron in the Bungo Strait', 'intelligence', P.bungo, 9,
      'The submarines Threadfin and Hackleback sight the Japanese force heading south through the Bungo Strait. It is too fast for them to attack, but for hours they follow and report its course, reportedly in plain language that the Japanese radio operators can hear.',
      { ...ord('20:00'), tz: 'JST' }),
    ev('1945-04-07', 'Mitscher launches against Yamato', 'attack', P.tf58, 7,
      'Spruance orders Rear Admiral Morton Deyo’s battleships to intercept, but Vice Admiral Marc Mitscher launches his carrier aircraft first and tells Spruance afterward. Around 10:00 about 280 aircraft take off from two task groups and 106 from a third, Hellcats, Corsairs, Helldivers and Avengers from 15 carriers. Some groups get lost in bad weather.',
      atJ('10:00', { approx: true, facts: [['Aircraft launched', 'About 386'], ['Back-up', 'Deyo’s 6 battleships, 7 cruisers, 21 destroyers']] })),
    ev('1945-04-07', 'The first wave strikes the Ten-Go force', 'attack', P.tenGo, 9,
      'Lookouts spot the first American planes at 12:32. With no Japanese fighters to oppose them, the attackers circle just out of range and line up their runs. At 12:46 a torpedo stops Yahagi dead in the water, and Yamato takes two bombs and a torpedo in the first wave. In the next two waves, almost all the torpedoes hit her port side.',
      atJ('12:32')),
    ev('1945-04-07', 'Yamato blows up', 'loss', P.tenGo, 9,
      'Itō cancels the mission and orders the ship abandoned at 14:02; Yahagi sinks at 14:05. Yamato capsizes at 14:20 and three minutes later her magazines explode, sending up a cloud seen in Kagoshima. Four destroyers also go down. Between 3,700 and 4,250 Japanese sailors die, against 10 American aircraft and 12 men lost.',
      atJ('14:23', { facts: [['Japanese ships sunk', 'Yamato, Yahagi, 4 destroyers'], ['Japanese dead', '3,700–4,250'], ['U.S. losses', '10 aircraft, 12 men']],
        link: { timeline: 'yamato', event: '1945-04-07-yamato-sinks', label: 'See the end of Yamato' } })),
    ev('1945-04-07', 'Kamikazes hit Hancock and Maryland', 'attack', P.fleet, 8,
      'While Yamato is dying, about 115 Japanese aircraft, many of them kamikazes, attack the American ships through the day. They hit the carrier Hancock, the battleship Maryland and the destroyer Bennett. About 100 of the attackers are lost.',
      ord('16:00')),
    ev('1945-04-07', 'The Marines seal off the Motobu Peninsula', 'movement', P.ishikawa, 9,
      'The 6th Marine Division races up the Ishikawa Isthmus well ahead of schedule and cuts off the Motobu Peninsula, where most of the Japanese troops in the north, Colonel Takehiko Udo’s force, are dug in.',
      { approx: true }),

    // ---------- The outer Shuri defences ----------
    ev('1945-04-08', 'The outposts of the Shuri Line', 'attack', P.outposts, 11,
      'Turning south, the 96th and 7th Infantry Divisions run into fortified positions at Cactus Ridge and a rocky pinnacle near Arakachi. By nightfall they have cleared these and others, at a cost of more than 1,500 casualties, killing or capturing about 4,500 Japanese. They are only outposts guarding the main Shuri Line.'),
    ev('1945-04-09', 'Kakazu Ridge', 'attack', P.kakazu, 12,
      'The 96th Division attacks Kakazu Ridge, two hills joined by a saddle in Shuri’s outer defences. The Japanese fight from prepared caves and reverse-slope positions and the attack is thrown back. Private First Class Edward J. Moskala destroys two machine-gun nests, stays behind to cover the withdrawal and is killed going back for the wounded. The 27th Infantry Division lands the same day.',
      { link: { timeline: 'medal-of-honor', event: '1945-04-09-moskala-edward-j', label: 'See Moskala in Medal of Honor' } }),
    ev('1945-04-12', 'Ushijima’s night counterattack', 'attack', P.shuriLine, 10,
      'Swayed by his aggressive chief of staff, Lieutenant General Isamu Chō, Ushijima attacks along the whole front at night. After hard close fighting the attackers fall back, try again the next night and are beaten off once more on 14 April. The 32nd Army’s staff conclude that massed Japanese troops cannot survive American firepower and return to the defensive.',
      ord('20:00')),
    ev('1945-04-13', 'The Marines reach Hedo Point', 'movement', P.hedo, 10,
      'The 2nd Battalion, 22nd Marines, reaches Hedo Point, the northern tip of Okinawa, less than two weeks after the landing.'),

    // ---------- Ie Shima and the north ----------
    ev('1945-04-16', 'The 77th Division lands on Ie Shima', 'invasion', P.ieShima, 11,
      'The 77th Infantry Division assaults Ie Shima, a small, flat island off the end of the Motobu Peninsula with an airfield. Alongside the usual hazards, it faces kamikaze attacks and even local women armed with spears.'),
    ev('1945-04-18', 'Ernie Pyle is killed on Ie Shima', 'loss', P.pyle, 12,
      'The war correspondent Ernie Pyle, the best-known chronicler of the ordinary American soldier, came ashore with the 305th Infantry the day before. Riding in a jeep toward a new command post, his party is fired on by a Japanese machine gun. When Pyle raises his head from a ditch, a bullet kills him instantly. The soldiers of the 77th later put up a memorial at the spot, which still stands.',
      { facts: [['Born', '3 August 1900, Indiana'], ['Pulitzer Prize', '1944, for his front-line reporting']] }),
    ev('1945-04-18', 'Yae-Take is cleared', 'attack', P.motobu, 11,
      'After heavy fighting in the ravines and rocky ridges of Mount Yae-Take, at the heart of the Motobu Peninsula, the 6th Marine Division clears the last organized Japanese resistance in the north. The division has taken the Ishikawa Isthmus, Nago and the peninsula in 13 days.'),
    ev('1945-04-19', 'The biggest barrage of the Pacific War', 'attack', P.kakazu, 11,
      'Major General John R. Hodge opens a new offensive with 324 guns, joined by battleships, cruisers and destroyers, and 650 Navy and Marine aircraft. The Japanese wait it out in caves on the reverse slopes and come out to meet the infantry. A tank thrust around Kakazu Ridge is cut off from its infantry and loses 22 tanks; XXIV Corps suffers 720 casualties without breaking through.',
      { facts: [['Guns', '324, the largest barrage in the Pacific'], ['Tanks lost', '22'], ['XXIV Corps casualties', '720']] }),
    ev('1945-04-21', 'Ie Shima is secured', 'attack', P.ieShima, 11,
      'After heavy fighting, Ie Shima is declared secure. Its airfield becomes another base for operations against Japan.'),

    // ---------- Late April and the 4 May offensive ----------
    ev('1945-04-29', 'Desmond Doss on the Maeda Escarpment', 'service', P.maeda, 12,
      'The 77th Division attacks the Maeda Escarpment, a 400-foot cliff the 96th Division called Hacksaw Ridge. When fire drives the troops off the top, the unarmed medic Private First Class Desmond Doss, a conscientious objector, stays with the wounded and lowers them one by one down the cliff on a rope litter. Over the next three weeks he saves an estimated 75 to 100 men, until he is badly wounded near Shuri on 21 May.',
      { facts: [['Unit', 'Medical Detachment, 307th Infantry, 77th Infantry Division'], ['Award', 'Medal of Honor, the first to a conscientious objector']],
        link: { timeline: 'medal-of-honor', event: '1945-04-29-doss-desmond-t', label: 'See Doss in Medal of Honor' } }),
    ev('1945-04-30', 'The fleet’s toll after five weeks', 'loss', P.fleet, 8,
      'Since 26 March, 20 American ships have been sunk and 157 damaged by enemy action, mostly smaller ships such as picket destroyers and landing craft. The Japanese have lost more than 1,100 aircraft to the naval forces alone. At the front, fresh divisions take over: the 1st Marine Division relieves the 27th, the 77th relieves the 96th, and the Tenth Army takes direct control of the battle.',
      { approx: true }),
    ev('1945-05-04', 'The Japanese counteroffensive fails', 'attack', P.shuriLine, 10,
      'Chō persuades Ushijima to try again. The 32nd Army attacks with landings on the coasts behind the American lines and brings its artillery into the open to fire some 13,000 rounds in support. American counter-battery fire destroys dozens of guns and the offensive collapses. Ushijima returns to the defence, the strategy his operations officer, Colonel Hiromichi Yahara, had urged all along.'),

    // ---------- May: the Shuri Line ----------
    ev('1945-05-11', 'Buckner’s general offensive', 'attack', P.shuriLine, 10,
      'Buckner launches a new attack along the whole line, a frontal assault on the dug-in Japanese that will mean ten days of savage fighting. He hopes to turn both ends of the Shuri defences and trap the main Japanese force.',
      ord('07:00')),
    ev('1945-05-11', 'Two kamikazes wreck Bunker Hill', 'loss', P.tf58, 8,
      'In the morning, a Zero drops a bomb through the flight deck of Mitscher’s flagship and crashes among fuelled aircraft; thirty seconds later a second dives into the deck near the island and its bomb bursts in a pilots’ ready room. 396 men are killed or missing and 264 wounded, among them 14 of Mitscher’s staff. Mitscher transfers to Enterprise; Bunker Hill steams for home and is still under repair when the war ends.',
      { ...ord('10:00'), facts: [['Killed or missing', '396 (43 never found)'], ['Wounded', '264'], ['Aircraft lost', '78']] }),
    ev('1945-05-13', 'Conical Hill falls', 'attack', P.conical, 12,
      'Troops of the 96th Infantry Division and the 763rd Tank Battalion take Conical Hill, rising 145 m above the coastal plain at the eastern end of the Shuri Line and held by about 1,000 Japanese.'),
    ev('1945-05-14', 'A kamikaze hits Enterprise', 'loss', P.tf58, 8,
      'Three days after Bunker Hill, a kamikaze strikes Mitscher’s new flagship, Enterprise, forcing him to move again. Like Bunker Hill and Franklin, which was crippled by bombs on 19 March, she is out of the war. No carrier, battleship or cruiser will be sunk by kamikazes at Okinawa, but these three fleet carriers alone lose more aircraft than the U.S. lost at Midway.'),
    ev('1945-05-16', 'Sugar Loaf Hill', 'attack', P.sugarLoaf, 12,
      'At the western end of the Shuri Line, the 6th Marine Division assaults the Sugar Loaf Hill complex, three hills raked by mortar and artillery fire. 16 May is the bitterest day: the division suffers 576 casualties attacking with everything it has, and fails. After about a week of fighting the hill is finally taken, and with Conical Hill gone too the Japanese at Shuri are exposed on both flanks.',
      { facts: [['6th Marine Division casualties', '576 on 16 May alone']] }),
    ev('1945-05-24', 'Commandos crash-land on Yontan', 'attack', P.yontan, 12,
      'In Operation Gi-gou, bombers carrying Giretsu commandos fly in at night to destroy the airfields used against the kamikazes. Most turn back or are shot down, but five crash-land on Yontan. The surviving raiders destroy nine aircraft and 70,000 gallons of fuel and kill two Americans before they are wiped out.',
      { ...ord('22:00'), facts: [['Aircraft destroyed', '9 (29 damaged)'], ['Fuel destroyed', '70,000 US gallons']] }),
    ev('1945-05-24', 'The Marines enter the ruins of Naha', 'movement', P.naha, 11,
      'Over four days, the 6th Marine Division carefully occupies Naha, Okinawa’s largest city. They find it ruined and largely deserted.',
      ord('10:00')),
    ev('1945-05-25', 'Mississippi shells Shuri Castle', 'attack', P.shuri, 12,
      'The battleship Mississippi begins three days of shelling on Shuri Castle, the old palace of the Ryukyu kings, above the tunnels of the 32nd Army’s headquarters. By 27 May it is burning. Monsoon rains have turned the battlefield into a morass of mud and unburied dead, bogging down tanks and the evacuation of the wounded.'),
    ev('1945-05-26', 'The 32nd Army slips away south', 'movement', P.shuriLine, 10,
      'Aerial observers see large troop movements south of Shuri. Under cover of darkness and the monsoon, the 32nd Army withdraws nearly 30,000 men to a last line on the Kiyan Peninsula. Some 5,000 wounded who cannot walk are left to kill themselves in the bunkers beneath Shuri. The withdrawal carries the war into the south, where thousands of civilians have taken refuge.',
      { paths: [{ label: 'Withdrawal to the Kiyan Peninsula (approximate)', kind: 'route', coords: [[26.217, 127.72], [26.17, 127.72], [26.12, 127.71], [26.095, 127.725]] }] }),
    ev('1945-05-29', 'The Marines take Shuri Castle', 'attack', P.shuri, 12,
      'Company A, 1st Battalion, 5th Marines, walks into the ruined castle against little resistance at 10:15. It lies outside the 1st Marine Division’s zone, and only frantic work by the 77th Division’s staff prevents an air and artillery strike on the Marines. A company officer raises a Confederate battle flag; Buckner has it replaced with the Stars and Stripes.',
      at('10:15')),

    // ---------- June: the end in the south ----------
    ev('1945-06-04', 'Landing on the Oroku Peninsula', 'invasion', P.oroku, 11,
      'Elements of the 6th Marine Division make a shore-to-shore landing on the Oroku Peninsula, held by Rear Admiral Minoru Ōta’s naval troops. Ōta had begun to withdraw south, destroying his heavy weapons, before being ordered back, so many of his men now have no rifles.'),
    ev('1945-06-06', 'Ōta’s telegram for the Okinawans', 'political', P.oroku, 12,
      'At 20:16 Ōta sends a final telegram to the Navy describing how the Okinawan people have given everything to the war, with their land burned bare and food running out by the end of June. He asks that they be given special consideration in the future.',
      at('20:16')),
    ev('1945-06-11', 'Buckner calls on Ushijima to surrender', 'political', P.south, 10,
      'Leaflets carrying Buckner’s appeal to surrender are dropped on the Japanese positions. Ushijima refuses. The same day, the 6th Marine Division surrounds Ōta’s headquarters on Oroku.'),
    ev('1945-06-13', 'Ōta dies in his tunnels', 'loss', P.oroku, 12,
      'Ōta shoots himself in the underground naval headquarters on Oroku. Some 4,000 of his sailors also die by suicide in the hand-dug tunnels or in last charges from the cave mouths. He is promoted to vice admiral after his death.'),
    ev('1945-06-17', 'Trapped at the southern tip', 'loss', P.south, 11,
      'The remnants of the 32nd Army are squeezed into a small pocket southeast of Itoman, together with masses of civilians. Japanese soldiers take their food, drive them from their shelters and use them as shields; thousands of families kill themselves, some leaping from the southern cliffs. This last stage brings the greatest slaughter of the battle.',
      { facts: [['Okinawans killed', 'At least 149,425 killed, missing or dead by coerced suicide, by local count'], ['Buildings destroyed', 'At least 90%']] }),
    ev('1945-06-18', 'Buckner is killed', 'loss', P.kuniyoshi, 12,
      'Watching Marines advance on Ibaru Ridge from a forward observation post, Buckner is hit by fragments of coral thrown up when a small Japanese shell strikes the rock beside him. He dies at an aid station, the highest-ranking American killed by enemy fire in the war. Marine Major General Roy Geiger takes command, the only Marine ever to command a U.S. field army in combat.',
      { ...ord('13:00'), facts: [['Successor', 'Maj. Gen. Roy Geiger, USMC'], ['Rank', 'Lieutenant general; promoted to general after his death']] }),
    ev('1945-06-18', 'Ushijima’s last orders', 'political', P.hill89, 12,
      'From his cave on Hill 89, Ushijima orders his troops to break through the American lines in small groups and join guerrilla bands in the north. The Himeyuri nursing unit is dissolved the same day, its students simply told to go home through the crossfire.',
      ord('18:00')),
    ev('1945-06-19', 'Himeyuri students die at Ihara', 'loss', P.ihara, 12,
      'Before dawn, an American attack with white phosphorus on the Ihara surgical cave kills 5 teachers and 46 students hiding inside. Within a week of the dissolution about 80% of the girls and teachers still on the island are dead; in all, 211 students and 16 teachers are killed.',
      ord('04:00')),
    ev('1945-06-19', 'General Easley is killed', 'loss', P.kuniyoshi, 12,
      'Brigadier General Claudius Miller Easley, commander of the 96th Infantry Division, crawls up a knoll to find a machine gun that has wounded one of his aides and is killed by a burst from it, the second American general to die on Okinawa in two days.',
      ord('12:00')),
    ev('1945-06-21', 'Organized resistance collapses', 'attack', P.south, 10,
      'The last organized Japanese resistance ends, though many soldiers go into hiding. For the first time in the Pacific War, Japanese troops surrender in thousands: 7,401 regulars and 3,400 Okinawan conscripts are taken during the battle, many of them Okinawans who never absorbed the no-surrender creed.'),
    ev('1945-06-22', 'Ushijima and Chō take their own lives', 'loss', P.hill89, 12,
      'After a farewell banquet in the command cave, Ushijima, in full dress uniform, and Chō, in a white kimono, go out to a ledge above the sea in the early hours and commit seppuku. Yahara asked to die with them, but Ushijima ordered him to live and tell the truth about the battle. Captured in July, Yahara becomes the most senior Japanese officer to survive Okinawa.',
      ord('04:00')),
    ev('1945-06-22', 'The flag goes up: Okinawa is taken', 'political', P.south, 9,
      'The Tenth Army holds a flag-raising ceremony to mark the end of organized resistance after 82 days. It is the bloodiest battle of the Pacific War. Mopping-up runs from 23 to 30 June, and on 23 June General Joseph Stilwell takes over the Tenth Army from Geiger.',
      { ...ord('10:00'),
        facts: [['U.S. killed or missing', 'Over 12,000 (4,907 Navy, 4,675 Army, 2,938 Marines)'], ['Japanese military dead', 'About 110,000 (U.S. estimate, incl. Okinawan conscripts)'], ['Ships', '36 Allied sunk, 368 damaged; 16 Japanese warships sunk'], ['Aircraft', '768 U.S. lost; roughly 1,430 Japanese']],
        link: { timeline: 'road-to-tokyo-bay', event: '1945-06-22-okinawa-falls', label: 'See this in Road to Tokyo Bay' } }),

    // ---------- Aftermath ----------
    ev('1945-07-29', 'Callaghan is the last ship sunk', 'loss', P.fleet, 8,
      'On radar picket duty off Okinawa, the destroyer Callaghan is hit by an obsolete wood-and-fabric biplane trainer flown as a kamikaze. She is the last American warship sunk in the war.'),
    ev('1945-08-15', 'Ugaki’s last flight', 'loss', P.iheya, 9,
      'Hours after Japan announces its surrender, Vice Admiral Matome Ugaki, commander of the 5th Air Fleet that directed the kamikaze campaign from Kyushu, flies in one of the last kamikaze raids and is killed near Iheyajima.',
      { approx: true }),
    ev('1945-09-07', 'Surrender in the Ryukyus', 'political', P.kadena, 10,
      'The formal surrender ceremony for the Ryukyus is held near Kadena airfield. Okinawa, its towns, its records and its castle largely destroyed, passes under American military government.'),
    ev('1995-06-23', 'The Cornerstone of Peace', 'life', P.mabuni, 12,
      'Okinawa unveils the Cornerstone of Peace at Mabuni, where the last fighting took place. It lists every known person who died in the battle, soldier or civilian, Japanese, American or other. By 2024 it carries more than 242,000 names, about 149,000 of them Okinawan.',
      { approx: true, facts: [['Names (2023)', '242,046: 149,634 Okinawans, 77,823 Japanese soldiers, 14,010 Americans, and others']] }),
  ];

  // ---------- Shot list ----------
  // Camera direction (see "Shots" in app.js). Events not listed use the automatic framing.
  const pt = (place) => [place.lat, place.lng];
  const SHOTS = {
    'The 77th Division lands in the Kerama Islands': { shot: 'wide', transition: 'pull-back', frame: [pt(P.kerama), pt(P.hagushi)] },
    // L-Day: the beaches, the feint and the airfields in one frame.
    'L-Day: the Tenth Army lands at Hagushi': { scene: 'l-day', frame: [pt(P.minatoga), pt(P.yontan)] },
    'A feint off the Minatoga beaches': { scene: 'l-day' },
    'Kadena and Yontan airfields fall within hours': { scene: 'l-day' },
    // Ten-Go: from the Inland Sea to the sinking, with Okinawa in view.
    'Kikusui: the massed kamikaze attacks begin': { shot: 'wide', frame: [pt(P.kyushu), pt(P.fleet)] },
    'Mitscher launches against Yamato': { scene: 'ten-go', frame: [pt(P.tenGo)] },
    'The first wave strikes the Ten-Go force': { scene: 'ten-go' },
    'Yamato blows up': { shot: 'tight', transition: 'fly' },
    // The Shuri Line, east to west.
    'Ushijima’s night counterattack': { scene: 'shuri-line', frame: [pt(P.kakazu), pt(P.conical), pt(P.sugarLoaf)] },
    'The Japanese counteroffensive fails': { scene: 'shuri-line' },
    'Buckner’s general offensive': { scene: 'shuri-line' },
    'Sugar Loaf Hill': { shot: 'tight' },
    'The 32nd Army slips away south': { shot: 'wide', frame: [pt(P.shuri), pt(P.hill89)] },
    // The end on the southern tip.
    'Buckner is killed': { scene: 'the-end', frame: [pt(P.kuniyoshi), pt(P.hill89)] },
    'Ushijima’s last orders': { scene: 'the-end' },
    'Himeyuri students die at Ihara': { scene: 'the-end' },
    'General Easley is killed': { scene: 'the-end' },
    'Ushijima and Chō take their own lives': { shot: 'tight', transition: 'fly' },
  };
  const events = WW2.events.okinawa;
  for (const [title, shot] of Object.entries(SHOTS)) {
    const e = events.find((x) => x.title === title);
    if (!e) throw new Error(`okinawa shot list: no event titled "${title}"`);
    Object.assign(e, shot);
  }
})();
