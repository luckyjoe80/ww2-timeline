// Timeline: The Kokoda Track (War in the Pacific).
// The Papuan campaign of 1942–43: the Japanese landings near Gona in July 1942, the advance
// over the Owen Stanley Range along the Kokoda Track to within sight of Port Moresby, the
// Japanese defeat at Milne Bay, the Australian counter-offensive back over the mountains, and
// the battle for the Buna–Gona–Sanananda beachheads, ending on 22 January 1943.
// Checked against the English Wikipedia articles "Kokoda Track campaign", "Battle of Kokoda",
// "Battle of Isurava", "Battle of Mission Ridge – Brigade Hill", "Battle of Ioribaiwa",
// "Battle of Milne Bay", "Battle of Buna–Gona", "Tomitarō Horii", "39th Battalion (Australia)",
// "Battle of Oivi–Gorari" and "Robert L. Eichelberger" (October 2026).
//
// Times are local Papuan times as the sources give them (shown as Papua time). Many places on
// the track have no Wikipedia coordinates; their positions are estimated from the distances
// and directions the articles give and are marked "(approx.)". Event schema: see
// data/timelines/attack-on-hawaii.js.

(function () {
  const P = {
    moresby: { name: 'Port Moresby, Papua', lat: -9.479, lng: 147.149 },
    koitaki: { name: 'Koitaki, near Port Moresby (approx.)', lat: -9.42, lng: 147.37 },
    owers: { name: 'Owers’ Corner, head of the Kokoda Track (approx.)', lat: -9.36, lng: 147.4 },
    imita: { name: 'Imita Ridge, Kokoda Track (approx.)', lat: -9.33, lng: 147.43 },
    ioribaiwa: { name: 'Ioribaiwa Ridge, Kokoda Track', lat: -9.27, lng: 147.48 },
    jawarere: { name: 'Jawarere, east of the track (approx.)', lat: -9.33, lng: 147.53 },
    brigadeHill: { name: 'Brigade Hill and Mission Ridge, south of Efogi (approx.)', lat: -9.21, lng: 147.65 },
    myola: { name: 'Myola dry lake beds, Owen Stanley Range (approx.)', lat: -9.15, lng: 147.76 },
    templetons: { name: 'Templeton’s Crossing, Eora Creek (approx.)', lat: -9.11, lng: 147.72 },
    eora: { name: 'Eora Village, Eora Creek (approx.)', lat: -9.08, lng: 147.73 },
    isurava: { name: 'Isurava, Kokoda Track', lat: -9.0, lng: 147.733 },
    deniki: { name: 'Deniki, south of Kokoda (approx.)', lat: -8.93, lng: 147.71 },
    kokoda: { name: 'Kokoda government station and airstrip', lat: -8.878, lng: 147.737 },
    oivi: { name: 'Oivi, east of Kokoda (approx.)', lat: -8.88, lng: 147.85 },
    gorari: { name: 'Gorari, east of Oivi (approx.)', lat: -8.87, lng: 147.9 },
    wairopi: { name: 'Wairopi, Kumusi River crossing (approx.)', lat: -8.84, lng: 147.97 },
    awala: { name: 'Near Awala, between Gona and the Kumusi (approx.)', lat: -8.8, lng: 148.1 },
    kumusiMouth: { name: 'Mouth of the Kumusi River (approx.)', lat: -8.5, lng: 148.23 },
    gona: { name: 'Gona, north coast of Papua', lat: -8.62, lng: 148.25 },
    sanananda: { name: 'Sanananda, north coast of Papua', lat: -8.633, lng: 148.367 },
    huggins: { name: 'Huggins’ Roadblock, Sanananda Track (approx.)', lat: -8.7, lng: 148.3 },
    buna: { name: 'Buna Village and Government Station', lat: -8.66, lng: 148.4 },
    duropa: { name: 'Duropa Plantation and the airstrips, east of Buna (approx.)', lat: -8.65, lng: 148.45 },
    beachheads: { name: 'Buna–Gona beachheads, Papua', lat: -8.65, lng: 148.35 },
    goodenough: { name: 'Goodenough Island', lat: -9.367, lng: 150.267 },
    gili: { name: 'No. 1 Airstrip, Gili Gili, Milne Bay', lat: -10.311, lng: 150.334 },
    strip3: { name: 'No. 3 Airstrip, Kilarbo, Milne Bay (approx.)', lat: -10.3, lng: 150.39 },
    kbMission: { name: 'KB Mission, north shore of Milne Bay (approx.)', lat: -10.31, lng: 150.47 },
    wagaWaga: { name: 'Waga Waga, north shore of Milne Bay (approx.)', lat: -10.34, lng: 150.55 },
    milneBay: { name: 'Milne Bay, Papua', lat: -10.32, lng: 150.48 },
  };

  const ev = (date, title, type, location, zoom, summary, extra = {}) => ({
    id: extra.id || `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}`,
    date, title, type, location, zoom, summary,
    theater: extra.theater || 'Pacific',
    ...extra,
  });
  const at = (time, extra = {}) => ({ time, tz: 'PNG', ...extra });
  const ord = (sortTime) => ({ sortTime, tz: 'PNG' }); // order within the day only; no time shown

  const TRACK = [[-9.36, 147.4], [-9.33, 147.43], [-9.27, 147.48], [-9.27, 147.56], [-9.24, 147.62], [-9.21, 147.65], [-9.17, 147.69], [-9.11, 147.72], [-9.08, 147.73], [-9.03, 147.75], [-9.0, 147.733], [-8.93, 147.71], [-8.878, 147.737]];

  WW2.events['kokoda-track'] = [
    // ---------- Lead-up ----------
    ev('1942-07-14', 'The 39th Battalion’s B Company reaches Kokoda', 'movement', P.kokoda, 10,
      'After the Coral Sea defeat, Japan is weighing an overland route to Port Moresby. Under orders to secure Kokoda and its airstrip, Captain Sam Templeton’s B Company of the militia 39th Battalion walks the track from Uberi, guided by Lieutenant Bert Kienzle, who sets up staging points along the way. The Papuan Infantry Battalion is already patrolling the north coast. The code word for the force is “Maroubra”.',
      { facts: [['Force', 'B Company, 39th Battalion; Papuan Infantry Battalion (310 men)'], ['Walk', 'About 8 days from the head of the track']],
        paths: [{ label: 'The Kokoda Track (approximate)', kind: 'route', coords: TRACK }] }),
    ev('1942-07-21', 'Japanese troops land near Gona', 'invasion', P.gona, 10,
      'From about 17:30 the advance party of Major General Tomitarō Horii’s South Seas Detachment begins landing near Gona, under Colonel Yokoyama Yosuke of the 15th Independent Engineer Regiment. Allied aircraft attack until dark and again next morning, sinking one transport. Naval troops land to start an airfield at Buna, and an infantry company sets off at once for Kokoda.',
      at('17:30', { approx: true, facts: [['Japanese advance party', '15th Independent Engineer Regiment, 1/144th Infantry, mountain artillery, about 2,500 labourers'], ['Objective', 'Port Moresby, overland']],
        link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1942-07-21-japanese-land-at-buna-and-gona', label: 'See this in Pearl Harbor to Guadalcanal' } })),
    ev('1942-07-22', 'Kittyhawks arrive at Milne Bay', 'movement', P.gili, 11,
      'At the eastern tip of Papua, three P-40 Kittyhawks of No. 76 Squadron RAAF land on the new No. 1 Airstrip at Milne Bay, built by American engineers and Papuan workers since June. More from Nos. 75 and 76 Squadrons follow three days later. The runway is only partly covered with steel matting and often under water.'),
    ev('1942-07-23', 'First contact near Awala', 'attack', P.awala, 10,
      'At about 16:00 a Papuan Infantry Battalion patrol under Lieutenant Chalk ambushes the advancing Japanese near Awala. The withdrawing Australians destroy the wire-rope bridge over the Kumusi River at Wairopi and harass the Japanese as they cross.',
      at('16:00', { approx: true })),
    ev('1942-07-26', 'A stand at Oivi; Templeton disappears', 'attack', P.oivi, 11,
      'A platoon of D Company is flown into Kokoda in two lifts by a single aircraft and hurried forward to Oivi, where B Company and the Papuans have dug in. The Japanese attack at 15:00 and begin to encircle the position. Templeton goes back to warn the second lift and is never seen again. Major William Watson of the PIB leads the survivors off towards Deniki.',
      at('15:00')),
    ev('1942-07-28', 'Owen reoccupies Kokoda', 'movement', P.kokoda, 12,
      'Lieutenant Colonel William Owen, the 39th Battalion’s commander, has fallen back to Deniki. When stragglers report Kokoda empty he marches back and is in the village by 11:30 with roughly 80 to 148 men. Two transports carrying reinforcements circle overhead but do not land, because the barricades across the airstrip are not cleared in time. About 200 Japanese under Captain Ogawa arrive that afternoon.',
      at('11:30')),
    ev('1942-07-29', 'Kokoda falls; Owen is killed', 'loss', P.kokoda, 12,
      'After a night of mortar and gun fire that the Australians cannot answer, the main Japanese assault comes up the steep sides of the plateau at 02:30. Owen is shot above the eye while moving among his forward posts and dies of the wound. Watson takes the force back through the fog to Deniki, losing the airstrip that might have kept the Australians supplied. Owen becomes the first Australian awarded the US Distinguished Service Cross.',
      at('02:30', { facts: [['Losses', 'Australia 7 killed, 6 wounded; Japan 12 killed, 26 wounded (including Ogawa)']],
        link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1942-07-29-kokoda-falls', label: 'See this in Pearl Harbor to Guadalcanal' } })),
    ev('1942-08-03', 'Kienzle finds Myola', 'service', P.myola, 11,
      'Air drops at Kagi and Efogi are losing much of their loads in the jungle. Kienzle goes looking for an open patch he remembers seeing from the air and finds two dry lake beds near the crest of the range. He names the smaller one Myola and asks for drops to begin there. It becomes the main supply base on the track.'),
    ev('1942-08-08', 'Symington retakes Kokoda', 'attack', P.kokoda, 11,
      'Major Allan Cameron sends three companies of the 39th Battalion against Kokoda by three routes, after P-39s bomb and strafe the area. By chance the Japanese 1/144th Battalion is advancing on Deniki the same day: C Company runs into it head on and is driven back, and D Company is attacked at Pirivi. Captain Noel Symington’s A Company, using a track the Japanese do not know, walks into Kokoda almost unopposed.',
      { facts: [['Australians', 'About 550 (430 attacking)'], ['Japanese', 'About 660']] }),
    ev('1942-08-10', 'A Company slips out of Kokoda', 'movement', P.kokoda, 11,
      'With no supplies or reinforcements arriving, Symington’s company holds Kokoda against repeated attacks until 19:00, then withdraws west by a roundabout route and reaches Isurava three days later. The air drop meant for it falls two days later into Japanese hands.',
      at('19:00')),
    ev('1942-08-14', 'The 39th Battalion falls back to Isurava', 'movement', P.deniki, 11,
      'The Japanese attack Deniki from 05:30 on 13 August in heavy rain and resume the next morning, working around the flanks. At 09:50 Cameron orders the battalion back along the track to Isurava, abandoning much of its stores. The Japanese pause to bring up Horii’s main force.',
      at('09:50')),
    ev('1942-08-16', 'Honner takes over at Isurava', 'service', P.isurava, 11,
      'Lieutenant Colonel Ralph Honner arrives to command the exhausted 39th Battalion, whose men are digging in at Isurava with helmets and bayonets. Two battalions of the veteran 21st Brigade under Brigadier Arnold Potts are on their way up the track, and the militia 53rd Battalion is moving to Alola.'),
    ev('1942-08-17', 'Raid on Port Moresby wrecks the transports', 'loss', P.moresby, 10,
      'Japanese bombers catch aircraft parked close together at Port Moresby and destroy or damage most of the transport planes used to drop supplies on the track. Accounts differ on the numbers, but for several days almost nothing can be dropped. When Potts reaches Myola on 21 August he finds only about 8,000 rations instead of the 40,000 he was promised, and has to hold his battalions back until a reserve builds up.',
      { facts: [['Rations at Myola', 'About 8,000 found; 40,000 expected']] }),

    // ---------- Milne Bay and Isurava ----------
    ev('1942-08-24', 'Kittyhawks destroy the barges at Goodenough Island', 'attack', P.goodenough, 10,
      'Codebreakers have warned MacArthur that Milne Bay will be attacked, and he has sent the veteran 18th Brigade there. A Hudson and coastwatchers report a Japanese convoy heading for the bay. Seven barges carrying naval troops to land behind the Australians have stopped at Goodenough Island; twelve Kittyhawks strafe them for two hours and destroy every one, stranding the men aboard.',
      ord('12:00')),
    ev('1942-08-25', 'Japanese land at Milne Bay', 'invasion', P.wagaWaga, 11,
      'Expecting a garrison of two or three companies, the Japanese Navy lands just over 1,000 Special Naval Landing Force troops and two light tanks on the north shore of the bay at about 22:30. They come ashore near Waga Waga, about 3 km east of their intended beach. The Allies have some 8,800 men at Milne Bay, about 4,500 of them infantry, under Major General Cyril Clowes.',
      at('22:30', { facts: [['Japanese', '5th Kure and 5th Sasebo SNLF, two Type 95 tanks'], ['Code name', 'Operation RE']],
        link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1942-08-25-japanese-land-at-milne-bay', label: 'See this in Pearl Harbor to Guadalcanal' } })),
    ev('1942-08-26', 'The Battle of Isurava begins', 'attack', P.isurava, 12,
      'Around midday Japanese artillery begins shelling the Isurava position as the 2/14th Battalion arrives to relieve the 39th, which stays to fight alongside it. One Japanese battalion attacks along the main track while another pushes down the parallel track on the far side of Eora Creek. There the 53rd Battalion gives way and its commander, Lieutenant Colonel Kenneth Ward, is killed in an ambush. The 2/16th Battalion is rushed up to hold the flank.',
      at('12:00', { approx: true, facts: [['Australians', 'About 2,290 (39th, 53rd, 2/14th, 2/16th Battalions)'], ['Japanese', 'About 2,130 engaged, including artillery']] })),
    ev('1942-08-26', 'Air attacks wreck the Japanese landing base', 'attack', P.kbMission, 11,
      'At daylight RAAF Kittyhawks and American bombers hit the Japanese beachhead, destroying stores and the landing barges that might have carried troops around the Australian flanks. Meanwhile the Japanese push west along the coast track behind their two tanks against the militia 61st Battalion around KB Mission.',
      ord('07:00')),
    ev('1942-08-27', 'Tanks at night at KB Mission', 'attack', P.kbMission, 12,
      'The 2/10th Battalion has been sent forward to KB Mission with no clear purpose. At 20:00 two Japanese tanks with headlights blazing drive into the plantation. Sticky bombs will not stick in the humidity, and after four attacks are beaten off the Japanese are inside the position by midnight. The battalion falls back in disorder across the Gama River, losing 43 killed.',
      at('20:00')),
    ev('1942-08-28', 'The airstrip holds', 'attack', P.strip3, 12,
      'Around dawn the Japanese reach the unfinished No. 3 Airstrip, a wide open field of fire. Militia of the 25th and 61st Battalions and gunners of the US 709th Anti-Aircraft Battery turn them back. The Japanese tanks have bogged down in the mud and are abandoned; an Australian patrol finds them the next day.',
      ord('06:00')),
    ev('1942-08-29', 'Kingsbury’s charge', 'attack', P.isurava, 12,
      'The Japanese hold the ridges on both sides of the valley and pour fire into the shrinking Australian perimeter. When part of the 2/14th is overrun, Private Bruce Kingsbury joins a counterattack, firing a Bren gun from the hip and clearing a path through the attackers before a sniper kills him. He is awarded the Victoria Cross, the first for an action on Australian territory. That night the defenders pull back to the Isurava rest house.',
      { facts: [['Award', 'Victoria Cross (posthumous)']] }),
    ev('1942-08-30', 'Potts orders the withdrawal from Isurava', 'movement', P.isurava, 11,
      'A Japanese battalion emerges on the western flank and cuts the track back to Alola. At 15:00 Potts orders a withdrawal towards Eora Village. Many groups are separated in the confusion; Lieutenant Colonel Arthur Key of the 2/14th is captured and later killed. The battle has cost the Australians about 99 killed and the Japanese about 140.',
      at('15:00', { facts: [['Losses', 'Australia 99 killed, 111 wounded; Japan about 140 killed, 231 wounded']] })),
    ev('1942-08-31', 'Banzai charges at No. 3 Airstrip', 'attack', P.strip3, 12,
      'Reinforced by about 770 more naval troops landed on the night of 29 August, the Japanese attack across the airstrip at 03:00. Lit by flares, they are cut down by machine guns, mortars and the 25-pounders of the 2/5th Field Regiment. Two more charges fail and their commander, Commander Hayashi, is killed. The survivors fall back before dawn, and later that morning the 2/12th Battalion begins the Australian counterattack along the north shore.',
      at('03:00')),
    ev('1942-09-02', 'A fighting withdrawal past Templeton’s Crossing', 'movement', P.templetons, 11,
      'The 2/16th and 2/14th Battalions take turns holding delaying positions: Eora Village until 06:00 on 2 September, a spur above Templeton’s Crossing until dusk, then a position near Dump 1 until the night of 4 September. Potts makes a clean break, but has to abandon Myola, destroying what cannot be carried.',
      at('06:00')),
    ev('1942-09-04', 'Corporal French at Goroni', 'attack', { name: 'Goroni, north shore of Milne Bay (approx.)', lat: -10.32, lng: 150.52 }, 12,
      'Advancing along the north shore, the 2/9th Battalion attacks a Japanese position at Goroni at 15:15. Corporal John French orders his section to take cover, knocks out two machine guns with grenades and charges the third with a Thompson gun. He is found dead in front of it and is awarded the Victoria Cross posthumously. By evening the Japanese have only about 50 fit men left.',
      at('15:15')),
    ev('1942-09-05', 'Japan pulls out of Milne Bay', 'movement', P.wagaWaga, 10,
      'The Japanese command accepts that its troops cannot hold out until army reinforcements arrive and orders a withdrawal. Ships take off the survivors that evening. In all, 1,318 of the 1,943 Japanese landed are evacuated.',
      ord('20:00')),
    ev('1942-09-06', 'Anshun sunk at her moorings', 'loss', P.gili, 11,
      'Shortly after 22:00 the cruiser Tenryū and the destroyer Arashi enter the bay and shell the freighter Anshun, which is unloading under her lights; she rolls onto her side. They light up but do not fire on the hospital ship Manunda.',
      at('22:00', { approx: true })),
    ev('1942-09-07', 'Milne Bay: the first Japanese land defeat', 'attack', P.milneBay, 10,
      'Two Japanese warships shell the shore for a final 15 minutes, and the battle ends. It is often described as the first time in the Pacific War that Allied troops decisively defeated a Japanese land force and forced it to abandon its objective. Australian patrols find that every Australian taken prisoner has been killed, along with at least 59 civilians.',
      { facts: [['Allied losses', 'Australians 167 killed or missing; Americans 14 killed'], ['Japanese losses', 'About 625–750 killed']],
        link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1942-09-07-milne-bay-the-japanese-withdraw', label: 'See this in Pearl Harbor to Guadalcanal' } }),

    // ---------- Brigade Hill and Ioribaiwa ----------
    ev('1942-09-07', 'Marauders strike before Brigade Hill', 'attack', P.brigadeHill, 11,
      'Potts, now with all three battalions of the 21st Brigade, makes a stand on Mission Ridge and Brigade Hill south of Efogi. The night before, his men watch a line of Japanese lanterns moving down towards them. Eight B-26 Marauders escorted by four P-40s bomb and strafe the Japanese, and the 2/27th Battalion on the forward slope comes under artillery fire through the day.',
      ord('08:00')),
    ev('1942-09-08', 'Cut off at Brigade Hill', 'loss', P.brigadeHill, 12,
      'During the night a Japanese battalion, led by a Papuan guide, works around the western flank and comes up onto the track before dawn, between Potts’s headquarters and his battalions. Counterattacks from both sides fail. The 2/14th and 2/16th break track to the east and rejoin; the 2/27th vanishes into the jungle and, carrying its wounded and all its weapons, will not rejoin the Australians, at Jawarere, until 22 September. It is a disaster for the Australians.',
      { ...ord('05:00'), facts: [['Losses', 'Australia 87 killed, 77 wounded; Japan 60 killed, 165 wounded']] }),
    ev('1942-09-10', 'Potts is recalled', 'political', P.moresby, 9,
      'Lieutenant General Sydney Rowell, commanding New Guinea Force, recalls Potts to Port Moresby and gives Maroubra Force to Brigadier Selwyn Porter. The 2/14th and 2/16th are so reduced that they are merged into a single composite battalion.'),
    ev('1942-09-14', 'The Japanese attack at Ioribaiwa', 'attack', P.ioribaiwa, 12,
      'Brigadier Kenneth Eather’s fresh 25th Brigade has come up to counterattack, but the Japanese strike first, just as his battalions are moving out to the flanks. The attack is held on both flanks; a gap is found on 15 September between the 3rd and 2/33rd Battalions and the Japanese seize high ground there.',
      { facts: [['Australians', 'About 2,957'], ['Japanese', 'About 1,650 (2nd and 3rd Battalions, 144th Infantry)']] }),
    ev('1942-09-16', 'Eather withdraws to Imita Ridge', 'movement', P.imita, 11,
      'With the fighting at a standstill, Eather believes his line cannot hold and from 11:00 withdraws to Imita Ridge, the last defensible position before Port Moresby. Major General Arthur Allen of the 7th Division approves on condition that there will be no further retreat. The Japanese commander, Colonel Kusunose, has in fact used up his reserve.',
      at('11:00', { facts: [['Losses', 'Australia 49 killed, 121 wounded; Japan 40 killed, 120 wounded']] })),
    ev('1942-09-16', 'The lights of Port Moresby', 'intelligence', P.ioribaiwa, 10,
      'From the hills around Ioribaiwa the leading Japanese troops can see the lights of Port Moresby and the Coral Sea beyond, and they celebrate. They make no real attempt on Imita Ridge. Their rice ration is down to about 180 ml a day, and no captured stores can make up the shortfall.',
      { approx: true }),
    ev('1942-09-20', '25-pounders shell Ioribaiwa', 'attack', P.owers, 11,
      'Two 25-pounder guns of the 14th Field Regiment, hauled to Owers’ Corner by tractor, shell the Japanese at Ioribaiwa from about 10 km away. For the first time in the campaign the Australians have artillery of their own.'),
    ev('1942-09-23', 'Horii is ordered to pull back', 'political', { name: 'Rabaul, New Britain', lat: -4.2, lng: 152.183 }, 7,
      'The defeat of the Kawaguchi Detachment on Guadalcanal convinces the Japanese command that it cannot fight on both fronts. Lieutenant General Harukichi Hyakutake of the 17th Army orders Horii to secure the Isurava–Kokoda area and await the outcome on Guadalcanal. The same day General Sir Thomas Blamey arrives at Port Moresby, sent by the Australian government at MacArthur’s urging to take charge.'),
    ev('1942-09-26', 'The Japanese leave Ioribaiwa', 'movement', P.ioribaiwa, 11,
      'The 3/144th Battalion, the rearguard, slips away from Ioribaiwa during the night. Horii’s force has outrun its supply line and begins a well-ordered withdrawal to prepared positions in the mountains.',
      { link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1942-09-26-the-japanese-turn-back-short-of-port-mor', label: 'See this in Pearl Harbor to Guadalcanal' } }),
    ev('1942-09-28', 'Ioribaiwa found empty; Rowell sacked', 'political', P.ioribaiwa, 11,
      'Eather’s “all-out” assault on Ioribaiwa finds the positions abandoned. In Port Moresby, after a clash over Blamey’s presence in his headquarters, Rowell is relieved of command and replaced by Lieutenant General Edmund Herring.'),

    // ---------- The Australian advance ----------
    ev('1942-10-03', 'MacArthur at Owers’ Corner', 'political', P.owers, 11,
      'On his brief visit to Port Moresby, General Douglas MacArthur goes as far forward as Owers’ Corner for about an hour, as the 16th Brigade starts up the track. It is the closest he comes to the fighting in the campaign.'),
    ev('1942-10-10', 'Myola is retaken', 'movement', P.myola, 11,
      'The 25th Brigade reoccupies Myola unopposed and makes contact with the first Japanese delaying positions. Blamey has supplies dropped only at Myola, forcing Allen to advance to meet them.'),
    ev('1942-10-20', 'The 2/2nd breaks the block at Templeton’s Crossing', 'attack', P.templetons, 12,
      'Held up at Templeton’s Crossing since 16 October, the Australians send in the 2/2nd Battalion of the 16th Brigade, which attacks from the high ground to the east. The Japanese rearguard withdraws during the night. On 17 October Blamey has passed on MacArthur’s view that “extremely light casualties” show no serious effort is being made.'),
    ev('1942-10-22', 'The “running rabbit” parade', 'political', P.koitaki, 11,
      'At Koitaki, Blamey addresses the survivors of the 21st Brigade. Instead of thanking them, he tells them they were beaten by inferior forces and that it is “the rabbit who runs” who gets shot. The men are furious, and many disobey the “eyes right” on the march-past. The same day he tells Potts he is no longer needed in New Guinea.'),
    ev('1942-10-22', 'Frontal attack at Eora Village', 'attack', P.eora, 12,
      'The Japanese have spent nearly two months fortifying the spur above Eora Village, with machine guns and five guns. Against the advice of his battalion commanders, Brigadier John Lloyd orders a frontal attack that afternoon. By dawn on 24 October the attackers are pinned down with 34 killed.'),
    ev('1942-10-28', 'Eora falls; Allen is replaced by Vasey', 'attack', P.eora, 11,
      'The 2/3rd Battalion, having climbed above the Japanese positions, attacks on 27 October and again on the 28th as Horii’s rearguard is pulling out, and the defence collapses. The same day Blamey removes Allen, under pressure from MacArthur, and Major General George Vasey arrives at Myola to take over the 7th Division.'),
    ev('1942-11-02', 'Kokoda is retaken', 'movement', P.kokoda, 12,
      'A patrol of the 2/31st Battalion enters Kokoda and finds it abandoned, the airstrip overgrown. Supplies can now be landed instead of dropped, and the wounded flown out.'),
    ev('1942-11-03', 'The flag goes up at Kokoda', 'political', P.kokoda, 12,
      'At 15:30 Vasey leads a flag-raising ceremony in front of hundreds of soldiers and Papuans. Three days later he awards medals and gives trade goods to the Papuan carriers, whose care of the wounded has earned them the name “Fuzzy Wuzzy Angels”.',
      at('15:30')),
    ev('1942-11-11', 'Rout at Oivi–Gorari', 'attack', P.gorari, 11,
      'Horii, resupplied and reinforced, has dug in at Oivi and Gorari. The 16th Brigade cannot break the Oivi position head on, so Vasey sends the 25th Brigade around by a southern track to strike Gorari from the south on 9 November. On the 10th Horii orders a withdrawal that turns into a rout, and fighting dies down by midday on the 11th.',
      { facts: [['Japanese losses', 'About 430 killed, 400 wounded, 15 guns abandoned'], ['Australian casualties, 22 July–16 November', '625 killed, 1,055 wounded']] }),
    ev('1942-11-16', 'Across the Kumusi to the beachheads', 'movement', P.wairopi, 11,
      'The two brigades of the 7th Division finish crossing the Kumusi at Wairopi and head for the coast, the 25th towards Gona and the 16th towards Sanananda. The US 32nd Division approaches Buna from the southeast. Japanese troops landed from destroyers on 17 and 18 November bring the beachheads to an estimated 5,500 to 6,500 men in strong, well-hidden bunkers.',
      { link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1942-11-16-the-assault-on-buna-and-gona-begins', label: 'See this in Pearl Harbor to Guadalcanal' } }),

    // ---------- Buna–Gona ----------
    ev('1942-11-19', 'Horii drowns off the Kumusi', 'loss', P.kumusiMouth, 9,
      'With the Kumusi in flood, Horii sets off downriver by raft to reach the beachheads faster. When the raft snags he takes to a canoe, which is swept out to sea and capsizes in a storm. His orderly survives to report his death. (The articles give 19 and 23 November.) He is posthumously promoted to lieutenant general.',
      { approx: true }),
    ev('1942-11-19', 'The first attacks on Buna and Gona', 'attack', P.beachheads, 10,
      'The 128th Infantry attacks the eastern end of the Buna defences with only two mountain howitzers in support and is stopped with no gain. The 25th Brigade meets defended positions outside Gona; the 16th Brigade reaches the Sanananda Track positions next day. For two weeks repeated attacks make little progress against the bunkers, in conditions likened to the trench warfare of 1914–18.'),
    ev('1942-11-30', '“Take Buna, or not come back alive”', 'political', P.moresby, 10,
      'MacArthur, who will never visit the front, is losing patience with the 32nd Division. Lieutenant General Robert L. Eichelberger is flown to Port Moresby and told to relieve its commander and take Buna or not return alive. The same day American troops establish Huggins’ Roadblock behind the Japanese forward positions on the Sanananda Track.'),
    ev('1942-12-02', 'Eichelberger relieves Harding', 'political', P.buna, 10,
      'After inspecting the front, Eichelberger removes Major General Edwin Harding and most of his regimental and battalion commanders, pauses the Buna attacks for two days to reorganise, and improves food and medical supplies. He makes a point of wearing his three stars among the forward troops.'),
    ev('1942-12-05', 'Bottcher reaches the sea', 'attack', P.buna, 12,
      'In an attack on Buna Village, Staff Sergeant Herman Bottcher leads 18 men through to the beach, cutting the village off. They hold the position for seven days, and Bottcher, wounded twice, receives a battlefield commission and the Distinguished Service Cross.'),
    ev('1942-12-09', '“Gona’s gone!”', 'attack', P.gona, 12,
      'After weeks of failed attacks by the 25th and 21st Brigades, the 39th Battalion, back in action under Honner, attacks behind an artillery barrage with delay fuses on 8 December. The last pocket falls the next morning, and Honner signals his brigadier: “Gona’s gone!”'),
    ev('1942-12-14', 'Buna Village is taken', 'attack', P.buna, 12,
      'After heavy mortar fire, the newly arrived 3rd Battalion, 127th Infantry advances into Buna Village and finds the defenders gone. The Coconut Grove beyond is cleared over the next three days.'),
    ev('1942-12-18', 'Stuart tanks at Duropa Plantation', 'attack', P.duropa, 12,
      'Brigadier George Wootten’s 18th Brigade, the victors of Milne Bay, take over the stalled eastern front. Behind seven M3 Stuart tanks, the 2/9th Battalion drives through the Duropa Plantation towards Cape Endaiadere. It loses 171 men and two tanks on the first day, but breaks the deadlock.',
      { facts: [['2/9th Battalion losses, day one', '11 officers and 160 other ranks']] }),
    ev('1942-12-24', 'Christmas Eve at Buna', 'loss', P.duropa, 11,
      'At the eastern end, the four tanks supporting the 2/10th Battalion up the Old Strip are knocked out at the start by a hidden anti-aircraft gun. To the west, Americans attack across the Government Gardens, and one platoon reaches the sea before being forced back. Near Buna two American soldiers, First Sergeant Elmer J. Burr and Sergeant Kenneth E. Gruennert, earn the Medal of Honor, both posthumously.',
      { link: { timeline: 'medal-of-honor', event: '1942-12-24-burr-elmer-j', label: 'See Burr in the Medal of Honor timeline' } }),
    ev('1943-01-02', 'Buna Government Station falls', 'attack', P.buna, 12,
      'Urbana Force attacks the Government Station from the spit and the Musita Island bridge on 1 January. Next day some defenders try to escape by sea, and the last posts are taken in the afternoon as the Americans meet the Australians, who clear the coconut plantation to the east by mid-morning. The Buna area is in Allied hands.',
      { facts: [['18th Brigade losses since 18 December', '55 officers, 808 other ranks']] }),
    ev('1943-01-12', 'Attack on the Sanananda Track fails', 'attack', P.huggins, 11,
      'The 18th Brigade attacks the Japanese positions south of Huggins’ Roadblock. Its three tanks are knocked out by a hidden gun and the attack is repulsed. Vasey concludes that attacking such pillboxes with infantry repeats the costly mistakes of 1915–17. Over the next two nights, though, the Japanese pull out of these forward positions.'),
    ev('1943-01-18', 'Sanananda village falls', 'attack', P.sanananda, 12,
      'Approaching through swamp from the southwest, the 2/9th Battalion takes Sanananda village by 13:00 and clears east to the Giruwa River by nightfall. About 1,200 Japanese sick and wounded are evacuated by sea between 13 and 20 January.',
      at('13:00')),
    ev('1943-01-22', 'The Papuan campaign ends', 'attack', P.beachheads, 10,
      'At 13:15 the last organised resistance west of Sanananda ends as the 2/9th and 2/10th Battalions meet. Between 1,000 and 1,900 Japanese have escaped overland to the west. The battle has cost the Allies more dead in proportion to the troops engaged than Guadalcanal. Japanese sources put their losses at about 8,000.',
      at('13:15', { facts: [['Australian battle casualties', '3,471 (1,204 killed or died of wounds)'], ['US ground casualties', '671 killed in action, 2,172 wounded, 7,920 sick'], ['Japanese losses', 'About 8,000 (Japanese sources)']],
        link: { timeline: 'pearl-harbor-to-guadalcanal', event: '1943-01-22-the-papuan-beachheads-fall', label: 'See this in Pearl Harbor to Guadalcanal' } })),
  ];

  // ---------- Shot list ----------
  // Camera direction (see "Shots" in app.js). Events not listed use the automatic framing.
  const pt = (place) => [place.lat, place.lng];
  const SHOTS = {
    // Open on the whole stage: the landing beaches and Port Moresby beyond the mountains.
    'Japanese troops land near Gona': { shot: 'wide', transition: 'pull-back', frame: [pt(P.gona), pt(P.moresby)] },
    // Kokoda: down onto the plateau for the two fights there.
    'Owen reoccupies Kokoda': { scene: 'kokoda', shot: 'tight' },
    'Kokoda falls; Owen is killed': { scene: 'kokoda', shot: 'tight' },
    // Two fronts at once: pull back to show Milne Bay and Isurava in one frame.
    'Japanese land at Milne Bay': { shot: 'wide', transition: 'pull-back', frame: [pt(P.isurava), pt(P.milneBay)] },
    'The Battle of Isurava begins': { transition: 'fly' },
    // Milne Bay: the fight along the north shore.
    'Air attacks wreck the Japanese landing base': { scene: 'milne-bay', frame: [pt(P.gili), pt(P.wagaWaga)] },
    'Tanks at night at KB Mission': { scene: 'milne-bay' },
    'The airstrip holds': { scene: 'milne-bay' },
    'Banzai charges at No. 3 Airstrip': { scene: 'milne-bay-2', frame: [pt(P.gili), pt(P.kbMission)] },
    // The high-water mark: Ioribaiwa with Port Moresby in view.
    'The lights of Port Moresby': { shot: 'wide', frame: [pt(P.moresby)] },
    // The beachheads, Gona to Buna.
    'The first attacks on Buna and Gona': { shot: 'wide', frame: [pt(P.gona), pt(P.duropa)] },
    'The Papuan campaign ends': { shot: 'wide', transition: 'pull-back', frame: [pt(P.gona), pt(P.duropa), pt(P.kokoda)] },
  };
  const events = WW2.events['kokoda-track'];
  for (const [title, shot] of Object.entries(SHOTS)) {
    const e = events.find((x) => x.title === title);
    if (!e) throw new Error(`kokoda-track shot list: no event titled "${title}"`);
    Object.assign(e, shot);
  }
})();
