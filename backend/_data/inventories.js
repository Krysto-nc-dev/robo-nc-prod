const inventories = [
  {
    _id: "6f3b514b5d2c12c7449be100",
    nom: "Inventaire 2024",
    zones: [
      "5f2b514b5d2c12c7449be000",
      "5f2b514b5d2c12c7449be001",
      "5f2b514b5d2c12c7449be002",
    ],
    agents: [
      "5f1a514b5d2c12c7449be001", // Jean Dupont
      "5f1a514b5d2c12c7449be003", // Pierre Martin
    ],
    dateDebut: "2024-01-15T08:00:00.000Z",
    dateFin: null, // En cours
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
      "5f1a514b5d2c12c7449be002", // Marie Durand
    ],
    dateDebut: "2022-01-10T08:00:00.000Z",
    dateFin: "2022-01-12T18:00:00.000Z", // Terminé
    statut: "Terminé",
    createdAt: "2022-01-10T08:00:00.000Z",
  },
];

export default inventories;
