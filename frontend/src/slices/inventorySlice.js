// Import the base API slice and constants
import { apiSlice } from './apiSlice';
import { INVENTORIES_URL } from './constants.js';

// Use apiSlice to inject endpoints
export const inventoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all inventories
    getInventories: builder.query({
      query: () => ({
        url: `${INVENTORIES_URL}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Inventory'],
      keepUnusedDataFor: 5,
    }),

    // Create a new inventory
    createInventory: builder.mutation({
      query: (data) => ({
        url: `${INVENTORIES_URL}`,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Inventory'],
    }),

    // Get an inventory by ID
    getInventoryById: builder.query({
      query: (inventoryId) => ({
        url: `${INVENTORIES_URL}/${inventoryId}`,
        method: 'GET',
        credentials: 'include',
      }),
      keepUnusedDataFor: 5,
    }),

    // Update an inventory
    updateInventory: builder.mutation({
      query: (data) => ({
        url: `${INVENTORIES_URL}/${data.inventoryId}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Inventory'],
    }),

    // Delete an inventory
    deleteInventory: builder.mutation({
      query: (inventoryId) => ({
        url: `${INVENTORIES_URL}/${inventoryId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Inventory'],
    }),

    // Import zones from a CSV file
    importZones: builder.mutation({
      query: (formData) => ({
        url: `${INVENTORIES_URL}/import-zones`,
        method: 'POST',
        body: formData,
        credentials: 'include',
      }),
      invalidatesTags: ['Inventory'],
    }),

    // Generate PDF for an inventory
    generatePDF: builder.mutation({
      query: (inventoryId) => ({
        url: `${INVENTORIES_URL}/${inventoryId}/generate-pdf`,
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/pdf', // S'assurer que le client attend un PDF
        },
      }),
      responseHandler: (response) => response.blob(), // Handle the PDF response as a blob
    }),
  }),
});

// Export the generated hooks
export const {
  useGetInventoriesQuery,
  useCreateInventoryMutation,
  useGetInventoryByIdQuery,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
  useImportZonesMutation,
  useGeneratePDFMutation,
} = inventoriesApiSlice;
