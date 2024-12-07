import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetFournisseurByIdQuery } from "../../slices/qcFournisseurApiSlice";
import { Loader } from "lucide-react";

const AdminQcFournisseurDetails = () => {
  const { id } = useParams();

  // Récupérer les détails du fournisseur via RTK Query
  const {
    data: fournisseur,
    isLoading,
    error,
  } = useGetFournisseurByIdQuery(id);

  if (isLoading) {
    return (
      <div className="text-center mt-8">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-8">
        Erreur lors du chargement des détails : {error.message}
      </div>
    );
  }

  // Combiner l'adresse complète
  const fullAddress = [
    fournisseur.AD1,
    fournisseur.AD2,
    fournisseur.AD3,
    fournisseur.AD4,
  ]
    .filter(Boolean) // Supprimer les champs vides ou `undefined`
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
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold text-gray-600">Franco</h2>
          <p className="text-gray-800">
            {fournisseur.FRANCO || "Non spécifié"}
          </p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold text-gray-600">Local</h2>
          <p className="text-gray-800">{fournisseur.LOCAL || "Non spécifié"}</p>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Notes</h2>
        <div className="grid grid-cols-2 gap-6">
          {[...Array(10)].map((_, index) => {
            const noteField = fournisseur[`NOT${index + 1}`];
            return (
              <div key={index} className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold text-gray-600">
                  Note {index + 1}
                </h3>
                <p className="text-gray-800">{noteField || "Non spécifiée"}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Entêtes */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Entêtes</h2>
        <div className="grid grid-cols-3 gap-6">
          {["ENT1", "ENT2", "ENT3"].map((field) => (
            <div key={field} className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold text-gray-600">{field}</h3>
              <p className="text-gray-800">
                {fournisseur[field] || "Non spécifié"}
              </p>
            </div>
          ))}
        </div>
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
