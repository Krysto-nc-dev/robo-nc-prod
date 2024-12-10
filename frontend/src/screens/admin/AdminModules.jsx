import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetModulesQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
} from "../../slices/moduleApiSlice.js";
import { Edit, PlusCircle, Trash } from "lucide-react";

const AdminModules = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    categorie: "Autre",
    image: "",
    documentation: "",
    telechargement: "",
    estActif: false,
  });

  // Fetch modules
  const {
    data: modules,
    isLoading: isLoadingModules,
    error,
  } = useGetModulesQuery();

  // Create module mutation
  const [createModule, { isLoading }] = useCreateModuleMutation();

  // Update module mutation
  const [updateModule] = useUpdateModuleMutation();

  // Delete module mutation
  const [deleteModule] = useDeleteModuleMutation();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createModule(formData).unwrap();
      alert("Module ajouté avec succès !");
      setIsModalOpen(false);
      setFormData({
        titre: "",
        description: "",
        categorie: "Autre",
        image: "",
        documentation: "",
        telechargement: "",
        estActif: false,
      });
    } catch (error) {
      console.error("Erreur lors de la création du module :", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce module ?")) {
      try {
        await deleteModule(id).unwrap();
        alert("Module supprimé avec succès !");
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  // Filtrer les modules par le terme recherché
  const filteredModules = modules?.filter((module) =>
    module.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Modules de l'application</h1>

      <div className="flex items-center gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Rechercher un module..."
          className="flex-1 px-4 py-2 border rounded"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <PlusCircle /> Ajouter un Module
        </button>
      </div>

      {/* Liste des modules */}
      <div className="mt-6">
        {isLoadingModules ? (
          <div>Chargement des modules...</div>
        ) : error ? (
          <div className="text-red-600">
            Erreur lors du chargement des modules.
          </div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded shadow">
            <thead>
              <tr className="bg-blue-300 text-blue-900 border-b border-gray-200">
                <th className="px-4 py-2 text-left">Titre</th>
                <th className="px-4 py-2 text-left">Catégorie</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredModules?.map((module) => (
                <tr key={module._id} className="border-b">
                  <td className="px-4 py-2">
                    <Link
                      to={`/admin/module/${module._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {module.titre}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{module.categorie}</td>
                  <td className="px-4 py-2">
                    {module.estActif ? (
                      <span className="text-green-500">Actif</span>
                    ) : (
                      <span className="text-red-500">Inactif</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2 items-center">
                    <button
                      onClick={() => handleDelete(module._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      <Trash />
                    </button>
                    <Link
                      to={`/admin/module/${module._id}`}
                      className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
                    >
                      <Edit />
                    </Link>
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
            <h2 className="text-lg font-bold mb-4">Ajouter un Module</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Titre
                </label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Catégorie
                </label>
                <select
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="Compta">Compta</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Communication">Communication</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Image (URL)
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Documentation (URL)
                </label>
                <input
                  type="text"
                  name="documentation"
                  value={formData.documentation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Téléchargement (URL)
                </label>
                <input
                  type="text"
                  name="telechargement"
                  value={formData.telechargement}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="estActif"
                  checked={formData.estActif}
                  onChange={handleInputChange}
                />
                <label className="text-sm font-medium text-gray-600">
                  Actif
                </label>
              </div>
              <div className="flex justify-end gap-4">
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

export default AdminModules;
