// Timeline: The Firebombing of Japan (War in the Pacific).
// The American strategic bombing of Japan, June 1944 – August 1945, with the emphasis on the
// incendiary campaign: the B-29 bases in India and China and then the Marianas, the failure of
// high-altitude precision bombing, LeMay's switch to low-level night fire raids, the Tokyo raid of
// 9–10 March 1945 hour by hour, the March, May and June raids on the big cities, the campaign
// against smaller cities and its leaflet warnings, Iwo Jima as an emergency field, and the last
// raids of 14–15 August 1945. The atomic bombs appear only in passing.
// Checked against the English Wikipedia articles "Air raids on Japan", "Bombing of Tokyo
// (10 March 1945)", "Bombing of Tokyo", "Curtis LeMay", "Boeing B-29 Superfortress",
// "XXI Bomber Command", "XX Bomber Command", "Twentieth Air Force", "Operation Matterhorn",
// "Haywood S. Hansell", "Bombing of Osaka", "Bombing of Kobe in World War II", "Bombing of
// Nagoya in World War II", "Battle of Iwo Jima" and "Strategic bombing during World War II"
// (October 2026).
//
// Times are local: Japan time (JST) over Japan, Marianas time (ChST) for take-offs and landings
// in the Marianas. Night raids are dated by the night they were flown where the sources agree,
// otherwise marked approximate; the sources differ by a day on several raids (noted in the
// text). Casualty figures are those the articles give and are often disputed.
// Event schema: see data/timelines/attack-on-hawaii.js.

