// import jwt from 'jsonwebtoken'

// const generateToken = (res, userId) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   })
//   // Set JWT as HTTP-only cookie
//   res.cookie('token', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV !== 'development',
//     sameSite: 'strict',
//     maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
//   })
// }

// export default generateToken









import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  // Génération du token JWT avec expiration de 30 jours
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Configurer le cookie JWT
  res.cookie('token', token, {
    httpOnly: true,  // Empêche le JavaScript côté client d'accéder au cookie, pour plus de sécurité
    secure: process.env.NODE_ENV === 'production', // Assure que le cookie n'est envoyé qu'en HTTPS en production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' en production pour permettre les requêtes CORS avec cookies, 'lax' en développement
    maxAge: 30 * 24 * 60 * 60 * 1000, // Expiration de 30 jours (en millisecondes)
    domain: process.env.NODE_ENV === 'production' ? '.krysto.io' : 'localhost', // Configurer le domaine en production
  });
};

export default generateToken;







// import jwt from 'jsonwebtoken';

// const generateToken = (res, userId) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   });

//   // Configurer le cookie JWT
//   res.cookie('token', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production', // Activer HTTPS uniquement en production
//     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' en production pour CORS, 'lax' en développement
//     maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
//   });
// };

// export default generateToken;
