// utils/emailTemplate.js

export const welcomeEmailTemplate = (name, lastname) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue sur Krysto.io</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
      color: #333;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background-color: #ffffff;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    h1 {
      color: #5e72e4;
    }
    p {
      margin-bottom: 20px;
    }
    .footer {
      font-size: 0.8em;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Bienvenue, ${name} ${lastname} !</h1>
    <p>Merci de nous rejoindre sur Krysto.io. Nous sommes ravis de vous accueillir.</p>
    <p>Si vous avez des questions ou besoin d'assistance, n'hésitez pas à nous contacter.</p>
    <p>À bientôt !</p>
    <p>Cordialement,<br>L'équipe Krysto.io</p>
    <div class="footer">
      <p>Vous recevez cet email car vous vous êtes inscrit sur Krysto.io.</p>
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
