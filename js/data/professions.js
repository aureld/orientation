var AVENTURE = AVENTURE || {};

AVENTURE.professions = [
  // ===== SANTE =====
  {
    id: "assc",
    nom: "Assistant/e en soins et sante communautaire CFC",
    secteur: "sante",
    type: "CFC",
    duree: 3,
    description: "Accompagne et soigne des personnes de tout age dans les hopitaux, les EMS et les services de soins a domicile.",
    activites: [
      "Soigner et accompagner les patients au quotidien",
      "Administrer des medicaments selon les directives",
      "Observer l'etat de sante et transmettre les informations",
      "Aider aux repas, a la toilette et aux deplacements"
    ],
    salaireApprentissage: { 1: 850, 2: 1050, 3: 1400 },
    salaireApresCFC: { min: 4500, max: 5500 },
    qualitesRequises: ["Empathie", "Resistance physique", "Sens de l'observation", "Travail en equipe"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=947",
    icon: "\u2695\ufe0f",
    profil: { manuel: 6, intellectuel: 5, creatif: 3, analytique: 5, interieur: 8, exterieur: 2, equipe: 8, independant: 3, contactHumain: 10, technique: 4, routine: 5, variete: 7 }
  },
  {
    id: "assistantPharmacie",
    nom: "Assistant/e en pharmacie CFC",
    secteur: "sante",
    type: "CFC",
    duree: 3,
    description: "Conseille la clientele en pharmacie, prepare des medicaments et gere les stocks de produits pharmaceutiques.",
    activites: [
      "Conseiller les clients sur les medicaments",
      "Preparer des ordonnances",
      "Gerer les stocks et les commandes",
      "Verifier les interactions medicamenteuses"
    ],
    salaireApprentissage: { 1: 700, 2: 900, 3: 1200 },
    salaireApresCFC: { min: 4300, max: 5200 },
    qualitesRequises: ["Precision", "Sens du contact", "Discretion", "Esprit scientifique"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=19",
    icon: "\ud83d\udc8a",
    profil: { manuel: 4, intellectuel: 7, creatif: 2, analytique: 7, interieur: 10, exterieur: 0, equipe: 5, independant: 6, contactHumain: 8, technique: 6, routine: 7, variete: 4 }
  },
  {
    id: "laborantin",
    nom: "Laborantin/e CFC (chimie)",
    secteur: "sante",
    type: "CFC",
    duree: 3,
    description: "Realise des analyses et des experiences en laboratoire dans les domaines de la chimie, la biologie ou la pharmacie.",
    activites: [
      "Preparer et realiser des experiences",
      "Analyser des echantillons au microscope",
      "Documenter les resultats avec precision",
      "Entretenir les appareils de laboratoire"
    ],
    salaireApprentissage: { 1: 700, 2: 880, 3: 1180 },
    salaireApresCFC: { min: 4800, max: 6000 },
    qualitesRequises: ["Precision", "Patience", "Esprit scientifique", "Methode"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=1375",
    icon: "\ud83d\udd2c",
    profil: { manuel: 5, intellectuel: 8, creatif: 3, analytique: 10, interieur: 10, exterieur: 0, equipe: 4, independant: 8, contactHumain: 2, technique: 9, routine: 6, variete: 5 }
  },

  // ===== INFORMATIQUE =====
  {
    id: "informaticien",
    nom: "Informaticien/ne CFC",
    secteur: "informatique",
    type: "CFC",
    duree: 4,
    description: "Developpe des logiciels, gere des reseaux et resout des problemes informatiques complexes.",
    activites: [
      "Programmer des applications et des sites web",
      "Configurer et securiser des reseaux",
      "Analyser les besoins des utilisateurs",
      "Resoudre des problemes techniques"
    ],
    salaireApprentissage: { 1: 600, 2: 800, 3: 1050, 4: 1300 },
    salaireApresCFC: { min: 4700, max: 6500 },
    qualitesRequises: ["Esprit logique", "Patience", "Curiosite technique", "Resolution de problemes"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=152",
    icon: "\ud83d\udcbb",
    profil: { manuel: 2, intellectuel: 9, creatif: 6, analytique: 9, interieur: 9, exterieur: 1, equipe: 6, independant: 7, contactHumain: 4, technique: 10, routine: 3, variete: 8 }
  },
  {
    id: "mediamaticien",
    nom: "Mediamaticien/ne CFC",
    secteur: "informatique",
    type: "CFC",
    duree: 4,
    description: "Combine design, communication et informatique pour creer des contenus multimedia et gerer des projets numeriques.",
    activites: [
      "Creer des sites web et des contenus multimedia",
      "Gerer les reseaux sociaux et le marketing digital",
      "Realiser des videos et des animations",
      "Coordonner des projets de communication"
    ],
    salaireApprentissage: { 1: 600, 2: 800, 3: 1000, 4: 1300 },
    salaireApresCFC: { min: 4600, max: 6200 },
    qualitesRequises: ["Creativite", "Polyvalence", "Sens de la communication", "Aisance numerique"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=184",
    icon: "\ud83c\udfa8",
    profil: { manuel: 2, intellectuel: 7, creatif: 8, analytique: 6, interieur: 9, exterieur: 1, equipe: 7, independant: 5, contactHumain: 6, technique: 7, routine: 3, variete: 9 }
  },
  {
    id: "operateurInformatique",
    nom: "Operateur/trice en informatique CFC",
    secteur: "informatique",
    type: "CFC",
    duree: 3,
    description: "Installe, configure et entretient les systemes informatiques et les reseaux d'entreprise.",
    activites: [
      "Installer et configurer des ordinateurs",
      "Gerer les serveurs et les sauvegardes",
      "Aider les utilisateurs en cas de panne",
      "Assurer la securite des systemes"
    ],
    salaireApprentissage: { 1: 600, 2: 800, 3: 1050 },
    salaireApresCFC: { min: 4400, max: 5500 },
    qualitesRequises: ["Sens du service", "Methode", "Patience", "Rigueur technique"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=1646",
    icon: "\ud83d\udda5\ufe0f",
    profil: { manuel: 3, intellectuel: 7, creatif: 3, analytique: 8, interieur: 9, exterieur: 1, equipe: 5, independant: 7, contactHumain: 5, technique: 9, routine: 6, variete: 5 }
  },

  // ===== COMMERCE =====
  {
    id: "employeCommerce",
    nom: "Employe/e de commerce CFC",
    secteur: "commerce",
    type: "CFC",
    duree: 3,
    description: "Gere les taches administratives, la correspondance et l'accueil dans une entreprise ou une administration.",
    activites: [
      "Rediger des courriers et des rapports",
      "Gerer l'agenda et organiser des reunions",
      "Accueillir et renseigner les clients",
      "Traiter des donnees et tenir la comptabilite"
    ],
    salaireApprentissage: { 1: 800, 2: 1000, 3: 1500 },
    salaireApresCFC: { min: 4200, max: 5500 },
    qualitesRequises: ["Organisation", "Communication", "Rigueur", "Polyvalence"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=99",
    icon: "\ud83d\udcbc",
    profil: { manuel: 1, intellectuel: 7, creatif: 3, analytique: 6, interieur: 10, exterieur: 0, equipe: 7, independant: 5, contactHumain: 7, technique: 4, routine: 7, variete: 4 }
  },
  {
    id: "gestionnaireCommerce",
    nom: "Gestionnaire du commerce de detail CFC",
    secteur: "commerce",
    type: "CFC",
    duree: 3,
    description: "Vend des produits en magasin, conseille les clients et s'occupe de la presentation des marchandises.",
    activites: [
      "Conseiller et servir les clients",
      "Mettre en valeur les produits en rayon",
      "Gerer les stocks et les commandes",
      "Encaisser et gerer la caisse"
    ],
    salaireApprentissage: { 1: 750, 2: 950, 3: 1250 },
    salaireApresCFC: { min: 4000, max: 5000 },
    qualitesRequises: ["Sens du contact", "Dynamisme", "Presentation soignee", "Persuasion"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=135",
    icon: "\ud83d\udecd\ufe0f",
    profil: { manuel: 3, intellectuel: 5, creatif: 4, analytique: 5, interieur: 8, exterieur: 2, equipe: 6, independant: 5, contactHumain: 9, technique: 3, routine: 6, variete: 5 }
  },
  {
    id: "logisticien",
    nom: "Logisticien/ne CFC",
    secteur: "commerce",
    type: "CFC",
    duree: 3,
    description: "Organise le transport, le stockage et la distribution des marchandises dans des entrepots ou centres logistiques.",
    activites: [
      "Recevoir et controler les marchandises",
      "Preparer les commandes et les expeditions",
      "Conduire des chariots elevateurs",
      "Gerer les stocks avec des logiciels"
    ],
    salaireApprentissage: { 1: 750, 2: 950, 3: 1300 },
    salaireApresCFC: { min: 4300, max: 5500 },
    qualitesRequises: ["Organisation", "Endurance physique", "Precision", "Esprit pratique"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=943",
    icon: "\ud83d\udce6",
    profil: { manuel: 6, intellectuel: 5, creatif: 2, analytique: 7, interieur: 7, exterieur: 3, equipe: 6, independant: 6, contactHumain: 4, technique: 6, routine: 7, variete: 4 }
  },

  // ===== CONSTRUCTION =====
  {
    id: "macon",
    nom: "Macon/ne CFC",
    secteur: "construction",
    type: "CFC",
    duree: 3,
    description: "Construit des murs, des dalles et des facades sur les chantiers de construction.",
    activites: [
      "Monter des murs en briques ou en beton",
      "Couler des dalles et des fondations",
      "Lire et interpreter des plans",
      "Travailler avec des machines de chantier"
    ],
    salaireApprentissage: { 1: 957, 2: 1326, 3: 1862 },
    salaireApresCFC: { min: 5000, max: 6200 },
    qualitesRequises: ["Force physique", "Resistance aux intemperies", "Precision", "Esprit d'equipe"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=926",
    icon: "\ud83e\uddf1",
    profil: { manuel: 10, intellectuel: 2, creatif: 3, analytique: 4, interieur: 1, exterieur: 10, equipe: 9, independant: 3, contactHumain: 5, technique: 6, routine: 6, variete: 5 }
  },
  {
    id: "charpentier",
    nom: "Charpentier/iere CFC",
    secteur: "construction",
    type: "CFC",
    duree: 4,
    description: "Construit des structures en bois : charpentes de toits, escaliers, facades et ossatures de batiments.",
    activites: [
      "Tailler et assembler des pieces de bois",
      "Monter des charpentes sur les chantiers",
      "Lire des plans et calculer des dimensions",
      "Utiliser des machines a bois professionnelles"
    ],
    salaireApprentissage: { 1: 800, 2: 1045, 3: 1420, 4: 1810 },
    salaireApresCFC: { min: 5000, max: 6000 },
    qualitesRequises: ["Habilete manuelle", "Pas de vertige", "Force physique", "Precision"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=39",
    icon: "\ud83e\udeb5",
    profil: { manuel: 10, intellectuel: 3, creatif: 5, analytique: 5, interieur: 2, exterieur: 9, equipe: 8, independant: 4, contactHumain: 4, technique: 7, routine: 4, variete: 7 }
  },
  {
    id: "dessinateur",
    nom: "Dessinateur/trice CFC (architecture)",
    secteur: "construction",
    type: "CFC",
    duree: 4,
    description: "Dessine les plans de batiments et de constructions a l'aide de logiciels de CAO et participe aux projets architecturaux.",
    activites: [
      "Dessiner des plans sur ordinateur (CAO)",
      "Calculer des surfaces et des volumes",
      "Collaborer avec les architectes et les ingenieurs",
      "Preparer les documents pour les permis de construire"
    ],
    salaireApprentissage: { 1: 600, 2: 800, 3: 1100, 4: 1400 },
    salaireApresCFC: { min: 4800, max: 6000 },
    qualitesRequises: ["Sens spatial", "Precision", "Creativite", "Maitrise informatique"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=1716",
    icon: "\ud83d\udcd0",
    profil: { manuel: 3, intellectuel: 7, creatif: 8, analytique: 7, interieur: 9, exterieur: 2, equipe: 5, independant: 7, contactHumain: 4, technique: 8, routine: 5, variete: 6 }
  },
  {
    id: "installateurSanitaire",
    nom: "Installateur/trice sanitaire CFC",
    secteur: "construction",
    type: "CFC",
    duree: 3,
    description: "Installe et entretient les systemes de plomberie, de chauffage et d'eau dans les batiments.",
    activites: [
      "Poser des tuyaux et des raccords",
      "Installer des salles de bains et des cuisines",
      "Reparer des fuites et des pannes",
      "Lire des plans techniques"
    ],
    salaireApprentissage: { 1: 850, 2: 1200, 3: 1400 },
    salaireApresCFC: { min: 4800, max: 5800 },
    qualitesRequises: ["Habilete manuelle", "Logique technique", "Autonomie", "Bonne condition physique"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=198",
    icon: "\ud83d\udebf",
    profil: { manuel: 9, intellectuel: 3, creatif: 3, analytique: 5, interieur: 6, exterieur: 4, equipe: 6, independant: 6, contactHumain: 5, technique: 8, routine: 5, variete: 6 }
  },

  // ===== TECHNIQUE / INDUSTRIE =====
  {
    id: "polymecanicien",
    nom: "Polymecanicien/ne CFC",
    secteur: "technique",
    type: "CFC",
    duree: 4,
    description: "Fabrique des pieces mecaniques de haute precision a l'aide de machines-outils et de commandes numeriques (CNC).",
    activites: [
      "Programmer et utiliser des machines CNC",
      "Fabriquer des pieces metalliques de precision",
      "Lire et interpreter des dessins techniques",
      "Controler la qualite avec des instruments de mesure"
    ],
    salaireApprentissage: { 1: 750, 2: 950, 3: 1250, 4: 1600 },
    salaireApresCFC: { min: 4600, max: 6300 },
    qualitesRequises: ["Precision extreme", "Patience", "Esprit technique", "Sens spatial"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=233",
    icon: "\u2699\ufe0f",
    profil: { manuel: 8, intellectuel: 6, creatif: 4, analytique: 8, interieur: 8, exterieur: 2, equipe: 5, independant: 7, contactHumain: 2, technique: 10, routine: 4, variete: 7 }
  },
  {
    id: "automaticien",
    nom: "Automaticien/ne CFC",
    secteur: "technique",
    type: "CFC",
    duree: 4,
    description: "Concoit, installe et entretient des systemes automatises et des robots industriels.",
    activites: [
      "Programmer des automates et des robots",
      "Cabler des armoires electriques",
      "Tester et depanner des systemes automatises",
      "Lire des schemas electriques"
    ],
    salaireApprentissage: { 1: 600, 2: 800, 3: 1050, 4: 1350 },
    salaireApresCFC: { min: 4600, max: 6000 },
    qualitesRequises: ["Logique", "Precision", "Curiosite technique", "Resolution de problemes"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=23",
    icon: "\ud83e\udd16",
    profil: { manuel: 6, intellectuel: 7, creatif: 5, analytique: 8, interieur: 8, exterieur: 2, equipe: 5, independant: 7, contactHumain: 2, technique: 10, routine: 4, variete: 6 }
  },
  {
    id: "installateurElectricien",
    nom: "Installateur/trice-electricien/ne CFC",
    secteur: "technique",
    type: "CFC",
    duree: 4,
    description: "Installe et entretient les systemes electriques dans les batiments residentiels et industriels.",
    activites: [
      "Tirer des cables et poser des prises",
      "Installer des tableaux electriques",
      "Depanner des installations electriques",
      "Respecter les normes de securite"
    ],
    salaireApprentissage: { 1: 700, 2: 900, 3: 1100, 4: 1400 },
    salaireApresCFC: { min: 4800, max: 6000 },
    qualitesRequises: ["Habilete manuelle", "Rigueur", "Sens des responsabilites", "Bonne condition physique"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=199",
    icon: "\u26a1",
    profil: { manuel: 8, intellectuel: 5, creatif: 3, analytique: 6, interieur: 5, exterieur: 5, equipe: 6, independant: 6, contactHumain: 5, technique: 9, routine: 5, variete: 6 }
  },
  {
    id: "electronicien",
    nom: "Electronicien/ne CFC",
    secteur: "technique",
    type: "CFC",
    duree: 4,
    description: "Developpe et teste des circuits electroniques pour des appareils medicaux, des systemes de communication ou l'avionique.",
    activites: [
      "Concevoir des circuits imprimes",
      "Souder des composants electroniques",
      "Programmer des microcontroleurs",
      "Tester et depanner des appareils"
    ],
    salaireApprentissage: { 1: 600, 2: 800, 3: 1050, 4: 1350 },
    salaireApresCFC: { min: 4800, max: 6500 },
    qualitesRequises: ["Precision", "Esprit analytique", "Patience", "Passion pour la technologie"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=94",
    icon: "\ud83d\udd0c",
    profil: { manuel: 5, intellectuel: 8, creatif: 5, analytique: 9, interieur: 9, exterieur: 1, equipe: 4, independant: 8, contactHumain: 2, technique: 10, routine: 4, variete: 6 },
    passerelle: "Specialisation possible en avionique pour travailler dans l'aeronautique (SR Technics, RUAG, etc.)"
  },

  // ===== ARTISANAT =====
  {
    id: "ebeniste",
    nom: "Ebeniste CFC",
    secteur: "artisanat",
    type: "CFC",
    duree: 4,
    description: "Cree et restaure des meubles et des objets en bois, du design a la fabrication artisanale.",
    activites: [
      "Concevoir des meubles sur mesure",
      "Travailler le bois avec des outils manuels et des machines",
      "Appliquer des finitions (vernis, huile, laque)",
      "Restaurer des meubles anciens"
    ],
    salaireApprentissage: { 1: 700, 2: 1000, 3: 1350, 4: 1650 },
    salaireApresCFC: { min: 4500, max: 5500 },
    qualitesRequises: ["Habilete manuelle", "Sens esthetique", "Patience", "Creativite"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=282",
    icon: "\ud83e\ude91",
    profil: { manuel: 10, intellectuel: 3, creatif: 8, analytique: 4, interieur: 8, exterieur: 2, equipe: 3, independant: 9, contactHumain: 2, technique: 6, routine: 4, variete: 7 }
  },
  {
    id: "boulangerPatissier",
    nom: "Boulanger/ere-patissier/iere CFC",
    secteur: "artisanat",
    type: "CFC",
    duree: 3,
    description: "Prepare du pain, des viennoiseries et des patisseries artisanales dans une boulangerie.",
    activites: [
      "Petrir et faconner la pate",
      "Creer des patisseries et des desserts",
      "Gerer les temperatures et les temps de cuisson",
      "Decorer et presenter les produits"
    ],
    salaireApprentissage: { 1: 850, 2: 1100, 3: 1400 },
    salaireApresCFC: { min: 4200, max: 5000 },
    qualitesRequises: ["Creativite culinaire", "Leve-tot", "Precision", "Sens du gout"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=1465",
    icon: "\ud83c\udf5e",
    profil: { manuel: 9, intellectuel: 3, creatif: 8, analytique: 4, interieur: 10, exterieur: 0, equipe: 6, independant: 6, contactHumain: 4, technique: 5, routine: 6, variete: 5 }
  },
  {
    id: "coiffeur",
    nom: "Coiffeur/euse CFC",
    secteur: "artisanat",
    type: "CFC",
    duree: 3,
    description: "Coupe, coiffe et colore les cheveux tout en conseillant la clientele sur le style et les soins capillaires.",
    activites: [
      "Couper et coiffer les cheveux",
      "Realiser des colorations et des meches",
      "Conseiller les clients sur leur style",
      "Entretenir et gerer le salon"
    ],
    salaireApprentissage: { 1: 550, 2: 700, 3: 900 },
    salaireApresCFC: { min: 4000, max: 4500 },
    qualitesRequises: ["Creativite", "Sens du contact", "Dexterite", "Sens esthetique"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=44",
    icon: "\u2702\ufe0f",
    profil: { manuel: 8, intellectuel: 2, creatif: 9, analytique: 2, interieur: 10, exterieur: 0, equipe: 4, independant: 7, contactHumain: 10, technique: 3, routine: 5, variete: 6 }
  },

  // ===== GASTRONOMIE =====
  {
    id: "cuisinier",
    nom: "Cuisinier/iere CFC",
    secteur: "gastronomie",
    type: "CFC",
    duree: 3,
    description: "Prepare des plats dans un restaurant, un hotel ou une cantine, de l'entree au dessert.",
    activites: [
      "Preparer et cuisiner les plats du menu",
      "Creer de nouvelles recettes",
      "Gerer les commandes et les stocks alimentaires",
      "Respecter les normes d'hygiene (HACCP)"
    ],
    salaireApprentissage: { 1: 1020, 2: 1300, 3: 1550 },
    salaireApresCFC: { min: 4300, max: 5500 },
    qualitesRequises: ["Creativite culinaire", "Resistance au stress", "Rapidite", "Travail en equipe"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=68",
    icon: "\ud83d\udc68\u200d\ud83c\udf73",
    profil: { manuel: 9, intellectuel: 3, creatif: 8, analytique: 3, interieur: 10, exterieur: 0, equipe: 8, independant: 4, contactHumain: 5, technique: 5, routine: 4, variete: 8 }
  },
  {
    id: "specialisteHotellerie",
    nom: "Specialiste en hotellerie CFC",
    secteur: "gastronomie",
    type: "CFC",
    duree: 3,
    description: "Accueille les clients dans un hotel ou un restaurant et veille a leur bien-etre pendant leur sejour.",
    activites: [
      "Accueillir et conseiller les clients",
      "Gerer les reservations et le check-in",
      "Coordonner les equipes de service",
      "Organiser des evenements et des banquets"
    ],
    salaireApprentissage: { 1: 1020, 2: 1300, 3: 1550 },
    salaireApresCFC: { min: 4200, max: 5200 },
    qualitesRequises: ["Sens de l'accueil", "Polyvalence", "Langues etrangeres", "Elegance"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=277",
    icon: "\ud83c\udfe8",
    profil: { manuel: 5, intellectuel: 5, creatif: 4, analytique: 4, interieur: 8, exterieur: 2, equipe: 8, independant: 3, contactHumain: 10, technique: 3, routine: 5, variete: 7 }
  },

  // ===== NATURE =====
  {
    id: "agriculteur",
    nom: "Agriculteur/trice CFC",
    secteur: "nature",
    type: "CFC",
    duree: 3,
    description: "Cultive la terre, eleve des animaux et produit des denrees alimentaires dans une exploitation agricole.",
    activites: [
      "Cultiver des cereales, des legumes et des fruits",
      "S'occuper du betail et des animaux",
      "Conduire des tracteurs et des machines agricoles",
      "Gerer une exploitation de maniere durable"
    ],
    salaireApprentissage: { 1: 1200, 2: 1400, 3: 1600 },
    salaireApresCFC: { min: 4200, max: 5500 },
    qualitesRequises: ["Amour de la nature", "Endurance physique", "Autonomie", "Polyvalence"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=8",
    icon: "\ud83c\udf3e",
    profil: { manuel: 10, intellectuel: 4, creatif: 3, analytique: 5, interieur: 2, exterieur: 10, equipe: 5, independant: 8, contactHumain: 3, technique: 6, routine: 5, variete: 8 }
  },
  {
    id: "forestier",
    nom: "Forestier/iere-bucheron/ne CFC",
    secteur: "nature",
    type: "CFC",
    duree: 3,
    description: "Entretient les forets, abat des arbres et amenage des chemins forestiers dans le respect de l'environnement.",
    activites: [
      "Abattre et debiter des arbres",
      "Entretenir et planter des forets",
      "Construire des chemins et des ouvrages forestiers",
      "Utiliser la tronconneuse et des engins forestiers"
    ],
    salaireApprentissage: { 1: 900, 2: 1200, 3: 1500 },
    salaireApresCFC: { min: 4500, max: 5500 },
    qualitesRequises: ["Force physique", "Amour de la nature", "Prudence", "Autonomie"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=124",
    icon: "\ud83c\udf32",
    profil: { manuel: 10, intellectuel: 2, creatif: 2, analytique: 4, interieur: 0, exterieur: 10, equipe: 6, independant: 7, contactHumain: 2, technique: 6, routine: 4, variete: 7 }
  },
  {
    id: "horticulteur",
    nom: "Horticulteur/trice CFC",
    secteur: "nature",
    type: "CFC",
    duree: 3,
    description: "Cultive des plantes, des fleurs et des arbres dans des pepinieres, des serres ou des jardins.",
    activites: [
      "Planter, tailler et entretenir des vegetaux",
      "Creer des arrangements floraux et des jardins",
      "Gerer l'arrosage et la fertilisation",
      "Conseiller les clients sur les plantes"
    ],
    salaireApprentissage: { 1: 850, 2: 1050, 3: 1300 },
    salaireApresCFC: { min: 4200, max: 5200 },
    qualitesRequises: ["Sens esthetique", "Patience", "Amour des plantes", "Bonne condition physique"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=1713",
    icon: "\ud83c\udf3b",
    profil: { manuel: 9, intellectuel: 3, creatif: 6, analytique: 4, interieur: 2, exterieur: 9, equipe: 5, independant: 7, contactHumain: 4, technique: 5, routine: 5, variete: 7 }
  },

  // ===== SOCIAL =====
  {
    id: "assistantSocioEducatif",
    nom: "Assistant/e socio-educatif/ve CFC",
    secteur: "social",
    type: "CFC",
    duree: 3,
    description: "Accompagne des enfants, des personnes agees ou des personnes en situation de handicap dans leur quotidien.",
    activites: [
      "Organiser des activites educatives et ludiques",
      "Accompagner les repas et les soins quotidiens",
      "Soutenir le developpement des enfants",
      "Collaborer avec les familles et les professionnels"
    ],
    salaireApprentissage: { 1: 830, 2: 1040, 3: 1390 },
    salaireApresCFC: { min: 4500, max: 5500 },
    qualitesRequises: ["Empathie", "Patience", "Creativite", "Sens des responsabilites"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=1051",
    icon: "\ud83e\udde1",
    profil: { manuel: 4, intellectuel: 6, creatif: 7, analytique: 4, interieur: 7, exterieur: 3, equipe: 8, independant: 4, contactHumain: 10, technique: 2, routine: 4, variete: 8 }
  },

  // ===== ARTS / CREATION =====
  {
    id: "graphiste",
    nom: "Graphiste CFC",
    secteur: "artisanat",
    type: "CFC",
    duree: 4,
    description: "Concoit des visuels, des logos, des affiches et des supports de communication pour des entreprises et des marques.",
    activites: [
      "Creer des logos et des identites visuelles",
      "Concevoir des affiches, flyers et brochures",
      "Travailler avec Photoshop, Illustrator et InDesign",
      "Presenter des concepts aux clients"
    ],
    salaireApprentissage: { 1: 400, 2: 700, 3: 1000, 4: 1200 },
    salaireApresCFC: { min: 4200, max: 5500 },
    qualitesRequises: ["Creativite", "Sens esthetique", "Maitrise informatique", "Ouverture d'esprit"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=138",
    icon: "\ud83c\udfa8",
    profil: { manuel: 4, intellectuel: 6, creatif: 10, analytique: 4, interieur: 10, exterieur: 0, equipe: 5, independant: 8, contactHumain: 5, technique: 6, routine: 3, variete: 8 }
  },
  {
    id: "polygraphe",
    nom: "Polygraphe CFC",
    secteur: "artisanat",
    type: "CFC",
    duree: 4,
    description: "Prepare les documents pour l'impression : mise en page, traitement d'images et gestion des couleurs.",
    activites: [
      "Mettre en page des livres, magazines et journaux",
      "Retoucher et optimiser des images",
      "Preparer les fichiers pour l'impression",
      "Verifier la qualite des couleurs et des textes"
    ],
    salaireApprentissage: { 1: 600, 2: 800, 3: 1000, 4: 1400 },
    salaireApresCFC: { min: 4400, max: 5500 },
    qualitesRequises: ["Sens du detail", "Maitrise informatique", "Sens esthetique", "Rigueur"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=232",
    icon: "\ud83d\udcf0",
    profil: { manuel: 4, intellectuel: 6, creatif: 8, analytique: 6, interieur: 10, exterieur: 0, equipe: 5, independant: 7, contactHumain: 3, technique: 7, routine: 5, variete: 6 }
  },

  // ===== AUTOMOBILE =====
  {
    id: "mecanicienAuto",
    nom: "Mecanicien/ne en maintenance d'automobiles CFC",
    secteur: "automobile",
    type: "CFC",
    duree: 4,
    description: "Entretient et repare les vehicules automobiles, du moteur a l'electronique embarquee.",
    activites: [
      "Diagnostiquer les pannes avec des outils electroniques",
      "Remplacer et reparer les pieces mecaniques",
      "Effectuer les services et les controles",
      "Travailler sur les systemes electriques et hybrides"
    ],
    salaireApprentissage: { 1: 700, 2: 900, 3: 1150, 4: 1400 },
    salaireApresCFC: { min: 4500, max: 5500 },
    qualitesRequises: ["Sens technique", "Logique", "Habilete manuelle", "Curiosite"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=1029",
    icon: "\ud83d\ude97",
    profil: { manuel: 9, intellectuel: 4, creatif: 3, analytique: 7, interieur: 8, exterieur: 2, equipe: 5, independant: 7, contactHumain: 4, technique: 9, routine: 5, variete: 6 }
  },

  // ===== PEINTURE =====
  {
    id: "peintre",
    nom: "Peintre CFC",
    secteur: "construction",
    type: "CFC",
    duree: 3,
    description: "Peint et decore les surfaces interieures et exterieures des batiments, pose du papier peint et realise des finitions.",
    activites: [
      "Preparer les surfaces (poncer, enduire)",
      "Appliquer des peintures et des vernis",
      "Poser du papier peint et des revetements",
      "Conseiller les clients sur les couleurs"
    ],
    salaireApprentissage: { 1: 700, 2: 900, 3: 1600 },
    salaireApresCFC: { min: 4500, max: 5500 },
    qualitesRequises: ["Sens des couleurs", "Precision", "Bonne condition physique", "Travail en hauteur"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=216",
    icon: "\ud83c\udfa8",
    profil: { manuel: 9, intellectuel: 2, creatif: 6, analytique: 3, interieur: 5, exterieur: 5, equipe: 7, independant: 5, contactHumain: 4, technique: 5, routine: 6, variete: 5 }
  },

  // ===== AERONAUTIQUE =====
  {
    id: "mecanicienAerostructures",
    nom: "Mecanicien/ne d'aerostructures",
    secteur: "aeronautique",
    type: "CFC+",
    duree: 4,
    description: "Entretient et repare la structure des avions (fuselage, ailes, train d'atterrissage) chez des acteurs comme SR Technics a Zurich.",
    activites: [
      "Inspecter la structure des avions",
      "Reparer et remplacer des elements du fuselage",
      "Utiliser des outils de mesure de precision",
      "Appliquer les normes de securite aeronautique (EASA)"
    ],
    salaireApprentissage: { 1: 750, 2: 950, 3: 1250, 4: 1600 },
    salaireApresCFC: { min: 5000, max: 6800 },
    qualitesRequises: ["Precision extreme", "Rigueur", "Passion pour l'aviation", "Sens des responsabilites"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=233",
    icon: "\u2708\ufe0f",
    profil: { manuel: 8, intellectuel: 6, creatif: 3, analytique: 8, interieur: 7, exterieur: 3, equipe: 6, independant: 6, contactHumain: 3, technique: 10, routine: 5, variete: 6 },
    passerelle: "Acces via Polymecanicien/ne CFC puis formation complementaire aeronautique. SR Technics et RUAG a Zurich forment ces specialistes."
  },
  {
    id: "agentExploitation",
    nom: "Agent/e d'exploitation CFC",
    secteur: "aeronautique",
    type: "CFC",
    duree: 3,
    description: "Coordonne les operations logistiques et techniques dans un aeroport ou une grande infrastructure de transport.",
    activites: [
      "Coordonner le chargement et dechargement des avions",
      "Gerer le planning des operations au sol",
      "Communiquer avec les equipages et le controle aerien",
      "Assurer le respect des horaires et de la securite"
    ],
    salaireApprentissage: { 1: 800, 2: 1000, 3: 1400 },
    salaireApresCFC: { min: 4500, max: 5800 },
    qualitesRequises: ["Organisation", "Resistance au stress", "Communication", "Reactivite"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=1075",
    icon: "\ud83d\udee9\ufe0f",
    profil: { manuel: 5, intellectuel: 6, creatif: 3, analytique: 7, interieur: 4, exterieur: 6, equipe: 9, independant: 3, contactHumain: 7, technique: 6, routine: 5, variete: 8 },
    passerelle: "Possibilite d'evoluer vers controleur/euse du trafic aerien avec une formation superieure (skyguide)."
  },
  {
    id: "electronicienAvionique",
    nom: "Electronicien/ne CFC — orientation avionique",
    secteur: "aeronautique",
    type: "CFC",
    duree: 4,
    description: "Se specialise dans l'electronique embarquee des avions : instruments de vol, systemes de navigation et de communication.",
    activites: [
      "Tester et calibrer les instruments de bord",
      "Reparer les systemes de navigation et radar",
      "Programmer les calculateurs de vol",
      "Appliquer les certifications aeronautiques"
    ],
    salaireApprentissage: { 1: 600, 2: 800, 3: 1050, 4: 1350 },
    salaireApresCFC: { min: 5200, max: 7000 },
    qualitesRequises: ["Precision", "Esprit analytique", "Passion aeronautique", "Rigueur"],
    urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=94",
    icon: "\ud83d\udef0\ufe0f",
    profil: { manuel: 5, intellectuel: 9, creatif: 4, analytique: 9, interieur: 7, exterieur: 3, equipe: 5, independant: 7, contactHumain: 3, technique: 10, routine: 4, variete: 7 },
    passerelle: "Formation d'electronicien CFC suivie d'une specialisation avionique. Employeurs : SR Technics, RUAG, Pilatus Aircraft."
  }
];
