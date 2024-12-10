import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetModuleByIdQuery,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
} from "../../slices/moduleApiSlice.js";
import { Trash } from "lucide-react";

const AdminModuleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: module, isLoading, error } = useGetModuleByIdQuery(id);
  const [updateModule, { isLoading: isUpdating }] = useUpdateModuleMutation();
  const [deleteModule] = useDeleteModuleMutation();

  const [formData, setFormData] = useState({
    titre: module?.titre || "",
    description: module?.description || "",
    categorie: module?.categorie || "",
    image: module?.image || "",
    documentation: module?.documentation || "",
    telechargement: module?.telechargement || "",
    estActif: module?.estActif || false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateModule({ moduleId: id, ...formData }).unwrap();
      alert("Module mis à jour avec succès !");
      navigate("/admin/modules");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du module :", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce module ?")) {
      try {
        await deleteModule(id).unwrap();
        alert("Module supprimé avec succès !");
        navigate("/admin/modules");
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  if (isLoading) return <div>Chargement des détails du module...</div>;
  if (error)
    return <div className="text-red-600">Erreur : {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Editer le Module</h1>

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
          <label className="text-sm font-medium text-gray-600">Actif</label>
        </div>
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
            onClick={handleDelete}
          >
            <Trash /> Supprimer
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={isUpdating}
          >
            {isUpdating ? "Mise à jour..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminModuleDetails;
