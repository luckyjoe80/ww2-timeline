// Catalog of timelines, shown as the tree menu on the left.
// Groups have `children`; leaves are timelines whose events live in
// data/timelines/<id>.js (each file fills WW2.events[<id>]).
//
// Timeline options:
//   id, title, description
//   default       true for the timeline shown when no deep link is given
//   wiki          Wikipedia overrides for every event in the timeline (see data/wiki.js)
//   colors        { theater: color } to color markers and the legend by theater instead of type
//   legend        'country' to color and filter by each event's `country` (one, or a list for an event
//                 involving several), grouped by side (see SIDES in app.js)
//   stories       { id: label } lanes for the Connections view, top to bottom; events then carry
//                 `story` and `after` (ids of earlier events they follow from)
//   views         ['connections', 'map'] to offer the Connections view; the first is the default
//   filter        'story' to filter by story in the legend (colours still follow `legend`)
//   centerLng     longitude at the middle of the (single, finite) map; defaults to the middle of the events
//   kind          'atlas' for a places-and-flows view (data in data/atlases/<id>.js) instead of a timeline

window.WW2 = {
  events: {},
  catalog: [
    {
      title: 'War in the Pacific',
      children: [
        {
          id: 'road-to-pearl-harbor',
          title: 'The Road to Pearl Harbor',
          description: 'The ships of the Pacific Fleet, from keel-laying to their moorings on 6 December 1941.',
        },
        {
          id: 'attack-on-hawaii',
          title: 'The Attack on Hawaii',
          description: 'From Japan to Oahu: the Kido Butai’s voyage, the attack hour by hour, and the days after.',
          default: true,
        },
        {
          id: 'pearl-harbor-to-guadalcanal',
          title: 'From Pearl Harbor to Guadalcanal',
          // Ship names that are also cities or other things elsewhere.
          wiki: { Houston: 'USS_Houston_(CA-30)', Exeter: 'HMS_Exeter_(68)', 'De Ruyter': 'HNLMS_De_Ruyter_(1935)', Chicago: 'USS_Chicago_(CA-29)', Canberra: 'HMAS_Canberra_(D33)', Quincy: 'USS_Quincy_(CA-39)', Vincennes: 'USS_Vincennes_(CA-44)', Sims: 'USS_Sims_(DD-409)', Washington: 'USS_Washington_(BB-56)', Evertsen: 'HNLMS_Evertsen_(1926)', Hiei: 'Japanese_battleship_Hiei', Ryūjō: 'Japanese_aircraft_carrier_Ryūjō' },
          description: 'Japan’s conquests across Asia and the Pacific, the turn at Coral Sea and Midway, and the first Allied counter-offensive, December 1941 – February 1943.',
        },
        {
          id: 'road-to-tokyo-bay',
          title: 'The Road to Tokyo Bay',
          description: 'From Guadalcanal to Japan’s surrender: Tarawa, the Marianas, Leyte Gulf, Iwo Jima, Okinawa and the atomic bombs, February 1943 – September 1945.',
          // Ship names that are also places or institutions elsewhere.
          wiki: { Princeton: 'USS_Princeton_(CVL-23)', Missouri: 'USS_Missouri_(BB-63)', Indianapolis: 'USS_Indianapolis_(CA-35)', Musashi: 'Japanese_battleship_Musashi' },
        },
        {
          id: 'pacific-submarines',
          title: 'Submarine Operations',
          description: 'Submarine warfare in the Pacific and Southeast Asia by every navy involved, 1941–1946.',
          colors: {
            'U.S. Navy': '#3f78b5',
            'Imperial Japanese Navy': '#c8402f',
            'Royal Navy': '#2f8f8a',
            'Royal Netherlands Navy': '#d98a2b',
            'Kriegsmarine': '#8a8a8a',
            'Regia Marina': '#5a8a4e',
            'Soviet Navy': '#8e2a5c',
          },
        },
      ],
    },
    {
      title: 'Pacific Battles',
      children: [
        {
          id: 'philippines-1941-42',
          title: 'The Fall of the Philippines',
          description: 'From the destruction of MacArthur’s air force at Clark Field to the stand on Bataan, the Death March and the surrender of Corregidor and the southern islands, December 1941 – June 1942.',
          wiki: { Rosario: 'Rosario,_La_Union', Cagayan: 'Cagayan_de_Oro', 'San Fernando': 'San_Fernando,_Pampanga', Tarlac: 'Tarlac_City', Naka: 'Japanese_cruiser_Naka', Sutherland: 'Richard_K._Sutherland', Moron: 'Morong,_Bataan' },
        },
        {
          id: 'malaya-singapore',
          title: 'Malaya and Singapore',
          description: 'Kota Bharu, the loss of Force Z, the drive down the peninsula and Britain’s largest surrender, December 1941–February 1942.',
          wiki: { Jitra: 'Battle_of_Jitra', Kampar: 'Battle_of_Kampar', 'Slim River': 'Battle_of_Slim_River', Gemas: 'Battle_of_Gemas', Muar: 'Battle_of_Muar', Endau: 'Battle_off_Endau', Kranji: 'Battle_of_Kranji', 'Pasir Panjang': 'Battle_of_Pasir_Panjang', Buffalo: 'Brewster_F2A_Buffalo', Hudson: 'Lockheed_Hudson', Hudsons: 'Lockheed_Hudson', Blenheim: 'Bristol_Blenheim', Hurricane: 'Hawker_Hurricane', Hurricanes: 'Hawker_Hurricane', Walrus: 'Supermarine_Walrus', Express: 'HMS_Express_(H61)', Indomitable: 'HMS_Indomitable_(92)', Vildebeest: 'Vickers_Vildebeest' },
        },
        {
          id: 'java-sea',
          title: 'The Battle of the Java Sea',
          description: 'The ABDA navies’ defence of the Dutch East Indies, from the Balikpapan raid through Doorman’s defeat, Sunda Strait and the loss of Exeter to the surrender of Java, January – March 1942.',
          wiki: { Houston: 'USS_Houston_(CA-30)', Exeter: 'HMS_Exeter_(68)', Perth: 'HMAS_Perth_(D29)', 'De Ruyter': 'HNLMS_De_Ruyter_(1935)', Java: 'Java', 'cruiser Java': 'HNLMS_Java_(1921)', 'HNLMS Java': 'HNLMS_Java_(1921)', Kortenaer: 'HNLMS_Kortenaer_(1927)', 'Witte de With': 'HNLMS_Witte_de_With_(1928)', 'Piet Hein': 'HNLMS_Piet_Hein_(1927)', Evertsen: 'HNLMS_Evertsen_(1926)', 'Van Ghent': 'HNLMS_Van_Ghent', Electra: 'HMS_Electra_(H27)', Jupiter: 'HMS_Jupiter_(F85)', Encounter: 'HMS_Encounter_(H10)', Pope: 'USS_Pope_(DD-225)', Tromp: 'HNLMS_Tromp_(1937)', Stewart: 'USS_Stewart_(DD-224)', Boise: 'USS_Boise_(CL-47)', Marblehead: 'USS_Marblehead_(CL-12)', Alden: 'USS_Alden', Parrott: 'USS_Parrott', 'Paul Jones': 'USS_Paul_Jones_(DD-230)', Naka: 'Japanese_cruiser_Naka', Natori: 'Japanese_cruiser_Natori', Nachi: 'Japanese_cruiser_Nachi', Rooks: 'Albert_H._Rooks', Waller: 'Hector_Waller', 'Oliver Gordon': 'Oliver_Gordon_(Royal_Navy_officer)', 'Mark 15': 'Mark_15_torpedo' },
        },
        {
          id: 'coral-sea',
          title: 'The Battle of the Coral Sea',
          description: 'Operation Mo and the first battle between aircraft carriers, from the code-breakers’ warning and the Tulagi landing to the loss of Lexington and the turning back of the Port Moresby invasion, April–May 1942.',
          wiki: { Fletcher: 'Frank_Jack_Fletcher', Inoue: 'Shigeyoshi_Inoue', Fitch: 'Aubrey_Fitch', Crace: 'John_Gregory_Crace', Takagi: 'Takeo_Takagi', Hara: 'Chūichi_Hara', Gotō: 'Aritomo_Gotō', Shima: 'Kiyohide_Shima', Takahashi: 'Kakuichi_Takahashi', Sherman: 'Frederick_C._Sherman', Sims: 'USS_Sims_(DD-409)', Henley: 'USS_Henley_(DD-391)', Phelps: 'USS_Phelps', Kashima: 'Japanese_cruiser_Kashima' },
        },
        {
          id: 'battle-of-midway',
          title: 'The Battle of Midway',
          description: 'Code-breaking, four carriers lost in a day, and the end of Yorktown, May–June 1942.',
          wiki: { Fletcher: 'Frank_Jack_Fletcher', Yamaguchi: 'Tamon_Yamaguchi', Akebono: null, Best: null },
        },
        {
          id: 'kokoda-track',
          title: 'The Kokoda Track',
          description: 'Papua, 1942–43: the Japanese drive over the Owen Stanleys to within sight of Port Moresby, Milne Bay, the fight back to Kokoda and the battle for the Buna–Gona beachheads.',
          wiki: { '7th Division': '7th_Division_(Australia)', '32nd Division': '32nd_Infantry_Division_(United_States)', '18th Brigade': '18th_Brigade_(Australia)', '21st Brigade': '21st_Brigade_(Australia)', '25th Brigade': '25th_Brigade_(Australia)', '16th Brigade': '16th_Brigade_(Australia)', Arashi: 'Japanese_destroyer_Arashi', 'Distinguished Service Cross': 'Distinguished_Service_Cross_(United_States)', Hudson: 'Lockheed_Hudson' },
        },
        {
          id: 'guadalcanal',
          title: 'Guadalcanal',
          description: 'Six months of land, sea and air battles for Henderson Field, from the landings and Savo Island to the Japanese evacuation, August 1942 – February 1943.',
          wiki: { Guadalcanal: 'Guadalcanal', 'Savo Island': 'Savo_Island', Fletcher: 'Frank_Jack_Fletcher', Patterson: 'USS_Patterson_(DD-392)', Canberra: 'HMAS_Canberra_(D33)', Chicago: 'USS_Chicago_(CA-29)', Quincy: 'USS_Quincy_(CA-39)', Vincennes: 'USS_Vincennes_(CA-44)', 'Long Island': 'USS_Long_Island_(CVE-1)', Little: 'USS_Little_(DD-79)', Gregory: 'USS_Gregory_(DD-82)', Boise: 'USS_Boise_(CL-47)', Duncan: 'USS_Duncan_(DD-485)', Atlanta: 'USS_Atlanta_(CL-51)', 'San Francisco': 'USS_San_Francisco_(CA-38)', Washington: 'USS_Washington_(BB-56)', 'South Dakota': 'USS_South_Dakota_(BB-57)', Walke: 'USS_Walke_(DD-416)', Preston: 'USS_Preston_(DD-379)', Benham: 'USS_Benham_(DD-397)', Northampton: 'USS_Northampton_(CA-26)', Minneapolis: 'USS_Minneapolis_(CA-36)', 'New Orleans': 'USS_New_Orleans_(CA-32)', Pensacola: 'USS_Pensacola_(CA-24)', '17th Army': 'Seventeenth_Army_(Japan)' },
        },
        {
          id: 'tarawa',
          title: 'Tarawa',
          description: 'Operation Galvanic, November 1943: Marines wade across Betio’s reef into the first defended landing of the Central Pacific drive, while the Army takes Makin and a submarine sinks the escort carrier Liscome Bay.',
          wiki: { Schroeder: 'USS_Schroeder', Sigsbee: 'USS_Sigsbee', 'Leonard Wood': 'USS_Leonard_Wood', Neville: 'USS_Neville' },
        },
        {
          id: 'imphal-kohima',
          title: 'Imphal and Kohima',
          description: 'Operation U-Go, Japan’s 1944 invasion of India: Sangshak, the siege of Kohima and its tennis court, the battles around Imphal, and the starving retreat to the Chindwin.',
          wiki: { 'Fourteenth Army': 'Fourteenth_Army_(United_Kingdom)', 'Fifteenth Army': 'Fifteenth_Army_(Japan)', Slim: 'William_Slim,_1st_Viscount_Slim', Satō: 'Kōtoku_Satō', Kawabe: 'Masakazu_Kawabe', Miyazaki: 'Shigesaburō_Miyazaki', Cowan: 'David_Tennant_Cowan', Hump: 'The_Hump', '2nd Division': '2nd_Infantry_Division_(United_Kingdom)', '15th Division': '15th_Division_(Imperial_Japanese_Army)', '31st Division': '31st_Division_(Imperial_Japanese_Army)', '33rd Division': '33rd_Division_(Imperial_Japanese_Army)', 'IV Corps': 'IV_Corps_(United_Kingdom)', 'XV Corps': 'XV_Corps_(British_India)' },
        },
        {
          id: 'saipan-philippine-sea',
          title: 'Saipan and the Philippine Sea',
          description: 'Operation Forager opens: the invasion of Saipan and the Great Marianas Turkey Shoot, from the first carrier strikes of June 1944 to the last banzai charge, the deaths at the northern cliffs and Tōjō’s fall.',
          wiki: { Lexington: 'USS_Lexington_(CV-16)', Hornet: 'USS_Hornet_(CV-12)', 'South Dakota': 'USS_South_Dakota_(BB-57)', Chiyoda: 'Japanese_aircraft_carrier_Chiyoda', Haruna: 'Japanese_battleship_Haruna', Haguro: 'Japanese_cruiser_Haguro', Seahorse: 'USS_Seahorse_(SS-304)', Princeton: 'USS_Princeton_(CVL-23)', Wasp: 'USS_Wasp_(CV-18)', 'Bunker Hill': 'USS_Bunker_Hill_(CV-17)', 'Belleau Wood': 'USS_Belleau_Wood_(CVL-24)', Rota: 'Rota,_Northern_Mariana_Islands', Tsushima: 'Battle_of_Tsushima', Tōgō: 'Tōgō_Heihachirō', Toyoda: 'Soemu_Toyoda', Saitō: 'Yoshitsugu_Saitō', Marianas: 'Mariana_Islands', Sherman: 'M4_Sherman', Normandy: 'Normandy_landings', Avenger: 'Grumman_TBF_Avenger' },
        },
        {
          id: 'leyte-gulf',
          title: 'The Battle of Leyte Gulf',
          description: 'The return to the Philippines and the largest naval battle of the war, 23–26 October 1944: Palawan Passage, the Sibuyan Sea, Surigao Strait, Samar, Cape Engaño and the first kamikazes.',
          wiki: { Leyte: 'Leyte', Princeton: 'USS_Princeton_(CVL-23)', Birmingham: 'USS_Birmingham_(CL-62)', Kumano: 'Japanese_cruiser_Kumano', Franklin: 'USS_Franklin_(CV-13)', Reno: 'USS_Reno_(CL-96)', Independence: 'USS_Independence_(CVL-22)', Langley: 'USS_Langley_(CVL-27)', Mississippi: 'USS_Mississippi_(BB-41)', California: 'USS_California_(BB-44)', Iowa: 'USS_Iowa_(BB-61)', 'New Jersey': 'USS_New_Jersey_(BB-62)', Santee: 'USS_Santee_(CVE-29)', Suwannee: 'USS_Suwannee_(CVE-27)', Melvin: 'USS_Melvin_(DD-680)', Bennion: 'USS_Bennion', Irwin: 'USS_Irwin', Intrepid: 'USS_Intrepid_(CV-11)', Cabot: 'USS_Cabot', Lexington: 'USS_Lexington_(CV-16)', Essex: 'USS_Essex_(CV-9)', Haruna: 'Japanese_battleship_Haruna', Nachi: 'Japanese_cruiser_Nachi', Tama: 'Japanese_cruiser_Tama', Chitose: 'Japanese_aircraft_carrier_Chitose', Chiyoda: 'Japanese_aircraft_carrier_Chiyoda', Myōkō: 'Japanese_cruiser_Myōkō', Noshiro: 'Japanese_cruiser_Noshiro', 'White Plains': 'USS_White_Plains_(CVE-66)', Toyoda: 'Soemu_Toyoda', Shima: 'Kiyohide_Shima', 'John Collins': 'John_Augustine_Collins', 'Eighth Army': 'Eighth_Army_(United_States)', Louisville: 'USS_Louisville_(CA-28)' },
        },
        {
          id: 'kamikaze',
          title: 'The Kamikaze',
          description: 'Japan’s special attack units, from Ōnishi’s first suicide squadrons at Mabalacat and the sinking of St. Lo to the Kikusui mass raids off Okinawa, Ugaki’s last flight and Ōnishi’s death in August 1945.',
          wiki: { Seki: 'Yukio_Seki', Franklin: 'USS_Franklin_(CV-13)', Australia: 'HMAS_Australia_(D84)', 'John Collins': 'John_Augustine_Collins', Santee: 'USS_Santee_(CVE-29)', Suwannee: 'USS_Suwannee_(CVE-27)', Sangamon: 'USS_Sangamon_(CVE-26)', 'White Plains': 'USS_White_Plains_(CVE-66)', Intrepid: 'USS_Intrepid_(CV-11)', 'Belleau Wood': 'USS_Belleau_Wood_(CVL-24)', Essex: 'USS_Essex_(CV-9)', Unryū: 'Japanese_aircraft_carrier_Unryū', Redfish: 'USS_Redfish_(SS-395)', 'I-47': 'Japanese_submarine_I-47', 'I-36': 'Japanese_submarine_I-36', Nashville: 'USS_Nashville_(CL-43)', Haraden: 'USS_Haraden_(DD-585)', Burns: 'USS_Burns_(DD-588)', Eichenberger: 'USS_Eichenberger', 'Manila Bay': 'USS_Manila_Bay', Louisville: 'USS_Louisville_(CA-28)', Helm: 'USS_Helm', Arunta: 'HMAS_Arunta_(I30)', 'New Mexico': 'USS_New_Mexico_(BB-40)', Long: 'USS_Long', Brooks: 'USS_Brooks', California: 'USS_California_(BB-44)', Mississippi: 'USS_Mississippi_(BB-41)', 'War Hawk': 'USS_War_Hawk', Salamaua: 'USS_Salamaua', Ticonderoga: 'USS_Ticonderoga_(CV-14)', Randolph: 'USS_Randolph_(CV-15)', Kanoya: 'Kanoya_Air_Field', Chiran: 'Chiran_Airfield', Indianapolis: 'USS_Indianapolis_(CA-35)', 'West Virginia': 'USS_West_Virginia_(BB-48)', Alpine: 'USS_Alpine', Achernar: 'USS_Achernar', Tyrrell: 'USS_Tyrrell', Bush: 'USS_Bush_(DD-529)', Colhoun: 'USS_Colhoun_(DD-801)', Jeffers: 'USS_Jeffers', Stanly: 'USS_Stanly', Laffey: 'USS_Laffey_(DD-724)', Little: 'USS_Little_(DD-803)', 'Aaron Ward': 'USS_Aaron_Ward_(DM-34)', Formidable: 'HMS_Formidable_(67)', Evans: 'USS_Evans_(DD-552)', 'Bunker Hill': 'USS_Bunker_Hill_(CV-17)', Drexler: 'USS_Drexler', Lowry: 'USS_Lowry', Underhill: 'USS_Underhill', Callaghan: 'USS_Callaghan_(DD-792)', Corsair: 'Vought_F4U_Corsair', Val: 'Aichi_D3A', Oscar: 'Nakajima_Ki-43_Hayabusa', Frances: 'Yokosuka_P1Y_Ginga', Judy: 'Yokosuka_D4Y_Suisei' },
        },
        {
          id: 'iwo-jima',
          title: 'Iwo Jima',
          description: 'Operation Detachment, February – March 1945: Kuribayashi’s tunnel fortress, the landings, the flags on Mount Suribachi, the Meat Grinder and the last stand in the Gorge.',
          wiki: { Marianas: 'Mariana_Islands', 'Bismarck Sea': 'USS_Bismarck_Sea', Sherman: 'M4_Sherman', Mustang: 'North_American_P-51_Mustang', Nakajima: 'Nakajima_Aircraft_Company', Eldorado: 'USS_Eldorado_(AGC-11)' },
        },
        {
          id: 'firebombing-of-japan',
          title: 'The Firebombing of Japan',
          description: 'The B-29 campaign against Japan, from the first raids out of China to LeMay’s low-level night fire raids that burned Tokyo on 9–10 March 1945 and then city after city until the surrender.',
          wiki: { Mito: 'Mito,_Ibaraki', Tsu: 'Tsu,_Mie' },
        },
        {
          id: 'okinawa',
          title: 'Okinawa',
          description: 'Operation Iceberg, March–June 1945: the Kerama Islands and L-Day, the Shuri Line and Sugar Loaf Hill, Yamato’s last sortie and the kamikaze onslaught on the fleet, and the 82-day battle’s terrible cost to Okinawa’s civilians.',
          wiki: { 'Bunker Hill': 'USS_Bunker_Hill_(CV-17)', Hancock: 'USS_Hancock_(CV-19)', Bennett: 'USS_Bennett', Callaghan: 'USS_Callaghan_(DD-792)', Mississippi: 'USS_Mississippi_(BB-41)', Franklin: 'USS_Franklin_(CV-13)', 'Ōta': 'Minoru_Ōta', Corsair: 'Vought_F4U_Corsair', Avenger: 'Grumman_TBF_Avenger' },
        },
      ],
    },
    {
      title: 'Technology',
      children: [
        {
          id: 'atomic-bomb',
          title: 'The Atomic Bomb',
          description: 'From the discovery of nuclear fission in Berlin and the Einstein–Szilárd letter through the Manhattan Project, Chicago Pile-1 and the Trinity test to the bombings of Hiroshima and Nagasaki and Japan’s surrender, 1938–1945.',
          wiki: { Trinity: 'Trinity_(nuclear_test)', Leyte: 'Leyte', Hahn: 'Otto_Hahn', Frisch: 'Otto_Robert_Frisch', Lawrence: 'Ernest_Lawrence', Compton: 'Arthur_Compton', Sweeney: 'Charles_Sweeney', Bohr: 'Niels_Bohr' },
        },
        {
          id: 'radar',
          title: 'Radar',
          description: 'From the Daventry experiment, Chain Home and the cavity magnetron through the radio war over Europe, centimetric radar against the U-boats and the radar-directed night battles of the Mediterranean, Arctic and Pacific to the picket line off Okinawa, 1935–1945.',
          wiki: { Würzburg: 'Würzburg_radar', Freya: 'Freya_radar', Bismarck: 'German_battleship_Bismarck', Halifax: 'Handley_Page_Halifax', Wellington: 'Vickers_Wellington', Stirling: 'Short_Stirling', Lancaster: 'Avro_Lancaster', Blenheim: 'Bristol_Blenheim', Naxos: 'Naxos_radar_detector', Lichtenstein: 'Lichtenstein_radar', Window: 'Chaff_(countermeasure)', Düppel: 'Chaff_(countermeasure)', 'Giman-shi': 'Chaff_(countermeasure)', Bari: 'Air_raid_on_Bari', Taxable: 'D-Day_naval_deceptions', SJ: 'SJ_radar', Orchis: 'HMS_Orchis', Bowen: 'Edward_George_Bowen', Rowe: 'Albert_Rowe_(physicist)', Kazagumo: 'Japanese_destroyer_Kazagumo', Makigumo: 'Japanese_destroyer_Makigumo', Shimada: 'Shimada,_Shizuoka', 'Bomber Command': 'RAF_Bomber_Command' },
          legend: 'country',
        },
        {
          id: 'codebreaking',
          title: 'Codes and Codebreaking',
          description: 'The secret war of codes and ciphers, from the Polish break into Enigma and Bletchley Park’s Ultra to PURPLE, JN-25, Midway, the B-Dienst, Colossus and the Navajo code talkers, 1929–1946.',
          wiki: { Knox: 'Dilly_Knox', 'Cipher Bureau': 'Biuro_Szyfrów', Navajo: 'Code_talker', Comanche: 'Code_talker', Montgomery: 'Bernard_Montgomery', Rommel: 'Erwin_Rommel', Tunny: 'Cryptanalysis_of_the_Lorenz_cipher', Lorenz: 'Lorenz_cipher', Colossus: 'Colossus_computer', Fortitude: 'Operation_Fortitude', 'Cape Matapan': 'Battle_of_Cape_Matapan', Tobruk: 'Axis_capture_of_Tobruk', Kursk: 'Battle_of_Kursk', 'Hugh Alexander': "Conel_Hugh_O'Donel_Alexander", 'Pas de Calais': 'Pas-de-Calais', '20th Division': '20th_Division_(Imperial_Japanese_Army)', '4th Infantry Division': '4th_Infantry_Division_(United_States)' },
          legend: 'country',
          stories: { enigma: 'Breaking Enigma', ultra: 'Ultra in action', lorenz: 'Tunny and Colossus', japan: 'Japan’s codes', axis: 'Axis codebreakers', secure: 'Codes that held', alliance: 'Alliance and secrecy' },
          views: ['connections', 'map'],
          filter: 'story',
        },
        {
          id: 'submarine-technology',
          title: 'Submarine Technology',
          description: 'The boats, torpedoes and counter-measures of the submarine war in every navy, from the Type VII and Gato class to the Mark 14 scandal, Hedgehog and the Type XXI Elektroboot, May 1939 – November 1946.',
          wiki: { 'U-class': 'British_U-class_submarine', Upholder: 'HMS_Upholder_(P37)', Hudson: 'Lockheed_Hudson', Chariot: 'Chariot_manned_torpedo', Peto: 'USS_Peto', Wellington: 'Vickers_Wellington', SJ: 'SJ_radar', Fido: 'Mark_24_mine', 'Leonardo da Vinci': 'Italian_submarine_Leonardo_da_Vinci_(1939)', Schnorchel: 'Submarine_snorkel', snorkel: 'Submarine_snorkel', Squid: 'Squid_(weapon)', Seiran: 'Aichi_M6A_Seiran', 'S class': 'Soviet_S-class_submarine', 'M-class': 'Soviet_M-class_submarine', Gatun: 'Panama_Canal_locks' },
          legend: 'country',
        },
      ],
    },
    {
      title: 'Production',
      children: [
        {
          id: 'b17-production',
          kind: 'atlas',
          title: 'B-17 Production',
          description: 'Where and how the 12,731 Flying Fortresses were built, finished and flown to war.',
        },
      ],
    },
    {
      title: 'Medals',
      children: [
        {
          id: 'medal-of-honor',
          title: 'Medal of Honor',
          description: 'Every Medal of Honor action of the war, 1941–1945, with the official citations.',
          colors: {
            'Army': '#5a8a4e',
            'Army Air Forces': '#4f9bd6',
            'Navy': '#2c4f8a',
            'Marine Corps': '#c8402f',
            'Coast Guard': '#d98a2b',
          },
        },
      ],
    },
    {
      title: 'People',
      children: [
        {
          id: 'yamamoto',
          title: 'Isoroku Yamamoto',
          description: 'The Combined Fleet commander who planned Pearl Harbor, from Nagaoka to Bougainville.',
          wiki: { Yamamoto: null, 'Isoroku Yamamoto': null }, // don't link the subject in his own timeline
        },
      ],
    },
    {
      title: 'Ships',
      children: [
        {
          id: 'yamato',
          title: 'Battleship Yamato',
          description: 'The largest battleship ever built, from secret construction at Kure to her sinking in 1945.',
          wiki: { Yamato: null }, // linked once, on the keel-laying event
        },
      ],
    },
  ],
};
