import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetFournisseursQuery } from "../../slices/qcFournisseurApiSlice";
import { Eye, Loader } from "lucide-react";
import { Details, DetailsRounded } from "@mui/icons-material";
import { BsEyeSlashFill } from "react-icons/bs";

const AdminFournisseurQcApiSlice = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Récupérer les fournisseurs existants
  const { data: fournisseurs, isLoading, error } = useGetFournisseursQuery();

  // Gestion de la recherche
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrer les fournisseurs par le terme recherché
  const filteredFournisseurs = fournisseurs?.filter((fournisseur) =>
    fournisseur.NOM.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Gestion des Fournisseurs</h1>

      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Rechercher un fournisseur par nom..."
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      {/* Liste des fournisseurs */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Fournisseurs existants</h2>
        {isLoading ? (
          <div>
            {" "}
            <Loader />
          </div>
        ) : error ? (
          <div className="text-red-600">
            Erreur lors du chargement des fournisseurs.
          </div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded shadow">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-4 py-2 text-left">Nom</th>
                <th className="px-4 py-2 text-left">Adresse</th>
                <th className="px-4 py-2 text-left">Téléphone</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFournisseurs?.map((fournisseur) => (
                <tr key={fournisseur._id} className="border-b">
                  <td className="px-4 py-2">
                    <Link
                      to={`/admin/QC-fournisseur/${fournisseur._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {fournisseur.NOM}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{fournisseur.AD1}</td>
                  <td className="px-4 py-2">{fournisseur.TEL}</td>
                  <td className="px-4 py-2 flex gap-2 items-center">
                    <Link
                      to={`/admin/QC-fournisseur/${fournisseur._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      <Eye />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminFournisseurQcApiSlice;
