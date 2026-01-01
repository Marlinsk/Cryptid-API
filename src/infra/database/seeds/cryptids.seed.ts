import { db } from '../connection'
import { cryptids } from '../schemas/cryptids.schema'

export const cryptidSeedData: Array<typeof cryptids.$inferInsert> = [
  {
    "name": "Nessie",
    "aliases": [
      "Loch Ness Monster",
      "Ness",
      "Nessiteras rhombopteryx"
    ],
    "description": "Nessie is a legendary aquatic cryptid said to inhabit Loch Ness, a deep and murky freshwater lake in the Scottish Highlands. Reports describe a large, unknown creature capable of submerging for extended periods, surfacing briefly before vanishing without trace. Despite extensive scientific investigation, no definitive evidence has been found, reinforcing Nessie’s status as one of the most enduring cryptid legends in modern folklore.",
    "shortDescription": "A legendary aquatic cryptid reported in Loch Ness, Scotland.",
    "originSummary": "The earliest known account of Nessie dates back to the 6th century, recorded in the biography of Saint Columba. Modern interest surged in the early 20th century following a series of eyewitness reports and photographs, embedding Nessie firmly into global popular culture.",
    "physicalDescription": "Witnesses often describe a long, slender neck, a small head, and a bulky body, sometimes likened to extinct marine reptiles. Descriptions vary significantly, suggesting either misidentification or a creature rarely seen in full.",
    "behaviorNotes": "Nessie is generally regarded as non-aggressive and reclusive, avoiding prolonged surface exposure and showing no signs of territorial or predatory behavior toward humans.",
    "manifestationConditions": "Sightings typically occur during periods of calm water and low visibility, often involving brief surface disturbances or distant silhouettes.",
    "classificationId": 1,
    "status": "unconfirmed",
    "threatLevel": "low"
  },
  {
    "name": "Bigfoot",
    "aliases": [
      "Sasquatch"
    ],
    "description": "Bigfoot is a large, bipedal hominid cryptid reportedly inhabiting remote forested regions of North America. Sightings often involve fleeting visual encounters, unexplained vocalizations, and oversized footprints, suggesting an intelligent and elusive creature capable of avoiding sustained human contact.",
    "shortDescription": "A legendary humanoid cryptid said to roam dense forests and wilderness areas.",
    "originSummary": "Accounts of Bigfoot appear in Indigenous oral traditions long before modern reports emerged in the 20th century. Contemporary sightings have contributed to ongoing debate regarding the creature’s biological plausibility.",
    "physicalDescription": "Typically described as standing between 2 and 3 meters tall, covered in dark or reddish-brown hair, with broad shoulders and a muscular, ape-like physique.",
    "behaviorNotes": "Bigfoot is generally portrayed as cautious and reclusive, displaying curiosity toward human activity while actively avoiding direct confrontation.",
    "manifestationConditions": "Encounters are most frequently reported in dense forests, mountainous terrain, or national parks, often preceded by unusual sounds or disturbances.",
    "classificationId": 3,
    "status": "unconfirmed",
    "threatLevel": "medium"
  },
  {
    "name": "Mothman",
    "aliases": [
      "The Winged Apparition",
      "Point Pleasant Creature",
      "The Red-Eyed Watcher"
    ],
    "description": "Mothman is a winged humanoid cryptid most notably associated with a wave of sightings in the mid-1960s near Point Pleasant, West Virginia. Characterized by its imposing silhouette, immense wings, and luminous red eyes, the entity is consistently linked to intense psychological effects on witnesses, including fear, confusion, and a sense of imminent catastrophe. Unlike traditionally aggressive cryptids, Mothman is rarely described as directly hostile. Instead, it is widely interpreted as a harbinger, observer, or messenger connected to large-scale disasters, raising unresolved questions about whether it represents an extraterrestrial intelligence, an interdimensional entity, or a phenomenon rooted in collective human perception.",
    "shortDescription": "A winged humanoid cryptid associated with ominous sightings, psychological disturbance, and catastrophic events.",
    "originSummary": "The Mothman phenomenon originated between 1966 and 1967 following numerous eyewitness reports in the vicinity of the TNT Area, a former munitions site near Point Pleasant. Sightings escalated in frequency prior to the collapse of the Silver Bridge in December 1967, an event that resulted in multiple fatalities and permanently linked the entity to themes of prophecy and disaster within modern paranormal folklore. Since then, sporadic reports have emerged worldwide, suggesting the phenomenon may not be geographically isolated.",
    "physicalDescription": "Witnesses commonly describe Mothman as a tall, humanoid figure standing between two and three meters in height, with massive wings extending several meters across. The entity is often reported to lack visible arms, with wings appearing to emerge directly from its torso. Its most striking feature is a pair of large, glowing red eyes that reflect light intensely and are frequently cited as inducing paralysis, vertigo, or overwhelming dread. Surface details are often obscured by darkness or motion, contributing to uncertainty regarding its biological or mechanical nature.",
    "behaviorNotes": "Behavior attributed to Mothman is predominantly passive yet unsettling. The entity is frequently observed standing motionless, watching from elevated positions, or silently hovering. In some accounts, it is reported to pursue vehicles at high speeds without displaying overt aggression. Communication is absent, and interactions rarely extend beyond observation, reinforcing interpretations of Mothman as a watcher or sentinel rather than a predator.",
    "manifestationConditions": "Manifestations are most commonly reported during periods of social unrest, infrastructural vulnerability, or in proximity to abandoned industrial or military sites. Sightings often coincide with heightened emotional states, environmental anomalies, or subsequent large-scale accidents, leading to speculation that the phenomenon may be reactive to human activity or collective stress rather than purely random.",
    "classificationId": 5,
    "status": "unconfirmed",
    "threatLevel": "moderate"
  },
  {
    "name": "Chupacabra",
    "aliases": [
      "Goat Sucker",
      "El Chupacabras"
    ],
    "description": "The Chupacabra is a cryptid reported primarily in Latin America, infamous for livestock mutilations characterized by puncture wounds and drained blood. Descriptions vary widely, ranging from reptilian bipeds to hairless canine-like creatures, contributing to its ambiguous classification.",
    "shortDescription": "A cryptid blamed for livestock deaths involving unexplained blood loss.",
    "originSummary": "First reports emerged in Puerto Rico during the 1990s and rapidly spread across Central and South America. The legend evolved through media amplification and local testimonies.",
    "physicalDescription": "Physical descriptions vary: some depict a small, upright reptilian creature with spines along its back, while others describe a quadrupedal, hairless mammal resembling a canine.",
    "behaviorNotes": "The Chupacabra is portrayed as nocturnal, predatory, and opportunistic, targeting isolated livestock rather than humans.",
    "manifestationConditions": "Sightings and attacks are commonly reported in rural areas with limited lighting, often following unusual animal behavior or unexplained sounds.",
    "classificationId": 4,
    "status": "unconfirmed",
    "threatLevel": "high"
  },
  {
    "name": "Megalodon",
    "aliases": [
      "Otodus megalodon",
      "Giant Shark"
    ],
    "description": "Megalodon is theorized to be a living survivor of the prehistoric shark species Otodus megalodon, which officially went extinct millions of years ago. Cryptid reports suggest encounters with sharks of unprecedented size, often exceeding known biological limits of modern marine species.",
    "shortDescription": "A colossal prehistoric shark rumored to still exist in the depths of the ocean.",
    "originSummary": "The idea of a surviving megalodon emerged from anomalous sightings, unexplained bite marks on large marine animals, and deep-sea sonar readings that defy conventional explanations.",
    "physicalDescription": "Described as resembling a great white shark but vastly larger, with proportionally massive jaws and teeth capable of crushing bone. Estimated lengths range from 15 to over 20 meters in cryptid accounts.",
    "behaviorNotes": "Megalodon is believed to be a solitary apex predator, potentially inhabiting extreme depths or unexplored oceanic regions to avoid human detection.",
    "manifestationConditions": "Alleged encounters are associated with deep-sea environments, rarely near coastal areas, and often inferred indirectly rather than through direct observation.",
    "classificationId": 2,
    "status": "legendary",
    "threatLevel": "extreme"
  },
  {
    "name": "Kraken",
    "aliases": [
      "Giant Squid",
      "Sea Serpent of the North"
    ],
    "description": "The Kraken is a colossal aquatic cryptid described as a massive cephalopod-like entity dwelling in the deep ocean, primarily associated with the North Atlantic. Historical accounts portray it as a creature capable of dragging entire ships beneath the waves, causing sudden whirlpools and catastrophic maritime disasters. While modern science recognizes the existence of giant squids, the Kraken represents an exaggerated and mythologized interpretation that exceeds known biological limits.",
    "shortDescription": "A legendary deep-sea cryptid said to attack ships and emerge from the ocean depths.",
    "originSummary": "The Kraken originates from Scandinavian maritime folklore, particularly Norwegian and Icelandic seafaring traditions dating back to the Middle Ages. Early sailors described encounters with an immense sea creature whose size rivaled islands, often mistaking it for land before it submerged.",
    "physicalDescription": "Descriptions depict the Kraken as an enormous squid or octopus-like being with countless thick tentacles, capable of crushing ships with ease. Its body is said to be so vast that its surfacing alters sea levels locally, creating violent currents.",
    "behaviorNotes": "The Kraken is portrayed as highly territorial and reactive to maritime disturbances, attacking vessels either defensively or opportunistically. It is not depicted as malicious by intent, but as a force of nature responding to intrusion.",
    "manifestationConditions": "Manifestations are typically reported during severe weather, turbulent seas, or deep-ocean navigation routes, often coinciding with sudden mechanical failures or unexplained oceanic phenomena.",
    "classificationId": 1,
    "status": "legendary",
    "threatLevel": "extreme"
  },
  {
    "name": "Yeti",
    "aliases": [
      "Abominable Snowman",
      "Migoi",
      "Meh-Teh",
      "Kang Admi"
    ],
    "description": "The Yeti is a legendary humanoid cryptid associated with the high-altitude regions of the Himalayan mountain range. Reported across Nepal, Tibet, Bhutan, and surrounding areas, the Yeti is deeply embedded in local folklore and oral traditions. Descriptions of the creature span centuries and often combine physical sightings with spiritual or symbolic interpretations, positioning the Yeti at the intersection of cultural myth, unexplained biological reports, and environmental storytelling.",
    "shortDescription": "A legendary alpine humanoid cryptid rooted in Himalayan folklore and unexplained expedition accounts.",
    "originSummary": "The earliest accounts of the Yeti originate from indigenous Himalayan cultures, particularly Sherpa and Tibetan communities, where it is referenced under multiple regional names. In these traditions, the Yeti is not always portrayed as a monster, but sometimes as a guardian spirit, mountain dweller, or manifestation of the wilderness itself. Western awareness of the Yeti increased during 19th and 20th century expeditions to the Himalayas, when climbers reported large footprints, distant sightings, and unexplained sounds.",
    "physicalDescription": "The Yeti is commonly described as a tall, powerfully built, bipedal humanoid standing between two and three meters in height. Its body is covered in dense fur ranging in color from white to reddish-brown or dark gray, providing insulation against extreme cold. Reported features include a pronounced brow ridge, broad chest, long arms, and exceptionally large feet, often cited as evidence due to recurring footprint discoveries in snow.",
    "behaviorNotes": "Behavioral descriptions consistently emphasize the Yeti’s reclusive and elusive nature. It is rarely reported in groups and is believed to avoid prolonged contact with humans. Some accounts suggest territorial behavior, while others describe passive observation from a distance. In local narratives, the Yeti is sometimes attributed with intelligence and awareness rather than purely animalistic behavior.",
    "manifestationConditions": "Sightings and encounters are most frequently reported in remote alpine zones, particularly above established tree lines and far from permanent human settlements. Manifestations are often linked to extreme environmental conditions such as heavy snowfall, avalanches, or periods of limited visibility during expeditions. Reports commonly occur during early morning or twilight hours.",
    "classificationId": 6,
    "status": "unconfirmed",
    "threatLevel": "medium"
  },
  {
    "name": "Gargula",
    "aliases": [
      "Gargoyle of Los Angeles",
      "Flying Reptilian Humanoid"
    ],
    "description": "Gargula is a winged cryptid reported in the Los Angeles area during the late 1980s, often described as a gargoyle-like humanoid with reptilian and bat-like characteristics. Unlike folkloric gargoyles rooted in medieval architecture, Gargula is considered a modern urban cryptid, blending elements of gothic imagery with contemporary eyewitness accounts.",
    "shortDescription": "A winged, gargoyle-like humanoid reported in urban environments.",
    "originSummary": "Reports of Gargula surfaced primarily in the late 1980s in Los Angeles, California. Witnesses described encounters with a large, winged creature perched on rooftops or seen flying between buildings at night. The sightings emerged in a densely populated metropolitan context, distinguishing Gargula from cryptids associated with remote or wilderness regions.",
    "physicalDescription": "Gargula is typically described as a muscular humanoid with leathery wings, clawed hands and feet, and a reptilian or stone-textured appearance. Some accounts suggest its skin appears rigid or rough, evoking carved stone, while others describe a more organic, scaled surface. Its facial features are often reported as angular, with pronounced brow ridges and glowing or reflective eyes.",
    "behaviorNotes": "Behavioral reports portray Gargula as primarily nocturnal and highly territorial. Sightings often involve the creature observing from elevated positions, emitting screeching or growling sounds, and engaging in short, aggressive flight patterns. While direct attacks are rarely reported, its presence is consistently described as intimidating.",
    "manifestationConditions": "Encounters are most frequently reported at night in urban or suburban environments, particularly near tall buildings, rooftops, or abandoned structures. Low light conditions, isolation, and elevated vantage points are recurring factors in reported manifestations.",
    "classificationId": 8,
    "status": "unconfirmed",
    "threatLevel": "medium"
  },
  {
    "name": "Jersey Devil",
    "aliases": [
      "Devil of the Pines",
      "Leeds Devil",
      "Demônio de Jersey"
    ],
    "description": "The Jersey Devil is a legendary cryptid reported primarily in the Pine Barrens region of New Jersey, United States. Described as a bizarre hybrid creature, it has been the subject of eyewitness accounts, folklore, and media coverage for over three centuries. The entity occupies a unique space between folklore and modern paranormal reporting, maintaining cultural relevance through recurring sightings and regional narratives.",
    "shortDescription": "A winged, horse-headed humanoid cryptid associated with the Pine Barrens of New Jersey.",
    "originSummary": "The origin of the Jersey Devil is commonly traced to colonial-era folklore, particularly the legend of the Leeds family in the early 18th century. According to tradition, the creature was born under ominous circumstances and fled into the Pine Barrens, where it has allegedly persisted through generations of sightings and reports.",
    "physicalDescription": "Witnesses typically describe the Jersey Devil as a bipedal creature with the head of a horse or goat, leathery bat-like wings, clawed limbs, and glowing eyes. Its body structure is often reported as emaciated or malformed, contributing to its unsettling appearance.",
    "behaviorNotes": "Behavioral reports characterize the Jersey Devil as elusive and territorial. It is frequently associated with piercing screams, nocturnal movement, and sudden appearances followed by rapid disappearance. While encounters are described as frightening, direct attacks on humans are rare and largely anecdotal.",
    "manifestationConditions": "Sightings are most commonly reported in dense forested areas, particularly during nighttime hours or periods of low visibility. Reports often coincide with isolated locations, heightened environmental silence, or historical sites tied to regional folklore.",
    "classificationId": 5,
    "status": "unverified",
    "threatLevel": "medium"
  },
  {
    "name": "Batsquatch",
    "aliases": [
      "Pacific Northwest Bat Beast",
      "Mount St. Helens Creature",
      "Bat Ape"
    ],
    "description": "The Batsquatch is a winged humanoid cryptid reportedly sighted in the Pacific Northwest region of the United States, particularly in Washington State. It is most commonly associated with the area surrounding Mount St. Helens and gained notoriety following reports that emerged after the volcanic eruption of 1980. The creature combines simian and chiropteran characteristics, placing it among hybrid cryptids that blur the line between mammalian archetypes and aerial entities.",
    "shortDescription": "A winged humanoid cryptid reported in the Pacific Northwest, often linked to volcanic and forested regions.",
    "originSummary": "The first widespread reports of the Batsquatch surfaced in the early 1980s, shortly after the eruption of Mount St. Helens. Witnesses described encounters with a large, winged creature exhibiting ape-like features near forested and mountainous terrain. While not rooted in ancient folklore to the same extent as other cryptids, the Batsquatch emerged as a modern legend shaped by environmental upheaval, regional storytelling, and media amplification.",
    "physicalDescription": "The Batsquatch is typically described as a large, muscular humanoid standing between two and three meters tall. It possesses broad, leathery wings resembling those of a bat, often reported with a wingspan exceeding three meters. The body is covered in dark fur or coarse hair, with glowing or reflective eyes frequently noted in nighttime sightings. Facial features are said to resemble those of an ape or primate, sometimes accompanied by sharp teeth or clawed hands.",
    "behaviorNotes": "Reported behavior suggests a highly territorial and aggressive entity. Witness accounts often describe sudden aerial movements, loud screeching vocalizations, and threatening gestures such as swooping or wing displays. Unlike many cryptids characterized by avoidance, the Batsquatch is frequently portrayed as confrontational, particularly when encountered near its reported habitat.",
    "manifestationConditions": "Sightings are most commonly reported in dense forests, mountainous regions, and areas affected by volcanic activity. Many encounters occur during nighttime or low-light conditions, often accompanied by strong smells, unusual sounds, or feelings of disorientation. Volcanic zones and periods of environmental instability are recurring contextual elements in reports.",
    "classificationId": 7,
    "status": "unconfirmed",
    "threatLevel": "high"
  },
  {
    "name": "Holadeira",
    "aliases": [
      "Holadeira",
      "Sawtooth Dolphin",
      "Razorback Dolphin"
    ],
    "description": "The Holadeira is an aquatic cryptid reported from an unnamed lake in the Amazon basin of Brazil. Reported first in 1993 and again in 1994, eyewitness accounts describe an unusual river dolphin-like creature with a saw-like, serrated dorsal profile. While some observers speculated about connections to prehistoric or unknown aquatic species, later analysis suggests the cryptid may represent an injured individual or a misidentified known species, though the mystery remains significant in cryptozoological circles.",
    "shortDescription": "An Amazon Basin aquatic cryptid reportedly seen with a saw-like back.",
    "originSummary": "Reports of the Holadeira originated in the early 1990s when adventurer and fisherman Jeremy Wade encountered a strange aquatic animal in a lake within the Brazilian Amazon basin. Local inhabitants were unfamiliar with the creature, which was photographed with a serrated dorsal feature. The name \"Holadeira\" is said to evoke the Portuguese word for saw, referencing the notched appearance observed by witnesses. The creature has been featured in cryptozoology literature and debated by researchers.",
    "physicalDescription": "Eyewitnesses described a brown-bodied freshwater dolphin-like organism featuring a series of triangular, saw-like dorsal projections or fin shapes. Some interpretations likened its silhouette to prehistoric reptiles like Spinosaurus or Stegosaurus, though these are speculative and artistic comparisons rather than biological assessments. Photographs taken during field observations show a creature appearing superficially dolphin-like but with distinct back features that prompted cryptozoological interest.",
    "behaviorNotes": "Behavioral observations are limited to brief sightings during expeditions in the Amazon basin. The Holadeira was seen surfacing momentarily before disappearing beneath the water, consistent with aquatic mammal movement. Later reports and analyses suggest that the perceived anomalous features may result from injury, deformation, or sampling of a known species rather than a distinct cryptid population.",
    "manifestationConditions": "Sightings are primarily recorded in calm conditions on a freshwater lake in the Amazon basin. Encounters generally occur at short distances from a fishing vessel but are fleeting, with the creature submerging quickly after being observed. Environmental conditions such as water clarity, low light, and isolation from major urban centers contribute to the difficulty of repeated documentation.",
    "classificationId": 1,
    "status": "unverified",
    "threatLevel": "low"
  },
  {
    "name": "Beast of Gévaudan",
    "aliases": [
      "Gévaudan Beast",
      "La Bête du Gévaudan"
    ],
    "description": "A mysterious predatory creature (or group of creatures) believed to have been responsible for a series of violent attacks against humans in the Gévaudan region of France between 1764 and 1767, blending historical reports and folklore.",
    "shortDescription": "Historic man-eating cryptid from 18th century France, feared for its ferocity and enigmatic true nature.",
    "originSummary": "The Beast of Gévaudan is associated with over 60 confirmed fatalities from attacks between 1764 and 1767 in rural France, widely discussed in historical accounts and cryptozoological lore but without a definitive scientific explanation.",
    "physicalDescription": "Eyewitness reports describe a large, wolf-like quadruped with formidable teeth and an unusually long tail, with varied coloration ranging from russet to patchy patterns.",
    "behaviorNotes": "The Beast was described as aggressive, unusually bold around humans, capable of swift, powerful attacks on livestock and people. Some accounts suggest it could move swiftly across rugged terrain and survive multiple confrontations.",
    "manifestationConditions": "The Beast was reportedly first encountered in June 1764 and continued its attacks in forested and rural areas of Gévaudan. Sightings and attacks were most frequent in open fields, woods, and pastures.",
    "classificationId": 9,
    "status": "legendary",
    "threatLevel": "high"
  },
  {
    "name": "Dover Demon",
    "aliases": [
      "Dover Demon"
    ],
    "description": "The Demon of Dover is an enigmatic cryptid reported through a limited series of eyewitness accounts describing a pale, humanoid figure with disproportionate features and an unsettling presence. The entity’s appearance—marked by oversized luminous eyes, elongated limbs, and a near-featureless face—has led to persistent speculation regarding its true nature. While some interpretations frame it as an anomalous terrestrial humanoid, others question whether it represents an extraterrestrial observer, an interdimensional manifestation, or a localized phenomenon beyond conventional biological explanation. The absence of recurring sightings, physical evidence, or discernible intent reinforces its status as a deeply ambiguous entity that defies clear classification.",
    "shortDescription": "A mysterious pale humanoid cryptid whose brief sightings raise questions about extraterrestrial or non-human origins.",
    "originSummary": "The entity was reported in the town of Dover, Massachusetts, during a brief period in the late 1970s. Multiple witnesses described encounters on separate nights, often under similar environmental conditions, suggesting a localized and temporally constrained phenomenon rather than an ongoing presence.",
    "physicalDescription": "Witness accounts consistently describe smooth, pale or peach-toned skin, a small or indistinct mouth, an enlarged cranium, and disproportionately large, glowing eyes. The limbs—particularly the arms and fingers—are described as elongated and thin, contributing to an appearance that many observers found profoundly unnatural or unsettling.",
    "behaviorNotes": "The entity exhibited silent, cautious, and evasive behavior. It was observed clinging to walls, crouching on ledges, or moving with deliberate, almost mechanical precision before vanishing from sight. No aggressive actions or direct interactions were reported.",
    "manifestationConditions": "Sightings occurred at night in low-light suburban or semi-rural settings, typically during moments of isolation and brief visual exposure. The entity was never observed for extended periods, reinforcing its transient and elusive nature.",
    "classificationId": 12,
    "status": "unconfirmed",
    "threatLevel": "low"
  },
  {
    "name": "Jackalope",
    "aliases": [
      "Antlered Jackrabbit",
      "Horned Hare"
    ],
    "description": "The Jackalope is a folkloric cryptid originating from North American frontier legends, described as a jackrabbit with antelope-like horns or antlers. Often presented with a humorous or tall-tale tone, the Jackalope occupies a liminal space between myth, satire, and cultural folklore.",
    "shortDescription": "A horned rabbit-like creature rooted in North American folk traditions.",
    "originSummary": "The legend emerged in the early 20th century in the American Midwest, particularly Wyoming, where it became popular through storytelling, taxidermy hoaxes, and roadside attractions.",
    "physicalDescription": "Described as resembling a large jackrabbit with a pair of curved antlers or horns protruding from its skull, blending mammalian and ungulate features.",
    "behaviorNotes": "Jackalopes are portrayed as elusive and quick, often mimicking human voices or singing at night in exaggerated folklore accounts.",
    "manifestationConditions": "Sightings are typically reported in rural or desert environments, frequently tied to storytelling traditions, local festivals, or intentional hoaxes.",
    "classificationId": 4,
    "status": "folklore",
    "threatLevel": "low"
  },
  {
    "name": "Phantom Cats",
    "aliases": [
      "Alien Big Cats",
      "Black Panthers",
      "Mystery Cats"
    ],
    "description": "Phantom Cats refer to reports of large, unidentified felines observed in regions where no known big cat species are officially recognized. Sightings often describe panther-like animals exhibiting stealthy behavior and physical traits inconsistent with native wildlife.",
    "shortDescription": "Unidentified large felines reported across rural and wild regions, often resembling oversized cats or black panthers.",
    "originSummary": "Reports of Phantom Cats date back several centuries and occur globally, particularly in Europe, North America, and isolated rural landscapes. Explanations range from misidentified wildlife to escaped exotic animals or undocumented species.",
    "physicalDescription": "Witnesses commonly describe large, muscular cats with long tails, low stalking posture, reflective eyes, and dark or shadowy fur, frequently compared to panthers or pumas.",
    "behaviorNotes": "Phantom Cats are described as elusive, nocturnal, and highly territorial. Most reports emphasize avoidance of humans, though livestock predation and rare aggressive encounters are occasionally cited.",
    "manifestationConditions": "Sightings are most frequently reported in wooded areas, farmland, moorlands, and remote countryside, often during dusk or nighttime, with tracks or livestock disturbances serving as secondary evidence.",
    "classificationId": 10,
    "status": "unverified",
    "threatLevel": "medium"
  },
  {
    "name": "Wendigo",
    "aliases": [
      "Windigo",
      "Weendigo",
      "Witiko"
    ],
    "description": "The Wendigo is a cryptid deeply rooted in Indigenous folklore of North America, described as a malevolent presence associated with insatiable hunger, isolation, and moral transgression. Often portrayed as both a creature and a corrupting force, the Wendigo blurs the boundary between physical entity and metaphysical phenomenon. Some interpretations describe it as a transformed human, while others suggest it is a non-corporeal intelligence capable of possessing individuals, influencing behavior, or manifesting temporarily under extreme conditions. Its nature raises persistent questions as to whether the Wendigo represents a supernatural predator, a cultural embodiment of taboo and survival trauma, or an external entity that exploits human vulnerability.",
    "shortDescription": "A cryptid associated with possession, transformation, and insatiable hunger, existing between entity and curse.",
    "originSummary": "The Wendigo originates from Algonquian-speaking cultures, with accounts often emerging from forested regions of North America marked by harsh winters and isolation. Stories frequently involve individuals who, under extreme desperation, commit acts that trigger the Wendigo’s influence or transformation.",
    "physicalDescription": "Descriptions vary widely, ranging from emaciated humanoid figures with elongated limbs and glowing eyes to skeletal forms stretched unnaturally thin, sometimes incorporating animalistic features such as antlers or exposed bone. In many accounts, its physical form appears unstable or inconsistent, reinforcing uncertainty about whether it possesses a fixed biological structure.",
    "behaviorNotes": "The Wendigo is described as predatory, highly intelligent, and driven by compulsive hunger. It is often said to stalk isolated individuals, mimic human behavior, or manipulate fear and paranoia. Some accounts emphasize psychological influence over direct physical confrontation.",
    "manifestationConditions": "Manifestations are commonly linked to extreme cold, prolonged isolation, famine, or psychological stress. The entity is rarely observed directly and is often inferred through behavioral changes, disappearances, or indirect signs rather than sustained sightings.",
    "classificationId": 13,
    "status": "legendary",
    "threatLevel": "extreme"
  },
  {
    "name": "Chuchunya",
    "aliases": [
      "Chuchunaa",
      "Yakut Wildman"
    ],
    "description": "The Chuchunya is a cryptid reported primarily in the remote tundra and taiga regions of Siberia, particularly within Yakut and Evenki folklore. Described as a humanoid presence adapted to extreme cold, the Chuchunya occupies an uncertain space between an undiscovered hominid, a feral offshoot of humanity, and a non-human entity shaped by isolation and environment. Accounts frequently emphasize its intelligence, avoidance of direct contact, and behaviors that suggest awareness rather than animal instinct. Some narratives raise the unsettling possibility that the Chuchunya is not a biological species at all, but an entity that mimics humanoid form to navigate or survive within human-adjacent spaces.",
    "shortDescription": "A pale humanoid cryptid associated with Arctic isolation, extreme cold, and elusive intelligence.",
    "originSummary": "Reports of the Chuchunya originate from Indigenous Siberian cultures and later accounts by hunters, explorers, and researchers traversing isolated northern territories. Sightings often occur in sparsely populated regions marked by severe climate conditions and limited human infrastructure.",
    "physicalDescription": "Witness descriptions commonly portray the Chuchunya as a tall, thin humanoid with pale or greyish skin, minimal body hair, and elongated limbs. Facial features are often described as flattened or indistinct, with dark or deeply set eyes. Clothing is rarely observed, reinforcing uncertainty over whether the entity is a biological organism or something imitating human anatomy.",
    "behaviorNotes": "The Chuchunya is consistently described as elusive, cautious, and observant. It appears to avoid confrontation, preferring to monitor humans from a distance. Some accounts suggest tool use or structured movement patterns, implying a level of cognition inconsistent with known wildlife.",
    "manifestationConditions": "Manifestations are typically reported in extreme cold environments, often during periods of prolonged isolation or travel through remote tundra. Encounters are brief and ambiguous, with the entity disappearing before clear identification can occur.",
    "classificationId": 12,
    "status": "unconfirmed",
    "threatLevel": "moderate"
  },
  {
    "name": "Leshy",
    "aliases": [
      "Lesovik",
      "Lesnik",
      "Forest Guardian",
      "Lord of the Woods"
    ],
    "description": "The Leshy is a forest-bound entity originating from Slavic folklore, described as an enigmatic presence intrinsically linked to the identity, balance, and will of woodland environments. Rather than a discrete biological creature, the Leshy is often perceived as a manifestation of the forest itself — an intelligence that observes, reacts, and intervenes when its domain is disturbed. Reports oscillate between depicting the Leshy as a trickster spirit, a territorial guardian, or an entirely non-human consciousness whose motives remain fundamentally alien. This ambiguity has led to enduring speculation as to whether the Leshy represents a supernatural being, a cultural abstraction of ecological forces, or an unknown entity adapted to exist alongside human perception.",
    "shortDescription": "A mysterious forest entity associated with deception, guardianship, and the sentient aspects of wilderness.",
    "originSummary": "The Leshy emerges from Slavic oral traditions and rural mythologies, where it functioned as both an explanatory figure for unexplained disappearances and a moral construct reinforcing respect for forests. Historically, it was believed to inhabit deep woodlands, acting as a mediator between humans and the natural world. Tales of the Leshy were commonly invoked to explain sudden disorientation, lost paths, altered perception, or encounters with something that mimicked humanity but was unmistakably not human.",
    "physicalDescription": "Descriptions of the Leshy are highly inconsistent, reinforcing its reputation as a shape-altering entity. It is frequently portrayed as a tall humanoid figure with elongated limbs, bark-like skin, and hair composed of moss, leaves, or grass. In some accounts, its eyes glow faintly in low light, while others describe animalistic features such as hooves, antlers, or an asymmetrical gait. The Leshy is also said to manipulate its size, appearing towering in dense forests and shrinking when approaching human settlements, further blurring the line between physical form and environmental illusion.",
    "behaviorNotes": "Behavior attributed to the Leshy varies significantly depending on the circumstances of an encounter. It is commonly reported to mislead travelers by altering paths, mimicking familiar voices, or creating auditory hallucinations such as laughter or footsteps. However, individuals who demonstrate respect toward the forest are sometimes guided safely or left undisturbed. Aggressive behavior is rare but not absent, typically manifesting as prolonged psychological disorientation rather than direct physical harm.",
    "manifestationConditions": "Manifestations are most frequently reported in dense, old-growth forests, particularly during dusk, dawn, or periods of environmental disruption such as storms or logging activity. Encounters often coincide with feelings of being watched, sudden silence in surrounding wildlife, loss of directional sense, or temporal distortion. Reports suggest that the Leshy does not appear randomly but responds to intrusion, imbalance, or disrespect within its territory.",
    "classificationId": 4,
    "status": "legendary",
    "threatLevel": "contextual"
  },
  {
    "name": "Beast of Bears",
    "aliases": [
      "Bear Beast",
      "Swamp Bear",
      "Red-Eyed Bear"
    ],
    "description": "The Beast of Bears is a large, bear-like cryptid reported across the southeastern United States, especially in southern Texas, Florida, and Virginia, with sporadic accounts extending into Arkansas. Witnesses commonly describe it as resembling an oversized bear with extensive scarring, missing patches of fur, and a distinctively pungent odor likened to alcohol and rotten eggs. Observers have reported its glowing red eyes and behavior that suggests both terrestrial and aquatic adaptations, fuelling speculation that it defies straightforward biological classification. Some theories even propose that the creature possesses features such as gills or other modifications suited to swampy environments. The Beast of Bears remains an enduring enigma: its presence is marked by physical evidence in eyewitness testimony, but without conclusive scientific verification.",
    "shortDescription": "A mysterious bear-like cryptid with patchy fur, scars, pungent odor, and unsettling red eyes.",
    "originSummary": "First reported on October 12, 1973, near a camping site in Alice, Texas, the Beast of Bears has been sighted intermittently over decades in dense woods and marshes of the southeastern United States. Accounts vary in detail, but collectively they suggest a persistent, elusive presence that resists simple explanation. Inuit narratives also reference enormous bears dragging individuals underwater, adding layers of cross-cultural mystery to the phenomenon.",
    "physicalDescription": "Observers describe the Beast of Bears as a massive, muscular creature reaching sizes beyond those of known bear species. Its coat is often described as patchy or matted, with scars and bare skin visible. The creature’s eyes are frequently reported as glowing red or reflective in low light. Some accounts include descriptions of disproportionately long claws or webbing that may facilitate swimming, though such details are highly inconsistent.",
    "behaviorNotes": "The Beast of Bears is described as elusive and wary of human presence, though it has been implicated in disappearances and livestock predation in local folklore. Its odor—reported as a strong mix of alcohol and sulfur—often precedes sightings, and its behavior is sometimes associated with stealthy movements near water and woodland edges. Some witnesses report prolonged observation, while others describe fleeting glimpses that leave the creature’s intent ambiguous.",
    "manifestationConditions": "Sightings most often occur in swampy, marshland, and dense forest environments, particularly near watercourses or wetlands. Reports tend to cluster around dusk or nighttime, though daytime sightings have been recorded. In some accounts, the creature appears near human habitation, only to retreat swiftly into cover.",
    "classificationId": 10,
    "status": "unconfirmed",
    "threatLevel": "high"
  },
  {
    "name": "Thunderbird",
    "aliases": [
      "Wakinyan",
      "Animikii",
      "Big Sky Bird",
      "Storm Eagle"
    ],
    "description": "The Thunderbird is a legendary airborne cryptid associated with enormous birds of prey reported in Indigenous North American oral traditions and modern cryptozoological sightings. Described as a colossal avian entity with wings so vast that the thunderous sound of its flight resonates like storms across the sky, the Thunderbird occupies an ambiguous space between myth, cultural interpretation, and potential undiscovered megafauna. Some narratives portray it as a benevolent guardian of natural balance, while others associate its appearance with ominous portent or catastrophic events. Modern cryptozoologists compare Thunderbird accounts with sightings of unusually large birds or unverified pterosaur-like creatures, feeding debate over whether this entity is biological, spiritual, or a convergence of human perception and environmental phenomena.",
    "shortDescription": "A massive airborne cryptid linked to storms, Indigenous lore, and mysterious sightings of giant winged creatures across North America.",
    "originSummary": "The Thunderbird legend has roots in diverse Indigenous traditions from the Pacific Northwest, Great Lakes, Plains, and Northeast regions, where enormous bird-like creatures feature in narratives explaining thunder, lightning, and weather phenomena. Historically, tribal stories described Thunderbirds as powerful sky beings capable of battling underwater spirits or bringing rain, thunder, and lightning to the earth. With westward expansion and settler accounts, sightings of outsized birds in remote areas of the United States and Canada have been woven into modern cryptid lore, blending ancient myth with contemporary mystery.",
    "physicalDescription": "Witnesses and storytellers depict the Thunderbird as possessing an immense wingspan, reported in some accounts to exceed twenty feet or more, dwarfing the largest known living birds. Its plumage is variably described, often dark or iridescent, with powerful aerodynamic structure and reflective eyes. Some sightings liken the creature to giant eagles or condor-like birds, while alternative accounts suggest reptilian or pterosaur-like features, such as membranous wings or elongated beaks, adding to the uncertainty of its physical nature.",
    "behaviorNotes": "Behavior attributed to the Thunderbird ranges from silent, high-altitude soaring to dramatic aerial displays that coincide with storm activity. In folklore, its wingbeats are said to generate thunder, and its gaze or movement can herald significant environmental change. Modern reports often describe fleeting sightings, rapid flight across open skies, or silent observation from high vantage points. Encounters rarely involve direct aggression toward humans, but some historical narratives and sporadic modern accounts include aggressive interactions with livestock or brief aerial pursuits.",
    "manifestationConditions": "Thunderbird sightings are most frequently reported over expansive wilderness areas, mountainous regions, and open plains from Alaska and northern Canada to the central United States and into Mexico and Central America. Many reports occur near weather events, soaring thermals, or in areas where local lore intersects with contemporary eyewitness accounts. The creature is often associated with dramatic natural backdrops, such as storm fronts or high ridgelines, reinforcing its link to atmospheric phenomena.",
    "classificationId": 5,
    "status": "unconfirmed",
    "threatLevel": "high"
  },
  {
    "name": "Agta",
    "aliases": [
      "Pygmy Tiger",
      "Agta Tiger",
      "Forest Strider"
    ],
    "description": "The Agta is a cryptid reported in the forests of the Philippines, described as a primitive yet predatory bipedal or ambush-capable creature that shares superficial resemblance with a large, striped animal but exhibits distinctly anomalous physical traits. Accounts vary from descriptions akin to a large feline to humanoid forms with elongated limbs or gait anomalies. Its existence remains unverified, blending folklore, indigenous accounts, and sporadic modern sightings into a persistent mystery that challenges simple biological categorization.",
    "shortDescription": "A mysterious forest cryptid from the Philippines with tiger-like markings, unusual gait, and ambiguous physical attributes.",
    "originSummary": "The legend of the Agta originates among indigenous tribes and rural communities of the Philippine archipelago, where dense, mountainous forests and deep vegetation foster abundant wildlife and deep cultural narratives about both predatory animals and spirit beings. Sightings of the Agta have appeared intermittently over decades, often emerging from regions where human access is limited and large predators are rare or nonexistent.",
    "physicalDescription": "Descriptions of the Agta’s physical appearance vary widely. Some witnesses describe an entity with **tiger-like stripes** and powerful limbs adapted for ambush, while others describe more **primitive or humanoid proportions**, including longer arms, digitigrade gait, or an upright stance. Eyes are often reported as reflective or unusually shaped, reinforcing the sense that the creature does not match known mammals. Fur coverage ranges from patchy to thick, with coloration suggestive of camouflage rather than display.",
    "behaviorNotes": "Behavior attributed to the Agta encompasses elusive stalking, sudden appearances near forest edges, and tendencies to vanish quickly when approached. Unlike ordinary predators, some reports describe the creature as observing from elevated perches, moving silently despite its size, or exhibiting an awareness of human presence beyond simple caution. Livestock deaths and unexplained tracks have been linked in anecdotal reports, though physical evidence remains sparse.",
    "manifestationConditions": "Manifestations of the Agta are most often cited in deep forest regions, highland slopes, and areas with dense canopies and thick underbrush. Sightings tend to occur at dawn or dusk, when shadows and light interplay complicate visual perception. Reports increase during seasons of heavy rainfall or when natural prey scarcity intersects with human intrusion into wild habitats.",
    "classificationId": 10,
    "status": "unconfirmed",
    "threatLevel": "high"
  },
  {
    "name": "Basilosaurus",
    "aliases": [
      "King Lizard",
      "Sea Serpent of Antiquity",
      "Ancestral Leviathan"
    ],
    "description": "The Basilosaurus is a cryptid interpreted as the possible survival or misidentification of an ancient prehistoric marine entity, traditionally classified as an extinct Eocene cetacean. While officially recognized by paleontology as extinct, anomalous maritime reports describe massive serpentine or eel-like creatures bearing resemblance to reconstructed Basilosaurus morphology. These accounts raise speculative questions regarding deep-ocean survival, undiscovered abyssal ecosystems, or misclassified encounters with unknown megafauna.",
    "shortDescription": "A legendary prehistoric marine entity believed by some to have survived extinction in the depths of the world’s oceans.",
    "originSummary": "The Basilosaurus was first identified through fossil discoveries in the 19th century, initially mistaken for a giant marine reptile due to its elongated, serpentine body. Although science classifies it as an extinct early whale, cryptozoological narratives suggest that similar creatures may still inhabit deep or unexplored oceanic regions. Sightings of enormous, snake-like marine beings reported throughout maritime history are often retrospectively linked to Basilosaurus-like forms.",
    "physicalDescription": "Witness descriptions and speculative reconstructions portray the Basilosaurus as an immense, elongated marine creature exceeding 15 meters in length, possessing a flexible, serpentine body, powerful tail propulsion, and reduced hind limbs inconsistent with modern cetaceans. Its skeletal structure suggests lateral undulation rather than vertical swimming motion, giving rise to sea-serpent-like movement patterns reported in historical sightings.",
    "behaviorNotes": "Behavior attributed to the Basilosaurus cryptid includes deep-water cruising, surface appearances during periods of oceanic disturbance, and avoidance of vessels except when disoriented or migrating. Unlike modern whales, reports suggest solitary movement, silent surfacing, and an absence of social behavior. Some accounts imply predatory interactions with large marine animals, reinforcing its image as an apex relic predator.",
    "manifestationConditions": "Manifestations are most commonly reported in deep ocean zones, continental shelves, and historically dangerous sea routes. Sightings tend to coincide with storms, seismic activity, or unexplained maritime disturbances. Encounters are typically brief, often involving partial surfacing, long silhouettes beneath the water, or massive undulating forms observed from a distance.",
    "classificationId": 2,
    "status": "unconfirmed",
    "threatLevel": "high"
  },
  {
    "name": "Champ",
    "aliases": [
      "Lake Champlain Monster",
      "Champy",
      "Champlain Serpent"
    ],
    "description": "Champ is an aquatic cryptid reported in and around Lake Champlain, spanning northern New York and southern Quebec. Witnesses describe sightings of a large serpentine or plesiosaur-like creature that appears beneath the water’s surface and occasionally breaches, sparking speculation that a relict marine or freshwater species persists in the lake’s depths. Champ’s existence blurs lines between folklore, eyewitness testimony, and cryptozoological inquiry, raising unresolved questions about whether the creature is a surviving prehistoric species, an unknown aquatic animal, or a culturally reinforced interpretation of natural phenomena.",
    "shortDescription": "A mysterious aquatic cryptid associated with Lake Champlain, described as large, serpentine, and elusive.",
    "originSummary": "Reports of Champ date back to Indigenous oral traditions and early settler accounts, with the creature becoming part of local lore throughout the 19th and 20th centuries. The cryptid’s popularity grew with multiple eyewitness reports and alleged photographs, including the well-known 1977 “Champ photo.” Over decades, Champ has become embedded in the cultural identity of communities around Lake Champlain, contributing to tourism, regional storytelling, and scientific curiosity.",
    "physicalDescription": "Descriptions vary but commonly include a long, serpentine neck and body that undulates through water, a head sometimes described as small relative to the body, and a series of humps observed above the surface. Estimates of length range from several meters to beyond 10 meters, with coloration described as dark, gray, or mossy to blend with the lake’s depths. Some accounts liken Champ’s movement to that of a plesiosaur, while others describe more snake-like locomotion.",
    "behaviorNotes": "Champ is generally described as elusive and non-aggressive. Most encounters are brief, involving sightings of large shapes beneath the water, multiple rising humps, or rippling wakes inconsistent with known aquatic fauna. The creature is often reported to avoid direct contact with boats or humans, though witnesses describe moments of apparent curiosity, slow approach, or observation from a distance.",
    "manifestationConditions": "Manifestations of Champ are most frequently reported during calm weather, early morning or late evening light, and periods of low boat traffic. Sightings tend to cluster in deeper portions of Lake Champlain, particularly near underwater drop-offs, submerged ledges, and areas with significant thermocline layering. Reports also spike seasonally during migration of birds and fish biomass shifts, suggesting environmental context may play a role in observation conditions.",
    "classificationId": 1,
    "status": "unconfirmed",
    "threatLevel": "moderate"
  },
  {
    "name": "Caboclo d’Água",
    "aliases": [
      "Caboco d’Água",
      "Homem d’Água",
      "Encantado das Águas"
    ],
    "description": "Caboclo d’Água is an aquatic cryptid deeply rooted in Brazilian folklore, particularly within riverine and Indigenous communities of the Amazon basin. Described as a humanoid entity inhabiting rivers, streams, and flooded forests, it is often associated with drowning incidents, missing fishermen, and unexplained disturbances in freshwater environments. While traditionally framed as a folkloric being or enchanted spirit, some interpretations suggest the Caboclo d’Água may represent an unknown aquatic hominid or an entity existing at the intersection of biological anomaly and cultural myth.",
    "shortDescription": "A humanoid aquatic cryptid from Brazilian folklore, associated with rivers, drownings, and mysterious aquatic encounters.",
    "originSummary": "Accounts of the Caboclo d’Água originate from oral traditions passed down among Indigenous peoples and riverine communities in northern and central Brazil. Reports describe encounters spanning centuries, often framed as warnings about respecting waterways and their hidden dangers. Over time, the entity became embedded in regional folklore as both a guardian and a threat, with modern retellings sometimes reinterpreting it through cryptozoological or paranormal lenses.",
    "physicalDescription": "Witness descriptions portray the Caboclo d’Água as a humanoid figure with aquatic adaptations, including dark or greenish skin, elongated limbs, and facial features described as distorted or animalistic. Some reports mention webbed fingers, glowing or reflective eyes, and a slick, algae-like texture to the skin, suggesting prolonged adaptation to submerged environments. Size is typically comparable to an adult human, though proportions are often described as abnormal.",
    "behaviorNotes": "The Caboclo d’Água is considered territorial and potentially hostile. It is frequently blamed for capsized boats, pulled fishing nets, and sudden disappearances near riverbanks. Rather than overt aggression, its behavior is often described as stealthy and predatory, using the river’s depth, currents, and vegetation to disorient victims before retreating beneath the surface.",
    "manifestationConditions": "Manifestations are most commonly reported in isolated river systems, flooded forests, and slow-moving waters, particularly during dusk, nighttime, or periods of high water levels. Sightings often coincide with fog, heavy vegetation cover, or areas known for strong currents and submerged obstacles, reinforcing its association with dangerous and liminal aquatic zones.",
    "classificationId": 1,
    "status": "unconfirmed",
    "threatLevel": "high"
  },
  {
    "name": "Fear Liath Moor",
    "aliases": [
      "Am Fear Liath Mòr",
      "Big Grey Man of Ben MacDhui",
      "Grey Man"
    ],
    "description": "Fear Liath Moor, commonly known as the Big Grey Man or simply the Grey Man, is a cryptid reported predominantly in the mist-shrouded highlands of Scotland, especially around the summit and passes of Ben MacDhui. Eyewitness accounts and local lore describe it alternately as a **massive, humanoid figure with a gray, hair-covered body**, and as an **intangible presence** that induces overwhelming dread, panic, and physiological reactions in those who encounter it. The nature of Fear Liath Moor remains deeply ambiguous — interpreted variously as a physical hominid, a supernatural sentinel, or a perceptual phenomenon triggered by isolation, fog, and psychological stress.",
    "shortDescription": "A tall, fog-associated humanoid entity of Scottish legend, linked to intense fear, strange sounds, and elusive sightings in the high mountains and forests.",
    "originSummary": "The legend of Fear Liath Moor is rooted in Scottish folklore, with references dating as far back as the 13th century and persistent reports into modern times. Climbers, hikers, and shepherds exploring the Cairngorm Mountains and surrounding regions have described experiences that blend **cultural myth, atmospheric phenomena, and eyewitness testimony**. Early documented encounters, such as by mountaineer J. Norman Collie in 1891, contributed to its notoriety among both folklorists and cryptozoologists. Over time, the creature has been woven into local narrative frameworks as a **guardian of peaks, a terror of fog, and a representation of the unknown margins between perception and reality**. :contentReference[oaicite:0]{index=0}",
    "physicalDescription": "Descriptions of Fear Liath Moor vary widely in form and detail. When reported in a physical guise, it is typically portrayed as an **exceptionally tall humanoid**, often exceeding **3 meters (10 feet)** in height, with **broad shoulders, long limbs, and gray or dark hair covering the body**. Witnesses occasionally describe long arms or exaggerated proportions that distinguish it from known fauna. In other descriptions, the entity dissolves into or emerges from thick fog and shadow, blurring the line between corporeal and spectral presence. Footprints of unusual size and shape have been attributed to the cryptid, although physical evidence remains scant. :contentReference[oaicite:1]{index=1}",
    "behaviorNotes": "Fear Liath Moor is most often associated with **psychological and physiological effects**, including intense fear, panic, and a sense of being watched or pursued. Encounter narratives emphasize the sudden onset of dread, echoing footsteps, or inexplicable sensations such as cold air and pressure on the chest or shoulders. Some accounts include auditory phenomena — high-pitched humming, song-like vocalizations, or indistinct Gaelic-like sounds — that accompany or precede sightings. Whether acting as a **stalker, guardian, or environmental trigger**, its behavior is typically elusive, with sightings fleeting or indirect. :contentReference[oaicite:2]{index=2}",
    "manifestationConditions": "Manifestations of the Grey Man are most frequently reported on **Ben MacDhui**, the second-highest peak in the British Isles, particularly in conditions of **dense fog, mist, and isolation**. Sightings also occur in nearby forests such as Rothiemurchus Forest and Aberdeenshire woodlands. Reports often cluster around **high-altitude passes, cold winds, and sudden weather changes**, reinforcing the impression that the creature — if physical — is adapted to extreme, inhospitable environments; or if spectral, remains tied to atmospheric liminality. :contentReference[oaicite:3]{index=3}",
    "classificationId": 12,
    "status": "unconfirmed",
    "threatLevel": "moderate"
  },
  {
    "name": "Momo",
    "aliases": [
      "Momo the Monster",
      "Missouri Monster",
      "Blue Creek Monster"
    ],
    "description": "Momo is a cryptid reported primarily in the mid-20th century near Blue Creek in Missouri, described as a large, bipedal creature with coarse hair and unusual proportions. Eyewitness accounts from the 1970s portray it as a being that combines both ape-like and humanoid characteristics with distinct anomalies, such as claw-like hands, a pungent odor, and a low, wood-like vocalization. Its nature remains ambiguous, straddling the boundary between unexplored fauna, misidentified wildlife, and psychological or sociocultural phenomenon.",
    "shortDescription": "A large, mysterious bipedal cryptid from Missouri, noted for coarse hair, unusual proportions, and eerie encounters.",
    "originSummary": "Reports of Momo originate from the rural region near Blue Creek, Missouri, where a series of sightings in 1972 captured public attention. The creature became widely known after several independent witnesses described encounters while driving or camping near wooded areas. These reports featured both direct visual descriptions and captured sounds, feeding local lore and media coverage. Since then, sporadic anecdotal sightings and reports have added layers of mystique to the cryptid’s history.",
    "physicalDescription": "Eyewitness descriptions of Momo are varied but share common elements: a large, upright stature estimated between 7 and 9 feet tall; coarse, dark hair covering most of the body except for parts of the face; elongated, muscular limbs; and hands with pronounced, claw-like digits. Some accounts describe disproportionately long arms relative to height, giving the creature a distinctive silhouette. Observers also reported deep, resonant growls and subdued, rhythmic vocalizations that defy easy comparison with known animal sounds.",
    "behaviorNotes": "Behavior attributed to Momo ranges from cautious avoidance of human activity to deliberate investigation of campsites and vehicles. Witnesses often describe feelings of unease, sudden silence in surrounding wildlife, or an overwhelming sense of being watched prior to apparent encounters. The creature has not been reliably linked to direct aggression, but its sheer size and stealthy presence evoke a strong psychological impact on observers.",
    "manifestationConditions": "Sightings and auditory encounters are most often reported in late evening or early morning hours, particularly near dense forest edges, creeks, and areas with limited visibility. Reports also highlight a peculiar, unpleasant odor associated with the creature’s presence, described as musky, tar-like, or reminiscent of damp wood and decay. Many reports coincide with transitional seasons — spring and fall — when fog, dusk, and wildlife movement are most pronounced.",
    "classificationId": 12,
    "status": "unconfirmed",
    "threatLevel": "moderate"
  },
  {
    "name": "Skin Walkers",
    "aliases": [
      "Skin-Walkers",
      "Shape Shifters",
      "Navajo Witch Entity"
    ],
    "description": "Skinwalkers are cryptids described as malevolent humanoid entities capable of transforming into animals or animal-human hybrids. Reports commonly associate them with mimicry, unnatural movement, and behavioral patterns intended to deceive or intimidate humans.",
    "shortDescription": "Humanoid shapeshifting entities associated with transformation, deception, and ritualistic folklore.",
    "originSummary": "Accounts of Skinwalkers originate primarily from Indigenous North American folklore, particularly narratives describing individuals who gained supernatural abilities through forbidden rituals. Modern reports blend traditional stories with contemporary paranormal encounters.",
    "physicalDescription": "Witnesses describe appearances ranging from human-like figures to distorted animal forms, often exhibiting abnormal proportions, glowing eyes, or incomplete transformations.",
    "behaviorNotes": "Skinwalkers are frequently associated with stalking behavior, vocal mimicry, psychological manipulation, and avoidance of direct confrontation, often appearing near isolated dwellings or remote landscapes.",
    "manifestationConditions": "Manifestations are typically reported at night or during periods of isolation, often following ritual activity, trespassing, or prolonged exposure to areas considered culturally restricted.",
    "classificationId": 11,
    "status": "legendary",
    "threatLevel": "high"
  },
  {
    "name": "Varginha Devil",
    "aliases": [
      "Diabo de Varginha",
      "ET de Varginha",
      "Creature of Varginha"
    ],
    "description": "The Varginha Devil is a cryptid rooted in a series of reported encounters in January 1996 in Varginha, Minas Gerais, Brazil. Witnesses described an unusual humanoid figure, small in stature, with large red eyes and unusual skin texture that emerged from a sequence of events involving alleged military activity, animal deaths, and rapid containment. While some interpretations frame the Varginha Devil as an extraterrestrial being, others consider it a folkloric entity exacerbated by mass psychology, misinformation, and the blending of local belief systems with broader UFO lore. Its narrative remains contentious, bridging cryptozoology, paranormal investigation, and cultural myth.",
    "shortDescription": "A small, humanoid cryptid reported in Varginha, Brazil, with reddish eyes and ambiguous origins that span cryptid, paranomal, and extraterrestrial interpretations.",
    "originSummary": "The legend of the Varginha Devil originated on January 20, 1996, when multiple residents of Varginha reported seeing a strange creature wandering near a local pasture. The sightings were followed by numerous military and emergency responses, alleged animal carcasses, and widespread local media coverage. Over time, the narrative expanded through witness testimonies, local folklore, and international UFO culture, making the Varginha Devil one of Brazil’s most discussed cryptid cases.",
    "physicalDescription": "Witness accounts of the Varginha Devil vary but commonly include description of a small, roughly humanoid figure measuring approximately 1 to 1.5 meters tall, with elongated limbs, a disproportionately large head, and strikingly large red or reddish eyes. The creature’s skin was described as smooth and brownish, sometimes interpreted as skin, hide, or a membranous covering. Some witnesses mentioned a pungent, unfamiliar odor. The precise morphology remains uncertain, with speculative comparisons to extraterrestrial depictions as well as to unknown primate or hominid forms.",
    "behaviorNotes": "Behavior attributed to the Varginha Devil is ambiguous, primarily due to the brief nature of encounters and the presence of multiple observers. Accounts include rapid movement, avoidance of human interaction, and retreat into vegetated areas. Some reports suggest the creature appeared disoriented or frightened, while others describe silent observation before sudden departure. There is no clear evidence of overt aggression, however, the creature’s presence, combined with the surrounding military and media activity at the time, left a strong emotional impact on witnesses.",
    "manifestationConditions": "Manifestations associated with the Varginha Devil occurred primarily in urban-fringe and pasture environments during daylight and early evening hours in January 1996. Sightings coincided with increased local activity due to a drought and a water crisis, leading some interpretations to link environmental stressors with heightened awareness or altered perception. Reports include secondary encounters with local fauna behaving unusually in the same area prior to human sightings.",
    "classificationId": 14,
    "status": "unconfirmed",
    "threatLevel": "moderate"
  },
  {
    "name": "Owlman",
    "aliases": [
      "The Owl Man of Cornwall",
      "Cornish Owlman"
    ],
    "description": "The Owlman is a cryptid reported in the early 1970s near the village of Mawnan Smith in Cornwall, UK. Eyewitness accounts describe a tall, bipedal creature with owl-like features, including large, forward-facing eyes, a broad, faceted face, and powerful wings or wing-like arms. Its nature remains deeply enigmatic. Interpreted by some as a previously unknown hominid with convergent avian morphology, by others as a supernatural sentinel, and by skeptics as misidentified wildlife or psychological projection. The Owlman’s appearance is consistently linked to powerful emotional responses, a sense of being observed, and a blend of physical and atmospheric phenomena that defy easy classification.",
    "shortDescription": "A tall, owl-featured humanoid cryptid from Cornwall, associated with eerie sightings and mixed interpretations as biological anomaly or paranormal phenomenon.",
    "originSummary": "The earliest well-documented reports of the Owlman emerged in 1976 around the church tower of St. Mawnan and St. Stephen, when two young witnesses described encounters with a large, winged entity with reflective eyes and a humanoid posture. These accounts resonated with decades of folklore about strange winged beings in rural Britain, intertwining local narrative traditions with modern cryptid lore. Newspapers, cryptozoologists, and folklore researchers have since revisited the case, contributing to its persistence in cryptid literature.",
    "physicalDescription": "Witnesses commonly describe the Owlman as standing between 1.8 and 2.4 meters tall (6 to 8 feet), with a face resembling that of an owl — large, round, and dominated by reflective or glowing eyes. Reports vary on whether it possesses fully developed wings capable of flight, membranous appendages, or wing-like arms, but all accounts emphasize an avian silhouette blended with humanoid proportions. Its body is reported to be covered in dark feathers or plumage-like textures, with powerful legs and large talon-like feet.",
    "behaviorNotes": "Behavior attributed to the Owlman is typically elusive and observational rather than overtly aggressive. Witnesses describe moments of silent observation, lingering near structures or treetops, and an uncanny ability to appear and vanish without apparent sound. Some accounts mention sudden gusts of wind or atmospheric changes coinciding with its presence, contributing to an overall sense of unease or heightened awareness. Direct contact is rare; most interactions involve brief visual observation followed by disappearance into the surrounding landscape.",
    "manifestationConditions": "Sightings are most frequently reported near ancient structures, wooded hillsides, and rocky outcrops, particularly around dusk or nighttime hours when shadows and low light may enhance sensory ambiguity. The Owlman has also been associated with areas of historical significance or elevated spiritual narrative within the local community, reinforcing its place at the intersection of folklore and phenomenon.",
    "classificationId": 12,
    "status": "unconfirmed",
    "threatLevel": "moderate"
  },
  {
    "name": "Gnome",
    "aliases": [
      "Earth Spirit",
      "Garden Gnome"
    ],
    "description": "The Gnomo is a folkloric humanoid entity originating from European traditions, commonly described as a small, earth-dwelling being associated with nature, minerals, and hidden knowledge. Across different cultures, gnomes are portrayed as guardians of the land, protectors of underground spaces, or secretive observers of human activity.",
    "shortDescription": "A small folkloric humanoid associated with nature, earth, and hidden realms.",
    "originSummary": "Legends of gnomes trace back to European folklore, particularly in Germanic, Scandinavian, and Alpine regions. Historically, they were believed to inhabit forests, mountains, and underground spaces, often linked to mining, agriculture, and the protection of natural resources.",
    "physicalDescription": "Gnomes are typically described as short humanoids with proportionally large heads, long beards, and pointed hats or caps. Their clothing is often depicted as rustic or earth-toned, and their physical appearance emphasizes their connection to soil, stone, and vegetation.",
    "behaviorNotes": "Behavioral accounts portray gnomes as reclusive, cautious, and intelligent. They are often described as avoiding direct human contact, intervening only when natural environments are threatened or when boundaries between worlds are momentarily weakened.",
    "manifestationConditions": "Manifestations are commonly reported in rural or forested areas, gardens, and mountainous regions. Sightings are rare and often tied to twilight hours, isolated environments, or strong folkloric traditions.",
    "classificationId": 4,
    "status": "folklore",
    "threatLevel": "low"
  }
]

export async function seedCryptids() {
  try {
    console.log('Starting cryptids seed...')

    const inserted = await db.insert(cryptids).values(cryptidSeedData).returning()

    console.log(`✓ Successfully inserted ${inserted.length} cryptids`)
    return inserted
  } catch (error) {
    console.error('Error seeding cryptids:', error)
    throw error
  }
}

// Run seed if called directly
if (require.main === module) {
  seedCryptids()
    .then(() => {
      console.log('Cryptids seed completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Cryptids seed failed:', error)
      process.exit(1)
    })
}
