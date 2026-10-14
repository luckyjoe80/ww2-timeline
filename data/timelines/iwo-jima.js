// Timeline: The Battle of Iwo Jima (War in the Pacific).
// Operation Detachment, 19 February – 26 March 1945: Kuribayashi's underground defences and the
// long bombardment, the landings, Mount Suribachi and its two flag raisings, the drive north
// through the Meat Grinder, the airfields, the last stand in the Gorge and the final attack of
// 26 March, with the mopping-up, the B-29 landings and the last holdouts afterwards.
// Checked against the English Wikipedia articles "Battle of Iwo Jima", "Raising the Flag on Iwo
// Jima", "Tadamichi Kuribayashi", "Mount Suribachi", "Iwo Jima", "Naval Base Iwo Jima",
// "Holland Smith", "Harry Schmidt (USMC)", "Takeichi Nishi", "Rinosuke Ichimaru",
// "Chandler W. Johnson", "Robert E. Cushman Jr.", "USS Bismarck Sea", "USS Saratoga (CV-3)",
// "USS Pensacola (CA-24)", "15th Fighter Group", the three Marine division articles and the
// biographies of Basilone, Strank, Block, Stein, Lummus, Leims, McCarthy, Gray, Watson,
// Jacobson and Hershel W. Williams (October 2026).
//
// Times are local times as the sources give them, shown as Japan time (JST). Where the sources
// give only a part of the day, the event is date-only and ordered within the day.
// Event schema: see data/timelines/attack-on-hawaii.js.

