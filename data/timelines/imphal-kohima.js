// Timeline: Imphal and Kohima (War in the Pacific / Burma).
// Operation U-Go, Japan's 1944 offensive into India: Mutaguchi's plan, the crossings of the
// Chindwin, Sangshak, the siege of Kohima and the fight for the tennis court, the relief and
// counter-attacks, the battles around Imphal (the Silchar track, the Shenam Saddle, Nungshigum),
// air supply, the reopening of the Kohima–Imphal road on 22 June 1944 and the Japanese retreat.
// Checked against the English Wikipedia articles "Battle of Imphal", "Battle of Kohima",
// "Operation U-Go", "Battle of Sangshak", "Renya Mutaguchi", "William Slim", "Kōtoku Satō",
// "Kohima War Cemetery", "John Harman (British Army soldier)", "John Niel Randle" and
// "Abdul Hafiz (VC)" (October 2026).
//
// The sources give few clock times and do not say which time zone they use, so events are
// date-only; `sortTime` (India time) only orders events within a day. Several places (the
// Shenam Saddle, Nungshigum, Milestone 109) are approximate positions. Event schema: see
// data/timelines/attack-on-hawaii.js.

(function () {
  const P = {
    maymyo: { name: 'Maymyo, Burma (Fifteenth Army headquarters)', lat: 22.03, lng: 96.47 },
    rangoon: { name: 'Rangoon, Burma', lat: 16.8, lng: 96.16 },
    singapore: { name: 'Singapore', lat: 1.29, lng: 103.85 },
    tokyo: { name: 'Tokyo', lat: 35.68, lng: 139.76 },
    adminBox: { name: 'The “Admin Box”, Arakan (approx.)', lat: 20.95, lng: 92.45 },
    broadway: { name: 'Chindit landing grounds, northern Burma (approx.)', lat: 24.5, lng: 96.6 },
    chindwinSouth: { name: 'Chindwin River crossings, south of Tamu (approx.)', lat: 23.6, lng: 94.4 },
    homalin: { name: 'Homalin, on the Chindwin', lat: 24.87, lng: 94.91 },
    imphal: { name: 'Imphal, Manipur', lat: 24.81, lng: 93.94 },
    imphalAir: { name: 'Imphal airfield', lat: 24.76, lng: 93.9 },
    tiddim: { name: 'Tiddim, Chin Hills', lat: 23.37, lng: 93.66 },
    tuitum: { name: 'Tongzang and the Tuitum Saddle (approx.)', lat: 23.65, lng: 93.65 },
    manipurBridge: { name: 'Manipur River bridge, Tiddim road (approx.)', lat: 23.8, lng: 93.68 },
    tamu: { name: 'Tamu', lat: 24.22, lng: 94.31 },
    moreh: { name: 'Moreh', lat: 24.24, lng: 94.3 },
    shenam: { name: 'Shenam Saddle, Imphal–Tamu road (approx.)', lat: 24.4, lng: 94.12 },
    palel: { name: 'Palel airfield', lat: 24.45, lng: 94.03 },
    bishenpur: { name: 'Bishenpur', lat: 24.63, lng: 93.77 },
    potsangbam: { name: 'Potsangbam, south of Bishenpur (approx.)', lat: 24.6, lng: 93.78 },
    nungshigum: { name: 'Nungshigum Ridge, northeast of Imphal (approx.)', lat: 24.89, lng: 94.0 },
    kanglatongbi: { name: 'Kanglatongbi, north of Imphal', lat: 24.95, lng: 93.92 },
    northImphal: { name: 'Hills north of Imphal (approx.)', lat: 24.95, lng: 93.95 },
    ukhrul: { name: 'Ukhrul', lat: 25.1, lng: 94.36 },
    sangshak: { name: 'Sangshak (approx.)', lat: 24.98, lng: 94.37 },
    jessami: { name: 'Jessami (approx.)', lat: 25.62, lng: 94.53 },
    kohima: { name: 'Kohima', lat: 25.666, lng: 94.1 },
    garrisonHill: { name: 'Garrison Hill and the tennis court, Kohima Ridge', lat: 25.6676, lng: 94.1029 },
    gptRidge: { name: 'GPT Ridge and Jail Hill, Kohima (approx.)', lat: 25.66, lng: 94.1 },
    nagaVillage: { name: 'Naga Village, Kohima (approx.)', lat: 25.675, lng: 94.11 },
    jotsoma: { name: 'Jotsoma, west of Kohima (approx.)', lat: 25.665, lng: 94.065 },
    dimapur: { name: 'Dimapur railhead', lat: 25.91, lng: 93.73 },
    ms109: { name: 'Milestone 109, Kohima–Imphal road (approx.)', lat: 25.15, lng: 93.97 },
  };

  const ev = (date, title, type, location, zoom, summary, extra = {}) => ({
    id: extra.id || `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}`,
    date, title, type, location, zoom, summary,
    theater: extra.theater || 'Asia',
    ...extra,
  });
  const ord = (sortTime, extra = {}) => ({ sortTime, tz: 'IND', ...extra }); // order within the day only

  WW2.events['imphal-kohima'] = [
    // ---------- The plan ----------
    ev('1943-03-01', 'Mutaguchi takes over the Fifteenth Army', 'political', P.maymyo, 7,
      'Lieutenant General Renya Mutaguchi, a veteran of the Marco Polo Bridge incident and the conquest of Malaya, takes command of the Fifteenth Army facing Imphal and Assam. He presses at once for an invasion of India, convinced it is his destiny to win the war’s decisive battle. The well-publicised first Chindit raid under Orde Wingate has crossed country he once called impassable, and spurs him on.',
      { approx: true, facts: [['Superior', 'Lt. Gen. Masakazu Kawabe, Burma Area Army'], ['Plan', 'U-Go (Operation C)']] }),
    ev('1943-06-24', 'Staff officers pick holes in the plan', 'political', P.rangoon, 8,
      'At a four-day planning conference in Rangoon, Mutaguchi’s chief of staff presents the plan. Senior officers from Burma Area Army, Southern Army and Imperial General Headquarters all point out its tactical and supply weaknesses, but Kawabe does not forbid it. Mutaguchi’s previous chief of staff, who protested too loudly, has already been moved.',
      { approx: true }),
    ev('1943-12-23', 'Field Marshal Terauchi approves U-Go', 'political', P.singapore, 8,
      'After a final map exercise in Singapore, Field Marshal Hisaichi Terauchi, commanding Southern Expeditionary Army Group, approves the offensive and sends a staff officer to Tokyo for sanction.'),
    ev('1944-01-07', 'Tokyo gives its approval', 'political', P.tokyo, 7,
      'Imperial General Headquarters approves the invasion. Prime Minister Hideki Tōjō gives his consent after quizzing a staff officer about the plan from his bath. Three divisions will cut off and destroy IV Corps at Imphal and seize Kohima, with the Indian National Army of Subhas Chandra Bose attached. Mutaguchi’s divisional commanders all have doubts: the troops will carry about three weeks’ food and are expected to live off captured British dumps.',
      { facts: [['Japanese', '15th, 31st and 33rd Divisions; Yamamoto Force; INA brigades'], ['Defenders', 'IV Corps (Lt. Gen. Geoffry Scoones), part of Slim’s Fourteenth Army'], ['Food', 'About three weeks, plus cattle driven “on the hoof”']] }),
    ev('1944-02-05', 'Ha-Go: the diversion in Arakan fails', 'attack', P.adminBox, 8,
      'A diversionary attack in Arakan infiltrates XV Corps and surrounds the 7th Indian Division’s administrative area, the “Admin Box”. Supplied by parachute, the defenders hold, while the Japanese infiltrators run out of food and meet British tanks they cannot stop. The lesson, that air supply can beat Japanese encirclement, comes too late to change U-Go.'),
    ev('1944-03-05', 'The Chindits fly into Burma', 'movement', P.broadway, 7,
      'Operation Thursday, the airborne phase of the second Chindit expedition, lands British columns deep behind Japanese lines. The Japanese air commander urges Mutaguchi to divert troops to deal with them; Mutaguchi refuses, predicting he will soon hold the airfields that supply them.'),

    // ---------- The offensive opens ----------
    ev('1944-03-08', 'The Japanese begin crossing the Chindwin', 'invasion', P.chindwinSouth, 7,
      'The 33rd Division and Yamamoto Force start across the Chindwin and move against the 17th Indian Division at Tiddim and the 20th at Tamu. Slim and Scoones intend to pull their forward divisions back to the Imphal plain and fight at the end of the Japanese supply lines, but they have misjudged the date of the attack. (Accounts give dates between 6 and 12 March for the start of the offensive.)',
      { facts: [['Commander', 'Lt. Gen. Motoso Yanagida (33rd Division)'], ['Yamamoto Force', 'Maj. Gen. Tsunoru Yamamoto, with the 14th Tank Regiment']],
        paths: [{ label: '33rd Division toward Tiddim (approximate)', kind: 'route', coords: [[23.2, 94.2], [23.5, 93.9], [23.65, 93.65]] }] }),
    ev('1944-03-13', 'The 17th Indian Division is cut off at Tiddim', 'attack', P.tuitum, 9,
      'The Japanese 215th Regiment attacks the supply dump at Milestone 109 on the Tiddim road, twenty miles behind the division’s outposts, and the 214th Regiment seizes Tongzang and the Tuitum Saddle across the road behind it. Scoones orders his forward divisions back to Imphal only today.',
      ord('09:00')),
    ev('1944-03-15', 'Gurkhas clear the Tuitum Saddle', 'attack', P.tuitum, 10,
      'The 17th Indian Division has begun to withdraw. The 48th Indian Brigade attacks the 214th Regiment before it can dig in on the Tuitum Saddle and forces it off the road with heavy losses.'),
    ev('1944-03-15', 'The 31st Division crosses at Homalin', 'invasion', P.homalin, 8,
      'Lieutenant General Kōtoku Satō’s 31st Division crosses the Chindwin near Homalin and heads northwest for Kohima on a front almost 60 miles wide. Half its mountain guns are left behind for lack of transport. Satō, who distrusts Mutaguchi, has warned his staff they may all starve.',
      { facts: [['Regiments', '58th, 124th, 138th Infantry; 31st Mountain Artillery'], ['Supplies', 'About three weeks']],
        paths: [{ label: '31st Division toward Kohima (approximate)', kind: 'route', coords: [[24.87, 94.91], [25.1, 94.6], [25.62, 94.53], [25.666, 94.1]] }] }),
    ev('1944-03-15', 'Mountbatten takes aircraft off the Hump', 'service', P.imphalAir, 8,
      'At the crisis of the battle, Admiral Louis Mountbatten, commander-in-chief of South East Asia Command, diverts transport aircraft from the airlift over the Hump to China without the authority to do so, backed by American officers. With them Slim flies the veteran 5th Indian Division, artillery, jeeps and mules included, from Arakan to the central front in eleven days. One brigade goes to Dimapur and the rest to Imphal.',
      { approx: true, facts: [['Aircraft gained', '20 C-46 Commandos (equal to about 30 C-47s)']] }),
    ev('1944-03-20', 'Lee tanks smash a Japanese tank column near Tamu', 'attack', P.tamu, 10,
      'Six M3 Lee medium tanks of the 3rd Carabiniers meet six light Type 95 tanks leading Yamamoto Force and destroy them.'),
    ev('1944-03-20', 'Miyazaki runs into the paratroops at Sangshak', 'attack', P.sangshak, 10,
      'The leading column of the 31st Division under Major General Shigesaburō Miyazaki, ahead of its neighbour the 15th Division, clashes with the 50th Indian Parachute Brigade covering the northern approaches to Imphal. Sangshak is not his objective, but he decides to clear it from his path. A company of 152 Parachute Battalion has already been cut down to 20 men on Point 7378.'),
    ev('1944-03-22', 'Night attack on Sangshak, and a captured map case', 'attack', P.sangshak, 11,
      'The brigade has pulled back into a cramped position on a hill by the village church, with no water and rock too close below for proper trenches. A Japanese battalion attacks without waiting for its guns and is cut up by mountain artillery and mortars. A dead Japanese officer is found carrying the 31st Division’s plans; Brigadier Hope-Thomson sends copies out through the Japanese lines to Imphal, and they reveal that a whole division is heading for Kohima.'),
    ev('1944-03-23', 'Air drops fall to the besiegers', 'loss', P.sangshak, 11,
      'Transport aircraft try to supply Sangshak, but the perimeter is so small that many loads land among the Japanese. A counter-attack to recover them is beaten back. Japanese guns, brought up by elephant, begin shelling the position.'),
    ev('1944-03-25', '20th Indian Division falls back to the Shenam Saddle', 'movement', P.moreh, 10,
      'Ordered to give up part of his division as a reserve for IV Corps, Major General Douglas Gracey can no longer hold Tamu and Moreh. The division withdraws to the Shenam Saddle, burning the big supply dump at Moreh. Two of Yamamoto Force’s battalions are held up by the Chindits and cannot interfere.'),
    ev('1944-03-26', 'Sangshak is abandoned', 'movement', P.sangshak, 11,
      'With 300 wounded in the position and his men exhausted and parched, Hope-Thomson is ordered in the early evening to withdraw. The brigade slips out after dark with the 4th/5th Mahrattas as rearguard; about 100 wounded have to be left behind. The battle costs the brigade some 650 casualties and the Japanese II/58th Regiment more than 400, and it delays Miyazaki’s advance on Kohima by a week.',
      ord('18:00', { facts: [['50th Parachute Brigade', 'About 650 casualties'], ['Japanese', 'More than 400 casualties in II/58th Regiment alone'], ['Delay imposed', 'About a week']] })),
    ev('1944-03-26', 'The 17th Division gets across the Manipur River', 'movement', P.manipurBridge, 10,
      'Major General “Punch” Cowan’s rearguard crosses the Manipur River and blows the bridge. The division has saved most of the vehicles, food and ammunition from the depot at Milestone 109. Its Japanese pursuers, under the pessimistic Yanagida, follow cautiously despite rebukes from Mutaguchi.'),
    ev('1944-03-28', 'The Imphal–Kohima road is cut', 'attack', P.kanglatongbi, 9,
      'The 60th Regiment of the Japanese 15th Division cuts the main road a few miles north of Imphal, while the 51st Regiment advances on the plain from the northeast. IV Corps at Imphal is now cut off by land and will be supplied by air.'),

    // ---------- Kohima besieged ----------
    ev('1944-04-01', 'The Assam Regiment fights at Jessami', 'attack', P.jessami, 10,
      'The newly raised 1st Battalion, the Assam Regiment, fights delaying actions against the 31st Division’s right wing and centre about 80 road miles east of Kohima. Its forward posts are soon overrun and it is ordered back.'),
    ev('1944-04-03', 'The Japanese reach Kohima', 'invasion', P.kohima, 10,
      'Miyazaki’s troops reach the outskirts of Naga Village during the night and begin probing Kohima from the south. Lieutenant General Montagu Stopford’s XXXIII Corps headquarters takes over the front. At Imphal, the first troops of the airlifted 5th Indian Division go into action north and east of the town.',
      { facts: [['Kohima Ridge', 'Dominates the only road from Dimapur to Imphal'], ['Dimapur', 'Railhead and supply base, about 30 miles north']] }),
    ev('1944-04-04', 'Tanks caught on the road below the Shenam Saddle', 'attack', P.shenam, 10,
      'Yamamoto Force attacks up the metalled road from Tamu, the only one its tanks and heavy guns can use. The attack is disjointed: the infantry are not ready, and twelve Japanese tanks are caught in the open by British anti-tank guns.'),
    ev('1944-04-04', '17th and 23rd Divisions reach the Imphal plain', 'movement', P.imphal, 9,
      'Supplied by parachute along the way, the 17th Indian Division and the 23rd Indian Division sent to help it reach the Imphal plain. IV Corps is concentrated, and the Japanese now close in from the south, east and north.'),
    ev('1944-04-05', 'The Royal West Kents get into Kohima', 'movement', P.garrisonHill, 11,
      'Ordered forward from Dimapur, the 161st Indian Brigade gets only one battalion, the 4th Royal West Kents under Lieutenant Colonel John Laverty, and a Rajput company into Kohima before the Japanese cut the road behind them. With Assam Regiment men, a raw Nepalese battalion and convalescents and supply troops, Colonel Hugh Richards has about 2,500 men, a thousand of them non-combatants. The rest of the brigade is cut off two miles away at Jotsoma, from where its guns support the garrison.',
      { approx: true, facts: [['Garrison', 'About 2,500, of whom about 1,000 non-combatants'], ['Commander', 'Col. Hugh Richards']],
        link: { timeline: 'road-to-tokyo-bay', event: '1944-04-04-kohima-besieged', label: 'See this in The Road to Tokyo Bay' } }),
    ev('1944-04-06', 'The siege of Kohima begins', 'attack', P.gptRidge, 12,
      'The Japanese take GPT Ridge, with the garrison’s water point, on the first day. From now on the defenders are shelled and mortared constantly, often with weapons and ammunition captured at Sangshak, and pushed back step by step towards Garrison Hill. A small spring on the hill can be reached only at night; wounded men waiting at the exposed dressing stations are often hit again.'),
    ev('1944-04-06', 'Abdul Hafiz wins the Victoria Cross north of Imphal', 'service', P.northImphal, 11,
      'In the hills north of Imphal, 18-year-old Naib Subedar Abdul Hafiz of the 9th Jat Regiment leads two sections up a bare, steep slope against a Japanese-held feature overlooking his company. Twice wounded, he dies after routing the enemy and is awarded a posthumous Victoria Cross, the youngest Indian recipient.',
      ord('09:30')),
    ev('1944-04-08', 'Kawabe stops a thrust at Dimapur', 'political', P.kohima, 8,
      'Mutaguchi orders Satō directly to send a detachment on to Dimapur, where the railhead and huge supply dumps are almost undefended. Satō reluctantly sends a battalion, but within hours Kawabe at Burma Area Army cancels the move. Satō stays fixed on Kohima, to Slim’s relief.'),
    ev('1944-04-08', 'Battle for the peaks east of the Shenam Saddle', 'attack', P.shenam, 11,
      'From 8 to 22 April the 20th Indian Division and Yamamoto Force fight over five peaks commanding the road east of the saddle. The Japanese take several; Indian and British counter-attacks win some back. Losses are heavy on both sides, but the Japanese cannot break through towards Palel.'),
    ev('1944-04-09', 'Lance Corporal Harman’s two charges', 'service', P.garrisonHill, 12,
      'A Japanese machine-gun post has been set up within 50 yards of his company. John Harman of the Royal West Kents destroys it alone with a grenade and brings back the gun. Next morning he charges a party of Japanese digging in, killing five, and is mortally wounded by machine-gun fire on his way back. He is awarded a posthumous Victoria Cross.'),
    ev('1944-04-13', 'Lee tanks climb Nungshigum', 'attack', P.nungshigum, 11,
      'A battalion of the Japanese 51st Regiment has seized Nungshigum Ridge, overlooking Imphal’s main airstrip. The 5th Indian Division counter-attacks with air strikes, massed artillery and Lee tanks of the 3rd Carabiniers on slopes the Japanese thought too steep for armour. With almost no anti-tank weapons, the Japanese are driven off with heavy losses. Every officer of the Carabiniers squadron and of the attacking 1st/17th Dogras is killed or wounded.'),
    ev('1944-04-15', 'The 2nd Division breaks through to Jotsoma', 'movement', P.jotsoma, 11,
      'The British 2nd Division under Major General John Grover has been arriving at Dimapur. Its 5th Brigade fights through Japanese roadblocks to relieve the cut-off 161st Brigade in the “Jotsoma Box”.'),
    ev('1944-04-17', 'The bungalow falls and the garrison is split', 'attack', P.garrisonHill, 12,
      'The heaviest fighting has been around the Deputy Commissioner’s bungalow and its tennis court, where the two sides are dug in so close across the court that grenades are thrown between the trenches. During the night the Japanese take the bungalow area and Kuki Picquet, cutting the garrison in two. But they are too hungry and spent to press on against Garrison Hill.',
      ord('22:00')),
    ev('1944-04-18', 'Kohima is relieved', 'movement', P.garrisonHill, 12,
      'With air, artillery and tank support, the 161st Indian Brigade attacks from Jotsoma. After a day’s heavy fighting the 1st/1st Punjabis and tanks of 149 Regiment RAC break through to the garrison. About 300 wounded are brought out under fire that night. The ridge looks like a First World War battlefield of shattered trees and craters.'),
    ev('1944-04-20', 'The original garrison is relieved', 'movement', P.garrisonHill, 12,
      'Overnight the British 6th Brigade takes over Garrison Hill, and early in the morning Colonel Richards hands over command. The relieving troops are shocked by the state of the defenders, who look to one officer like bloodstained scarecrows.',
      ord('06:00')),
    ev('1944-04-27', 'The clubhouse above the bungalow is retaken', 'attack', P.garrisonHill, 12,
      'Miyazaki keeps attacking Garrison Hill for several nights, often hand to hand from Kuki Picquet only 50 yards away. On the night of 26/27 April a British attack recaptures the clubhouse above the bungalow, overlooking most of the Japanese centre.'),
    ev('1944-04-28', 'The INA attacks Palel airfield', 'attack', P.palel, 11,
      'Unable to break through on the road, Yamamoto sends troops across the hills north of the Shenam Saddle to raid Palel, one of the plain’s two all-weather airfields. The Indian National Army’s Gandhi Brigade joins in and tries to persuade Indian defenders to give up, but after brief hesitation they rally. Carrying only a day’s rations, the brigade loses some 250 men to shellfire as it pulls back.'),
    ev('1944-04-30', 'Yanagida is sacked; the Silchar track is cut', 'political', P.bishenpur, 10,
      'South of Imphal the 33rd Division has cut the Silchar track at Bishenpur, where a commando raid has also destroyed a suspension bridge. Its leading troops get within about 10 miles of Imphal before British artillery and lack of supplies stop them, and the advance up the Tiddim road is halted at Potsangbam. Mutaguchi, infuriated by Yanagida’s caution, relieves him at the end of the month. In Tokyo the Vice-Chief of the General Staff has reported gloomily on the offensive, but Tōjō brushes his doubts aside.',
      { approx: true }),

    // ---------- Counter-attacks ----------
    ev('1944-05-01', 'The Japanese offensive is halted', 'intelligence', P.imphal, 8,
      'By the start of May every Japanese attack on the Imphal plain has stopped. Slim and Scoones turn on the weakest enemy formation, the 15th Division north of Imphal. The monsoon has broken, artillery ammunition must be rationed, and the attackers find the Japanese reverse-slope positions on ridges such as the Mapao Spur almost impossible to take.',
      { facts: [['Air supply (whole battle)', '19,000 tons and 12,000 men flown in; 13,000 casualties and 43,000 non-combatants flown out'], ['RAF Third Tactical Air Force', '24,000 sorties in the four worst monsoon months']] }),
    ev('1944-05-04', 'Attacks on GPT Ridge and Naga Village', 'attack', P.gptRidge, 12,
      'The 2nd Division tries to outflank the Japanese at both ends of Kohima Ridge. The 5th Brigade wins a foothold in Naga Village but loses it to a counter-attack. After a long march around Mount Pulebadze, the 4th Brigade takes part of GPT Ridge by surprise in driving rain but cannot clear it; two of its commanders are killed in the close fighting that follows. Supporting the attacks are some 88 guns against the Japanese division’s 17 light mountain guns.',
      { facts: [['British guns', '38 mountain howitzers, 48 25-pounders, 2 5.5-inch'], ['Japanese guns', '17 light mountain guns, short of ammunition']] }),
    ev('1944-05-06', 'Captain Randle silences a bunker', 'service', P.gptRidge, 12,
      'At dawn Captain John Randle, already wounded leading a Royal Norfolk company onto GPT Ridge two days before, attacks again. When a reverse-slope bunker pins down one of his platoons, he charges it alone and, mortally wounded, throws a grenade inside and blocks the slit with his body. He is awarded a posthumous Victoria Cross.',
      ord('05:00')),
    ev('1944-05-11', 'Jail Hill falls', 'attack', P.gptRidge, 12,
      'For a week flanking fire from the reverse slope of GPT Ridge has broken every attack on Jail Hill. Behind a screen of smoke shells that blinds the Japanese machine-gunners, British and Indian troops finally take Jail Hill, Kuki Picquet, FSD and DIS and dig in.'),
    ev('1944-05-13', 'A tank on the tennis court', 'attack', P.garrisonHill, 13,
      'The last Japanese positions on the ridge are the tennis court and terraces above the bungalow. After failed attempts to storm or outflank them, engineers bulldoze a track up which a Lee tank is hauled; it crashes down onto the court and destroys the Japanese trenches and bunkers. The 2nd Dorsets clear the bungalow site, and Kohima Ridge is in British hands. The Kohima War Cemetery now lies on these slopes, with the court marked out in white; the 2nd Division memorial there begins “When you go home, tell them of us and say”.',
      { facts: [['Kohima War Cemetery', '1,420 Commonwealth burials; memorial to 917 cremated Hindu and Sikh soldiers']] }),
    ev('1944-05-16', 'Naga Village and the Aradura Spur hold out', 'attack', P.nagaVillage, 11,
      'With the 7th Indian Division arriving from Arakan, the Allies attack again, but the Japanese cling to Naga Village and the Aradura Spur. Night attacks on 24/25 and 28/29 May are thrown back, and exhaustion and the weather begin to wear down the 2nd Division.'),
    ev('1944-05-18', 'A Gurkha left hook south of Bishenpur', 'attack', P.potsangbam, 10,
      'Cowan sends the 48th Indian Brigade round into the Japanese rear while the 63rd attacks from the front. The Gurkhas cut the road, but the frontal attack fails and they must fight their way back with heavy losses. At the same moment the Japanese infiltrate the 17th Division’s position and seize hills near its headquarters on 20 May, but over the next week the isolated parties are wiped out.'),
    ev('1944-05-22', 'Nobuo Tanaka takes over the 33rd Division', 'political', P.bishenpur, 9,
      'Lieutenant General Nobuo Tanaka, a forceful new commander, takes over Yanagida’s division and orders attack after attack until many battalions are reduced to handfuls of men. A fresh regiment sent in June is shattered by shellfire.'),
    ev('1944-05-25', 'Satō threatens to withdraw', 'political', P.nagaVillage, 10,
      'Satō’s men are starving: the three weeks’ food is long gone, a captured rice store was bombed, Chindits of the 23rd Brigade cut his supply routes, and the few convoys from the Chindwin bring ammunition, not food. He tells Fifteenth Army he will withdraw on 1 June unless supplies arrive. The same day Kawabe sets out from Rangoon to see the front, where officers hide the true state of their units.'),
    ev('1944-05-31', 'Satō retreats without orders', 'movement', P.nagaVillage, 10,
      'Defying Mutaguchi’s orders to hold, Satō abandons Naga Village and his positions north of the road, something unheard of for a Japanese divisional commander. XXXIII Corps can now outflank the Aradura Spur and push south, while Miyazaki fights rearguards and blows bridges along the road to Imphal.',
      { paths: [{ label: '31st Division retreat (approximate)', kind: 'route', coords: [[25.666, 94.1], [25.4, 94.2], [25.1, 94.36]] }] }),
    ev('1944-06-06', 'Mutaguchi and Kawabe leave the truth unspoken', 'political', P.maymyo, 7,
      'Meeting Kawabe, Mutaguchi conveys by haragei, the unspoken language of gesture and tone, that the offensive cannot succeed. Kawabe understands, but neither man will take responsibility for ordering a retreat, and the attacks go on.'),

    // ---------- The road reopened and the retreat ----------
    ev('1944-06-22', 'The Kohima–Imphal road is reopened', 'movement', P.ms109, 10,
      'Advancing south from Kohima, the leading troops of the British 2nd Division meet the 5th Indian Division coming north from Imphal at Milestone 109. The siege of Imphal is over, and truck convoys roll south with heavy supplies. The Battle of Kohima alone has cost the British and Indian forces 4,064 casualties and the Japanese at least 5,764.',
      { facts: [['Met at', 'Milestone 109 (the articles disagree on its distance from Imphal and Kohima)'], ['Kohima casualties', 'Allied 4,064; Japanese at least 5,764 in battle']],
        link: { timeline: 'road-to-tokyo-bay', event: '1944-06-22-the-japanese-retreat-from-kohima-and-imp', label: 'See this in The Road to Tokyo Bay' } }),
    ev('1944-07-01', 'Last raids on Palel', 'attack', P.palel, 11,
      'Before pulling back, the battered Yamamoto Force launches two small raids on Palel airfield in the first week of July and destroys several parked aircraft.',
      { approx: true }),
    ev('1944-07-03', 'Mutaguchi calls off U-Go', 'political', P.maymyo, 7,
      'Mutaguchi has ordered the 31st and 15th Divisions into a fresh attack on Imphal from the north, but neither is in any state to obey. Realising none of his formations will attack, he finally breaks off the offensive. Much of his army retreats to the Chindwin as a starving rabble, abandoning its guns, transport and men too sick or badly wounded to walk.'),
    ev('1944-07-05', 'Grover is removed from the 2nd Division', 'political', P.kohima, 9,
      'Major General John Grover is dismissed for the slow pace of his division’s advance and complaints about his handling of attached Indian brigades. He accepts it quietly; a memorial to him is unveiled at Jotsoma seventy years later.'),
    ev('1944-07-07', 'Satō is relieved of command', 'political', P.ukhrul, 9,
      'After weeks of ignoring orders, Satō is removed. His exhausted men have dragged themselves south to Ukhrul, near the Sangshak battlefield, and to Humine, where there are hospitals without food or medicine. Satō refuses an invitation to commit seppuku and demands a court martial; at Kawabe’s prompting he is later declared to have had a breakdown and unfit for trial.'),
    ev('1944-07-31', 'Tamu retaken: the road of the dead', 'loss', P.tamu, 10,
      'The Allies recover Tamu at the end of July and find 550 unburied Japanese bodies, with more than a hundred badly wounded soldiers dying among them. The Japanese have lost about 55,000 men at Imphal and Kohima, 13,376 of them dead, most from starvation, disease and exhaustion, along with nearly all their pack animals and cattle. It is the largest defeat the Japanese army has suffered.',
      { approx: true, facts: [['Japanese losses', '54,879 casualties, including 13,376 dead (Battle of Imphal article)'], ['Allied losses', '12,603 casualties (Imphal article; the U-Go article gives about 17,000)'], ['Animals lost', 'Almost all 12,000 horses and mules and 30,000 cattle']] }),
    ev('1944-08-30', 'Mutaguchi is relieved', 'political', P.tokyo, 6,
      'Mutaguchi, who sacked all three of his divisional commanders during the battle, is himself relieved and recalled to Tokyo; he is forced into retirement in December. Kawabe, his health broken, is also dismissed, and many staff officers of both headquarters are posted away.'),
    ev('1944-12-15', 'Slim and his corps commanders knighted at Imphal', 'service', P.imphal, 9,
      'In December, at a ceremony at Imphal before Scottish, Gurkha and Punjabi troops, the Viceroy, Lord Wavell, knights Slim and his corps commanders Scoones, Stopford and Christison. The broken Japanese army will be unable to hold Burma against the Fourteenth Army’s offensive in the new year.',
      { approx: true, link: { timeline: 'road-to-tokyo-bay', event: '1945-03-20-mandalay-recaptured', label: 'On to Mandalay in The Road to Tokyo Bay' } }),
  ];

  // ---------- Shot list ----------
  // Camera direction (see "Shots" in app.js). Events not listed use the automatic framing.
  const pt = (place) => [place.lat, place.lng];
  const SHOTS = {
    // The opening: the whole front from the Chindwin to Dimapur.
    'The Japanese begin crossing the Chindwin': { shot: 'wide', transition: 'pull-back', frame: [pt(P.dimapur), pt(P.tiddim), pt(P.homalin)] },
    'The 31st Division crosses at Homalin': { shot: 'wide', frame: [pt(P.kohima), pt(P.imphal)] },
    'Mountbatten takes aircraft off the Hump': { shot: 'wide', frame: [pt(P.dimapur), pt(P.imphal)] },
    // Sangshak, close in.
    'Miyazaki runs into the paratroops at Sangshak': { scene: 'sangshak', frame: [pt(P.ukhrul)] },
    'Night attack on Sangshak, and a captured map case': { scene: 'sangshak' },
    'Air drops fall to the besiegers': { scene: 'sangshak' },
    'Sangshak is abandoned': { scene: 'sangshak' },
    // Kohima: Jotsoma and the ridge in one frame for the siege and relief.
    'The Royal West Kents get into Kohima': { scene: 'kohima-siege', frame: [pt(P.jotsoma)], transition: 'fly' },
    'The siege of Kohima begins': { scene: 'kohima-siege' },
    'Lance Corporal Harman’s two charges': { shot: 'tight' },
    'The 2nd Division breaks through to Jotsoma': { scene: 'kohima-relief', frame: [pt(P.garrisonHill)] },
    'The bungalow falls and the garrison is split': { scene: 'kohima-relief' },
    'Kohima is relieved': { scene: 'kohima-relief' },
    'The original garrison is relieved': { scene: 'kohima-relief' },
    'A tank on the tennis court': { shot: 'tight', transition: 'fly' },
    // The link-up: both ends of the road.
    'The Kohima–Imphal road is reopened': { shot: 'wide', transition: 'pull-back', frame: [pt(P.kohima), pt(P.imphal)] },
    'Mutaguchi calls off U-Go': { shot: 'wide', frame: [pt(P.imphal), pt(P.homalin)] },
  };
  const events = WW2.events['imphal-kohima'];
  for (const [title, shot] of Object.entries(SHOTS)) {
    const e = events.find((x) => x.title === title);
    if (!e) throw new Error(`imphal-kohima shot list: no event titled "${title}"`);
    Object.assign(e, shot);
  }
})();
