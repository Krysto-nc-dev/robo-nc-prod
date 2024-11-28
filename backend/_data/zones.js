import { generateBarcode } from '../utils/barcode.js';

const zones = [
  {
    _id: "5f2b514b5d2c12c7449be000",
    nom: "MAG_F_1",
    designation: "Décoration",
    observation: "Zone de stockage des articles de décoration. Attention à bien compter les cartons derrière les étagères.",
    lieu: "Dock",
    parties: [
      { type: "COMPTAGE", codeBarre: generateBarcode(), status: "À faire" },
      { type: "BIPAGE", codeBarre: generateBarcode(), status: "À faire" },
      { type: "CONTROLE", codeBarre: generateBarcode(), status: "À faire" },
    ],
    inventaire: "6f3b514b5d2c12c7449be100", // Ajout de la référence à l'inventaire
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    _id: "5f2b514b5d2c12c7449be001",
    nom: "MAG_F_2",
    designation: "Jardinage",
    observation: "Zone réservée aux articles de jardinage. Veuillez vérifier la présence des outils derrière les présentoirs.",
    lieu: "Dock",
    parties: [
      { type: "COMPTAGE", codeBarre: generateBarcode(), status: "À faire" },
      { type: "BIPAGE", codeBarre: generateBarcode(), status: "À faire" },
      { type: "CONTROLE", codeBarre: generateBarcode(), status: "À faire" },
    ],
    inventaire: "6f3b514b5d2c12c7449be100",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    _id: "5f2b514b5d2c12c7449be002",
    nom: "MAG_F_3",
    designation: "Maçonnerie",
    observation: "Zone des matériaux de maçonnerie. Bien vérifier le nombre de sacs entreposés et leur état.",
    lieu: "Dock",
    parties: [
      { type: "COMPTAGE", codeBarre: generateBarcode(), status: "À faire" },
      { type: "BIPAGE", codeBarre: generateBarcode(), status: "À faire" },
      { type: "CONTROLE", codeBarre: generateBarcode(), status: "À faire" },
    ],
    inventaire: "6f3b514b5d2c12c7449be100",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  // Ajoutez toutes les zones ici avec la référence `inventaire` appropriée
];

export default zones;
