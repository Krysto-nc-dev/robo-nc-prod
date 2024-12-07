import React, { useState, useEffect } from "react";
import { useGetArticlesQuery } from "../../slices/qcArticleApiSlice";
import { useNavigate } from "react-router-dom";

const AdminQcArticles = () => {
  const [search, setSearch] = useState(""); // Recherche par DESIGN
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(20); // Nombre d'articles par page

  const navigate = useNavigate();

  // Requête pour récupérer les articles avec recherche par `DESIGN`
  const { data, isLoading, isError, error } = useGetArticlesQuery({
    page,
    limit,
    sort,
    order,
    search, // Utilisé pour filtrer les articles par DESIGN
  });

  useEffect(() => {
    if (data) {
      console.log("Données récupérées :", data);
    }
  }, [data]);

  if (isLoading) return <div>Chargement...</div>;
  if (isError) {
    console.error("Erreur lors du chargement :", error);
    return <div>Une erreur est survenue lors du chargement des articles.</div>;
  }

  const { articles, totalItems, totalPages } = data || {};

  const handleSortChange = (field) => {
    setSort(field);
    setOrder(order === "desc" ? "asc" : "desc");
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value); // Recherche par DESIGN
    setPage(1); // Réinitialise à la première page lors d'une recherche
  };

  const handleDetailsClick = (id) => {
    navigate(`/admin/articles/${id}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Articles</h1>

      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par désignation (DESIGN)..."
          value={search}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded w-1/2"
        />
      </div>

      {/* Tableau des articles */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSortChange("NART")}
              >
                Code Article {sort === "NART" && (order === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSortChange("DESIGN")}
              >
                Désignation {sort === "DESIGN" && (order === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSortChange("PVTE")}
              >
                Prix Vente {sort === "PVTE" && (order === "asc" ? "▲" : "▼")}
              </th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles?.length > 0 ? (
              articles.map((article) => (
                <tr
                  key={article._id}
                  className={`border-b hover:bg-gray-50 ${
                    article.DESIGN.startsWith("**") ? "bg-red-100" : ""
                  }`}
                >
                  <td className="px-4 py-2">{article.NART}</td>
                  <td className="px-4 py-2">{article.DESIGN}</td>
                  <td className="px-4 py-2">{article.PVTE?.toFixed(2)} F</td>
                  <td className="px-4 py-2">{article.STOCK}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDetailsClick(article._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Aucun article trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Précédent
          </button>
          <span>
            Page {page} sur {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminQcArticles;
