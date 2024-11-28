import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, DOLIBAR_URL } from "./constants.js";

// Tags pour le cache de l'API principale (à adapter selon vos besoins)
const tagTypes = [
  "User",
  "Zone",
  "Agent",
    "Inventory",
    "Record",
];

// Configuration de la requête de base pour l'API principale
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Configuration de la requête de base pour l'API Dolibarr sans en-tête de token additionnel
const doliBaseQuery = fetchBaseQuery({
  baseUrl: DOLIBAR_URL,
});

// API principale pour les produits, utilisateurs, etc.
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes,
  endpoints: (builder) => ({}), // Endpoints spécifiques à l'API principale
});

// API Dolibarr avec une configuration de base simple
export const dolibarrApiSlice = createApi({
  reducerPath: "dolibarrApi",

  baseQuery: doliBaseQuery,
  tagTypes: [], // Ajustez si vous devez gérer le cache pour Dolibarr
  endpoints: (builder) => ({}), // Endpoints spécifiques à Dolibarr
});
