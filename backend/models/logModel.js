import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Référence au modèle utilisateur
    required: true,
  },
  action: {
    type: String,
    enum: ["Créer", "Modifier", "Supprimer"], // Actions possibles
    required: true,
  },
  target: {
    type: String,
    required: true, // Nom de l'objet affecté (ex: Inventory, User)
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // ID de l'objet affecté
  },
  details: {
    type: String,
    trim: true, // Détails supplémentaires (optionnel)
  },
  timestamp: {
    type: Date,
    default: Date.now, // Date et heure
  },
});

export default mongoose.model("Log", LogSchema);
