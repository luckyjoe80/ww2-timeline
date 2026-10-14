// Timeline: Tarawa (War in the Pacific).
// Operation Galvanic, the American invasion of the Gilbert Islands: planning and the problem of
// the reef and the tide, the assault on Betio, Tarawa Atoll, 20–23 November 1943, the Army's
// landing on Makin and the loss of the escort carrier Liscome Bay, then the casualties, the
// public reaction and the lessons carried into the Marshalls.
// Checked against the English Wikipedia articles "Battle of Tarawa", "Battle of Makin", "Betio",
// "USS Liscome Bay", "Gilbert and Marshall Islands campaign", "Julian C. Smith",
// "Keiji Shibazaki", "William D. Hawkins", "David M. Shoup", "Alexander Bonnyman Jr.",
// "William J. Bordelon", "Holland Smith" and "Richmond K. Turner" (October 2026).
//
// Times are local Gilberts times as the sources give them (GMT+12, the same offset as Wake, so
// the WAKE zone key is used). Where an article gives only "predawn", "noon" or "mid-afternoon",
// the event is date-only and ordered with sortTime. Event schema: see
// data/timelines/attack-on-hawaii.js.

(function () {
  const P = {
    pearl: { name: 'Pearl Harbor, Oahu', lat: 21.35, lng: -157.95 },
    wellington: { name: 'Wellington, New Zealand', lat: -41.29, lng: 174.78 },
    makin: { name: 'Butaritari, Makin Atoll', lat: 3.07, lng: 172.79 },
    makinYellow: { name: 'Yellow Beach, Butaritari lagoon shore (approx.)', lat: 3.03, lng: 172.80 },
    tarawa: { name: 'Tarawa Atoll, Gilbert Islands', lat: 1.42, lng: 173.0 },
    betio: { name: 'Betio, Tarawa Atoll', lat: 1.35, lng: 172.93 },
    offBetio: { name: 'Transport area west of Betio (approx.)', lat: 1.36, lng: 172.86 },
    lagoon: { name: 'Tarawa lagoon, north of Betio (approx.)', lat: 1.385, lng: 172.93 },
    reef: { name: 'Reef edge off Betio’s north shore (approx.)', lat: 1.367, lng: 172.925 },
    red1: { name: 'Red Beach 1, Betio (approx.)', lat: 1.358, lng: 172.917 },
    red2: { name: 'Red Beach 2, west of the pier (approx.)', lat: 1.358, lng: 172.925 },
    red3: { name: 'Red Beach 3, east of the pier (approx.)', lat: 1.357, lng: 172.933 },
    pier: { name: 'The long pier, Betio (approx.)', lat: 1.362, lng: 172.929 },
    green: { name: 'Green Beach, Betio’s western shore (approx.)', lat: 1.352, lng: 172.912 },
    airfield: { name: 'Betio airfield (approx.)', lat: 1.352, lng: 172.927 },
    cp: { name: 'Japanese command post, northeast of the airfield (approx.)', lat: 1.355, lng: 172.933 },
    south: { name: 'Black Beach 2, Betio’s south shore (approx.)', lat: 1.346, lng: 172.925 },
    eastBetio: { name: 'East of the airfield, Betio (approx.)', lat: 1.352, lng: 172.942 },
    tip: { name: 'Eastern tip of Betio (approx.)', lat: 1.352, lng: 172.948 },
    bairiki: { name: 'Bairiki, Tarawa Atoll', lat: 1.33, lng: 172.98 },
    liscome: { name: 'Where Liscome Bay sank, southwest of Butaritari', lat: 2.8, lng: 172.6 },
    kwajalein: { name: 'Kwajalein Atoll, Marshall Islands', lat: 8.72, lng: 167.73 },
    washington: { name: 'Washington, D.C.', lat: 38.89, lng: -77.03 },
    newYork: { name: 'New York', lat: 40.71, lng: -74.0 },
  };

  const ev = (date, title, type, location, zoom, summary, extra = {}) => ({
    id: extra.id || `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}`,
    date, title, type, location, zoom, summary,
    theater: extra.theater || 'Pacific',
    ...extra,
  });
  const at = (time, extra = {}) => ({ time, tz: 'WAKE', ...extra });
  const ord = (sortTime, extra = {}) => ({ sortTime, tz: 'WAKE', ...extra }); // order within the day only

  WW2.events['tarawa'] = [
    // ---------- Background ----------
    ev('1941-12-10', 'Japan occupies the Gilberts', 'invasion', P.makin, 8,
      'Three days after Pearl Harbor, a Japanese landing force of about 300 troops and labourers occupies Makin Atoll without resistance, and troops also land on Tarawa. Makin is to become a seaplane base guarding the eastern edge of Japan’s new perimeter.',
      { facts: [['Status before the war', 'British colony (Gilbert and Ellice Islands)']] }),
    ev('1942-08-17', 'Carlson’s raiders land on Makin', 'attack', P.makin, 10,
      'Colonel Evans Carlson’s 2nd Marine Raider Battalion comes ashore on Makin from the submarines Nautilus and Argonaut. The raid kills many of the small garrison, but 21 Marines are killed and nine left behind are later executed. Its lasting effect is to show Japan how exposed the Gilberts are, and both Makin and Tarawa are reinforced and fortified.',
      { link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1942-08-17-marine-raiders-strike-makin', label: 'See the raid in Pearl Harbor to Guadalcanal' } }),
    ev('1943-02-15', 'Betio becomes a fortress', 'movement', P.betio, 11,
      'The 6th Yokosuka Special Naval Landing Force arrives on Betio, at the southwest corner of Tarawa Atoll, and becomes its garrison as the 3rd Special Base Defense Force. Rear Admiral Tomonari Saichirō, an engineer, directs nearly a year of building: hundreds of log-and-sand pillboxes, many reinforced with cement, trenches linking every part of the island, a log sea wall along the lagoon shore, and 14 coastal guns, among them four British 8-inch guns. Most of the construction workers are Korean labourers. The defences are designed to stop an attacker in the water or on the beach, not to fight a battle in the interior.',
      { approx: true, facts: [['Island', 'About 3.2 km long, at most 730 m wide; 118 hectares'], ['Construction troops', '111th Pioneers (1,247) and Fourth Fleet construction battalion (970); about 1,200 Korean labourers'], ['Main garrison', '3rd Special Base Defense Force (1,112) and 7th Sasebo SNLF (1,497)']] }),
    ev('1943-07-20', 'Operation Galvanic is ordered', 'political', P.pearl, 8,
      'The Joint Chiefs of Staff decide that the drive across the Central Pacific will begin in the Gilberts, which lie within range of B-24 Liberators based in the Ellice Islands. Admiral Chester W. Nimitz is directed to take Tarawa and Abemama, along with Nauru. Betio’s airfield sits across the route from Hawaii to the Marshall Islands, the next objective on the way to the Marianas.',
      { facts: [['Code names', 'Galvanic (the Gilberts); Kourbash (the Army’s part at Makin)'], ['Overall command', 'Vice Admiral Raymond A. Spruance, Central Pacific Force']] }),
    ev('1943-07-20', 'Shibazaki takes over on Betio', 'movement', P.betio, 11,
      'Rear Admiral Keiji Shibazaki, a veteran of amphibious landings in China, relieves Tomonari and drives the work on until the day of the invasion. He tells his men that a million men could not take the island in a hundred years. He expects the Americans to land on the ocean beaches to the south and west, since his big guns are meant to guard the entrance to the lagoon. (His own biography has him arriving in September.)',
      { approx: true, facts: [['Garrison, all told', 'About 4,800, of whom some 2,600 are naval infantry']] }),
    ev('1943-08-15', 'Spruance flies to New Zealand', 'intelligence', P.wellington, 8,
      'The 2nd Marine Division, back from Guadalcanal, has spent months in New Zealand recovering from malaria and taking in replacements. Spruance flies there to start planning the landing with its new commander, Major General Julian C. Smith. The plan chooses Betio’s north shore, inside the lagoon, divided into Red Beaches 1, 2 and 3. Lieutenant Colonel David M. Shoup draws up the first plans and picks the beaches.',
      { approx: true }),
    ev('1943-09-04', 'V Amphibious Corps is formed', 'movement', P.pearl, 8,
      'The Fifth Fleet’s landing troops become the V Amphibious Corps under Major General Holland Smith: the 2nd Marine Division for Tarawa and the Army’s 27th Infantry Division, a former New York National Guard division training in Hawaii. Rear Admiral Richmond K. Turner commands the amphibious force; Rear Admiral Harry W. Hill will command the Southern Attack Force at Tarawa.'),
    ev('1943-09-28', 'Makin replaces Nauru', 'intelligence', P.makin, 8,
      'Nauru, larger and more strongly held, is too far from Tarawa to support both landings at once, and there are not enough transports for a whole division. Nimitz switches the Army’s objective to Makin Atoll in the northern Gilberts, where the 165th Infantry will land on Butaritari. The 27th Division’s staff learn of the change and begin again.'),

    // ---------- The approach ----------
    ev('1943-11-10', 'The Northern Attack Force sails', 'movement', P.pearl, 6,
      'Task Force 52 under Turner leaves Pearl Harbor for Makin with the 27th Division’s landing force and an escort-carrier group that includes the new Liscome Bay, on her first operation. The fleet gathering against the Gilberts is the largest yet assembled for a single Pacific operation.',
      { facts: [['Whole invasion force', '17 carriers, 12 battleships, 12 cruisers, 66 destroyers, 36 transports'], ['Troops', 'About 35,000']],
        paths: [{ label: 'Task Force 52 to Makin (approximate)', kind: 'route', coords: [[21.35, -157.95], [12, -170], [5, 178], [3.07, 172.79]] }] }),
    ev('1943-11-13', 'Bombing of the Gilberts begins', 'attack', P.makin, 8,
      'Seventh Air Force B-24s from the Ellice Islands begin bombing Makin, followed by carrier aircraft and naval gunfire. Japan’s plan to strike the invasion fleet from Truk has already collapsed after heavy aircraft losses and cruiser damage at Rabaul, and the garrisons at Tarawa and Makin are on their own.'),
    ev('1943-11-19', '“A 50–50 chance” of wading', 'intelligence', P.offBetio, 10,
      'The planners count on the rising tide giving about five feet of water over Betio’s reef, enough for Higgins boats drawing four feet. Major Frank Holland of the New Zealand Army, who knows Tarawa from 15 years’ experience, warns there may be no more than three. Shoup, given command of the 2nd Marines only shortly before after its colonel broke down, tells his men there is an even chance they will have to wade. Only the first waves will ride tracked LVT amtracs; the landing is not postponed for better tides.',
      { approx: true }),

    // ---------- 20 November: D-Day ----------
    ev('1943-11-20', 'Minesweepers enter the lagoon', 'movement', P.lagoon, 11,
      'In the dark, two minesweepers covered by two destroyers sweep a channel into the lagoon. A guide light on one of the sweepers leads the landing craft in to wait behind Betio for the end of the bombardment.',
      ord('04:00', { approx: true })),
    ev('1943-11-20', 'Battleships duel with the 8-inch guns', 'attack', P.offBetio, 11,
      'As the fleet stops off Betio before dawn, the island’s 8-inch guns open fire. Colorado and Maryland reply with their 16-inch guns; one shell sets off a gun’s ammunition in a huge fireball, and three of the four big guns are soon silenced. The fourth fires now and then, inaccurately, into the second day. The way into the lagoon is open.',
      ord('05:00', { approx: true, wiki: { 'Colorado': 'USS_Colorado_(BB-45)' } })),
    ev('1943-11-20', 'The bombardment of Makin opens', 'attack', P.makin, 10,
      'The invasion bombardment of Makin begins at 05:00. During the shelling a turret explosion in the battleship Mississippi kills 43 sailors.',
      at('05:00', { wiki: { 'Mississippi': 'USS_Mississippi_(BB-41)' } })),
    ev('1943-11-20', 'Three hours of shelling', 'attack', P.betio, 12,
      'After an air strike at 06:10, battleships and cruisers fire some 3,000 shells into Betio over about three hours, the heaviest bombardment of an invasion beach to date. Perhaps 40 per cent of the defenders are killed, and the shallow-laid Japanese telephone lines are torn up. But the high-explosive shells mostly burst on the surface, and the strongest bunkers survive.',
      at('06:10')),
    ev('1943-11-20', 'Soldiers land on Makin', 'invasion', P.makin, 11,
      'The 165th Infantry lands at 08:30 on Red Beach, on Butaritari’s ocean side, against little opposition; shell craters soon block its light tanks. The second landing, at Yellow Beach in the lagoon, runs aground through a miscalculation of the depth and the troops wade the last 250 yards waist-deep under fire. The defenders pull back to their tank barriers, and the soldiers must reduce the strongpoints one by one.',
      at('08:30', { facts: [['Landing force', '165th Infantry (“Fighting 69th”), 3/105th Infantry, 193rd Tank Battalion'], ['Defenders', 'About 800, perhaps 300 of them armed fighters']] })),
    ev('1943-11-20', '“The ocean just sat there”', 'movement', P.reef, 12,
      'The naval fire lifts and the assault waves start in from the lagoon at 09:00, half an hour late. A neap tide has left only about three feet of water over the reef, and the Higgins boats cannot cross. Only the amtracs can climb over. In the lull, the surviving defenders return to their firing pits and troops shift from the south shore to the north, and the fire on the slow amtracs grows heavier with every minute.',
      at('09:00')),
    ev('1943-11-20', 'The amtracs reach the Red Beaches', 'invasion', P.red2, 13,
      'The first amtracs reach Red Beaches 1, 2 and 3 at 09:10. Their thin hulls are holed and many are knocked out on the way in; those that land cannot climb the log sea wall, and the first waves are pinned down behind it. Amtracs that go back for men stranded at the reef are mostly too badly holed to stay afloat. Half of them are out of action by nightfall.',
      at('09:10', { facts: [['Beaches', 'Red 1 (west), Red 2 (west of the pier), Red 3 (east of the pier)'], ['Vehicle', 'LVT “Alligator” amphibian tractors']] })),
    ev('1943-11-20', 'The long wade', 'loss', P.reef, 13,
      'The later waves, in Higgins boats, ground on the reef some 500 yards out. The Marines climb out and wade toward the beach chest-deep and waist-deep across open water, raked by machine guns and artillery from the shore. Many are killed or wounded before they reach the sea wall.',
      { ...ord('09:40', { approx: true }),
        paths: [{ label: 'The wade from the reef to the beach (approximate)', kind: 'strike', coords: [[1.367, 172.922], [1.358, 172.923]] }] }),
    ev('1943-11-20', 'Sergeant Bordelon’s pillboxes', 'service', P.red1, 13,
      'Staff Sergeant William J. Bordelon, of an assault engineer platoon of the 18th Marines, destroys four Japanese pillboxes with demolitions and keeps leading his men after being seriously wounded, until he is killed. He receives the Medal of Honor posthumously, the first Texan Marine to win it in the war.',
      { ...ord('10:00', { approx: true }),
        link: { timeline: 'medal-of-honor', event: '1943-11-20-bordelon-william-j', label: 'See Bordelon in the Medal of Honor timeline' } }),
    ev('1943-11-20', 'Shoup wades ashore at the pier', 'service', P.pier, 13,
      'Shoup’s amtrac is disabled and he wades in along the long pier, hit in the legs by shell fragments and grazed in the neck by a bullet at about 11:00. He has the pier cleared of snipers, rallies the Marines pinned behind the sea wall and takes command of everyone ashore. For the next two days, without rest and constantly exposed to fire, he directs the attacks inland.',
      at('11:00', { approx: true, link: { timeline: 'medal-of-honor', event: '1943-11-20-shoup-david-m', label: 'See Shoup in the Medal of Honor timeline' } })),
    ev('1943-11-20', 'Bonnyman crosses the pier', 'service', P.pier, 13,
      'With troops pinned down at the seaward end of the pier, Second Lieutenant Alexander Bonnyman Jr. of the shore party leads five men along the open pier to the beach on his own initiative, finds flamethrowers and explosives, and directs the destruction of several Japanese positions.',
      ord('11:30', { approx: true })),
    ev('1943-11-20', 'Shermans come ashore', 'attack', P.red2, 13,
      'Tank landing craft hang up on the reef, and the first light tanks to land on the east are soon knocked out. Six Shermans are put down at the reef and driven in through the surf, Marines walking ahead to guide them; several drop into shell holes and sink. The survivors, and a platoon that lands all four tanks on Red 3 around noon, get the line moving. By noon the Marines hold the beach as far as the first line of Japanese defences.',
      ord('12:00', { approx: true, facts: [['Tanks', 'M4 Sherman medium and M3 Stuart light tanks']] })),
    ev('1943-11-20', 'The Makin regiment loses its colonel', 'loss', P.makinYellow, 11,
      'Colonel Gardiner Conroy, commanding the 165th Infantry, is shot dead by a sniper on Butaritari in the afternoon. Colonel Gerard W. Kelley takes over.',
      ord('14:00', { approx: true })),
    ev('1943-11-20', 'Shibazaki is killed', 'loss', P.cp, 13,
      'With his telephone lines cut, Shibazaki cannot control his troops. In mid-afternoon he gives up his concrete command post northeast of the airfield to shelter the wounded and prepares to move to the south side of the island. As his staff gather outside, a 5-inch shell from an American destroyer bursts among them, killing him and most of his officers. From now on each Japanese unit fights on its own.',
      ord('15:00', { approx: true, facts: [['Fired by', 'Probably USS Dashiell or USS Ringgold'], ['Promoted', 'Vice admiral, posthumously']] })),
    ev('1943-11-20', '“Ryan’s Orphans” on the western end', 'attack', P.green, 13,
      'Major Michael P. Ryan, a company commander believed dead, gathers the remnants of his company, Marines and sailors from other waves and two Shermans on Red 1 and works them along to a more lightly held stretch of Green Beach, the island’s western shore. They become known as “Ryan’s Orphans”.',
      ord('15:30', { approx: true })),
    ev('1943-11-20', 'Holding on at dusk', 'attack', P.airfield, 13,
      'At 15:30 the line is still generally along the first Japanese defences. Tanks get the right flank moving on Red 3 and the end of Red 2, and by nightfall the Marines there are about halfway across the island, close to the main runway. Of some 5,000 Marines put ashore, about 1,500 are dead or wounded.',
      at('15:30', { facts: [['Ground held', 'A shallow strip along the lagoon shore'], ['Casualties ashore', 'About 1,500 of 5,000']] })),
    ev('1943-11-20', 'The first night', 'attack', P.lagoon, 12,
      'The expected Japanese counterattack never comes: without Shibazaki and his communications, the defenders can only keep up scattered fire. Marines bring 75 mm pack howitzers ashore for the morning, but most of the second wave cannot land and spends the night afloat in the lagoon without food or water. Japanese marines swim out to wrecked amtracs and the wrecked steamer Saida Maru, west of the pier, to fire on the Marines from behind at dawn.',
      ord('21:00', { approx: true })),

    // ---------- 21 November ----------
    ev('1943-11-21', 'Green Beach is cleared', 'attack', P.green, 13,
      'The Marines on Red 1 are ordered to secure Green Beach so reinforcements can land. Heavy fire stops them until artillery spotters bring naval gunfire directly onto the pillboxes and machine-gun posts; then the positions fall in about an hour, at little cost, and the western end of Betio is in American hands.',
      ord('08:00', { approx: true })),
    ev('1943-11-21', 'Across the airstrip', 'attack', P.airfield, 13,
      'Between Red 2 and Red 3 the defenders have set new machine-gun posts in the night that cut the two beachheads apart. By noon Marine heavy machine guns have silenced them, and in the early afternoon Marines cross the airstrip and occupy abandoned Japanese positions on the south side, against Black Beach 2.',
      ord('12:00', { approx: true })),
    ev('1943-11-21', 'Lieutenant Hawkins is killed', 'service', P.red2, 13,
      'First Lieutenant William D. Hawkins, leading the 2nd Marines’ scout-sniper platoon, has been attacking pillboxes since he came ashore wounded with the first wave. He takes on a position held by five machine guns and refuses to be evacuated after a second, serious wound, destroying three more pillboxes before he is mortally wounded. Betio’s airstrip will be named Hawkins Field after him.',
      { ...ord('11:00', { approx: true }),
        link: { timeline: 'medal-of-honor', event: '1943-11-20-hawkins-william-d', label: 'See Hawkins in the Medal of Honor timeline' } }),
    ev('1943-11-21', 'Escape route to Bairiki', 'intelligence', P.bairiki, 11,
      'Around 12:30 word arrives that Japanese troops are crossing the sandbars from Betio’s eastern end to Bairiki, the next islet. Part of the 6th Marines is ordered to land there and close the escape route.',
      at('12:30', { approx: true })),
    ev('1943-11-21', '“We are winning”', 'intelligence', P.red2, 13,
      'By afternoon reinforcements are arriving in strength. At 16:00 Shoup sends a long situation report to division headquarters in Maryland, ending: “Combat efficiency: We are winning.” That night Colonel Merritt A. Edson, the division chief of staff, comes ashore and takes over command of the troops on the island.',
      at('16:00')),
    ev('1943-11-21', 'The 6th Marines land on Bairiki', 'invasion', P.bairiki, 12,
      'With tanks and pack artillery, part of the 6th Marines starts landing on Bairiki at 16:55. Machine-gun fire meets them until aircraft find the single pillbox, holding 12 machine guns; a small fuel tank inside it catches fire and the whole group in it is burned. Other units of the 6th land unopposed on Green Beach.',
      at('16:55')),
    ev('1943-11-21', 'Night on the second day', 'attack', P.betio, 13,
      'The western end of Betio and a broken line around the airfield aprons between Red 2 and Red 3 are held, and a separate group is dug in on the south shore. A gap of more than 500 yards still separates the forces on Red 1 and Green Beach from those on Red 2.',
      ord('20:00', { approx: true })),

    // ---------- 22 November ----------
    ev('1943-11-22', 'Heavy equipment lands on Green Beach', 'movement', P.green, 13,
      'At 08:00 tanks and heavy equipment begin landing on Green Beach, where the 6th Marines’ last battalion also comes ashore. The Marines from Red 1 push toward Red 2 through the morning, taking casualties. Julian Smith comes ashore today to take command on the island.',
      at('08:00')),
    ev('1943-11-22', 'Bonnyman storms the bombproof', 'service', P.red3, 13,
      'Bonnyman leads 21 Marines with demolitions against a huge bombproof shelter about 40 yards ahead of the Marine line, holding some 150 Japanese. Driven back once for more grenades and explosives, his team fights its way onto the top of the structure, flushing more than a hundred defenders into the open, where infantry and a tank cut them down. Bonnyman is killed on the forward edge of the position; 13 of his 21 men survive. Combat cameraman Norman Hatch films part of the action, the first Medal of Honor action caught on film. (Accounts differ on the exact day.)',
      { ...ord('10:00', { approx: true }),
        link: { timeline: 'medal-of-honor', event: '1943-11-20-bonnyman-jr-alexander', label: 'See Bonnyman in the Medal of Honor timeline' } }),
    ev('1943-11-22', 'The 6th Marines drive east', 'attack', P.south, 13,
      'At 12:30 the 1st Battalion, 6th Marines attacks along Betio’s south coast. By late afternoon it reaches the eastern end of the airfield and joins hands with the Marines who landed on Red 3 two days before. What is left of the Japanese garrison is squeezed into the narrow tail east of the airstrip or cut off in pockets between Red 1 and Red 2 and near the west end of the airstrip.',
      at('12:30')),
    ev('1943-11-22', 'A counterattack is broken up', 'attack', P.eastBetio, 13,
      'At about 19:30 the Japanese begin forming for a counterattack, sending small groups to infiltrate the Marine lines ahead of a full assault. Concentrated artillery fire scatters them before the assault can start.',
      at('19:30', { approx: true })),

    // ---------- 23 November ----------
    ev('1943-11-23', 'The banzai charges', 'attack', P.eastBetio, 13,
      'In the small hours the last Japanese launch banzai charges into the lines of A and B Companies, 1st Battalion, 6th Marines, the heaviest of them by about 300 men at 04:00. With pack howitzers of the 10th Marines and the destroyers Schroeder and Sigsbee firing in support, and artillery called down within 75 metres of their own positions, the Marines hold. When it ends about an hour later some 200 Japanese lie dead inside the Marine lines and 125 more beyond them.',
      at('04:00', { facts: [['1/6 Marines losses', '45 killed, 128 wounded'], ['Japanese dead', 'About 325']] })),
    ev('1943-11-23', '“Makin taken”', 'invasion', P.makin, 10,
      'After two days of determined fighting, Major General Ralph C. Smith reports on the morning of 23 November that Makin has been taken and recommends that command pass to the garrison force. Mopping up continues.',
      ord('08:00', { approx: true, facts: [['U.S. ground losses', '66 killed, 152 wounded'], ['Japanese', 'An estimated 395 casualties in action']] })),
    ev('1943-11-23', 'The final push to the eastern tip', 'attack', P.eastBetio, 13,
      'Aircraft hit the eastern tip from 07:00, then pack howitzers and naval guns. At 08:00 the 3rd Battalion, 6th Marines attacks with the Shermans Colorado and China Gal, light tanks and engineers. When Japanese troops try to escape down a narrow defile, Colorado fires along their line and a single shell kills an estimated 50 to 75 men.',
      at('08:00', { facts: [['3/6 Marines', 'About 475 Japanese killed this morning, for 9 killed and 25 wounded']], wiki: { 'Colorado': null } })),
    ev('1943-11-23', 'The Red Beach pocket falls', 'attack', P.red1, 13,
      'The Japanese pocket between Red 1 and Red 2, which has held out since D-Day, is attacked from both sides by the 3rd Battalion, 2nd Marines and the 1st Battalion, 8th Marines, while a platoon with two pack howitzers comes in from the lagoon to complete the ring. By noon it is destroyed.',
      ord('12:00', { approx: true })),
    ev('1943-11-23', 'Marines reach the eastern tip', 'attack', P.tip, 13,
      'Bypassing the remaining pockets and leaving them to tanks, engineers and aircraft, L Company, 6th Marines reaches the eastern tip of Betio at 13:00.',
      at('13:00')),
    ev('1943-11-23', 'Betio is declared secure', 'invasion', P.betio, 12,
      'Betio is declared secure at 13:30, 76 hours after the first Marines landed. Of about 1,000 Japanese still fighting the night before, only 50 to 100 remain. Of the 3,636 men of the Japanese garrison, one officer and 16 enlisted men survive; 129 of the 1,200 Korean labourers live. Nearly 6,400 Japanese, Koreans and Americans have died on an island of 118 hectares.',
      at('13:30', { facts: [['2nd Marine Division', '894 killed in action, 84 died of wounds, 2,188 wounded'], ['Defenders killed', '4,690'], ['Survivors', '17 Japanese, 129 Koreans']],
        link: { timeline: 'road-to-tokyo-bay', event: '1943-11-20-tarawa', label: 'See Tarawa in the Road to Tokyo Bay' } })),

    // ---------- 24 November: Liscome Bay ----------
    ev('1943-11-24', 'A gap opens in the screen', 'movement', P.liscome, 10,
      'Rear Admiral Henry M. Mullinnix’s three escort carriers are steaming in circular formation about 20 miles southwest of Butaritari, not zigzagging, with Liscome Bay at the centre. At 04:34 the destroyer Franks leaves to investigate a signal beacon, probably dropped by a Japanese plane, opening a gap in the screen. The submarine I-175, one of nine sent by Admiral Mineichi Koga to the Gilberts, arrived off Makin the day before.',
      at('04:34', { facts: [['Formation', '3 escort carriers, 3 battleships, a heavy cruiser and 7 destroyers'], ['Submarine', 'I-175 (Lieutenant Commander Sunao Tabata)']], wiki: { 'Franks': 'USS_Franks' } })),
    ev('1943-11-24', 'I-175 torpedoes Liscome Bay', 'loss', P.liscome, 10,
      'The crew are preparing for dawn flight operations, with 13 fuelled and armed aircraft on deck, when the group turns northeast and presents Liscome Bay’s side to I-175. Around 05:10 a torpedo strikes behind the after engine room and sets off the bomb magazine. The explosion tears away almost the entire stern, throws wreckage onto the battleship New Mexico 1,500 yards away and raises a towering cloud.',
      at('05:10', { approx: true, wiki: { 'New Mexico': 'USS_New_Mexico_(BB-40)' },
        link: { timeline: 'pacific-submarines', event: '1943-11-24-i-175-sinks-the-escort-carrier-liscome-b', label: 'See this in Submarine Operations' } })),
    ev('1943-11-24', 'Liscome Bay sinks', 'loss', P.liscome, 10,
      'Twenty-three minutes after the explosion, the burning carrier lists to starboard and goes down. Of 916 men aboard, 702 die, among them Mullinnix, Captain Irving D. Wiltsie and Cook Second Class Doris Miller, hero of Pearl Harbor. Destroyers pick up survivors from the burning, oily water until 08:00. It is the deadliest loss of a carrier in U.S. Navy history, on the eve of Thanksgiving.',
      at('05:33', { facts: [['Dead', '702 of 916'], ['Naval dead in the Makin operation', '755, against 66 soldiers killed ashore']] })),

    // ---------- Aftermath ----------
    ev('1943-11-28', 'The rest of the atoll is cleared', 'attack', P.tarawa, 9,
      'The 2nd Battalion, 6th Marines works up the chain of islets of Tarawa Atoll and finishes clearing it of Japanese. The rest of the division begins to leave for Hawaii, where it will train for Saipan; the battalion stays to clear ordnance, guard the Seabees rebuilding the airstrip and bury the dead.'),
    ev('1943-12-02', 'The Navy announces Liscome Bay’s loss', 'home-front', P.washington, 8,
      'The Navy announces that Liscome Bay has been sunk off Makin. Her survivors have been taken off the destroyers to the transports Leonard Wood and Neville in Makin lagoon.'),
    ev('1943-12-27', '“We must steel ourselves”', 'home-front', P.newYork, 8,
      'News of the losses on so small an island shocks Americans, and blunt remarks by Marine commanders make it worse: Holland Smith, who toured the beaches, compares Tarawa to Pickett’s Charge, and Nimitz is flooded with angry letters from bereaved families. The new Commandant, Alexander Vandegrift, reassures Congress that Tarawa was an assault from start to finish. A New York Times editorial praises the Marines and warns that the Marshalls may cost even more. Footage of American dead in the documentary With the Marines at Tarawa is so harrowing that its release is left to Roosevelt, who approves it.',
      { facts: [['Holland Smith, after the war', 'Tarawa was not worth it'], ['Nimitz', 'It knocked down the front door to Japan’s Central Pacific defences']] }),
    ev('1944-01-31', 'Tarawa’s lessons reach the Marshalls', 'invasion', P.kwajalein, 9,
      'Ten weeks after Tarawa the Marshalls campaign begins, with aircraft from Betio and Abemama in support. The lessons of the reef have been learned: a month of bombardment with armour-piercing shells, armoured landing craft, odds of nearly six to one, and the first Underwater Demolition Teams, formed on Turner’s orders to scout reefs and clear obstacles before a landing. The Marshalls fall at a fraction of Tarawa’s cost.',
      { link: { timeline: 'road-to-tokyo-bay', event: '1944-01-31-kwajalein-invaded', label: 'See Kwajalein in the Road to Tokyo Bay' } }),
    ev('1944-02-04', 'I-175 is sunk', 'loss', P.kwajalein, 7,
      'The destroyer Charrette and the destroyer escort Fair find I-175 and sink her with Hedgehog anti-submarine mortars, a little over two months after she sank Liscome Bay.',
      { wiki: { 'Charrette': 'USS_Charrette', 'Fair': 'USS_Fair' } }),
    ev('2015-07-26', 'Tarawa’s lost Marines come home', 'life', P.betio, 12,
      'More than a hundred of the Americans killed on Betio were never brought home. A battlefield cemetery whose location was lost by the end of the war was found in March 2015, and the remains of 36 Marines buried there, among them Alexander Bonnyman, are repatriated, arriving at Joint Base Pearl Harbor–Hickam. More remains, from a mass grave found in 2019, follow.'),
  ];

  // ---------- Shot list ----------
  const pt = (place) => [place.lat, place.lng];
  const SHOTS = {
    // Galvanic in one frame: Tarawa and Makin, a hundred miles apart.
    'Bombing of the Gilberts begins': { shot: 'wide', frame: [pt(P.makin), pt(P.betio)] },
    // D-Day morning: the fleet, the lagoon and the island together.
    'Battleships duel with the 8-inch guns': { scene: 'bombardment', frame: [pt(P.offBetio), pt(P.betio)], transition: 'fly' },
    'Three hours of shelling': { scene: 'bombardment' },
    // The landing: down onto the reef and the north shore.
    '“The ocean just sat there”': { scene: 'reef', frame: [pt(P.reef), pt(P.red1), pt(P.red3)], transition: 'fly' },
    'The amtracs reach the Red Beaches': { scene: 'reef' },
    'The long wade': { scene: 'reef' },
    'Shoup wades ashore at the pier': { scene: 'reef' },
    'Bonnyman crosses the pier': { scene: 'reef' },
    // Afternoon and night on the island.
    'Shibazaki is killed': { shot: 'tight' },
    'The first night': { shot: 'wide', transition: 'pull-back', frame: [pt(P.lagoon), pt(P.betio)] },
    // 21 November: the escape route.
    'The 6th Marines land on Bairiki': { frame: [pt(P.tip), pt(P.bairiki)] },
    // 23 November: the end on Betio, then out to sea for Liscome Bay.
    'Betio is declared secure': { shot: 'wide', transition: 'pull-back' },
    'A gap opens in the screen': { scene: 'liscome', frame: [pt(P.makin)], transition: 'fly' },
    'I-175 torpedoes Liscome Bay': { scene: 'liscome' },
    'Liscome Bay sinks': { scene: 'liscome' },
  };
  const events = WW2.events['tarawa'];
  for (const [title, shot] of Object.entries(SHOTS)) {
    const e = events.find((x) => x.title === title);
    if (!e) throw new Error(`tarawa shot list: no event titled "${title}"`);
    Object.assign(e, shot);
  }
})();
