import React from "react";
import { Link } from "react-router-dom";
import { BsTools } from "react-icons/bs"; // Icône d'outils depuis react-icons

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-gray-100">
      {/* Icône animée */}
      <div className="mb-6 animate-bounce">
        <BsTools size={100} className="text-primaryColor" />
      </div>

      {/* Texte principal */}
      <h1 className="text-4xl font-bold mb-2">404 - Page non trouvée</h1>
      <p className="text-lg text-gray-400 mb-6 text-center">
        Oups ! Il semble que la page que vous cherchez n'existe pas. <br />
      </p>

      {/* Bouton de retour */}
      <Link
        to="/"
        className="btn bg-primaryColor hover:bg-highlightColor text-gray-900 font-semibold"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFound;
