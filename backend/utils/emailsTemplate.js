// utils/emailTemplate.js
export const welcomeEmailTemplate = (name, email, password) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue sur ROBOT NC</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9; /* Couleur de fond gris clair */
      color: #333;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #f4a100; /* Couleur jaune foncé */
      font-size: 24px;
      text-align: center;
    }
    p {
      margin: 20px 0;
      font-size: 16px;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    ul li {
      font-size: 16px;
      margin-bottom: 10px;
    }
    ul li strong {
      color: #f4a100;
    }
    .cta {
      display: inline-block;
      background-color: #f4a100;
      color: #fff;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 16px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
    .cta:hover {
      background-color: #d48b00;
    }
    .footer {
      font-size: 0.8em;
      color: #999;
      text-align: center;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Bienvenue sur ROBOT NC, ${name} !</h1>
    <p>Nous sommes ravis de vous accueillir parmi nos utilisateurs. Votre compte a été créé avec succès.</p>
    <p>Voici vos informations de connexion :</p>
    <ul>
      <li><strong>Email :</strong> ${email}</li>
      <li><strong>Mot de passe :</strong> ${password}</li>
    </ul>
    <p>
      Nous vous recommandons vivement de changer votre mot de passe depuis les paramètres de votre compte pour renforcer la sécurité.
    </p>
    <p>
      Accédez dès maintenant à l'application via le lien ci-dessous :
    </p>
    <p style="text-align: center;">
      <a href="https://www.robot-nc.com" class="cta">Accéder à ROBOT NC</a>
    </p>
    <p>Si vous avez des questions ou besoin d'assistance, notre équipe est à votre disposition pour vous aider.</p>
    <p>Cordialement,<br>L'équipe Support de ROBOT NC</p>
    <div class="footer">
      <p>Vous recevez cet email car vous vous êtes inscrit sur ROBOT NC.</p>
      <p>&copy; 2024 ROBOT NC. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>
`;


export const resetPasswordTemplate = (resetUrl) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation du mot de passe</title>
  <style>
    /* Similar styles as above */
  </style>
</head>
<body>
  <div class="container">
    <h1>Demande de réinitialisation du mot de passe</h1>
    <p>Vous (ou une autre personne) avez demandé la réinitialisation de votre mot de passe. Pour procéder, veuillez cliquer sur le lien suivant :</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
    <div class="footer">
      <p>Merci de ne pas répondre à cet email.</p>
    </div>
  </div>
</body>
</html>
`;
