# Swissdoc Classification System

Source: [SDBB/CSFO — Introduction à la systématique SWISSDOC (Août 2025)](./2025_introduction_systematique_swissdoc.pdf)

The swissdoc system is a decimal classification used since 1978 for Swiss career orientation.
It is managed in three national languages (DE, FR, IT) by the CSFO.

## Numbering Structure (Professions)

A swissdoc profession number has 4 blocks: `0.XXX.YY.Z`

```
0.420.21.0   Dessinateur/trice CFC
│ │││  ││ │
│ │││  ││ └─ BLOC 4: 0 = descripteur (dénomination principale)
│ │││  ││              >0 = non-descripteur (renvoi/orientation)
│ │││  │└──── BLOC 3: numéro d'identification unique
│ │││  └───── (within the subgroup)
│ ││└──────── Subgroup: 420 = Étude de projets
│ │└───────── Main group digit: 4 = Construction
│ └────────── Main group: 400 = Construction
└──────────── BLOC 1: 0 = Profession (vs 1-9 = Formation levels)
```

BLOC 1 values:
- `0` = Profession
- `1`-`9` = Formation (see formation levels below)
- `10` = Thèmes généraux (general topics)

## The 8 Main Professional Groups

| Code | Group | FR |
|------|-------|----|
| 0.100.0.0 | NATURE | Agriculture, horticulture, sylviculture, animaux |
| 0.200.0.0 | ALIMENTATION, HÔTELLERIE, RESTAURATION, ÉCONOMIE FAMILIALE | |
| 0.300.0.0 | TEXTILES, HABILLEMENT, SOINS CORPORELS | |
| 0.400.0.0 | CONSTRUCTION | Aménagement du territoire, étude de projets, gros œuvre, second œuvre |
| 0.500.0.0 | INDUSTRIE, TECHNIQUE, INFORMATIQUE | Impression, mécanique, électricité, informatique |
| 0.600.0.0 | ÉCONOMIE, COMMERCE, ADMINISTRATION, TRANSPORTS, TOURISME | |
| 0.700.0.0 | FORMATION, SPORT, SANTÉ, DOMAINE SOCIAL, THÉOLOGIE, PSYCHOLOGIE | |
| 0.800.0.0 | MÉDIAS, ARTS, SCIENCES HUMAINES | |

## Subgroups (used in our CFC professions)

### 100 — Nature
- 110: Sylviculture (forestry)
- 120: Agriculture, élevage
- 130: Agriculture (general)
- 140: Pêche, viticulture
- 150: Horticulture, paysagisme

### 200 — Alimentation, Hôtellerie, Restauration
- 210: Alimentation (boulanger, boucher, meunier...)
- 220: Cuisine, restauration
- 230: Hôtellerie, intendance

### 300 — Textiles, Habillement, Soins corporels
- 310: Textiles
- 320: Habillement
- 330: Cuir, chaussures
- 350: Soins corporels (coiffeur, esthéticien...)

### 400 — Construction
- 410: Aménagement du territoire (géomaticien, dessinateur...)
- 420: Étude de projets (architecte, dessinateur...)
- 430: Gros œuvre (maçon, charpentier, constructeur routes...)
- 440: Second œuvre — technique (installations sanitaires, chauffage, électricité...)
- 450: Second œuvre — finitions (peintre, ébéniste, menuisier, vitrier...)

### 500 — Industrie, Technique, Informatique
- 510: Industrie du bois
- 520: Industrie du papier
- 532: Industrie graphique
- 533: Emballage
- 534: Reliure
- 540: Chimie, physique, laboratoire
- 551: Mécanique de production (dessinateur-constructeur industriel...)
- 552: Mécanique machines
- 553: Polymécanique, micromécanique
- 554: Construction métallique
- 555: Électrotechnique, automatique, électronique
- 556: Horlogerie
- 561: Informatique, médiamatique
- 570: Véhicules (automobile, motocycles, cycles, bateaux...)
- 580: Matières plastiques

### 600 — Économie, Commerce, Administration, Transports
- 611: Commerce, administration (employé de commerce)
- 613: Vente, commerce de détail (droguiste, libraire, pharmacie...)
- 617: Transports, logistique
- 631: Tourisme
- 632: Hôtellerie (management)
- 635: Communication
- 636: Gestion immobilière

### 700 — Santé, Social, Formation
- 721: Soins infirmiers
- 722: Soins et santé communautaire (ASSC)
- 723: Médecine spécialisée (dentaire, optique, podologie...)
- 731: Travail social, éducation

### 800 — Médias, Arts
- 811: Presse, information
- 814: Arts visuels, graphisme, photographie
- 821: Arts appliqués (céramique, bijouterie...)
- 822: Arts du spectacle (danse, techniscéniste...)
- 825: Musique (facteur d'instruments...)
- 826: Conservation, restauration

## Formation Levels (BLOC 1)

| Code | Level |
|------|-------|
| 1.000.0.0 | Écoles à plusieurs degrés |
| 2.000.0.0 | Degré primaire |
| 3.000.0.0 | Degré secondaire I |
| 4.000.0.0 | Écoles de culture générale, lycées, gymnases |
| 5.000.0.0 | Formation professionnelle initiale (CFC/AFP) |
| 6.000.0.0 | Universités et EPF |
| 7.000.0.0 | Formation professionnelle supérieure (HES/U, ES, BF, DF) |
| 8.000.0.0 | (réserve) |
| 9.000.0.0 | Formation continue |

The profession code `0.XXX` maps to its CFC training at `5.XXX`:
- Profession: `0.150.4.0` Fleuriste CFC
- Formation initiale: `5.150.5.0` Fleuriste CFC, formation initiale
- Perfectionnement: `7.150.5.0` Fleuriste (BF)
- Formation continue: `9.150.2.0` Art floral

## Our Scenarios → Swissdoc Groups

| Scenario | Game Sector | Primary Swissdoc Group(s) |
|----------|------------|--------------------------|
| 🏥 Hôpital | sante | **700** Santé, Social + 500, 600 |
| 🏗️ Chantier | construction | **400** Construction |
| 🏦 Banque | commerce | **600** Économie, Commerce |
| 🍽️ Restaurant | gastronomie | **200** Alimentation, Hôtellerie + 600 |
| 🎨 Atelier créatif | artisanat | **800** Arts + 300, 400, 500 |
| 🌾 Ferme | nature | **100** Nature |
| 🤖 Labo tech | technique | **500** Industrie, Technique |
| 🚀 Startup | informatique | **500** Industrie, Technique (561) + 800 |
| 🧡 Social | social | **700** Santé, Social + 200, 600 |
| 🚗 Garage | automobile | **500** Industrie, Technique (570) + 400, 600 |
| ✈️ Aéroport | aeronautique | **500** Industrie, Technique + 400, 600 |
