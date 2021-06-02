export const modifiers = [
  {
    label: "Corrupted",
    default: 1,
    enabled: 1.2,
  },
  {
    label: "Splash",
    default: 1,
    enabled: .33,
  },
  {
    label: "Hallucinated",
    default: 1,
    enabled: 2,
  },
  {
    label: "Prismatic",
    default: 1,
    enabled: 1.2,
  },
  {
    label: "Bypass",
    default: 1,
    enabled: 0,
  },
  {
    label: "Spell",
    default: 1,
    enabled: 0,
  },
  {
    label: "Hardened",
    default: 900,
    enabled: 10,
  },
  {
    label: "Guardian",
    default: 0,
    enabled: 2,
  },
];


// BARRACKS
export const marauder = {
  name: "Marauder",
  types: ["Ground", "Armored", "Biological"],
  faction: "Terran",
  structure: "barracks",
  research:{
    armor: 1,
  },
  base: {
    health: 125,
    armor: 1,
  },
  attacks: [
    {
      name: "Punisher Grenades",
      researchBonus: 1,
      targets: ["Ground"],
      baseDamage: 10,
      repeats: 1,
      bonuses: [
        {to: "Armored", baseDamage: 10, researchBonus:1}
      ]
    },
  ],
  img: "/marauder.png"
}

export const marine = {
  name: "Marine",
  types: ["Ground", "Light", "Biological"],
  faction: "Terran",
  structure: "barracks",
  research:{
    armor: 1,
  },
  base: {
    health: 45,
    armor: 0,
  },
  attacks: [
    {
      name: "C-14 Gauss Rifle",
      researchBonus: 1,
      targets: ["Ground", "Air"],
      baseDamage: 6,
      repeats: 1,
      bonuses: []
    },
  ],
  img: "/marine-unit.png"
}

export const reaper = {
  name: "Reaper",
  types: ["Ground", "Light", "Biological"],
  faction: "Terran",
  structure: "barracks",
  research:{
    armor: 1,
  },
  base: {
    health: 60,
    armor: 0,
  },
  attacks: [
    {
      name: "P-45 Gauss Pistol",
      researchBonus: 1,
      targets: ["Ground"],
      baseDamage: 4,
      repeats: 2,
      bonuses: []
    },
  ],
  img: "/reaper.png"
}

export const ghost = {
  name: "Ghost",
  types: ["Ground", "Psionic", "Biological"],
  faction: "Terran",
  structure: "barracks",
  research:{
    armor: 1,
  },
  base: {
    health: 100,
    armor: 0,
  },
  attacks: [
    {
      name: "C-10 Canister Rifle",
      researchBonus: 1,
      targets: ["Ground", "Air"],
      baseDamage: 10,
      repeats: 1,
      bonuses: [
        {to: "Light", baseDamage: 10, researchBonus:1}
      ]
    },
  ],
  img: "/ghost.png"
}

// FACTORY
export const tank = {
  name: "Siege Tank",
  types: ["Ground", "Armored", "Mechanical"],
  faction: "Terran",
  structure: "factory",
  research:{
    armor: 1,
  },
  base: {
    health: 175,
    armor: 1,
  },
  attacks: [
    {
      name: "90 mm Cannon (tank)",
      researchBonus: 2,
      targets: ["Ground"],
      baseDamage: 15,
      repeats: 1,
      bonuses: [
        {to: "Armored", baseDamage: 10, researchBonus:1}
      ]
    },
    {
      name: "Shock Cannon (siege)",
      researchBonus: 4,
      targets: ["Ground"],
      baseDamage: 40,
      repeats: 1,
      bonuses: [
        {to: "Armored", baseDamage: 30, researchBonus:1}
      ]
    },
  ],
  img: "/tank.png"
}

export const cyclone = {
  name: "Cyclone",
  types: ["Ground", "Armored", "Mechanical"],
  faction: "Terran",
  structure: "factory",
  research:{
    armor: 1,
  },
  base: {
    health: 120,
    armor: 1,
  },
  attacks: [
    {
      name: "Typhoon Missile Pod",
      researchBonus: 2,
      targets: ["Ground"],
      baseDamage: 18,
      repeats: 1,
      bonuses: [    ]
    },
  ],
  img: "/cyclone.png"
}

