var AVENTURE = AVENTURE || {};

AVENTURE.badges = [
  {
    id: "premier_pas",
    nom: "Premier Pas",
    description: "Tu as complete ton premier scenario !",
    icon: "\u2b50",
    condition: { type: "scenariosCompleted", count: 1 }
  },
  {
    id: "curieux",
    nom: "Curieux",
    description: "Tu as explore 3 scenarios differents.",
    icon: "\ud83d\udd0d",
    condition: { type: "scenariosCompleted", count: 3 }
  },
  {
    id: "explorateur",
    nom: "Explorateur",
    description: "Tu as explore 6 scenarios differents.",
    icon: "\ud83e\udded",
    condition: { type: "scenariosCompleted", count: 6 }
  },
  {
    id: "aventurier",
    nom: "Aventurier Complet",
    description: "Tu as termine les 11 scenarios. Bravo !",
    icon: "\ud83c\udfc6",
    condition: { type: "scenariosCompleted", count: 11 }
  },
  {
    id: "fiches5",
    nom: "Lecteur de Fiches",
    description: "Tu as consulte 5 fiches metier.",
    icon: "\ud83d\udcda",
    condition: { type: "careersViewed", count: 5 }
  },
  {
    id: "fiches15",
    nom: "Expert Metiers",
    description: "Tu as consulte 15 fiches metier.",
    icon: "\ud83c\udf93",
    condition: { type: "careersViewed", count: 15 }
  },
  {
    id: "pilote",
    nom: "Pilote en Herbe",
    description: "Tu as explore le scenario de l'aeroport.",
    icon: "\u2708\ufe0f",
    condition: { type: "specificScenario", scenarioId: "aeroport" }
  },
  {
    id: "points100",
    nom: "Cent Points",
    description: "Tu as accumule 100 points d'experience.",
    icon: "\ud83d\udcaf",
    condition: { type: "points", count: 100 }
  }
];
