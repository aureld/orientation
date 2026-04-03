import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Scraped profession data ─────────────────────────────

interface ScrapedProfession {
  name: string;
  url: string;
  orientationId: string;
  domainesProfessionnels: string;
  niveauxDeFormation: string;
  swissdoc: string;
  miseAJour: string;
  description: string;
  formation: string;
  perspectivesProfessionnelles: string;
  autresInformations: string;
  adressesUtiles: string;
}

function slugify(name: string): string {
  let slug = name.split(/\s+CFC/)[0].trim();
  slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  slug = slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return slug;
}

function extractDuration(formation: string): number {
  const dureeSection = formation.split("### Dur")[1] || formation;
  const match = dureeSection.match(/(\d)\s*ans?/);
  return match ? parseInt(match[1], 10) : 3;
}

/**
 * Extract the swissdoc main group code from a swissdoc number.
 * "0.561.28.0" → bloc2 "561" → first digit "5" → group "500"
 */
function swissdocMainGroup(swissdoc: string): string {
  const bloc2 = swissdoc.split(".")[1]; // "561"
  return bloc2[0] + "00"; // "500"
}

// ─── Sectors ─────────────────────────────────────────────

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

// ─── Scenarios ───────────────────────────────────────────

const scenarios = [
  // ===== 1. HÔPITAL =====
  {
    id: "hopital", sectorId: "sante", icon: "🏥",
    fr: { title: "Une journée à l'hôpital", description: "Découvre les coulisses de l'hôpital cantonal de Zurich et ses différents métiers de la santé." },
    scenes: [
      { sceneKey: "arrivee", isFinal: false, sortOrder: 0,
        fr: "Il est 7h du matin. Tu arrives à l'Universitätsspital de Zurich, l'un des plus grands hôpitaux de Suisse. L'infirmière-chef t'accueille avec un sourire. « Bienvenue pour ton stage d'observation ! Tu as trois services à découvrir ce matin. Lequel t'attire le plus ? »",
        choices: [
          { text: "Les urgences — ça a l'air intense et plein d'action !", tags: { variete: 2, contactHumain: 2, equipe: 1 }, nextSceneKey: "urgences1" },
          { text: "Le laboratoire d'analyses — tu veux voir les microscopes et les machines", tags: { analytique: 2, technique: 2, independant: 1 }, nextSceneKey: "labo1" },
          { text: "La physiothérapie — aider les gens à retrouver leur mobilité t'intéresse", tags: { manuel: 2, contactHumain: 2, creatif: 1 }, nextSceneKey: "physio1" },
        ],
      },
      { sceneKey: "urgences1", isFinal: false, sortOrder: 1,
        fr: "Aux urgences, l'ambiance est électrique. Un patient arrive avec une blessure au bras après un accident de vélo. Le médecin urgentiste te laisse observer de près. Pendant que l'équipe s'active, tu...",
        choices: [
          { text: "Observes attentivement la technique du médecin et tu prends des notes mentales", tags: { analytique: 2, intellectuel: 2 }, nextSceneKey: "urgences2" },
          { text: "Te tournes vers le patient pour le rassurer et lui parler calmement", tags: { contactHumain: 3, equipe: 1 }, nextSceneKey: "urgences2" },
        ],
      },
      { sceneKey: "urgences2", isFinal: false, sortOrder: 2,
        fr: "Le médecin te dit : « Aux urgences, chaque minute compte. On doit être rapide, précis et garder son calme. » Il te montre comment ils organisent les patients par priorité (le triage). C'est fascinant — ou stressant ?",
        choices: [
          { text: "Fascinant ! Tu adores l'idée de sauver des vies sous pression", tags: { variete: 2, equipe: 1, contactHumain: 1 }, nextSceneKey: "urgencesFin" },
          { text: "Intéressant mais tu préférerais un rythme plus calme et régulier", tags: { routine: 2, independant: 1 }, nextSceneKey: "urgencesFin" },
        ],
      },
      { sceneKey: "urgencesFin", isFinal: true, sortOrder: 3,
        fr: "Ta matinée aux urgences est terminée. Tu as découvert un monde intense où le travail d'équipe sauve des vies chaque jour. Les soignants ici sont des héros du quotidien !",
        choices: [], resumeProfessions: ["assistant-en-soins-et-sante-communautaire", "assistant-en-pharmacie"],
      },
      { sceneKey: "labo1", isFinal: false, sortOrder: 1,
        fr: "Le laboratoire est immense et silencieux. Des rangées de machines analysent des échantillons de sang, d'urine et de tissus. La laborantine te montre un microscope et t'invite à regarder. Tu vois des cellules vivantes !",
        choices: [
          { text: "Tu es fasciné par les cellules et tu poses plein de questions sur la biologie", tags: { intellectuel: 2, analytique: 2, independant: 1 }, nextSceneKey: "labo2" },
          { text: "Tu es surtout impressionné par les machines et tu veux savoir comment elles fonctionnent", tags: { technique: 2, analytique: 1, manuel: 1 }, nextSceneKey: "labo2" },
        ],
      },
      { sceneKey: "labo2", isFinal: false, sortOrder: 2,
        fr: "La laborantine te confie : « Ici, on est les détectives de l'hôpital. Nos analyses permettent aux médecins de poser le bon diagnostic. » Elle te laisse pipeter un échantillon coloré. C'est un geste de précision !",
        choices: [
          { text: "Tu adores la précision et la concentration que ça demande", tags: { manuel: 2, analytique: 1, routine: 1 }, nextSceneKey: "laboFin" },
          { text: "C'est intéressant mais tu aimerais plus de contact avec les gens", tags: { contactHumain: 2, equipe: 1 }, nextSceneKey: "laboFin" },
        ],
      },
      { sceneKey: "laboFin", isFinal: true, sortOrder: 3,
        fr: "Ta matinée au labo est terminée. Tu as découvert un monde de précision scientifique où chaque analyse compte. Les laborantins sont essentiels même si on ne les voit pas !",
        choices: [], resumeProfessions: ["laborantin", "assistant-en-pharmacie"],
      },
      { sceneKey: "physio1", isFinal: false, sortOrder: 1,
        fr: "En physiothérapie, tu rencontres un patient qui se remet d'une opération au genou. Le physiothérapeute lui fait faire des exercices avec patience et bonne humeur. Il te propose de l'aider.",
        choices: [
          { text: "Tu aides le patient avec les exercices — c'est physique mais gratifiant", tags: { manuel: 2, contactHumain: 2, equipe: 1 }, nextSceneKey: "physio2" },
          { text: "Tu observes la technique et tu notes les exercices prescrits", tags: { analytique: 1, intellectuel: 2, independant: 1 }, nextSceneKey: "physio2" },
        ],
      },
      { sceneKey: "physio2", isFinal: false, sortOrder: 2,
        fr: "Le physiothérapeute te dit : « Mon métier c'est aider les gens à retrouver leur liberté de mouvement. C'est un travail où on voit les progrès au quotidien. » Le patient le remercie chaleureusement.",
        choices: [
          { text: "Ça te touche — aider concrètement les gens, c'est ce qui te motive", tags: { contactHumain: 3, variete: 1 }, nextSceneKey: "physioFin" },
          { text: "Tu aimes l'aspect sport et mouvement de ce métier", tags: { manuel: 2, exterieur: 1, variete: 1 }, nextSceneKey: "physioFin" },
        ],
      },
      { sceneKey: "physioFin", isFinal: true, sortOrder: 3,
        fr: "Ta matinée en physiothérapie est terminée. Tu as découvert un métier qui combine le contact humain, le mouvement et la satisfaction de voir les gens progresser.",
        choices: [], resumeProfessions: ["assistant-en-soins-et-sante-communautaire", "assistant-socio-educatif"],
      },
    ],
  },
  // ===== 2. CHANTIER =====
  {
    id: "chantier", sectorId: "construction", icon: "🏗️",
    fr: { title: "Le grand chantier", description: "Un immense chantier de construction à Zurich-Oerlikon. Découvre les métiers qui construisent la ville de demain." },
    scenes: [
      { sceneKey: "arrivee", isFinal: false, sortOrder: 0,
        fr: "Tu arrives sur un chantier impressionnant à Oerlikon. Des grues géantes, des ouvriers en casques, le bruit des machines... Le chef de chantier te donne un casque et des chaussures de sécurité. « Aujourd'hui tu vas découvrir trois aspects du métier. Par quoi on commence ? »",
        choices: [
          { text: "Avec les maçons sur les murs — tu veux toucher le béton !", tags: { manuel: 2, exterieur: 2, equipe: 1 }, nextSceneKey: "macon1" },
          { text: "Au bureau technique avec les plans — tu veux comprendre comment on conçoit un bâtiment", tags: { intellectuel: 2, creatif: 2, interieur: 1 }, nextSceneKey: "bureau1" },
          { text: "Avec les charpentiers sur la toiture — tu n'as pas peur des hauteurs", tags: { manuel: 2, exterieur: 2, variete: 1 }, nextSceneKey: "charpente1" },
        ],
      },
      { sceneKey: "macon1", isFinal: false, sortOrder: 1,
        fr: "Le maçon te montre comment monter un mur en briques. Il aligne chaque brique avec précision, applique le mortier et vérifie le niveau. C'est plus technique qu'il n'y paraît !",
        choices: [
          { text: "Tu essayes de poser une brique — c'est lourd mais satisfaisant de construire quelque chose", tags: { manuel: 3, equipe: 1 }, nextSceneKey: "maconFin" },
          { text: "Tu es plus intéressé par les machines du chantier : la bétonnière, la grue...", tags: { technique: 2, manuel: 1, variete: 1 }, nextSceneKey: "maconFin" },
        ],
      },
      { sceneKey: "maconFin", isFinal: true, sortOrder: 2,
        fr: "Le maçon te dit : « À la fin de la journée, tu vois ce que tu as construit. C'est la plus belle satisfaction. » Tu comprends pourquoi ce métier est un des mieux payés dans la construction.",
        choices: [], resumeProfessions: ["macon", "installateur-sanitaire", "peintre"],
      },
      { sceneKey: "bureau1", isFinal: false, sortOrder: 1,
        fr: "Au bureau technique, une dessinatrice en architecture te montre les plans du bâtiment sur son grand écran. Elle utilise un logiciel de CAO pour dessiner en 3D. C'est comme un jeu vidéo, mais pour construire de vrais immeubles !",
        choices: [
          { text: "Tu adores l'idée de dessiner des bâtiments sur ordinateur — c'est créatif et technique à la fois", tags: { creatif: 2, technique: 2, interieur: 1 }, nextSceneKey: "bureauFin" },
          { text: "Tu préfères les calculs de structure — combien de poids chaque mur peut supporter ?", tags: { analytique: 2, intellectuel: 2, routine: 1 }, nextSceneKey: "bureauFin" },
        ],
      },
      { sceneKey: "bureauFin", isFinal: true, sortOrder: 2,
        fr: "La dessinatrice te dit : « Chaque bâtiment commence par un dessin. Sans nous, les maçons ne sauraient pas quoi construire ! » Tu découvres un métier créatif dans un secteur inattendu.",
        choices: [], resumeProfessions: ["dessinateur", "installateur-sanitaire"],
      },
      { sceneKey: "charpente1", isFinal: false, sortOrder: 1,
        fr: "Tu grimpes sur l'échafaudage avec le charpentier. Tout en haut, la vue sur Zurich est incroyable ! Il te montre comment assembler les poutres qui formeront la charpente du toit. L'odeur du bois frais est agréable.",
        choices: [
          { text: "Tu adores travailler en hauteur avec cette vue — le vertige n'est pas pour toi", tags: { exterieur: 2, manuel: 2, variete: 1 }, nextSceneKey: "charpenteFin" },
          { text: "Tu es fasciné par le travail du bois — les assemblages sont comme un puzzle géant", tags: { manuel: 2, creatif: 2, independant: 1 }, nextSceneKey: "charpenteFin" },
        ],
      },
      { sceneKey: "charpenteFin", isFinal: true, sortOrder: 2,
        fr: "Le charpentier te dit : « Le bois est un matériau vivant. Chaque charpente est unique, comme une œuvre d'art. » Un métier qui mêle force physique, précision et créativité.",
        choices: [], resumeProfessions: ["charpentier", "ebeniste", "macon"],
      },
    ],
  },
  // ===== 3. BANQUE =====
  {
    id: "banque", sectorId: "commerce", icon: "🏦",
    fr: { title: "Au cœur de la finance", description: "Paradeplatz, Zurich : passe une journée dans les bureaux d'une grande entreprise et découvre le monde du commerce." },
    scenes: [
      { sceneKey: "arrivee", isFinal: false, sortOrder: 0,
        fr: "Tu arrives à la Paradeplatz, le cœur financier de Zurich. Les immeubles de bureaux sont impressionnants. Ton guide pour la journée t'accueille : « Ici on gère des milliers de clients et des tonnes de documents. Tu veux voir quel aspect du travail ? »",
        choices: [
          { text: "L'accueil et la relation client — tu aimes parler aux gens", tags: { contactHumain: 2, equipe: 1, interieur: 1 }, nextSceneKey: "accueil1" },
          { text: "La logistique et le courrier — tu veux bouger et organiser", tags: { manuel: 2, variete: 1, independant: 1 }, nextSceneKey: "logistique1" },
          { text: "Le back-office et les chiffres — les tableaux de données ça te plaît", tags: { analytique: 2, intellectuel: 1, routine: 1 }, nextSceneKey: "backoffice1" },
        ],
      },
      { sceneKey: "accueil1", isFinal: false, sortOrder: 1, fr: "À l'accueil, tu observes comment l'employée de commerce reçoit les clients. Elle parle allemand, anglais et français dans la même heure ! Un client a un problème avec son compte, elle le résout avec calme et professionnalisme.",
        choices: [
          { text: "Tu admires sa capacité à gérer les gens et à jongler entre les langues", tags: { contactHumain: 2, variete: 1, intellectuel: 1 }, nextSceneKey: "accueilFin" },
          { text: "Tu te dis que rester assis à un bureau toute la journée serait difficile pour toi", tags: { exterieur: 1, manuel: 1, variete: 1 }, nextSceneKey: "accueilFin" },
        ],
      },
      { sceneKey: "accueilFin", isFinal: true, sortOrder: 2, fr: "L'employée te dit : « Dans le commerce, on apprend à communiquer, à organiser et à résoudre des problèmes. C'est un CFC qui ouvre beaucoup de portes. » Un métier polyvalent et recherché.",
        choices: [], resumeProfessions: ["employe-de-commerce", "gestionnaire-du-commerce-de-detail"],
      },
      { sceneKey: "logistique1", isFinal: false, sortOrder: 1, fr: "Au département logistique, c'est un autre monde : des chariots, des colis, un entrepôt organisé au millimètre. Le logisticien scanne des paquets à toute vitesse et les range dans le bon rayon.",
        choices: [
          { text: "Tu aimes l'idée de bouger et d'organiser — c'est concret et physique", tags: { manuel: 2, routine: 1, independant: 1 }, nextSceneKey: "logistiqueFin" },
          { text: "Tu es impressionné par le système informatique qui gère tout", tags: { technique: 2, analytique: 1 }, nextSceneKey: "logistiqueFin" },
        ],
      },
      { sceneKey: "logistiqueFin", isFinal: true, sortOrder: 2, fr: "Le logisticien te dit : « Sans nous, rien ne bouge. On est le cœur invisible de chaque entreprise. » Un métier actif avec de bonnes perspectives et un salaire correct.",
        choices: [], resumeProfessions: ["logisticien", "employe-de-commerce"],
      },
      { sceneKey: "backoffice1", isFinal: false, sortOrder: 1, fr: "Au back-office, tout est calme et ordonné. Des employés travaillent sur des tableurs, vérifient des factures et préparent des rapports. Un employé te montre comment il analyse les données de vente du mois.",
        choices: [
          { text: "Tu trouves les chiffres fascinants — comprendre les tendances c'est comme résoudre une enquête", tags: { analytique: 2, intellectuel: 2, independant: 1 }, nextSceneKey: "backofficeFin" },
          { text: "C'est trop calme pour toi — tu préfères l'action et le contact", tags: { contactHumain: 1, variete: 1, exterieur: 1 }, nextSceneKey: "backofficeFin" },
        ],
      },
      { sceneKey: "backofficeFin", isFinal: true, sortOrder: 2, fr: "L'employé te dit : « Les données racontent une histoire. Savoir les lire c'est un super pouvoir dans n'importe quelle entreprise. » Un monde de rigueur et de précision.",
        choices: [], resumeProfessions: ["employe-de-commerce", "logisticien"],
      },
    ],
  },
  // ===== 4. RESTAURANT =====
  {
    id: "restaurant", sectorId: "gastronomie", icon: "🍽️",
    fr: { title: "Le restaurant étoilé", description: "Un restaurant gastronomique près du lac de Zurich te fait découvrir l'univers passionnant de l'hôtellerie-restauration." },
    scenes: [
      { sceneKey: "arrivee", isFinal: false, sortOrder: 0, fr: "Tu arrives dans un beau restaurant au bord du lac. L'équipe prépare le service du midi. Ça sent incroyablement bon ! Le chef te dit : « On a besoin de bras partout aujourd'hui. Où tu veux te rendre utile ? »",
        choices: [
          { text: "En cuisine avec toi, Chef ! Tu veux apprendre à cuisiner", tags: { manuel: 2, creatif: 2, interieur: 1 }, nextSceneKey: "cuisine1" },
          { text: "En salle — tu veux accueillir les clients et gérer le service", tags: { contactHumain: 2, equipe: 2, variete: 1 }, nextSceneKey: "salle1" },
          { text: "À la réception de l'hôtel — tu veux découvrir la gestion", tags: { intellectuel: 1, contactHumain: 1, routine: 1, interieur: 1 }, nextSceneKey: "reception1" },
        ],
      },
      { sceneKey: "cuisine1", isFinal: false, sortOrder: 1, fr: "En cuisine, c'est le feu d'artifice : les casseroles sifflent, le chef donne des ordres, les commis s'activent. On te confie l'épluchage des légumes et la préparation d'une sauce. La pression monte avant le service !",
        choices: [
          { text: "Tu adores ce rythme intense — la pression te donne de l'énergie", tags: { variete: 2, equipe: 1, manuel: 1 }, nextSceneKey: "cuisineFin" },
          { text: "Tu es fasciné par le côté créatif — inventer un plat c'est comme créer une œuvre d'art", tags: { creatif: 3, independant: 1 }, nextSceneKey: "cuisineFin" },
        ],
      },
      { sceneKey: "cuisineFin", isFinal: true, sortOrder: 2, fr: "Le chef te dit : « La cuisine c'est de l'amour, de la technique et du courage. Chaque assiette est une fierté. » Les horaires sont longs mais la passion est immense.",
        choices: [], resumeProfessions: ["cuisinier", "boulanger-patissier-confiseur"],
      },
      { sceneKey: "salle1", isFinal: false, sortOrder: 1, fr: "En salle, le maître d'hôtel te montre comment dresser une table parfaite : chaque verre, chaque couvert a sa place. Puis les premiers clients arrivent. Tu dois les accueillir avec le sourire et les guider à leur table.",
        choices: [
          { text: "Tu te sens à l'aise — parler aux gens et les rendre heureux c'est ton truc", tags: { contactHumain: 3, equipe: 1 }, nextSceneKey: "salleFin" },
          { text: "Tu préfères l'organisation — gérer les tables et les timings c'est comme un jeu de stratégie", tags: { analytique: 2, routine: 1, independant: 1 }, nextSceneKey: "salleFin" },
        ],
      },
      { sceneKey: "salleFin", isFinal: true, sortOrder: 2, fr: "Le maître d'hôtel te dit : « L'hôtellerie c'est l'art de faire vivre des moments inoubliables aux gens. Et on voyage beaucoup avec ce métier ! » Un monde d'élégance et de contact humain.",
        choices: [], resumeProfessions: ["gestionnaire-en-hotellerie-intendance", "gestionnaire-du-commerce-de-detail"],
      },
      { sceneKey: "reception1", isFinal: false, sortOrder: 1, fr: "À la réception de l'hôtel attaché au restaurant, tu découvres la gestion des réservations, le check-in des clients et l'organisation des événements. La réceptionniste parle quatre langues !",
        choices: [
          { text: "Tu es impressionné par le côté international — parler des langues pour aider les gens du monde entier", tags: { contactHumain: 2, intellectuel: 1, variete: 1 }, nextSceneKey: "receptionFin" },
          { text: "Tu aimes le côté organisation — planifier les chambres et les événements c'est satisfaisant", tags: { analytique: 2, routine: 1, independant: 1 }, nextSceneKey: "receptionFin" },
        ],
      },
      { sceneKey: "receptionFin", isFinal: true, sortOrder: 2, fr: "La réceptionniste te dit : « Chaque journée est différente. On résout des problèmes, on fait plaisir aux gens et on travaille dans un cadre magnifique. »",
        choices: [], resumeProfessions: ["gestionnaire-en-hotellerie-intendance", "employe-de-commerce"],
      },
    ],
  },
  // ===== 5. ATELIER CRÉATIF =====
  {
    id: "atelier", sectorId: "artisanat", icon: "🎨",
    fr: { title: "L'atelier créatif", description: "Zurich-West, le quartier branché : explore des ateliers où l'artisanat rencontre la créativité." },
    scenes: [
      { sceneKey: "arrivee", isFinal: false, sortOrder: 0, fr: "Tu es dans un grand bâtiment industriel reconverti en ateliers créatifs à Zurich-West. L'endroit est cool : murs en briques, grandes fenêtres, musique en fond. Trois portes s'ouvrent devant toi.",
        choices: [
          { text: "L'atelier de menuiserie — ça sent le bois et tu entends les machines", tags: { manuel: 2, independant: 1, creatif: 1 }, nextSceneKey: "bois1" },
          { text: "Le studio de design graphique — des écrans partout et des affiches colorées", tags: { creatif: 2, technique: 1, interieur: 1 }, nextSceneKey: "design1" },
          { text: "Le salon de coiffure tendance — musique et ambiance décontractée", tags: { contactHumain: 2, creatif: 1, variete: 1 }, nextSceneKey: "coiffure1" },
        ],
      },
      { sceneKey: "bois1", isFinal: false, sortOrder: 1, fr: "L'ébéniste te montre son dernier projet : une table en noyer faite sur mesure pour un client. Chaque pièce est taillée, poncée et assemblée à la main. Il te laisse essayer le rabot.",
        choices: [
          { text: "C'est génial ! Créer quelque chose de beau avec tes mains, tu adores", tags: { manuel: 3, creatif: 1, independant: 1 }, nextSceneKey: "boisFin" },
          { text: "Tu es plus intéressé par le design — dessiner le meuble avant de le construire", tags: { creatif: 2, intellectuel: 1, analytique: 1 }, nextSceneKey: "boisFin" },
        ],
      },
      { sceneKey: "boisFin", isFinal: true, sortOrder: 2, fr: "L'ébéniste te dit : « Je crée des objets qui durent toute une vie. Chaque meuble raconte une histoire. » Un métier d'artiste manuel où la patience est reine.",
        choices: [], resumeProfessions: ["ebeniste", "charpentier"],
      },
      { sceneKey: "design1", isFinal: false, sortOrder: 1, fr: "La graphiste travaille sur un logo pour une startup zurichoise. Sur son écran : Illustrator, des palettes de couleurs, des dizaines de versions. Elle te montre comment transformer une idée en image.",
        choices: [
          { text: "Tu veux essayer ! Tu as toujours aimé dessiner et créer des visuels", tags: { creatif: 3, technique: 1 }, nextSceneKey: "designFin" },
          { text: "Tu es plus intéressé par le côté technique — les logiciels et la mise en page", tags: { technique: 2, analytique: 1, interieur: 1 }, nextSceneKey: "designFin" },
        ],
      },
      { sceneKey: "designFin", isFinal: true, sortOrder: 2, fr: "La graphiste te dit : « Le graphisme c'est résoudre des problèmes visuels. Chaque projet est un nouveau défi créatif. » Un métier parfait pour ceux qui pensent en images.",
        choices: [], resumeProfessions: ["graphiste", "polygraphe", "mediamaticien"],
      },
      { sceneKey: "coiffure1", isFinal: false, sortOrder: 1, fr: "Le salon est plein de clients. Le coiffeur fait une coupe tendance tout en discutant avec son client. Il te dit : « Tu veux essayer de faire un brushing ? » L'ambiance est cool et détendue.",
        choices: [
          { text: "Tu te lances — le contact avec les gens et le côté créatif te plaisent", tags: { contactHumain: 2, creatif: 2, manuel: 1 }, nextSceneKey: "coiffureFin" },
          { text: "Tu préfères observer — tu es impressionné par la dextérité et le sens du style", tags: { creatif: 2, manuel: 1, independant: 1 }, nextSceneKey: "coiffureFin" },
        ],
      },
      { sceneKey: "coiffureFin", isFinal: true, sortOrder: 2, fr: "Le coiffeur te dit : « Mon métier c'est rendre les gens heureux quand ils se regardent dans le miroir. Et chaque tête est différente ! » Un métier créatif avec beaucoup de contact humain.",
        choices: [], resumeProfessions: ["coiffeur", "graphiste"],
      },
    ],
  },
  // ===== 6. FERME =====
  {
    id: "ferme", sectorId: "nature", icon: "🌾",
    fr: { title: "La ferme high-tech", description: "Près de Winterthour, une exploitation agricole moderne te fait découvrir les métiers de la nature." },
    scenes: [
      { sceneKey: "arrivee", isFinal: false, sortOrder: 0, fr: "Tu arrives dans une grande ferme près de Winterthour. C'est pas la ferme de ton grand-père : il y a un robot de traite, des drones pour surveiller les champs et un tracteur GPS ! L'agriculteur t'accueille : « Ici la nature rencontre la technologie. »",
        choices: [
          { text: "Tu veux aller dans les champs avec les animaux — rien ne vaut le grand air !", tags: { exterieur: 3, manuel: 2 }, nextSceneKey: "champs1" },
          { text: "Tu veux découvrir la forêt voisine — les arbres et le calme t'attirent", tags: { exterieur: 2, independant: 2, manuel: 1 }, nextSceneKey: "foret1" },
          { text: "Tu veux voir les serres et les plantes — le vert c'est ta couleur", tags: { creatif: 1, manuel: 1, exterieur: 1, variete: 1 }, nextSceneKey: "serre1" },
        ],
      },
      { sceneKey: "champs1", isFinal: false, sortOrder: 1, fr: "Dans le pré, tu aides à déplacer les vaches vers un nouveau pâturage. Le chien de berger court partout. Ensuite l'agriculteur te montre comment piloter le drone pour repérer les zones sèches du champ de blé.",
        choices: [
          { text: "Tu adores être dehors avec les animaux — la nature c'est ton élément", tags: { exterieur: 2, manuel: 1, variete: 1 }, nextSceneKey: "champsFin" },
          { text: "Le drone et la technologie agricole te fascinent plus que les vaches", tags: { technique: 2, analytique: 1, intellectuel: 1 }, nextSceneKey: "champsFin" },
        ],
      },
      { sceneKey: "champsFin", isFinal: true, sortOrder: 2, fr: "L'agriculteur te dit : « Nourrir les gens c'est le plus beau métier du monde. Et aujourd'hui on le fait avec des outils incroyables. » Un métier en pleine évolution, mieux payé qu'on ne croit.",
        choices: [], resumeProfessions: ["agriculteur", "horticulteur"],
      },
      { sceneKey: "foret1", isFinal: false, sortOrder: 1, fr: "En forêt avec le forestier-bûcheron, tu découvres comment on gère une forêt durablement. Il abat un arbre avec précision — l'arbre tombe exactement où il voulait. C'est impressionnant et un peu effrayant !",
        choices: [
          { text: "Tu adores la puissance et la précision — travailler en forêt c'est l'aventure", tags: { manuel: 3, exterieur: 2 }, nextSceneKey: "foretFin" },
          { text: "Tu es plus sensible au côté écologique — protéger la forêt c'est important", tags: { intellectuel: 1, independant: 1, variete: 1 }, nextSceneKey: "foretFin" },
        ],
      },
      { sceneKey: "foretFin", isFinal: true, sortOrder: 2, fr: "Le forestier te dit : « Je suis le gardien de cette forêt. Chaque arbre que je plante sera là dans 100 ans. » Un métier physique et solitaire pour les amoureux de la nature.",
        choices: [], resumeProfessions: ["forestier-bucheron", "agriculteur"],
      },
      { sceneKey: "serre1", isFinal: false, sortOrder: 1, fr: "Dans la serre, c'est un jardin tropical : des orchidées, des tomates, des herbes aromatiques. L'horticultrice te montre comment bouturer une plante. Tu apprends que les plantes réagissent à la lumière, à l'eau et même à la musique !",
        choices: [
          { text: "Tu adores le côté créatif — combiner les couleurs et créer des jardins", tags: { creatif: 2, manuel: 1, independant: 1 }, nextSceneKey: "serreFin" },
          { text: "Tu es plus intéressé par la science — comment les plantes poussent et ce dont elles ont besoin", tags: { analytique: 2, intellectuel: 1, routine: 1 }, nextSceneKey: "serreFin" },
        ],
      },
      { sceneKey: "serreFin", isFinal: true, sortOrder: 2, fr: "L'horticultrice te dit : « Faire pousser des plantes c'est de la magie lente. Et un beau jardin rend les gens heureux. » Un métier entre art et science, proche de la nature.",
        choices: [], resumeProfessions: ["horticulteur", "agriculteur"],
      },
    ],
  },
  // ===== 7. LABO TECH =====
  {
    id: "labotech", sectorId: "technique", icon: "🤖",
    fr: { title: "Le labo tech", description: "Une usine high-tech avec des robots et des machines de précision. Le futur de l'industrie suisse !" },
    scenes: [
      { sceneKey: "arrivee", isFinal: false, sortOrder: 0, fr: "Tu visites une usine de haute technologie à Winterthour, un des berceaux de l'industrie suisse. Des robots assemblent des pièces, des machines CNC découpent du métal au micromètre près. C'est comme dans un film de science-fiction !",
        choices: [
          { text: "Les machines CNC t'attirent — fabriquer des pièces métalliques de précision, ça te parle", tags: { manuel: 2, technique: 2, independant: 1 }, nextSceneKey: "cnc1" },
          { text: "Les robots industriels te fascinent — tu veux savoir comment on les programme", tags: { intellectuel: 2, technique: 2, creatif: 1 }, nextSceneKey: "robot1" },
          { text: "Tu veux voir l'atelier d'électronique — les circuits et les puces, c'est ton monde", tags: { analytique: 2, technique: 2, interieur: 1 }, nextSceneKey: "elec1" },
        ],
      },
      { sceneKey: "cnc1", isFinal: false, sortOrder: 1, fr: "Le polymécanicien te montre une pièce qu'il vient d'usiner : un cylindre en acier poli comme un miroir, précis au centième de millimètre. Il programme la machine CNC avec des coordonnées et lance la fabrication.",
        choices: [
          { text: "Tu es fasciné par la précision — créer des pièces parfaites, c'est un art", tags: { manuel: 2, analytique: 1, routine: 1 }, nextSceneKey: "cncFin" },
          { text: "C'est la programmation de la machine qui t'intéresse le plus", tags: { intellectuel: 2, technique: 1, creatif: 1 }, nextSceneKey: "cncFin" },
        ],
      },
      { sceneKey: "cncFin", isFinal: true, sortOrder: 2, fr: "Le polymécanicien te dit : « Nos pièces finissent dans des montres, des avions, des satellites. La précision suisse, c'est notre fierté. » Un métier très demandé avec d'excellents salaires.",
        choices: [], resumeProfessions: ["polymecanicien", "automaticien"],
      },
      { sceneKey: "robot1", isFinal: false, sortOrder: 1, fr: "L'automaticienne te montre comment elle programme un bras robotisé. Elle écrit des lignes de code et le robot exécute des mouvements précis pour assembler des composants. « Regarde, je vais lui apprendre un nouveau geste. »",
        choices: [
          { text: "Tu veux essayer de programmer le robot — c'est comme un jeu mais en vrai !", tags: { intellectuel: 2, technique: 2, creatif: 1 }, nextSceneKey: "robotFin" },
          { text: "Tu es plus intéressé par le câblage et les armoires électriques qui alimentent tout", tags: { manuel: 2, technique: 2, analytique: 1 }, nextSceneKey: "robotFin" },
        ],
      },
      { sceneKey: "robotFin", isFinal: true, sortOrder: 2, fr: "L'automaticienne te dit : « Je donne vie aux machines. Chaque programme que j'écris rend l'usine plus intelligente. » L'automatisation est l'avenir de l'industrie — et les spécialistes sont très recherchés.",
        choices: [], resumeProfessions: ["automaticien", "informaticien", "electronicien"],
      },
      { sceneKey: "elec1", isFinal: false, sortOrder: 1, fr: "Dans l'atelier d'électronique, un électronicien soude des composants minuscules sur un circuit imprimé. Avec une loupe, il vérifie chaque connexion. Il conçoit aussi des circuits avec un logiciel de simulation.",
        choices: [
          { text: "La soudure de précision et le travail minutieux te plaisent — tu as des doigts de fée", tags: { manuel: 2, analytique: 1, independant: 1 }, nextSceneKey: "elecFin" },
          { text: "C'est la conception du circuit sur ordinateur qui t'attire — créer l'architecture électronique", tags: { intellectuel: 2, creatif: 1, analytique: 1 }, nextSceneKey: "elecFin" },
        ],
      },
      { sceneKey: "elecFin", isFinal: true, sortOrder: 2, fr: "L'électronicien te dit : « Mes circuits finissent dans des téléphones, des voitures et même des avions ! Un électronicien peut se spécialiser en avionique et travailler dans l'aéronautique. » Un monde de possibilités.",
        choices: [], resumeProfessions: ["electronicien", "automaticien"],
      },
    ],
  },
  // ===== 8. STARTUP TECH =====
  {
    id: "startup", sectorId: "informatique", icon: "🚀",
    fr: { title: "La startup tech", description: "Dans le quartier tech de Zurich, découvre les métiers du numérique dans une startup innovante." },
    scenes: [
      { sceneKey: "arrivee", isFinal: false, sortOrder: 0, fr: "Tu arrives dans une startup du Technopark de Zurich. Open space, poufs colorés, écrans partout, un baby-foot dans le couloir. L'ambiance est décontractée mais tout le monde bosse dur. Le CTO t'accueille : « Ici on crée des apps qui changent la vie des gens ! »",
        choices: [
          { text: "Tu veux voir les développeurs — le code te fascine", tags: { analytique: 2, technique: 2, independant: 1 }, nextSceneKey: "dev1" },
          { text: "Tu veux découvrir l'administration système — les serveurs et les réseaux", tags: { technique: 2, analytique: 1, routine: 1 }, nextSceneKey: "sys1" },
          { text: "Tu veux voir l'équipe multimédia — vidéo, design web, réseaux sociaux", tags: { creatif: 2, contactHumain: 1, variete: 1 }, nextSceneKey: "media1" },
        ],
      },
      { sceneKey: "dev1", isFinal: false, sortOrder: 1, fr: "La développeuse te montre le code de leur application mobile. Des lignes de JavaScript défilent sur son écran. Elle te dit : « Regarde, je vais ajouter une fonctionnalité. » En quelques minutes, un nouveau bouton apparaît dans l'app !",
        choices: [
          { text: "C'est magique ! Tu veux apprendre à coder et créer tes propres applications", tags: { intellectuel: 2, creatif: 2, technique: 1 }, nextSceneKey: "devFin" },
          { text: "Tu es plus intéressé par la résolution de bugs — trouver l'erreur c'est comme une enquête", tags: { analytique: 3, independant: 1 }, nextSceneKey: "devFin" },
        ],
      },
      { sceneKey: "devFin", isFinal: true, sortOrder: 2, fr: "La développeuse te dit : « En informatique, tu ne cesses jamais d'apprendre. Chaque jour il y a un nouveau problème à résoudre. Et la demande est énorme ! » Le CFC d'informaticien est un des plus demandés en Suisse.",
        choices: [], resumeProfessions: ["informaticien", "mediamaticien"],
      },
      { sceneKey: "sys1", isFinal: false, sortOrder: 1, fr: "Le sysadmin te montre la salle des serveurs : des dizaines de machines qui clignotent dans une pièce climatisée. Il surveille les performances sur des dashboards et réagit quand quelque chose plante.",
        choices: [
          { text: "Tu aimes l'idée de gérer l'infrastructure — tout repose sur toi", tags: { technique: 2, routine: 1, independant: 1 }, nextSceneKey: "sysFin" },
          { text: "Tu es fasciné par la cybersécurité — protéger les systèmes contre les hackers", tags: { analytique: 2, intellectuel: 1, variete: 1 }, nextSceneKey: "sysFin" },
        ],
      },
      { sceneKey: "sysFin", isFinal: true, sortOrder: 2, fr: "Le sysadmin te dit : « Je suis le gardien invisible. Quand tout marche, personne ne sait que j'existe. Quand ça plante, je suis le héros ! » Un métier stable avec de bonnes perspectives.",
        choices: [], resumeProfessions: ["operateur-en-informatique", "informaticien"],
      },
      { sceneKey: "media1", isFinal: false, sortOrder: 1, fr: "L'équipe multimédia prépare une vidéo promotionnelle. Le médiamaticien filme, monte et publie sur les réseaux sociaux. En même temps, il met à jour le site web et répond aux commentaires des utilisateurs.",
        choices: [
          { text: "Tu adores le côté créatif et varié — un peu de vidéo, un peu de design, un peu de com'", tags: { creatif: 2, variete: 2, contactHumain: 1 }, nextSceneKey: "mediaFin" },
          { text: "Tu es plus attiré par le côté web — créer des sites et des interfaces utilisateur", tags: { technique: 2, creatif: 1, analytique: 1 }, nextSceneKey: "mediaFin" },
        ],
      },
      { sceneKey: "mediaFin", isFinal: true, sortOrder: 2, fr: "Le médiamaticien te dit : « Mon métier c'est raconter des histoires avec la technologie. Je suis un peu artiste, un peu geek et un peu communicateur. » Un métier hybride et très actuel.",
        choices: [], resumeProfessions: ["mediamaticien", "graphiste", "informaticien"],
      },
    ],
  },
  // ===== 9. CENTRE SOCIAL =====
  {
    id: "social", sectorId: "social", icon: "🧡",
    fr: { title: "Aider les autres", description: "Un centre socio-éducatif qui aide les enfants et les familles. Découvre les métiers du cœur." },
    scenes: [
      { sceneKey: "arrivee", isFinal: false, sortOrder: 0, fr: "Tu arrives dans un centre socio-éducatif à Zurich. Des enfants jouent dans la cour, des éducateurs organisent des activités. L'ambiance est chaleureuse et vivante. La directrice te dit : « Ici on accompagne des enfants, des ados et des familles. »",
        choices: [
          { text: "Tu veux passer du temps avec les enfants dans le programme parascolaire", tags: { contactHumain: 3, creatif: 1, equipe: 1 }, nextSceneKey: "parascolaire1" },
          { text: "Tu veux voir le côté administratif — comment le centre fonctionne en coulisses", tags: { intellectuel: 1, routine: 1, analytique: 1, interieur: 1 }, nextSceneKey: "admin1" },
          { text: "Tu veux aider à animer un atelier pour les ados", tags: { creatif: 2, contactHumain: 2, equipe: 1 }, nextSceneKey: "animation1" },
        ],
      },
      { sceneKey: "parascolaire1", isFinal: false, sortOrder: 1, fr: "Tu aides avec les devoirs et ensuite tu organises un jeu avec les enfants. Ils sont plein d'énergie ! Un petit garçon te dit : « Tu reviens demain ? » Ça te fait chaud au cœur.",
        choices: [
          { text: "Tu adores ce contact — rendre les enfants heureux c'est une récompense immense", tags: { contactHumain: 3, variete: 1 }, nextSceneKey: "parascolaireFin" },
          { text: "C'est chouette mais épuisant — tu te demandes comment ils font tous les jours", tags: { independant: 1, routine: 1, intellectuel: 1 }, nextSceneKey: "parascolaireFin" },
        ],
      },
      { sceneKey: "parascolaireFin", isFinal: true, sortOrder: 2, fr: "L'éducatrice te dit : « Chaque enfant est unique. On l'aide à grandir et à prendre confiance. C'est un métier où on reçoit autant qu'on donne. »",
        choices: [], resumeProfessions: ["assistant-socio-educatif", "assistant-en-soins-et-sante-communautaire"],
      },
      { sceneKey: "admin1", isFinal: false, sortOrder: 1, fr: "Au bureau administratif, tu découvres toute la paperasse nécessaire : dossiers des familles, plannings des éducateurs, budgets, rapports. L'employé de commerce te montre comment il organise tout ça.",
        choices: [
          { text: "Tu comprends que même dans le social, il faut de l'organisation — et ça te plaît", tags: { analytique: 2, routine: 1, interieur: 1 }, nextSceneKey: "adminFin" },
          { text: "Tu préférerais être sur le terrain avec les gens plutôt que derrière un bureau", tags: { contactHumain: 2, exterieur: 1, variete: 1 }, nextSceneKey: "adminFin" },
        ],
      },
      { sceneKey: "adminFin", isFinal: true, sortOrder: 2, fr: "L'employé te dit : « Sans l'administration, le centre ne pourrait pas fonctionner. C'est un travail discret mais essentiel. »",
        choices: [], resumeProfessions: ["employe-de-commerce", "assistant-socio-educatif"],
      },
      { sceneKey: "animation1", isFinal: false, sortOrder: 1, fr: "Tu co-animes un atelier de musique avec des ados. Tu dois choisir les activités, motiver le groupe et gérer les conflits. Un ado difficile finit par s'investir grâce à ton encouragement !",
        choices: [
          { text: "Tu as adoré animer et voir cet ado s'épanouir — c'est puissant", tags: { contactHumain: 3, creatif: 1, equipe: 1 }, nextSceneKey: "animationFin" },
          { text: "Tu as aimé la partie créative — choisir les activités et préparer le programme", tags: { creatif: 2, intellectuel: 1, independant: 1 }, nextSceneKey: "animationFin" },
        ],
      },
      { sceneKey: "animationFin", isFinal: true, sortOrder: 2, fr: "L'éducateur te dit : « Animer un groupe c'est un super pouvoir. Tu apprends le leadership, l'empathie et la créativité. Et tu changes des vies. »",
        choices: [], resumeProfessions: ["assistant-socio-educatif", "gestionnaire-en-hotellerie-intendance"],
      },
    ],
  },
  // ===== 10. GARAGE =====
  {
    id: "garage", sectorId: "automobile", icon: "🚗",
    fr: { title: "Le garage automobile", description: "Un garage moderne avec des voitures électriques et classiques. Pour les fans de mécanique !" },
    scenes: [
      { sceneKey: "arrivee", isFinal: false, sortOrder: 0, fr: "Tu arrives dans un grand garage à Zurich. Des voitures sont sur les ponts élévateurs, des mécaniciens s'affairent avec des outils. Il y a même une Tesla en réparation ! Le chef d'atelier te dit : « Bienvenue dans le monde de la mécanique moderne. »",
        choices: [
          { text: "Tu veux mettre les mains dans le moteur — diagnostic et réparation", tags: { technique: 2, manuel: 2, analytique: 1 }, nextSceneKey: "diagnostic1" },
          { text: "La carrosserie et la peinture t'attirent — redonner vie aux voitures accidentées", tags: { manuel: 2, creatif: 2 }, nextSceneKey: "carrosserie1" },
          { text: "L'accueil client et la planification — tu veux voir le côté bureau du garage", tags: { contactHumain: 2, routine: 1, interieur: 1 }, nextSceneKey: "accueilGarage1" },
        ],
      },
      { sceneKey: "diagnostic1", isFinal: false, sortOrder: 1, fr: "Le mécanicien branche un ordinateur de diagnostic sur une voiture qui fait un bruit bizarre. L'écran affiche des codes d'erreur. « C'est comme un médecin pour les voitures, » dit-il. « Il faut trouver la maladie ! »",
        choices: [
          { text: "Tu adores cette logique de diagnostic — trouver la panne c'est un défi", tags: { analytique: 2, technique: 2 }, nextSceneKey: "diagnosticFin" },
          { text: "Tu préfères la partie manuelle — démonter, réparer, remonter", tags: { manuel: 3, independant: 1 }, nextSceneKey: "diagnosticFin" },
        ],
      },
      { sceneKey: "diagnosticFin", isFinal: true, sortOrder: 2, fr: "Le mécanicien te dit : « Les voitures deviennent de plus en plus électroniques. Un bon mécanicien aujourd'hui c'est moitié ingénieur, moitié artisan. » Un métier en pleine évolution avec les véhicules électriques.",
        choices: [], resumeProfessions: ["mecanicien-en-maintenance-d-automobiles", "installateur-electricien"],
      },
      { sceneKey: "carrosserie1", isFinal: false, sortOrder: 1, fr: "Le carrossier répare une aile cabossée. Avec patience, il redresse le métal puis applique de la peinture. Le résultat est incroyable — on ne voit plus rien ! C'est un vrai artiste.",
        choices: [
          { text: "Le côté transformation te plaît — redonner une seconde vie à la voiture", tags: { creatif: 2, manuel: 2, independant: 1 }, nextSceneKey: "carrosserieFin" },
          { text: "Tu es impressionné par le mélange de couleurs — c'est presque de l'art", tags: { creatif: 3, interieur: 1 }, nextSceneKey: "carrosserieFin" },
        ],
      },
      { sceneKey: "carrosserieFin", isFinal: true, sortOrder: 2, fr: "Le carrossier te dit : « Chaque voiture cabossée c'est un nouveau défi. Et quand le client voit le résultat, il n'en revient pas ! » Un métier qui demande un œil artistique et de la patience.",
        choices: [], resumeProfessions: ["peintre", "mecanicien-en-maintenance-d-automobiles"],
      },
      { sceneKey: "accueilGarage1", isFinal: false, sortOrder: 1, fr: "À l'accueil, la réceptionniste gère les rendez-vous, explique les devis aux clients et coordonne le planning des mécaniciens. C'est l'interface entre le client et l'atelier.",
        choices: [
          { text: "Tu aimes le contact avec les clients et l'organisation du planning", tags: { contactHumain: 2, routine: 1, equipe: 1 }, nextSceneKey: "accueilGarageFin" },
          { text: "Tu trouves que comprendre la technique pour expliquer aux clients c'est un bon mix", tags: { intellectuel: 1, contactHumain: 1, technique: 1, variete: 1 }, nextSceneKey: "accueilGarageFin" },
        ],
      },
      { sceneKey: "accueilGarageFin", isFinal: true, sortOrder: 2, fr: "La réceptionniste te dit : « Ici je suis la traductrice : je transforme le jargon technique en mots simples pour les clients. Il faut aimer les gens ET les voitures ! »",
        choices: [], resumeProfessions: ["employe-de-commerce", "gestionnaire-du-commerce-de-detail"],
      },
    ],
  },
  // ===== 11. AÉROPORT =====
  {
    id: "aeroport", sectorId: "aeronautique", icon: "✈️",
    fr: { title: "L'aéroport de Zurich", description: "Découvre les coulisses de l'un des plus grands aéroports d'Europe et les métiers passionnants de l'aéronautique !" },
    scenes: [
      { sceneKey: "arrivee", isFinal: false, sortOrder: 0, fr: "Tu arrives à l'aéroport de Zurich-Kloten. Des avions décollent toutes les deux minutes, les réacteurs rugissent ! Ton guide travaille chez SR Technics, une des plus grandes entreprises de maintenance aéronautique d'Europe. « Prêt à découvrir les coulisses ? »",
        choices: [
          { text: "Le hangar de maintenance — tu veux voir l'intérieur d'un avion de près !", tags: { technique: 2, manuel: 2, interieur: 1 }, nextSceneKey: "hangar1" },
          { text: "La tour de contrôle et les opérations — tu veux comprendre comment on gère le trafic aérien", tags: { analytique: 2, intellectuel: 2, equipe: 1 }, nextSceneKey: "tour1" },
          { text: "La piste et les opérations au sol — tu veux être au cœur de l'action, dehors !", tags: { exterieur: 2, equipe: 2, variete: 1 }, nextSceneKey: "piste1" },
        ],
      },
      { sceneKey: "hangar1", isFinal: false, sortOrder: 1, fr: "Dans le hangar géant de SR Technics, un Airbus A320 est en pleine révision. Des mécaniciens inspectent chaque centimètre du fuselage. Un technicien te montre le moteur ouvert — c'est immense et incroyablement complexe !",
        choices: [
          { text: "Tu es ébloui par le moteur — comprendre comment ça fonctionne, c'est ton rêve", tags: { technique: 3, analytique: 1, intellectuel: 1 }, nextSceneKey: "hangar2" },
          { text: "Tu veux toucher et participer — visser, vérifier, inspecter", tags: { manuel: 3, technique: 1 }, nextSceneKey: "hangar2" },
        ],
      },
      { sceneKey: "hangar2", isFinal: false, sortOrder: 2, fr: "Le technicien te montre comment il inspecte le train d'atterrissage. « La moindre fissure peut être dangereuse. On a une responsabilité énorme — des centaines de vies dépendent de notre travail. » Il utilise des instruments de mesure ultra-précis.",
        choices: [
          { text: "Cette responsabilité te motive — être garant de la sécurité d'un avion, c'est puissant", tags: { analytique: 2, technique: 1, routine: 1 }, nextSceneKey: "hangarFin" },
          { text: "C'est l'électronique embarquée qui t'intrigue le plus — les instruments de bord et les radars", tags: { intellectuel: 2, technique: 2, creatif: 1 }, nextSceneKey: "hangarFin" },
        ],
      },
      { sceneKey: "hangarFin", isFinal: true, sortOrder: 3, fr: "Le technicien te dit : « On entre dans l'aéronautique souvent par un CFC de polymécanicien ou d'électronicien, puis on se spécialise. C'est un des meilleurs métiers techniques en Suisse — et on travaille sur des avions ! » Tu repars avec des étoiles dans les yeux.",
        choices: [], resumeProfessions: ["polymecanicien", "electronicien", "agent-d-exploitation"],
      },
      { sceneKey: "tour1", isFinal: false, sortOrder: 1, fr: "Tu ne montes pas dans la vraie tour de contrôle (accès restreint !), mais au centre d'opérations de l'aéroport. Sur des écrans géants, tu vois tous les vols en temps réel. L'agent d'exploitation coordonne les avions au sol, les portes d'embarquement et les équipes.",
        choices: [
          { text: "La coordination en temps réel te fascine — c'est comme un jeu de stratégie grandeur nature", tags: { analytique: 2, equipe: 2, variete: 1 }, nextSceneKey: "tour2" },
          { text: "Tu es impressionné par la technologie — les radars, les systèmes de communication", tags: { technique: 2, intellectuel: 2 }, nextSceneKey: "tour2" },
        ],
      },
      { sceneKey: "tour2", isFinal: false, sortOrder: 2, fr: "L'agent d'exploitation te dit : « Quand il y a du brouillard ou une tempête, tout se complique. Il faut réagir vite, communiquer avec 20 personnes en même temps et garder son calme. » Il te montre comment il re-planifie les vols en cas de retard.",
        choices: [
          { text: "Tu adores ce stress positif — prendre des décisions rapides dans un environnement critique", tags: { variete: 2, equipe: 1, analytique: 1 }, nextSceneKey: "tourFin" },
          { text: "Tu te verrais bien évoluer vers contrôleur aérien — gérer les avions dans le ciel !", tags: { intellectuel: 2, analytique: 1, independant: 1 }, nextSceneKey: "tourFin" },
        ],
      },
      { sceneKey: "tourFin", isFinal: true, sortOrder: 3, fr: "L'agent te dit : « Pour devenir contrôleur aérien, il faut passer par skyguide après un CFC ou une maturité. C'est très sélectif mais c'est un des métiers les mieux payés de Suisse ! » Une belle passerelle.",
        choices: [], resumeProfessions: ["agent-d-exploitation", "logisticien", "employe-de-commerce"],
      },
      { sceneKey: "piste1", isFinal: false, sortOrder: 1, fr: "Sur la piste (avec gilet jaune et casque anti-bruit !), tu vois les avions de très près. L'équipe au sol guide un Boeing 777 vers sa place de parking avec des balisages lumineux. Le ravitaillement en carburant commence aussitôt. C'est impressionnant !",
        choices: [
          { text: "Tu adores être dehors près des avions — sentir la puissance des réacteurs, c'est grisant", tags: { exterieur: 3, manuel: 1, variete: 1 }, nextSceneKey: "piste2" },
          { text: "Le travail d'équipe te frappe — tout le monde doit être synchronisé à la seconde", tags: { equipe: 3, routine: 1 }, nextSceneKey: "piste2" },
        ],
      },
      { sceneKey: "piste2", isFinal: false, sortOrder: 2, fr: "Le chef d'équipe te dit : « On a 45 minutes pour décharger, nettoyer, ravitailler et recharger un avion. Tout est chronométré. C'est un travail physique mais tu es toujours au premier rang du spectacle ! » Un avion décolle juste à côté — le sol tremble.",
        choices: [
          { text: "C'est exactement ce que tu veux — de l'action, des avions et du travail d'équipe", tags: { equipe: 2, exterieur: 1, variete: 1 }, nextSceneKey: "pisteFin" },
          { text: "Tu aimerais évoluer vers un rôle plus technique — peut-être mécanicien d'avions un jour", tags: { technique: 2, analytique: 1, intellectuel: 1 }, nextSceneKey: "pisteFin" },
        ],
      },
      { sceneKey: "pisteFin", isFinal: true, sortOrder: 3, fr: "Le chef te dit : « L'aéroport c'est une petite ville qui ne dort jamais. Si tu aimes les avions, il y a des dizaines de métiers possibles — de la piste au hangar en passant par les bureaux. » Tu repars avec le bruit des réacteurs dans les oreilles et un sourire jusqu'aux oreilles.",
        choices: [], resumeProfessions: ["agent-d-exploitation", "polymecanicien", "logisticien"],
      },
    ],
  },
];

