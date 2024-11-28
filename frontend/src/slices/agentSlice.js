// Import the base API slice and constants
import { apiSlice } from './apiSlice';
import { AGENTS_URL } from './constants.js';

// Use apiSlice to inject endpoints
export const agentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all agents
    getAgents: builder.query({
      query: () => ({
        url: `${AGENTS_URL}`,
        method: 'GET',
        credentials: 'include', // Include cookies if needed
      }),
      providesTags: ['Agent'], // Invalidate when agents change
      keepUnusedDataFor: 5, // Cache data for 5 seconds
    }),

    // Create a new agent
    createAgent: builder.mutation({
      query: (data) => ({
        url: `${AGENTS_URL}`,
        method: 'POST',
        body: data,
        credentials: 'include', // Include cookies if needed
      }),
      invalidatesTags: ['Agent'], // Invalidate agent list after creation
    }),

    // Get an agent by ID
    getAgentById: builder.query({
      query: (agentId) => ({
        url: `${AGENTS_URL}/${agentId}`,
        method: 'GET',
        credentials: 'include', // Include cookies if needed
      }),
      keepUnusedDataFor: 5, // Cache data for 5 seconds
    }),

    // Update an agent
    updateAgent: builder.mutation({
      query: (data) => ({
        url: `${AGENTS_URL}/${data.agentId}`,
        method: 'PUT',
        body: data,
        credentials: 'include', // Include cookies if needed
      }),
      invalidatesTags: ['Agent'], // Invalidate agent list after update
    }),

    // Delete an agent
    deleteAgent: builder.mutation({
      query: (agentId) => ({
        url: `${AGENTS_URL}/${agentId}`,
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
} = agentsApiSlice;
