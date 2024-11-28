import mongoose from 'mongoose';

// Schéma pour chaque partie d'une zone
const ZonePartSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['COMPTAGE', 'BIPAGE', 'CONTROLE'], // Types de parties autorisés
    required: [true, 'Le type de la partie est requis.'],
  },
  codeBarre: {
    type: String, // Code-barre unique généré automatiquement
    required: [true, 'Le code-barre est requis.'],
    unique: true, // Garantit l'unicité du code-barre dans toute la collection
    validate: {
      validator: function (value) {
        return /^\d{13}$/.test(value); // Valide si le code-barre est un EAN-13 valide
      },
      message: 'Le code-barre doit être un EAN-13 valide (13 chiffres).',
    },
  },
  status: {
    type: String,
    enum: ['À faire', 'En cours', 'Terminé'], // Statuts autorisés
    default: 'À faire',
  },
});

// Schéma principal pour la zone
const ZoneSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de la zone est requis.'],
    trim: true, // Supprime les espaces inutiles
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
  
  parties: {
    type: [ZonePartSchema], // Liste des parties de la zone
    required: [true, 'Les parties de la zone sont requises.'],
    validate: {
      validator: function (value) {
        return value.length === 3; // La zone doit avoir exactement 3 parties
      },
      message: 'Chaque zone doit contenir exactement 3 parties.',
    },
  },
  inventaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory', // Référence à un inventaire
    required: [true, 'La zone doit être associée à un inventaire.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ajout d'un index unique pour permettre des noms identiques dans des inventaires différents
ZoneSchema.index({ nom: 1, inventaire: 1 }, { unique: true });

// Ajout d'un index pour garantir l'unicité des `codeBarre` globalement
ZoneSchema.index({ 'parties.codeBarre': 1 }, { unique: true });

export default mongoose.model('Zone', ZoneSchema);
