import React from "react";

const AdminInventoryDocumentation = () => {
  return (
    <div className="mx-auto p-6 bg-gray-900 text-gray-200 rounded-lg shadow-lg max-w-5xl">
      <h1 className="text-3xl font-bold text-blue-400 mb-8 text-center">
        Documentation Utilisateur - Gestion des Inventaires
      </h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-500 mb-4">
          Introduction
        </h2>
        <p className="text-gray-300 leading-relaxed">
          Bienvenue dans la documentation utilisateur de ROBOT-NC. Cette section
          a pour but de vous guider étape par étape dans l'utilisation de la
          plateforme de gestion des inventaires. Que ce soit pour créer un
          nouvel inventaire en important des zones via un fichier CSV, modifier
          des informations ou exporter des fiches de zones, ce guide vous
          fournira toutes les informations nécessaires.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-500 mb-4">
          1. Création d'un Inventaire par Importation CSV
        </h2>
        <ol className="list-decimal ml-8 text-gray-300 leading-relaxed space-y-2">
          <li>
            Cliquez sur le bouton{" "}
            <strong className="text-blue-400">"Créer un Inventaire"</strong>{" "}
            dans le tableau de bord principal.
          </li>
          <li>
            Sélectionnez un fichier CSV contenant les informations sur les zones
            que vous souhaitez importer. Assurez-vous que le fichier est au
            format correct. Vous pouvez télécharger un exemple de fichier CSV en
            cliquant sur le lien ci-dessous :
            <br />
            <a
              href="/exemple_zones.csv"
              download
              className="text-blue-400 underline mt-2 inline-block"
            >
              Télécharger l'exemple de fichier CSV
            </a>
            <br />
            <strong>Format du fichier CSV :</strong>
            <ul className="list-disc ml-6 mt-2">
              <li>
                <code>nom_zone</code> : Nom unique de la zone.
              </li>
              <li>
                <code>designation</code> : Désignation de la zone.
              </li>
              <li>
                <code>lieu</code> : Lieu physique de la zone.
              </li>
              <li>
                <code>superficie</code> : Superficie de la zone en m².
              </li>
              <li>
                <code>description</code> : Description additionnelle
                (facultatif).
              </li>
            </ul>
          </li>
          <li>
            Cliquez sur le bouton{" "}
            <strong className="text-blue-400">"Importer Zones"</strong> pour
            créer l'inventaire avec les zones spécifiées dans le fichier.
          </li>
          <li>
            Attendez la confirmation que l'importation a été réussie. Vous
            verrez alors un message indiquant que les zones ont été importées
            avec succès et que l'inventaire a été créé.
          </li>
          <li>
            Une fois l'inventaire créé, il apparaîtra dans la liste des
            inventaires disponibles.
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-500 mb-4">
          2. Modification d'un Inventaire
        </h2>
        <p className="text-gray-300 leading-relaxed">
          Pour modifier un inventaire existant :
        </p>
        <ol className="list-decimal ml-8 text-gray-300 leading-relaxed space-y-2">
          <li>Accédez à la liste des inventaires dans le tableau de bord.</li>
          <li>
            Cliquez sur l'icône{" "}
            <strong className="text-blue-400">"Modifier"</strong> à droite de
            l'inventaire concerné.
          </li>
          <li>
            Mettez à jour les informations nécessaires et cliquez sur{" "}
            <strong className="text-blue-400">"Enregistrer"</strong>.
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-500 mb-4">
          3. Exportation et Génération de Fiches de Zones (PDF)
        </h2>
        <p className="text-gray-300 leading-relaxed">
          ROBOT-NC permet de générer des fiches de zones au format PDF pour
          chaque inventaire. Ces fiches peuvent être affichées dans la zone
          physique correspondante. Voici comment faire :
        </p>
        <ol className="list-decimal ml-8 text-gray-300 leading-relaxed space-y-2">
          <li>
            Ouvrez les détails de l'inventaire pour lequel vous souhaitez
            générer des fiches de zones.
          </li>
          <li>
            Cliquez sur le bouton{" "}
            <strong className="text-blue-400">"Générer PDF"</strong> en haut de
            la page.
          </li>
          <li>
            Les fiches de zones seront automatiquement téléchargées sur votre
            appareil et pourront être affichées dans les zones physiques
            concernées.
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-500 mb-4">
          4. Gestion des Zones
        </h2>
        <p className="text-gray-300 leading-relaxed">
          Les zones sont des sections spécifiques associées à un inventaire.
        </p>
        <ul className="list-disc ml-8 text-gray-300 leading-relaxed space-y-2">
          <li>
            Pour ajouter une zone, cliquez sur{" "}
            <strong className="text-blue-400">"Ajouter une Zone"</strong>.
          </li>
          <li>
            Remplissez les informations telles que le nom, la désignation et le
            lieu.
          </li>
          <li>
            Cliquez sur <strong className="text-blue-400">"Enregistrer"</strong>{" "}
            pour valider.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-500 mb-4">
          5. Bonnes Pratiques
        </h2>
        <ul className="list-disc ml-8 text-gray-300 leading-relaxed space-y-2">
          <li>
            Vérifiez la cohérence des informations avant d’enregistrer un
            inventaire.
          </li>
          <li>
            Archivez régulièrement les inventaires terminés pour éviter les
            doublons.
          </li>
          <li>
            Exportez les fiches de zones en PDF pour les afficher dans les zones
            physiques ou pour les besoins d’audit.
          </li>
        </ul>
      </section>

      <footer className="mt-8 text-center text-sm text-gray-500">
        Cette documentation est destinée à un usage interne uniquement.
        Contactez l'équipe technique pour toute assistance.
      </footer>
    </div>
  );
};

export default AdminInventoryDocumentation;
