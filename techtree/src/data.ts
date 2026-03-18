import { TechNode, Connection } from "./types";

export const TECH_TREE: TechNode[] = [
  // ═══════════ ERA 0: SURVIVAL ═══════════
  {
    id: "Food", name: "FOOD", era: 0, category: "food", icon: "🌾",
    title: "FORAGE & STOCKPILE", flavor: "Supermarket: 55yr/person",
    details: [
      "Canned goods: 100+ yr shelf life",
      "Consume perishables first, cans last",
      "Whole grain lasts decades, flour years",
      "1 supermarket feeds 1 person 55 yrs",
      "Pests & rats will compete — secure stores",
    ],
    prereqs: [], x: 11, y: 170,
    scenario: "Day 1. Your group finds a Walmart with shelves still stocked. The freezers are already warming and you can hear rats in the back. Your people look to you for orders.",
    decisions: [
      { prompt: "What do you tell people to eat first?", choices: ["Open the canned goods — they're safest", "Start with the fresh and frozen food before it spoils", "Ration the bottled water only", "Hunt for MREs in the camping aisle"], answer: 1, success: "Smart. The fresh food is already spoiling. Cans will last a century — save them for later.", failure: "One of the elders shakes her head. 'The fresh food is rotting. Eat that first. Cans will keep for decades.'" },
      { prompt: "Someone wants to haul sacks of flour. Your farmer disagrees. Who do you side with?", choices: ["Take the flour — bread is essential", "Take unmilled whole grains instead — they last decades longer", "Take neither, focus on canned food only", "Take both equally"], answer: 1, success: "The farmer knows. Flour goes rancid in months, but unmilled grain stores for decades. Good call.", failure: "The farmer explains: 'Flour has exposed oils — it spoils fast. Whole grains last decades. Trust me.'" },
    ],
  },
  {
    id: "Fuel", name: "ENERGY", era: 0, category: "energy", icon: "⛽",
    title: "FUEL RESERVES", flavor: "Gas stations: 30,000 gal/tank",
    details: [
      "Siphon cars or hammer screwdriver into tank",
      "Diesel > gasoline (more stable)",
      "Stored fuel degrades ~1yr without additives",
      "Filter gummy sediment before engine use",
      "Cuba model: cannibalize parts to keep running",
    ],
    prereqs: [], x: 11, y: 341,
    scenario: "Your scouts found a gas station two miles east. The underground tanks might still be full — that's 30,000 gallons of fuel. But fuel degrades over time, and you need to choose wisely.",
    decisions: [
      { prompt: "Your mechanic asks: should we prioritize gasoline or diesel?", choices: ["Gasoline — most cars run on it", "Diesel — it degrades much slower than gasoline", "Doesn't matter — fuel is fuel", "Neither — it's all useless after a year"], answer: 1, success: "Good call. Diesel is chemically more stable and stays usable far longer. Your vehicles will run for years.", failure: "Your mechanic shakes her head. 'Diesel is way more stable. Gasoline turns to gum in months, but diesel lasts years.'" },
      { prompt: "An old Cuban mechanic in your group says he can keep vehicles running indefinitely. What's his method?", choices: ["Replace engines with electric motors", "Cannibalize parts from other vehicles to maintain a fleet", "Convert engines to run on cooking oil", "Stockpile enough spare parts for 20 years"], answer: 1, success: "The Cuba model — after the 1962 embargo, Cubans kept 'Yank Tanks' running for 50+ years by cannibalizing parts. Brilliant.", failure: "He grins. 'In Cuba, we kept American cars running for 50 years after the embargo. You swap parts between vehicles. Nothing is wasted.'" },
    ],
  },
  {
    id: "Meds", name: "MEDICINE", era: 0, category: "medicine", icon: "🩺",
    title: "PHARMA FORAGE", flavor: "90% of drugs outlast expiry",
    details: [
      "Check hospitals, vets, pet shops, fish stores",
      "Ciprofloxacin effective 10+ yrs past expiry",
      "Superglue closes wounds (Vietnam War use)",
      "Analgesics, antibiotics, antivirals — priority",
      "Blister packs extend life vs open bottles",
    ],
    prereqs: [], x: 11, y: 503,
    scenario: "A child in your group has a deep infected cut. The nearest hospital is a dangerous two-day trek. But someone mentions the pet store across the road might have what you need.",
    decisions: [
      { prompt: "Is the pet store really worth raiding for medicine?", choices: ["No — animal drugs are different from human drugs", "Yes — veterinary antibiotics are the same compounds used in humans", "Only if there's a vet in the group", "Pet stores only carry flea medicine"], answer: 1, success: "Animal antibiotics are identical to human ones. Fish stores carry ciprofloxacin — still effective 10+ years past expiry.", failure: "Your nurse speaks up: 'Farm antibiotics are the same molecules. Ciprofloxacin from a fish store works fine on humans.'" },
      { prompt: "The cut won't stop bleeding and you have no sutures. A mechanic offers his superglue. Do you use it?", choices: ["Absolutely not — glue is toxic on wounds", "Yes — cyanoacrylate was used to close wounds in Vietnam", "Only if you dilute it with water first", "Wrap it tight with duct tape instead"], answer: 1, success: "Superglue (cyanoacrylate) has closed battlefield wounds since Vietnam. Clean the wound, pull edges together, apply along the surface.", failure: "The nurse nods at the superglue. 'We used this in Vietnam. Clean the wound, pull it shut, and glue along the seam. It works.'" },
    ],
  },
  {
    id: "Shelter", name: "MATERIALS", era: 0, category: "materials", icon: "🏗️",
    title: "RURAL SETTLEMENT", flavor: "Leave cities within months",
    details: [
      "Cities fail without grid: no water, no heat",
      "Bodies + contaminated water = disease risk",
      "Ideal: coastal, near woodland, arable land",
      "Older buildings better for off-grid living",
      "Send salvage crews into dead cities for metal",
    ],
    prereqs: [], x: 11, y: 665,
    scenario: "It's been two weeks. The city stinks of death — burst sewage pipes, decomposing bodies. Disease is spreading. Your group debates whether to stay where the supplies are or leave.",
    decisions: [
      { prompt: "The group is split. What's your call?", choices: ["Stay in the city — this is where all the resources are", "Move to the countryside but send salvage crews back to the city", "Move to the suburbs as a compromise", "Move to another city that's less damaged"], answer: 1, success: "Cities without a grid are death traps — no water, no heat, disease everywhere. Live rurally, raid cities for metal and supplies.", failure: "An engineer speaks up: 'Without the grid, cities are tombs. We live in the countryside and send scavenging teams back. That's how we survive.'" },
      { prompt: "You're scouting for a permanent settlement. What kind of location do you prioritize?", choices: ["A modern apartment complex — sturdy and secure", "An old farmhouse near coast, woodland, and arable land", "A hilltop fortress for defense", "The largest building you can find"], answer: 1, success: "Ideal: coastal for fish, near woodland for fuel, arable land for farming. Old buildings have fireplaces and don't depend on the grid.", failure: "The farmer in your group says: 'We need arable land, woodland for fuel, and coast for fish. An old farmhouse with a fireplace — not some apartment that needs electricity.'" },
    ],
  },
  {
    id: "Radio", name: "COMM", era: 0, category: "comm", icon: "📡",
    title: "RADIO COMMS", flavor: "GPS fails in 2 weeks",
    details: [
      "GPS: accuracy 0.5km in 2wks, useless in yrs",
      "Walkie-talkies for local group comms",
      "CB/ham radio for long-distance survivor contact",
      "Mobile phones: days only (cell tower backup)",
      "Learn Morse code — low power, long range",
    ],
    prereqs: [], x: 11, y: 827,
    scenario: "Your scouts need to coordinate with the settlement, but cell phones stopped working days ago. Someone found a CB radio in an abandoned truck. Another person has a smartphone with GPS.",
    decisions: [
      { prompt: "Someone insists GPS still works. How long until it becomes useless?", choices: ["It failed immediately when the power went out", "About 2 weeks before accuracy degrades to ~0.5 km", "GPS satellites last forever", "At least a year"], answer: 1, success: "Without ground station corrections, GPS drifts to 0.5 km error in 2 weeks, then gets worse. Use it now while you can.", failure: "A former telecom worker explains: 'GPS satellites drift without corrections. You've got maybe two weeks of decent accuracy, then it's useless.'" },
      { prompt: "For long-range contact with other survivor groups, what's your best option?", choices: ["Keep trying cell phones — towers have backup generators", "Set up a CB or ham radio system", "Send runners with written messages", "Build a signal fire network"], answer: 1, success: "Cell towers run out of backup fuel in days. CB and ham radios need nothing but the radio itself — they're your lifeline to other survivors.", failure: "The trucker laughs. 'Cell towers died days ago. CB radio is how I've talked across the country for 30 years. No infrastructure needed.'" },
    ],
  },
  {
    id: "Batteries", name: "ENERGY", era: 0, category: "energy", icon: "⚡",
    title: "POWER STORAGE", flavor: "Golf carts, RVs, forklifts",
    details: [
      "Deep cycle: full discharge OK repeatedly",
      "Car batteries: 5% discharge max (wrong type)",
      "Salvage inverter: DC → 120V AC for appliances",
      "Link battery bank with solar panels if found",
      "Lead-acid: rechargeable, refillable, durable",
    ],
    prereqs: [], x: 11, y: 989,
    scenario: "You need electricity for medical equipment and radios. Someone found car batteries in a parking garage. Another person suggests raiding the golf course instead. Limited vehicles — you can only make one trip.",
    decisions: [
      { prompt: "Car batteries or golf cart batteries — which do you send a team for?", choices: ["Car batteries — there are thousands of them nearby", "Golf cart batteries — they're deep-cycle and designed for sustained power", "It doesn't matter — all batteries are the same", "Neither — use a generator instead"], answer: 1, success: "Car batteries are for short bursts — drain them past 5% and they're ruined. Deep-cycle batteries from golf carts can be fully discharged repeatedly.", failure: "Your electrician winces. 'Car batteries die if you drain them more than 5%. Golf carts use deep-cycle batteries — designed for exactly what we need.'" },
      { prompt: "You found solar panels on a warehouse roof. How fast do they degrade?", choices: ["They'll be useless within a year", "About 1% per year — good for two or three generations", "They never degrade", "50% loss in the first decade"], answer: 1, success: "Solar panels lose about 1% output per year. In 50 years they'll still produce half their rated power. A gift that lasts generations.", failure: "The engineer checks the spec sheet. 'These lose about 1% a year. Your grandchildren will still be using them.'" },
    ],
  },

  // ═══════════ ERA 1: STABILITY ═══════════
  {
    id: "Water", name: "MEDICINE", era: 1, category: "medicine", icon: "💧",
    title: "CLEAN WATER", flavor: "Boil 1 min kills all pathogens",
    details: [
      "Boiling 1 min: kills bacteria, viruses, protozoa",
      "Charcoal filter: removes toxins and taste",
      "Dig wells upstream of habitation",
      "Chlorine tablets from pool supplies",
      "Sand + gravel + charcoal = simple filter stack",
    ],
    prereqs: ["Meds"], x: 326, y: 170,
    scenario: "People are getting sick — diarrhea is spreading through camp. The creek water looks clear but something is wrong. You need to establish safe drinking water before this becomes a crisis.",
    decisions: [
      { prompt: "You have limited fuel. Someone says just filtering the water through cloth is enough. Is it?", choices: ["Yes — cloth catches all the dangerous stuff", "No — you need to boil it for at least one minute to kill pathogens", "Running water is naturally safe", "Just add a little alcohol to purify it"], answer: 1, success: "One minute of rolling boil kills bacteria, viruses, and protozoa. Cloth removes debris but not microbes. Boiling is non-negotiable.", failure: "The nurse shakes her head. 'Cloth won't stop viruses or bacteria. Boil it — one minute at a rolling boil. That's the only way to be sure.'" },
      { prompt: "You're building latrines. How far from the well should they be?", choices: ["5 meters is fine", "10 meters minimum", "At least 20 meters — and downstream", "Right next to camp for convenience"], answer: 2, success: "At least 20 meters, and always downstream or downhill from water sources. Groundwater contamination is invisible and deadly.", failure: "An old farmer scolds the builders. 'Twenty meters minimum from any water source, and downhill. You'll poison the whole camp otherwise.'" },
    ],
  },
  {
    id: "Farming", name: "FOOD", era: 1, category: "food", icon: "🌱",
    title: "AGRICULTURE RESTART", flavor: "Gather seeds BEFORE they're lost",
    details: [
      "PRIORITY: open-pollinated seeds (not hybrid)",
      "Wheat, rye, barley, corn, potato, legumes",
      "Farmland seeds left in fields will die quickly",
      "Legumes fix atmospheric nitrogen — plant first",
      "Draft animals save enormous labor for plowing",
    ],
    prereqs: ["Food", "Shelter"], x: 326, y: 341,
    scenario: "The scavenged food won't last forever. You need to start growing your own. A gardener in your group says seeds are the priority — but the local garden center has both hybrid and heirloom varieties.",
    decisions: [
      { prompt: "Your gardener insists on heirloom seeds only. A younger member grabs hybrid packets — they produce more. Who's right?", choices: ["The younger member — hybrids produce bigger yields", "The gardener — heirloom/open-pollinated seeds breed true and can be saved", "Doesn't matter — seeds are seeds", "Neither — just forage wild plants"], answer: 1, success: "Hybrid seeds produce well once but their offspring won't match the parents. Heirloom seeds breed true — you can save them year after year. This is how civilization restarts.", failure: "The gardener explains patiently: 'Hybrids don't breed true. Plant their seeds next year and you get unpredictable garbage. Heirloom seeds are the future.'" },
      { prompt: "What should you plant first to prepare the soil?", choices: ["Wheat — it's the staff of life", "Legumes — they fix nitrogen from the air into the soil", "Potatoes — highest calories per acre", "Corn — it grows fast"], answer: 1, success: "Legumes (peas, beans, clover) pull nitrogen from the atmosphere and fix it into the soil. Plant them first to prepare the ground for everything else.", failure: "The farmer laughs. 'You can't just plant wheat in dead soil. Legumes first — they grab nitrogen from the air and feed it to the earth.'" },
    ],
  },
  {
    id: "OffGrid", name: "ENERGY", era: 1, category: "energy", icon: "🔋",
    title: "LOCAL POWER GRID", flavor: "Car alternator: 12V at any RPM",
    details: [
      "Goražde method: river paddle wheel + alternator",
      "1 billion cars on planet — each has alternator",
      "Alternator: steady 12V regardless of spin speed",
      "Windmill: curved sheet steel + bicycle gear/chain",
      "Solar panels degrade ~1%/yr (useful 2–3 gen)",
    ],
    prereqs: ["Fuel", "Batteries", "Radio"], x: 326, y: 503,
    scenario: "You have batteries but no way to recharge them. The river near camp flows steadily, and there's a junkyard full of dead cars. An engineer has an idea.",
    decisions: [
      { prompt: "The engineer wants to build a water wheel on the river and attach... what from a car?", choices: ["The engine", "The alternator — it produces 12V DC at any spin speed", "The transmission", "The radiator fan"], answer: 1, success: "Every car has an alternator that outputs steady 12V DC regardless of how fast it spins. There are a billion cars on Earth — a billion generators waiting to be repurposed.", failure: "The engineer taps the alternator. 'This little box produces 12 volts no matter how fast you spin it. Every car has one. We have a billion generators sitting in parking lots.'" },
      { prompt: "Your settlement is modeled on a real siege — where people survived 3 years using this exact method. Where was it?", choices: ["Sarajevo, Bosnia", "Goražde, Bosnia — floating platforms on the Drina River", "Beirut, Lebanon", "Aleppo, Syria"], answer: 1, success: "During the siege of Goražde (1992-95), residents built floating paddle-wheel platforms on the Drina River driving car alternators. They had electricity when the rest of the country didn't.", failure: "A history teacher speaks up: 'Goražde. Besieged for three years. They floated paddle wheels on the Drina River, hooked to car alternators. Had power the whole time.'" },
    ],
  },
  {
    id: "Preserve", name: "FOOD", era: 1, category: "food", icon: "🧂",
    title: "PRESERVATION", flavor: "Salt · Smoke · Ferment · Pickle",
    details: [
      "Salt: draws moisture out, halts microbial growth",
      "Smoking: phenol compounds are antimicrobial",
      "Vinegar pickling: 5–10% acetic acid",
      "Lactic fermentation: sauerkraut, kimchi, yogurt",
      "Cheese: months of milk nutrition, fat-soluble vits",
    ],
    prereqs: ["Food"], x: 326, y: 665,
    scenario: "Harvest was good, but half the vegetables are rotting before you can eat them. Winter is coming. Without refrigeration, you need ancient methods to store months of food.",
    decisions: [
      { prompt: "You have plenty of salt from a raided warehouse. How concentrated should the brine be to preserve meat safely?", choices: ["Same as seawater", "About 5 times stronger than seawater — around 180g per liter", "Just a light sprinkle", "Saturated — as much salt as the water can hold"], answer: 1, success: "A brine of ~180g salt per liter — about five times saltier than the ocean — draws out moisture and halts microbial growth. Your meat will last months.", failure: "The cook shakes his head. 'Seawater strength won't cut it. You need five times that — 180 grams per liter. Otherwise bacteria still grow.'" },
      { prompt: "Someone left a jug of wine open by accident. It smells sour. Is it ruined?", choices: ["Yes — throw it out", "No — it's turning into vinegar, which is a powerful preservative", "It's dangerous to drink now", "It's become poison"], answer: 1, success: "Wine exposed to air turns into vinegar as bacteria convert ethanol to acetic acid. At 5-10% concentration, vinegar preserves food for months. Nothing is wasted.", failure: "The cook grins. 'That's not ruined — that's vinegar being born. Bacteria are turning the alcohol into acetic acid. We'll use it to pickle everything.'" },
    ],
  },
  {
    id: "Livestock", name: "FOOD", era: 1, category: "food", icon: "🐄",
    title: "LIVESTOCK", flavor: "Traction · milk · wool · manure",
    details: [
      "Cattle: draft power, dairy, leather, dung fuel",
      "Sheep: wool for textiles, milk, meat",
      "Pigs: efficient converters of food scraps",
      "Chickens: eggs + pest control in fields",
      "Manure: essential nitrogen fertilizer",
    ],
    prereqs: ["Shelter"], x: 326, y: 827,
    scenario: "You've found a farm with surviving cattle, pigs, sheep, and chickens. You can't take them all — your settlement can only support a limited herd right now. But winter is coming and there's no stored feed.",
    decisions: [
      { prompt: "In medieval Europe, farmers had to slaughter most livestock every autumn. What invention ended this?", choices: ["Refrigeration", "Turnips and other root crops that provided winter feed", "Hay baling", "Heated barns"], answer: 1, success: "Before root fodder crops like turnips, there was nothing to feed livestock through winter. Mass autumn slaughter was the norm. Turnips changed everything.", failure: "The farmer explains: 'Before turnips and rutabagas, there was no winter feed. You had to kill most of your herd every fall. Root crops changed history.'" },
      { prompt: "Your agronomist says five acres with livestock and crop rotation can feed a surprising number of people. How many?", choices: ["2-3 people", "About 5 people", "Up to 10 people", "20 people"], answer: 2, success: "Five acres with proper rotation (legumes, wheat, roots, barley) plus cattle, pigs, sheep, and chickens can sustain up to 10 people. Every acre counts.", failure: "The agronomist corrects you: 'With the Norfolk rotation and mixed livestock, five acres feeds ten people. Don't waste land on monoculture.'" },
    ],
  },

  // ═══════════ ERA 2: FOUNDATION ═══════════
  {
    id: "CropRotation", name: "FOOD", era: 2, category: "food", icon: "🔄",
    title: "CROP ROTATION", flavor: "3-field: grain / legume / fallow",
    details: [
      "3-field system: prevents soil exhaustion",
      "Legumes fix N₂ from air → soil nitrogen",
      "Fallow: allows microbial recovery",
      "Yields increase 30–50% vs monoculture",
      "Different pests, different years = pest control",
    ],
    prereqs: ["Farming"], x: 641, y: 101,
    scenario: "Year two. Your wheat yields are already declining — the soil is exhausted. Medieval farmers had the same problem and left half their land empty. Your agronomist says there's a better way.",
    decisions: [
      { prompt: "In the Norfolk four-course system, what replaces the wasteful fallow year?", choices: ["More wheat", "Root crops like turnips — they suppress weeds AND feed livestock", "Corn", "Leaving it empty but plowing twice"], answer: 1, success: "Turnips and other root crops replace fallow — they suppress weeds while producing winter livestock feed. No wasted years.", failure: "The agronomist draws in the dirt: 'Turnips replace fallow. They choke weeds AND feed your animals through winter. Zero waste.'" },
      { prompt: "Why does rotating different crops each year reduce pest damage?", choices: ["Different crops need different amounts of water", "Many pests are crop-specific — they starve when their host isn't there", "It confuses insects", "The soil pH changes"], answer: 1, success: "Wheat pests can't eat turnips. Rotate crops and you break the pest lifecycle. No pesticides needed.", failure: "The agronomist explains: 'Most pests specialize. Wheat weevils starve in a turnip field. Rotation is the oldest pesticide there is.'" },
    ],
  },
  {
    id: "Soap", name: "MEDICINE", era: 2, category: "medicine", icon: "🧼",
    title: "SOAP + HYGIENE", flavor: "Wood ash lye + animal fat",
    details: [
      "Potash: leach water through wood ash = lye (KOH)",
      "Boil lye + rendered tallow = saponification",
      "Hard soap: cool and cut; soft soap: liquid",
      "Handwashing halves transmission of gut disease",
      "Lime Ca(OH)₂ can substitute for lye",
    ],
    prereqs: ["Water"], x: 641, y: 269,
    scenario: "Dysentery is killing people. Your doctor says handwashing could cut transmission in half — but you have no soap. A chemist in the group eyes the fire pit full of wood ash and the rendered animal fat from yesterday's butchering.",
    decisions: [
      { prompt: "The chemist starts by leaching water through wood ash to make lye. But the yield is shockingly low. How much potash do you get from 1 kg of ash?", choices: ["About 100 grams", "About 10 grams", "About 1 gram", "About 0.1 grams"], answer: 2, success: "Only about 1 gram of potash per kilogram of wood ash. Soap is precious — don't waste it. But even a little saves lives.", failure: "The chemist weighs the result and sighs. 'One gram per kilogram of ash. We'll need to burn a lot of wood. But even a small bar of soap halves disease transmission.'" },
      { prompt: "Someone tries making soap with slaked lime (calcium hydroxide) directly. It doesn't lather. Why?", choices: ["The lime wasn't hot enough", "Calcium soaps form scum instead of lather — you need potassium or sodium hydroxide", "They used too much fat", "Lime soap needs to cure for months"], answer: 1, success: "Calcium soaps form insoluble scum — like hard water deposits. You need to convert the calcium compound to potassium or sodium hydroxide first.", failure: "The chemist explains: 'Calcium soaps are scum, not soap. You need to react the lime with potash first to get potassium hydroxide. Then it lathers.'" },
    ],
  },
  {
    id: "Charcoal", name: "ENERGY", era: 2, category: "energy", icon: "🔥",
    title: "CHARCOAL", flavor: "Stack wood, cover, restrict O₂, ignite",
    details: [
      "Kiln: wood pile covered in earth/sod, slow burn",
      "Burns 3× hotter & cleaner than raw wood",
      "Water purification: activated charcoal adsorbs toxins",
      "Essential reductant for iron smelting (C + Fe₂O₃)",
      "15% of gunpowder formula (KNO₃ + C + S)",
    ],
    prereqs: ["Farming", "Livestock"], x: 641, y: 437,
    scenario: "Your blacksmith needs fuel hot enough to work metal, but raw wood won't do. She wants to build a charcoal kiln — a covered mound of wood that burns slowly for days with restricted oxygen.",
    decisions: [
      { prompt: "After days of tending the kiln, you open it. How much weight has the wood lost?", choices: ["About 10%", "About 25%", "About 50% — half the mass escapes as vapor", "About 75%"], answer: 2, success: "Roughly half the wood's weight leaves as moisture and volatile gases. What remains is nearly pure carbon — three times hotter than raw wood.", failure: "The blacksmith weighs the charcoal. 'Half the mass is gone — water and volatiles cooked off. But what's left burns three times hotter than wood.'" },
      { prompt: "Your blacksmith says charcoal does double duty in iron smelting. What does she mean?", choices: ["It provides fuel AND acts as a reducing agent that strips oxygen from iron ore", "It heats the ore AND adds carbon to make steel", "It melts the slag AND purifies the iron", "It fuels the bellows AND the furnace"], answer: 0, success: "Charcoal is both the heat source and the chemical that reduces iron oxide. Carbon monoxide from burning charcoal strips oxygen from Fe₂O₃, leaving iron behind.", failure: "The blacksmith explains: 'The charcoal burns to carbon monoxide, which rips the oxygen right out of iron ore. Fuel AND chemistry in one material.'" },
    ],
  },
  {
    id: "Lime", name: "MATERIALS", era: 2, category: "materials", icon: "🪨",
    title: "LIME PRODUCTION", flavor: "Burn limestone >900°C → CaO",
    details: [
      "Quicklime CaO + water → Ca(OH)₂ slaked lime",
      "Slaked lime + sand = mortar and plaster",
      "Flux in glassmaking; soil pH amendment",
      "Disinfectant: whitewash walls kills pathogens",
      "Limestone = seashells, chalk — widely available",
    ],
    prereqs: ["Farming", "Livestock"], x: 641, y: 605,
    scenario: "You need mortar for permanent buildings, flux for glassmaking, and disinfectant for the clinic. A geologist says all three start with the same thing: burning limestone in a kiln.",
    decisions: [
      { prompt: "How hot does the kiln need to get to convert limestone into quicklime?", choices: ["About 600°C", "About 750°C", "At least 900°C", "Over 1200°C"], answer: 2, success: "Above 900°C, calcium carbonate decomposes into calcium oxide (quicklime) and CO₂. Achievable in a well-built kiln fueled by charcoal.", failure: "The geologist checks the thermometer. 'Not hot enough. You need at least 900°C to drive off the CO₂ and convert the limestone.'" },
      { prompt: "A worker adds water to the quicklime and it practically explodes with heat. What's happening?", choices: ["A dangerous chemical reaction — evacuate!", "The quicklime is reacting vigorously with water to form slaked lime — this is normal", "The lime is burning", "The water is contaminated"], answer: 1, success: "Quicklime plus water is an extremely exothermic reaction producing slaked lime — Ca(OH)₂. That's why 'quick' meant 'alive' in Old English.", failure: "The geologist calmly explains: 'This is slaking. CaO + water = Ca(OH)₂ plus a lot of heat. Totally normal. This is why it's called quicklime — it's alive.'" },
    ],
  },
  {
    id: "Textiles", name: "MATERIALS", era: 2, category: "materials", icon: "🧵",
    title: "TEXTILES", flavor: "Drop spindle → wheel → loom",
    details: [
      "Wool: wash, card, spin into yarn on wheel",
      "Flax/linen: ret (rot), scutch, hackle fibers",
      "Warp-weighted or horizontal loom for cloth",
      "Wool + urine fulling = dense weatherproof felt",
      "Silk if silkworms available (very fine thread)",
    ],
    prereqs: ["Livestock"], x: 641, y: 755,
    scenario: "Scavenged clothes are wearing out. The sheep provide wool, but turning raw fleece into wearable cloth is a complex process. A weaver in your group takes charge.",
    decisions: [
      { prompt: "The weaver builds a spinning wheel with a clever mechanism that automatically winds the yarn. Who originally designed this device?", choices: ["James Hargreaves", "Leonardo da Vinci around 1500", "Richard Arkwright", "An unknown medieval monk"], answer: 1, success: "The spindle flyer was designed by Leonardo da Vinci circa 1500. It lets the wheel spin and wind yarn simultaneously.", failure: "The weaver smiles. 'Leonardo da Vinci designed this around 1500. The spindle flyer — lets you spin and wind in one motion. Genius.'" },
      { prompt: "Your weaver produces a tough diagonal-patterned fabric. What weave is this?", choices: ["Plain weave", "Satin weave", "3/1 twill — the same weave used for denim", "Basket weave"], answer: 2, success: "Twill weave: the weft floats over three warp threads, then crosses one. Creates a diagonal pattern. More flexible and durable than plain weave. This is how denim is made.", failure: "The weaver holds it up. '3/1 twill. Weft over three, cross one. Same pattern as denim — tough, flexible, perfect for work clothes.'" },
    ],
  },
  {
    id: "Pottery", name: "MATERIALS", era: 2, category: "materials", icon: "🏺",
    title: "POTTERY + CERAMICS", flavor: "Clay + fire >800°C = vitrified pot",
    details: [
      "Test clay: roll, bend — must not crack",
      "Coil method or wheel for shaping",
      "Kiln: 800°C earthenware, 1200°C stoneware",
      "Ash glaze: wood ash + clay slip = waterproof",
      "Precursor skills for glassmaking kiln technique",
    ],
    prereqs: ["Farming", "Livestock"], x: 641, y: 923,
    scenario: "You need waterproof containers for storing grain, fermenting food, and carrying water. A potter begins shaping clay vessels, but the first batch crumbles when filled with water.",
    decisions: [
      { prompt: "The pots are porous and leak. What temperature do you need to reach to make clay truly watertight?", choices: ["300-500°C", "500-800°C", "Above 900°C — the impurities melt and form a glassy matrix", "Any campfire will do"], answer: 2, success: "Above 900°C, impurities in the clay melt and fuse into a glassy matrix between the clay particles. The result is watertight ceramic.", failure: "The potter adjusts the kiln. 'We need more heat — above 900 degrees. That's when the silica melts and seals the clay. Below that, it stays porous.'" },
      { prompt: "The potter throws salt into the kiln during firing. Why?", choices: ["To lower the temperature needed", "Sodium vapor reacts with silicon in the clay to form a glassy coating", "To prevent cracking", "It's a superstition"], answer: 1, success: "Salt glazing: sodium from the salt reacts with silicon in the clay at high temperature, forming a thin glass coating. Waterproof and beautiful.", failure: "The potter explains: 'The sodium bonds with silicon in the clay surface. Makes a natural glass coating — waterproof in one step.'" },
    ],
  },
  {
    id: "Surgery", name: "MEDICINE", era: 2, category: "medicine", icon: "🩹",
    title: "FIELD MEDICINE", flavor: "Sterilize EVERYTHING. Always.",
    details: [
      "Core truth: microbes cause infection (germ theory)",
      "Boil all instruments; wash hands with soap",
      "Willow bark = salicylic acid (proto-aspirin)",
      "Opium poppy: pain relief for surgery",
      "Superglue for wound closure (Vietnam-era method)",
    ],
    prereqs: ["Water", "Soap"], x: 641, y: 1085,
    scenario: "A worker's leg is badly broken and needs setting. There's no anesthesia, but someone found a stand of willow trees by the river and a patch of poppies in an overgrown garden.",
    decisions: [
      { prompt: "Your herbalist brews willow bark tea for the pain. What's the active ingredient — the same compound later modified to create aspirin?", choices: ["Acetic acid", "Salicylic acid", "Morphine", "Codeine"], answer: 1, success: "Willow bark contains salicylic acid — used for pain and fever since Hippocrates. Modified into acetylsalicylic acid (aspirin) to be gentler on the stomach.", failure: "The herbalist explains: 'Salicylic acid. Hippocrates used it 2,500 years ago. The drug companies later tweaked it into aspirin, but the bark works fine.'" },
      { prompt: "Before surgery, you need to sterilize the site. What concentration of ethanol is most effective?", choices: ["50%", "70%", "90%", "100% — pure alcohol"], answer: 1, success: "70% ethanol is ideal. Pure alcohol evaporates too quickly to kill microbes. The water in 70% solution helps it penetrate cell walls.", failure: "The nurse corrects you: '70%. Pure alcohol evaporates before it can kill anything. You need that 30% water to help it soak into the bacteria.'" },
    ],
  },

  // ═══════════ ERA 3: INDUSTRY ═══════════
  {
    id: "Iron", name: "MATERIALS", era: 3, category: "materials", icon: "⚒️",
    title: "IRON SMELTING", flavor: "Bloomery: charcoal+ore+bellows",
    details: [
      "Bloomery: clay shaft + charcoal + tuyere nozzle",
      "Ore: hematite Fe₂O₃, magnetite Fe₃O₄",
      "Reaches 1200°C — iron melts at 1538°C",
      "Bloom = spongy iron + slag; hammer out slag",
      "Dead cities = rich ore: rusted steel is Fe₂O₃",
    ],
    prereqs: ["Charcoal", "Lime"], x: 956, y: 170,
    scenario: "Your blacksmith is ready to smelt iron. She's built a bloomery furnace from clay, but needs to decide on an ore source. One team wants to mine hematite from a hillside. Another says the rusting cars in the dead city ARE the ore.",
    decisions: [
      { prompt: "The 'dead city' team argues that rusted steel IS iron ore. Are they right?", choices: ["No — rust is useless", "Yes — rusted steel is Fe₂O₃ (hematite), the same compound as natural iron ore", "Only if you melt it at over 2000°C", "Rust is a different chemical entirely"], answer: 1, success: "Rusted steel is iron oxide — chemically identical to hematite ore. The dead cities are the richest iron mines on the planet.", failure: "The blacksmith nods. 'Rust IS ore. Fe₂O₃. Every rusted car, every corroded beam — it's all hematite. The old cities are our mines.'" },
      { prompt: "Carbon in charcoal lowers iron's melting point. The blast furnace was invented far earlier than most people think. When?", choices: ["Roman Empire", "5th century BC — in China", "Medieval Europe around 1200 AD", "The Industrial Revolution"], answer: 1, success: "China had blast furnaces by the 5th century BC — nearly 2,000 years before Europe. Carbon from charcoal lowers iron's melting point to ~1,200°C.", failure: "The blacksmith is impressed when someone mentions: 'China. Fifth century BC. They had blast furnaces two millennia before Europe figured it out.'" },
    ],
  },
  {
    id: "Glass", name: "MATERIALS", era: 3, category: "materials", icon: "🔮",
    title: "GLASS MAKING", flavor: "Silica + soda/potash + lime → 1400°C",
    details: [
      "Batch: 70% silica sand + 15% soda ash + 15% lime",
      "Melt at 1400°C in clay crucible",
      "Blowing pipe for vessels; casting for flat panes",
      "Window glass: heat retention, year-round crops",
      "Ground glass lenses: telescope + microscope",
    ],
    prereqs: ["Lime", "Pottery"], x: 956, y: 341,
    scenario: "Window glass would transform your settlement — greenhouses for year-round food, sealed containers for chemistry, and eventually lenses for microscopes. Your kiln master says it starts with sand, ash, and lime.",
    decisions: [
      { prompt: "Pure silica melts at ~1,650°C — far too hot for your kiln. Why does adding soda ash and lime help?", choices: ["They make the glass stronger", "Soda ash is a flux that lowers the melting point; lime makes the glass insoluble in water", "They change the color", "They reduce fuel consumption but don't affect temperature"], answer: 1, success: "Soda ash (flux) drops the melting point dramatically. But soda-silica glass would dissolve in rain! Lime makes it insoluble. That's the soda-lime glass recipe used for 5,000 years.", failure: "The kiln master explains: 'Soda ash drops the melting point. But without lime, the glass dissolves in water. You need all three: silica, soda, lime.'" },
      { prompt: "Your settlement has glass. A craftsman grinds a piece into a lens. When did spectacles first appear in history?", choices: ["Ancient Rome", "Italy around 1285", "17th century", "The Industrial Revolution"], answer: 1, success: "Spectacles first appeared in Italy around 1285. Lenses will give your elders their vision back — and eventually lead to telescopes and microscopes.", failure: "The craftsman holds up his lens. 'Italy, 1285. Nearly 750 years ago. This is old technology — but it changes everything. Imagine a microscope.'" },
    ],
  },
  {
    id: "Paper", name: "COMM", era: 3, category: "comm", icon: "📜",
    title: "PAPER MAKING", flavor: "Macerate fiber, screen, press, dry",
    details: [
      "Beat rags or plant fiber (flax/hemp) in water",
      "Pour slurry onto mesh screen (mould & deckle)",
      "Press between felts; air dry flat",
      "Enables writing, record-keeping, printing press",
      "Wood pulp: requires acid/alkali digestion (later)",
    ],
    prereqs: ["Textiles"], x: 956, y: 512,
    scenario: "Knowledge is being lost. People forget techniques, measurements, recipes. You need a way to write things down permanently. A librarian says she can make paper from old clothes.",
    decisions: [
      { prompt: "Until the late 1800s, paper was made not from wood but from...", choices: ["Papyrus", "Recycled linen rags — clothing scraps", "Cotton", "Bark"], answer: 1, success: "For centuries, paper was made from rags — linen and cotton clothing scraps beaten into pulp. Wood pulp came much later and requires harsh chemical processing.", failure: "The librarian holds up a torn shirt. 'This is paper. Rags, not trees. Beat the fibers in water, screen them, press, dry. Civilization runs on this.'" },
      { prompt: "Paper was invented in China. How long ago?", choices: ["500 BC", "Around 100 AD — nearly 2,000 years ago", "500 AD", "1000 AD"], answer: 1, success: "Around 100 AD in China. It took over a millennium to reach Europe. Your settlement just reinvented one of humanity's most important technologies.", failure: "The librarian smiles. 'About 100 AD. China. It took over a thousand years to reach Europe. We just did it in a few months.'" },
    ],
  },
  {
    id: "Distillation", name: "CHEMICAL", era: 3, category: "chemical", icon: "⚗️",
    title: "DISTILLATION", flavor: "Ferment → heat → condense vapor",
    details: [
      "Ethanol BP 78°C vs water 100°C — separate by heat",
      "Brew: malted barley + yeast → wort → distill",
      "Ethanol: antiseptic, solvent, clean fuel",
      "Vinegar: oxidize ethanol → acetic acid",
      "Tinctures: dissolve medicinal plants in ethanol",
    ],
    prereqs: ["Preserve"], x: 956, y: 686,
    scenario: "Your clinic desperately needs antiseptic, your lamps need fuel, and your chemist needs a solvent. All three problems have one solution: distilled ethanol. But first you need to understand the chemistry.",
    decisions: [
      { prompt: "Ethanol boils at a different temperature than water. What is it?", choices: ["100°C — same as water", "78°C — lower than water, so it vaporizes first", "65°C", "90°C"], answer: 1, success: "Ethanol boils at 78°C, water at 100°C. Heat the fermented brew to between those temperatures and the ethanol vaporizes first, leaving water behind. Condense the vapor and you have spirits.", failure: "The chemist draws a diagram. '78 degrees. Heat to there and ethanol evaporates while water stays behind. Condense the vapor. That's distillation.'" },
      { prompt: "Fermentation stops on its own at a certain alcohol percentage because the yeast kills itself. What level?", choices: ["About 5%", "About 12%", "About 25%", "About 40%"], answer: 1, success: "Yeast dies in its own waste at about 12% alcohol — that's why wine maxes out there. Distillation is the only way to get higher concentrations.", failure: "The brewer explains: 'Yeast poisons itself at about 12%. That's why wine stops there. For anything stronger, you need to distill.'" },
    ],
  },
  {
    id: "Gunpowder", name: "MATERIALS", era: 3, category: "materials", icon: "💥",
    title: "GUNPOWDER", flavor: "KNO₃ 75% + C 15% + S 10%",
    details: [
      "Saltpeter (KNO₃): caves, old soil, dung heaps",
      "Urine + ash + air → potassium nitrate (weeks)",
      "PRIMARY USE: mining & demolishing ruins",
      "Enables access to deep ore deposits",
      "Acetylene torch from calcium carbide also useful",
    ],
    prereqs: ["Charcoal"], x: 956, y: 860,
    scenario: "You need to blast through rock to reach a deep ore deposit. The charcoal you've been making is one of the three ingredients for gunpowder. But you also need saltpeter and sulfur.",
    decisions: [
      { prompt: "The traditional gunpowder ratio is 6 parts charcoal to 1 part saltpeter to 1 part sulfur. But where do you find saltpeter?", choices: ["It grows on trees", "Caves, old soil, and especially dung heaps — bacteria convert nitrogen to nitrates", "Only from volcanic vents", "You have to synthesize it from scratch"], answer: 1, success: "Saltpeter (potassium nitrate) forms naturally in manure piles, caves, and old soil where bacteria convert nitrogen compounds to nitrates. Collect, dissolve in water, filter, and crystallize.", failure: "The chemist points at the dung heap. 'Bacteria in there are making saltpeter right now. Potassium nitrate. Dissolve, filter, boil, crystallize. Nature does most of the work.'" },
      { prompt: "To extract the saltpeter, you pour limewater through the dung pile. Why limewater specifically?", choices: ["It sterilizes the mixture", "It dissolves everything", "Calcium hydroxide picks up nitrate ions, then you swap calcium for potassium using potash", "It smells better"], answer: 2, success: "Limewater grabs the nitrate ions. Add potash and the potassium and calcium swap partners — insoluble calcium carbonate precipitates out, leaving soluble potassium nitrate in solution.", failure: "The chemist explains the ion exchange: 'Calcium grabs the nitrate, then potash swaps in the potassium. Filter out the calcium carbonate. What's left is pure KNO₃.'" },
    ],
  },
  {
    id: "Fertilizer", name: "FOOD", era: 3, category: "food", icon: "🌿",
    title: "FERTILIZER", flavor: "N · P · K from ash, bone, urine",
    details: [
      "Nitrogen: urine (urea), legume green manure",
      "Phosphorus: bone meal, guano (very concentrated)",
      "Potassium: wood ash (potash = K₂CO₃)",
      "Compost: all three + trace minerals",
      "Haber-Bosch (later): N₂ + H₂ → NH₃ = synthetic N",
    ],
    prereqs: ["CropRotation", "Livestock"], x: 956, y: 1037,
    scenario: "Your crop yields are plateauing. The soil needs three key nutrients — nitrogen, phosphorus, and potassium — and you need to figure out where to get each one without industrial chemistry.",
    decisions: [
      { prompt: "For nitrogen, your options are limited. Which is the best natural source?", choices: ["Seawater", "Wood ash", "Urine — it's rich in urea, which breaks down to ammonia and nitrogen compounds", "Ground-up rocks"], answer: 2, success: "Human and animal urine is nature's nitrogen fertilizer — rich in urea that breaks down to ammonia. Combined with legume cover crops, it's enough to sustain agriculture.", failure: "The agronomist doesn't sugarcoat it: 'Urine. It's full of urea — nitrogen. Every person produces about 500 liters a year. Don't waste it.'" },
      { prompt: "The Haber-Bosch process (converting atmospheric nitrogen to ammonia) feeds about a third of the world's population. What conditions does it need?", choices: ["Room temperature and normal pressure", "About 450°C and 200 atmospheres of pressure", "Sunlight and water", "Just a catalyst at low temperature"], answer: 1, success: "450°C, 200 atmospheres, with a porous iron catalyst. This is advanced technology — but knowing the target means your descendants can work toward it.", failure: "The chemist whistles. '450 degrees, 200 atmospheres. That's the Haber-Bosch process. It feeds a third of humanity. We're generations away, but knowing the goal matters.'" },
    ],
  },

  // ═══════════ ERA 4: ADVANCED ═══════════
  {
    id: "Steel", name: "MATERIALS", era: 4, category: "materials", icon: "⚙️",
    title: "STEEL + METALWORK", flavor: "0.2–2% carbon in iron = steel",
    details: [
      "Cast iron: >2% C (brittle, good for casting)",
      "Wrought iron: <0.1% C (soft, workable)",
      "Steel: 0.2–2% C (strong + elastic — best)",
      "Bessemer: blast air through molten iron → removes C",
      "Enables precision parts, springs, cutting tools",
    ],
    prereqs: ["Iron", "Gunpowder"], x: 1271, y: 170,
    scenario: "Your ironworkers produce two types of metal: brittle cast iron and soft wrought iron. Neither is ideal. Steel — with just the right amount of carbon — would be transformative. But getting the carbon content right is the challenge.",
    decisions: [
      { prompt: "Steel is iron with a specific carbon content. What range?", choices: ["Less than 0.1%", "0.2% to 2%", "2% to 3%", "3% to 4%"], answer: 1, success: "Steel: 0.2-2% carbon. Below that is wrought iron (soft). Above is cast iron (brittle). Steel is the sweet spot — strong AND elastic.", failure: "The blacksmith marks the range: '0.2 to 2 percent carbon. That's the magic zone. Below is too soft, above is too brittle. Steel is in between.'" },
      { prompt: "The Bessemer process revolutionized steelmaking. What's the core idea?", choices: ["Heat iron longer", "Blast air through molten pig iron to burn out the excess carbon", "Add more carbon", "Cool it faster"], answer: 1, success: "Blow air through molten pig iron — the oxygen burns excess carbon to CO₂. Remove ALL carbon, then add back exactly the percentage you want. Cheap mass production of steel.", failure: "The blacksmith explains: 'Blow air through the molten iron. Oxygen burns the carbon out as CO₂. Then add back the exact amount you need. That's the Bessemer trick.'" },
    ],
  },
  {
    id: "Steam", name: "ENERGY", era: 4, category: "energy", icon: "🚂",
    title: "STEAM ENGINE", flavor: "Watt's condenser: efficiency ×4",
    details: [
      "Newcomen: steam in cylinder, cold water condenses",
      "Watt: separate condenser — cylinder stays hot",
      "Powers mills, pumps, locomotion without animals",
      "Double-acting piston: power on both strokes",
      "Governor: flyball centrifugal speed regulation",
    ],
    prereqs: ["Iron", "Steel"], x: 1271, y: 341,
    scenario: "Your waterwheel works, but you need power everywhere — in the fields, the mines, the workshops. An engineer proposes a steam engine. It can burn scrap wood, agricultural waste, anything.",
    decisions: [
      { prompt: "Why is a steam engine more useful than an internal combustion engine after civilization falls?", choices: ["It's more efficient", "It can burn almost anything — wood, waste, coal, biomass", "It's simpler to maintain", "It produces more power"], answer: 1, success: "External combustion means any fuel works — scrap wood, dried dung, agricultural waste. No need for refined gasoline or diesel. That's the post-apocalypse advantage.", failure: "The engineer grins. 'This runs on ANYTHING that burns. Wood scraps, corn stalks, old furniture. Try that with a gasoline engine.'" },
      { prompt: "Watt's key improvement over the Newcomen engine was the separate condenser. Where did he get the idea for the centrifugal governor to regulate speed?", choices: ["He invented it from scratch", "From windmill technology", "From clockmakers", "From waterwheels"], answer: 1, success: "Watt borrowed the centrifugal governor from windmills, where spinning weights had regulated blade pitch for centuries. Great engineers steal shamelessly from other fields.", failure: "The engineer nods. 'Windmills. They've used spinning weights to regulate speed for centuries. Watt just bolted one onto a steam engine. Genius is knowing what to borrow.'" },
    ],
  },
  {
    id: "Printing", name: "COMM", era: 4, category: "comm", icon: "📰",
    title: "PRINTING PRESS", flavor: "Movable type → mass literacy",
    details: [
      "Gutenberg: individual cast metal letter types",
      "Set letters in frame, ink, press onto paper",
      "Knowledge spreads exponentially — defeats forgetting",
      "This book contains instructions to reproduce itself",
      "Clay type easier first; metal type lasts longer",
    ],
    prereqs: ["Paper"], x: 1271, y: 512,
    scenario: "Your scribes can barely keep up — every manual, every recipe, every medical guide has to be copied by hand. One error and lives are at risk. A metalworker proposes building a printing press.",
    decisions: [
      { prompt: "Gutenberg's breakthrough wasn't the press itself (which came from wine-making). What was his key innovation?", choices: ["Carving each page into a wood block", "Casting individual metal letter types in a reusable mould with a swappable matrix", "Using clay type", "Inventing paper"], answer: 1, success: "The adjustable mould with a swappable matrix — cast identical metal letters quickly, in any width. Set them, print thousands of copies, then reuse the letters. Knowledge becomes unstoppable.", failure: "The metalworker explains: 'It's the mould. A steel punch stamps a letter into copper. That matrix goes in an adjustable mould. Pour lead alloy. Identical type, every time.'" },
      { prompt: "Printing ink is different from writing ink. What's it made from?", choices: ["Water-based iron gall ink", "Lampblack (soot) mixed with linseed or walnut oil", "Carbon and gelatin", "India ink"], answer: 1, success: "Oil-based ink: lampblack (carbon soot) suspended in linseed or walnut oil. Water-based ink would bead off the metal type. The oil clings and transfers cleanly.", failure: "The printer shakes his head. 'Water-based ink beads off metal type. You need oil-based — lampblack in linseed oil. Thick, sticky, and it transfers perfectly.'" },
    ],
  },
  {
    id: "Electromag", name: "ENERGY", era: 4, category: "energy", icon: "🧲",
    title: "ELECTROMAGNETISM", flavor: "Current ↔ magnetic field (Faraday)",
    details: [
      "Oersted 1820: electric current deflects compass",
      "Faraday: moving magnet → current in coil",
      "Generator: spin coil in magnets = electricity",
      "Motor: electricity in coil → rotation (reversed)",
      "Electromagnet: coil + iron core + current = magnet",
    ],
    prereqs: ["OffGrid"], x: 1271, y: 698,
    scenario: "Your settlement has basic electricity from water wheels and alternators. But to build telegraph systems, motors, and generators, you need to understand the deep connection between electricity and magnetism.",
    decisions: [
      { prompt: "Someone holds a compass near a current-carrying wire and the needle deflects. This was first observed in the...", choices: ["1700s", "1820s — by Oersted", "1890s", "Ancient Greece"], answer: 1, success: "Oersted's 1820 discovery: electric current produces a magnetic field. This single observation opened the door to generators, motors, telegraphs, and all of electrical civilization.", failure: "A teacher speaks up: '1820. Hans Christian Oersted. A compass needle twitched next to a current-carrying wire. That one observation changed everything.'" },
      { prompt: "A car battery has 6 cells. Each lead-acid cell produces how much voltage?", choices: ["0.5V", "1V", "Just over 2V — hence 6 cells for 12V", "12V per cell"], answer: 2, success: "Each lead-acid cell produces just over 2 volts. Six cells in series gives the familiar 12V car battery. Understanding this lets you build battery banks of any voltage.", failure: "The electrician counts: 'Each cell is about 2 volts. Six cells times 2 volts equals 12 volts. Now you can design any battery bank you need.'" },
    ],
  },
  {
    id: "GermTheory", name: "MEDICINE", era: 4, category: "medicine", icon: "🔬",
    title: "GERM THEORY", flavor: "Microbes cause disease (Pasteur)",
    details: [
      "Pasteur's swan-neck flask: proves spontaneous gen. false",
      "Lister: carbolic acid (phenol) as surgical antiseptic",
      "Pasteurization: 72°C × 15s kills pathogens in milk",
      "Jenner: cowpox inoculation prevents smallpox",
      "Handwashing (Semmelweis) halves maternal mortality",
    ],
    prereqs: ["Soap", "Surgery", "Optics"], x: 1271, y: 860,
    scenario: "Your settlement has a microscope now, and the doctor has been examining water, food, and wound samples. She's seen tiny organisms everywhere. She wants to prove they cause disease — not 'bad air' or 'imbalanced humors.'",
    decisions: [
      { prompt: "She heats broth in a sealed flask, and it never spoils. She heats broth in an open flask, and it rots within days. What does this prove?", choices: ["Heat sterilizes food", "Microbes from the air cause spoilage — they don't appear spontaneously", "Sealed containers preserve food better", "Air itself causes rot"], answer: 1, success: "Pasteur's experiment: sealed heated broth stays sterile because no microbes can enter. Open broth rots because airborne microbes land in it. Germ theory proven.", failure: "The doctor explains: 'The sealed broth stayed sterile. The open broth rotted. The microbes came from the air — they don't just appear. That's germ theory.'" },
      { prompt: "Your dairy farmer wants to make milk safe to drink. At what temperature should it be heated?", choices: ["45-50°C", "65-70°C — briefly, to kill pathogens without ruining the taste", "90-100°C", "120°C"], answer: 1, success: "Pasteurization: heat to 65-70°C briefly. Kills tuberculosis bacteria and other pathogens while preserving nutrition and flavor. Named after Pasteur himself.", failure: "The doctor corrects: '65 to 70 degrees, just briefly. That's pasteurization. Kills the dangerous microbes without cooking the milk.'" },
    ],
  },
  {
    id: "Optics", name: "SCIENCE", era: 4, category: "science", icon: "🔭",
    title: "OPTICS + LENSES", flavor: "Two lenses = microscope / telescope",
    details: [
      "Grind glass on curved iron lap with abrasive",
      "Simple lens: 10× magnification achievable easily",
      "Compound microscope: two lenses, see bacteria",
      "Telescope: navigation by stars, distance warfare",
      "Spectacles: restore elder craftsmen's vision",
    ],
    prereqs: ["Glass"], x: 1271, y: 1022,
    scenario: "Your master glassmaker has produced clear glass. Now a craftsman wants to grind it into lenses. Two lenses in a tube could let you see bacteria — or stars. Either changes everything.",
    decisions: [
      { prompt: "Convex lenses correct which kind of vision problem?", choices: ["Nearsightedness", "Farsightedness — they converge light for eyes that focus too far", "Astigmatism", "Color blindness"], answer: 1, success: "Convex lenses converge light, correcting farsightedness. Your elder craftspeople — the most skilled workers — can see fine detail again. Spectacles restore a generation of expertise.", failure: "The optician explains: 'Convex for farsightedness — most of our elders. Get them seeing again and you get back decades of irreplaceable skill.'" },
      { prompt: "Of the six key scientific instruments of the 17th century (clock, thermometer, barometer, telescope, microscope, vacuum chamber), how many depend on glass?", choices: ["One", "Two", "Five — all except the clock", "All six"], answer: 2, success: "Five of six: thermometer, barometer, telescope, microscope, and vacuum chamber all require glass. Only the pendulum clock doesn't. Glass is the material of science.", failure: "The glassmaker counts on his fingers: 'Thermometer — glass. Barometer — glass. Telescope, microscope, vacuum chamber — all glass. Only the clock doesn't need me.'" },
    ],
  },

  // ═══════════ ERA 5: RENAISSANCE ═══════════
  {
    id: "Telegraph", name: "COMM", era: 5, category: "comm", icon: "📟",
    title: "TELEGRAPH", flavor: "Morse code + wire + electromagnet",
    details: [
      "Coil + iron core + current = electromagnet clicks",
      "Make-break circuit encodes dots and dashes",
      "Morse 1837 — but achievable much sooner with guide",
      "Enables long-distance coordination of civilization",
      "Foundation of all digital communication",
    ],
    prereqs: ["Steam", "Electromag"], x: 1586, y: 251,
    scenario: "Your settlements are spread across hundreds of miles. Messages take days by horse. An electrician says she can send information at the speed of light using nothing but wire, a battery, and an electromagnet.",
    decisions: [
      { prompt: "The telegraph is beautifully simple. How does it actually work?", choices: ["A light blinks at each end", "An electromagnet at the far end pulls a lever when current flows — clicks encode dots and dashes", "Sound travels through the wire", "Sparks jump between terminals"], answer: 1, success: "Current on: magnet pulls lever, click. Current off: lever releases. Short click = dot, long click = dash. That's Morse code. The foundation of all digital communication.", failure: "The electrician demonstrates: 'Current on, magnet pulls, click. Off, release. Short = dot, long = dash. That's it. That's the telegraph. That's the birth of the information age.'" },
      { prompt: "Over long distances, the signal weakens. How do you solve this?", choices: ["Use thicker wire", "Install relay stations that boost the current", "Just increase the voltage", "You can't — telegraph is limited to short distances"], answer: 1, success: "Relay stations: a weak incoming signal triggers a fresh local battery to send a strong signal onward. Chain relays across continents. Morse code circles the world.", failure: "The electrician draws a relay circuit. 'The incoming signal triggers a local switch. Fresh battery, full power. Chain them and you can send a message around the world.'" },
    ],
  },
  {
    id: "Penicillin", name: "MEDICINE", era: 5, category: "medicine", icon: "💊",
    title: "PENICILLIN", flavor: "Penicillium mold inhibits bacteria",
    details: [
      "Fleming 1928: mold halo = bacteria-free zone",
      "Grow Penicillium on bread, fruit, agar plates",
      "Extract with cold ethanol precipitation",
      "Effective vs gram-positive: S. aureus, strep, pneumo",
      "Saves from sepsis, pneumonia, wound infection",
    ],
    prereqs: ["GermTheory", "Distillation"], x: 1586, y: 422,
    scenario: "A scratch from a rusty nail has turned into a raging infection. Red lines are creeping up the patient's arm — sepsis. Without antibiotics, she'll die. Your microbiologist notices something on a contaminated culture plate: a ring of mold surrounded by a zone where no bacteria grow.",
    decisions: [
      { prompt: "This is the same observation Alexander Fleming made. When?", choices: ["1918", "1928 — on a Staphylococcus aureus plate", "1938", "1948"], answer: 1, success: "1928. Fleming noticed a clear zone around Penicillium mold on a staph plate. Others had seen it 50 years earlier but didn't follow up. Fleming did.", failure: "The microbiologist nods. '1928. Fleming. A contaminated plate, a ring of dead bacteria around the mold. The most important accident in medical history.'" },
      { prompt: "To purify penicillin from the mold broth, you exploit the fact that it's...", choices: ["More soluble in water than organic solvents", "More soluble in organic solvents like ether than in water", "Insoluble in everything — it precipitates out", "A solid crystal you can filter"], answer: 1, success: "Penicillin dissolves better in ether than water. Extract into ether, then back into alkaline water. Crude but effective — enough to save lives.", failure: "The chemist explains: 'Penicillin prefers organic solvents. Shake the broth with ether, the penicillin moves into the ether layer. Then extract back into water. Crude but life-saving.'" },
    ],
  },
  {
    id: "Clock", name: "SCIENCE", era: 5, category: "science", icon: "⏰",
    title: "MECH. CLOCK", flavor: "Escapement = controlled tick rate",
    details: [
      "Escapement: ratchet + pallet releases gear tooth-by-tooth",
      "Pendulum: Galileo's isochronous swing (period = √L)",
      "Accurate time: celestial navigation + longitude",
      "Synchronize industrial processes, shifts, schedules",
      "Verge-and-foliot first; pendulum clock far more accurate",
    ],
    prereqs: ["Steel"], x: 1586, y: 593,
    scenario: "Your factories need synchronized shifts. Your navigators need to calculate longitude. Both require accurate timekeeping. A clockmaker proposes a pendulum clock with an escapement mechanism.",
    decisions: [
      { prompt: "The escapement is the heart of the clock. What does it do?", choices: ["Powers the clock", "Releases the drive wheel one tooth at a time, controlled by the pendulum's swing", "Displays the time", "Winds the spring"], answer: 1, success: "The escapement converts continuous force (falling weight) into discrete, regular ticks. Each swing of the pendulum releases exactly one gear tooth. Tick. Tick. Tick.", failure: "The clockmaker points to the mechanism: 'Each swing of the pendulum releases one tooth. That's the escapement — it turns continuous force into countable, regular beats.'" },
      { prompt: "A pendulum that ticks once per second (half-period = 1s) needs to be how long?", choices: ["50 cm", "About 99.4 cm — almost exactly one meter", "1.5 meters", "2 meters"], answer: 1, success: "99.4 cm for a 1-second half-period. Almost exactly one meter — not a coincidence, since the meter was originally defined in relation to pendulum length.", failure: "The clockmaker measures carefully. '99.4 centimeters. Nearly a meter — which isn't a coincidence. The meter was originally defined partly through pendulum experiments.'" },
    ],
  },
  {
    id: "SciMethod", name: "SCIENCE", era: 5, category: "science", icon: "🧪",
    title: "SCIENTIFIC METHOD", flavor: "Hypothesis → Test → Theory",
    details: [
      "THE greatest invention (Dartnell's thesis)",
      "Feynman: 'all things made of atoms' — most info/word",
      "Falsifiability (Popper): must be testable & disprovable",
      "Controlled experiment: change one variable at a time",
      "Peer review: knowledge becomes collective & cumulative",
      "Printing press makes it self-reinforcing",
    ],
    prereqs: ["Printing", "Optics", "Clock"], x: 1586, y: 767,
    scenario: "Your civilization has printing, optics, and accurate clocks. You have the tools. But the most powerful technology of all isn't a device — it's a way of thinking. A philosopher proposes formal rules for how knowledge is created and tested.",
    decisions: [
      { prompt: "According to Lewis Dartnell, 'the greatest invention of all' is not any physical device but...", choices: ["The printing press", "The steam engine", "The scientific method itself — a process for generating reliable knowledge", "The telescope"], answer: 2, success: "The scientific method: hypothesis, controlled experiment, peer review, self-correction. Not a thing but a process. It makes all other inventions possible — and it makes itself better over time.", failure: "The philosopher smiles. 'Not a machine. Not a tool. The method itself — the process of asking questions, testing answers, and accepting when you're wrong. That's the greatest invention.'" },
      { prompt: "If you could pass only one sentence of science to the next generation, Feynman said it should be about...", choices: ["Relativity", "The atomic hypothesis — 'all things are made of atoms'", "Evolution", "Electromagnetism"], answer: 1, success: "Feynman: 'All things are made of atoms — little particles that move around in perpetual motion, attracting each other when they are a little distance apart, but repelling upon being squeezed into one another.' The most information in the fewest words.", failure: "The philosopher quotes Feynman: 'All things are made of atoms. That single sentence contains more information about the world than any other.' That's the seed of a new civilization." },
    ],
  },
  {
    id: "Photography", name: "SCIENCE", era: 5, category: "science", icon: "📷",
    title: "PHOTOGRAPHY", flavor: "AgBr on glass, light → reduces Ag⁺",
    details: [
      "Silver halides (AgBr, AgCl) sensitive to light",
      "Exposure: photons reduce Ag⁺ ions to Ag metal",
      "Developer (pyrogallol): amplifies latent image",
      "Fixer (sodium thiosulfate): dissolves unreacted AgBr",
      "Records observations reliably; enables spectroscopy",
    ],
    prereqs: ["Distillation", "Glass"], x: 1586, y: 935,
    scenario: "Your scientists need to record observations permanently and precisely — no more relying on sketches. A chemist discovers that silver compounds darken in sunlight. She thinks she can capture images on glass.",
    decisions: [
      { prompt: "After exposing a plate to light, you need a 'fixer' to stop the reaction and preserve the image. What chemical is used?", choices: ["Silver nitrate", "Sodium thiosulfate — nicknamed 'hypo'", "Ferrous sulfate", "Sulfuric acid"], answer: 1, success: "Sodium thiosulfate ('hypo') dissolves the unexposed silver halides, leaving only the darkened metallic silver that forms the image. Without it, the whole plate would eventually go dark.", failure: "The chemist holds up a bottle. 'Sodium thiosulfate — hypo. It dissolves the unexposed silver. Without it, your image keeps darkening until it's ruined.'" },
      { prompt: "Silver is precious. How many photographic prints can you get from a single silver teaspoon?", choices: ["About 100", "About 500", "Over 1,500", "About 5,000"], answer: 2, success: "A single silver teaspoon yields over 1,500 prints. A little silver goes an extraordinarily long way — enough to document your entire civilization's knowledge.", failure: "The chemist calculates. 'Over 1,500 prints from one teaspoon. Silver halide films use incredibly thin layers. We have enough silver in this settlement to photograph everything.'" },
    ],
  },
  {
    id: "IntlCombustion", name: "ENERGY", era: 5, category: "energy", icon: "🔧",
    title: "INT'L COMBUSTION", flavor: "Diesel: compress → inject → ignite",
    details: [
      "4-stroke: intake, compress, combust, exhaust",
      "Diesel cycle: compression ignition (no spark plug)",
      "Vegetable/biofuel oils work in diesel engines",
      "Next civilization: biofuel-powered (fossil fuels depleted)",
      "Enables vehicles, pumps, generators, agriculture",
    ],
    prereqs: ["Steel"], x: 1586, y: 1103,
    scenario: "Steam engines are powerful but huge. Your engineers want something compact for vehicles and portable generators. They propose an internal combustion engine — but fossil fuels are running out. The next civilization needs a different fuel strategy.",
    decisions: [
      { prompt: "A diesel engine doesn't need spark plugs. How does it ignite the fuel?", choices: ["A glow plug heats the fuel", "Pure compression — squeezing air until it's hot enough to ignite injected fuel", "An external flame", "Chemical ignition"], answer: 1, success: "Diesel cycle: compress air so hard it reaches ignition temperature, then inject fuel. It ignites on contact. No spark plugs, no electrical ignition system. Robust and simple.", failure: "The engineer demonstrates: 'Compress the air until it's scorching hot. Inject the fuel — boom. That's diesel. No spark needed. Rudolf Diesel knew this would outlast gasoline.'" },
      { prompt: "With fossil fuels depleted, what can diesel engines run on?", choices: ["Nothing — they're useless without petroleum", "Vegetable oil and biofuels — Rudolf Diesel originally designed his engine for agricultural oils", "Only coal dust", "Hydrogen"], answer: 1, success: "Diesel himself demonstrated his engine running on peanut oil at the 1900 World's Fair. Biofuels from crops make the internal combustion engine sustainable for the next civilization.", failure: "The engineer reads from a history book: 'Diesel ran his first engine on peanut oil in 1900. He always intended it for agricultural fuels. The petroleum era was a detour.'" },
    ],
  },
];

