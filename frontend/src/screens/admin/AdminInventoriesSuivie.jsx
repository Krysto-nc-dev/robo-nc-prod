// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useGetInventoryByIdQuery } from "../../slices/inventorySlice";
// import { useScanZonePartMutation } from "../../slices/zoneSlice";

// const AdminInventoriesSuivie = () => {
//   const { id: inventoryId } = useParams();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPart, setSelectedPart] = useState(null);
//   const [selectedAgent, setSelectedAgent] = useState("");
//   const [scanZonePart] = useScanZonePartMutation();
//   const [barcodeInput, setBarcodeInput] = useState("");

//   // Récupérer les détails de l'inventaire
//   const {
//     data: inventory,
//     error: inventoryError,
//     isLoading: inventoryLoading,
//     refetch,
//   } = useGetInventoryByIdQuery(inventoryId);

//   useEffect(() => {
//     if (selectedPart) {
//       setIsModalOpen(true);
//     }
//   }, [selectedPart]);

//   useEffect(() => {
//     // Rafraîchir les données chaque fois que la modal est fermée
//     if (!isModalOpen) {
//       refetch();
//     }
//   }, [isModalOpen, refetch]);

//   if (inventoryLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <span className="text-base text-gray-500">Chargement...</span>
//       </div>
//     );
//   }

//   if (inventoryError) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <span className="text-base text-red-500">
//           Erreur lors du chargement des données.
//         </span>
//       </div>
//     );
//   }

//   // Fonction pour déterminer la couleur de fond selon le statut
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "À faire":
//         return "bg-red-500";
//       case "En cours":
//         return "bg-orange-500";
//       case "Terminé":
//         return "bg-green-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   // Fonction pour ouvrir le modal lors du clic sur une action
//   const handlePartClick = (zoneId, part) => {
//     setSelectedPart({ zoneId, ...part });
//   };

//   // Fonction pour envoyer la mise à jour du statut de l'action
//   const handleScanSubmit = async () => {
//     if (!selectedPart || !selectedAgent) {
//       console.error("Partie ou agent non sélectionné");
//       return;
//     }

//     try {
//       await scanZonePart({
//         zoneId: selectedPart.zoneId,
//         data: { type: selectedPart.type, agentId: selectedAgent },
//       }).unwrap();
//       setIsModalOpen(false);
//       setSelectedPart(null);
//       setSelectedAgent("");
//       refetch();
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour de la partie :", error);
//     }
//   };

//   // Fonction pour gérer le scan du code-barres
//   const handleBarcodeScan = () => {
//     const foundZone = inventory.zones.find((zone) =>
//       zone.parties.some((part) => part.codeBarre === barcodeInput)
//     );

//     if (foundZone) {
//       const foundPart = foundZone.parties.find(
//         (part) => part.codeBarre === barcodeInput
//       );
//       setSelectedPart({ zoneId: foundZone._id, ...foundPart });
//     } else {
//       console.error("Code-barres non trouvé");
//     }
//   };

//   // Calcul du pourcentage de progression de l'inventaire
//   const totalZones = inventory?.zones.length || 0;
//   const completedZones = inventory?.zones.filter((zone) =>
//     zone.parties.every((part) => part.status === "Terminé")
//   ).length;

//   const progressPercentage =
//     totalZones > 0 ? (completedZones / totalZones) * 100 : 0;

//   return (
//     <div className="p-4 mx-auto">
//       <h1 className="text-xl font-bold text-gray-300 mb-4">
//         Suivi des zones de l'inventaire : {inventory?.nom}
//       </h1>
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-300 mb-2">
//           Scanner un code-barres
//         </label>
//         <div className="flex items-center gap-2">
//           <input
//             type="text"
//             value={barcodeInput}
//             onChange={(e) => setBarcodeInput(e.target.value)}
//             className="px-3 py-2 rounded-lg border text-black w-64 text-sm"
//             placeholder="Entrer le code-barres"
//           />
//           <button
//             onClick={handleBarcodeScan}
//             className="py-1 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
//           >
//             Scanner
//           </button>
//         </div>
//       </div>

