import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const sectors = [
  { id: "sante", color: "--color-sante", name: "Santé" },
  { id: "informatique", color: "--color-informatique", name: "Informatique" },
  { id: "commerce", color: "--color-commerce", name: "Commerce" },
  { id: "construction", color: "--color-construction", name: "Construction" },
  { id: "technique", color: "--color-technique", name: "Technique / Industrie" },
  { id: "artisanat", color: "--color-artisanat", name: "Artisanat" },
  { id: "gastronomie", color: "--color-gastronomie", name: "Gastronomie" },
  { id: "nature", color: "--color-nature", name: "Nature" },
  { id: "social", color: "--color-social", name: "Social" },
  { id: "automobile", color: "--color-automobile", name: "Automobile" },
  { id: "aeronautique", color: "--color-aeronautique", name: "Aéronautique" },
];

const professions = [
  // ===== SANTÉ =====
  {
    id: "assc",
    sectorId: "sante",
    type: "CFC",
    duration: 3,
    icon: "⚕️",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=947",
    profil: { manuel: 6, intellectuel: 5, creatif: 3, analytique: 5, interieur: 8, exterieur: 2, equipe: 8, independant: 3, contactHumain: 10, technique: 4, routine: 5, variete: 7 },
    fr: {
      name: "Assistant/e en soins et santé communautaire CFC",
      description: "Accompagne et soigne des personnes de tout âge dans les hôpitaux, les EMS et les services de soins à domicile.",
      activities: [
        "Soigner et accompagner les patients au quotidien",
        "Administrer des médicaments selon les directives",
        "Observer l'état de santé et transmettre les informations",
        "Aider aux repas, à la toilette et aux déplacements",
      ],
      qualities: ["Empathie", "Résistance physique", "Sens de l'observation", "Travail en équipe"],
    },
    salary: { apprenticeYear1: 850, apprenticeYear2: 1050, apprenticeYear3: 1400, apprenticeYear4: null, postCfcMin: 4500, postCfcMax: 5500 },
  },
  {
    id: "assistantPharmacie",
    sectorId: "sante",
    type: "CFC",
    duration: 3,
    icon: "💊",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=19",
    profil: { manuel: 4, intellectuel: 7, creatif: 2, analytique: 7, interieur: 10, exterieur: 0, equipe: 5, independant: 6, contactHumain: 8, technique: 6, routine: 7, variete: 4 },
    fr: {
      name: "Assistant/e en pharmacie CFC",
      description: "Conseille la clientèle en pharmacie, prépare des médicaments et gère les stocks de produits pharmaceutiques.",
      activities: [
        "Conseiller les clients sur les médicaments",
        "Préparer des ordonnances",
        "Gérer les stocks et les commandes",
        "Vérifier les interactions médicamenteuses",
      ],
      qualities: ["Précision", "Sens du contact", "Discrétion", "Esprit scientifique"],
    },
    salary: { apprenticeYear1: 700, apprenticeYear2: 900, apprenticeYear3: 1200, apprenticeYear4: null, postCfcMin: 4300, postCfcMax: 5200 },
  },
  {
    id: "laborantin",
    sectorId: "sante",
    type: "CFC",
    duration: 3,
    icon: "🔬",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=1375",
    profil: { manuel: 5, intellectuel: 8, creatif: 3, analytique: 10, interieur: 10, exterieur: 0, equipe: 4, independant: 8, contactHumain: 2, technique: 9, routine: 6, variete: 5 },
    fr: {
      name: "Laborantin/e CFC (chimie)",
      description: "Réalise des analyses et des expériences en laboratoire dans les domaines de la chimie, la biologie ou la pharmacie.",
      activities: [
        "Préparer et réaliser des expériences",
        "Analyser des échantillons au microscope",
        "Documenter les résultats avec précision",
        "Entretenir les appareils de laboratoire",
      ],
      qualities: ["Précision", "Patience", "Esprit scientifique", "Méthode"],
    },
    salary: { apprenticeYear1: 700, apprenticeYear2: 880, apprenticeYear3: 1180, apprenticeYear4: null, postCfcMin: 4800, postCfcMax: 6000 },
  },

  // ===== INFORMATIQUE =====
  {
    id: "informaticien",
    sectorId: "informatique",
    type: "CFC",
    duration: 4,
    icon: "💻",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=152",
    profil: { manuel: 2, intellectuel: 9, creatif: 6, analytique: 9, interieur: 9, exterieur: 1, equipe: 6, independant: 7, contactHumain: 4, technique: 10, routine: 3, variete: 8 },
    fr: {
      name: "Informaticien/ne CFC",
      description: "Développe des logiciels, gère des réseaux et résout des problèmes informatiques complexes.",
      activities: [
        "Programmer des applications et des sites web",
        "Configurer et sécuriser des réseaux",
        "Analyser les besoins des utilisateurs",
        "Résoudre des problèmes techniques",
      ],
      qualities: ["Esprit logique", "Patience", "Curiosité technique", "Résolution de problèmes"],
    },
    salary: { apprenticeYear1: 600, apprenticeYear2: 800, apprenticeYear3: 1050, apprenticeYear4: 1300, postCfcMin: 4700, postCfcMax: 6500 },
  },
  {
    id: "mediamaticien",
    sectorId: "informatique",
    type: "CFC",
    duration: 4,
    icon: "🎨",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=184",
    profil: { manuel: 2, intellectuel: 7, creatif: 8, analytique: 6, interieur: 9, exterieur: 1, equipe: 7, independant: 5, contactHumain: 6, technique: 7, routine: 3, variete: 9 },
    fr: {
      name: "Médiamaticien/ne CFC",
      description: "Combine design, communication et informatique pour créer des contenus multimédia et gérer des projets numériques.",
      activities: [
        "Créer des sites web et des contenus multimédia",
        "Gérer les réseaux sociaux et le marketing digital",
        "Réaliser des vidéos et des animations",
        "Coordonner des projets de communication",
      ],
      qualities: ["Créativité", "Polyvalence", "Sens de la communication", "Aisance numérique"],
    },
    salary: { apprenticeYear1: 600, apprenticeYear2: 800, apprenticeYear3: 1000, apprenticeYear4: 1300, postCfcMin: 4600, postCfcMax: 6200 },
  },
  {
    id: "operateurInformatique",
    sectorId: "informatique",
    type: "CFC",
    duration: 3,
    icon: "🖥️",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=1646",
    profil: { manuel: 3, intellectuel: 7, creatif: 3, analytique: 8, interieur: 9, exterieur: 1, equipe: 5, independant: 7, contactHumain: 5, technique: 9, routine: 6, variete: 5 },
    fr: {
      name: "Opérateur/trice en informatique CFC",
      description: "Installe, configure et entretient les systèmes informatiques et les réseaux d'entreprise.",
      activities: [
        "Installer et configurer des ordinateurs",
        "Gérer les serveurs et les sauvegardes",
        "Aider les utilisateurs en cas de panne",
        "Assurer la sécurité des systèmes",
      ],
      qualities: ["Sens du service", "Méthode", "Patience", "Rigueur technique"],
    },
    salary: { apprenticeYear1: 600, apprenticeYear2: 800, apprenticeYear3: 1050, apprenticeYear4: null, postCfcMin: 4400, postCfcMax: 5500 },
  },

  // ===== COMMERCE =====
  {
    id: "employeCommerce",
    sectorId: "commerce",
    type: "CFC",
    duration: 3,
    icon: "💼",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=99",
    profil: { manuel: 1, intellectuel: 7, creatif: 3, analytique: 6, interieur: 10, exterieur: 0, equipe: 7, independant: 5, contactHumain: 7, technique: 4, routine: 7, variete: 4 },
    fr: {
      name: "Employé/e de commerce CFC",
      description: "Gère les tâches administratives, la correspondance et l'accueil dans une entreprise ou une administration.",
      activities: [
        "Rédiger des courriers et des rapports",
        "Gérer l'agenda et organiser des réunions",
        "Accueillir et renseigner les clients",
        "Traiter des données et tenir la comptabilité",
      ],
      qualities: ["Organisation", "Communication", "Rigueur", "Polyvalence"],
    },
    salary: { apprenticeYear1: 800, apprenticeYear2: 1000, apprenticeYear3: 1500, apprenticeYear4: null, postCfcMin: 4200, postCfcMax: 5500 },
  },
  {
    id: "gestionnaireCommerce",
    sectorId: "commerce",
    type: "CFC",
    duration: 3,
    icon: "🛍️",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=135",
    profil: { manuel: 3, intellectuel: 5, creatif: 4, analytique: 5, interieur: 8, exterieur: 2, equipe: 6, independant: 5, contactHumain: 9, technique: 3, routine: 6, variete: 5 },
    fr: {
      name: "Gestionnaire du commerce de détail CFC",
      description: "Vend des produits en magasin, conseille les clients et s'occupe de la présentation des marchandises.",
      activities: [
        "Conseiller et servir les clients",
        "Mettre en valeur les produits en rayon",
        "Gérer les stocks et les commandes",
        "Encaisser et gérer la caisse",
      ],
      qualities: ["Sens du contact", "Dynamisme", "Présentation soignée", "Persuasion"],
    },
    salary: { apprenticeYear1: 750, apprenticeYear2: 950, apprenticeYear3: 1250, apprenticeYear4: null, postCfcMin: 4000, postCfcMax: 5000 },
  },
  {
    id: "logisticien",
    sectorId: "commerce",
    type: "CFC",
    duration: 3,
    icon: "📦",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=943",
    profil: { manuel: 6, intellectuel: 5, creatif: 2, analytique: 7, interieur: 7, exterieur: 3, equipe: 6, independant: 6, contactHumain: 4, technique: 6, routine: 7, variete: 4 },
    fr: {
      name: "Logisticien/ne CFC",
      description: "Organise le transport, le stockage et la distribution des marchandises dans des entrepôts ou centres logistiques.",
      activities: [
        "Recevoir et contrôler les marchandises",
        "Préparer les commandes et les expéditions",
        "Conduire des chariots élévateurs",
        "Gérer les stocks avec des logiciels",
      ],
      qualities: ["Organisation", "Endurance physique", "Précision", "Esprit pratique"],
    },
    salary: { apprenticeYear1: 750, apprenticeYear2: 950, apprenticeYear3: 1300, apprenticeYear4: null, postCfcMin: 4300, postCfcMax: 5500 },
  },

  // ===== CONSTRUCTION =====
  {
    id: "macon",
    sectorId: "construction",
    type: "CFC",
    duration: 3,
    icon: "🧱",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=926",
    profil: { manuel: 10, intellectuel: 2, creatif: 3, analytique: 4, interieur: 1, exterieur: 10, equipe: 9, independant: 3, contactHumain: 5, technique: 6, routine: 6, variete: 5 },
    fr: {
      name: "Maçon/ne CFC",
      description: "Construit des murs, des dalles et des façades sur les chantiers de construction.",
      activities: [
        "Monter des murs en briques ou en béton",
        "Couler des dalles et des fondations",
        "Lire et interpréter des plans",
        "Travailler avec des machines de chantier",
      ],
      qualities: ["Force physique", "Résistance aux intempéries", "Précision", "Esprit d'équipe"],
    },
    salary: { apprenticeYear1: 957, apprenticeYear2: 1326, apprenticeYear3: 1862, apprenticeYear4: null, postCfcMin: 5000, postCfcMax: 6200 },
  },
  {
    id: "charpentier",
    sectorId: "construction",
    type: "CFC",
    duration: 4,
    icon: "🪵",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=39",
    profil: { manuel: 10, intellectuel: 3, creatif: 5, analytique: 5, interieur: 2, exterieur: 9, equipe: 8, independant: 4, contactHumain: 4, technique: 7, routine: 4, variete: 7 },
    fr: {
      name: "Charpentier/ière CFC",
      description: "Construit des structures en bois : charpentes de toits, escaliers, façades et ossatures de bâtiments.",
      activities: [
        "Tailler et assembler des pièces de bois",
        "Monter des charpentes sur les chantiers",
        "Lire des plans et calculer des dimensions",
        "Utiliser des machines à bois professionnelles",
      ],
      qualities: ["Habileté manuelle", "Pas de vertige", "Force physique", "Précision"],
    },
    salary: { apprenticeYear1: 800, apprenticeYear2: 1045, apprenticeYear3: 1420, apprenticeYear4: 1810, postCfcMin: 5000, postCfcMax: 6000 },
  },
  {
    id: "dessinateur",
    sectorId: "construction",
    type: "CFC",
    duration: 4,
    icon: "📐",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=1716",
    profil: { manuel: 3, intellectuel: 7, creatif: 8, analytique: 7, interieur: 9, exterieur: 2, equipe: 5, independant: 7, contactHumain: 4, technique: 8, routine: 5, variete: 6 },
    fr: {
      name: "Dessinateur/trice CFC (architecture)",
      description: "Dessine les plans de bâtiments et de constructions à l'aide de logiciels de CAO et participe aux projets architecturaux.",
      activities: [
        "Dessiner des plans sur ordinateur (CAO)",
        "Calculer des surfaces et des volumes",
        "Collaborer avec les architectes et les ingénieurs",
        "Préparer les documents pour les permis de construire",
      ],
      qualities: ["Sens spatial", "Précision", "Créativité", "Maîtrise informatique"],
    },
    salary: { apprenticeYear1: 600, apprenticeYear2: 800, apprenticeYear3: 1100, apprenticeYear4: 1400, postCfcMin: 4800, postCfcMax: 6000 },
  },
  {
    id: "installateurSanitaire",
    sectorId: "construction",
    type: "CFC",
    duration: 4,
    icon: "🚿",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=198",
    profil: { manuel: 9, intellectuel: 3, creatif: 3, analytique: 5, interieur: 6, exterieur: 4, equipe: 6, independant: 6, contactHumain: 5, technique: 8, routine: 5, variete: 6 },
    fr: {
      name: "Installateur/trice sanitaire CFC",
      description: "Installe et entretient les systèmes de plomberie, de chauffage et d'eau dans les bâtiments.",
      activities: [
        "Poser des tuyaux et des raccords",
        "Installer des salles de bains et des cuisines",
        "Réparer des fuites et des pannes",
        "Lire des plans techniques",
      ],
      qualities: ["Habileté manuelle", "Logique technique", "Autonomie", "Bonne condition physique"],
    },
    salary: { apprenticeYear1: 850, apprenticeYear2: 1200, apprenticeYear3: 1400, apprenticeYear4: null, postCfcMin: 4800, postCfcMax: 5800 },
  },

  // ===== TECHNIQUE / INDUSTRIE =====
  {
    id: "polymecanicien",
    sectorId: "technique",
    type: "CFC",
    duration: 4,
    icon: "⚙️",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=233",
    profil: { manuel: 8, intellectuel: 6, creatif: 4, analytique: 8, interieur: 8, exterieur: 2, equipe: 5, independant: 7, contactHumain: 2, technique: 10, routine: 4, variete: 7 },
    fr: {
      name: "Polymécanicien/ne CFC",
      description: "Fabrique des pièces mécaniques de haute précision à l'aide de machines-outils et de commandes numériques (CNC).",
      activities: [
        "Programmer et utiliser des machines CNC",
        "Fabriquer des pièces métalliques de précision",
        "Lire et interpréter des dessins techniques",
        "Contrôler la qualité avec des instruments de mesure",
      ],
      qualities: ["Précision extrême", "Patience", "Esprit technique", "Sens spatial"],
    },
    salary: { apprenticeYear1: 750, apprenticeYear2: 950, apprenticeYear3: 1250, apprenticeYear4: 1600, postCfcMin: 4600, postCfcMax: 6300 },
  },
  {
    id: "automaticien",
    sectorId: "technique",
    type: "CFC",
    duration: 4,
    icon: "🤖",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=23",
    profil: { manuel: 6, intellectuel: 7, creatif: 5, analytique: 8, interieur: 8, exterieur: 2, equipe: 5, independant: 7, contactHumain: 2, technique: 10, routine: 4, variete: 6 },
    fr: {
      name: "Automaticien/ne CFC",
      description: "Conçoit, installe et entretient des systèmes automatisés et des robots industriels.",
      activities: [
        "Programmer des automates et des robots",
        "Câbler des armoires électriques",
        "Tester et dépanner des systèmes automatisés",
        "Lire des schémas électriques",
      ],
      qualities: ["Logique", "Précision", "Curiosité technique", "Résolution de problèmes"],
    },
    salary: { apprenticeYear1: 600, apprenticeYear2: 800, apprenticeYear3: 1050, apprenticeYear4: 1350, postCfcMin: 4600, postCfcMax: 6000 },
  },
  {
    id: "installateurElectricien",
    sectorId: "technique",
    type: "CFC",
    duration: 4,
    icon: "⚡",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=199",
    profil: { manuel: 8, intellectuel: 5, creatif: 3, analytique: 6, interieur: 5, exterieur: 5, equipe: 6, independant: 6, contactHumain: 5, technique: 9, routine: 5, variete: 6 },
    fr: {
      name: "Installateur/trice-électricien/ne CFC",
      description: "Installe et entretient les systèmes électriques dans les bâtiments résidentiels et industriels.",
      activities: [
        "Tirer des câbles et poser des prises",
        "Installer des tableaux électriques",
        "Dépanner des installations électriques",
        "Respecter les normes de sécurité",
      ],
      qualities: ["Habileté manuelle", "Rigueur", "Sens des responsabilités", "Bonne condition physique"],
    },
    salary: { apprenticeYear1: 700, apprenticeYear2: 900, apprenticeYear3: 1100, apprenticeYear4: 1400, postCfcMin: 4800, postCfcMax: 6000 },
  },
  {
    id: "electronicien",
    sectorId: "technique",
    type: "CFC",
    duration: 4,
    icon: "🔌",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=94",
    profil: { manuel: 5, intellectuel: 8, creatif: 5, analytique: 9, interieur: 9, exterieur: 1, equipe: 4, independant: 8, contactHumain: 2, technique: 10, routine: 4, variete: 6 },
    fr: {
      name: "Électronicien/ne CFC",
      description: "Développe et teste des circuits électroniques pour des appareils médicaux, des systèmes de communication ou l'avionique.",
      activities: [
        "Concevoir des circuits imprimés",
        "Souder des composants électroniques",
        "Programmer des microcontrôleurs",
        "Tester et dépanner des appareils",
      ],
      qualities: ["Précision", "Esprit analytique", "Patience", "Passion pour la technologie"],
      passerelle: "Spécialisation possible en avionique pour travailler dans l'aéronautique (SR Technics, RUAG, etc.)",
    },
    salary: { apprenticeYear1: 600, apprenticeYear2: 800, apprenticeYear3: 1050, apprenticeYear4: 1350, postCfcMin: 4800, postCfcMax: 6500 },
  },

  // ===== ARTISANAT =====
  {
    id: "ebeniste",
    sectorId: "artisanat",
    type: "CFC",
    duration: 4,
    icon: "🪑",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=282",
    profil: { manuel: 10, intellectuel: 3, creatif: 8, analytique: 4, interieur: 8, exterieur: 2, equipe: 3, independant: 9, contactHumain: 2, technique: 6, routine: 4, variete: 7 },
    fr: {
      name: "Ébéniste CFC",
      description: "Crée et restaure des meubles et des objets en bois, du design à la fabrication artisanale.",
      activities: [
        "Concevoir des meubles sur mesure",
        "Travailler le bois avec des outils manuels et des machines",
        "Appliquer des finitions (vernis, huile, laque)",
        "Restaurer des meubles anciens",
      ],
      qualities: ["Habileté manuelle", "Sens esthétique", "Patience", "Créativité"],
    },
    salary: { apprenticeYear1: 700, apprenticeYear2: 1000, apprenticeYear3: 1350, apprenticeYear4: 1650, postCfcMin: 4500, postCfcMax: 5500 },
  },
  {
    id: "boulangerPatissier",
    sectorId: "artisanat",
    type: "CFC",
    duration: 3,
    icon: "🍞",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=1465",
    profil: { manuel: 9, intellectuel: 3, creatif: 8, analytique: 4, interieur: 10, exterieur: 0, equipe: 6, independant: 6, contactHumain: 4, technique: 5, routine: 6, variete: 5 },
    fr: {
      name: "Boulanger/ère-pâtissier/ière-confiseur/euse CFC",
      description: "Prépare du pain, des viennoiseries et des pâtisseries artisanales dans une boulangerie.",
      activities: [
        "Pétrir et façonner la pâte",
        "Créer des pâtisseries et des desserts",
        "Gérer les températures et les temps de cuisson",
        "Décorer et présenter les produits",
      ],
      qualities: ["Créativité culinaire", "Lève-tôt", "Précision", "Sens du goût"],
    },
    salary: { apprenticeYear1: 850, apprenticeYear2: 1100, apprenticeYear3: 1400, apprenticeYear4: null, postCfcMin: 4200, postCfcMax: 5000 },
  },
  {
    id: "coiffeur",
    sectorId: "artisanat",
    type: "CFC",
    duration: 3,
    icon: "✂️",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=44",
    profil: { manuel: 8, intellectuel: 2, creatif: 9, analytique: 2, interieur: 10, exterieur: 0, equipe: 4, independant: 7, contactHumain: 10, technique: 3, routine: 5, variete: 6 },
    fr: {
      name: "Coiffeur/euse CFC",
      description: "Coupe, coiffe et colore les cheveux tout en conseillant la clientèle sur le style et les soins capillaires.",
      activities: [
        "Couper et coiffer les cheveux",
        "Réaliser des colorations et des mèches",
        "Conseiller les clients sur leur style",
        "Entretenir et gérer le salon",
      ],
      qualities: ["Créativité", "Sens du contact", "Dextérité", "Sens esthétique"],
    },
    salary: { apprenticeYear1: 550, apprenticeYear2: 700, apprenticeYear3: 900, apprenticeYear4: null, postCfcMin: 4000, postCfcMax: 4500 },
  },

  // ===== GASTRONOMIE =====
  {
    id: "cuisinier",
    sectorId: "gastronomie",
    type: "CFC",
    duration: 3,
    icon: "👨‍🍳",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=68",
    profil: { manuel: 9, intellectuel: 3, creatif: 8, analytique: 3, interieur: 10, exterieur: 0, equipe: 8, independant: 4, contactHumain: 5, technique: 5, routine: 4, variete: 8 },
    fr: {
      name: "Cuisinier/ière CFC",
      description: "Prépare des plats dans un restaurant, un hôtel ou une cantine, de l'entrée au dessert.",
      activities: [
        "Préparer et cuisiner les plats du menu",
        "Créer de nouvelles recettes",
        "Gérer les commandes et les stocks alimentaires",
        "Respecter les normes d'hygiène (HACCP)",
      ],
      qualities: ["Créativité culinaire", "Résistance au stress", "Rapidité", "Travail en équipe"],
    },
    salary: { apprenticeYear1: 1020, apprenticeYear2: 1300, apprenticeYear3: 1550, apprenticeYear4: null, postCfcMin: 4300, postCfcMax: 5500 },
  },
  {
    id: "specialisteHotellerie",
    sectorId: "gastronomie",
    type: "CFC",
    duration: 3,
    icon: "🏨",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=277",
    profil: { manuel: 5, intellectuel: 5, creatif: 4, analytique: 4, interieur: 8, exterieur: 2, equipe: 8, independant: 3, contactHumain: 10, technique: 3, routine: 5, variete: 7 },
    fr: {
      name: "Gestionnaire en hôtellerie-intendance CFC",
      description: "Accueille les clients dans un hôtel ou un restaurant et veille à leur bien-être pendant leur séjour.",
      activities: [
        "Accueillir et conseiller les clients",
        "Gérer les réservations et le check-in",
        "Coordonner les équipes de service",
        "Organiser des événements et des banquets",
      ],
      qualities: ["Sens de l'accueil", "Polyvalence", "Langues étrangères", "Élégance"],
    },
    salary: { apprenticeYear1: 1020, apprenticeYear2: 1300, apprenticeYear3: 1550, apprenticeYear4: null, postCfcMin: 4200, postCfcMax: 5200 },
  },

  // ===== NATURE =====
  {
    id: "agriculteur",
    sectorId: "nature",
    type: "CFC",
    duration: 3,
    icon: "🌾",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=8",
    profil: { manuel: 10, intellectuel: 4, creatif: 3, analytique: 5, interieur: 2, exterieur: 10, equipe: 5, independant: 8, contactHumain: 3, technique: 6, routine: 5, variete: 8 },
    fr: {
      name: "Agriculteur/trice CFC",
      description: "Cultive la terre, élève des animaux et produit des denrées alimentaires dans une exploitation agricole.",
      activities: [
        "Cultiver des céréales, des légumes et des fruits",
        "S'occuper du bétail et des animaux",
        "Conduire des tracteurs et des machines agricoles",
        "Gérer une exploitation de manière durable",
      ],
      qualities: ["Amour de la nature", "Endurance physique", "Autonomie", "Polyvalence"],
    },
    salary: { apprenticeYear1: 1200, apprenticeYear2: 1400, apprenticeYear3: 1600, apprenticeYear4: null, postCfcMin: 4200, postCfcMax: 5500 },
  },
  {
    id: "forestier",
    sectorId: "nature",
    type: "CFC",
    duration: 3,
    icon: "🌲",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=124",
    profil: { manuel: 10, intellectuel: 2, creatif: 2, analytique: 4, interieur: 0, exterieur: 10, equipe: 6, independant: 7, contactHumain: 2, technique: 6, routine: 4, variete: 7 },
    fr: {
      name: "Forestier/ière-bûcheron/ne CFC",
      description: "Entretient les forêts, abat des arbres et aménage des chemins forestiers dans le respect de l'environnement.",
      activities: [
        "Abattre et débiter des arbres",
        "Entretenir et planter des forêts",
        "Construire des chemins et des ouvrages forestiers",
        "Utiliser la tronçonneuse et des engins forestiers",
      ],
      qualities: ["Force physique", "Amour de la nature", "Prudence", "Autonomie"],
    },
    salary: { apprenticeYear1: 900, apprenticeYear2: 1200, apprenticeYear3: 1500, apprenticeYear4: null, postCfcMin: 4500, postCfcMax: 5500 },
  },
  {
    id: "horticulteur",
    sectorId: "nature",
    type: "CFC",
    duration: 3,
    icon: "🌻",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=1713",
    profil: { manuel: 9, intellectuel: 3, creatif: 6, analytique: 4, interieur: 2, exterieur: 9, equipe: 5, independant: 7, contactHumain: 4, technique: 5, routine: 5, variete: 7 },
    fr: {
      name: "Horticulteur/trice CFC",
      description: "Cultive des plantes, des fleurs et des arbres dans des pépinières, des serres ou des jardins.",
      activities: [
        "Planter, tailler et entretenir des végétaux",
        "Créer des arrangements floraux et des jardins",
        "Gérer l'arrosage et la fertilisation",
        "Conseiller les clients sur les plantes",
      ],
      qualities: ["Sens esthétique", "Patience", "Amour des plantes", "Bonne condition physique"],
    },
    salary: { apprenticeYear1: 850, apprenticeYear2: 1050, apprenticeYear3: 1300, apprenticeYear4: null, postCfcMin: 4200, postCfcMax: 5200 },
  },

  // ===== SOCIAL =====
  {
    id: "assistantSocioEducatif",
    sectorId: "social",
    type: "CFC",
    duration: 3,
    icon: "🧡",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=1051",
    profil: { manuel: 4, intellectuel: 6, creatif: 7, analytique: 4, interieur: 7, exterieur: 3, equipe: 8, independant: 4, contactHumain: 10, technique: 2, routine: 4, variete: 8 },
    fr: {
      name: "Assistant/e socio-éducatif/ve CFC",
      description: "Accompagne des enfants, des personnes âgées ou des personnes en situation de handicap dans leur quotidien.",
      activities: [
        "Organiser des activités éducatives et ludiques",
        "Accompagner les repas et les soins quotidiens",
        "Soutenir le développement des enfants",
        "Collaborer avec les familles et les professionnels",
      ],
      qualities: ["Empathie", "Patience", "Créativité", "Sens des responsabilités"],
    },
    salary: { apprenticeYear1: 830, apprenticeYear2: 1040, apprenticeYear3: 1390, apprenticeYear4: null, postCfcMin: 4500, postCfcMax: 5500 },
  },

  // ===== ARTS / CRÉATION =====
  {
    id: "graphiste",
    sectorId: "artisanat",
    type: "CFC",
    duration: 4,
    icon: "🎨",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=138",
    profil: { manuel: 4, intellectuel: 6, creatif: 10, analytique: 4, interieur: 10, exterieur: 0, equipe: 5, independant: 8, contactHumain: 5, technique: 6, routine: 3, variete: 8 },
    fr: {
      name: "Graphiste CFC",
      description: "Conçoit des visuels, des logos, des affiches et des supports de communication pour des entreprises et des marques.",
      activities: [
        "Créer des logos et des identités visuelles",
        "Concevoir des affiches, flyers et brochures",
        "Travailler avec Photoshop, Illustrator et InDesign",
        "Présenter des concepts aux clients",
      ],
      qualities: ["Créativité", "Sens esthétique", "Maîtrise informatique", "Ouverture d'esprit"],
    },
    salary: { apprenticeYear1: 400, apprenticeYear2: 700, apprenticeYear3: 1000, apprenticeYear4: 1200, postCfcMin: 4200, postCfcMax: 5500 },
  },
  {
    id: "polygraphe",
    sectorId: "artisanat",
    type: "CFC",
    duration: 4,
    icon: "📰",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=232",
    profil: { manuel: 4, intellectuel: 6, creatif: 8, analytique: 6, interieur: 10, exterieur: 0, equipe: 5, independant: 7, contactHumain: 3, technique: 7, routine: 5, variete: 6 },
    fr: {
      name: "Polygraphe CFC",
      description: "Prépare les documents pour l'impression : mise en page, traitement d'images et gestion des couleurs.",
      activities: [
        "Mettre en page des livres, magazines et journaux",
        "Retoucher et optimiser des images",
        "Préparer les fichiers pour l'impression",
        "Vérifier la qualité des couleurs et des textes",
      ],
      qualities: ["Sens du détail", "Maîtrise informatique", "Sens esthétique", "Rigueur"],
    },
    salary: { apprenticeYear1: 600, apprenticeYear2: 800, apprenticeYear3: 1000, apprenticeYear4: 1400, postCfcMin: 4400, postCfcMax: 5500 },
  },

  // ===== AUTOMOBILE =====
  {
    id: "mecanicienAuto",
    sectorId: "automobile",
    type: "CFC",
    duration: 3,
    icon: "🚗",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=1029",
    profil: { manuel: 9, intellectuel: 4, creatif: 3, analytique: 7, interieur: 8, exterieur: 2, equipe: 5, independant: 7, contactHumain: 4, technique: 9, routine: 5, variete: 6 },
    fr: {
      name: "Mécanicien/ne en maintenance d'automobiles CFC",
      description: "Entretient et répare les véhicules automobiles, du moteur à l'électronique embarquée.",
      activities: [
        "Diagnostiquer les pannes avec des outils électroniques",
        "Remplacer et réparer les pièces mécaniques",
        "Effectuer les services et les contrôles",
        "Travailler sur les systèmes électriques et hybrides",
      ],
      qualities: ["Sens technique", "Logique", "Habileté manuelle", "Curiosité"],
    },
    salary: { apprenticeYear1: 700, apprenticeYear2: 900, apprenticeYear3: 1150, apprenticeYear4: 1400, postCfcMin: 4500, postCfcMax: 5500 },
  },

  // ===== PEINTURE =====
  {
    id: "peintre",
    sectorId: "construction",
    type: "CFC",
    duration: 3,
    icon: "🎨",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=216",
    profil: { manuel: 9, intellectuel: 2, creatif: 6, analytique: 3, interieur: 5, exterieur: 5, equipe: 7, independant: 5, contactHumain: 4, technique: 5, routine: 6, variete: 5 },
    fr: {
      name: "Peintre CFC",
      description: "Peint et décore les surfaces intérieures et extérieures des bâtiments, pose du papier peint et réalise des finitions.",
      activities: [
        "Préparer les surfaces (poncer, enduire)",
        "Appliquer des peintures et des vernis",
        "Poser du papier peint et des revêtements",
        "Conseiller les clients sur les couleurs",
      ],
      qualities: ["Sens des couleurs", "Précision", "Bonne condition physique", "Travail en hauteur"],
    },
    salary: { apprenticeYear1: 700, apprenticeYear2: 900, apprenticeYear3: 1600, apprenticeYear4: null, postCfcMin: 4500, postCfcMax: 5500 },
  },

  // ===== AÉRONAUTIQUE =====
  {
    id: "agentExploitation",
    sectorId: "aeronautique",
    type: "CFC",
    duration: 3,
    icon: "🛩️",
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=1075",
    profil: { manuel: 5, intellectuel: 6, creatif: 3, analytique: 7, interieur: 4, exterieur: 6, equipe: 9, independant: 3, contactHumain: 7, technique: 6, routine: 5, variete: 8 },
    fr: {
      name: "Agent/e d'exploitation CFC",
      description: "Coordonne les opérations logistiques et techniques dans un aéroport ou une grande infrastructure de transport.",
      activities: [
        "Coordonner le chargement et déchargement des avions",
        "Gérer le planning des opérations au sol",
        "Communiquer avec les équipages et le contrôle aérien",
        "Assurer le respect des horaires et de la sécurité",
      ],
      qualities: ["Organisation", "Résistance au stress", "Communication", "Réactivité"],
      passerelle: "Possibilité d'évoluer vers contrôleur/euse du trafic aérien avec une formation supérieure (skyguide).",
    },
    salary: { apprenticeYear1: 800, apprenticeYear2: 1000, apprenticeYear3: 1400, apprenticeYear4: null, postCfcMin: 4500, postCfcMax: 5800 },
  },
];

