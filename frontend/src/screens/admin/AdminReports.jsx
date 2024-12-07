import React, { useState } from 'react';
import {
  useGetReportsQuery,
  useCreateReportMutation,
  useDeleteReportMutation,
} from '../../slices/reportApiSlice';
import { useGetUsersQuery } from '../../slices/userApiSlice'; // Hook pour récupérer les utilisateurs
import { useNavigate } from 'react-router-dom';
import { Eye, PlusCircle, Trash } from 'lucide-react';
import { Search } from "lucide-react";

const AdminReports = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [newReportData, setNewReportData] = useState({
    nom: '',
    description: '',
    note: '',
    status: 'Actif',
    type: 'Access',
    category: 'Codeve',
    maintainedBy: '',
    frequence: { type: 'Mensuel', details: '' },
  });

  // Récupération des données depuis les slices
  const { data: reports, isLoading, isError } = useGetReportsQuery();
  const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery();
  const [createReport, { isLoading: isCreating }] = useCreateReportMutation();
  const [deleteReport] = useDeleteReportMutation();
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewReportData({
      nom: '',
      description: '',
      note: '',
      status: 'Actif',
      type: 'Access',
      category: 'Codeve',
      maintainedBy: '',
      frequence: { type: 'Mensuel', details: '' },
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

  const handleDeleteReport = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce rapport ?')) {
      try {
        await deleteReport(id).unwrap();
        alert('Rapport supprimé avec succès.');
      } catch (error) {
        console.error('Erreur lors de la suppression du rapport :', error);
      }
    }
  };

  const filteredReports = reports?.filter((report) => {
    return (
      report.nom.toLowerCase().includes(filter.toLowerCase()) &&
      (typeFilter ? report.type === typeFilter : true) &&
      (categoryFilter ? report.category === categoryFilter : true)
    );
  });

  if (isLoading || isLoadingUsers) return <p>Chargement...</p>;
  if (isError) return <p>Erreur lors du chargement des rapports.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Rapports</h1>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center text-[13px]"
        >
          <PlusCircle className="mr-2" /> Ajouter un rapport
        </button>
        <div className="relative">
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
        <Search className="w-5 h-5" />
      </span>
      <input
        type="text"
        placeholder="Rechercher par nom"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="pl-10 pr-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-4 mb-4 text-[13px]">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">Tous les types</option>
          <option value="Access">Access</option>
          <option value="Script">Script</option>
          <option value="Python">Python</option>
          <option value="Excel">Excel</option>
          <option value="PowerBI">PowerBI</option>
          <option value="Autre">Autre</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">Toutes les catégories</option>
          <option value="Codeve">Codeve</option>
          <option value="Global">Global</option>
          <option value="Master">Master</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      {/* Tableau des rapports */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200 text-[13px]">
          <thead>
            <tr className="bg-blue-300 text-blue-900">
              <th className="border border-gray-300 px-4 py-2">Nom</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Statut</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Catégorie</th>
              <th className="border border-gray-300 px-4 py-2">Maintenu par</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports?.length > 0 ? (
              filteredReports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{report.nom}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {report.description || '-'}
                  </td>


  

                  <td className="border border-gray-300 px-4 py-2">
  {report.status === "Actif" ? (
    <span className="flex items-center text-green-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
      Actif
    </span>
  ) : (
    <span className="flex items-center text-red-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      Inactif
    </span>
  )}
</td>



<td className="border border-gray-300 px-4 py-2">
  <span
    className={`px-2 py-1 text-xs font-bold rounded ${
      report.type === "Access"
        ? "bg-red-100 text-red-700 "
        : report.type === "Script"
        ? "bg-yellow-100 text-yellow-700"
        : report.type === "Python"
        ? "bg-green-100 text-green-700"
        : report.type === "Excel"
        ? "bg-purple-100 text-purple-700"
        : report.type === "PowerBI"
        ? "bg-red-100 text-yellow-700"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    {report.type}
  </span>
</td>

<td className="border border-gray-300 px-4 py-2">
  <span
    className={`px-2 py-1 text-xs font-bold rounded ${
      report.category === "Codeve"
        ? "bg-indigo-100 text-indigo-700"
        : report.category === "Global"
        ? "bg-teal-100 text-teal-700"
        : report.category === "Master"
        ? "bg-orange-100 text-orange-700"
        : report.category === "Autre"
        ? "bg-blue-100 text-blue-700"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    {report.category}
  </span>
</td>

                  <td className="border border-gray-300 px-4 py-2">
                    {report.maintainedBy?.name || 'Non attribué'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/reports/${report._id}`)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <Eye/>
                    </button>
                    <button
                      onClick={() => handleDeleteReport(report._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <Trash/>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center border border-gray-300 px-4 py-2 text-red-400"
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
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Catégorie</label>
                <select
                  value={newReportData.category}
                  onChange={(e) =>
                    setNewReportData({ ...newReportData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Codeve">Codeve</option>
                  <option value="Global">Global</option>
                  <option value="Master">Master</option>
                  <option value="Autre">Autre</option>
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
              <div className="mb-4">
                <label className="block font-semibold mb-2">Maintenu par</label>
                <select
                  value={newReportData.maintainedBy}
                  onChange={(e) =>
                    setNewReportData({ ...newReportData, maintainedBy: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">-- Sélectionner --</option>
                  {users?.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Fréquence</label>
                <select
                  value={newReportData.frequence.type}
                  onChange={(e) =>
                    setNewReportData({
                      ...newReportData,
                      frequence: { ...newReportData.frequence, type: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Journalier">Journalier</option>
                  <option value="Hebdomadaire">Hebdomadaire</option>
                  <option value="Mensuel">Mensuel</option>
                  <option value="Bi-Mensuel">Bi-Mensuel</option>
                  <option value="Trimestriel">Trimestriel</option>
                  <option value="Annuel">Annuel</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Détails de la fréquence</label>
                <textarea
                  value={newReportData.frequence.details}
                  onChange={(e) =>
                    setNewReportData({
                      ...newReportData,
                      frequence: { ...newReportData.frequence, details: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                  rows="2"
                />
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
