import React, { useState } from 'react';
import { useGetReportsQuery, useCreateReportMutation } from '../../slices/reportApiSlice';
import { useNavigate } from 'react-router-dom'; // Utilisé pour rediriger vers la page des détails

const AdminReports = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState(''); // État pour le filtre
  const [newReportData, setNewReportData] = useState({
    nom: '',
    description: '',
    note: '',
    status: 'Actif',
    type: 'Access',
  });

  const { data: reports, isLoading, isError } = useGetReportsQuery();
  const [createReport, { isLoading: isCreating }] = useCreateReportMutation();
  const navigate = useNavigate(); // Hook pour la navigation

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewReportData({
      nom: '',
      description: '',
      note: '',
      status: 'Actif',
      type: 'Access',
    });
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    try {
      await createReport(newReportData).unwrap();
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la création du rapport :', error);
    }
  };

  const filteredReports = reports?.filter((report) =>
    report.nom.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading) return <p>Chargement des rapports...</p>;
  if (isError) return <p>Erreur lors du chargement des rapports.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rapports</h1>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
      >
        Ajouter un rapport
      </button>

      {/* Champ de recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-4"
      />

      {/* Tableau des rapports */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Nom</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Statut</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports?.length > 0 ? (
              filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-100">
                  <td
                    className="border border-gray-300 px-4 py-2 text-blue-500 cursor-pointer"
                    onClick={() => navigate(`/admin/reports/${report._id}`)}
                  >
                    {report.nom}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {report.description || '-'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {report.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {report.type}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center border border-gray-300 px-4 py-2"
                >
                  Aucun rapport trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal pour ajouter un rapport */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Nouveau Rapport</h2>
            <form onSubmit={handleCreateReport}>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Nom</label>
                <input
                  type="text"
                  value={newReportData.nom}
                  onChange={(e) =>
                    setNewReportData({ ...newReportData, nom: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Description</label>
                <textarea
                  value={newReportData.description}
                  onChange={(e) =>
                    setNewReportData({ ...newReportData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                  rows="4"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Note</label>
                <textarea
                  value={newReportData.note}
                  onChange={(e) =>
                    setNewReportData({ ...newReportData, note: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                  rows="2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Statut</label>
                <select
                  value={newReportData.status}
                  onChange={(e) =>
                    setNewReportData({ ...newReportData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                  <option value="En Maintenance">En Maintenance</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Type</label>
                <select
                  value={newReportData.type}
                  onChange={(e) =>
                    setNewReportData({ ...newReportData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Access">Access</option>
                  <option value="Script">Script</option>
                  <option value="Python">Python</option>
                  <option value="Excel">Excel</option>
                  <option value="PowerBI">PowerBI</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-black rounded mr-2"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  {isCreating ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