// ─── Seed function ───────────────────────────────────────

async function main() {
  // Load scraped profession data
  const jsonPath = join(__dirname, "..", "scripts", "output", "professions-cfc.json");
  const scrapedData: ScrapedProfession[] = JSON.parse(readFileSync(jsonPath, "utf-8"));

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

  console.log("Seeding professions from scraped data...");
  for (const scraped of scrapedData) {
    const id = slugify(scraped.name);
    const duration = extractDuration(scraped.formation);

    const group = swissdocMainGroup(scraped.swissdoc);

    await prisma.profession.upsert({
      where: { id },
      update: {
        swissdoc: scraped.swissdoc,
        swissdocGroup: group,
        urlOrientation: scraped.url,
      },
      create: {
        id,
        type: "CFC",
        duration,
        swissdoc: scraped.swissdoc,
        swissdocGroup: group,
        urlOrientation: scraped.url,
      },
    });

    const orientationFields = {
      orientationUrl: scraped.url,
      orientationId: scraped.orientationId,
      domainesProfessionnels: scraped.domainesProfessionnels,
      descriptionFull: scraped.description,
      formation: scraped.formation,
      perspectivesProfessionnelles: scraped.perspectivesProfessionnelles,
      autresInformations: scraped.autresInformations,
      adressesUtiles: scraped.adressesUtiles,
    };

    await prisma.professionTranslation.upsert({
      where: { professionId_locale: { professionId: id, locale: "fr" } },
      update: orientationFields,
      create: {
        professionId: id,
        locale: "fr",
        name: scraped.name,
        ...orientationFields,
      },
    });
  }
  console.log(`  ${scrapedData.length} professions seeded.`);

  console.log("Seeding scenarios...");
  for (const sc of scenarios) {
    await prisma.scenario.upsert({
      where: { id: sc.id },
      update: { sectorId: sc.sectorId, icon: sc.icon },
      create: { id: sc.id, sectorId: sc.sectorId, icon: sc.icon },
    });
    await prisma.scenarioTranslation.upsert({
      where: { scenarioId_locale: { scenarioId: sc.id, locale: "fr" } },
      update: { title: sc.fr.title, description: sc.fr.description },
      create: { scenarioId: sc.id, locale: "fr", title: sc.fr.title, description: sc.fr.description },
    });

    for (const scene of sc.scenes) {
      const sceneRecord = await prisma.scene.upsert({
        where: { scenarioId_sceneKey: { scenarioId: sc.id, sceneKey: scene.sceneKey } },
        update: { isFinal: scene.isFinal, sortOrder: scene.sortOrder },
        create: { scenarioId: sc.id, sceneKey: scene.sceneKey, isFinal: scene.isFinal, sortOrder: scene.sortOrder },
      });

      await prisma.sceneTranslation.upsert({
        where: { sceneId_locale: { sceneId: sceneRecord.id, locale: "fr" } },
        update: { text: scene.fr },
        create: { sceneId: sceneRecord.id, locale: "fr", text: scene.fr },
      });

      // Delete existing choices for this scene (simpler than upserting each)
      const existingChoices = await prisma.choice.findMany({ where: { sceneId: sceneRecord.id }, select: { id: true } });
      if (existingChoices.length > 0) {
        const choiceIds = existingChoices.map((c) => c.id);
        await prisma.choiceTranslation.deleteMany({ where: { choiceId: { in: choiceIds } } });
        await prisma.choice.deleteMany({ where: { sceneId: sceneRecord.id } });
      }

      for (let ci = 0; ci < scene.choices.length; ci++) {
        const c = scene.choices[ci];
        const tags: Record<string, number> = {};
        for (const [k, v] of Object.entries(c.tags)) {
          if (v !== 0) tags[k] = v;
        }
        const choiceRecord = await prisma.choice.create({
          data: {
            sceneId: sceneRecord.id,
            nextSceneKey: c.nextSceneKey ?? null,
            sortOrder: ci,
            ...tags,
          },
        });
        await prisma.choiceTranslation.create({
          data: { choiceId: choiceRecord.id, locale: "fr", text: c.text },
        });
      }

      // Seed end professions for final scenes
      if (scene.isFinal && scene.resumeProfessions) {
        await prisma.scenarioEndProfession.deleteMany({ where: { sceneId: sceneRecord.id } });
        for (const profId of scene.resumeProfessions) {
          await prisma.scenarioEndProfession.create({
            data: { sceneId: sceneRecord.id, professionId: profId },
          });
        }
      }
    }
  }
  console.log(`  ${scenarios.length} scenarios seeded.`);

  // Generate embeddings (skip with GENERATE_EMBEDDINGS=false)
  if (process.env.GENERATE_EMBEDDINGS !== "false") {
    try {
      const { composeEmbeddingText } = await import("../src/lib/embeddings/compose-text.js");
      const { getEmbeddingProvider } = await import("../src/lib/embeddings/index.js");
      const provider = getEmbeddingProvider();
      console.log(`Generating embeddings (${provider.name})...`);

      const translations = await prisma.professionTranslation.findMany({
        where: { locale: "fr" },
        select: {
          id: true,
          name: true,
          description: true,
          activities: true,
          qualities: true,
          domainesProfessionnels: true,
          descriptionFull: true,
          autresInformations: true,
        },
      });

      const texts = translations.map((t) => composeEmbeddingText(t));
      const batchSize = 50;
      let embedded = 0;

      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const ids = translations.slice(i, i + batchSize).map((t) => t.id);
        const embeddings = await provider.embedBatch(batch);

        for (let j = 0; j < ids.length; j++) {
          const vectorStr = `[${embeddings[j].join(",")}]`;
          await prisma.$executeRaw`
            UPDATE "ProfessionTranslation"
            SET embedding = ${vectorStr}::vector
            WHERE id = ${ids[j]}
          `;
          embedded++;
        }
      }
      console.log(`  ${embedded} embeddings generated.`);
    } catch (e) {
      console.warn("  Skipping embeddings (provider unavailable):", (e as Error).message);
    }
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
