import mongoose from 'mongoose';

const RecordSchema = new mongoose.Schema(
  {
    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Zone',
      required: [true, "Veuillez fournir la zone associée à cet enregistrement"],
    },
    typeAction: {
      type: String,
      enum: ['COMPTAGE', 'BIPAGE', 'CONTROLE'],
      required: [true, "Veuillez fournir le type d'action"],
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      required: [true, "Veuillez fournir l'agent responsable de cette action"],
    },
    codeBarre: {
      type: String,
      required: [true, "Un code-barres doit être généré pour cette action"],
      unique: true,
    },
    dateAction: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Record || mongoose.model('Record', RecordSchema);
