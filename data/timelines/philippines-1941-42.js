// Timeline: The Fall of the Philippines (War in the Pacific).
// The Japanese invasion of the Philippines, 8 December 1941 to June 1942: the destruction of the
// Far East Air Force at Clark and Iba Fields, the landings on Luzon and Mindanao, the withdrawal
// to Bataan and Manila declared an open city, the battles on Bataan, MacArthur's escape, the fall
// of Bataan and the Death March, the fall of Corregidor and the surrender in the southern islands.
// Checked against the English Wikipedia articles "Philippines campaign (1941–1942)", "Attack on
// Clark Field", "Japanese invasion of Davao", "Battle of Bataan", "Battle of Corregidor",
// "Bataan Death March", "Camp O'Donnell", "Douglas MacArthur's escape from the Philippines",
// "Japanese invasion of Cebu" and the biographies of Jonathan M. Wainwright, Masaharu Homma,
// Edward P. King and William F. Sharp (October 2026).
//
// Times are Philippine local times (shown as Manila time) as the sources give them. The sources
// differ by a few minutes on the Clark Field raid and by a day on the Lamon Bay landing; where
// they do, the dedicated article is followed and the event is marked approximate.
// Event schema: see data/timelines/attack-on-hawaii.js.

(function () {
  const P = {
    manila: { name: 'Manila, Luzon', lat: 14.59, lng: 120.98 },
    clark: { name: 'Clark Field, Luzon', lat: 15.19, lng: 120.56 },
    iba: { name: 'Iba Field, Zambales, Luzon', lat: 15.33, lng: 119.97 },
    davao: { name: 'Davao, Mindanao', lat: 7.07, lng: 125.61 },
    batan: { name: 'Batan Island, Batanes', lat: 20.45, lng: 121.97 },
    aparri: { name: 'Aparri, northern Luzon', lat: 18.36, lng: 121.64 },
    vigan: { name: 'Vigan, northern Luzon', lat: 17.57, lng: 120.39 },
    cavite: { name: 'Cavite Navy Yard, Manila Bay', lat: 14.49, lng: 120.91 },
    legazpi: { name: 'Legazpi, southern Luzon', lat: 13.14, lng: 123.74 },
    lingayenApproach: { name: 'Approaches to Lingayen Gulf (approx.)', lat: 16.8, lng: 120.0 },
    agoo: { name: 'Agoo, La Union, Lingayen Gulf', lat: 16.32, lng: 120.36 },
    rosario: { name: 'Rosario, La Union', lat: 16.23, lng: 120.49 },
    lamon: { name: 'Lamon Bay, southern Luzon', lat: 14.0, lng: 121.9 },
    corregidor: { name: 'Corregidor, Manila Bay', lat: 14.38, lng: 120.58 },
    malinta: { name: 'Malinta Tunnel, Corregidor', lat: 14.39, lng: 120.59 },
    calumpit: { name: 'Calumpit bridges, Pampanga River', lat: 14.92, lng: 120.77 },
    porac: { name: 'Porac–Guagua line, Pampanga', lat: 15.0, lng: 120.58 },
    layac: { name: 'Layac Junction, neck of Bataan', lat: 14.83, lng: 120.47 },
    abucay: { name: 'Abucay, Bataan', lat: 14.72, lng: 120.53 },
    mauban: { name: 'Mauban line, western Bataan', lat: 14.73, lng: 120.28 },
    bataan: { name: 'Bataan Peninsula', lat: 14.6, lng: 120.45 },
    pilarBagac: { name: 'Pilar–Bagac line, Bataan', lat: 14.62, lng: 120.47 },
    points: { name: 'Quinauan Point, west coast of Bataan (approx.)', lat: 14.47, lng: 120.4 },
    pockets: { name: 'Tuol River, I Corps line, Bataan (approx.)', lat: 14.63, lng: 120.42 },
    samat: { name: 'Mount Samat, Bataan', lat: 14.605, lng: 120.51 },
    mariveles: { name: 'Mariveles, Bataan', lat: 14.43, lng: 120.49 },
    lamao: { name: 'Lamao, Bataan', lat: 14.52, lng: 120.6 },
    sanFernando: { name: 'San Fernando, Pampanga', lat: 15.03, lng: 120.69 },
    odonnell: { name: 'Camp O’Donnell, Capas, Tarlac', lat: 15.3759, lng: 120.5119 },
    tagauayan: { name: 'Tagauayan Island, Cuyo Islands (approx.)', lat: 10.95, lng: 121.15 },
    cagayan: { name: 'Cagayan, Mindanao', lat: 8.48, lng: 124.65 },
    delMonte: { name: 'Del Monte Field, Mindanao', lat: 8.36, lng: 124.83 },
    batchelor: { name: 'Batchelor Airfield, Northern Territory', lat: -13.05, lng: 131.03 },
    terowie: { name: 'Terowie, South Australia', lat: -33.15, lng: 138.9 },
    melbourne: { name: 'Spencer Street station, Melbourne', lat: -37.818, lng: 144.952 },
    cebu: { name: 'Pinamungajan, Cebu', lat: 10.27, lng: 123.58 },
    northPoint: { name: 'North Point, tail of Corregidor', lat: 14.392, lng: 120.605 },
    mindanao: { name: 'Mindanao', lat: 8.0, lng: 125.0 },
    tarlac: { name: 'Tarlac, Luzon', lat: 15.48, lng: 120.6 },
  };

  const ev = (date, title, type, location, zoom, summary, extra = {}) => ({
    id: extra.id || `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}`,
    date, title, type, location, zoom, summary,
    theater: extra.theater || 'Pacific',
    ...extra,
  });
  const at = (time, extra = {}) => ({ time, tz: 'PHT', ...extra });
  const ord = (sortTime) => ({ sortTime, tz: 'PHT' }); // order within the day only; no time shown

  WW2.events['philippines-1941-42'] = [
    // ---------- 8 December 1941 ----------
    ev('1941-12-08', 'News of Pearl Harbor reaches Manila', 'intelligence', P.manila, 10,
      'Asiatic Fleet headquarters learns of the attack on Pearl Harbor at about 02:40 but does not pass it on to the Army. An hour later MacArthur’s chief of staff, Brigadier General Richard Sutherland, hears the news on a commercial radio broadcast and wakes MacArthur.',
      at('03:40', { approx: true, facts: [['Commander', 'General Douglas MacArthur, U.S. Army Forces in the Far East (USAFFE)'], ['Air force', 'Far East Air Force: 35 B-17s, 91 P-40s and older types']] })),
    ev('1941-12-08', 'Brereton is refused a strike on Formosa', 'political', P.manila, 10,
      'Major General Lewis H. Brereton of the Far East Air Force asks to send his B-17s against the Japanese airfields on Formosa at first light, as the war plan foresees. Sutherland refuses and will not let him see MacArthur; the bombers are to wait for orders.',
      at('05:00')),
    ev('1941-12-08', 'Carrier planes attack Davao', 'attack', P.davao, 11,
      'Bombers and fighters from the carrier Ryūjō strike Davao Gulf on Mindanao, hoping to catch American warships. They find only the seaplane tender William B. Preston and destroy two of her PBY flying boats.',
      { ...at('06:00'), wiki: { 'William B. Preston': 'USS_William_B._Preston' } }),
    ev('1941-12-08', 'Japanese troops land on Batan Island', 'invasion', P.batan, 9,
      'Japanese naval infantry occupy Batan Island, about 190 km off the north coast of Luzon, the first landing of the invasion. The aim is to secure an airstrip for fighters.',
      ord('07:00')),
    ev('1941-12-08', 'The B-17s land to refuel', 'movement', P.clark, 12,
      'After circling since 08:30 to avoid being caught on the ground, the bombers return to Clark Field. MacArthur has authorised an afternoon raid on southern Formosa, and the B-17s are refuelled and loaded with bombs. Their fighter cover also lands, short of fuel.',
      at('10:30', { facts: [['Strike authorised', '10:14'], ['Planned take-off', '14:00']] })),
    ev('1941-12-08', 'Iba radar detects the raid', 'intelligence', P.iba, 11,
      'The radar at Iba Field picks up the incoming Japanese formations about 210 km out. The warning reaches Clark Field late and confused, and the fighters that do take off are sent to the wrong places.',
      at('11:30')),
    ev('1941-12-08', 'Clark Field caught on the ground', 'attack', P.clark, 13,
      'More than nine hours after the news of Pearl Harbor, Japanese naval bombers from Formosa find the B-17s parked at Clark Field. Flying above the reach of the anti-aircraft guns, they bomb the field from 20,000 feet, and Zero fighters then strafe what is left. Twelve of the seventeen bombers on the ground are destroyed. (The campaign article puts the attack at 12:40.)',
      at('12:35', { approx: true,
        facts: [['Attackers', '53 G3M and G4M bombers, 34 Zeros'], ['B-17s at Clark', '12 destroyed, 4 damaged, 1 undamaged']],
        link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1941-12-08-clark-field-caught-on-the-ground', label: 'See this in Pearl Harbor to Guadalcanal' } })),
    ev('1941-12-08', 'Iba Field is wiped out', 'loss', P.iba, 12,
      'Minutes later 53 more bombers and their escorts hit Iba, catching the 3rd Pursuit Squadron’s P-40s in their landing pattern. The destruction is so complete that the Zeros fly on to Clark to use up their ammunition. In a single raid the Far East Air Force loses about half its aircraft, among them 34 P-40s. No inquiry follows.',
      at('12:42', { approx: true })),

    // ---------- December landings ----------
    ev('1941-12-10', 'Landings in northern Luzon', 'invasion', P.aparri, 8,
      'Japanese troops land at Aparri, Vigan and Gonzaga on the north coast of Luzon and on Camiguin Island to seize airfields. In the Far East Air Force’s last co-ordinated action, B-17s and fighters damage two transports, the cruiser Naka and a destroyer, and sink a minesweeper. MacArthur does not contest these landings, judging that they are not the main attack.',
      { ...ord('06:00'), paths: [{ label: 'Northern landings', kind: 'route', coords: [[18.36, 121.64], [17.57, 120.39]] }] }),
    ev('1941-12-10', 'Cavite Navy Yard is bombed', 'attack', P.cavite, 12,
      'Japanese air raids heavily damage the U.S. naval base at Cavite on Manila Bay. Admiral Thomas C. Hart withdraws most of the Asiatic Fleet’s surface ships to the south, leaving the submarines to contest Japanese control of the sea.',
      ord('13:00')),
    ev('1941-12-12', 'Landing at Legazpi', 'invasion', P.legazpi, 9,
      'Early in the morning 2,500 men of the 16th Division land at Legazpi in southeastern Luzon, about 240 km from the nearest American and Filipino troops.'),
    ev('1941-12-17', 'The surviving B-17s leave for Australia', 'movement', P.delMonte, 6,
      'Between 17 and 20 December the 14 remaining B-17s are withdrawn to Australia. The Far East Air Force has been all but destroyed in nine days; on Luzon a handful of fighters are kept flying with parts taken from wrecks. On 17 December PT boats also rescue 296 survivors of the refugee ship SS Corregidor, sunk by a mine in Manila Bay.',
      { approx: true, wiki: { 'SS Corregidor': 'HMS_Engadine_(1911)' } }),
    ev('1941-12-20', 'Japanese troops take Davao', 'invasion', P.davao, 11,
      'A 5,000-man force from Palau, borrowed from the 16th Army, lands north and southwest of Davao from 04:00. The partly trained Filipino defenders have no artillery and withdraw into the hills by mid-morning; by 15:00 the city and its airfield are in Japanese hands. (The landing is often dated 19 December, the day the convoy arrived.)',
      at('04:00')),
    ev('1941-12-20', 'Submarines meet the Lingayen convoy', 'attack', P.lingayenApproach, 7,
      'The submarine Stingray sights Homma’s invasion convoy of 85 transports and its escorts. She, Saury and Salmon fire torpedoes into it, but most fail to explode because of the faulty Mark 14 detonators, and only two troop ships are sunk before destroyers drive the boats off.',
      { ...ord('12:00'), wiki: { Stingray: 'USS_Stingray_(SS-186)', Saury: 'USS_Saury_(SS-189)', Salmon: 'USS_Salmon_(SS-182)' },
        link: { timeline: 'pacific-submarines', event: '1941-12-08-asiatic-fleet-s-submarines-go-to-war', label: 'See the Asiatic Fleet boats in Submarine Operations' } }),

    // ---------- Lingayen and Lamon Bay ----------
    ev('1941-12-22', 'The main landings at Lingayen Gulf', 'invasion', P.agoo, 9,
      'Early in the morning, Lieutenant General Masaharu Homma’s Fourteenth Army lands 43,110 men of the 48th Division and a regiment of the 16th Division, with about 90 tanks, at Agoo, Caba and Bauang on the east shore of Lingayen Gulf. Wainwright’s poorly trained Filipino divisions can neither stop them on the beaches nor hold them inland.',
      { ...ord('05:00'), facts: [['Japanese commander', 'Lt. Gen. Masaharu Homma'], ['Landing force', '48th Division, part of the 16th Division, about 90 tanks']],
        paths: [{ label: 'Invasion fleet from Formosa (approximate)', kind: 'route', coords: [[22.6, 120.3], [19.5, 119.8], [16.32, 120.36]] }] }),
    ev('1941-12-23', 'The 26th Cavalry fights at Rosario', 'attack', P.rosario, 11,
      'The Philippine Scouts of the 26th Cavalry Regiment, the best-trained unit in the north, make a determined stand at Rosario but are forced back with heavy losses. By nightfall the Japanese are 16 km inland.',
      { approx: true, ...ord('12:00') }),
    ev('1941-12-23', 'MacArthur orders the withdrawal to Bataan', 'political', P.manila, 8,
      'In the late afternoon Wainwright telephones that further defence of the Lingayen beaches is “impracticable”. Rather than make a stand on the Agno River, MacArthur abandons his plan to fight on the beaches and falls back on the old War Plan Orange: that night he tells his commanders that “WPO-3 is in effect”. The army is to withdraw by stages into the Bataan Peninsula.',
      ord('21:00')),
    ev('1941-12-24', 'Landings at Lamon Bay', 'invasion', P.lamon, 9,
      'Some 7,000 men of the 16th Division land at three points on Lamon Bay in southern Luzon. Brigadier General George Parker’s South Luzon Force is spread thin with no artillery on that coast and cannot seriously resist. The Japanese turn north toward Manila. (The Bataan article dates this landing to 23 December.)',
      { approx: true, ...ord('06:00') }),
    ev('1941-12-24', 'MacArthur moves to Corregidor', 'movement', P.malinta, 12,
      'That night President Manuel L. Quezon, his government and family, and MacArthur’s headquarters are taken to the island fortress of Corregidor, where they settle in the Malinta Tunnel. Subic Bay and its fort are abandoned the same day; within days the 4th Marine Regiment, withdrawn from Olongapo, becomes Corregidor’s main fighting force.',
      ord('21:00')),
    ev('1941-12-26', 'Manila is declared an open city', 'political', P.manila, 11,
      'MacArthur’s proclamation declaring Manila an open city is published in the newspapers and broadcast by radio. The Japanese are not formally told and learn of it from the broadcasts. Because the port is still being used to ship supplies to Bataan and Corregidor, they bomb the harbour area from the next day.'),
    ev('1941-12-29', 'Corregidor is bombed', 'attack', P.corregidor, 12,
      'Japanese aircraft begin a week of raids on Corregidor that destroy half its wooden buildings, its electric railway and its water mains. With about 15,000 people on the island and food for six to eight weeks, everyone goes on half rations.'),

    // ---------- Withdrawal into Bataan ----------
    ev('1942-01-01', 'The Calumpit bridges are blown', 'movement', P.calumpit, 12,
      'The South Luzon Force has leapfrogged north by stages and crossed the steel bridges over the deep Pampanga River at Calumpit. Philippine Scout engineers demolish them behind it. Japanese air commanders had refused the 48th Division’s requests to bomb the bridges and trap the retreating troops.'),
    ev('1942-01-02', 'Holding the road to Bataan', 'attack', P.porac, 10,
      'From 2 to 5 January the 11th and 21st Divisions of the Philippine Army, the 26th Cavalry and the M3 Stuart tanks of the Provisional Tank Group fight delaying actions on the Porac–Guagua line, keeping the road to Dinalupihan open for the troops from the south. The 194th Tank Battalion loses half its strength; the tanks are the last units into Bataan.',
      { approx: true }),
    ev('1942-01-06', 'Layac Junction is given up', 'movement', P.layac, 11,
      'Japanese troops attack the covering force at Layac Junction, at the neck of the peninsula, and it withdraws that night. The retreat into Bataan is complete. About 15,000 Americans, 65,000 Filipinos and 26,000 refugees are packed into the peninsula, with food for only about two months.'),

    // ---------- The battle of Bataan ----------
    ev('1942-01-07', 'The battle for Bataan begins', 'invasion', P.bataan, 9,
      'Manila is in Japanese hands and the defenders hold a line across Bataan from Abucay on Manila Bay over Mount Natib to Mauban on the South China Sea. In a costly misjudgement, Japan sends the 48th Division and the 5th Air Group away to the Netherlands East Indies, leaving the 65th Brigade, a garrison unit, to finish the job.',
      { facts: [['I Corps (west)', 'Wainwright, 22,500 men'], ['II Corps (east)', 'Parker, 25,000 men'], ['Japanese on Bataan', 'about 23,000']] }),
    ev('1942-01-09', 'Nara attacks the Abucay line', 'attack', P.abucay, 11,
      'Akira Nara’s 65th Brigade opens its attack on II Corps, aiming first at the Philippine Scouts of the 57th Infantry and then at the corps’ left flank on the slopes of Mount Natib.'),
    ev('1942-01-10', 'MacArthur visits the front', 'political', P.bataan, 10,
      'MacArthur tours the Bataan positions along the East Road from Limay to Abucay to raise morale, offering to bet anyone fifty dollars that they will be back in Manila by Easter. The same day Japanese troops occupy Olongapo.'),
    ev('1942-01-12', 'Nininger falls at Abucay Hacienda', 'loss', P.abucay, 12,
      'In fierce hand-to-hand fighting, Second Lieutenant Alexander R. Nininger of the 57th Infantry forces his way into Japanese foxholes with a rifle and grenades and is killed, helping his unit retake Abucay Hacienda. He is awarded the Medal of Honor posthumously.',
      { link: { timeline: 'medal-of-honor', event: '1942-01-12-nininger-alexander-r', label: 'See Nininger in Medal of Honor' } }),
    ev('1942-01-15', '“Help is on the way”', 'political', P.malinta, 11,
      'MacArthur tells his troops that thousands of men and hundreds of aircraft are being sent from the United States and that they must hold until the reinforcements arrive. No such relief is coming. Two days later he radios Washington that the food situation is becoming serious.'),
    ev('1942-01-16', 'The 51st Division counterattack fails', 'attack', P.abucay, 11,
      'Brigadier General Albert Jones’s 51st Division counterattacks and runs head-on into two Japanese regiments. A gap opens in the Abucay line and the division is out of action by nightfall, but the 41st Division holds firm and the Japanese fail to exploit the breach. On the western side, the Japanese attack Moron the same day.'),
    ev('1942-01-22', 'Retreat to the Pilar–Bagac line', 'movement', P.pilarBagac, 10,
      'With Japanese troops infiltrating behind II Corps over Mount Natib and a roadblock cutting off part of I Corps on the West Road, MacArthur orders both corps back to the shorter reserve line along the Pilar–Bagac road. The withdrawal is carried out between 23 and 26 January; the cut-off troops escape along the coast but lose their trucks and guns.',
      ord('10:00')),
    ev('1942-01-22', 'The Battle of the Points begins', 'invasion', P.points, 11,
      'That night about 900 men of the 2nd Battalion, 20th Infantry, try to land behind the lines on the west coast of southern Bataan. PT-34 sinks two barges and scatters the rest, which come ashore on Longoskawayan and Quinauan Points. They are contained by constabulary, airmen fighting as infantry and a naval battalion of sailors and Marines, who dye their white uniforms with coffee and come out yellow.',
      ord('23:00')),
    ev('1942-01-27', 'Nara attacks along Trail 2', 'attack', P.pilarBagac, 11,
      'Believing the new line to be only an outpost position, Nara’s 65th Brigade attacks II Corps south of the Pilar River. Brigadier General Clifford Bluemel’s troops hold, then counterattack on 2 February; by 8 February the brigade has suffered crippling losses and is pulled back.'),
    ev('1942-01-28', 'The Battle of the Pockets', 'attack', P.pockets, 11,
      'A Japanese battalion breaks through the I Corps line near the Tuol River and is cut off in two pockets, one of about a company and one of about 1,000 men. Wainwright gathers Philippine Army, Scout and constabulary troops, tanks and artillery to reduce them over the next three weeks.'),
    ev('1942-02-03', 'Trout loads the Philippine gold', 'movement', P.corregidor, 12,
      'The submarine Trout reaches Corregidor with 3,500 rounds of anti-aircraft ammunition. She leaves with mail, documents and 20 tons of gold and silver taken from Philippine banks.'),
    ev('1942-02-08', 'Homma calls off the offensive', 'political', P.bataan, 9,
      'With only three effective infantry battalions left on Bataan, Homma suspends his attacks to wait for reinforcements. Over the following weeks his army pulls back up to 10 km and the defenders reoccupy the abandoned ground. Japan’s planned victory in the Philippines by mid-February is in ruins.'),
    ev('1942-02-13', 'The last coastal beachhead is destroyed', 'loss', P.points, 11,
      'Japanese reinforcements sent by barge on 2 February were shot up by the last P-40s and PT boats and penned in on Silaiim Point. Now that pocket is wiped out, ending the Battle of the Points. Two days later 377 survivors of the Pockets make it back to their own lines. Three battalions of the Japanese 20th Infantry have been destroyed, a clear defensive victory for the defenders.'),
    ev('1942-02-20', 'Quezon leaves by submarine', 'movement', P.corregidor, 11,
      'President Quezon, his family, Vice President Sergio Osmeña and Chief Justice José Abad Santos leave Corregidor aboard the submarine Swordfish. By the end of February the rice and flour on Bataan have run out.',
      { wiki: { Swordfish: 'USS_Swordfish_(SS-193)' } }),
    ev('1942-02-23', 'Roosevelt orders MacArthur out', 'political', P.malinta, 11,
      'With Singapore fallen and Corregidor expected to follow, MacArthur receives a message from President Roosevelt directing him to go to Mindanao and then to Australia to command the U.S. forces there. MacArthur, who had announced he would share the garrison’s fate, asks to choose the moment himself.'),

    // ---------- MacArthur's escape ----------
    ev('1942-03-11', 'MacArthur leaves Corregidor', 'movement', P.corregidor, 11,
      'MacArthur, his wife Jean, their four-year-old son Arthur and the boy’s amah board PT-41 at Corregidor’s North Dock, while his staff join three more boats from Bataan. Lieutenant John D. Bulkeley’s squadron threads the minefield and heads south through rough seas. Wainwright is left in command on Luzon; MacArthur tells the harbour defence commander to keep the flag flying.',
      at('19:45', { facts: [['Boats', 'PT-41, PT-32, PT-34, PT-35'], ['Party', 'MacArthur’s family and members of his staff']],
        paths: [{ label: 'PT boats to Mindanao (approximate)', kind: 'route', coords: [[14.38, 120.58], [12.5, 120.9], [10.95, 121.15], [9.5, 123.5], [8.48, 124.65]] }] })),
    ev('1942-03-12', 'The boats regroup at Tagauayan', 'movement', P.tagauayan, 9,
      'The boats have lost each other in the night. PT-34 reaches the rendezvous in the Cuyo Islands two hours late, and PT-41 and PT-32 join her in the afternoon. PT-32 is out of fuel and its passengers are shared between the other boats. At 18:00 MacArthur sets off again in daylight rather than wait for a submarine; an hour later a Japanese cruiser is sighted but does not see them.',
      at('09:30')),
    ev('1942-03-13', 'MacArthur reaches Mindanao', 'movement', P.cagayan, 11,
      'After a night of heavy seas, PT-41 and PT-34 reach Cagayan on the north coast of Mindanao. MacArthur promises every officer and man a Silver Star. Bulkeley will receive the Medal of Honor for his squadron’s service in the Philippines.',
      at('06:30', { link: { timeline: 'medal-of-honor', event: '1941-12-07-bulkeley-john-d', label: 'See Bulkeley in Medal of Honor' } })),
    ev('1942-03-17', 'Two B-17s fly MacArthur to Australia', 'movement', P.delMonte, 6,
      'After days of waiting at the Del Monte plantation, two B-17s borrowed from the Navy arrive. They take off at 01:30 with the whole party, and land at Batchelor Airfield south of Darwin that morning.',
      at('01:30', { paths: [{ label: 'Flight to Batchelor (approximate)', kind: 'route', coords: [[8.36, 124.83], [-13.05, 131.03]] }] })),
    ev('1942-03-20', '“I came through and I shall return”', 'political', P.terowie, 9,
      'After a slow journey south by rail from Alice Springs, MacArthur changes trains at Terowie in South Australia, where reporters are waiting. He gives them a short statement ending with a promise that becomes his theme for the next three years: he came through, and he shall return.'),
    ev('1942-03-21', 'MacArthur reaches Melbourne', 'movement', P.melbourne, 10,
      'MacArthur’s train arrives in Melbourne at 9 a.m. He is to become Supreme Commander of the Allied forces in the Southwest Pacific. In Washington, Marshall arranges a Medal of Honor for him, partly to counter Axis taunts that he fled. In the Philippines, Wainwright takes command of what becomes United States Forces in the Philippines, and Major General Edward P. King takes over the Luzon Force on Bataan. (Some accounts date Wainwright’s new command to 23 March.)',
      { link: { timeline: 'medal-of-honor', event: '1942-04-01-macarthur-douglas', label: 'See MacArthur in Medal of Honor' } }),

    // ---------- The fall of Bataan ----------
    ev('1942-04-03', 'The final offensive opens on Bataan', 'attack', P.samat, 11,
      'Reinforced with a fresh division and heavy artillery, Homma attacks the Orion–Bagac line. A bombardment by 196 guns and 150 air sorties begins at 09:00, and in the afternoon the 4th Division and 65th Brigade drive into the II Corps sector at the foot of Mount Samat. The defenders, on less than half rations and riddled with malaria, begin to give way.',
      at('09:00', { facts: [['Luzon Force', 'about 79,000 men on paper, weakened by hunger and disease'], ['Japanese expected', 'a month to finish the campaign']] })),
    ev('1942-04-05', 'Mount Samat falls', 'loss', P.samat, 12,
      'Japanese troops take Mount Samat with its artillery and push down its southern slopes. A counterattack ordered for the next day fails, and II Corps’ left flank is shattered.'),
    ev('1942-04-08', 'The Bataan front collapses', 'loss', P.mariveles, 10,
      'Both corps fall apart and roads to the south are choked with troops and refugees. The nurses from the field hospitals are evacuated to Corregidor, leaving 24,000 sick and wounded behind. That night depots are blown up, the last aircraft escape south, and the submarine tender Canopus and other ships are scuttled.',
      { ...ord('20:00'), wiki: { Canopus: 'USS_Canopus_(AS-9)' } }),
    ev('1942-04-09', 'Bataan surrenders', 'loss', P.lamao, 11,
      'Against his orders, King goes forward under a white flag to arrange a surrender, accepting sole responsibility. The Japanese officer sent to meet him will accept only a surrender of every force in the Philippines, which King cannot give, and no surrender document is signed. Some 76,000 American and Filipino troops lay down their arms, the largest surrender in American history. The Philippines remembers the day as Araw ng Kagitingan, the Day of Valor.',
      { ...ord('10:00'), link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1942-04-09-bataan-surrenders-the-death-march', label: 'See this in Pearl Harbor to Guadalcanal' } }),
    ev('1942-04-10', 'The Bataan Death March begins', 'loss', P.mariveles, 10,
      'The prisoners, about 66,000 Filipinos and 12,000 Americans, are marched north from Mariveles and, from the next day, from Bagac, in groups of about 100. They get little food or water. Those who fall behind are shot or bayoneted; others are beaten, robbed and left in the sun. Up to 400 Filipino officers and NCOs are executed in the Pantingan River massacre, attributed to Colonel Masanobu Tsuji.',
      { facts: [['Prisoners', 'about 72,000–78,000'], ['Deaths on the march', '5,000–18,000 Filipinos, 500–650 Americans (estimates vary)']],
        paths: [{ label: 'Route of the Death March', kind: 'route', coords: [[14.43, 120.49], [14.52, 120.6], [14.68, 120.54], [14.87, 120.47], [15.03, 120.69], [15.33, 120.59], [15.3759, 120.5119]] }] }),
    ev('1942-04-11', 'Boxcars to Capas and Camp O’Donnell', 'loss', P.odonnell, 11,
      'From the railhead at San Fernando the prisoners are crammed into metal boxcars, about 100 to a car, for the journey to Capas, then walk the last 14 km to Camp O’Donnell. The first arrive on 11 April. The camp has almost no water, sanitation or medicine, and in the months it serves as a prison camp about 20,000 Filipinos and 1,500 Americans die there.',
      { approx: true }),
    ev('1942-04-16', 'Japanese troops land on Cebu', 'invasion', P.cebu, 9,
      'Kiyotake Kawaguchi’s detachment, arriving too late for Bataan, is sent south and lands on Cebu in the Visayas. The 6,500 defenders have no artillery and little ammunition; within days they are driven into the mountains, and the island becomes the springboard for an attack on Mindanao.'),

    // ---------- Corregidor ----------
    ev('1942-04-29', 'PBYs fly nurses out of Corregidor', 'movement', P.corregidor, 11,
      'With Japanese guns on Bataan now shelling the island day and night, two Navy PBYs land at Corregidor and fly out 50 nurses and headquarters staff. All the batteries on the north shore have been out of action since mid-April.'),
    ev('1942-05-02', 'Battery Geary’s magazine explodes', 'loss', P.corregidor, 12,
      'The bombardment reaches its peak: 3,600 rounds from 240 mm howitzers fall on two batteries in a day, and Battery Geary’s magazine blows up, knocking out all eight of its mortars. By 5 May only three 155 mm guns on the island still work.'),
    ev('1942-05-05', 'Japanese troops land on Corregidor', 'invasion', P.northPoint, 13,
      'After a heavy barrage on the beaches, two battalions of the Japanese 61st Infantry land on the tail of the island at North Point. The current carries their barges off course and the defenders’ guns sink many of them, but enough men get ashore to form a beachhead, and by 01:30 they hold Water Tank Hill.',
      at('23:00', { facts: [['Defenders', 'about 11,000, including the 4th Marine Regiment']] })),
    ev('1942-05-06', 'Tanks land on Corregidor', 'attack', P.northPoint, 13,
      'A Marine counterattack at dawn, short of everything but grenades, stalls by 09:00. An hour later Japanese tanks come ashore. Wainwright later writes that the fear of tanks was the deciding factor.',
      at('10:00')),
    ev('1942-05-06', 'Wainwright surrenders Corregidor', 'loss', P.malinta, 12,
      'At 10:30 Wainwright orders a surrender message broadcast to Homma, and at noon the garrison gives up. Homma refuses to accept a surrender of the Manila Bay forts alone and demands every Allied force in the Philippines. Fearing a massacre of the men on Corregidor, Wainwright agrees, and is made to broadcast the order from Manila.',
      at('12:00', { facts: [['U.S. generals captured by May', '18'], ['Highest-ranking U.S. prisoner of the war', 'Lt. Gen. Jonathan M. Wainwright']],
        link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1942-05-06-corregidor-falls', label: 'See this in Pearl Harbor to Guadalcanal' } })),

    // ---------- The southern islands and after ----------
    ev('1942-05-10', 'Sharp surrenders the southern islands', 'political', P.mindanao, 7,
      'Major General William F. Sharp, whose Visayan-Mindanao Force has been pushed back by Japanese offensives since late April, decides to obey Wainwright’s order rather than risk the lives of the prisoners on Corregidor. Many of his men, most of them Filipino, refuse to give up. They take to the hills and form the core of the guerrilla movement led by Colonel Wendell Fertig.'),
    ev('1942-05-23', 'Corregidor’s prisoners are paraded in Manila', 'loss', P.manila, 11,
      'The prisoners from Corregidor, spared the Death March, are shipped to Manila. The Americans are marched along Dewey Boulevard to Bilibid Prison and then sent on to the camp at Cabanatuan.'),
    ev('1942-06-09', 'Wainwright is moved to Tarlac', 'loss', P.tarlac, 10,
      'By June the last organised Allied forces in the Philippines have surrendered. Wainwright is taken from Manila to a prison camp at Tarlac; he will spend the rest of the war in captivity in Formosa and Manchuria. Homma, criticised in Tokyo for the slow campaign, is relieved of command and placed in reserve. American and Filipino guerrillas fight on until MacArthur’s return in October 1944.',
      { link: { timeline: 'medal-of-honor', event: '1942-03-12-wainwright-iv-jonathan-m', label: 'See Wainwright in Medal of Honor' } }),
  ];

  // ---------- Shot list ----------
  // Camera direction (see "Shots" in app.js). Events not listed use the automatic framing.
  const pt = (place) => [place.lat, place.lng];
  const SHOTS = {
    // 8 December: the raid builds from Formosa to the airfields of central Luzon.
    'Iba radar detects the raid': { scene: 'raid', frame: [pt(P.clark), pt(P.iba)] },
    'Clark Field caught on the ground': { shot: 'tight', transition: 'fly' },
    'Iba Field is wiped out': { scene: 'raid' },
    // The invasion: the whole of Luzon in view.
    'Landings in northern Luzon': { shot: 'wide', transition: 'pull-back', frame: [pt(P.aparri), pt(P.legazpi), pt(P.manila)] },
    'The main landings at Lingayen Gulf': { scene: 'invasion', frame: [pt(P.agoo), pt(P.manila)] },
    'MacArthur orders the withdrawal to Bataan': { scene: 'invasion', frame: [pt(P.agoo), pt(P.bataan)] },
    'Landings at Lamon Bay': { scene: 'invasion', frame: [pt(P.lamon), pt(P.manila)] },
    // The withdrawal funnels into the peninsula.
    'The Calumpit bridges are blown': { scene: 'withdrawal', frame: [pt(P.calumpit), pt(P.layac)] },
    'Holding the road to Bataan': { scene: 'withdrawal' },
    'Layac Junction is given up': { scene: 'withdrawal' },
    // The escape: a long pull back from Corregidor to Australia.
    'MacArthur leaves Corregidor': { shot: 'wide', frame: [pt(P.corregidor), pt(P.cagayan)] },
    'Two B-17s fly MacArthur to Australia': { shot: 'wide', transition: 'pull-back', frame: [pt(P.delMonte), pt(P.batchelor)] },
    // The end on Bataan and Corregidor.
    'The Bataan Death March begins': { shot: 'wide', frame: [pt(P.mariveles), pt(P.odonnell)] },
    'Japanese troops land on Corregidor': { scene: 'corregidor' },
    'Tanks land on Corregidor': { scene: 'corregidor' },
    'Wainwright surrenders Corregidor': { scene: 'corregidor' },
  };
  const events = WW2.events['philippines-1941-42'];
  for (const [title, shot] of Object.entries(SHOTS)) {
    const e = events.find((x) => x.title === title);
    if (!e) throw new Error(`philippines-1941-42 shot list: no event titled "${title}"`);
    Object.assign(e, shot);
  }
})();
