import mongoose from "mongoose";

// Définition du schéma pour le fichier DBF CLASSNUM
const classnumSchema = new mongoose.Schema(
  {
    CLASSNUM: { type: String, maxlength: 2 }, // Code de la classe (2 caractères)
    CLASSLIB: { type: String, maxlength: 40 }, // Libellé de la classe
    COEFF: { type: Number, min: 0, max: 9999.99 }, // Coefficient principal
    COEFF2: { type: Number, min: 0, max: 9999.99 }, // Coefficient 2
    COEFF3: { type: Number, min: 0, max: 9999.99 }, // Coefficient 3
    COEFF4: { type: Number, min: 0, max: 9999.99 }, // Coefficient 4
    COEFF5: { type: Number, min: 0, max: 9999.99 }, // Coefficient 5
    COMPTE: { type: String, maxlength: 6 }, // Numéro de compte (6 caractères)
  },
  { timestamps: true } // Ajoute les champs `createdAt` et `updatedAt`
);

export default mongoose.model("Classnum", classnumSchema);
