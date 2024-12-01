import React from "react";

const AdminInventoryDocumentation = () => {
  return (
    <div className="mx-auto p-6 bg-white text-gray-700 rounded-lg shadow-lg ">
      <h1 className="text-2xl font-bold text-blue-600 mb-8 text-center">
        Documentation Utilisateur - Gestion des Inventaires
      </h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          Introduction
        </h2>
        <p className="leading-relaxed">
          Bienvenue dans la documentation utilisateur de ROBOT-NC. Ce guide a
          pour objectif de vous accompagner dans l’utilisation de la plateforme
          de gestion des inventaires. Apprenez à créer de nouveaux inventaires,
          gérer vos données et exporter des informations essentielles en toute
          simplicité.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          1. Création d'un Inventaire par Importation CSV
        </h2>
        <ol className="list-decimal ml-8 leading-relaxed space-y-3">
          <li>
            Cliquez sur le bouton{" "}
            <strong className="text-blue-600">"Créer un Inventaire"</strong> sur
            le tableau de bord principal.
          </li>
          <li>
            Sélectionnez un fichier CSV contenant les informations des zones.
            Assurez-vous que le fichier respecte le format requis. Vous pouvez
            télécharger un exemple en cliquant ci-dessous :
            <br />
            <a
              href="/exemple_zones.csv"
              download
              className="text-blue-600 underline mt-2 inline-block"
            >
              Télécharger l'exemple de fichier CSV
            </a>
          </li>
          <li>
            Cliquez sur le bouton{" "}
            <strong className="text-blue-600">"Importer Zones"</strong>.
          </li>
          <li>
            Une confirmation apparaîtra indiquant que l'importation est réussie.
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          2. Modification d'un Inventaire
        </h2>
        <p className="leading-relaxed">
          Pour modifier un inventaire existant :
        </p>
        <ol className="list-decimal ml-8 leading-relaxed space-y-3">
          <li>Accédez à la liste des inventaires.</li>
          <li>
            Cliquez sur l’icône{" "}
            <strong className="text-blue-600">"Modifier"</strong>.
          </li>
          <li>
            Apportez les modifications nécessaires et cliquez sur{" "}
            <strong className="text-blue-600">"Enregistrer"</strong>.
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          3. Exportation de Fiches de Zones (PDF)
        </h2>
        <p className="leading-relaxed">
          Générer des fiches PDF pour vos zones est simple :
        </p>
        <ol className="list-decimal ml-8 leading-relaxed space-y-3">
          <li>
            Accédez aux détails de l'inventaire contenant les zones souhaitées.
          </li>
          <li>
            Cliquez sur le bouton{" "}
            <strong className="text-blue-600">"Générer PDF"</strong>.
          </li>
          <li>
            Le fichier sera téléchargé automatiquement sur votre appareil.
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          4. Gestion des Zones
        </h2>
        <ul className="list-disc ml-8 leading-relaxed space-y-3">
          <li>
            Pour ajouter une zone, cliquez sur{" "}
            <strong className="text-blue-600">"Ajouter une Zone"</strong>.
          </li>
          <li>Renseignez les informations nécessaires : nom, lieu, etc.</li>
          <li>
            Cliquez sur <strong className="text-blue-600">"Enregistrer"</strong>{" "}
            pour valider.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          5. Bonnes Pratiques
        </h2>
        <ul className="list-disc ml-8 leading-relaxed space-y-3">
          <li>
            Assurez-vous que les informations des inventaires sont complètes et
            cohérentes avant validation.
          </li>
          <li>
            Exportez régulièrement des fiches PDF pour les besoins d’audit.
          </li>
          <li>
            Archivez les inventaires terminés pour maintenir une interface
            claire.
          </li>
        </ul>
      </section>

      <footer className="mt-8 text-center text-sm text-gray-500">
        Cette documentation est destinée à un usage interne. Pour toute
        assistance, veuillez contacter l'équipe technique.
      </footer>
    </div>
  );
};

export default AdminInventoryDocumentation;
