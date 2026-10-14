// Catalog of timelines, shown as the tree menu on the left.
// Groups have `children`; leaves are timelines whose events live in
// data/timelines/<id>.js (each file fills WW2.events[<id>]).
//
// Timeline options:
//   id, title, description
//   default       true for the timeline shown when no deep link is given
//   wiki          Wikipedia overrides for every event in the timeline (see data/wiki.js)
//   colors        { theater: color } to color markers and the legend by theater instead of type
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
          id: 'battle-of-midway',
          title: 'The Battle of Midway',
          description: 'Code-breaking, four carriers lost in a day, and the end of Yorktown, May–June 1942.',
          wiki: { Fletcher: 'Frank_Jack_Fletcher', Yamaguchi: 'Tamon_Yamaguchi', Akebono: null, Best: null },
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
          id: 'iwo-jima',
          title: 'Iwo Jima',
          description: 'Operation Detachment, February – March 1945: Kuribayashi’s tunnel fortress, the landings, the flags on Mount Suribachi, the Meat Grinder and the last stand in the Gorge.',
          wiki: { Marianas: 'Mariana_Islands', 'Bismarck Sea': 'USS_Bismarck_Sea', Sherman: 'M4_Sherman', Mustang: 'North_American_P-51_Mustang', Nakajima: 'Nakajima_Aircraft_Company', Eldorado: 'USS_Eldorado_(AGC-11)' },
        },
        {
          id: 'guadalcanal',
          title: 'Guadalcanal',
          description: 'Six months of land, sea and air battles for Henderson Field, from the landings and Savo Island to the Japanese evacuation, August 1942 – February 1943.',
          wiki: { Guadalcanal: 'Guadalcanal', 'Savo Island': 'Savo_Island', Fletcher: 'Frank_Jack_Fletcher', Patterson: 'USS_Patterson_(DD-392)', Canberra: 'HMAS_Canberra_(D33)', Chicago: 'USS_Chicago_(CA-29)', Quincy: 'USS_Quincy_(CA-39)', Vincennes: 'USS_Vincennes_(CA-44)', 'Long Island': 'USS_Long_Island_(CVE-1)', Little: 'USS_Little_(DD-79)', Gregory: 'USS_Gregory_(DD-82)', Boise: 'USS_Boise_(CL-47)', Duncan: 'USS_Duncan_(DD-485)', Atlanta: 'USS_Atlanta_(CL-51)', 'San Francisco': 'USS_San_Francisco_(CA-38)', Washington: 'USS_Washington_(BB-56)', 'South Dakota': 'USS_South_Dakota_(BB-57)', Walke: 'USS_Walke_(DD-416)', Preston: 'USS_Preston_(DD-379)', Benham: 'USS_Benham_(DD-397)', Northampton: 'USS_Northampton_(CA-26)', Minneapolis: 'USS_Minneapolis_(CA-36)', 'New Orleans': 'USS_New_Orleans_(CA-32)', Pensacola: 'USS_Pensacola_(CA-24)', '17th Army': 'Seventeenth_Army_(Japan)' },
        },
        {
          id: 'malaya-singapore',
          title: 'Malaya and Singapore',
          description: 'Kota Bharu, the loss of Force Z, the drive down the peninsula and Britain’s largest surrender, December 1941–February 1942.',
          wiki: { Jitra: 'Battle_of_Jitra', Kampar: 'Battle_of_Kampar', 'Slim River': 'Battle_of_Slim_River', Gemas: 'Battle_of_Gemas', Muar: 'Battle_of_Muar', Endau: 'Battle_off_Endau', Kranji: 'Battle_of_Kranji', 'Pasir Panjang': 'Battle_of_Pasir_Panjang', Buffalo: 'Brewster_F2A_Buffalo', Hudson: 'Lockheed_Hudson', Hudsons: 'Lockheed_Hudson', Blenheim: 'Bristol_Blenheim', Hurricane: 'Hawker_Hurricane', Hurricanes: 'Hawker_Hurricane', Walrus: 'Supermarine_Walrus', Express: 'HMS_Express_(H61)', Indomitable: 'HMS_Indomitable_(92)', Vildebeest: 'Vickers_Vildebeest' },
        },
        {
          id: 'coral-sea',
          title: 'The Battle of the Coral Sea',
          description: 'Operation Mo and the first battle between aircraft carriers, from the code-breakers’ warning and the Tulagi landing to the loss of Lexington and the turning back of the Port Moresby invasion, April–May 1942.',
          wiki: { Fletcher: 'Frank_Jack_Fletcher', Inoue: 'Shigeyoshi_Inoue', Fitch: 'Aubrey_Fitch', Crace: 'John_Gregory_Crace', Takagi: 'Takeo_Takagi', Hara: 'Chūichi_Hara', Gotō: 'Aritomo_Gotō', Shima: 'Kiyohide_Shima', Takahashi: 'Kakuichi_Takahashi', Sherman: 'Frederick_C._Sherman', Sims: 'USS_Sims_(DD-409)', Henley: 'USS_Henley_(DD-391)', Phelps: 'USS_Phelps', Kashima: 'Japanese_cruiser_Kashima' },
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
