const TicketSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, "Veuillez fournir un titre pour le ticket"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Veuillez fournir une description pour le ticket"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Ouvert", "En cours", "Résolu", "Fermé"],
      default: "Ouvert",
    },
    priorite: {
      type: String,
      enum: ["Basse", "Moyenne", "Haute"],
      default: "Moyenne",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Référence à l'utilisateur assigné
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Référence au créateur du ticket
      required: true,
    },
    parentModel: {
      type: String, // Exemple : 'RepportGenerator', 'AnotherModel'
      required: false,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId, // Référence à l'instance du parent
      required: false,
    },
  },
  { timestamps: true }
);
