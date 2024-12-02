// Import the base API slice and constants
import { apiSlice } from './apiSlice';
import { ACCESS_APPS_URL } from './constants.js';

// Use apiSlice to inject endpoints
export const accessAppsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all AccessApps
    getAccessApps: builder.query({
      query: () => ({
        url: `${ACCESS_APPS_URL}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['AccessApp'],
      keepUnusedDataFor: 5,
    }),

    // Create a new AccessApp
    createAccessApp: builder.mutation({
      query: (data) => ({
        url: `${ACCESS_APPS_URL}`,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['AccessApp'],
    }),

    // Get an AccessApp by ID
    getAccessAppById: builder.query({
      query: (accessAppId) => ({
        url: `${ACCESS_APPS_URL}/${accessAppId}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (result, error, accessAppId) => [{ type: 'AccessApp', id: accessAppId }],
      keepUnusedDataFor: 5,
    }),

    // Update an AccessApp
    updateAccessApp: builder.mutation({
      query: (data) => ({
        url: `${ACCESS_APPS_URL}/${data.accessAppId}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['AccessApp'],
    }),

    // Delete an AccessApp
    deleteAccessApp: builder.mutation({
      query: (accessAppId) => ({
        url: `${ACCESS_APPS_URL}/${accessAppId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['AccessApp'],
    }),
  }),
});

// Export the generated hooks
export const {
  useGetAccessAppsQuery,
  useCreateAccessAppMutation,
  useGetAccessAppByIdQuery,
  useUpdateAccessAppMutation,
  useDeleteAccessAppMutation,
} = accessAppsApiSlice;