(function () {
  const P = {
    iwo: { name: 'Iwo Jima, Volcano Islands', lat: 24.78, lng: 141.32 },
    suribachi: { name: 'Mount Suribachi, Iwo Jima', lat: 24.7503, lng: 141.2889 },
    chidori: { name: 'Chidori airstrip (Airfield No. 1, later South Field)', lat: 24.762, lng: 141.293 },
    airfield2: { name: 'Motoyama Airfield No. 2 (later Central Field)', lat: 24.784, lng: 141.323 },
    northField: { name: 'Airfield No. 3, unfinished (later North Field)', lat: 24.7936, lng: 141.3247 },
    beaches: { name: 'Landing beaches, southeast coast of Iwo Jima (approx.)', lat: 24.765, lng: 141.305 },
    neck: { name: 'The narrow neck below Suribachi (approx.)', lat: 24.757, lng: 141.293 },
    quarry: { name: '"The Quarry", right flank of the beaches (approx.)', lat: 24.775, lng: 141.33 },
    offshore: { name: 'Bombardment line off the east coast (approx.)', lat: 24.77, lng: 141.36 },
    meatGrinder: { name: 'Hill 382, Turkey Knob and the Amphitheater (approx.)', lat: 24.789, lng: 141.334 },
    hill362: { name: 'Hill 362A, west side of the island (approx.)', lat: 24.789, lng: 141.31 },
    eastHills: { name: 'Hills east of Airfield No. 3 (approx.)', lat: 24.797, lng: 141.33 },
    kitano: { name: 'Kitano Point, northern tip of Iwo Jima (approx.)', lat: 24.812, lng: 141.315 },
    northCoast: { name: 'Northeast coast of Iwo Jima (approx.)', lat: 24.802, lng: 141.335 },
    gorge: { name: '"The Gorge", northwest end of Iwo Jima (approx.)', lat: 24.803, lng: 141.305 },
    finalAttack: { name: 'West of Airfield No. 2 (approx.)', lat: 24.78, lng: 141.307 },
    cemetery: { name: 'Marine cemeteries below Suribachi', lat: 24.7586, lng: 141.2967 },
    carriers: { name: 'Escort carriers, about 21 miles east of Iwo Jima (approx.)', lat: 24.78, lng: 141.68 },
    chichi: { name: 'Chichi Jima, Bonin Islands', lat: 27.09, lng: 142.2 },
    tokyo: { name: 'Tokyo', lat: 35.68, lng: 139.76 },
    katori: { name: 'Katori naval air base, Chiba', lat: 35.72, lng: 140.65 },
    saipan: { name: 'Saipan, Mariana Islands', lat: 15.18, lng: 145.75 },
    guam: { name: 'Guam, Mariana Islands', lat: 13.44, lng: 144.79 },
    newYork: { name: 'New York City', lat: 40.75, lng: -73.99 },
  };

  const ev = (date, title, type, location, zoom, summary, extra = {}) => ({
    id: extra.id || `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}`,
    date, title, type, location, zoom, summary,
    theater: extra.theater || 'Pacific',
    ...extra,
  });
  const at = (time, extra = {}) => ({ time, tz: 'JST', ...extra });
  const ord = (sortTime, extra = {}) => ({ sortTime, tz: 'JST', ...extra }); // order within the day only

  WW2.events['iwo-jima'] = [
    // ---------- 1944: the fortress ----------
    ev('1944-03-15', 'Reinforcements reach Iwo Jima', 'movement', P.iwo, 9,
      'With the Marshall Islands lost, Japan strengthens its inner defence line running from the Marianas through the Volcano Islands to the home islands. During March and April about 1,000 naval troops from Yokosuka and Chichi Jima arrive on Iwo Jima, and the Army garrison grows past 5,000 men. The island’s radar station gives the home islands early warning of American bombers.',
      { approx: true, facts: [['Japanese command', '31st Army (General Hideyoshi Obata), activated March 1944']] }),
    ev('1944-06-08', 'Kuribayashi is given Iwo Jima', 'political', P.tokyo, 8,
      'Two weeks after taking over the 109th Infantry Division, Lieutenant General Tadamichi Kuribayashi receives orders signed by Prime Minister Hideki Tōjō to defend Iwo Jima. A former attaché who studied in the United States and thought war with America a mistake, he tells his wife that even his ashes are unlikely to come home. Before leaving he is received by Emperor Hirohito.',
      { facts: [['Commander', 'Lt. Gen. Tadamichi Kuribayashi'], ['Formation', '109th Infantry Division']] }),
    ev('1944-06-15', 'The bombardment begins', 'attack', P.iwo, 9,
      'U.S. Navy ships and Army Air Forces bombers open the longest and most intense preliminary bombardment of the Pacific War. For nine months, naval gunfire and air raids pound the island. Some American planners come to believe that most of the garrison must be dead, unaware of how deep the defenders are digging.',
      { facts: [['Duration', 'About nine months, June 1944 – February 1945']] }),
    ev('1944-06-19', 'Kuribayashi lands at Chidori airstrip', 'movement', P.chidori, 12,
      'Kuribayashi flies in to find the garrison digging trenches along the beaches. After surveying the island he breaks with Japanese doctrine: the landings will not be seriously contested. Instead his men will fight from a defence in depth, mutually supporting positions linked by tunnels, with the Suribachi sector organised to hold out on its own. He forbids the massed banzai charges that had wasted garrisons elsewhere.'),
    ev('1944-07-15', 'The islanders are evacuated', 'home-front', P.iwo, 10,
      'All of Iwo Jima’s civilian inhabitants are forcibly removed to Honshu. Because the island is emptied of civilians, the coming battle will cause none of the civilian deaths seen on Saipan and Okinawa.',
      { approx: true }),
    ev('1944-07-18', 'Baron Nishi’s tanks go to the bottom', 'loss',
      { name: 'Between Pusan and Iwo Jima (approx.)', lat: 28.5, lng: 135.0 }, 6,
      'The transport Nisshu Maru, carrying Lieutenant Colonel Takeichi Nishi’s 26th Tank Regiment to Iwo Jima, is torpedoed by the submarine USS Cobia. Only two soldiers die, but all 28 of the regiment’s tanks are lost. Nishi, a gold medallist in show jumping at the 1932 Olympics, will dig his replacement tanks in up to their turrets as fixed guns.',
      { facts: [['Unit', '26th Tank Regiment'], ['Tanks lost', '28']] }),
    ev('1944-08-10', 'Admiral Ichimaru takes over the naval garrison', 'movement', P.iwo, 10,
      'Rear Admiral Rinosuke Ichimaru arrives to command the naval forces, replacing an admiral who had clashed with Kuribayashi over strategy. Ichimaru too would rather fight at the beaches, but after his air flotilla’s planes are destroyed by American bombing he places his men under Kuribayashi, and they build 135 casemates.',
      { facts: [['Naval troops', 'About 2,100 under Ichimaru']] }),
    ev('1944-11-15', 'Raids on the Marianas', 'attack', P.saipan, 6,
      'From November 1944 to January 1945 Japanese aircraft staging through Iwo Jima make intermittent raids on the B-29 bases in the Marianas, and fighters from the island harass bombers on their way to Japan. Neither threat is great, but together with the island’s radar warnings they help make the case for taking it.',
      { approx: true }),
    ev('1944-12-08', 'Cruisers shell the island', 'attack', P.offshore, 9,
      'The heavy cruiser USS Pensacola fires 500 eight-inch shells into Iwo Jima, returning later in the month to hit gun positions north of Suribachi. Underground, the defenders keep digging: by February 18 km of a planned 27 km of tunnels are complete, with command posts and barracks deep below ground. Food and water are short, and the men drink rainwater.',
      { facts: [['Tunnels', '18 km of 27 km planned'], ['Japanese garrison', 'About 21,000']] }),

    // ---------- February 1945: the bombardment ----------
    ev('1945-02-16', 'Three days of shelling', 'attack', P.offshore, 9,
      'The Navy’s final bombardment begins. Major General Harry Schmidt, commanding the landing force, had asked for ten days of heavy shelling and then nine; Rear Admiral William H. P. Blandy, needing time to rearm his ships, allowed three. Rain and cloud spoil much of the first day. The same night, Task Force 58’s carriers strike the Japanese home islands far to the north.',
      { facts: [['Bombardment', 'Task Force 52 (Blandy)'], ['Landing force', 'V Amphibious Corps (Schmidt)']] }),
    ev('1945-02-17', 'Hidden guns reveal themselves', 'attack', P.offshore, 10,
      'As the bombardment ships close in to cover minesweepers and underwater demolition teams, Japanese batteries open fire. USS Pensacola is hit six times and 17 of her crew are killed; all 12 small craft carrying a demolition team are hit, and the destroyer Leutze is struck while helping them. A swimmer from UDT-15 is killed scouting Blue Beach. The defenders have shown some of their guns, and the bombardment turns on them.',
      { facts: [['Pensacola', '6 hits, 17 dead'], ['Leutze', '7 dead']],
        link: { timeline: 'medal-of-honor', event: '1945-02-17-herring-rufus-g', label: 'See Rufus G. Herring of LCI(G) 449 in the Medal of Honor timeline' } }),
    ev('1945-02-18', 'Blessman is bombed', 'loss', P.offshore, 9,
      'In the evening Japanese aircraft hit the destroyer escort USS Blessman, which had carried UDT-15, killing 40 men, 15 of them demolition swimmers. That night Vice Admiral Marc Mitscher’s carriers arrive off the island with Admiral Raymond Spruance, in overall command, aboard Indianapolis. Rain has again cut short the day’s shelling; Schmidt reckons he received about 13 hours of fire in 34 hours of daylight.'),

    // ---------- 19 February: D-Day ----------
    ev('1945-02-19', 'The first wave lands', 'invasion', P.beaches, 12,
      'D-Day dawns clear. After a last bombardment by the fleet and Mitscher’s aircraft, the first Marines touch down on the southeast beaches at 08:59, a minute early, the 4th Marine Division on the right and the 5th on the left. They meet little fire at first, and the Navy concludes its bombardment has worked.',
      at('08:59', { facts: [['Ships off the island', 'About 450'], ['Commanders', 'Lt. Gen. Holland Smith (Expeditionary Troops); Maj. Gen. Harry Schmidt (V Amphibious Corps)']],
        link: { timeline: 'road-to-tokyo-bay', event: '1945-02-19-marines-land-on-iwo-jima', label: 'See this in The Road to Tokyo Bay' } })),
    ev('1945-02-19', 'Black sand', 'invasion', P.beaches, 13,
      'Behind the beaches rise terraces of loose volcanic ash about 4.5 m high. Amphibious tractors cannot climb them and Marines sink in as they plod forward, dropping gear as they go, while follow-on waves crowd the shoreline with men and equipment.',
      ord('09:30')),
    ev('1945-02-19', 'The beaches erupt', 'attack', P.beaches, 13,
      'After letting the Americans pack the beaches for about an hour, the defenders open fire with machine guns, mortars and heavy artillery. Guns on Suribachi fire from behind steel doors that close again before they can be hit, and bunkers cleared by Marines are quietly reoccupied through tunnels. Time-Life correspondent Robert Sherrod calls it a nightmare in hell.',
      at('10:00', { approx: true })),
    ev('1945-02-19', 'Basilone is killed', 'loss', P.chidori, 13,
      'Gunnery Sergeant John Basilone, who won the Medal of Honor on Guadalcanal, knocks out a blockhouse pinning down his machine-gun section on Red Beach 2, then guides a trapped tank out of a minefield under heavy fire. He is killed moving along the edge of Airfield No. 1 and is awarded the Navy Cross.',
      ord('11:00')),
    ev('1945-02-19', 'A foothold on Airfield No. 1', 'attack', P.chidori, 12,
      'By 11:30 some Marines reach the southern end of Airfield No. 1, one of the day’s objectives. They throw back a charge by more than 100 Japanese and hold on through the night. Seabees bulldoze tracks off the beach so that men and vehicles can finally move inland.',
      at('11:30')),
    ev('1945-02-19', 'The 28th Marines cut off Suribachi', 'attack', P.neck, 12,
      'On the left, Colonel Harry B. Liversedge’s 28th Marines drive across the island at its narrowest point, about 800 m wide, isolating the defenders of Mount Suribachi from the rest of the garrison. Corporal Tony Stein, firing a machine gun adapted from an aircraft, storms pillbox after pillbox and makes repeated trips back to the beach for ammunition, bringing a wounded man each time.',
      ord('13:00')),
    ev('1945-02-19', 'Slaughter at the Quarry', 'loss', P.quarry, 12,
      'On the right flank the 25th Marines attack the strongpoints around the Quarry, whose fire rakes the whole landing area. Of about 900 men of the 3rd Battalion who landed in the morning, only 150 are still fit to fight by nightfall. Its commander, Lieutenant Colonel Justice M. Chambers, leads the eight-hour fight for the cliffs above the beach.',
      ord('15:00', { facts: [['3/25 Marines', 'About 900 landed; 150 fit to fight by night']] })),
    ev('1945-02-19', '“One smart bastard”', 'intelligence', P.offshore, 9,
      'By evening 30,000 Marines are ashore; about 40,000 more will follow. Aboard the command ship Eldorado, Holland Smith reads the casualty reports and notes that the expected night banzai charge has not come. Of the Japanese commander he tells reporters, in effect, that whoever he is, he is very clever.',
      ord('19:00', { facts: [['Marines ashore', 'About 30,000']] })),

    // ---------- Suribachi ----------
    ev('1945-02-20', 'A pillbox every ten feet', 'attack', P.neck, 12,
      'Lieutenant Colonel Chandler W. Johnson’s 2nd Battalion, 28th Marines attacks toward Suribachi and gains about 200 yards in a day of heavy losses, reporting that the defences are far stronger than expected. Across the island, the Marines learn that rifles do little against the bunkers and turn to grenades, demolitions and flamethrowers. From the next day they also have eight Sherman tanks fitted with flame guns, which prove the best weapon against the bunkers.'),
    ev('1945-02-21', 'Pushing toward Airfield No. 2', 'attack', P.airfield2, 12,
      'The 4th Marine Division attacks north into the cross-island defences. Captain Joseph J. McCarthy leads a demolition and flamethrower team across 75 yards of open ground to destroy the pillboxes holding up his company on the approach to Motoyama Airfield No. 2. Northeast of Airfield No. 1, Sergeant Ross F. Gray clears a minefield by hand under fire. The 21st Marines of the reserve 3rd Marine Division begin coming ashore.'),
    ev('1945-02-21', 'Kamikazes wreck Saratoga', 'loss',
      { name: 'Off Iwo Jima (approx.)', lat: 24.9, lng: 141.55 }, 9,
      'A special attack unit of 32 aircraft, formed for the battle, flies from Katori in Chiba and refuels on Hachijō-jima before reaching the fleet late in the day. Six planes find Saratoga, detached with only three destroyers to fly night patrols. In three minutes she takes five bomb hits and three suicide crashes; 123 of her crew are killed or missing, and 40 of her aircraft are destroyed. She will never fight again.',
      ord('17:00', { facts: [['Saratoga', '123 dead or missing, 192 wounded'], ['Aircraft lost', '31 F6F Hellcats, 9 TBM Avengers']] })),
    ev('1945-02-21', 'Bismarck Sea is sunk', 'loss', P.carriers, 9,
      'At 18:45 the kamikazes reach the escort carriers about 21 miles east of Iwo Jima. A plane slips in low on Bismarck Sea’s starboard side and crashes into her hangar deck; a second hits about two minutes later. Fires reach her ammunition, she is abandoned at 19:05 and she sinks at 21:15 with 318 men. She is the last American aircraft carrier lost in the war.',
      at('18:45', { facts: [['Dead', '318'], ['Rescued', '605 of 923']] })),
    ev('1945-02-22', 'Suribachi surrounded', 'attack', P.suribachi, 12,
      'The 28th Marines complete their ring around the base of the volcano. They expect a hard fight for the summit, which is still linked to its garrison through the tunnels inside it.'),
    ev('1945-02-23', 'The first flag on Suribachi', 'attack', P.suribachi, 13,
      'After two four-man patrols reach the top and come back untouched, a 40-man patrol from Easy Company under First Lieutenant Harold G. Schrier climbs the volcano carrying the battalion’s small flag. At the crater rim they find a length of Japanese water pipe, and at about 10:30 the flag goes up, the first foreign flag raised over Japanese home territory. Cheers and ships’ horns erupt below, and a brief firefight breaks out at the summit. Staff Sergeant Louis R. Lowery photographs it.',
      at('10:30', { approx: true, facts: [['Patrol', 'Third Platoon, E Company, 2nd Battalion, 28th Marines'], ['Flag', '54 × 28 inches, from the transport Missoula']] })),
    ev('1945-02-23', 'Forrestal wants the flag', 'political', P.beaches, 12,
      'Secretary of the Navy James Forrestal lands with Holland Smith just after the flag goes up and remarks that it means a Marine Corps for the next 500 years. When word comes that Forrestal would like the flag as a souvenir, Johnson refuses to give up his battalion’s colours and sends for a bigger replacement.',
      ord('11:00')),
    ev('1945-02-23', 'Rosenthal’s photograph', 'political', P.suribachi, 13,
      'Sergeant Michael Strank’s squad and a runner bring up a larger flag, 96 by 56 inches, from a tank landing ship. Shortly after noon six Marines raise it on a heavier pipe as the first flag comes down. Associated Press photographer Joe Rosenthal, standing on a pile of rocks, swings his camera up and takes the picture without using the viewfinder; Sergeant Bill Genaust films the same moment beside him.',
      ord('12:30', { approx: true, facts: [['Flag raisers (as now identified)', 'Michael Strank, Harlon Block, Franklin Sousley, Ira Hayes, Harold Schultz, Harold Keller']],
        link: { timeline: 'road-to-tokyo-bay', event: '1945-02-23-the-flag-over-suribachi', label: 'See this in The Road to Tokyo Bay' } })),
    ev('1945-02-23', 'Williams and his flamethrower', 'attack', P.airfield2, 12,
      'About 1,000 yards from Suribachi, where he can see the flag go up, Corporal Hershel W. Williams of the 3rd Marine Division goes forward alone, covered by four riflemen, against a belt of concrete pillboxes blocking the tanks. For four hours he wipes out one position after another with flamethrowers and demolition charges.',
      ord('14:00', { link: { timeline: 'medal-of-honor', event: '1945-02-23-williams-hershel-w', label: 'See Hershel W. Williams in the Medal of Honor timeline' } })),
    ev('1945-02-24', 'The 3rd Marine Division joins the line', 'movement', P.airfield2, 11,
      'The 9th Marines, with the division’s artillery and tanks, land to join the 21st Marines. Major General Graves B. Erskine’s 3rd Division now fights alongside Clifton B. Cates’s 4th and Keller E. Rockey’s 5th for the drive north. All three Marine divisions are now committed.',
      { facts: [['3rd Marine Division', 'Maj. Gen. Graves B. Erskine'], ['4th Marine Division', 'Maj. Gen. Clifton B. Cates'], ['5th Marine Division', 'Maj. Gen. Keller E. Rockey']] }),
    ev('1945-02-25', 'The photograph goes round the world', 'home-front', P.newYork, 9,
      'Rosenthal’s film is sent to Guam for processing, and the AP’s photo editor there sends it straight to New York. Within about 17 hours of being taken the picture is on the wire, and on Sunday it appears in newspapers across the United States. It will win the Pulitzer Prize for Photography the same year.'),

    // ---------- The drive north ----------
    ev('1945-02-26', 'Into the Meat Grinder', 'attack', P.meatGrinder, 13,
      'In front of the 4th Marine Division lies the strongest ground on the island: Hill 382, the rock mass called Turkey Knob, and the bowl between them known as the Amphitheater. The Marines call it the Meat Grinder. Units that break in are raked from the flanks, tanks are destroyed by mines and interlocking fire, and positions taken by day are reoccupied through tunnels. Private First Class Douglas T. Jacobson destroys 16 positions with a bazooka as his unit fights toward the summit of Hill 382.',
      { facts: [['Japanese strength in the north', 'About eight infantry battalions, a tank regiment, artillery and mortar battalions, and about 5,000 gunners and naval infantry']],
        link: { timeline: 'medal-of-honor', event: '1945-02-26-jacobson-douglas-t', label: 'See Douglas T. Jacobson in the Medal of Honor timeline' } }),
    ev('1945-02-27', 'The ridges beyond Airfield No. 2', 'attack', P.airfield2, 12,
      'In the centre, the 3rd Marine Division fights through high rocky ridges north of the airfield. Over two days Private Wilson D. Watson of the 9th Marines kills some 60 Japanese single-handed so that his pinned-down platoon can move. Sergeant Ross Gray, who cleared the minefield six days earlier, is killed by a shell.'),
    ev('1945-03-01', 'Two flag raisers fall', 'loss', P.hill362, 12,
      'On the west side, the 28th Marines are fighting among the strongpoints of Hill 362A. Sergeant Michael Strank is killed by a shell, possibly friendly fire from a destroyer, and Corporal Harlon Block by a mortar round a few hours later, six days after they raised the second flag. Tony Stein, who left a hospital ship to rejoin his company, is killed by a sniper leading a patrol.'),
    ev('1945-03-02', 'Colonel Johnson is killed', 'loss', P.hill362, 12,
      'Chandler Johnson, whose battalion took Suribachi, goes forward to reorganise his pinned-down companies in the broken ground north of Hill 362A and is killed instantly by a mortar round.'),
    ev('1945-03-04', 'Dinah Might lands', 'service', P.chidori, 12,
      'Low on fuel near the island, the B-29 Dinah Might of the 9th Bomb Group asks to land on Iwo Jima. With fighting still going on, it touches down on South Field, the former Airfield No. 1, is refuelled and takes off again, the first of 2,251 B-29 landings on the island during the war.',
      { facts: [['B-29 landings on Iwo Jima', '2,251 during the war']] }),
    ev('1945-03-06', 'Mustangs arrive', 'movement', P.chidori, 12,
      'P-51 Mustangs of the 15th Fighter Group’s 47th Fighter Squadron fly in from Saipan, with two more squadrons the next day. They take over close air support from the escort carriers, bombing and strafing cave mouths and trenches a short flight from their own runway.'),
    ev('1945-03-07', 'An attack in the dark', 'attack', P.eastHills, 12,
      'The defenders have learned to wait out each barrage in their caves and re-emerge for the infantry attack that follows. Erskine sends the 9th Marines forward before dawn with no preliminary bombardment, and many Japanese are caught asleep. Second Lieutenant John H. Leims leads his company in a surprise attack that takes a dominating hill position by late afternoon.',
      ord('05:00')),
    ev('1945-03-08', 'Lummus near Kitano Point', 'loss', P.kitano, 12,
      'First Lieutenant Jack Lummus, a former New York Giants end, leads his platoon of the 27th Marines against an objective east of Kitano Point near the northern tip of the island. He destroys three mutually supporting strongpoints, then steps on a land mine and is mortally wounded, urging his men on as he lies on the ground.',
      ord('12:00')),
    ev('1945-03-08', 'Captain Inouye’s charge', 'attack', { name: 'Marine lines in the north of the island (approx.)', lat: 24.795, lng: 141.322 }, 11,
      'Against Kuribayashi’s orders, a local commander decides on a massed night attack, with the hope of fighting all the way back to Suribachi. In the evening Captain Samaji Inouye leads about 1,000 men against the Marine lines. They cause 347 casualties, 90 of them killed; the next morning the Marines count 784 Japanese dead.',
      ord('20:00', { facts: [['Marine casualties', '347 (90 killed)'], ['Japanese dead counted', '784']] })),
    ev('1945-03-09', 'The 3rd Division reaches the sea', 'attack', P.northCoast, 11,
      'Elements of the 3rd Marine Division break through to the northeast coast, splitting what is left of Kuribayashi’s defences in two.'),
    ev('1945-03-14', 'The official flag raising', 'political', P.iwo, 11,
      'On Holland Smith’s orders, a flag is formally raised at a ceremony at the V Amphibious Corps command post, attended by General Erskine. At the same time the flag that has flown on Suribachi since 23 February is taken down.'),
    ev('1945-03-16', 'Declared secure, but not yet won', 'political', P.gorge, 11,
      'At 18:00, 25 days after the landings, the island is declared secure. Fighting goes on. The 5th Marine Division still faces Kuribayashi’s last stronghold, a gorge about 700 yards long at the northwest end of the island, and other pockets remain. One is later named Cushman’s Pocket after Lieutenant Colonel Robert E. Cushman Jr., whose 2nd Battalion, 9th Marines had two companies trapped there and nearly wiped out.',
      at('18:00')),
    ev('1945-03-17', 'Kuribayashi’s farewell', 'political', P.gorge, 12,
      'Kuribayashi sends his farewell to Imperial General Headquarters: his men have fought with nothing against overwhelming material strength, their ammunition and water are gone, and he apologises for yielding the island. He adds three death poems that historians have read as a quiet protest against the high command. American appeals to surrender, by loudspeaker and through prisoners, are ignored.'),
    ev('1945-03-21', 'The Gorge command post is blown up', 'attack', P.gorge, 13,
      'Marines destroy the command post in the Gorge with four tons of explosives. Private First Class Franklin Sousley, another of the second flag raisers, is killed by a sniper. Below Suribachi the 5th Marine Division dedicates its cemetery; Chaplain Roland Gittelsohn speaks of friends buried there.'),
    ev('1945-03-22', 'Baron Nishi dies', 'loss', P.northCoast, 12,
      'Takeichi Nishi, whose dug-in tanks had fought the Marine Shermans, dies in the last days of the defence, probably on the island’s east coast. Americans had broadcast daily appeals to the Olympic champion to surrender; he never answered.',
      { approx: true }),
    ev('1945-03-23', '“Goodbye from Iwo”', 'intelligence', P.chichi, 9,
      'In the evening Kuribayashi radios his last message to the garrison on Chichi Jima, saying goodbye to all its officers and men. The radio station there tries to raise him for three days and hears nothing more.',
      ord('19:00')),
    ev('1945-03-24', 'The last caves are sealed', 'attack', P.kitano, 12,
      'Marines seal the remaining caves at the northern tip of the island.'),
    ev('1945-03-26', 'The final attack', 'attack', P.finalAttack, 12,
      'Shortly before dawn about 300 Japanese fall on the camps near Airfield No. 2. In silence, not with a banzai charge, they slash tents and attack sleeping Army pilots, Seabees and men of the 5th Pioneer Battalion and 28th Marines. Up to 90 minutes of hand-to-hand fighting follows; 53 Americans are killed and 120 wounded. First Lieutenant Harry L. Martin rallies a firing line and is killed after rescuing trapped men.',
      ord('05:00', { facts: [['American losses', '53 killed, 120 wounded'], ['Attackers', 'About 300']],
        link: { timeline: 'medal-of-honor', event: '1945-03-26-martin-harry-l', label: 'See Harry L. Martin in the Medal of Honor timeline' } })),
    ev('1945-03-26', 'Kuribayashi’s end', 'loss', P.finalAttack, 12,
      'Kuribayashi is most likely killed in or soon after the final attack, which he may have led in person, having removed his badges of rank. His body is never identified. Admiral Ichimaru also dies on 26 March. Holland Smith will later call Kuribayashi the most formidable of all his Pacific opponents.',
      ord('06:00', { approx: true })),
    ev('1945-03-26', 'Iwo Jima is secured', 'political', P.iwo, 10,
      'At 09:00 the island is officially declared secure after 36 days. It is the only Marine battle of the war in which American casualties exceed Japanese, although Japanese deaths are about three times American. Of some 21,000 defenders, only 216 are taken prisoner during the battle. Twenty-seven Medals of Honor are awarded for it, more than a quarter of those won by Marines in the whole war.',
      at('09:00', { facts: [['U.S. casualties', 'More than 26,000, including about 6,800 dead'], ['Japanese', 'About 21,000 defenders; 216 captured during the battle'], ['U.S. ships lost', 'Escort carrier Bismarck Sea']],
        link: { timeline: 'road-to-tokyo-bay', event: '1945-03-26-iwo-jima-secured', label: 'See this in The Road to Tokyo Bay' } })),

    // ---------- Aftermath ----------
    ev('1945-03-27', 'The Marines leave', 'movement', P.cemetery, 11,
      'The 5th Marine Division, which landed below Suribachi and suffered the heaviest losses of the three divisions, sails for Hawaii. The Army’s 147th Infantry Regiment takes over the island. For three months it hunts more than 3,000 holdouts through the caves with flamethrowers and satchel charges, killing about 1,600 and capturing 867.',
      { facts: [['5th Marine Division', '2,482 killed, 19 missing, 6,218 wounded'], ['147th Infantry', '15 killed, 144 wounded']] }),
    ev('1945-04-07', 'Mustangs escort the B-29s to Tokyo', 'attack', P.tokyo, 7,
      'The 15th Fighter Group flies its first very-long-range mission from Iwo Jima, escorting B-29s against the Nakajima aircraft plant near Tokyo. The bombing campaign has by now largely turned to night incendiary raids, and only ten such escort missions will be flown; the Iwo Jima Mustangs turn mostly to strafing airfields and transport in Japan.',
      { paths: [{ label: 'Iwo Jima to Tokyo', kind: 'strike', coords: [[24.78, 141.32], [30, 140.5], [35.68, 139.76]] }] }),
    ev('1945-06-15', 'A runway for Superfortresses', 'service', P.airfield2, 11,
      'In June more than 800 B-29s land on Iwo Jima, the busiest month of the war there. Most stop to refuel or for minor repairs; none that month lands because of battle damage. Seabees lengthen Central Field to 9,800 feet by 12 July. Whether the island saved as many aircrew as was later claimed remains disputed, but its value as an emergency field became the battle’s best-known justification.',
      { approx: true, facts: [['Central Field runway', '9,800 × 200 ft by 12 July 1945']] }),
    ev('1949-01-06', 'The last holdouts surrender', 'life', P.iwo, 10,
      'Two Japanese naval machine gunners, survivors of the garrison who have hidden on the island for almost four years, finally give themselves up.'),
  ];

  // ---------- Shot list ----------
  // Camera direction (see "Shots" in app.js). Events not listed use the automatic framing.
  const pt = (place) => [place.lat, place.lng];
  const SHOTS = {
    // Where the island sits: between Tokyo and the bomber bases in the Marianas.
    'Raids on the Marianas': { shot: 'wide', transition: 'pull-back', frame: [pt(P.iwo), pt(P.tokyo)] },
    // D-Day: the whole southern half of the island, beaches, airfield and Suribachi together.
    'The first wave lands': { scene: 'd-day', transition: 'fly', frame: [pt(P.suribachi), pt(P.quarry)] },
    'Black sand': { scene: 'd-day' },
    'The beaches erupt': { scene: 'd-day' },
    'Basilone is killed': { scene: 'd-day' },
    'A foothold on Airfield No. 1': { scene: 'd-day' },
    'The 28th Marines cut off Suribachi': { scene: 'd-day' },
    'Slaughter at the Quarry': { scene: 'd-day' },
    // The flags: close on the summit.
    'The first flag on Suribachi': { scene: 'flags', shot: 'tight' },
    'Forrestal wants the flag': { scene: 'flags', frame: [pt(P.suribachi)] },
    'Rosenthal’s photograph': { scene: 'flags', shot: 'tight' },
    // The drive north: the island from end to end.
    'Into the Meat Grinder': { shot: 'tight', transition: 'fly' },
    'The 3rd Division reaches the sea': { frame: [pt(P.meatGrinder), pt(P.kitano)] },
    // The end: the Gorge, then the last attack and the island as a whole.
    'The Gorge command post is blown up': { shot: 'tight' },
    'Iwo Jima is secured': { shot: 'wide', transition: 'pull-back', frame: [pt(P.suribachi), pt(P.kitano)] },
  };
  const events = WW2.events['iwo-jima'];
  for (const [title, shot] of Object.entries(SHOTS)) {
    const e = events.find((x) => x.title === title);
    if (!e) throw new Error(`iwo-jima shot list: no event titled "${title}"`);
    Object.assign(e, shot);
  }
})();
