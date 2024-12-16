import mongoose from "mongoose";

// Définition du schéma pour le fichier DBF
const commandeSchema = new mongoose.Schema(
  {
    FOURN: { type: Number, default: 0 }, // Fournisseur
    NUMCDE: { type: String }, // Numéro de commande
    DATCDE: { type: Date }, // Date de commande
    BATEAU: { type: String }, // Nom du bateau
    ARRIVEE: { type: Date }, // Date d'arrivée
    OBSERV: { type: String }, // Observations
    NUMFACT: { type: String }, // Numéro de facture
    DATFACT: { type: Date }, // Date de la facture
    VERROU: { type: String }, // Verrou
    NOT1: { type: String }, // Note 1
    NOT2: { type: String }, // Note 2
    NOT3: { type: String }, // Note 3
    NOT4: { type: String }, // Note 4
    NOT5: { type: String }, // Note 5
    NOT6: { type: String }, // Note 6
    NOT7: { type: String }, // Note 7
    NOT8: { type: String }, // Note 8
    NOT9: { type: String }, // Note 9
    NOT10: { type: String }, // Note 10
    ENT1: { type: String }, // Entrée 1
    ENT2: { type: String }, // Entrée 2
    ENT3: { type: String }, // Entrée 3
    TAXES: { type: Number, default: 0 }, // Taxes
    TOTPR: { type: Number, default: 0 }, // Total prix
    DVISE: { type: Number, default: 0 }, // Devise
    FRET: { type: Number, default: 0 }, // Frais de fret
    FRTRANSIT: { type: Number, default: 0 }, // Frais de transit
    GROUPAGE: { type: String }, // Groupage
    ETAT: { type: Number, default: 0 }, // État
    COMPTLIG: { type: Number, default: 0 }, // Comptage ligne
    CDVISE: { type: String }, // Code devise
  },
  { timestamps: true } // Ajoute les champs `createdAt` et `updatedAt`
);

export default mongoose.model("Commande", commandeSchema);
