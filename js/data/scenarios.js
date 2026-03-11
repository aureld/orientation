var AVENTURE = AVENTURE || {};

AVENTURE.scenarios = [
  // ===== 1. HOPITAL =====
  {
    id: "hopital",
    titre: "Une journee a l'hopital",
    description: "Decouvre les coulisses de l'hopital cantonal de Zurich et ses differents metiers de la sante.",
    secteur: "sante",
    icon: "\ud83c\udfe5",
    scenes: [
      {
        id: "arrivee",
        texte: "Il est 7h du matin. Tu arrives a l'Universitatsspital de Zurich, l'un des plus grands hopitaux de Suisse. L'infirmiere-chef t'accueille avec un sourire. « Bienvenue pour ton stage d'observation ! Tu as trois services a decouvrir ce matin. Lequel t'attire le plus ? »",
        choix: [
          { texte: "Les urgences — ca a l'air intense et plein d'action !", tags: { variete: 2, contactHumain: 2, equipe: 1 }, suite: "urgences1" },
          { texte: "Le laboratoire d'analyses — tu veux voir les microscopes et les machines", tags: { analytique: 2, technique: 2, independant: 1 }, suite: "labo1" },
          { texte: "La physiotherapie — aider les gens a retrouver leur mobilite t'interesse", tags: { manuel: 2, contactHumain: 2, creatif: 1 }, suite: "physio1" }
        ]
      },
      {
        id: "urgences1",
        texte: "Aux urgences, l'ambiance est electrique. Un patient arrive avec une blessure au bras apres un accident de velo. Le medecin urgentiste te laisse observer de pres. Pendant que l'equipe s'active, tu...",
        choix: [
          { texte: "Observes attentivement la technique du medecin et tu prends des notes mentales", tags: { analytique: 2, intellectuel: 2 }, suite: "urgences2" },
          { texte: "Te tournes vers le patient pour le rassurer et lui parler calmement", tags: { contactHumain: 3, equipe: 1 }, suite: "urgences2" }
        ]
      },
      {
        id: "urgences2",
        texte: "Le medecin te dit : « Aux urgences, chaque minute compte. On doit etre rapide, precis et garder son calme. » Il te montre comment ils organisent les patients par priorite (le triage). C'est fascinant — ou stressant ?",
        choix: [
          { texte: "Fascinant ! Tu adores l'idee de sauver des vies sous pression", tags: { variete: 2, equipe: 1, contactHumain: 1 }, suite: "urgencesFin" },
          { texte: "Interessant mais tu prefererais un rythme plus calme et regulier", tags: { routine: 2, independant: 1 }, suite: "urgencesFin" }
        ]
      },
      {
        id: "urgencesFin",
        texte: "Ta matinee aux urgences est terminee. Tu as decouvert un monde intense ou le travail d'equipe sauve des vies chaque jour. Les soignants ici sont des heros du quotidien !",
        fin: true,
        choix: [],
        resumeProfessions: ["assc", "assistantPharmacie"]
      },
      {
        id: "labo1",
        texte: "Le laboratoire est immense et silencieux. Des rangees de machines analysent des echantillons de sang, d'urine et de tissus. La laborantine te montre un microscope et t'invite a regarder. Tu vois des cellules vivantes !",
        choix: [
          { texte: "Tu es fascine par les cellules et tu poses plein de questions sur la biologie", tags: { intellectuel: 2, analytique: 2, independant: 1 }, suite: "labo2" },
          { texte: "Tu es surtout impressionne par les machines et tu veux savoir comment elles fonctionnent", tags: { technique: 2, analytique: 1, manuel: 1 }, suite: "labo2" }
        ]
      },
      {
        id: "labo2",
        texte: "La laborantine te confie : « Ici, on est les detectives de l'hopital. Nos analyses permettent aux medecins de poser le bon diagnostic. » Elle te laisse pipeter un echantillon colore. C'est un geste de precision !",
        choix: [
          { texte: "Tu adores la precision et la concentration que ca demande", tags: { manuel: 2, analytique: 1, routine: 1 }, suite: "laboFin" },
          { texte: "C'est interessant mais tu aimerais plus de contact avec les gens", tags: { contactHumain: 2, equipe: 1 }, suite: "laboFin" }
        ]
      },
      {
        id: "laboFin",
        texte: "Ta matinee au labo est terminee. Tu as decouvert un monde de precision scientifique ou chaque analyse compte. Les laborantins sont essentiels meme si on ne les voit pas !",
        fin: true,
        choix: [],
        resumeProfessions: ["laborantin", "assistantPharmacie"]
      },
      {
        id: "physio1",
        texte: "En physiotherapie, tu rencontres un patient qui se remet d'une operation au genou. Le physiotherapeute lui fait faire des exercices avec patience et bonne humeur. Il te propose de l'aider.",
        choix: [
          { texte: "Tu aides le patient avec les exercices — c'est physique mais gratifiant", tags: { manuel: 2, contactHumain: 2, equipe: 1 }, suite: "physio2" },
          { texte: "Tu observes la technique et tu notes les exercices prescrits", tags: { analytique: 1, intellectuel: 2, independant: 1 }, suite: "physio2" }
        ]
      },
      {
        id: "physio2",
        texte: "Le physiotherapeute te dit : « Mon metier c'est aider les gens a retrouver leur liberte de mouvement. C'est un travail ou on voit les progres au quotidien. » Le patient le remercie chaleureusement.",
        choix: [
          { texte: "Ca te touche — aider concretement les gens, c'est ce qui te motive", tags: { contactHumain: 3, variete: 1 }, suite: "physioFin" },
          { texte: "Tu aimes l'aspect sport et mouvement de ce metier", tags: { manuel: 2, exterieur: 1, variete: 1 }, suite: "physioFin" }
        ]
      },
      {
        id: "physioFin",
        texte: "Ta matinee en physiotherapie est terminee. Tu as decouvert un metier qui combine le contact humain, le mouvement et la satisfaction de voir les gens progresser.",
        fin: true,
        choix: [],
        resumeProfessions: ["assc", "assistantSocioEducatif"]
      }
    ]
  },

  // ===== 2. CHANTIER =====
  {
    id: "chantier",
    titre: "Le grand chantier",
    description: "Un immense chantier de construction a Zurich-Oerlikon. Decouvre les metiers qui construisent la ville de demain.",
    secteur: "construction",
    icon: "\ud83c\udfd7\ufe0f",
    scenes: [
      {
        id: "arrivee",
        texte: "Tu arrives sur un chantier impressionnant a Oerlikon. Des grues geantes, des ouvriers en casques, le bruit des machines... Le chef de chantier te donne un casque et des chaussures de securite. « Aujourd'hui tu vas decouvrir trois aspects du metier. Par quoi on commence ? »",
        choix: [
          { texte: "Avec les macons sur les murs — tu veux toucher le beton !", tags: { manuel: 2, exterieur: 2, equipe: 1 }, suite: "macon1" },
          { texte: "Au bureau technique avec les plans — tu veux comprendre comment on concoit un batiment", tags: { intellectuel: 2, creatif: 2, interieur: 1 }, suite: "bureau1" },
          { texte: "Avec les charpentiers sur la toiture — tu n'as pas peur des hauteurs", tags: { manuel: 2, exterieur: 2, variete: 1 }, suite: "charpente1" }
        ]
      },
      {
        id: "macon1",
        texte: "Le macon te montre comment monter un mur en briques. Il aligne chaque brique avec precision, applique le mortier et verifie le niveau. C'est plus technique qu'il n'y parait !",
        choix: [
          { texte: "Tu essayes de poser une brique — c'est lourd mais satisfaisant de construire quelque chose", tags: { manuel: 3, equipe: 1 }, suite: "maconFin" },
          { texte: "Tu es plus interesse par les machines du chantier : la betonniere, la grue...", tags: { technique: 2, manuel: 1, variete: 1 }, suite: "maconFin" }
        ]
      },
      {
        id: "maconFin",
        texte: "Le macon te dit : « A la fin de la journee, tu vois ce que tu as construit. C'est la plus belle satisfaction. » Tu comprends pourquoi ce metier est un des mieux payes dans la construction.",
        fin: true,
        choix: [],
        resumeProfessions: ["macon", "installateurSanitaire", "peintre"]
      },
      {
        id: "bureau1",
        texte: "Au bureau technique, une dessinatrice en architecture te montre les plans du batiment sur son grand ecran. Elle utilise un logiciel de CAO pour dessiner en 3D. C'est comme un jeu video, mais pour construire de vrais immeubles !",
        choix: [
          { texte: "Tu adores l'idee de dessiner des batiments sur ordinateur — c'est creatif et technique a la fois", tags: { creatif: 2, technique: 2, interieur: 1 }, suite: "bureauFin" },
          { texte: "Tu preferes les calculs de structure — combien de poids chaque mur peut supporter ?", tags: { analytique: 2, intellectuel: 2, routine: 1 }, suite: "bureauFin" }
        ]
      },
      {
        id: "bureauFin",
        texte: "La dessinatrice te dit : « Chaque batiment commence par un dessin. Sans nous, les macons ne sauraient pas quoi construire ! » Tu decouvres un metier creatif dans un secteur inattendu.",
        fin: true,
        choix: [],
        resumeProfessions: ["dessinateur", "installateurSanitaire"]
      },
      {
        id: "charpente1",
        texte: "Tu grimpes sur l'echafaudage avec le charpentier. Tout en haut, la vue sur Zurich est incroyable ! Il te montre comment assembler les poutres qui formeront la charpente du toit. L'odeur du bois frais est agreable.",
        choix: [
          { texte: "Tu adores travailler en hauteur avec cette vue — le vertige n'est pas pour toi", tags: { exterieur: 2, manuel: 2, variete: 1 }, suite: "charpenteFin" },
          { texte: "Tu es fascine par le travail du bois — les assemblages sont comme un puzzle geant", tags: { manuel: 2, creatif: 2, independant: 1 }, suite: "charpenteFin" }
        ]
      },
      {
        id: "charpenteFin",
        texte: "Le charpentier te dit : « Le bois est un materiau vivant. Chaque charpente est unique, comme une oeuvre d'art. » Un metier qui mele force physique, precision et creativite.",
        fin: true,
        choix: [],
        resumeProfessions: ["charpentier", "ebeniste", "macon"]
      }
    ]
  },

  // ===== 3. BANQUE =====
  {
    id: "banque",
    titre: "Au coeur de la finance",
    description: "Paradeplatz, Zurich : passe une journee dans les bureaux d'une grande entreprise et decouvre le monde du commerce.",
    secteur: "commerce",
    icon: "\ud83c\udfe6",
    scenes: [
      {
        id: "arrivee",
        texte: "Tu arrives a la Paradeplatz, le coeur financier de Zurich. Les immeubles de bureaux sont impressionnants. Ton guide pour la journee t'accueille : « Ici on gere des milliers de clients et des tonnes de documents. Tu veux voir quel aspect du travail ? »",
        choix: [
          { texte: "L'accueil et la relation client — tu aimes parler aux gens", tags: { contactHumain: 2, equipe: 1, interieur: 1 }, suite: "accueil1" },
          { texte: "La logistique et le courrier — tu veux bouger et organiser", tags: { manuel: 2, variete: 1, independant: 1 }, suite: "logistique1" },
          { texte: "Le back-office et les chiffres — les tableaux de donnees ca te plait", tags: { analytique: 2, intellectuel: 1, routine: 1 }, suite: "backoffice1" }
        ]
      },
      {
        id: "accueil1",
        texte: "A l'accueil, tu observes comment l'employee de commerce recoit les clients. Elle parle allemand, anglais et francais dans la meme heure ! Un client a un probleme avec son compte, elle le resout avec calme et professionnalisme.",
        choix: [
          { texte: "Tu admires sa capacite a gerer les gens et a jongler entre les langues", tags: { contactHumain: 2, variete: 1, intellectuel: 1 }, suite: "accueilFin" },
          { texte: "Tu te dis que rester assis a un bureau toute la journee serait difficile pour toi", tags: { exterieur: 1, manuel: 1, variete: 1 }, suite: "accueilFin" }
        ]
      },
      {
        id: "accueilFin",
        texte: "L'employee te dit : « Dans le commerce, on apprend a communiquer, a organiser et a resoudre des problemes. C'est un CFC qui ouvre beaucoup de portes. » Un metier polyvalent et recherche.",
        fin: true,
        choix: [],
        resumeProfessions: ["employeCommerce", "gestionnaireCommerce"]
      },
      {
        id: "logistique1",
        texte: "Au departement logistique, c'est un autre monde : des chariots, des colis, un entrepot organise au millimetre. Le logisticien scanne des paquets a toute vitesse et les range dans le bon rayon.",
        choix: [
          { texte: "Tu aimes l'idee de bouger et d'organiser — c'est concret et physique", tags: { manuel: 2, routine: 1, independant: 1 }, suite: "logistiqueFin" },
          { texte: "Tu es impressionne par le systeme informatique qui gere tout", tags: { technique: 2, analytique: 1 }, suite: "logistiqueFin" }
        ]
      },
      {
        id: "logistiqueFin",
        texte: "Le logisticien te dit : « Sans nous, rien ne bouge. On est le coeur invisible de chaque entreprise. » Un metier actif avec de bonnes perspectives et un salaire correct.",
        fin: true,
        choix: [],
        resumeProfessions: ["logisticien", "employeCommerce"]
      },
      {
        id: "backoffice1",
        texte: "Au back-office, tout est calme et ordonne. Des employes travaillent sur des tableurs, verifient des factures et preparent des rapports. Un employe te montre comment il analyse les donnees de vente du mois.",
        choix: [
          { texte: "Tu trouves les chiffres fascinants — comprendre les tendances c'est comme resoudre une enquete", tags: { analytique: 2, intellectuel: 2, independant: 1 }, suite: "backofficeFin" },
          { texte: "C'est trop calme pour toi — tu preferes l'action et le contact", tags: { contactHumain: 1, variete: 1, exterieur: 1 }, suite: "backofficeFin" }
        ]
      },
      {
        id: "backofficeFin",
        texte: "L'employe te dit : « Les donnees racontent une histoire. Savoir les lire c'est un super pouvoir dans n'importe quelle entreprise. » Un monde de rigueur et de precision.",
        fin: true,
        choix: [],
        resumeProfessions: ["employeCommerce", "logisticien"]
      }
    ]
  },

  // ===== 4. RESTAURANT =====
  {
    id: "restaurant",
    titre: "Le restaurant etoile",
    description: "Un restaurant gastronomique pres du lac de Zurich te fait decouvrir l'univers passionnant de l'hotellerie-restauration.",
    secteur: "gastronomie",
    icon: "\ud83c\udf7d\ufe0f",
    scenes: [
      {
        id: "arrivee",
        texte: "Tu arrives dans un beau restaurant au bord du lac. L'equipe prepare le service du midi. Ca sent incroyablement bon ! Le chef te dit : « On a besoin de bras partout aujourd'hui. Ou tu veux te rendre utile ? »",
        choix: [
          { texte: "En cuisine avec toi, Chef ! Tu veux apprendre a cuisiner", tags: { manuel: 2, creatif: 2, interieur: 1 }, suite: "cuisine1" },
          { texte: "En salle — tu veux accueillir les clients et gerer le service", tags: { contactHumain: 2, equipe: 2, variete: 1 }, suite: "salle1" },
          { texte: "A la reception de l'hotel — tu veux decouvrir la gestion", tags: { intellectuel: 1, contactHumain: 1, routine: 1, interieur: 1 }, suite: "reception1" }
        ]
      },
      {
        id: "cuisine1",
        texte: "En cuisine, c'est le feu d'artifice : les casseroles sifflent, le chef donne des ordres, les commis s'activent. On te confie l'epluchage des legumes et la preparation d'une sauce. La pression monte avant le service !",
        choix: [
          { texte: "Tu adores ce rythme intense — la pression te donne de l'energie", tags: { variete: 2, equipe: 1, manuel: 1 }, suite: "cuisineFin" },
          { texte: "Tu es fascine par le cote creatif — inventer un plat c'est comme creer une oeuvre d'art", tags: { creatif: 3, independant: 1 }, suite: "cuisineFin" }
        ]
      },
      {
        id: "cuisineFin",
        texte: "Le chef te dit : « La cuisine c'est de l'amour, de la technique et du courage. Chaque assiette est une fierté. » Les horaires sont longs mais la passion est immense.",
        fin: true,
        choix: [],
        resumeProfessions: ["cuisinier", "boulangerPatissier"]
      },
      {
        id: "salle1",
        texte: "En salle, le maitre d'hotel te montre comment dresser une table parfaite : chaque verre, chaque couvert a sa place. Puis les premiers clients arrivent. Tu dois les accueillir avec le sourire et les guider a leur table.",
        choix: [
          { texte: "Tu te sens a l'aise — parler aux gens et les rendre heureux c'est ton truc", tags: { contactHumain: 3, equipe: 1 }, suite: "salleFin" },
          { texte: "Tu preferes l'organisation — gerer les tables et les timings c'est comme un jeu de strategie", tags: { analytique: 2, routine: 1, independant: 1 }, suite: "salleFin" }
        ]
      },
      {
        id: "salleFin",
        texte: "Le maitre d'hotel te dit : « L'hotellerie c'est l'art de faire vivre des moments inoubliables aux gens. Et on voyage beaucoup avec ce metier ! » Un monde d'elegance et de contact humain.",
        fin: true,
        choix: [],
        resumeProfessions: ["specialisteHotellerie", "gestionnaireCommerce"]
      },
      {
        id: "reception1",
        texte: "A la reception de l'hotel attache au restaurant, tu decouvres la gestion des reservations, le check-in des clients et l'organisation des evenements. La receptionniste parle quatre langues !",
        choix: [
          { texte: "Tu es impressionne par le cote international — parler des langues pour aider les gens du monde entier", tags: { contactHumain: 2, intellectuel: 1, variete: 1 }, suite: "receptionFin" },
          { texte: "Tu aimes le cote organisation — planifier les chambres et les evenements c'est satisfaisant", tags: { analytique: 2, routine: 1, independant: 1 }, suite: "receptionFin" }
        ]
      },
      {
        id: "receptionFin",
        texte: "La receptionniste te dit : « Chaque journee est differente. On resout des problemes, on fait plaisir aux gens et on travaille dans un cadre magnifique. »",
        fin: true,
        choix: [],
        resumeProfessions: ["specialisteHotellerie", "employeCommerce"]
      }
    ]
  },

  // ===== 5. ATELIER CREATIF =====
  {
    id: "atelier",
    titre: "L'atelier creatif",
    description: "Zurich-West, le quartier branche : explore des ateliers ou l'artisanat rencontre la creativite.",
    secteur: "artisanat",
    icon: "\ud83c\udfa8",
    scenes: [
      {
        id: "arrivee",
        texte: "Tu es dans un grand batiment industrial reconverti en ateliers creatifs a Zurich-West. L'endroit est cool : murs en briques, grandes fenetres, musique en fond. Trois portes s'ouvrent devant toi.",
        choix: [
          { texte: "L'atelier de menuiserie — ca sent le bois et tu entends les machines", tags: { manuel: 2, independant: 1, creatif: 1 }, suite: "bois1" },
          { texte: "Le studio de design graphique — des ecrans partout et des affiches colorees", tags: { creatif: 2, technique: 1, interieur: 1 }, suite: "design1" },
          { texte: "Le salon de coiffure tendance — musique et ambiance decontractee", tags: { contactHumain: 2, creatif: 1, variete: 1 }, suite: "coiffure1" }
        ]
      },
      {
        id: "bois1",
        texte: "L'ebeniste te montre son dernier projet : une table en noyer faite sur mesure pour un client. Chaque piece est taillée, poncee et assemblee a la main. Il te laisse essayer le rabot.",
        choix: [
          { texte: "C'est genial ! Creer quelque chose de beau avec tes mains, tu adores", tags: { manuel: 3, creatif: 1, independant: 1 }, suite: "boisFin" },
          { texte: "Tu es plus interesse par le design — dessiner le meuble avant de le construire", tags: { creatif: 2, intellectuel: 1, analytique: 1 }, suite: "boisFin" }
        ]
      },
      {
        id: "boisFin",
        texte: "L'ebeniste te dit : « Je cree des objets qui durent toute une vie. Chaque meuble raconte une histoire. » Un metier d'artiste manuel ou la patience est reine.",
        fin: true,
        choix: [],
        resumeProfessions: ["ebeniste", "charpentier"]
      },
      {
        id: "design1",
        texte: "La graphiste travaille sur un logo pour une startup zurichoise. Sur son ecran : Illustrator, des palettes de couleurs, des dizaines de versions. Elle te montre comment transformer une idee en image.",
        choix: [
          { texte: "Tu veux essayer ! Tu as toujours aime dessiner et creer des visuels", tags: { creatif: 3, technique: 1 }, suite: "designFin" },
          { texte: "Tu es plus interesse par le cote technique — les logiciels et la mise en page", tags: { technique: 2, analytique: 1, interieur: 1 }, suite: "designFin" }
        ]
      },
      {
        id: "designFin",
        texte: "La graphiste te dit : « Le graphisme c'est resoudre des problemes visuels. Chaque projet est un nouveau defi creatif. » Un metier parfait pour ceux qui pensent en images.",
        fin: true,
        choix: [],
        resumeProfessions: ["graphiste", "polygraphe", "mediamaticien"]
      },
      {
        id: "coiffure1",
        texte: "Le salon est plein de clients. Le coiffeur fait une coupe tendance tout en discutant avec son client. Il te dit : « Tu veux essayer de faire un brushing ? » L'ambiance est cool et detendue.",
        choix: [
          { texte: "Tu te lances — le contact avec les gens et le cote creatif te plaisent", tags: { contactHumain: 2, creatif: 2, manuel: 1 }, suite: "coiffureFin" },
          { texte: "Tu preferes observer — tu es impressionne par la dexterite et le sens du style", tags: { creatif: 2, manuel: 1, independant: 1 }, suite: "coiffureFin" }
        ]
      },
      {
        id: "coiffureFin",
        texte: "Le coiffeur te dit : « Mon metier c'est rendre les gens heureux quand ils se regardent dans le miroir. Et chaque tete est differente ! » Un metier creatif avec beaucoup de contact humain.",
        fin: true,
        choix: [],
        resumeProfessions: ["coiffeur", "graphiste"]
      }
    ]
  },

  // ===== 6. FERME =====
  {
    id: "ferme",
    titre: "La ferme high-tech",
    description: "Pres de Winterthour, une exploitation agricole moderne te fait decouvrir les metiers de la nature.",
    secteur: "nature",
    icon: "\ud83c\udf3e",
    scenes: [
      {
        id: "arrivee",
        texte: "Tu arrives dans une grande ferme pres de Winterthour. C'est pas la ferme de ton grand-pere : il y a un robot de traite, des drones pour surveiller les champs et un tracteur GPS ! L'agriculteur t'accueille : « Ici la nature rencontre la technologie. »",
        choix: [
          { texte: "Tu veux aller dans les champs avec les animaux — rien ne vaut le grand air !", tags: { exterieur: 3, manuel: 2 }, suite: "champs1" },
          { texte: "Tu veux decouvrir la foret voisine — les arbres et le calme t'attirent", tags: { exterieur: 2, independant: 2, manuel: 1 }, suite: "foret1" },
          { texte: "Tu veux voir les serres et les plantes — le vert c'est ta couleur", tags: { creatif: 1, manuel: 1, exterieur: 1, variete: 1 }, suite: "serre1" }
        ]
      },
      {
        id: "champs1",
        texte: "Dans le pre, tu aides a deplacer les vaches vers un nouveau paturage. Le chien de berger court partout. Ensuite l'agriculteur te montre comment piloter le drone pour reperer les zones seches du champ de ble.",
        choix: [
          { texte: "Tu adores etre dehors avec les animaux — la nature c'est ton element", tags: { exterieur: 2, manuel: 1, variete: 1 }, suite: "champsFin" },
          { texte: "Le drone et la technologie agricole te fascinent plus que les vaches", tags: { technique: 2, analytique: 1, intellectuel: 1 }, suite: "champsFin" }
        ]
      },
      {
        id: "champsFin",
        texte: "L'agriculteur te dit : « Nourrir les gens c'est le plus beau metier du monde. Et aujourd'hui on le fait avec des outils incroyables. » Un metier en pleine evolution, mieux paye qu'on ne croit.",
        fin: true,
        choix: [],
        resumeProfessions: ["agriculteur", "horticulteur"]
      },
      {
        id: "foret1",
        texte: "En foret avec le forestier-bucheron, tu decouvres comment on gere une foret durablement. Il abat un arbre avec precision — l'arbre tombe exactement ou il voulait. C'est impressionnant et un peu effrayant !",
        choix: [
          { texte: "Tu adores la puissance et la precision — travailler en foret c'est l'aventure", tags: { manuel: 3, exterieur: 2 }, suite: "foretFin" },
          { texte: "Tu es plus sensible au cote ecologique — proteger la foret c'est important", tags: { intellectuel: 1, independant: 1, variete: 1 }, suite: "foretFin" }
        ]
      },
      {
        id: "foretFin",
        texte: "Le forestier te dit : « Je suis le gardien de cette foret. Chaque arbre que je plante sera la dans 100 ans. » Un metier physique et solitaire pour les amoureux de la nature.",
        fin: true,
        choix: [],
        resumeProfessions: ["forestier", "agriculteur"]
      },
      {
        id: "serre1",
        texte: "Dans la serre, c'est un jardin tropical : des orchidees, des tomates, des herbes aromatiques. L'horticultrice te montre comment bouturer une plante. Tu apprends que les plantes reagissent a la lumiere, a l'eau et meme a la musique !",
        choix: [
          { texte: "Tu adores le cote creatif — combiner les couleurs et creer des jardins", tags: { creatif: 2, manuel: 1, independant: 1 }, suite: "serreFin" },
          { texte: "Tu es plus interesse par la science — comment les plantes poussent et ce dont elles ont besoin", tags: { analytique: 2, intellectuel: 1, routine: 1 }, suite: "serreFin" }
        ]
      },
      {
        id: "serreFin",
        texte: "L'horticultrice te dit : « Faire pousser des plantes c'est de la magie lente. Et un beau jardin rend les gens heureux. » Un metier entre art et science, proche de la nature.",
        fin: true,
        choix: [],
        resumeProfessions: ["horticulteur", "agriculteur"]
      }
    ]
  },

  // ===== 7. LABO TECH =====
  {
    id: "labotech",
    titre: "Le labo tech",
    description: "Une usine high-tech avec des robots et des machines de precision. Le futur de l'industrie suisse !",
    secteur: "technique",
    icon: "\ud83e\udd16",
    scenes: [
      {
        id: "arrivee",
        texte: "Tu visites une usine de haute technologie a Winterthour, un des berceaux de l'industrie suisse. Des robots assemblent des pieces, des machines CNC decoupent du metal au micrometre pres. C'est comme dans un film de science-fiction !",
        choix: [
          { texte: "Les machines CNC t'attirent — fabriquer des pieces metalliques de precision, ca te parle", tags: { manuel: 2, technique: 2, independant: 1 }, suite: "cnc1" },
          { texte: "Les robots industriels te fascinent — tu veux savoir comment on les programme", tags: { intellectuel: 2, technique: 2, creatif: 1 }, suite: "robot1" },
          { texte: "Tu veux voir l'atelier d'electronique — les circuits et les puces, c'est ton monde", tags: { analytique: 2, technique: 2, interieur: 1 }, suite: "elec1" }
        ]
      },
      {
        id: "cnc1",
        texte: "Le polymecanicien te montre une piece qu'il vient d'usiner : un cylindre en acier poli comme un miroir, precis au centieme de millimetre. Il programme la machine CNC avec des coordonnees et lance la fabrication.",
        choix: [
          { texte: "Tu es fascine par la precision — creer des pieces parfaites, c'est un art", tags: { manuel: 2, analytique: 1, routine: 1 }, suite: "cncFin" },
          { texte: "C'est la programmation de la machine qui t'interesse le plus", tags: { intellectuel: 2, technique: 1, creatif: 1 }, suite: "cncFin" }
        ]
      },
      {
        id: "cncFin",
        texte: "Le polymecanicien te dit : « Nos pieces finissent dans des montres, des avions, des satellites. La precision suisse, c'est notre fierte. » Un metier tres demande avec d'excellents salaires.",
        fin: true,
        choix: [],
        resumeProfessions: ["polymecanicien", "automaticien", "mecanicienAerostructures"]
      },
      {
        id: "robot1",
        texte: "L'automaticienne te montre comment elle programme un bras robotise. Elle ecrit des lignes de code et le robot execute des mouvements precis pour assembler des composants. « Regarde, je vais lui apprendre un nouveau geste. »",
        choix: [
          { texte: "Tu veux essayer de programmer le robot — c'est comme un jeu mais en vrai !", tags: { intellectuel: 2, technique: 2, creatif: 1 }, suite: "robotFin" },
          { texte: "Tu es plus interesse par le cablage et les armoires electriques qui alimentent tout", tags: { manuel: 2, technique: 2, analytique: 1 }, suite: "robotFin" }
        ]
      },
      {
        id: "robotFin",
        texte: "L'automaticienne te dit : « Je donne vie aux machines. Chaque programme que j'ecris rend l'usine plus intelligente. » L'automatisation est l'avenir de l'industrie — et les specialistes sont tres recherches.",
        fin: true,
        choix: [],
        resumeProfessions: ["automaticien", "informaticien", "electronicien"]
      },
      {
        id: "elec1",
        texte: "Dans l'atelier d'electronique, un electronicien soude des composants minuscules sur un circuit imprime. Avec une loupe, il verifie chaque connexion. Il concoit aussi des circuits avec un logiciel de simulation.",
        choix: [
          { texte: "La soudure de precision et le travail minutieux te plaisent — tu as des doigts de fee", tags: { manuel: 2, analytique: 1, independant: 1 }, suite: "elecFin" },
          { texte: "C'est la conception du circuit sur ordinateur qui t'attire — creer l'architecture electronique", tags: { intellectuel: 2, creatif: 1, analytique: 1 }, suite: "elecFin" }
        ]
      },
      {
        id: "elecFin",
        texte: "L'electronicien te dit : « Mes circuits finissent dans des telephones, des voitures et meme des avions ! Un electronicien peut se specialiser en avionique et travailler dans l'aeronautique. » Un monde de possibilites.",
        fin: true,
        choix: [],
        resumeProfessions: ["electronicien", "electronicienAvionique", "automaticien"]
      }
    ]
  },

  // ===== 8. STARTUP TECH =====
  {
    id: "startup",
    titre: "La startup tech",
    description: "Dans le quartier tech de Zurich, decouvre les metiers du numerique dans une startup innovante.",
    secteur: "informatique",
    icon: "\ud83d\ude80",
    scenes: [
      {
        id: "arrivee",
        texte: "Tu arrives dans une startup du Technopark de Zurich. Open space, poufs colores, ecrans partout, un baby-foot dans le couloir. L'ambiance est decontractee mais tout le monde bosse dur. Le CTO t'accueille : « Ici on cree des apps qui changent la vie des gens ! »",
        choix: [
          { texte: "Tu veux voir les developpeurs — le code te fascine", tags: { analytique: 2, technique: 2, independant: 1 }, suite: "dev1" },
          { texte: "Tu veux decouvrir l'administration systeme — les serveurs et les reseaux", tags: { technique: 2, analytique: 1, routine: 1 }, suite: "sys1" },
          { texte: "Tu veux voir l'equipe multimedia — video, design web, reseaux sociaux", tags: { creatif: 2, contactHumain: 1, variete: 1 }, suite: "media1" }
        ]
      },
      {
        id: "dev1",
        texte: "La developpeuse te montre le code de leur application mobile. Des lignes de JavaScript defilent sur son ecran. Elle te dit : « Regarde, je vais ajouter une fonctionnalite. » En quelques minutes, un nouveau bouton apparait dans l'app !",
        choix: [
          { texte: "C'est magique ! Tu veux apprendre a coder et creer tes propres applications", tags: { intellectuel: 2, creatif: 2, technique: 1 }, suite: "devFin" },
          { texte: "Tu es plus interesse par la resolution de bugs — trouver l'erreur c'est comme une enquete", tags: { analytique: 3, independant: 1 }, suite: "devFin" }
        ]
      },
      {
        id: "devFin",
        texte: "La developpeuse te dit : « En informatique, tu ne cesses jamais d'apprendre. Chaque jour il y a un nouveau probleme a resoudre. Et la demande est enorme ! » Le CFC d'informaticien est un des plus demandes en Suisse.",
        fin: true,
        choix: [],
        resumeProfessions: ["informaticien", "mediamaticien"]
      },
      {
        id: "sys1",
        texte: "Le sysadmin te montre la salle des serveurs : des dizaines de machines qui clignotent dans une piece climatisee. Il surveille les performances sur des dashboards et reagit quand quelque chose plante.",
        choix: [
          { texte: "Tu aimes l'idee de gerer l'infrastructure — tout repose sur toi", tags: { technique: 2, routine: 1, independant: 1 }, suite: "sysFin" },
          { texte: "Tu es fascine par la cybersecurite — proteger les systemes contre les hackers", tags: { analytique: 2, intellectuel: 1, variete: 1 }, suite: "sysFin" }
        ]
      },
      {
        id: "sysFin",
        texte: "Le sysadmin te dit : « Je suis le gardien invisible. Quand tout marche, personne ne sait que j'existe. Quand ca plante, je suis le heros ! » Un metier stable avec de bonnes perspectives.",
        fin: true,
        choix: [],
        resumeProfessions: ["operateurInformatique", "informaticien"]
      },
      {
        id: "media1",
        texte: "L'equipe multimedia prepare une video promotionnelle. Le mediamaticien filme, monte et publie sur les reseaux sociaux. En meme temps, il met a jour le site web et repond aux commentaires des utilisateurs.",
        choix: [
          { texte: "Tu adores le cote creatif et varie — un peu de video, un peu de design, un peu de com'", tags: { creatif: 2, variete: 2, contactHumain: 1 }, suite: "mediaFin" },
          { texte: "Tu es plus attire par le cote web — creer des sites et des interfaces utilisateur", tags: { technique: 2, creatif: 1, analytique: 1 }, suite: "mediaFin" }
        ]
      },
      {
        id: "mediaFin",
        texte: "Le mediamaticien te dit : « Mon metier c'est raconter des histoires avec la technologie. Je suis un peu artiste, un peu geek et un peu communicateur. » Un metier hybride et tres actuel.",
        fin: true,
        choix: [],
        resumeProfessions: ["mediamaticien", "graphiste", "informaticien"]
      }
    ]
  },

  // ===== 9. CENTRE SOCIAL =====
  {
    id: "social",
    titre: "Aider les autres",
    description: "Un centre socio-educatif qui aide les enfants et les familles. Decouvre les metiers du coeur.",
    secteur: "social",
    icon: "\ud83e\udde1",
    scenes: [
      {
        id: "arrivee",
        texte: "Tu arrives dans un centre socio-educatif a Zurich. Des enfants jouent dans la cour, des educateurs organisent des activites. L'ambiance est chaleureuse et vivante. La directrice te dit : « Ici on accompagne des enfants, des ados et des familles. »",
        choix: [
          { texte: "Tu veux passer du temps avec les enfants dans le programme parascolaire", tags: { contactHumain: 3, creatif: 1, equipe: 1 }, suite: "parascolaire1" },
          { texte: "Tu veux voir le cote administratif — comment le centre fonctionne en coulisses", tags: { intellectuel: 1, routine: 1, analytique: 1, interieur: 1 }, suite: "admin1" },
          { texte: "Tu veux aider a animer un atelier pour les ados", tags: { creatif: 2, contactHumain: 2, equipe: 1 }, suite: "animation1" }
        ]
      },
      {
        id: "parascolaire1",
        texte: "Tu aides avec les devoirs et ensuite tu organises un jeu avec les enfants. Ils sont plein d'energie ! Un petit garcon te dit : « Tu reviens demain ? » Ca te fait chaud au coeur.",
        choix: [
          { texte: "Tu adores ce contact — rendre les enfants heureux c'est une recompense immense", tags: { contactHumain: 3, variete: 1 }, suite: "parascolaireFin" },
          { texte: "C'est chouette mais epuisant — tu te demandes comment ils font tous les jours", tags: { independant: 1, routine: 1, intellectuel: 1 }, suite: "parascolaireFin" }
        ]
      },
      {
        id: "parascolaireFin",
        texte: "L'educatrice te dit : « Chaque enfant est unique. On l'aide a grandir et a prendre confiance. C'est un metier ou on recoit autant qu'on donne. »",
        fin: true,
        choix: [],
        resumeProfessions: ["assistantSocioEducatif", "assc"]
      },
      {
        id: "admin1",
        texte: "Au bureau administratif, tu decouvres toute la paperasse necessaire : dossiers des familles, plannings des educateurs, budgets, rapports. L'employe de commerce te montre comment il organise tout ca.",
        choix: [
          { texte: "Tu comprends que meme dans le social, il faut de l'organisation — et ca te plait", tags: { analytique: 2, routine: 1, interieur: 1 }, suite: "adminFin" },
          { texte: "Tu prefererais etre sur le terrain avec les gens plutot que derriere un bureau", tags: { contactHumain: 2, exterieur: 1, variete: 1 }, suite: "adminFin" }
        ]
      },
      {
        id: "adminFin",
        texte: "L'employe te dit : « Sans l'administration, le centre ne pourrait pas fonctionner. C'est un travail discret mais essentiel. »",
        fin: true,
        choix: [],
        resumeProfessions: ["employeCommerce", "assistantSocioEducatif"]
      },
      {
        id: "animation1",
        texte: "Tu co-animes un atelier de musique avec des ados. Tu dois choisir les activites, motiver le groupe et gerer les conflits. Un ado difficile finit par s'investir grace a ton encouragement !",
        choix: [
          { texte: "Tu as adore animer et voir cet ado s'epanouir — c'est puissant", tags: { contactHumain: 3, creatif: 1, equipe: 1 }, suite: "animationFin" },
          { texte: "Tu as aime la partie creative — choisir les activites et preparer le programme", tags: { creatif: 2, intellectuel: 1, independant: 1 }, suite: "animationFin" }
        ]
      },
      {
        id: "animationFin",
        texte: "L'educateur te dit : « Animer un groupe c'est un super pouvoir. Tu apprends le leadership, l'empathie et la creativite. Et tu changes des vies. »",
        fin: true,
        choix: [],
        resumeProfessions: ["assistantSocioEducatif", "specialisteHotellerie"]
      }
    ]
  },

  // ===== 10. GARAGE =====
  {
    id: "garage",
    titre: "Le garage automobile",
    description: "Un garage moderne avec des voitures electriques et classiques. Pour les fans de mecanique !",
    secteur: "automobile",
    icon: "\ud83d\ude97",
    scenes: [
      {
        id: "arrivee",
        texte: "Tu arrives dans un grand garage a Zurich. Des voitures sont sur les ponts elevateurs, des mecaniciens s'affairent avec des outils. Il y a meme une Tesla en reparation ! Le chef d'atelier te dit : « Bienvenue dans le monde de la mecanique moderne. »",
        choix: [
          { texte: "Tu veux mettre les mains dans le moteur — diagnostic et reparation", tags: { technique: 2, manuel: 2, analytique: 1 }, suite: "diagnostic1" },
          { texte: "La carrosserie et la peinture t'attirent — redonner vie aux voitures accidentees", tags: { manuel: 2, creatif: 2 }, suite: "carrosserie1" },
          { texte: "L'accueil client et la planification — tu veux voir le cote bureau du garage", tags: { contactHumain: 2, routine: 1, interieur: 1 }, suite: "accueilGarage1" }
        ]
      },
      {
        id: "diagnostic1",
        texte: "Le mecanicien branche un ordinateur de diagnostic sur une voiture qui fait un bruit bizarre. L'ecran affiche des codes d'erreur. « C'est comme un medecin pour les voitures, » dit-il. « Il faut trouver la maladie ! »",
        choix: [
          { texte: "Tu adores cette logique de diagnostic — trouver la panne c'est un defi", tags: { analytique: 2, technique: 2 }, suite: "diagnosticFin" },
          { texte: "Tu preferes la partie manuelle — demonter, reparer, remonter", tags: { manuel: 3, independant: 1 }, suite: "diagnosticFin" }
        ]
      },
      {
        id: "diagnosticFin",
        texte: "Le mecanicien te dit : « Les voitures deviennent de plus en plus electroniques. Un bon mecanicien aujourd'hui c'est moitie ingenieur, moitie artisan. » Un metier en pleine evolution avec les vehicules electriques.",
        fin: true,
        choix: [],
        resumeProfessions: ["mecanicienAuto", "installateurElectricien"]
      },
      {
        id: "carrosserie1",
        texte: "Le carrossier repare une aile cabossee. Avec patience, il redresse le metal puis applique de la peinture. Le resultat est incroyable — on ne voit plus rien ! C'est un vrai artiste.",
        choix: [
          { texte: "Le cote transformation te plait — redonner une seconde vie a la voiture", tags: { creatif: 2, manuel: 2, independant: 1 }, suite: "carrosserieFin" },
          { texte: "Tu es impressionne par le melange de couleurs — c'est presque de l'art", tags: { creatif: 3, interieur: 1 }, suite: "carrosserieFin" }
        ]
      },
      {
        id: "carrosserieFin",
        texte: "Le carrossier te dit : « Chaque voiture cabossee c'est un nouveau defi. Et quand le client voit le resultat, il n'en revient pas ! » Un metier qui demande un oeil artistique et de la patience.",
        fin: true,
        choix: [],
        resumeProfessions: ["peintre", "mecanicienAuto"]
      },
      {
        id: "accueilGarage1",
        texte: "A l'accueil, la receptionniste gere les rendez-vous, explique les devis aux clients et coordonne le planning des mecaniciens. C'est l'interface entre le client et l'atelier.",
        choix: [
          { texte: "Tu aimes le contact avec les clients et l'organisation du planning", tags: { contactHumain: 2, routine: 1, equipe: 1 }, suite: "accueilGarageFin" },
          { texte: "Tu trouves que comprendre la technique pour expliquer aux clients c'est un bon mix", tags: { intellectuel: 1, contactHumain: 1, technique: 1, variete: 1 }, suite: "accueilGarageFin" }
        ]
      },
      {
        id: "accueilGarageFin",
        texte: "La receptionniste te dit : « Ici je suis la traductrice : je transforme le jargon technique en mots simples pour les clients. Il faut aimer les gens ET les voitures ! »",
        fin: true,
        choix: [],
        resumeProfessions: ["employeCommerce", "gestionnaireCommerce"]
      }
    ]
  },

  // ===== 11. AEROPORT =====
  {
    id: "aeroport",
    titre: "L'aeroport de Zurich",
    description: "Decouvre les coulisses de l'un des plus grands aeroports d'Europe et les metiers passionnants de l'aeronautique !",
    secteur: "aeronautique",
    icon: "\u2708\ufe0f",
    scenes: [
      {
        id: "arrivee",
        texte: "Tu arrives a l'aeroport de Zurich-Kloten. Des avions decollent toutes les deux minutes, les reacteurs rugissent ! Ton guide travaille chez SR Technics, une des plus grandes entreprises de maintenance aeronautique d'Europe. « Pret a decouvrir les coulisses ? »",
        choix: [
          { texte: "Le hangar de maintenance — tu veux voir l'interieur d'un avion de pres !", tags: { technique: 2, manuel: 2, interieur: 1 }, suite: "hangar1" },
          { texte: "La tour de controle et les operations — tu veux comprendre comment on gere le trafic aerien", tags: { analytique: 2, intellectuel: 2, equipe: 1 }, suite: "tour1" },
          { texte: "La piste et les operations au sol — tu veux etre au coeur de l'action, dehors !", tags: { exterieur: 2, equipe: 2, variete: 1 }, suite: "piste1" }
        ]
      },
      {
        id: "hangar1",
        texte: "Dans le hangar geant de SR Technics, un Airbus A320 est en pleine revision. Des mecaniciens inspectent chaque centimetre du fuselage. Un technicien te montre le moteur ouvert — c'est immense et incroyablement complexe !",
        choix: [
          { texte: "Tu es eboui par le moteur — comprendre comment ca fonctionne, c'est ton reve", tags: { technique: 3, analytique: 1, intellectuel: 1 }, suite: "hangar2" },
          { texte: "Tu veux toucher et participer — visser, verifier, inspecter", tags: { manuel: 3, technique: 1 }, suite: "hangar2" }
        ]
      },
      {
        id: "hangar2",
        texte: "Le mecanicien d'aerostructures te montre comment il inspecte le train d'atterrissage. « La moindre fissure peut etre dangereuse. On a une responsabilite enorme — des centaines de vies dependent de notre travail. » Il utilise des instruments de mesure ultra-precis.",
        choix: [
          { texte: "Cette responsabilite te motive — etre garant de la securite d'un avion, c'est puissant", tags: { analytique: 2, technique: 1, routine: 1 }, suite: "hangarFin" },
          { texte: "C'est l'electronique embarquee qui t'intrigue le plus — les instruments de bord et les radars", tags: { intellectuel: 2, technique: 2, creatif: 1 }, suite: "hangarFin" }
        ]
      },
      {
        id: "hangarFin",
        texte: "Le mecanicien te dit : « On entre dans l'aeronautique souvent par un CFC de polymecanicien ou d'electronicien, puis on se specialise. C'est un des meilleurs metiers techniques en Suisse — et on travaille sur des avions ! » Tu repars avec des etoiles dans les yeux.",
        fin: true,
        choix: [],
        resumeProfessions: ["mecanicienAerostructures", "electronicienAvionique", "polymecanicien"]
      },
      {
        id: "tour1",
        texte: "Tu ne montes pas dans la vraie tour de controle (acces restreint !), mais au centre d'operations de l'aeroport. Sur des ecrans geants, tu vois tous les vols en temps reel. L'agent d'exploitation coordonne les avions au sol, les portes d'embarquement et les equipes.",
        choix: [
          { texte: "La coordination en temps reel te fascine — c'est comme un jeu de strategie grandeur nature", tags: { analytique: 2, equipe: 2, variete: 1 }, suite: "tour2" },
          { texte: "Tu es impressionne par la technologie — les radars, les systemes de communication", tags: { technique: 2, intellectuel: 2 }, suite: "tour2" }
        ]
      },
      {
        id: "tour2",
        texte: "L'agent d'exploitation te dit : « Quand il y a du brouillard ou une tempete, tout se complique. Il faut reagir vite, communiquer avec 20 personnes en meme temps et garder son calme. » Il te montre comment il re-planifie les vols en cas de retard.",
        choix: [
          { texte: "Tu adores ce stress positif — prendre des decisions rapides dans un environnement critique", tags: { variete: 2, equipe: 1, analytique: 1 }, suite: "tourFin" },
          { texte: "Tu te verrais bien evoluer vers controleur aerien — gerer les avions dans le ciel !", tags: { intellectuel: 2, analytique: 1, independant: 1 }, suite: "tourFin" }
        ]
      },
      {
        id: "tourFin",
        texte: "L'agent te dit : « Pour devenir controleur aerien, il faut passer par skyguide apres un CFC ou une maturite. C'est tres selectif mais c'est un des metiers les mieux payes de Suisse ! » Une belle passerelle.",
        fin: true,
        choix: [],
        resumeProfessions: ["agentExploitation", "logisticien", "employeCommerce"]
      },
      {
        id: "piste1",
        texte: "Sur la piste (avec gilet jaune et casque anti-bruit !), tu vois les avions de tres pres. L'equipe au sol guide un Boeing 777 vers sa place de parking avec des balisages lumineux. Le ravitaillement en carburant commence aussitot. C'est impressionnant !",
        choix: [
          { texte: "Tu adores etre dehors pres des avions — sentir la puissance des reacteurs, c'est grisant", tags: { exterieur: 3, manuel: 1, variete: 1 }, suite: "piste2" },
          { texte: "Le travail d'equipe te frappe — tout le monde doit etre synchronise a la seconde", tags: { equipe: 3, routine: 1 }, suite: "piste2" }
        ]
      },
      {
        id: "piste2",
        texte: "Le chef d'equipe te dit : « On a 45 minutes pour decharger, nettoyer, ravitailler et recharger un avion. Tout est chronometré. C'est un travail physique mais tu es toujours au premier rang du spectacle ! » Un avion decolle juste a cote — le sol tremble.",
        choix: [
          { texte: "C'est exactement ce que tu veux — de l'action, des avions et du travail d'equipe", tags: { equipe: 2, exterieur: 1, variete: 1 }, suite: "pisteFin" },
          { texte: "Tu aimerais evoluer vers un role plus technique — peut-etre mecanicien d'avions un jour", tags: { technique: 2, analytique: 1, intellectuel: 1 }, suite: "pisteFin" }
        ]
      },
      {
        id: "pisteFin",
        texte: "Le chef te dit : « L'aeroport c'est une petite ville qui ne dort jamais. Si tu aimes les avions, il y a des dizaines de metiers possibles — de la piste au hangar en passant par les bureaux. » Tu repars avec le bruit des reacteurs dans les oreilles et un sourire jusqu'aux oreilles.",
        fin: true,
        choix: [],
        resumeProfessions: ["agentExploitation", "mecanicienAerostructures", "logisticien"]
      }
    ]
  }
];
