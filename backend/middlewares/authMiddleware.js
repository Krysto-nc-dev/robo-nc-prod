import jwt from 'jsonwebtoken';
import asyncHandler from './async.js';
import User from '../models/userModel.js';

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  console.log('Cookies reçus dans la requête:', req.cookies);

  let token;

  // Vérifiez si le token existe dans les cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    throw new Error('Non autorisé, aucun token trouvé');
  }

  try {
    // Décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifiez et assignez l'utilisateur au `req` pour les routes protégées
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      res.status(401);
      throw new Error('Utilisateur introuvable, accès non autorisé');
    }

    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    res.status(401);
    throw new Error('Token non valide ou expiré');
  }
});

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.toLowerCase() === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error(
      "Vous devez être administrateur pour accéder à cette ressource"
    );
  }
};

export { protect, admin };
