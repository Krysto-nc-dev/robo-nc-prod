const inventories = [
  {
    _id: "6f3b514b5d2c12c7449be100",
    nom: "Inventaire 2024",
    zones: [
      "5f2b514b5d2c12c7449be000", // Références aux zones
      "5f2b514b5d2c12c7449be001",
      "5f2b514b5d2c12c7449be002",
    ],
    agents: [
       "5f1a514b5d2c12c7449be003",
    ],
    dateDebut: "2024-01-15T08:00:00.000Z",
    dateFin: null, // L'inventaire est en cours
    statut: "En cours",
    createdAt: "2024-01-15T08:00:00.000Z",
  },
  {
    _id: "6f3b514b5d2c12c7449be101",
    nom: "Inventaire 2022",

    zones: [
      "5f2b514b5d2c12c7449be003",
      "5f2b514b5d2c12c7449be004",
    ],
    agents: [
      "5f1a514b5d2c12c7449be003",
   ],
    dateDebut: "2024-01-10T08:00:00.000Z",
    dateFin: "2024-01-12T18:00:00.000Z", // L'inventaire est terminé
    statut: "Terminé",
    createdAt: "2024-01-10T08:00:00.000Z",
  },
  {
    _id: "6f3b514b5d2c12c7449be102",
    nom: "Inventaire 2024 test",

    zones: [
      "5f2b514b5d2c12c7449be005",
      "5f2b514b5d2c12c7449be006",
      "5f2b514b5d2c12c7449be007",
    ],
    agents: [
      "5f1a514b5d2c12c7449be003",
   ],
    dateDebut: "2024-01-20T08:00:00.000Z",
    dateFin: null, // L'inventaire est en cours
    statut: "En cours",
    createdAt: "2024-01-20T08:00:00.000Z",
  },
  {
    _id: "6f3b514b5d2c12c7449be103",
    nom: "Inventaire test",

    zones: [
      "5f2b514b5d2c12c7449be008",
      "5f2b514b5d2c12c7449be009",
    ],
    agents: [
      "5f1a514b5d2c12c7449be003",
   ],
    dateDebut: "2024-01-05T08:00:00.000Z",
    dateFin: "2024-01-07T18:00:00.000Z", // L'inventaire est terminé
    statut: "Terminé",
    createdAt: "2024-01-05T08:00:00.000Z",
  },
];

export default inventories;
