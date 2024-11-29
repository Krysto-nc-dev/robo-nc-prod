import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useRegisterMutation,
  useDeleteUserMutation,
} from "../../slices/userApiSlice";
import { Eye, Trash2 } from "lucide-react";


const AdminUsers = () => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    name: "",
    role: "",
    email: "",
    password: "",
  });

  const roles = ["user", "private", "admin"]; // Liste des rôles disponibles

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
    if (
      !newUser.name ||
      !newUser.role ||
      !newUser.email ||
      !newUser.password
    ) {
      toast.error("Tous les champs sont obligatoires !");
      return;
    }

    try {
      await registerUser({
        ...newUser,
        email: newUser.email.toLowerCase(),
      }).unwrap();
      toast.success("Utilisateur créé avec succès ! Un email a été envoyé.");
      setNewUser({ name: "", role: "", email: "", password: "" });
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

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4 text-gray-300">
        Gestion des Utilisateurs
      </h1>

      {/* Ajouter un nouvel utilisateur */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-300 mb-2">
          Ajouter un Utilisateur
        </h2>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            placeholder="Nom"
            className="w-full p-2 border rounded"
          />
          <select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Choisir un rôle</option>
            {roles.map((role) => (
              <option key={role} value={role}>
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
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            placeholder="Mot de passe"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleRegisterUser}
          disabled={isRegisteringUser}
          className="btn"
        >
          {isRegisteringUser ? "Création en cours..." : "Créer Utilisateur"}
        </button>
      </div>

      {/* Liste des utilisateurs */}
      <div>
        <h2 className="text-lg font-medium text-gray-300 mb-2">
          Liste des Utilisateurs
        </h2>
        {isLoadingUsers ? (
          <p className="text-mutedColor">Chargement des utilisateurs...</p>
        ) : usersError ? (
          <p className="text-dangerColor">
            Erreur lors du chargement des utilisateurs.
          </p>
        ) : users && users.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Rôle</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.role || "N/A"}</td>
                  <td>{user.email || "N/A"}</td>
                  <td className="flex ">
                    <button
                      onClick={() => handleUserClick(user._id)}
                      className="bg-blue-600 rounded-md p-2 text-gray-300"
                    >
                     <Eye />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className=" btn-danger bg-red-700 ml-2 p-2 rounded-md  text-gray-300"
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-mutedColor">Aucun utilisateur trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
