import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetReportByIdQuery } from '../../slices/reportApiSlice';

const AdminReportDetails = () => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const { data: report, isLoading, isError } = useGetReportByIdQuery(id);

  if (isLoading) return <p>Chargement des détails du rapport...</p>;
  if (isError) return <p>Erreur lors du chargement des détails du rapport.</p>;

  return (
    <div className="p-4  mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">{report.nom}</h1>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold">Description</h3>
          <p className="text-gray-700">{report.description || 'Aucune description fournie.'}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Note</h3>
          <p className="text-gray-700">{report.note || 'Aucune note disponible.'}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Statut</h3>
          <p
            className={`px-3 py-1 inline-block rounded ${
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
          <h3 className="text-lg font-semibold">Type</h3>
          <p className="text-gray-700">{report.type}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Dernière exécution</h3>
          <p className="text-gray-700">
            {report.lastExecution ? new Date(report.lastExecution).toLocaleString() : 'Jamais exécuté'}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Créé le</h3>
          <p className="text-gray-700">{new Date(report.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Section des tickets */}
      {report.tickets?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Tickets associés</h3>
          <ul className="list-disc list-inside text-gray-700">
            {report.tickets.map((ticket) => (
              <li key={ticket} className="hover:text-blue-500 cursor-pointer">
                Ticket ID : {ticket}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section des documents */}
      {report.documents?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Documents associés</h3>
          <ul className="list-disc list-inside text-gray-700">
            {report.documents.map((document) => (
              <li key={document} className="hover:text-blue-500 cursor-pointer">
                Document ID : {document}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bouton retour */}
      <div className="text-center">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retour
        </button>
      </div>
    </div>
  );
};

export default AdminReportDetails;