export const CONNECTIONS: Connection[] = [
  // ERA 0 → ERA 1
  { from: "Food", to: "Farming", color: "#27ae60", path: "M 293 237 C 315 237 323 408 326 408", width: 1.2, opacity: 0.55 },
  { from: "Food", to: "Preserve", color: "#27ae60", path: "M 293 237 C 315 237 323 732 326 732", width: 1, opacity: 0.4 },
  { from: "Fuel", to: "OffGrid", color: "#d68910", path: "M 293 408 C 315 408 323 570 326 570", width: 1.2, opacity: 0.55 },
  { from: "Meds", to: "Water", color: "#c0392b", path: "M 293 570 C 315 570 323 237 326 237", width: 1.2, opacity: 0.55 },
  { from: "Shelter", to: "Farming", color: "#27ae60", path: "M 293 732 C 315 732 323 408 326 408", width: 1, opacity: 0.4 },
  { from: "Shelter", to: "Livestock", color: "#27ae60", path: "M 293 732 C 315 732 323 894 326 894", width: 1.2, opacity: 0.55 },
  { from: "Radio", to: "OffGrid", color: "#3498db", path: "M 293 894 C 315 894 323 570 326 570", width: 0.8, opacity: 0.3 },
  { from: "Batteries", to: "OffGrid", color: "#d68910", path: "M 293 1056 C 315 1056 323 570 326 570", width: 1.2, opacity: 0.55 },

  // ERA 1 → ERA 2
  { from: "Water", to: "Soap", color: "#c0392b", path: "M 608 237 C 630 237 638 336 641 336", width: 1.2, opacity: 0.55 },
  { from: "Farming", to: "CropRotation", color: "#27ae60", path: "M 608 408 C 630 408 638 168 641 168", width: 1.2, opacity: 0.55 },
  { from: "Livestock", to: "Textiles", color: "#7f8c8d", path: "M 608 894 C 630 894 638 822 641 822", width: 1.2, opacity: 0.55 },

  // ERA 1 → ERA 3 (skip-era)
  { from: "OffGrid", to: "Electromag", color: "#d68910", path: "M 608 570 C 825 570 1080 765 1271 765", dashed: true, width: 0.9, opacity: 0.3 },
  { from: "Preserve", to: "Distillation", color: "#7d3c98", path: "M 608 732 C 750 732 870 753 956 753", dashed: true, width: 0.9, opacity: 0.35 },
  { from: "Livestock", to: "Fertilizer", color: "#27ae60", path: "M 608 894 C 750 894 870 1104 956 1104", dashed: true, width: 0.9, opacity: 0.35 },

  // ERA 2 → ERA 3
  { from: "CropRotation", to: "Fertilizer", color: "#27ae60", path: "M 923 168 C 953 168 953 1104 956 1104", width: 1, opacity: 0.45 },
  { from: "Charcoal", to: "Iron", color: "#7f8c8d", path: "M 923 504 C 953 504 953 237 956 237", width: 1.4, opacity: 0.6 },
  { from: "Charcoal", to: "Gunpowder", color: "#7f8c8d", path: "M 923 504 C 953 504 953 927 956 927", width: 1.2, opacity: 0.5 },
  { from: "Lime", to: "Glass", color: "#7f8c8d", path: "M 923 672 C 953 672 953 408 956 408", width: 1.2, opacity: 0.55 },
  { from: "Textiles", to: "Paper", color: "#3498db", path: "M 923 822 C 953 822 953 579 956 579", width: 1.2, opacity: 0.55 },
  { from: "Pottery", to: "Glass", color: "#7f8c8d", path: "M 923 990 C 953 990 953 408 956 408", width: 1, opacity: 0.4 },

  // ERA 2 → ERA 4 (skip-era)
  { from: "Soap", to: "GermTheory", color: "#c0392b", path: "M 923 336 C 1125 336 1185 927 1271 927", dashed: true, width: 0.9, opacity: 0.3 },
  { from: "Surgery", to: "GermTheory", color: "#c0392b", path: "M 923 1152 C 1125 1152 1185 927 1271 927", dashed: true, width: 0.9, opacity: 0.3 },
  { from: "Surgery", to: "Penicillin", color: "#c0392b", path: "M 923 1152 C 1200 1152 1350 489 1586 489", dashed: true, width: 0.8, opacity: 0.25 },

  // ERA 3 → ERA 4
  { from: "Iron", to: "Steel", color: "#7f8c8d", path: "M 1238 237 C 1260 237 1268 237 1271 237", width: 1.6, opacity: 0.65 },
  { from: "Iron", to: "Steam", color: "#d68910", path: "M 1238 237 C 1260 237 1268 408 1271 408", width: 1.2, opacity: 0.55 },
  { from: "Glass", to: "Optics", color: "#148f77", path: "M 1238 408 C 1268 408 1268 1089 1271 1089", width: 1.2, opacity: 0.55 },
  { from: "Paper", to: "Printing", color: "#3498db", path: "M 1238 579 C 1260 579 1268 579 1271 579", width: 1.6, opacity: 0.65 },
  { from: "Gunpowder", to: "Steel", color: "#7f8c8d", path: "M 1238 927 C 1268 927 1268 237 1271 237", width: 1, opacity: 0.4 },

  // ERA 3 → ERA 5 (skip-era)
  { from: "Distillation", to: "Penicillin", color: "#7d3c98", path: "M 1238 753 C 1425 753 1440 489 1586 489", dashed: true, width: 0.9, opacity: 0.35 },
  { from: "Distillation", to: "Photography", color: "#7d3c98", path: "M 1238 753 C 1425 753 1440 987 1586 987", dashed: true, width: 0.9, opacity: 0.35 },
  { from: "Fertilizer", to: "SciMethod", color: "#27ae60", path: "M 1238 1104 C 1425 1104 1440 834 1586 834", dashed: true, width: 0.9, opacity: 0.3 },
  { from: "Glass", to: "Photography", color: "#148f77", path: "M 1238 408 C 1470 408 1470 987 1586 987", dashed: true, width: 0.8, opacity: 0.25 },

  // ERA 4 → ERA 5
  { from: "Steel", to: "IntlCombustion", color: "#d68910", path: "M 1553 237 C 1575 237 1578 1167 1586 1167", width: 1.2, opacity: 0.55 },
  { from: "Steam", to: "Telegraph", color: "#3498db", path: "M 1553 408 C 1575 408 1578 318 1586 318", width: 1.2, opacity: 0.55 },
  { from: "Printing", to: "SciMethod", color: "#148f77", path: "M 1553 579 C 1575 579 1578 834 1586 834", width: 1.2, opacity: 0.55 },
  { from: "Electromag", to: "Telegraph", color: "#3498db", path: "M 1553 765 C 1575 765 1578 318 1586 318", width: 1.4, opacity: 0.65 },
  { from: "GermTheory", to: "Penicillin", color: "#c0392b", path: "M 1553 927 C 1575 927 1578 489 1586 489", width: 1.4, opacity: 0.65 },
  { from: "Optics", to: "SciMethod", color: "#148f77", path: "M 1553 1089 C 1575 1089 1578 834 1586 834", width: 1.2, opacity: 0.55 },

  // WITHIN ERA 4
  { from: "Steel", to: "Steam", color: "#d68910", path: "M 1412 303 L 1412 342", width: 1, opacity: 0.5 },
  { from: "Optics", to: "GermTheory", color: "#c0392b", path: "M 1412 1008 L 1412 972", width: 1, opacity: 0.4 },

  // WITHIN ERA 5
  { from: "Clock", to: "SciMethod", color: "#148f77", path: "M 1727 720 L 1727 768", width: 1, opacity: 0.5 },

  // WITHIN ERA 2
  { from: "Lime", to: "Soap", color: "#c0392b", path: "M 782 606 L 782 402", dashed: true, width: 1, opacity: 0.4 },
];

