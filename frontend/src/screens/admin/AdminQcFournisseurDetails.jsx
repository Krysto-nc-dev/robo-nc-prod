import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetFournisseurByIdQuery } from "../../slices/qcFournisseurApiSlice";
import { useGetArticlesByFournisseurQuery } from "../../slices/qcArticleApiSlice";
import { Loader } from "lucide-react";

const AdminQcFournisseurDetails = () => {
  const { id } = useParams(); // `id` correspond au champ `FOURN`

  // Récupérer les détails du fournisseur via RTK Query
  const {
    data: fournisseur,
    isLoading: fournisseurLoading,
    error: fournisseurError,
  } = useGetFournisseurByIdQuery(id);

  // Récupérer les articles du fournisseur via le champ `FOURN`
  const {
    data: articles,
    isLoading: articlesLoading,
    error: articlesError,
  } = useGetArticlesByFournisseurQuery(parseInt(id, 10)); // Convertir `id` en entier

  // Gestion du chargement
  if (fournisseurLoading || articlesLoading) {
    return (
      <div className="text-center mt-8">
        <Loader />
      </div>
    );
  }

  // Gestion des erreurs
  if (fournisseurError) {
    return (
      <div className="text-center text-red-600 mt-8">
        Erreur lors du chargement des détails du fournisseur :{" "}
        {fournisseurError.message}
      </div>
    );
  }

  if (articlesError) {
    console.error("Erreur lors du chargement des articles :", articlesError);
  }

  // Construire l'adresse complète
  const fullAddress = [
    fournisseur.AD1,
    fournisseur.AD2,
    fournisseur.AD3,
    fournisseur.AD4,
  ]
    .filter(Boolean) // Supprime les champs vides ou `undefined`
    .join(", ");

  return (
    <div className="p-4 mx-auto">
      {/* Titre */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Détails du Fournisseur
        </h1>
        <Link
          to="/admin/QC-fournisseurs"
          className="text-blue-600 hover:underline"
        >
          Retour à la liste
        </Link>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold text-gray-600">Nom</h2>
          <p className="text-gray-800">{fournisseur.NOM || "Non spécifié"}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold text-gray-600">Téléphone</h2>
          <p className="text-gray-800">{fournisseur.TEL || "Non spécifié"}</p>
        </div>
      </div>

      {/* Adresse complète */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="font-semibold text-gray-600">Adresse complète</h2>
        <p className="text-gray-800">{fullAddress || "Non spécifiée"}</p>
      </div>

      {/* Informations supplémentaires */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold text-gray-600">Fax</h2>
          <p className="text-gray-800">{fournisseur.FAX || "Non spécifié"}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold text-gray-600">Observations</h2>
          <p className="text-gray-800">
            {fournisseur.OBSERV || "Non spécifiées"}
          </p>
        </div>
      </div>

      {/* Liste des articles du fournisseur */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Articles du fournisseur
        </h2>
        {articles?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <div
                key={article.NART}
                className="p-4 bg-white shadow-md rounded-lg"
              >
                <h3 className="text-gray-800 font-semibold">
                  {article.DESIGN}
                </h3>
                <p className="text-gray-600">NART : {article.NART}</p>
                <p className="text-gray-600">
                  Stock : {article.STOCK || "Non spécifié"}
                </p>
                <p className="text-gray-600">
                  Prix :{" "}
                  {article.PREV ? `${article.PREV.toFixed(2)} XPF` : "N/A"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            Aucun article disponible pour ce fournisseur.
          </p>
        )}
      </div>

      {/* Bouton d'action */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => alert("Fonctionnalité à implémenter")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Modifier
        </button>
      </div>
    </div>
  );
};

export default AdminQcFournisseurDetails;