async function main() {
  console.log("Seeding sectors...");
  for (const s of sectors) {
    await prisma.sector.upsert({
      where: { id: s.id },
      update: { color: s.color },
      create: { id: s.id, color: s.color },
    });
    await prisma.sectorTranslation.upsert({
      where: { sectorId_locale: { sectorId: s.id, locale: "fr" } },
      update: { name: s.name },
      create: { sectorId: s.id, locale: "fr", name: s.name },
    });
  }
  console.log(`  ${sectors.length} sectors seeded.`);

  console.log("Seeding professions...");
  for (const p of professions) {
    await prisma.profession.upsert({
      where: { id: p.id },
      update: {
        sectorId: p.sectorId,
        type: p.type,
        duration: p.duration,
        icon: p.icon,
        urlOrientation: p.urlOrientation,
        ...p.profil,
      },
      create: {
        id: p.id,
        sectorId: p.sectorId,
        type: p.type,
        duration: p.duration,
        icon: p.icon,
        urlOrientation: p.urlOrientation,
        ...p.profil,
      },
    });

    await prisma.professionTranslation.upsert({
      where: { professionId_locale: { professionId: p.id, locale: "fr" } },
      update: {
        name: p.fr.name,
        description: p.fr.description,
        activities: p.fr.activities,
        qualities: p.fr.qualities,
        passerelle: p.fr.passerelle ?? null,
      },
      create: {
        professionId: p.id,
        locale: "fr",
        name: p.fr.name,
        description: p.fr.description,
        activities: p.fr.activities,
        qualities: p.fr.qualities,
        passerelle: p.fr.passerelle ?? null,
      },
    });

    await prisma.salaryInfo.upsert({
      where: { professionId: p.id },
      update: { ...p.salary },
      create: { professionId: p.id, ...p.salary },
    });
  }
  console.log(`  ${professions.length} professions seeded.`);

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
