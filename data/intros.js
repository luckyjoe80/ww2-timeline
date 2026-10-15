// Overview text for each timeline, shown in the panel while the timeline's overview is open.
// One or more paragraphs per timeline id; names are linked to Wikipedia through data/wiki.js.
// A timeline without an entry falls back to its catalog description.
window.WW2 = window.WW2 || {};
WW2.intros = {
  'road-to-pearl-harbor': [
    'The thirty years before the attack, told through the harbor and the ships that would be in it on 7 December 1941. It begins with Congress authorizing a naval station at Pearl Harbor in 1908 and follows the battleships Arizona, Oklahoma, Nevada, Pennsylvania, California, Maryland, Tennessee and West Virginia, and smaller ships such as Utah, Ward and Shaw, from keel-laying to commissioning and service.',
    'Along the way come the Washington Naval Treaty, the interwar cruises and modernizations, and the decisions of 1940–41 that kept the Pacific Fleet at Pearl Harbor under Kimmel, ending with the fleet in harbor on the last night of peace.',
  ],
  'attack-on-hawaii': [
    'The Japanese attack on Pearl Harbor, from the approval of the war plan in November 1941 to Nimitz taking command at the end of December. The first part follows the Kido Butai from Hitokappu Bay across the North Pacific, and the warnings in Hawaii that went unheeded.',
    'The morning of 7 December is told minute by minute: Ward’s first shots at a midget submarine, the Opana radar contact, the two waves over the airfields and Battleship Row, the losses of Arizona and Oklahoma, Nevada’s run for the channel, and Nagumo’s decision against a third strike. The aftermath covers martial law, the first Japanese prisoner and the relief of Kimmel and Short.',
  ],
  'pearl-harbor-to-guadalcanal': [
    'The fourteen months in which Japan swept across the Pacific and Southeast Asia and was then stopped. It opens with the attacks of 7–8 December 1941 on Pearl Harbor, Malaya, Hong Kong, Guam, Wake and the Philippines, and follows the fall of Singapore, the Dutch East Indies and Bataan.',
    'From May 1942 the tide begins to turn: the Battle of the Coral Sea saves Port Moresby, four Japanese carriers are sunk at Midway, and in August the Allies land on Guadalcanal. The timeline ends in February 1943 with Japan’s evacuation of the island and the fall of the Papuan beachheads. Most events link to the battle timelines that tell them in detail.',
  ],
  'road-to-tokyo-bay': [
    'The Allied counter-offensive, from the end of the Guadalcanal campaign in February 1943 to the surrender aboard USS Missouri in September 1945. It follows the two drives across the Pacific: MacArthur through New Guinea to the Philippines, and Nimitz through the Gilberts, Marshalls and Marianas to Iwo Jima and Okinawa, with Burma and Borneo alongside.',
    'The final weeks cover the firebombing of Tokyo, the Potsdam Declaration, Hiroshima and Nagasaki, the Soviet invasion of Manchuria and the Emperor’s broadcast. Most events link to the battle timelines that tell them in detail.',
  ],
  'pacific-submarines': [
    'The undersea war in the Pacific, on every side. American submarines strangle Japan’s shipping once the Mark 14 torpedo is fixed and the maru code is broken, and sink warships from Kongō to Shinano; Japanese submarines sink Wasp, Juneau, Liscome Bay and Indianapolis and shell the American west coast.',
    'Dutch, British, German and Italian boats appear too, along with the kaiten human torpedoes and the giant I-400. The timeline runs from the order for unrestricted submarine warfare on 7 December 1941 to Nimitz’s statement at Nuremberg in 1946.',
  ],
  'philippines-1941-42': [
    'The Japanese conquest of the Philippines. It opens hours after Pearl Harbor with MacArthur’s air force destroyed on the ground at Clark Field, then follows the landings in northern Luzon and at Lingayen Gulf and the withdrawal into the Bataan peninsula.',
    'Through the winter the American and Filipino defenders hold the Abucay and Pilar–Bagac lines while MacArthur leaves for Australia. Bataan falls on 9 April 1942 and the Death March follows; Corregidor surrenders on 6 May, and the southern islands soon after.',
  ],
  'malaya-singapore': [
    'Japan’s ten-week conquest of Malaya and Singapore. It begins with the landings at Kota Bharu and Singora on 8 December 1941 and the sinking of Prince of Wales and Repulse two days later, which leave the peninsula without naval protection.',
    'The British, Indian and Australian forces fall back through Jitra, Kampar, Slim River and Muar to Singapore island. The Japanese cross the Johore Strait on 8 February 1942, and on 15 February Percival surrenders at the Ford factory, the largest British surrender in history. The aftermath includes the Sook Ching massacres and Yamashita’s execution in 1946.',
  ],
  'java-sea': [
    'The Allied naval defence of the Dutch East Indies by the American, British, Dutch and Australian navies under ABDA. After the Balikpapan raid and the battle of Badung Strait, Doorman’s force meets the Japanese invasion fleet in the Java Sea on 27 February 1942, a battle told hour by hour.',
    'De Ruyter and Java are sunk with Doorman; Houston and Perth are lost in the Sunda Strait that night, and Exeter two days later. Java surrenders on 12 March.',
  ],
  'coral-sea': [
    'Operation Mo, Japan’s attempt to take Port Moresby by sea, and the first battle fought between aircraft carriers, in which neither fleet saw the other. Code-breakers warn of the plan, and Nimitz sends Lexington and Yorktown to meet Shōkaku and Zuikaku.',
    'After the Tulagi landing come two days of confused searches and strikes: Shōhō is sunk on 7 May 1942, and on 8 May Shōkaku is badly damaged and Lexington lost. The invasion convoy turns back, Port Moresby is saved, and two Japanese carriers miss Midway a month later.',
  ],
  'battle-of-midway': [
    'The battle that turned the Pacific war, from Yamamoto’s plan in April 1942 to the fleet’s secret return to Japan. American code-breakers learn that “AF” is Midway, and three American carriers wait northeast of the atoll for Nagumo’s four.',
    '4 June is told hour by hour: Midway’s planes attack, the torpedo squadrons are shot down, and dive bombers from Enterprise and Yorktown wreck Kaga, Akagi and Sōryū within minutes. Hiryū strikes back and cripples Yorktown before she too is sunk. The Aleutian landings at Attu and Kiska run alongside.',
  ],
  'kokoda-track': [
    'The fight for Papua in 1942. Japanese troops land near Gona in July and push over the Owen Stanley Range along the Kokoda Track toward Port Moresby, held back step by step by Australian militia and then AIF battalions at Kokoda, Isurava, Brigade Hill and Ioribaiwa.',
    'At the same time Japan’s landing at Milne Bay is defeated, its first defeat on land. The Australians then advance back over the mountains, retake Kokoda, and with American troops destroy the beachheads at Buna, Gona and Sanananda by January 1943.',
  ],
  'guadalcanal': [
    'The first Allied offensive of the Pacific war, from the Marine landings on 7 August 1942 to the island’s capture in February 1943. The struggle centres on Henderson Field, which Vandegrift’s Marines hold against the Ichiki attack at the Tenaru, Kawaguchi at the ridge, and the October offensive.',
    'At sea the battle is fought night after night in Ironbottom Sound: Savo Island, the Eastern Solomons, Cape Esperance, Santa Cruz, the Naval Battle of Guadalcanal and Tassafaronga. Japan finally evacuates its garrison in Operation Ke.',
  ],
  'tarawa': [
    'Operation Galvanic, the invasion of the Gilbert Islands in November 1943 and the first American landing against a heavily defended coral atoll. Shibazaki had made Betio a fortress, and on 20 November many landing craft hang up on the reef, leaving Marines to wade hundreds of yards under fire.',
    'The battle for Betio lasts 76 hours and is told hour by hour; Makin is taken at the same time, and the escort carrier Liscome Bay is sunk by a submarine. The costly lessons shape every landing that follows, starting with the Marshalls.',
  ],
  'imphal-kohima': [
    'Operation U-Go, Mutaguchi’s 1944 invasion of India, meant to take Imphal and the Allied base at Dimapur. The Japanese cross the Chindwin in March, cut off the 17th Indian Division at Tiddim and fight the paratroops at Sangshak before reaching Kohima.',
    'At Kohima a small garrison holds out until relieved, and the fighting across the tennis court lasts into May; around Imphal, Slim’s IV Corps is supplied by air. When the road is reopened on 22 June the Japanese army is starving, and its retreat to the Chindwin becomes one of its worst defeats of the war.',
  ],
  'saipan-philippine-sea': [
    'Operation Forager, the American invasion of the Marianas in June 1944. Marines land on Saipan on 15 June, and the Japanese Mobile Fleet comes out to fight, leading to the Battle of the Philippine Sea on 19–20 June.',
    'In the “Great Marianas Turkey Shoot” the Japanese carrier air groups are destroyed, and submarines and aircraft sink Taihō, Shōkaku and Hiyō. Ashore, the fighting climbs through Mount Tapotchau and Death Valley to the largest banzai charge of the war and the deaths of civilians at the northern cliffs. Saipan’s loss brings down Tōjō’s government and puts Tokyo within reach of the B-29s.',
  ],
  'leyte-gulf': [
    'The largest naval battle in history, fought around the American landings on Leyte in October 1944. Japan’s Shō-Gō plan sends its remaining battleships against the beachhead in three forces, while Ozawa’s carriers lure Halsey north.',
    'The battle is told hour by hour: submarines ambush Kurita’s Center Force, Musashi is sunk in the Sibuyan Sea, Nishimura’s force is destroyed in Surigao Strait, and Taffy 3’s escort carriers and destroyers hold off Kurita’s battleships off Samar. The first kamikazes strike, and the Imperial Japanese Navy never fights as a fleet again.',
  ],
  'kamikaze': [
    'Japan’s special attack units, from the first proposals for suicide tactics in 1944 to the last attacks after the surrender. Ōnishi forms the first units at Mabalacat in October 1944, and Seki’s unit sinks the escort carrier St. Lo off Samar.',
    'The attacks grow through the Philippines, Lingayen Gulf and Iwo Jima, and reach their height in the Kikusui mass raids off Okinawa, where radar picket destroyers and the fast carriers take the worst of them. The Ohka piloted bomb, the Kaiten human torpedo and the Shin’yō suicide boats appear alongside. It ends with Ugaki’s last flight and Ōnishi’s death in August 1945.',
  ],
  'iwo-jima': [
    'The battle for Iwo Jima, an island of eight square miles midway between the Marianas and Tokyo. Kuribayashi spends months turning it into a network of tunnels and hidden guns, while American aircraft and ships bombard it.',
    'Marines land on the black sand beaches on 19 February 1945. The flag is raised on Mount Suribachi on the fifth day, but the fighting through the Meat Grinder and the northern ridges lasts until 26 March and costs more American casualties than Japanese. The island becomes an emergency landing field for the B-29s.',
  ],
  'firebombing-of-japan': [
    'The B-29 campaign against Japan’s cities. It begins with raids from China in 1944 and continues from the Marianas from November, but high-altitude precision bombing achieves little against the jet stream and the clouds.',
    'In March 1945 LeMay switches to low-level night attacks with incendiaries, and the raid of 9–10 March, told hour by hour, burns out much of eastern Tokyo. Nagoya, Osaka, Kobe and Yokohama follow, then dozens of smaller cities, some warned in advance by leaflet, until the surrender in August.',
  ],
  'okinawa': [
    'Operation Iceberg, the last great battle of the Pacific war. The Tenth Army lands on Okinawa on 1 April 1945 against little opposition, because Ushijima has pulled his 32nd Army back to the Shuri Line in the south.',
    'There the fighting at Kakazu Ridge, Sugar Loaf Hill and Shuri Castle lasts into June, while the kamikaze attacks on the fleet offshore sink dozens of ships and Yamato is sunk on her last sortie. The battle lasts 82 days and kills a large share of Okinawa’s civilians, many in mass suicides; both Buckner and Ushijima die in its final week.',
  ],
  'atomic-bomb': [
    'The development and use of the atomic bomb, from the discovery of nuclear fission in Berlin in December 1938 to Japan’s surrender. Einstein’s letter to Roosevelt and the British MAUD report lead to the Manhattan Project under Groves and Oppenheimer.',
    'Fermi’s Chicago Pile-1 goes critical in 1942, and the plants at Oak Ridge and Hanford make the uranium and plutonium for Los Alamos to design the bombs. After the Trinity test in July 1945, Little Boy destroys Hiroshima on 6 August and Fat Man Nagasaki on 9 August.',
  ],
  'medal-of-honor': [
    'Every Medal of Honor awarded for action in the Second World War, at the place and on the date of the action, from Pearl Harbor to the last weeks of the war. Each event gives the recipient’s official citation.',
    'Use the legend to show one service at a time: Army, Navy, Marine Corps, Army Air Forces and Coast Guard.',
  ],
  'yamamoto': [
    'The life of Isoroku Yamamoto, the admiral who planned the attack on Pearl Harbor. Born in Nagaoka in 1884, he is wounded at Tsushima, studies at Harvard and serves in Washington, and becomes one of the Navy’s leading advocates of naval aviation.',
    'As commander of the Combined Fleet he argues against war with the United States, then plans its opening blow. After Midway and Guadalcanal, American code-breakers read his itinerary, and he is shot down over Bougainville in April 1943.',
  ],
  'yamato': [
    'The life of the battleship Yamato, the largest ever built, from her secret construction at Kure to her sinking on a one-way mission to Okinawa in April 1945, with her sister Musashi alongside.',
    'Yamato serves as Yamamoto’s flagship at Midway, is torpedoed by Skate and fires on American ships off Samar, but rarely meets the enemy. The later events follow her afterlife: the discovery of the wreck, a famous anime and a museum at Kure.',
  ],
  'codebreaking': [
    'The hidden contest of codes and ciphers on every front, from the closing of America’s Black Chamber in 1929 to the UKUSA Agreement of 1946. Polish mathematicians break the German Enigma and, weeks before the invasion of Poland, hand their methods to Britain and France. At Bletchley Park, Turing’s bombes and later Flowers’s Colossus computers produce Ultra, used at Matapan, in the desert, against the U-boats, off the North Cape and before D-Day.',
    'The other side is here too: the German B-Dienst reading British convoy ciphers, and Rommel’s “good source” in an American attaché’s code. Against Japan come PURPLE and MAGIC, the fourteen-part message, JN-25 and Station HYPO at Midway, the codebreakers in Australia, the merchant-shipping codes, Yamamoto’s last flight and the Navajo and Comanche code talkers, ending with the machines nobody broke, Typex and SIGABA.',
  ],
  'submarine-technology': [
    'The machines of the submarine war in every navy, from the loss of Squalus in May 1939 to President Truman’s dive in a captured Type XXI in November 1946. German Type VII and Type IX U-boats, American Gato and Balao fleet boats, British U-class boats and X-craft, Italian manned torpedoes, the Soviet S class and Japan’s midget submarines, Kaiten and giant aircraft-carrying I-400s each appear where they were built or first proved themselves.',
    'Alongside the boats run the weapons and the counter-measures against them: the German and American torpedo failures and how they were found and fixed, the electric and homing torpedoes, the snorkel and the fast Elektroboote, and on the hunters’ side ASDIC, the Leigh Light, Hedgehog, Squid and sonobuoys, ending with the captured boats studied and scuttled after the war.',
  ],
  'radar': [
    'The development of radar, from British tests in 1935 showing that radio echoes could reveal an approaching aircraft to the closing of MIT’s Radiation Laboratory at the end of 1945. Britain, Germany, the United States, the Soviet Union and Japan each build detection sets in secret: Chain Home, Freya and Würzburg, the US Navy’s CXAM. Then in 1940 comes the cavity magnetron, which makes precise centimetric radar possible; the Tizard Mission takes it to America, where it leads to the Radiation Laboratory.',
    'Radar then goes to war on every front: Chain Home and the Dowding system in the Battle of Britain, the contest of radar and countermeasure over Europe through the Bruneval raid, the Channel Dash, H2S, Window and Lichtenstein, and centimetric sets turning the Battle of the Atlantic against the U-boats. At night it decides sea battles off Cape Matapan, the North Cape, Guadalcanal and Surigao Strait. It closes with the proximity fuze, Japan’s late radar effort and the picket destroyers off Okinawa.',
  ],
};