(function () {
  const P = {
    guanghan: { name: 'Guanghan airfield, near Chengdu, China', lat: 30.98, lng: 104.28 },
    chengdu: { name: 'B-29 airfields around Chengdu, China', lat: 30.66, lng: 104.06 },
    kharagpur: { name: 'XX Bomber Command headquarters, Kharagpur, India', lat: 22.33, lng: 87.32 },
    bangkok: { name: 'Bangkok, Thailand', lat: 13.75, lng: 100.50 },
    yawata: { name: 'Imperial Iron and Steel Works, Yawata, Kyushu', lat: 33.87, lng: 130.80 },
    omura: { name: 'Ōmura, Kyushu', lat: 32.90, lng: 129.96 },
    saipan: { name: 'Isley Field, Saipan', lat: 15.12, lng: 145.73 },
    guam: { name: 'XXI Bomber Command headquarters, Guam', lat: 13.52, lng: 144.82 },
    tinian: { name: 'North Field, Tinian', lat: 15.07, lng: 145.63 },
    tokyo: { name: 'Tokyo', lat: 35.68, lng: 139.76 },
    musashino: { name: 'Nakajima aircraft plant, Musashino, western Tokyo', lat: 35.71, lng: 139.57 },
    shitamachi: { name: 'Zone I: Asakusa, Honjo and Fukagawa, eastern Tokyo', lat: 35.70, lng: 139.80 },
    sensoji: { name: 'Sensō-ji temple, Asakusa', lat: 35.7148, lng: 139.7967 },
    kototoi: { name: 'Kototoi Bridge, Sumida River', lat: 35.7125, lng: 139.8025 },
    katsuura: { name: 'Off Katsuura, Bōsō Peninsula', lat: 35.15, lng: 140.32 },
    palace: { name: 'Tokyo Imperial Palace', lat: 35.685, lng: 139.753 },
    yokoamicho: { name: 'Yokoamichō Park, Sumida', lat: 35.699, lng: 139.796 },
    nagoya: { name: 'Nagoya', lat: 35.18, lng: 136.91 },
    nagoyaCastle: { name: 'Nagoya Castle', lat: 35.185, lng: 136.899 },
    osaka: { name: 'Osaka', lat: 34.69, lng: 135.50 },
    kyobashi: { name: 'Kyōbashi Station, Osaka', lat: 34.697, lng: 135.534 },
    kobe: { name: 'Kobe', lat: 34.69, lng: 135.19 },
    akashi: { name: 'Kawasaki aircraft factory, Akashi', lat: 34.65, lng: 134.99 },
    yokohama: { name: 'Yokohama', lat: 35.44, lng: 139.64 },
    kawasaki: { name: 'Kawasaki and southern Tokyo', lat: 35.53, lng: 139.70 },
    shimonoseki: { name: 'Shimonoseki Strait', lat: 33.96, lng: 130.94 },
    iwo: { name: 'South Field, Iwo Jima', lat: 24.76, lng: 141.29 },
    hamamatsu: { name: 'Hamamatsu', lat: 34.71, lng: 137.73 },
    yokkaichi: { name: 'Yokkaichi', lat: 34.97, lng: 136.62 },
    tsu: { name: 'Tsu, Mie Prefecture', lat: 34.72, lng: 136.51 },
    toyama: { name: 'Toyama', lat: 36.70, lng: 137.21 },
    hiroshima: { name: 'Hiroshima', lat: 34.39, lng: 132.45 },
    fukuyama: { name: 'Fukuyama', lat: 34.49, lng: 133.36 },
    kumagaya: { name: 'Kumagaya', lat: 36.15, lng: 139.39 },
    tokyoBay: { name: 'Tokyo Bay', lat: 35.35, lng: 139.75 },
  };

  const ev = (date, title, type, location, zoom, summary, extra = {}) => ({
    id: extra.id || `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}`,
    date, title, type, location, zoom, summary,
    theater: extra.theater || 'Asia',
    ...extra,
  });
  const at = (time, extra = {}) => ({ time, tz: 'JST', ...extra });
  const atM = (time, extra = {}) => ({ time, tz: 'ChST', ...extra }); // Marianas time
  const ord = (sortTime, tz = 'JST') => ({ sortTime, tz }); // order within the day only; no time shown

  const marianasToTokyo = [[15.12, 145.73], [20, 143.5], [24.78, 141.32], [30, 140.3], [35.70, 139.80]];

  WW2.events['firebombing-of-japan'] = [
    // ---------- From India and China ----------
    ev('1944-04-24', 'The first B-29 lands in China', 'movement', P.guanghan, 9,
      'Brigadier General LaVerne G. Saunders brings the first B-29 Superfortress over “the Hump” to Guanghan, one of four bomber fields near Chengdu built almost entirely by hand by Chinese labourers. Under Operation Matterhorn the bombers are based in Bengal and stage through Chengdu, from where only Kyushu, the southernmost home island, is within range. Every gallon of fuel has to be flown in over the Himalayas.',
      { ...ord('12:00', 'CHN'), facts: [['Command', 'XX Bomber Command (Brig. Gen. Kenneth Wolfe)'], ['Controlled by', 'Twentieth Air Force, run by Gen. Henry H. Arnold from Washington'], ['Main bases', 'Kharagpur and four other fields in Bengal']] }),
    ev('1944-06-05', 'The B-29’s first combat mission', 'attack', P.bangkok, 10,
      'Wolfe sends the B-29s from India against the railway workshops in Bangkok as a rehearsal for Japan. Of 98 launched, 77 bomb, most of them well wide of their targets, and five are lost, none to the enemy.',
      { ...ord('12:00', 'ICT') }),
    ev('1944-06-15', 'B-29s bomb Yawata', 'attack', P.yawata, 10,
      'On the night of 15–16 June B-29s staging through Chengdu attack the Imperial Iron and Steel Works at Yawata in northern Kyushu, the first bombs on the home islands since the Doolittle Raid of April 1942. Only one bomb hits the plant and seven bombers are lost, but the raid is celebrated in the American press and the fuel stocks at Chengdu are almost used up. Japan begins moving more fighters home. The same day, American troops land on Saipan, which will soon put Tokyo itself in range.',
      { ...ord('23:00'), facts: [['Dispatched', '68–75 B-29s (sources differ)'], ['Lost', '7']],
        paths: [{ label: 'Chengdu to Yawata (approximate)', kind: 'strike', coords: [[30.66, 104.06], [32, 118], [33.87, 130.80]] }] }),
    ev('1944-08-20', 'Fighters maul the second Yawata raid', 'loss', P.yawata, 10,
      'More than 100 Japanese fighters meet the bombers over Yawata. Twelve of the 61 B-29s that reach the target are shot down, one by a fighter that deliberately rams it. Japanese propaganda claims 100 bombers and puts a wrecked B-29 on display in Tokyo.'),
    ev('1944-08-29', 'LeMay takes over in India', 'political', P.kharagpur, 8,
      'Arnold relieves Wolfe, who cannot keep up the pressure on Japan from fuel-starved China, and sends Major General Curtis LeMay, a veteran bomber leader from England, to command XX Bomber Command. LeMay overhauls training and maintenance. Even so, nine raids on Japan from China will destroy only one target, the small aircraft factory at Ōmura, and the last of them is flown on 6 January 1945.',
      { approx: true, facts: [['Raids on Japan from China', '9 (June 1944 – January 1945)'], ['B-29s lost in India and China', '125, most in accidents']] }),

    // ---------- The Marianas ----------
    ev('1944-10-12', 'The first B-29 reaches Saipan', 'movement', P.saipan, 11,
      'Seabees have rebuilt the Japanese airstrip at Aslito as Isley Field while fighting on the island was still going on. The first B-29 of the 73rd Bombardment Wing lands there on 12 October; Brigadier General Haywood S. Hansell’s XXI Bomber Command is moving in. From the Marianas, about 1,500 miles from Tokyo and supplied by sea, the bombers can reach most of Japan and return without refuelling.',
      { ...ord('12:00', 'ChST'), facts: [['Fields built', 'Five large B-29 fields on Saipan, Tinian and Guam'], ['Commander', 'Brig. Gen. Haywood S. Hansell']] }),
    ev('1944-11-01', 'A camera plane over Tokyo', 'intelligence', P.tokyo, 8,
      'An F-13, the photo-reconnaissance version of the B-29, flies over Tokyo at 32,000 feet for 35 minutes, the first American aircraft over the city since the Doolittle Raid. Fighters climb after it but cannot attack. Its photographs, and those of later flights, will be used to plan the raids on Tokyo, including the fire raid of March.'),
    ev('1944-11-24', 'The first Marianas raid on Tokyo', 'attack', P.musashino, 11,
      'Operation San Antonio I: 111 B-29s of the 73rd Wing, led by Brigadier General Emmett O’Donnell Jr. in Dauntless Dotty, set out for the Nakajima aircraft engine plant at Musashino on Tokyo’s western edge. At bombing altitude they meet the jet stream, westerly winds of up to 200 mph that scatter formations and blow bombs off target. Only 24 aircraft bomb the plant; most hit the docks and city instead. About 125 Japanese fighters intercept and one B-29 is lost.',
      { facts: [['Dispatched', '111 B-29s'], ['Bombed the primary target', '24'], ['Lost', '1']] }),
    ev('1944-11-27', 'Japan strikes back at the bases', 'attack', P.saipan, 10,
      'Japanese aircraft, many staging through Iwo Jima, begin a series of raids on the Marianas airfields that lasts until January. They destroy eleven B-29s and damage 43 more for the loss of probably 37 aircraft.',
      { ...ord('12:00', 'ChST') }),
    ev('1944-11-29', 'A first, small fire raid on Tokyo', 'attack', P.tokyo, 9,
      'On the night of 29–30 November, 29 B-29s drop M69 incendiaries, cluster bombs designed for Japanese cities, on an industrial area of Tokyo. About 2,773 structures burn, a tenth of a square mile, and Twentieth Air Force headquarters judges the raid a failure. Precision raids on the Musashino plant on 27 November and 3 December do little better through wind and cloud.',
      { ...ord('23:30') }),
    ev('1944-12-22', 'Hansell protests a fire raid on Nagoya', 'political', P.nagoya, 10,
      'After precision raids on Nagoya’s aircraft plants on 13 and 18 December, Washington orders 100 B-29s with M69s against the city to test incendiaries on a Japanese target. Hansell, convinced that precision bombing is starting to work, objects, and agrees only when told it is not a general change of tactics. The raid is flown as a precision attack on an aircraft factory by 78 bombers, and bad weather means little damage.'),
    ev('1945-01-03', 'Nagoya puts out the fires', 'attack', P.nagoya, 10,
      '97 B-29s firebomb Nagoya. The fires they start are soon brought under control, and the Japanese authorities become overconfident about their ability to protect cities against incendiaries.'),
    ev('1945-01-06', 'Hansell is relieved', 'political', P.guam, 9,
      'Arnold wants results and Washington wants more area attacks. Major General Lauris Norstad, Arnold’s chief of staff, flies out and tells Hansell he is to be replaced by LeMay. Hansell turns down a post as LeMay’s deputy and stays on until mid-January.',
      { ...ord('12:00', 'ChST'), facts: [['XXI Bomber Command loss rate', 'Average 4.1% of aircraft per raid, Nov 1944 – Jan 1945']] }),
    ev('1945-01-19', 'Hansell’s last raid hits home', 'attack', P.akashi, 11,
      'In the last attack Hansell planned, 77 B-29s cripple the Kawasaki aircraft factory near Akashi. It is one of the few real successes of the precision campaign. Hansell leaves Guam two days later; LeMay arrives on 20 January.'),

    // ---------- LeMay's change ----------
    ev('1945-02-04', 'Incendiaries on Kobe', 'attack', P.kobe, 10,
      'LeMay’s first missions bring little success, but an incendiary raid by 69 B-29s on Kobe, Japan’s largest port, destroys or damages 1,039 buildings and hits the city’s main factories.'),
    ev('1945-02-19', 'A new directive puts fire higher', 'political', P.guam, 9,
      'A new Twentieth Air Force directive keeps the aircraft industry as the main target but gives much more weight to fire raids on cities, and calls for a large trial incendiary attack. The same day, U.S. Marines land on Iwo Jima, partly to give the bombers an emergency field halfway to Japan.',
      { ...ord('12:00', 'ChST') }),
    ev('1945-02-25', 'Snow and fire in Tokyo', 'attack', P.tokyo, 9,
      'The trial: 172 B-29s, the largest raid yet, drop incendiaries on snow-covered Tokyo by day from high altitude. About a square mile of the city burns and some 28,000 buildings are destroyed, the most destructive raid on Japan so far. LeMay and Washington take it as proof that mass fire raids work.',
      { facts: [['B-29s over the city', '172 of 231 dispatched'], ['Buildings destroyed', 'About 28,000']] }),
    ev('1945-03-04', 'The first B-29 lands on Iwo Jima', 'service', P.iwo, 12,
      'With fighting still going on, the B-29 Dinah Might, short of fuel, lands on Iwo Jima’s South Field, refuels and takes off again. It is the first of 2,251 B-29 landings on the island during the war, most of them for fuel or minor repairs rather than true emergencies. The same day a precision raid on a Tokyo aircraft plant fails in cloud, the end of the winter’s precision campaign. Raids before March have killed 1,292 people in Tokyo.',
      { link: { timeline: 'iwo-jima', event: '1945-03-04-dinah-might-lands', label: 'See this in The Battle of Iwo Jima' } }),
    ev('1945-03-08', 'LeMay orders a low-level night fire raid', 'political', P.guam, 9,
      'With only about seven clear days a month over Japan and the jet stream wrecking high-altitude aiming, LeMay decides on his own authority to burn Japan’s cities. The bombers will go in at night, singly rather than in formation, at 5,000 to 9,000 feet, with all guns and gunners except the tail removed so they can carry twice the usual load. His intelligence officers fear losses of up to 70 percent. He informs Twentieth Air Force headquarters on 8 March, a day he knows Arnold and Norstad are away, and orders the attack for the next night.',
      { ...ord('12:00', 'ChST'), facts: [['Code name', 'Operation Meetinghouse'], ['Target', 'Zone I: Asakusa, Honjo and Fukagawa, about 4 × 3 miles, population about 1.1 million'], ['Bombs', 'M47 napalm bombs for the pathfinders, M69 clusters for the rest']] }),

    // ---------- Operation Meetinghouse, 9–10 March ----------
    ev('1945-03-09', 'The bombers take off for Tokyo', 'movement', P.saipan, 7,
      'After 36 hours of round-the-clock maintenance, 83 percent of the command’s B-29s are ready. The first takes off at 17:35 and it takes two and three-quarter hours to get some 325 into the air from Saipan, Tinian and Guam: the 73rd and 313th Wings with seven tons of bombs each, the newly arrived 314th with five. LeMay, who knows about the atomic bomb, is forbidden to risk capture, so the 314th’s Brigadier General Thomas S. Power leads.',
      atM('17:35', { facts: [['B-29s readied', '346'], ['Wings', '73rd (169), 313th (121), 314th (56)'], ['Leader', 'Brig. Gen. Thomas S. Power']],
        paths: [{ label: 'Marianas to Tokyo (approximate)', kind: 'route', coords: marianasToTokyo }] })),
    ev('1945-03-09', 'Guide planes circle Tokyo', 'movement', P.tokyo, 9,
      'Shortly before midnight four B-29s carrying extra fuel and radios instead of bombs arrive to circle the city at 25,000 feet and guide the others in, a tactic later judged unnecessary. The night is clear but bitterly windy, with gusts of 45 to 67 mph from the southeast.',
      at('23:45', { approx: true })),
    ev('1945-03-09', 'Low-flying B-29s are dismissed', 'intelligence', P.katsuura, 9,
      'Around midnight a few B-29s are detected near Katsuura, but they are taken for reconnaissance flights. Picket boats report the bomber stream, but most of their messages are lost to bad radio reception, and the radar stations are looking for bombers at the usual high altitude, not low.',
      at('23:55', { approx: true })),
    ev('1945-03-10', 'A burning X marks the target', 'attack', P.shitamachi, 12,
      'At 00:08 pathfinder crews from the 73rd and 313th Wings cross the target at right angles to each other, and their M47 napalm bombs light a great X across the densely packed wooden districts east and west of the Sumida River. Each wing and group has its own sector of the X; as the fires spread, later bombers move on to parts not yet burning.',
      at('00:08', { facts: [['Bombing altitude', '5,000–7,000 feet, by wing']] })),
    ev('1945-03-10', 'The alarm sounds', 'intelligence', P.tokyo, 10,
      'Tokyo’s first air raid alarm comes at 00:15, after the bombs have begun falling. Searchlights and anti-aircraft guns go into action and every night fighter of the 10th Air Division takes off, but without radar guidance the fighters achieve nothing.',
      at('00:15')),
    ev('1945-03-10', 'The fire brigades are overwhelmed', 'loss', P.shitamachi, 12,
      'Within half an hour the fires are beyond the fire department’s control. Tokyo’s 8,000 firemen and its neighbourhood fire associations, armed with buckets and hand pumps, cannot touch fires started by M69s. Driven by the gale, thousands of small fires merge into firestorms that roll northwest, with temperatures reported as high as 980 °C.',
      at('00:40', { approx: true })),
    ev('1945-03-10', 'Eastern Tokyo is ablaze', 'loss', P.kototoi, 13,
      'An hour into the raid the fire department gives up fighting the fires and tries to lead people to safety. More than 125 firemen and 500 civil guards are killed. Families sheltering in the foxholes dug by their homes suffocate or burn; most of the dead are killed trying to flee through streets cut by fire and choked with smoke. A bomb load falls on a crowd crossing the Kototoi Bridge over the Sumida.',
      at('01:10', { approx: true })),
    ev('1945-03-10', 'Nowhere is safe', 'loss', P.sensoji, 13,
      'People crowd into places they hope will not burn: the parks laid out as refuges after the 1923 earthquake, the grounds of the Sensō-ji temple in Asakusa, schools, theatres and the canals. The firestorm sweeps over many of them; thousands die at Sensō-ji, and heat and smoke kill large numbers in the schools. The canals save thousands of others.',
      ord('01:30')),
    ev('1945-03-10', 'The last bombers turn for home', 'attack', P.tokyo, 9,
      'The raid lasts about two hours and forty minutes. Power circles for 90 minutes while cartographers map the spreading fire. Smoke hides the target from the last waves, some of which bomb well outside it, heat turbulence throws them about, and crews reach for oxygen masks against the smell of burning. Anti-aircraft guns shoot down twelve bombers; no fighter scores.',
      at('02:48', { approx: true, facts: [['B-29s that bombed', '279'], ['Bombs dropped', '1,665 tons'], ['B-29s lost', '14'], ['U.S. airmen killed or missing', '96']] })),
    ev('1945-03-10', 'Ash-streaked B-29s land in the Marianas', 'movement', P.saipan, 9,
      'The bombers come home between 06:10 and 11:27, many streaked with ash from the fires. Five of the crews shot down have ditched and been picked up by U.S. submarines. Reconnaissance photographs taken that day show the scale of the destruction, and Arnold congratulates LeMay that his crews “have the guts for anything”.',
      atM('06:10')),
    ev('1945-03-10', 'The fire burns itself out', 'loss', P.shitamachi, 11,
      'By mid-morning the fire stops at broad open spaces and the Nakagawa Canal. Nearly 16 square miles of Tokyo are burned out and a quarter of its buildings destroyed. Estimates of the dead run from about 84,000 to well over 100,000, mostly women, children and the old; it is the deadliest single air raid of the war, including the atomic bombs. The government’s communiqué says only that various places in the city were set on fire.',
      { ...at('10:00', { approx: true }), facts: [['Dead', '83,793 (police); 97,000 (fire department); 90,000–100,000 (most historians)'], ['Homeless', 'About 1,008,000'], ['Buildings destroyed', '267,171']],
        link: { timeline: 'road-to-tokyo-bay', event: '1945-03-10-tokyo-firebombed', label: 'See this in The Road to Tokyo Bay' } }),

    // ---------- The March blitz ----------
    ev('1945-03-12', 'Nagoya is fire-raided', 'attack', P.nagoya, 10,
      'On the night of 11–12 March (accounts differ on the date) 310 B-29s attack Nagoya, the heart of the aircraft industry. The bombs are spread more widely than at Tokyo and 2.05 square miles burn; no bomber is lost to the defences. In Tokyo the papers now splash the raid across their front pages, calling it “slaughter bombing”, and over a million people leave the city in the weeks that follow.',
      { approx: true }),
    ev('1945-03-13', 'Osaka burns', 'attack', P.osaka, 11,
      'Starting at 23:57, 274 B-29s attack Osaka, Japan’s second city, for three and a half hours from about 2,000 metres: the 314th Wing from Guam on the Minato ward, the 313th from Tinian on Naniwa, the 73rd on Kita and Nishi. More than 8 square miles southwest of Osaka Castle are destroyed. Two bombers are lost, one in a take-off crash with its crew unhurt.',
      at('23:57', { facts: [['Bombs', '1,733 tons'], ['Dead', '3,987, with 678 missing']] })),
    ev('1945-03-17', 'Kobe’s firestorm', 'attack', P.kobe, 11,
      'All three wings, 331 B-29s, firebomb Kobe on the night of 16–17 March. The fires kill 8,841 people and leave more than 650,000 homeless. Unusually for a night raid, Japanese fighters press home some 128 attacks; three bombers are lost. Two captured airmen are tried for “indiscriminate bombing” and shot.',
      { approx: true, ...ord('01:00') }),
    ev('1945-03-18', 'The Emperor tours the ruins', 'political', P.shitamachi, 11,
      'Emperor Hirohito visits the burned districts of Tokyo. Historians disagree on what it meant to him: some think it convinced him the war was lost, others that he still backed fighting on until mid-1945.'),
    ev('1945-03-19', 'The incendiaries run out', 'attack', P.nagoya, 10,
      'Nagoya is attacked again on the night of 18–19 March and nearly 3 square miles burn. The one bomber shot down ditches and its crew is rescued. The command has now used up its incendiaries. In ten days the four great fire raids have burned out more than 31 square miles of Japan’s cities, and the Japanese government evacuates schoolchildren from the main cities.',
      { ...ord('01:00') }),
    ev('1945-03-27', 'Mines in the Shimonoseki Strait', 'attack', P.shimonoseki, 9,
      'On the night of 27–28 March the 313th Wing opens Operation Starvation, LeMay’s aerial mining campaign, by sowing mines in the Shimonoseki Strait. B-29-laid mines will sink 293 ships and close most of Japan’s major harbours. For the next six weeks most of the bombers are diverted to Kyushu’s airfields to support the invasion of Okinawa.',
      ord('23:00')),

    // ---------- April and May ----------
    ev('1945-04-07', 'Mustangs from Iwo Jima', 'attack', P.musashino, 9,
      'P-51 Mustangs from Iwo Jima escort B-29s to Tokyo for the first time, and day raids that day wreck aircraft engine plants at Tokyo and Nagoya. On 12 April the Musashino plant is badly damaged at last. By now the bombers mostly fly by night, and the escorts soon turn to strafing airfields.'),
    ev('1945-04-13', 'Fire returns to Tokyo', 'attack', P.tokyo, 10,
      'LeMay resumes night fire raids: 327 B-29s burn out more than 11 square miles of Tokyo’s arsenal district, killing about 1,662 people. Two nights later 303 bombers burn parts of Tokyo, Kawasaki and Yokohama for the loss of twelve. In April the command reaches full strength, five wings and more than 1,000 B-29s.',
      { ...ord('23:30'), wiki: { Kawasaki: 'Kawasaki,_Kanagawa' } }),
    ev('1945-05-14', 'Nagoya Castle burns', 'attack', P.nagoyaCastle, 12,
      'Released from supporting Okinawa, the command begins its great fire campaign against the cities. In a day raid of 472 B-29s on Nagoya (dated 13 or 14 May), Nagoya Castle, a national treasure used as a military headquarters, is hit and burns down. Japanese fighters put up a strong fight. A second, night raid on 16–17 May burns almost 4 square miles more.',
      { approx: true, facts: [['Two May raids on Nagoya', '3,866 dead; about 472,000 homeless']] }),
    ev('1945-05-24', 'Southern Tokyo burns', 'attack', P.kawasaki, 10,
      'On the night of 23–24 May, 520 B-29s, the largest force yet, burn 5.3 square miles of southern Tokyo. Seventeen bombers are lost.',
      { approx: true }),
    ev('1945-05-26', 'The Imperial Palace is set alight', 'attack', P.palace, 12,
      'On the night of 25–26 May, 502 B-29s burn 16.8 square miles of central Tokyo, including several ministries and much of the Imperial Palace, which the crews were told not to target. The defences shoot down 26 bombers. In a Tokyo prison, 52 captured airmen deliberately left in their cells are killed. With 50.8 percent of the city destroyed, Tokyo is struck off the target list.',
      { approx: true, facts: [['Dead (police figure)', '3,352'], ['B-29s lost', '26']] }),
    ev('1945-05-29', 'Yokohama’s day of fire', 'attack', P.yokohama, 11,
      '454 of 517 B-29s, escorted by P-51s, firebomb Yokohama’s business district by day, destroying 6.9 square miles and killing more than 1,000 people. In May the bombers have burned out a seventh of Japan’s urban area, and the Home Minister concludes that civil defence is futile.'),

    // ---------- June: the last big cities ----------
    ev('1945-06-01', 'Mustangs lost in cloud over Osaka', 'attack', P.osaka, 10,
      '521 B-29s with 148 P-51s set out for Osaka by day. Flying through thick cloud, 27 Mustangs are lost in collisions. The bombers kill 3,960 people and burn more than 3 square miles.'),
    ev('1945-06-05', 'Kobe is crossed off the list', 'attack', P.kobe, 11,
      '473 B-29s burn more than 4 square miles of Kobe by day for the loss of eleven bombers. More than half the city’s built-up area is now damaged, and it is removed from the target list as not worth revisiting.'),
    ev('1945-06-15', 'The six great cities are finished', 'attack', P.osaka, 10,
      'A fourth June raid on Osaka, by 444 B-29s, also burns part of neighbouring Amagasaki. It closes the first phase of the city campaign: Tokyo, Nagoya, Osaka, Yokohama, Kobe and Kawasaki are largely destroyed. The May and June raids alone have killed between 112,000 and about 127,000 people and left millions homeless, for 136 B-29s lost.',
      { facts: [['Houses destroyed in Osaka', 'About 300,000'], ['Areas leveled in Tokyo, Osaka and Nagoya', 'Almost 100 square miles, more than in all German cities']], wiki: { Kawasaki: 'Kawasaki,_Kanagawa' } }),

    // ---------- The smaller cities ----------
    ev('1945-06-17', 'The fire raids reach the smaller cities', 'attack', P.hamamatsu, 10,
      'Arnold, visiting LeMay on Saipan in mid-June, approves raids on smaller cities. On the night of 17–18 June a wing each attacks Hamamatsu, Kagoshima, Ōmuta and Yokkaichi; 456 B-29s burn more than 6 square miles and none is lost to the almost undefended cities. This becomes the pattern: on most raid nights four cities, one wing each, about two raids a week.',
      { ...ord('23:00'), facts: [['Cities attacked by the war’s end', '58, in 16 multi-city raids'], ['B-29s shot down in the small-city campaign', '1']] }),
    ev('1945-06-26', 'Radar bombers go after the oil refineries', 'attack', P.yokkaichi, 11,
      'The 315th Wing, flying stripped-down B-29Bs with the new Eagle radar, makes its first night attack, on the Utsube refinery at Yokkaichi. Its 15 raids on oil plants destroy six of nine targets, but the blockade has left Japan almost no crude oil to refine.',
      ord('23:00')),
    ev('1945-07-16', 'LeMay takes the Twentieth Air Force', 'political', P.guam, 9,
      'XXI Bomber Command becomes the Twentieth Air Force under LeMay. Two days later General Carl Spaatz sets up U.S. Strategic Air Forces in the Pacific on Guam, to command it and the Eighth Air Force moving from Europe to Okinawa.',
      ord('12:00', 'ChST')),
    ev('1945-07-27', 'Leaflets name the next targets', 'intelligence', P.tsu, 8,
      'On the night of 27–28 July six B-29s drop leaflets over eleven cities warning that they will be bombed. The warnings are meant to break morale and show that America seeks to limit civilian deaths, and cost the bombers little because the cities are so weakly defended. The Japanese government punishes anyone caught keeping a leaflet. The B-29s drop some 30 million leaflets in July.',
      { ...ord('23:00'), facts: [['Leaflets dropped', 'About 10 million in May, 20 million in June, 30 million in July']] }),
    ev('1945-07-28', 'The warned cities burn', 'attack', P.tsu, 10,
      'Six of the warned cities, Aomori, Ichinomiya, Tsu, Uji-Yamada, Ōgaki and Uwajima, are firebombed. No B-29s are lost, though 40 to 50 fighters come up and damage six. The government has rejected the Potsdam Declaration that day.',
      ord('23:00')),
    ev('1945-08-01', 'The largest raid of the war', 'attack', P.toyama, 11,
      '836 B-29s drop 6,632 tons of bombs and mines in the largest single raid of the Second World War. Hachiōji, Mito, Nagaoka and Toyama are the main targets, all warned beforehand by leaflets and radio from Saipan; 99.5 percent of Toyama’s buildings are destroyed.',
      ord('23:00')),
    ev('1945-08-06', 'An atomic bomb on Hiroshima', 'attack', P.hiroshima, 10,
      'A single B-29, Enola Gay, drops the first atomic bomb on Hiroshima at 08:15. Truman threatens Japan with “a rain of ruin from the air”. Nagasaki follows on 9 August, and the fire raids go on: on 8 August daylight incendiary attacks burn a fifth of Yawata and three-quarters of Fukuyama.',
      { ...at('08:15'), link: { timeline: 'road-to-tokyo-bay', event: '1945-08-06-hiroshima', label: 'See this in The Road to Tokyo Bay' } }),
    ev('1945-08-11', 'Truman halts the bombing', 'political', P.guam, 8,
      'Japan has begun negotiating surrender, and Truman orders the bombing stopped so that it is not taken as a sign that talks have failed. Spaatz issues a new directive putting transport ahead of cities if the raids resume. On 13 August B-29s scatter copies of Japan’s conditional surrender offer over its cities.',
      ord('12:00', 'ChST')),

    // ---------- The end ----------
    ev('1945-08-14', 'Bombs on Kyōbashi Station', 'loss', P.kyobashi, 13,
      'With talks apparently stalled, Spaatz is ordered to resume. 828 B-29s with 186 fighters fly against Japan. In Osaka, 145 bombers aim at the army arsenal, and at about 13:00 four one-ton bombs hit Kyōbashi Station just as two crowded trains have arrived. More than 210 identified dead and over 500 unidentified are counted there.',
      at('13:00', { approx: true })),
    ev('1945-08-14', 'The last fire raids', 'attack', P.kumagaya, 11,
      'That night the B-29s firebomb Kumagaya and Isesaki, northwest of Tokyo. They are the last heavy-bomber raids of the war. Jimmy Doolittle keeps the Eighth Air Force’s new B-29s on Okinawa out of the operation, unwilling to risk his crews when the war is all but over.',
      ord('23:00')),
    ev('1945-08-15', 'The Emperor announces surrender', 'political', P.palace, 10,
      'At noon Hirohito’s recorded broadcast tells the Japanese people that the war is ending. Carrier aircraft attacking Tokyo that morning are recalled in mid-mission. At Fukuoka, fifteen captured airmen are beheaded after the announcement. The bombing has killed, by the most cited estimate, some 333,000 Japanese, and burned out about 40 percent of the built-up area of 66 cities.',
      at('12:00', { facts: [['Japanese dead from air raids', '333,000 most often cited; estimates 241,000–900,000'], ['Wounded', 'About 473,000'], ['B-29s lost to Japanese action', 'About 147']],
        link: { timeline: 'road-to-tokyo-bay', event: '1945-08-15-the-emperor-s-broadcast', label: 'See this in The Road to Tokyo Bay' } })),
    ev('1945-09-02', 'B-29s over Tokyo Bay', 'service', P.tokyoBay, 10,
      'After the surrender ceremony aboard USS Missouri, 462 B-29s fly over the Allied fleet in Tokyo Bay. Since late August the bombers have been dropping food and supplies to prisoner-of-war camps. Japan will spend years rebuilding its burned cities.'),
  ];

  // ---------- Shot list ----------
  // Camera direction (see "Shots" in app.js). Events not listed use the automatic framing.
  const pt = (place) => [place.lat, place.lng];
  const SHOTS = {
    'B-29s bomb Yawata': { shot: 'wide', frame: [pt(P.chengdu), pt(P.yawata)] },
    'The first B-29 reaches Saipan': { shot: 'wide', transition: 'pull-back', frame: [pt(P.saipan), pt(P.tokyo)] },
    'The first B-29 lands on Iwo Jima': { shot: 'tight', transition: 'fly' },
    // 9–10 March: from the Marianas to the burning city.
    'The bombers take off for Tokyo': { shot: 'wide', transition: 'pull-back', frame: [pt(P.saipan), pt(P.tokyo)] },
    'Guide planes circle Tokyo': { scene: 'tokyo-approach', frame: [pt(P.katsuura), pt(P.shitamachi)] },
    'Low-flying B-29s are dismissed': { scene: 'tokyo-approach' },
    'A burning X marks the target': { scene: 'meetinghouse', shot: 'tight', transition: 'fly', frame: [pt(P.sensoji), pt(P.yokoamicho)] },
    'The alarm sounds': { scene: 'meetinghouse' },
    'The fire brigades are overwhelmed': { scene: 'meetinghouse' },
    'Eastern Tokyo is ablaze': { scene: 'meetinghouse' },
    'Nowhere is safe': { scene: 'meetinghouse' },
    'The last bombers turn for home': { scene: 'meetinghouse' },
    'Ash-streaked B-29s land in the Marianas': { shot: 'wide', transition: 'pull-back', frame: [pt(P.tokyo)] },
    'The fire burns itself out': { shot: 'tight', transition: 'fly' },
    // The March blitz across the cities of central Honshu.
    'Osaka burns': { scene: 'march-blitz', frame: [pt(P.nagoya), pt(P.kobe)] },
    'Kobe’s firestorm': { scene: 'march-blitz' },
    'The incendiaries run out': { scene: 'march-blitz' },
  };
  const events = WW2.events['firebombing-of-japan'];
  for (const [title, shot] of Object.entries(SHOTS)) {
    const e = events.find((x) => x.title === title);
    if (!e) throw new Error(`firebombing-of-japan shot list: no event titled "${title}"`);
    Object.assign(e, shot);
  }
})();
