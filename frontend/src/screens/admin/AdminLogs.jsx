import React, { useState } from "react";
import {
  useGetLogsQuery,
  useGetLogAnalyticsQuery,
} from "../../slices/logApiSlice";
import { useGetUsersQuery } from "../../slices/userApiSlice"; // Import pour récupérer les utilisateurs
import formatIpAddress from "../../utils/formatIpAddress";

const AdminLogs = () => {
  const [filters, setFilters] = useState({
    user: "",
    action: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  // Récupérer les logs
  const { data: logs, error, isLoading, refetch } = useGetLogsQuery(filters);

  // Récupérer les analyses des logs
  const { data: analytics, isLoading: isAnalyticsLoading } =
    useGetLogAnalyticsQuery({
      startDate: filters.startDate,
      endDate: filters.endDate,
    });

  // Récupérer la liste des utilisateurs
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery();

  // Gestion des filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    refetch(); // Rafraîchit les données avec les nouveaux filtres
  };

  if (isLoading) {
    return <div>Chargement des logs...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement des logs.</div>;
  }

  return (
    <div className="p-4 ">
      <h1 className="text-xl font-bold mb-4">Logs</h1>

         {/* Analyses des Logs */}
         <div className="mb-5">
        
        {isAnalyticsLoading ? (
          <div>Chargement des analyses...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {analytics?.map((entry) => (
             <div
             key={entry._id}
             className={`p-4 rounded shadow border  ${
               entry._id === "Créer"
                 ? "bg-green-300 border-green-500 text-green-800"
                 : entry._id === "Modifier"
                 ? "bg-yellow-300 border-yellow-500 text-yellow-800"
                 : entry._id === "Supprimer"
                 ? "bg-red-200 border-red-500 text-red-800"
                 : entry._id === "Consulter"
                 ? "bg-blue-300 border-blue-500 text-blue-800"
                 : "bg-gray-300 border-gray-500 text-gray-800"
             }`}
           >
             <h3 className="text-sm font-semibold">{entry._id}</h3>
             <p className="text-xs font-bold">{entry.total} occurrences</p>
           </div>
           
            ))}
          </div>
        )}
      </div>

      {/* Filtres */}
      <form
        onSubmit={handleFilterSubmit}
        className="mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        <select
          name="user"
          value={filters.user}
          onChange={handleFilterChange}
          className="border border-gray-400 rounded  text-[13px]"
          disabled={isUsersLoading} // Désactive si la liste des utilisateurs est en cours de chargement
        >
          <option value="">-- Utilisateur --</option>
          {users?.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name || "Utilisateur inconnu"}
            </option>
          ))}
        </select>
        <select
          name="action"
          value={filters.action}
          onChange={handleFilterChange}
          className="border border-gray-400 rounded text-[13px]"
        >
          <option value="">-- Action --</option>
          <option value="Créer">Créer</option>
          <option value="Modifier">Modifier</option>
          <option value="Supprimer">Supprimer</option>
          <option value="Consulter">Consulter</option>
        </select>
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="border border-gray-400 rounded text-[13px]"
        >
          <option value="">-- Catégorie --</option>
          <option value="Utilisateur">Utilisateur</option>
          <option value="Inventaire">Inventaire</option>
          <option value="Rapport">Rapport</option>
          <option value="Filliale">Filliale</option>
        </select>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="border border-gray-400 rounded text-[13px]"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="border border-gray-400 rounded text-[13px]"
        />
      
      </form>

      {/* Liste des Logs */}
      <div className="mb-6">
       
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded shadow">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-4 py-2 text-left">Utilisateur</th>
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Catégorie</th>
                <th className="px-4 py-2 text-left">Objet ciblé</th>
                <th className="px-4 py-2 text-left">Adresse IP</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Détails</th>
              </tr>
            </thead>
            <tbody>
              {logs?.map((log) => (
                <tr key={log._id} className="border-b">
                  <td className="px-4 py-2 text-[13px]">
                    {log.user?.name || "Utilisateur inconnu"}
                  </td>
                  
                  <td className="px-4 py-2 text-[13px]">
  <span
    className={`px-2 py-1 rounded  text-xs font-bold w-[2rem] ${
      log.action === "Créer"
        ? "bg-green-300 text-green-800"
        : log.action === "Modifier"
        ? "bg-yellow-300 text-yellow-800"
        : log.action === "Supprimer"
        ? "bg-red-300 text-red-800"
        : log.action === "Consulter"
        ? "bg-blue-300"
        : "bg-blue-800"
    }`}
  >
    {log.action}
  </span>
</td>

                  <td className="px-4 py-2 text-[13px]">{log.category}</td>
                  <td className="px-4 py-2 text-[13px]">{log.target}</td>
                  <td className="px-4 py-2 text-[13px]">
                    {formatIpAddress(log.ipAddress)}
                  </td>
                  <td className="px-4 py-2 text-[13px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-[13px]">
                    {typeof log.details === "object"
                      ? JSON.stringify(log.details, null, 2)
                      : log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

   
    </div>
  );
};

export default AdminLogs;