export const hellion = {
  name: "Hellion",
  types: ["Ground", "Light", "Mechanical"],
  faction: "Terran",
  structure: "factory",
  research:{
    armor: 1,
  },
  base: {
    health: 90,
    armor: 0,
  },
  attacks: [
    {
      name: "Infernal Flamethrower",
      researchBonus: 1,
      targets: ["Ground"],
      baseDamage: 8,
      repeats: 1,
      bonuses: [
        {to: "Light", baseDamage: 6, researchBonus:1}
      ]
    },
    {
      name: "Infernal Flamethrower (Pre-Igniter)",
      researchBonus: 1,
      targets: ["Ground"],
      baseDamage: 8,
      repeats: 1,
      bonuses: [
        {to: "Light", baseDamage: 11, researchBonus:1}
      ]
    },
  ],
  img: "/hellion.png"
}

export const hellbat = {
  name: "Hellbat",
  types: ["Ground", "Biological", "Light", "Mechanical"],
  faction: "Terran",
  structure: "factory",
  research:{
    armor: 1,
  },
  base: {
    health: 175,
    armor: 0,
  },
  attacks: [
    {
      name: "Napalm Spray",
      researchBonus: 2,
      targets: ["Ground"],
      baseDamage: 18,
      repeats: 1,
      bonuses: [
        {to: "Light", baseDamage: 0, researchBonus:1}
      ]
    },
    {
      name: "Napalm Spray (Pre-Igniter)",
      researchBonus: 2,
      targets: ["Ground"],
      baseDamage: 18,
      repeats: 1,
      bonuses: [
        {to: "Light", baseDamage: 12, researchBonus:1}
      ]
    },
  ],
  img: "/hellbat.png"
}

export const thor = {
  name: "Thor",
  types: ["Ground", "Armored", "Massive", "Mechanical"],
  faction: "Terran",
  structure: "factory",
  research:{
    armor: 1,
  },
  base: {
    health: 400,
    armor: 4,
  },
  attacks: [
    {
      name: "Thor's Hammer",
      researchBonus: 3,
      targets: ["Ground"],
      baseDamage: 30,
      repeats: 2,
      bonuses: []
    },
    {
      name: "Javelin Missile Launchers",
      researchBonus: 1,
      targets: ["Air"],
      baseDamage: 6,
      repeats: 4,
      bonuses: [
        {to: "Light", baseDamage: 6, researchBonus:1}
      ]
    },
    {
      name: "250mm Punisher Cannons",
      researchBonus: 3,
      targets: ["Air"],
      baseDamage: 25,
      repeats: 1,
      bonuses: [
        {to: "Massive", baseDamage: 10, researchBonus:1}
      ]
    },
  ],
  img: "/thor.png"
}

// STARPORT
export const landedViking = {
  name: "(landed) Viking",
  types: ["Ground", "Armored", "Mechanical"],
  faction: "Terran",
  structure: "starport",
  research:{
    armor: 1,
  },
  base: {
    health: 135,
    armor: 0,
  },
  attacks: [
    {
      name: "Gatling Cannon",
      researchBonus: 1,
      targets: ["Ground"],
      baseDamage: 12,
      repeats: 1,
      bonuses: [
        {to: "Mechanical", baseDamage: 8, researchBonus:1}
      ]
    },
  ],
  img: "/landedViking.png"
}

export const viking = {
  name: "Viking",
  types: ["Air", "Armored", "Mechanical"],
  faction: "Terran",
  structure: "starport",
  research:{
    armor: 1,
  },
  base: {
    health: 135,
    armor: 0,
  },
  attacks: [
    {
      name: "Lanzer Torpedoes",
      researchBonus: 1,
      targets: ["Air"],
      baseDamage: 10,
      repeats: 2,
      bonuses: [
        {to: "Armored", baseDamage: 4, researchBonus:0}
      ]
    },
  ],
  img: "/viking.png"
}

export const medivac = {
  name: "Medivac",
  types: ["Air", "Armored", "Mechanical"],
  faction: "Terran",
  structure: "starport",
  research:{
    armor: 1,
  },
  base: {
    health: 150,
    armor: 1,
  },
  attacks: [],
  img: "/medivac.png"
}

export const immortal = {
  name: "Immortal",
  types: ["Ground", "Armored", "Mechanical"],
  faction: "Protoss",
  structure: "roboticsFacility",
  research: {
    shields: 1,
    armor: 1,
  },
  base: {
    shields: 100,
    health: 200,
    armor: 1,
  },
  attacks: [
    {
      name: "Phase Disruptors",
      targets: ["Ground"],
      baseDamage: 20,
      researchBonus: 2,
      repeats: 1,
      bonuses: [
        {to: "Armored", baseDamage: 30, researchBonus: 3}
      ]
    },
  ],
  
  img: "http://gadgetsin.com/uploads/2010/11/starcraft_2_immortal_paper_craft_1.jpg",
}

export const units = [marauder, marine, reaper, ghost, 
                      hellion, hellbat, tank, cyclone, thor,
                      landedViking, viking,medivac,
                      immortal]