export const ERA_LABELS = [
  { era: 0, label: "SURVIVAL", sub: "DAY 0–30", x: 11, color: "#999", border: "#555" },
  { era: 1, label: "STABILITY", sub: "MONTH 1–12", x: 326, color: "#99aaff", border: "#445" },
  { era: 2, label: "FOUNDATION", sub: "YEAR 1–5", x: 641, color: "#88cc88", border: "#4a6" },
  { era: 3, label: "INDUSTRY", sub: "YEAR 5–20", x: 956, color: "#ffbb66", border: "#a73" },
  { era: 4, label: "ADVANCED", sub: "YEAR 20–50", x: 1271, color: "#ff8888", border: "#a44" },
  { era: 5, label: "RENAISSANCE", sub: "YEAR 50+", x: 1586, color: "#ffff88", border: "#aa4" },
];

export const CATEGORY_COLORS: Record<string, { border: string; bg: string; header: string; text: string }> = {
  food:     { border: "#27ae60", bg: "#071a0e", header: "#0e3319", text: "#2ecc71" },
  energy:   { border: "#d68910", bg: "#1c1000", header: "#3d2400", text: "#f39c12" },
  materials:{ border: "#7f8c8d", bg: "#111111", header: "#222222", text: "#bdc3c7" },
  medicine: { border: "#c0392b", bg: "#1a0808", header: "#3d0d0d", text: "#e74c3c" },
  comm:     { border: "#2471a3", bg: "#070f1a", header: "#0d2035", text: "#3498db" },
  chemical: { border: "#7d3c98", bg: "#120a1c", header: "#28105a", text: "#a569bd" },
  science:  { border: "#148f77", bg: "#061510", header: "#0e3028", text: "#1abc9c" },
};

