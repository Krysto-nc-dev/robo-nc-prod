import jwt from 'jsonwebtoken';
import asyncHandler from './async.js';
import mongoose from 'mongoose';
import User from '../models/userModel.js';

// Middleware de protection des routes
const protect = asyncHandler(async (req, res, next) => {
  console.log('Cookies reçus dans la requête:', req.cookies);

  let token;

  // Vérification de la présence du token dans les cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token.trim(); // Supprime les espaces éventuels
    console.log('Token reçu pour vérification:', token);
  }

  // Si aucun token n'est trouvé, retournez une erreur
  if (!token) {
    res.status(401);
    throw new Error('Non autorisé : aucun token trouvé');
  }

  try {
    // Vérifiez la connexion MongoDB
    const connectionState = mongoose.connection.readyState;
    console.log('État de la connexion MongoDB :', connectionState);
    if (connectionState !== 1) {
      throw new Error('Connexion à la base de données non établie');
    }

    // Décodage et vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé:', decoded);

    // Recherche de l'utilisateur correspondant au token
    req.user = await User.findById(decoded.userId).select('-password');
    console.log('Utilisateur trouvé:', req.user);

    if (!req.user) {
      throw new Error('Utilisateur introuvable : accès non autorisé');
    }

    // Passe au middleware suivant
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error.message);
    res.status(401);
    throw new Error('Token non valide ou expiré');
  }
});

// Middleware pour vérifier si l'utilisateur est administrateur
const admin = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.toLowerCase() === 'admin') {
    next(); // Passe à l’étape suivante si l’utilisateur est administrateur
  } else {
    res.status(403);
    throw new Error(
      "Accès interdit : vous devez être administrateur pour accéder à cette ressource"
    );
  }
};

export { protect, admin };
