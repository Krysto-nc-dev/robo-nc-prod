// Import the base API slice and constants
import { apiSlice } from "./apiSlice";
import { MODULES_URL } from "./constants.js";

// Use apiSlice to inject endpoints
export const modulesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all modules
    getModules: builder.query({
      query: () => ({
        url: MODULES_URL,
        method: "GET",
        credentials: "include", // Include cookies if needed
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: "Module", id: _id })), "Module"]
          : ["Module"], // Tag all fetched modules
      keepUnusedDataFor: 5, // Cache data for 5 seconds
    }),

    // Get module by ID
    getModuleById: builder.query({
      query: (moduleId) => ({
        url: `${MODULES_URL}/${moduleId}`,
        method: "GET",
        credentials: "include", // Include cookies if needed
      }),
      providesTags: (result, error, moduleId) => [{ type: "Module", id: moduleId }],
      keepUnusedDataFor: 5, // Cache data for 5 seconds
    }),

    // Create a new module
    createModule: builder.mutation({
      query: (data) => ({
        url: MODULES_URL,
        method: "POST",
        body: data,
        credentials: "include", // Include cookies if needed
      }),
      invalidatesTags: ["Module"], // Invalidate cache after creation
    }),

    // Update a module
    updateModule: builder.mutation({
      query: ({ moduleId, ...data }) => ({
        url: `${MODULES_URL}/${moduleId}`,
        method: "PUT",
        body: data,
        credentials: "include", // Include cookies if needed
      }),
      invalidatesTags: (result, error, { moduleId }) => [{ type: "Module", id: moduleId }],
    }),

    // Delete a module
    deleteModule: builder.mutation({
      query: (moduleId) => ({
        url: `${MODULES_URL}/${moduleId}`,
        method: "DELETE",
        credentials: "include", // Include cookies if needed
      }),
      invalidatesTags: (result, error, moduleId) => [{ type: "Module", id: moduleId }],
    }),

    // Activate a module
    activateModule: builder.mutation({
      query: (moduleId) => ({
        url: `${MODULES_URL}/${moduleId}/activate`,
        method: "PATCH",
        credentials: "include", // Include cookies if needed
      }),
      invalidatesTags: (result, error, moduleId) => [{ type: "Module", id: moduleId }],
    }),

    // Deactivate a module
    deactivateModule: builder.mutation({
      query: (moduleId) => ({
        url: `${MODULES_URL}/${moduleId}/deactivate`,
        method: "PATCH",
        credentials: "include", // Include cookies if needed
      }),
      invalidatesTags: (result, error, moduleId) => [{ type: "Module", id: moduleId }],
    }),

    // Download a module
    downloadModule: builder.query({
      query: (moduleId) => ({
        url: `${MODULES_URL}/${moduleId}/download`,
        method: "GET",
        credentials: "include", // Include cookies if needed
      }),
      providesTags: (result, error, moduleId) => [{ type: "Module", id: moduleId }],
    }),
  }),
});

// Export the generated hooks
export const {
  useGetModulesQuery,
  useGetModuleByIdQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
  useActivateModuleMutation,
  useDeactivateModuleMutation,
  useDownloadModuleQuery,
} = modulesApiSlice;
