import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useRegisterMutation,
  useDeleteUserMutation,
} from "../../slices/userApiSlice";
import { Eye, Trash2 } from "lucide-react";
import ReusableModal from "../../components/global/Modal";
import { MaterialReactTable } from "material-react-table";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    name: "",
    role: "",
    email: "",
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const roles = ["utilisateur", "private", "admin"];

  const {
    data: users,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useGetUsersQuery();

  const [registerUser, { isLoading: isRegisteringUser }] =
    useRegisterMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleRegisterUser = async () => {
    if (!newUser.name || !newUser.role || !newUser.email || !newUser.password) {
      toast.error("Tous les champs sont obligatoires !");
      return;
    }

    try {
      await registerUser({
        ...newUser,
        email: newUser.email.toLowerCase(),
      }).unwrap();
      toast.success("Utilisateur créé avec succès !");
      setNewUser({ name: "", role: "", email: "", password: "" });
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Erreur lors de la création de l'utilisateur.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      try {
        await deleteUser(userId).unwrap();
        toast.success("Utilisateur supprimé avec succès !");
      } catch (err) {
        toast.error("Erreur lors de la suppression de l'utilisateur.");
      }
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Nom",
      },
      {
        accessorKey: "role",
        header: "Rôle",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        id: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleUserClick(row.original._id)}
              className="bg-blue-500 hover:bg-blue-600 rounded-md p-2 text-white transition"
            >
              <Eye />
            </button>
            <button
              onClick={() => handleDeleteUser(row.original._id)}
              className="bg-red-500 hover:bg-red-600 rounded-md p-2 text-white transition"
            >
              <Trash2 />
            </button>
          </div>
        ),
      },
    ],
    [handleUserClick, handleDeleteUser]
  );

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Gestion des Utilisateurs
      </h1>

      <div className="mb-6 text-center">
        <button
          onClick={openModal}
          className="bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 transition"
        >
          Ajouter un Utilisateur
        </button>
      </div>

      <ReusableModal
        open={isModalOpen}
        onClose={closeModal}
        title="Ajouter un Utilisateur"
        content={
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              placeholder="Nom"
              className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Choisir un rôle</option>
              {roles.map((role) => (
                <option key={role} value={role.toLowerCase()}>
                  {role}
                </option>
              ))}
            </select>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              placeholder="Mot de passe"
              className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        }
        actions={
          <div className="flex justify-end gap-4">
            <button
              onClick={closeModal}
              className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-md shadow transition"
            >
              Annuler
            </button>
            <button
              onClick={handleRegisterUser}
              disabled={isRegisteringUser}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow transition"
            >
              {isRegisteringUser ? "Création en cours..." : "Créer"}
            </button>
          </div>
        }
      />

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Liste des Utilisateurs
        </h2>
        {isLoadingUsers ? (
          <p className="text-gray-500">Chargement des utilisateurs...</p>
        ) : usersError ? (
          <p className="text-red-500">
            Erreur lors du chargement des utilisateurs.
          </p>
        ) : users && users.length > 0 ? (
          <MaterialReactTable
            columns={columns}
            data={users}
            enableSorting
            enablePagination
            enableRowActions
          />
        ) : (
          <p className="text-gray-500">Aucun utilisateur trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
