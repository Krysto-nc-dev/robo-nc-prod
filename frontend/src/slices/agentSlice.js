// Import the base API slice and constants
import { apiSlice } from './apiSlice';
import { AGENTS_URL } from './constants.js';

// Use apiSlice to inject endpoints
export const agentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all agents (optionally filter by inventory ID)
    getAgents: builder.query({
      query: (inventoryId) => ({
        url: inventoryId ? `${AGENTS_URL}?inventoryId=${inventoryId}` : `${AGENTS_URL}`,
        method: 'GET',
        credentials: 'include', // Include cookies if needed
      }),
      providesTags: (result, error, inventoryId) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Agent', id: _id })), 'Agent']
          : ['Agent'], // Tag all fetched agents
      keepUnusedDataFor: 5, // Cache data for 5 seconds
    }),

    // Create a new agent for a specific inventory
    createAgent: builder.mutation({
      query: (data) => ({
        url: `${AGENTS_URL}`,
        method: "POST",
        body: data,
        credentials: "include", // Inclure les cookies si nécessaire
      }),
      invalidatesTags: ["Agent"], // Invalider le cache après création
    }),
    

    // Get an agent by ID
    getAgentById: builder.query({
      query: (agentId) => ({
        url: `${AGENTS_URL}/${agentId}`,
        method: 'GET',
        credentials: 'include', // Include cookies if needed
      }),
      providesTags: (result, error, agentId) => [{ type: 'Agent', id: agentId }],
      keepUnusedDataFor: 5, // Cache data for 5 seconds
    }),

    // Update an agent
    updateAgent: builder.mutation({
      query: ({ agentId, ...data }) => ({
        url: `${AGENTS_URL}/${agentId}`,
        method: 'PUT',
        body: data,
        credentials: 'include', // Include cookies if needed
      }),
      invalidatesTags: (result, error, { agentId }) => [{ type: 'Agent', id: agentId }],
    }),

    // Delete an agent
    deleteAgent: builder.mutation({
      query: (agentId) => ({
        url: `${AGENTS_URL}/${agentId}`,
        method: 'DELETE',
        credentials: 'include', // Include cookies if needed
      }),
      invalidatesTags: (result, error, agentId) => [{ type: 'Agent', id: agentId }],
    }),

    // Delete agents by inventory ID (when an inventory is deleted)
    deleteAgentsByInventory: builder.mutation({
      query: (inventoryId) => ({
        url: `${AGENTS_URL}?inventoryId=${inventoryId}`,
        method: 'DELETE',
        credentials: 'include', // Include cookies if needed
      }),
      invalidatesTags: ['Agent'], // Invalidate agent list after deletion
    }),
  }),
});

// Export the generated hooks
export const {
  useGetAgentsQuery,
  useCreateAgentMutation,
  useGetAgentByIdQuery,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
  useDeleteAgentsByInventoryMutation,
} = agentsApiSlice;
