import React from "react";

const AdminInventoryDocumentation = () => {
  return (
    <div className="mx-auto p-4 bg-gray-900 text-gray-200 rounded-md shadow-md">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">
        Documentation Utilisateur - Gestion des Inventaires
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-500 mb-3">
          Introduction
        </h2>
        <p className="text-gray-300 leading-relaxed">
          Bienvenue dans la documentation utilisateur de ROBOT-NC. Cette section
          a pour but de vous guider étape par étape dans l'utilisation de la
          plateforme de gestion des inventaires. Que ce soit pour créer un
          nouvel inventaire, modifier des informations ou exporter un rapport,
          ce guide vous fournira toutes les informations nécessaires.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-500 mb-3">
          1. Création d'un Inventaire
        </h2>
        <ol className="list-decimal ml-6 text-gray-300 leading-relaxed">
          <li>
            Cliquez sur le bouton <strong>"Créer un Inventaire"</strong> dans le
            tableau de bord principal.
          </li>
          <li>
            Remplissez les champs suivants :
            <ul className="list-disc ml-6">
              <li>
                <strong>Nom</strong> : Nom unique pour identifier l'inventaire.
              </li>
              <li>
                <strong>Date de début</strong> : La date à laquelle l'inventaire
                commence.
              </li>
              <li>
                <strong>Zones</strong> : Liste des zones ou sections à inclure.
              </li>
            </ul>
          </li>
          <li>
            Cliquez sur <strong>"Valider"</strong> pour enregistrer
            l'inventaire.
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-500 mb-3">
          2. Modification d'un Inventaire
        </h2>
        <p className="text-gray-300 leading-relaxed">
          Pour modifier un inventaire existant :
        </p>
        <ol className="list-decimal ml-6 text-gray-300 leading-relaxed">
          <li>Accédez à la liste des inventaires dans le tableau de bord.</li>
          <li>
            Cliquez sur l'icône <strong>"Modifier"</strong> à droite de
            l'inventaire concerné.
          </li>
          <li>
            Mettez à jour les informations nécessaires et cliquez sur{" "}
            <strong>"Enregistrer"</strong>.
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-500 mb-3">
          3. Exportation et Génération de PDF
        </h2>
        <p className="text-gray-300 leading-relaxed">
          ROBOT-NC permet de générer un rapport PDF complet pour chaque
          inventaire. Voici comment faire :
        </p>
        <ol className="list-decimal ml-6 text-gray-300 leading-relaxed">
          <li>
            Ouvrez les détails de l'inventaire que vous souhaitez exporter.
          </li>
          <li>
            Cliquez sur le bouton <strong>"Générer PDF"</strong> en haut de la
            page.
          </li>
          <li>
            Le fichier sera automatiquement téléchargé sur votre appareil.
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-500 mb-3">
          4. Gestion des Zones
        </h2>
        <p className="text-gray-300 leading-relaxed">
          Les zones sont des sections spécifiques associées à un inventaire.
        </p>
        <ul className="list-disc ml-6 text-gray-300 leading-relaxed">
          <li>
            Pour ajouter une zone, cliquez sur{" "}
            <strong>"Ajouter une Zone"</strong>.
          </li>
          <li>
            Remplissez les informations telles que le nom, la désignation et le
            lieu.
          </li>
          <li>
            Cliquez sur <strong>"Enregistrer"</strong> pour valider.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-500 mb-3">
          5. Bonnes Pratiques
        </h2>
        <ul className="list-disc ml-6 text-gray-300 leading-relaxed">
          <li>
            Vérifiez la cohérence des informations avant d’enregistrer un
            inventaire.
          </li>
          <li>
            Archivez régulièrement les inventaires terminés pour éviter les
            doublons.
          </li>
          <li>
            Exportez les rapports PDF pour les besoins d’audit ou d’analyse.
          </li>
        </ul>
      </section>

      <footer className="mt-6 text-center text-sm text-gray-500">
        Cette documentation est destinée à un usage interne uniquement.
        Contactez l'équipe technique pour toute assistance.
      </footer>
    </div>
  );
};

export default AdminInventoryDocumentation;
