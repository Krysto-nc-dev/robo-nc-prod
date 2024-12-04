import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetRepportGeneratorsQuery,
  useCreateRepportGeneratorMutation,
  useDeleteRepportGeneratorMutation,
  useUpdateRepportGeneratorMutation,
} from "../../slices/repportGeneratorsApiSlice";
import { useGetUsersQuery } from "../../slices/userApiSlice";

const AdminGenerator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    note: "",
    path: "",
    version: "1.0.0",
    status: "Actif",
    multisociete: false,
    type: "Access",
    maintainedBy: "",
  });

  // Récupérer les générateurs existants
  const {
    data: generators,
    isLoading: isLoadingGenerators,
    error,
  } = useGetRepportGeneratorsQuery();

  // Hook pour créer un générateur
  const [createRepportGenerator, { isLoading }] =
    useCreateRepportGeneratorMutation();

  // Hook pour supprimer un générateur
  const [deleteRepportGenerator] = useDeleteRepportGeneratorMutation();

  // Hook pour mettre à jour un générateur
  const [updateRepportGenerator] = useUpdateRepportGeneratorMutation();

  // Récupérer les utilisateurs pour le champ `maintainedBy`
  const { data: users } = useGetUsersQuery();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "multisociete" ? e.target.checked : value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRepportGenerator(formData).unwrap();
      alert("Générateur ajouté avec succès !");
      setIsModalOpen(false);
      setFormData({
        nom: "",
        description: "",
        note: "",
        path: "",
        version: "1.0.0",
        status: "Actif",
        multisociete: false,
        type: "Access",
        maintainedBy: "",
      });
    } catch (error) {
      console.error("Erreur lors de la création du générateur :", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce générateur ?")) {
      try {
        await deleteRepportGenerator(id).unwrap();
        alert("Générateur supprimé avec succès !");
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        alert("Une erreur est survenue lors de la suppression.");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateRepportGenerator({ id, status: newStatus }).unwrap();
      alert(`Statut mis à jour en "${newStatus}"`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
  };

  // Filtrer les générateurs par le terme recherché
  const filteredGenerators = generators?.filter((generator) =>
    generator.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Gestion des Générateurs de Rapport</h1>

      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Rechercher un générateur par nom..."
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      {/* Bouton pour ouvrir la modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Ajouter un Générateur
      </button>

      {/* Liste des générateurs */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Générateurs existants</h2>
        {isLoadingGenerators ? (
          <div>Chargement des générateurs...</div>
        ) : error ? (
          <div className="text-red-600">Erreur lors du chargement des générateurs.</div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded shadow">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-4 py-2 text-left">Nom</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2 text-left">Version</th>
                <th className="px-4 py-2 text-left">Multi-société</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGenerators?.map((generator) => (
                <tr key={generator._id} className="border-b">
                  <td className="px-4 py-2">
                    <Link
                      to={`/admin/generator/${generator._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {generator.nom}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{generator.type}</td>
                  <td className="px-4 py-2">{generator.status}</td>
                  <td className="px-4 py-2">{generator.version}</td>
                  <td className="px-4 py-2">
                    {generator.multisociete ? "Oui" : "Non"}
                  </td>
                  <td className="px-4 py-2 flex gap-2 items-center">
                    <button
                      onClick={() => handleDelete(generator._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                    <select
                      value={generator.status}
                      onChange={(e) => handleStatusChange(generator._id, e.target.value)}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                      <option value="En Maintenance">En Maintenance</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-lg font-bold mb-4">Ajouter un Générateur</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Note</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Chemin (Path)
                </label>
                <input
                  type="text"
                  name="path"
                  value={formData.path}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600">Version</label>
                  <input
                    type="text"
                    name="version"
                    value={formData.version}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600">Statut</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded"
                  >
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                    <option value="En Maintenance">En Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded"
                  >
                    <option value="Access">Access</option>
                    <option value="Script">Script</option>
                    <option value="Python">Python</option>
                    <option value="Excel">Excel</option>
                    <option value="PowerBI">PowerBI</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="multisociete"
                    checked={formData.multisociete}
                    onChange={handleInputChange}
                  />
                  <label className="text-sm font-medium text-gray-600">Multi-société</label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Maintenance assignée à
                </label>
                <select
                  name="maintainedBy"
                  value={formData.maintainedBy}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="">-- Sélectionnez un utilisateur --</option>
                  {users?.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Ajout en cours..." : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGenerator;
