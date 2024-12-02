import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetMasterRepportByIdQuery,
  useAddDocumentToMasterRepportMutation,
  useDeleteDocumentFromMasterRepportMutation,
} from "../../slices/masterRepportSlice.js";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaFileUpload,
  FaTrash,
} from "react-icons/fa";

const AdminMasterRepportDetails = () => {
  const { id } = useParams();
  const {
    data: masterRepport,
    isLoading,
    error,
  } = useGetMasterRepportByIdQuery(id);
  const [addDocumentToMasterRepport] = useAddDocumentToMasterRepportMutation();
  const [deleteDocumentFromMasterRepport] =
    useDeleteDocumentFromMasterRepportMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filename, setFilename] = useState("");
  const [url, setUrl] = useState("");
  const [generatedAt, setGeneratedAt] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const handleAddDocument = async (e) => {
    e.preventDefault();
    try {
      await addDocumentToMasterRepport({
        masterRepportId: id,
        document: { filename, url, generatedAt },
      }).unwrap();
      setFilename("");
      setUrl("");
      setGeneratedAt("");
      setIsModalOpen(false);
      alert("Document ajouté avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'ajout du document :", err);
      alert("Une erreur s'est produite lors de l'ajout du document.");
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      await deleteDocumentFromMasterRepport({
        masterRepportId: id,
        documentId: docId,
      }).unwrap();
      alert("Document supprimé avec succès !");
    } catch (err) {
      console.error("Erreur lors de la suppression du document :", err);
      alert("Une erreur s'est produite lors de la suppression du document.");
    }
  };

  const filteredDocuments =
    filterDate && masterRepport?.documents
      ? masterRepport.documents.filter(
          (doc) =>
            new Date(doc.generatedAt).toLocaleDateString() ===
            new Date(filterDate).toLocaleDateString()
        )
      : masterRepport?.documents;

  if (isLoading) return <div className="loader">Chargement...</div>;
  if (error) return <p className="text-red-600">Erreur : {error.message}</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">
          Détails du Master Repport
        </h1>
        <Link
          to="/admin/rapports/master"
          className="text-sm text-blue-600 hover:underline"
        >
          Retour à la liste des master repports
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <span className="text-xs text-gray-500">Nom</span>
          <span className="block text-sm font-semibold">
            {masterRepport.nom}
          </span>
        </div>
        <div>
          <span className="text-xs text-gray-500">Note</span>
          <span className="block text-sm">
            {masterRepport.note || "Aucune note"}
          </span>
        </div>
        <div className="lg:col-span-2">
          <span className="text-xs text-gray-500">Description</span>
          <span className="block text-sm">
            {masterRepport.description || "Aucune description"}
          </span>
        </div>
        <div>
          <span className="text-xs text-gray-500">Statut</span>
          <span className="flex items-center text-sm">
            {masterRepport.status === "Actif" ? (
              <FaCheckCircle className="text-green-600 mr-2" />
            ) : (
              <FaTimesCircle className="text-red-600 mr-2" />
            )}
            {masterRepport.status}
          </span>
        </div>
        <div>
          <span className="text-xs text-gray-500">Type</span>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              masterRepport.type === "master"
                ? "bg-green-200 text-green-800"
                : "bg-blue-200 text-blue-800"
            }`}
          >
            {masterRepport.type}
          </span>
        </div>
      </div>

      {/* Documents */}
      <div className="mt-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">
          Documents associés
        </h2>
        {/* Filtre par date */}
        <div className="mt-4 flex items-center gap-4">
          <label className="text-xs text-gray-700">Filtrer par date :</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-48 border px-2 py-1 rounded-lg text-sm"
          />
        </div>
        {filteredDocuments && filteredDocuments.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-2 py-1 text-left">
                  Nom
                </th>
                <th className="border border-gray-300 px-2 py-1 text-left">
                  URL
                </th>
                <th className="border border-gray-300 px-2 py-1 text-left">
                  Date
                </th>
                <th className="border border-gray-300 px-2 py-1 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.url}>
                  <td className="border border-gray-300 px-2 py-1">
                    {doc.filename}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Télécharger
                    </a>
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {new Date(doc.generatedAt).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <button
                      onClick={() => handleDeleteDocument(doc._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 mt-2">Aucun document trouvé</p>
        )}
      </div>

      {/* Bouton pour ajouter un document */}
      <div className="mt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
        >
          <FaFileUpload className="inline-block mr-2" />
          Ajouter un document
        </button>
      </div>

      {/* Modal pour ajouter un document */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-96">
            <h2 className="text-sm font-semibold mb-4">Ajouter un document</h2>
            <form onSubmit={handleAddDocument} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-700">
                  Nom du fichier
                </label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full border rounded-lg px-2 py-1 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700">
                  URL du fichier
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full border rounded-lg px-2 py-1 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700">
                  Date de génération
                </label>
                <input
                  type="date"
                  value={generatedAt}
                  onChange={(e) => setGeneratedAt(e.target.value)}
                  className="w-full border rounded-lg px-2 py-1 text-sm"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMasterRepportDetails;
