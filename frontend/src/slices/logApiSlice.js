// Import the base API slice and constants
import { apiSlice } from './apiSlice';
import { LOGS_URL } from './constants.js'; // URL de base pour les logs

// Use apiSlice to inject endpoints
export const logsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Récupérer tous les logs
    getLogs: builder.query({
      query: (filters) => {
        const params = new URLSearchParams(filters).toString(); // Construction des query params dynamiques
        return {
          url: `${LOGS_URL}?${params}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Log'], // Tag pour gérer les mises à jour
      keepUnusedDataFor: 5, // Durée de cache des données inutilisées
    }),

    // Créer un log
    createLog: builder.mutation({
      query: (data) => ({
        url: `${LOGS_URL}`,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Log'], // Invalide les logs pour actualiser la liste
    }),

    // Récupérer un log par ID
    getLogById: builder.query({
      query: (logId) => ({
        url: `${LOGS_URL}/${logId}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (result, error, logId) => [{ type: 'Log', id: logId }], // Fournit un tag spécifique au log
      keepUnusedDataFor: 5,
    }),

    // Supprimer un log
    deleteLog: builder.mutation({
      query: (logId) => ({
        url: `${LOGS_URL}/${logId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Log'], // Invalide les logs pour actualiser la liste
    }),

    // Analyse des logs
    getLogAnalytics: builder.query({
      query: (filters) => {
        const params = new URLSearchParams(filters).toString();
        return {
          url: `${LOGS_URL}/analytics?${params}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['LogAnalytics'], // Tag pour gérer les analyses
      keepUnusedDataFor: 5,
    }),
  }),
});

// Export the generated hooks
export const {
  useGetLogsQuery,
  useCreateLogMutation,
  useGetLogByIdQuery,
  useDeleteLogMutation,
  useGetLogAnalyticsQuery,
} = logsApiSlice;