// A line or two of atmosphere for each timeline, shown in italics above its overview.
WW2.flavor = {
  'road-to-pearl-harbor': 'Steel is laid down in Camden and Brooklyn and Newport News, and slides into the water to cheers. For thirty years the battleships cruise, refit and grow old together, until one Saturday evening they lie moored in pairs along Ford Island.',
  'attack-on-hawaii': 'Six carriers cross the empty winter ocean under radio silence. In Hawaii it is a quiet Sunday morning: bands are tuning up for morning colors, and a radar operator watches a blip grow larger.',
  'pearl-harbor-to-guadalcanal': 'For six months nothing seems able to stop Japan: fortresses fall, fleets vanish, and the map turns red from Burma to the Solomons. Then, at the far edge of the advance, on a jungle island no one has heard of, the tide begins to turn.',
  'road-to-tokyo-bay': 'Island by island, atoll by atoll, the Allies close on Japan, each landing bloodier than the last. The war ends in a fire no one had seen before, and on the deck of a battleship in Tokyo Bay.',
  'pacific-submarines': 'Beneath the surface, in the heat and the dark, the hunters wait. A periscope breaks the water for a few seconds, a spread of torpedoes runs, and somewhere above a ship breaks in two.',
  'philippines-1941-42': 'Hours after Pearl Harbor, the bombers find the B-17s lined up on the ground at Clark Field. What follows is four months of hunger, malaria and waiting for help that never comes, on a peninsula and a rock in Manila Bay.',
  'malaya-singapore': 'Bicycles and tanks pour down the roads of the peninsula faster than the defenders can fall back. Singapore, the fortress built to guard the East, lasts one week once the enemy is across the strait.',
  'java-sea': 'A scratch fleet of four navies, with no common codes and no air cover, steams out to meet the invasion. Through the afternoon and into the night the ships go down one by one.',
  'coral-sea': 'Two fleets hunt each other across a sea of rain squalls and false reports, never coming within sight. Their aircraft find the enemy, lose him, and sometimes try to land on his carriers by mistake.',
  'battle-of-midway': 'A broken code, a sighting report, and a long wait. Then, in a few minutes on the morning of 4 June, three Japanese carriers are burning, and the war in the Pacific has changed.',
  'kokoda-track': 'Mud to the knees, rain every afternoon, and a track that climbs and falls across the spine of New Guinea. Young militiamen and Japanese veterans fight for it ridge by ridge, until the lights of Port Moresby can be seen from the last one.',
  'guadalcanal': 'By day the Americans rule the skies; by night the Tokyo Express runs down the Slot. For six months, men fight over one muddy airstrip, and the sea off Savo fills with so many wrecks it becomes Ironbottom Sound.',
  'tarawa': 'The tide does not rise. The landing craft ground on the reef far from shore, and the Marines step into the water to wade in, under the guns, across the longest few hundred yards of the war.',
  'imphal-kohima': 'An army sets off across the mountains with three weeks of food, counting on capturing the rest. On a hill station in the Naga Hills, the two sides dig in across the deputy commissioner’s tennis court.',
  'saipan-philippine-sea': 'Out at sea, hundreds of Japanese aircraft fall from the sky in a single afternoon. Ashore, the battle for Saipan ends at the northern cliffs, where soldiers and civilians alike choose death rather than surrender.',
  'leyte-gulf': 'The last great fleets on earth converge on one gulf in the Philippines. Battleships fire across the dark in Surigao Strait, and off Samar a handful of destroyers turns to charge the largest battleship ever built.',
  'kamikaze': 'Young pilots write their last letters, drink a farewell cup and take off on missions they are not meant to return from. On the picket destroyers off Okinawa, crews learn to dread the sound of an aircraft engine.',
  'iwo-jima': 'Black volcanic sand that will not hold a foxhole, and an enemy who never shows himself. Above it all, a flag goes up on Mount Suribachi on the fifth day, and the fighting goes on for another month.',
  'firebombing-of-japan': 'The bombers come in low at night, a few thousand feet up, in a long stream. Below them the wooden cities burn, and the wind carries the fire faster than people can run.',
  'okinawa': 'The landing is unopposed, almost eerie. Then come the ridges and caves of the Shuri Line, the rain and mud of May, and the planes diving on the fleet offshore day after day.',
  'atomic-bomb': 'A finding in a Berlin laboratory, a letter to the President, and three years of secret cities behind barbed wire. Before dawn in the New Mexico desert, a light brighter than the sun.',
  'medal-of-honor': 'Ordinary men in extraordinary moments: a machine gun held on a ridge, a grenade smothered, a wounded friend carried through fire. Again and again the citations use the same words: “above and beyond the call of duty.”',
  'yamamoto': 'He knew America better than almost any Japanese officer, and warned against fighting it. Then he planned the attack that began the war, and became the enemy’s most wanted man.',
  'yamato': 'The largest battleship ever built, conceived in secret and launched behind screens. She rarely fires her great guns in anger, and sails on her last mission not expected to return.',
  'codebreaking': 'Behind blackout curtains in a Buckinghamshire hut, and in a basement at Pearl Harbor, tired people bend over columns of meaningless letters while the teleprinters chatter, waiting for one guessed word that will turn the noise into an enemy admiral’s orders.',
  'submarine-technology': 'A steel hull full of men and machinery, a few knots underwater and a battery running down. Above, the ping of an escort’s sonar grows louder, and everyone aboard is hoping the torpedoes in the tubes will run true.',
  'radar': 'In a darkened hut on the Suffolk coast, a line of green light trembles, and a small spike rising from it is an aircraft no one can see. Years later, on a black night at sea, an operator watches a sweeping trace paint the coastline, and the enemy fleet, long before any lookout can.',
};
