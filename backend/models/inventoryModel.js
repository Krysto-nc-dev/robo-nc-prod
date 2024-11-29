import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema(
  {
    zones: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zone',
      },
    ],
    agents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
      },
    ],
    dateDebut: {
      type: Date,
      required: [true, "Veuillez fournir la date de début de l'inventaire"],
    },
    dateFin: {
      type: Date,
    },
    nom: {
      type: String,
      required: [true, "Veuillez fournir un nom pour l'inventaire"],
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
      default: 'Inventaire',
    },
    statut: {
      type: String,
      enum: ['En cours', 'Terminé'],
      default: 'En cours',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Middleware pour supprimer les agents liés à cet inventaire
InventorySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  await mongoose.model('Agent').deleteMany({ inventaire: this._id });
  next();
});

export default mongoose.model('Inventory', InventorySchema);
