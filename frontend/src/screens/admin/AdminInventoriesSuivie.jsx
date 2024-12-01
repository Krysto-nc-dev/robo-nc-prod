// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useGetInventoryByIdQuery } from "../../slices/inventorySlice";
// import { useScanZonePartMutation } from "../../slices/zoneSlice";

// const AdminInventoriesSuivie = () => {
//   const { id: inventoryId } = useParams();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPart, setSelectedPart] = useState(null);
//   const [selectedAgent, setSelectedAgent] = useState("");
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [barcodeInput, setBarcodeInput] = useState("");
//   const [directScan, setDirectScan] = useState(false);

//   const {
//     data: inventory,
//     error: inventoryError,
//     isLoading: inventoryLoading,
//     refetch,
//   } = useGetInventoryByIdQuery(inventoryId);
//   const [scanZonePart] = useScanZonePartMutation();

//   useEffect(() => {
//     if (!isModalOpen) {
//       setBarcodeInput("");
//       setSelectedPart(null);
//       setSelectedZone(null);
//       setDirectScan(false);
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

//   const handleBarcodeInputChange = (e) => {
//     const value = e.target.value;
//     setBarcodeInput(value);

//     const foundZone = inventory.zones.find((zone) =>
//       zone.parties.some((part) => part.codeBarre === value)
//     );

//     if (foundZone) {
//       const foundPart = foundZone.parties.find(
//         (part) => part.codeBarre === value
//       );
//       setSelectedPart({ zoneId: foundZone._id, ...foundPart });
//       setSelectedZone(foundZone);
//       setDirectScan(true); // Indique qu'il s'agit d'un scan direct
//       setIsModalOpen(true);
//     }
//   };

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
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour de la partie :", error);
//     }
//   };

//   const getZoneBorderColor = (zone) => {
//     const allDone = zone.parties.every((part) => part.status === "Terminé");
//     const allToDo = zone.parties.every((part) => part.status === "À faire");
//     if (allDone) return "border-2 border-green-500 bg-green-100";
//     if (allToDo) return "border-2 border-red-500 bg-red-100";
//     return "border-2 border-orange-400 bg-orange-100";
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "À faire":
//         return "bg-red-500 hover:bg-red-600";
//       case "En cours":
//         return "bg-orange-500 hover:bg-orange-600";
//       case "Terminé":
//         return "bg-green-500 hover:bg-green-600";
//       default:
//         return "bg-gray-500 hover:bg-gray-600";
//     }
//   };

//   const totalZones = inventory?.zones.length || 0;
//   const completedZones = inventory?.zones.filter((zone) =>
//     zone.parties.every((part) => part.status === "Terminé")
//   ).length;

//   const progressPercentage =
//     totalZones > 0 ? (completedZones / totalZones) * 100 : 0;

//   return (
//     <div className="p-4 mx-auto max-w-[1280px]">
//       <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">
//         Suivi des Zones de l'Inventaire
//       </h1>

//       {/* Barre de progression */}
//       <div className="mb-6">
//         <h2 className="text-sm font-semibold text-gray-600 mb-2">
//           Progression de l'Inventaire
//         </h2>
//         <div className="relative bg-gray-300 rounded-full h-2">
//           <div
//             className="absolute top-0 left-0 bg-green-500 h-2 rounded-full"
//             style={{ width: `${progressPercentage}%` }}
//           ></div>
//         </div>
//         <p className="text-xs text-gray-500 mt-1 text-right">
//           {progressPercentage.toFixed(2)}% terminé
//         </p>
//       </div>

//       {/* Input Scanner */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-600 mb-2">
//           Scanner un code-barres
//         </label>
//         <input
//           type="text"
//           value={barcodeInput}
//           onChange={handleBarcodeInputChange}
//           placeholder="Entrer un code-barres"
//           className="border border-gray-400 rounded px-4 py-2 w-full"
//         />
//       </div>

