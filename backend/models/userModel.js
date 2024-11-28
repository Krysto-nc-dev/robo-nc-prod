import mongoose from "mongoose";
import bcrypt from "bcrypt"; // Import bcrypt

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Veuillez fournir un nom pour cet utilisateur"],
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Veuillez fournir une adresse email"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Veuillez fournir une adresse email valide",
      ],
    },
    role: {
      type: String,
      enum: ["user", "private", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Veuillez fournir un mot de passe"],
      minlength: [6, "Le mot de passe doit comporter au moins 6 caractères"],
      select: false, // Empêche le mot de passe d'être renvoyé par défaut dans les requêtes
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Middleware pour hasher le mot de passe avant de sauvegarder le document
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10); // Génère un sel
  this.password = await bcrypt.hash(this.password, salt); // Hash le mot de passe
  next();
});

// Méthode pour comparer les mots de passe lors de l'authentification
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare le mot de passe entré avec celui stocké
};

export default mongoose.model("User", UserSchema);