//       {/* Barre de progression de l'inventaire */}
//       <div className="mb-6">
//         <h2 className="text-md font-semibold mb-2">
//           Progression de l'inventaire
//         </h2>
//         <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
//           <div
//             className="bg-green-500 h-3 rounded-full"
//             style={{ width: `${progressPercentage}%` }}
//           ></div>
//         </div>
//         <p className="text-xs text-gray-400">
//           {progressPercentage.toFixed(2)}% de l'inventaire terminé
//         </p>
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <div className="p-4 bg-gray-700 rounded-md shadow-md">
//           <h3 className="text-sm font-semibold text-gray-200">
//             Total des Zones
//           </h3>
//           <p className="text-xl font-bold text-white">{totalZones}</p>
//         </div>
//         <div className="p-4 bg-gray-700 rounded-md shadow-md">
//           <h3 className="text-sm font-semibold text-gray-200">
//             Zones Terminées
//           </h3>
//           <p className="text-xl font-bold text-white">{completedZones}</p>
//         </div>
//         <div className="p-4 bg-gray-700 rounded-md shadow-md">
//           <h3 className="text-sm font-semibold text-gray-200">
//             Zones En Cours
//           </h3>
//           <p className="text-xl font-bold text-white">
//             {totalZones - completedZones}
//           </p>
//         </div>
//         <div className="p-4 bg-gray-700 rounded-md shadow-md">
//           <h3 className="text-sm font-semibold text-gray-200">Progression</h3>
//           <p className="text-xl font-bold text-white">
//             {progressPercentage.toFixed(2)}%
//           </p>
//         </div>
//       </div>

//       <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-8 gap-2">
//         {inventory?.zones.map((zone) => (
//           <div
//             key={zone._id}
//             className="p-2 border border-gray-300 bg-gray-600 rounded-md shadow-md"
//           >
//             {/* Nom de la zone */}
//             <h3 className="text-center text-white font-bold text-xs mb-2">
//               {zone.nom}
//             </h3>

//             {/* Statuts des parties */}
//             <div className="flex justify-around items-center">
//               {zone.parties.map((partie) => (
//                 <div
//                   key={partie.type}
//                   className={`w-5 h-5 flex justify-center items-center rounded ${getStatusColor(
//                     partie.status
//                   )}`}
//                   title={partie.type} // Infobulle pour afficher le type
//                   onClick={() => handlePartClick(zone._id, partie)}
//                 >
//                   {partie.type.charAt(0)}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal pour scanner une partie */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
//             <h2 className="text-lg font-bold mb-4">Scanner une Partie</h2>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-2">Agent</label>
//               <select
//                 value={selectedAgent}
//                 onChange={(e) => setSelectedAgent(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg"
//               >
//                 <option value="">Sélectionner un agent</option>
//                 {inventory.agents.map((agent) => (
//                   <option key={agent._id} value={agent._id}>
//                     {agent.nom} {agent.prenom}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex justify-end gap-2">
//               <button
//                 type="button"
//                 onClick={() => setIsModalOpen(false)}
//                 className="py-1 px-4 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
//               >
//                 Annuler
//               </button>
//               <button
//                 onClick={handleScanSubmit}
//                 className="py-1 px-4 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
//               >
//                 Sauvegarder
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminInventoriesSuivie;
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetInventoryByIdQuery } from "../../slices/inventorySlice";
import { useScanZonePartMutation } from "../../slices/zoneSlice";

