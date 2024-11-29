import { generateBarcode } from '../utils/barcode.js';

const zones = [
  {
    _id: "5f2b514b5d2c12c7449be000",
    nom: "MAG_F_1",
    designation: "Décoration",
    observation: "Articles de décoration. Vérifiez les cartons derrière les étagères.",
    lieu: "Dock",
    parties: [
      { type: "COMPTAGE", codeBarre: generateBarcode(), status: "Terminé", agent: "5f1a514b5d2c12c7449be001", dateScan: "2024-01-15T10:00:00.000Z" },
      { type: "BIPAGE", codeBarre: generateBarcode(), status: "En cours" },
      { type: "CONTROLE", codeBarre: generateBarcode(), status: "À faire" },
    ],
    inventaire: "6f3b514b5d2c12c7449be100",
    createdAt: "2024-01-15T08:00:00.000Z",
  },
  {
    _id: "5f2b514b5d2c12c7449be001",
    nom: "MAG_F_2",
    designation: "Jardinage",
    observation: "Articles de jardinage. Vérifiez derrière les présentoirs.",
    lieu: "Dock",
    parties: [
      { type: "COMPTAGE", codeBarre: generateBarcode(), status: "Terminé", agent: "5f1a514b5d2c12c7449be002", dateScan: "2024-01-15T11:00:00.000Z" },
      { type: "BIPAGE", codeBarre: generateBarcode(), status: "Terminé", agent: "5f1a514b5d2c12c7449be003", dateScan: "2024-01-15T12:00:00.000Z" },
      { type: "CONTROLE", codeBarre: generateBarcode(), status: "À faire" },
    ],
    inventaire: "6f3b514b5d2c12c7449be100",
    createdAt: "2024-01-15T08:00:00.000Z",
  },
];

export default zones;