//       {/* Mini Cartes Zones */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
//         {inventory?.zones.map((zone) => (
//           <div
//             key={zone._id}
//             className={`p-3 bg-gray-50 rounded-lg shadow-md border hover:shadow-lg transition-shadow ${getZoneBorderColor(
//               zone
//             )}`}
//           >
//             <h3 className="text-sm font-bold text-gray-800 text-center mb-3">
//               {zone.nom}
//             </h3>
//             <div className="flex justify-center gap-1 flex-wrap">
//               {zone.parties.map((partie) => (
//                 <div
//                   key={partie.type}
//                   className={`w-6 h-6 text-xs flex justify-center items-center rounded-full cursor-pointer transition-transform transform hover:scale-110 ${getStatusColor(
//                     partie.status
//                   )}`}
//                   title={partie.type}
//                   onClick={() =>
//                     setSelectedPart({ zoneId: zone._id, ...partie })
//                   }
//                 >
//                   {partie.type.charAt(0)}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {isModalOpen && selectedPart && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
//             <h2 className="text-lg font-bold mb-4">
//               {directScan ? "Scan Direct" : "Scanner une Partie"}
//             </h2>
//             <p className="mb-4 text-sm text-gray-600">
//               <strong>Zone :</strong> {selectedZone?.nom}
//             </p>
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
//             <div className="flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={() => setIsModalOpen(false)}
//                 className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
//               >
//                 Annuler
//               </button>
//               <button
//                 onClick={handleScanSubmit}
//                 className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetInventoryByIdQuery } from "../../slices/inventorySlice";
import { useScanZonePartMutation } from "../../slices/zoneSlice";

const AdminInventoriesSuivie = () => {
  const { id: inventoryId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedZone, setSelectedZone] = useState(null);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [directScan, setDirectScan] = useState(false);

  const barcodeInputRef = useRef(null); // Référence pour le champ input

  const {
    data: inventory,
    error: inventoryError,
    isLoading: inventoryLoading,
    refetch,
  } = useGetInventoryByIdQuery(inventoryId);
  const [scanZonePart] = useScanZonePartMutation();

  useEffect(() => {
    // Quand la modal est fermée, réinitialiser l'input et refocus
    if (!isModalOpen) {
      setBarcodeInput(""); // Vider l'input
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus(); // Redonner le focus
      }
    }
  }, [isModalOpen]);

  useEffect(() => {
    // Focus initial sur l'input lorsque la page est chargée
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

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

  const handleBarcodeInputChange = (e) => {
    const value = e.target.value;
    setBarcodeInput(value);

    const foundZone = inventory.zones.find((zone) =>
      zone.parties.some((part) => part.codeBarre === value)
    );

    if (foundZone) {
      const foundPart = foundZone.parties.find(
        (part) => part.codeBarre === value
      );
      setSelectedPart({ zoneId: foundZone._id, ...foundPart });
      setSelectedZone(foundZone);
      setDirectScan(true); // Indique qu'il s'agit d'un scan direct
      setIsModalOpen(true);
    }
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
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la partie :", error);
    }
  };

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

  const totalZones = inventory?.zones.length || 0;
  const completedZones = inventory?.zones.filter((zone) =>
    zone.parties.every((part) => part.status === "Terminé")
  ).length;

  const progressPercentage =
    totalZones > 0 ? (completedZones / totalZones) * 100 : 0;

  return (
    <div className="p-4 mx-auto">
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
        <input
          ref={barcodeInputRef} // Référence pour focus automatique
          type="text"
          value={barcodeInput}
          onChange={handleBarcodeInputChange}
          placeholder="Entrer un code-barres"
          className="border border-gray-400 rounded px-4 py-2 w-full"
        />
      </div>

      {/* Mini Cartes Zones */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-4">
        {inventory?.zones.map((zone) => (
          <div
            key={zone._id}
            className={`p-3 bg-gray-50 rounded-lg shadow-md border hover:shadow-lg transition-shadow ${getZoneBorderColor(
              zone
            )}`}
          >
            <h3 className="text-sm font-bold lg:text-[10px] text-gray-800 text-center mb-3">
              {zone.nom}
            </h3>
            <div className="flex justify-center gap-1 flex-wrap">
              {zone.parties.map((partie) => (
                <div
                  key={partie.type}
                  className={`w-6 h-6 text-xs flex justify-center items-center rounded-full cursor-pointer transition-transform transform hover:scale-110 ${getStatusColor(
                    partie.status
                  )}`}
                  title={partie.type}
                  onClick={() =>
                    setSelectedPart({ zoneId: zone._id, ...partie })
                  }
                >
                  {partie.type.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedPart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">
              {directScan ? "Scan Direct" : "Scanner une Partie"}
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              <strong>Zone :</strong> {selectedZone?.nom}
            </p>
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