export const ERA_INTROS: Record<number, { title: string; text: string }> = {
  0: {
    title: "THE FALL",
    text: "The world ended three days ago. You stand in the ruins of what was once a city of millions. The grid is dead. The shelves are full — for now. What you do in the next 30 days will determine whether your small band of survivors lives or dies.",
  },
  1: {
    title: "SETTLING IN",
    text: "A month has passed. You've found shelter, gathered supplies, and made contact with other survivors by radio. But scavenged goods won't last forever. It's time to build something that can sustain itself — clean water, farming, livestock, and reliable power.",
  },
  2: {
    title: "LAYING FOUNDATIONS",
    text: "Year one. Your settlement survives, but barely. To truly rebuild, you need the skills of past centuries — soap to fight disease, charcoal to smelt metal, textiles for clothing, pottery for storage. The knowledge of a thousand generations, relearned from scratch.",
  },
  3: {
    title: "THE FORGE",
    text: "Year five. Iron changes everything. With metal tools, glass vessels, paper records, and chemical knowledge, your settlement transforms from a survival camp into an industrial community. The pace of progress accelerates.",
  },
  4: {
    title: "THE LEAP",
    text: "Year twenty. Steel, steam power, the printing press, electromagnetism — your civilization is recapitulating millennia of progress in decades. But the most powerful discoveries lie ahead: germ theory, optics, and the machines that connect distant settlements.",
  },
  5: {
    title: "RENAISSANCE",
    text: "Year fifty. The telegraph links your settlements. Penicillin saves lives that would have been lost. Clocks synchronize industry. Photography records the world. And now, the greatest invention of all — not a device, but a way of thinking — awaits.",
  },
};