const AdminInventoriesSuivie = () => {
  const { id: inventoryId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [scanZonePart] = useScanZonePartMutation();
  const [barcodeInput, setBarcodeInput] = useState("");

  const {
    data: inventory,
    error: inventoryError,
    isLoading: inventoryLoading,
    refetch,
  } = useGetInventoryByIdQuery(inventoryId);

  useEffect(() => {
    if (selectedPart) {
      setIsModalOpen(true);
    }
  }, [selectedPart]);

  useEffect(() => {
    if (!isModalOpen) {
      refetch();
    }
  }, [isModalOpen, refetch]);

  if (inventoryLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-base text-gray-500">Chargement...</span>
      </div>
    );
  }

  if (inventoryError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-base text-red-500">
          Erreur lors du chargement des données.
        </span>
      </div>
    );
  }

  const getZoneBorderColor = (zone) => {
    const allDone = zone.parties.every((part) => part.status === "Terminé");
    const allToDo = zone.parties.every((part) => part.status === "À faire");
    if (allDone) return "border-2 border-green-500 bg-green-100";
    if (allToDo) return "border-2 border-red-500 bg-red-100";
    return "border-2 border-orange-400 bg-orange-100";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "À faire":
        return "bg-red-500 hover:bg-red-600";
      case "En cours":
        return "bg-orange-500 hover:bg-orange-600";
      case "Terminé":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const handlePartClick = (zoneId, part) => {
    setSelectedPart({ zoneId, ...part });
  };

  const handleScanSubmit = async () => {
    if (!selectedPart || !selectedAgent) {
      console.error("Partie ou agent non sélectionné");
      return;
    }

    try {
      await scanZonePart({
        zoneId: selectedPart.zoneId,
        data: { type: selectedPart.type, agentId: selectedAgent },
      }).unwrap();
      setIsModalOpen(false);
      setSelectedPart(null);
      setSelectedAgent("");
      refetch();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la partie :", error);
    }
  };

  const handleBarcodeScan = () => {
    const foundZone = inventory.zones.find((zone) =>
      zone.parties.some((part) => part.codeBarre === barcodeInput)
    );

    if (foundZone) {
      const foundPart = foundZone.parties.find(
        (part) => part.codeBarre === barcodeInput
      );
      setSelectedPart({ zoneId: foundZone._id, ...foundPart });
    } else {
      console.error("Code-barres non trouvé");
    }
  };

  const totalZones = inventory?.zones.length || 0;
  const completedZones = inventory?.zones.filter((zone) =>
    zone.parties.every((part) => part.status === "Terminé")
  ).length;

  const progressPercentage =
    totalZones > 0 ? (completedZones / totalZones) * 100 : 0;

  return (
    <div className="p-4 mx-auto ">
      <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        Suivi des Zones de l'Inventaire
      </h1>

      {/* Barre de progression */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-600 mb-2">
          Progression de l'Inventaire
        </h2>
        <div className="relative bg-gray-300 rounded-full h-2">
          <div
            className="absolute top-0 left-0 bg-green-500 h-2 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">
          {progressPercentage.toFixed(2)}% terminé
        </p>
      </div>

      {/* Input Scanner */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Scanner un code-barres
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            placeholder="Entrer un code-barres"
            className="border border-gray-400 rounded px-4 py-2 flex-1"
          />
          <button
            onClick={handleBarcodeScan}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Scanner
          </button>
        </div>
      </div>

      {/* Cartes des KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-white rounded-lg shadow-md text-center">
          <h3 className="text-sm font-semibold text-gray-500">Zones Totales</h3>
          <p className="text-xl font-bold text-gray-800">{totalZones}</p>
        </div>
        <div className="p-3 bg-white rounded-lg shadow-md text-center">
          <h3 className="text-sm font-semibold text-gray-500">
            Zones Terminées
          </h3>
          <p className="text-xl font-bold text-gray-800">{completedZones}</p>
        </div>
        <div className="p-3 bg-white rounded-lg shadow-md text-center">
          <h3 className="text-sm font-semibold text-gray-500">En Cours</h3>
          <p className="text-xl font-bold text-gray-800">
            {totalZones - completedZones}
          </p>
        </div>
        <div className="p-3 bg-white rounded-lg shadow-md text-center">
          <h3 className="text-sm font-semibold text-gray-500">Progression</h3>
          <p className="text-xl font-bold text-gray-800">
            {progressPercentage.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Zones */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {inventory?.zones.map((zone) => (
          <div
            key={zone._id}
            className={`p-3 bg-gray-50 rounded-lg shadow-md border hover:shadow-lg transition-shadow ${getZoneBorderColor(
              zone
            )}`}
          >
            <p className="text-[10px] font-bold text-gray-800 text-center mb-3">
              {zone.nom}
            </p>
            <div className="flex justify-center gap-1 flex-wrap">
              {zone.parties.map((partie) => (
                <div
                  key={partie.type}
                  className={`w-6 h-6 text-xs flex justify-center items-center rounded-full cursor-pointer transition-transform transform hover:scale-110 ${getStatusColor(
                    partie.status
                  )}`}
                  title={partie.type}
                  onClick={() => handlePartClick(zone._id, partie)}
                >
                  {partie.type.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Scanner une Partie</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Agent</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Sélectionner un agent</option>
                {inventory.agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.nom} {agent.prenom}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleScanSubmit}
                className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventoriesSuivie;
