import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetReportByIdQuery,
  useAddDocumentToReportMutation,
} from '../../slices/reportApiSlice';

const AdminReportDetails = () => {
  const { id } = useParams();
  const { data: report, isLoading, isError } = useGetReportByIdQuery(id);
  const [addDocument] = useAddDocumentToReportMutation();

  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Chargement des détails du rapport...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">Erreur lors du chargement des détails du rapport.</p>
      </div>
    );

  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!documentFile) {
      alert('Veuillez sélectionner un fichier.');
      return;
    }

    const formData = new FormData();
    formData.append('document', documentFile);

    try {
      await addDocument({ id, formData }).unwrap();
      alert('Document ajouté avec succès.');
      setIsAddDocumentModalOpen(false);
      setDocumentFile(null);
    } catch (error) {
      console.error('Erreur lors de l’ajout du document :', error);
      alert('Une erreur est survenue.');
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-600">
        {report.nom}
      </h1>
      <div className="flex-1  mb-8">
          <h3 className="text-xl text-blue-400 font-semibold mb-2">Description</h3>
          <p className="text-gray-700">{report.description || 'Aucune description fournie.'}</p>
        </div>
      {/* Informations principales */}
      <div className="flex flex-wrap gap-6 mb-10">
     

        <div className="flex-1 bg-white p-2 ">
          <h3 className="text-sm font-semibold mb-2">Note</h3>
          <p className="text-gray-700">{report.note || 'Aucune note disponible.'}</p>
        </div>

        <div className="flex  flex-1 bg-white p-2 items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold mb-2">Statut</h3>
            <p
              className={`inline-block px-3 py-1 rounded ${
                report.status === 'Actif'
                  ? 'bg-green-100 text-green-800'
                  : report.status === 'Inactif'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {report.status}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Type</h3>
            <p className="text-gray-700">{report.type}</p>
          </div>
        </div>

        <div className="flex-1 bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Dernière exécution</h3>
          <p className="text-gray-700">
            {report.lastExecution
              ? new Date(report.lastExecution).toLocaleString()
              : 'Jamais exécuté'}
          </p>
        </div>

        <div className="flex-1 bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Fréquence</h3>
          <p className="text-gray-700">Type : {report.frequence?.type || 'Non spécifié'}</p>
          <p className="text-gray-700 mt-1">
            Détails : {report.frequence?.details || 'Aucun détail fourni.'}
          </p>
        </div>
      </div>

      {/* Tickets */}
      <div className="bg-white p-6 rounded shadow mb-10">
        <h3 className="text-2xl font-semibold mb-4">Tickets associés</h3>
        {report.tickets?.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Titre</th>
                <th className="border border-gray-300 px-4 py-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {report.tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td className="border border-gray-300 px-4 py-2">{ticket._id}</td>
                  <td className="border border-gray-300 px-4 py-2">{ticket.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{ticket.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-red-500 text-center">Aucun ticket associé.</p>
        )}
      </div>

      {/* Documents */}
      <button
          className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={() => setIsAddDocumentModalOpen(true)}
        >
          Ajouter un document
        </button>
      <div className=" p-4 rounded ">

        <h3 className="text-2xl font-semibold mb-4">Documents associés</h3>
        <div className="flex gap-4 justify-center">
       
        {report.documents?.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Nom</th>
                <th className="border border-gray-300 px-4 py-2">Type</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {report.documents.map((document) => (
                <tr key={document._id}>
                  <td className="border border-gray-300 px-4 py-2">{document.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{document.fileType}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <a
                      href={`/download/${document._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Télécharger
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-red-500 text-center">Aucun document associé.</p>
        )}
      </div>

      {/* Boutons d'action */}
      
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retour
        </button>
      </div>

      {/* Modal pour ajouter un document */}
      {isAddDocumentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Ajouter un document</h2>
            <form onSubmit={handleAddDocument}>
              <input
                type="file"
                onChange={(e) => setDocumentFile(e.target.files[0])}
                className="w-full px-3 py-2 border rounded mb-4"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddDocumentModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded mr-2"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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

export default AdminReportDetails;
