import mongoose from "mongoose";

// Définition du schéma pour le fichier DBF
const factureSchema = new mongoose.Schema(
  {
    NUMFACT: { type: String, maxlength: 7 }, // Numéro de facture
    TYPFACT: { type: String, maxlength: 1 }, // Type de facture
    DATFACT: { type: Date }, // Date de la facture
    DATTRAV: { type: Date }, // Date du travail
    TIERS: { type: Number, default: 0 }, // Identifiant tiers
    GENER: { type: String, maxlength: 1 }, // Génération
    DBCPT: { type: String, maxlength: 1 }, // Débit/Crédit
    BONCDE: { type: String, maxlength: 30 }, // Bon de commande
    REPRES: { type: Number, default: 0 }, // Représentant
    TEXTE: { type: String, maxlength: 60 }, // Texte
    CHEQUE: { type: String, maxlength: 16 }, // Numéro de chèque
    MONTANT: { type: Number, default: 0 }, // Montant
    FACTREM: { type: Number, default: 0 }, // Remise sur facture
    FACTNBLG: { type: Number, default: 0 }, // Nombre de lignes
    FACTREV: { type: Number, default: 0 }, // Revenu
    SUPPR: { type: String, maxlength: 1 }, // Supprimé (oui/non)
    MONTAXES: { type: Number, default: 0 }, // Montant des taxes
    ACOMPTE: { type: String, maxlength: 7 }, // Acompte
    STDEST: { type: Number, default: 0 }, // Stock destination
    STORI: { type: Number, default: 0 }, // Stock origine
    ETAT: { type: Number, default: 0 }, // État
    HEURE: { type: String, maxlength: 5 }, // Heure
    AP: { type: String, maxlength: 1 }, // AP
    EXTIERS: { type: Number, default: 0 }, // Tiers externe
    NOM: { type: String, maxlength: 30 }, // Nom
  },
  { timestamps: true } // Ajoute les champs `createdAt` et `updatedAt`
);

export default mongoose.model("Facture", factureSchema);
