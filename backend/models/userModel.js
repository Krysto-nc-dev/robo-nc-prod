import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useRegisterMutation, // Utiliser le hook pour register
  useDeleteUserMutation,
} from "../../slices/userApiSlice";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user", // Valeur par défaut
    password: "",
  });

  // Hook pour récupérer la liste des utilisateurs
  const {
    data: users,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useGetUsersQuery();

  // Hooks pour ajouter et supprimer des utilisateurs
  const [registerUser, { isLoading: isRegisteringUser }] = useRegisterMutation();
  const [deleteUser] = useDeleteUserMutation();

  // Gestion des champs pour ajouter un utilisateur
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({ ...prevState, [name]: value }));
  };

  // Soumettre un nouvel utilisateur via l'endpoint register
  const handleRegisterUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Tous les champs obligatoires doivent être remplis !");
      return;
    }

    if (newUser.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères !");
      return;
    }

    try {
      await registerUser({
        ...newUser,
        email: newUser.email.toLowerCase(), // S'assurer que l'email est en minuscules
      }).unwrap();
      toast.success("Utilisateur créé avec succès !");
      setNewUser({ name: "", email: "", role: "user", password: "" });
    } catch (err) {
      toast.error("Erreur lors de la création de l'utilisateur.");
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await deleteUser(userId).unwrap();
        toast.success("Utilisateur supprimé avec succès !");
      } catch (err) {
        toast.error("Erreur lors de la suppression de l'utilisateur.");
      }
    }
  };

  // Naviguer vers la page des détails d'un utilisateur
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
            placeholder="Nom complet"
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="user">Utilisateur</option>
            <option value="private">Privé</option>
            <option value="admin">Administrateur</option>
          </select>
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
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.email || "N/A"}</td>
                  <td>{user.role || "user"}</td>
                  <td>
                    <button
                      onClick={() => handleUserClick(user._id)}
                      className="btn"
                    >
                      Voir Détails
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="btn btn-danger ml-2"
                    >
                      Supprimer
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
