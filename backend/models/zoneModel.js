import mongoose from 'mongoose';

// Schéma pour chaque partie d'une zone
const ZonePartSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['COMPTAGE', 'BIPAGE', 'CONTROLE'],
    required: [true, 'Le type de la partie est requis.'],
  },
  codeBarre: {
    type: String,
    required: [true, 'Le code-barre est requis.'],
    unique: true,
    validate: {
      validator: function (value) {
        return /^\d{13}$/.test(value); // Valide si le code-barre est un EAN-13 valide
      },
      message: 'Le code-barre doit être un EAN-13 valide (13 chiffres).',
    },
  },
  status: {
    type: String,
    enum: ['À faire', 'En cours', 'Terminé'],
    default: 'À faire',
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: false,
  },
  dateScan: {
    type: Date,
    required: false,
  },
});

// Schéma principal pour la zone
const ZoneSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de la zone est requis.'],
    trim: true,
  },
  designation: {
    type: String,
    required: [true, 'La désignation de la zone est requise.'],
    trim: true,
  },
  lieu: {
    type: String,
    required: [true, 'Le lieu de la zone est requis.'],
    trim: true,
  },
  observation: {
    type: String,
    trim: true,
  },
  remarques: {
    type: String,
    trim: true,
  },
  parties: {
    type: [ZonePartSchema],
    required: [true, 'Les parties de la zone sont requises.'],
    validate: {
      validator: function (value) {
        return value.length === 3;
      },
      message: 'Chaque zone doit contenir exactement 3 parties.',
    },
  },
  inventaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: [true, 'La zone doit être associée à un inventaire.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ZoneSchema.index({ nom: 1, inventaire: 1 }, { unique: true });
ZoneSchema.index({ 'parties.codeBarre': 1 }, { unique: true });

export default mongoose.model('Zone', ZoneSchema);
