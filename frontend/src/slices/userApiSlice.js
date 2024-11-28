// Import necessary constants and the apiSlice
import { apiSlice } from './apiSlice';
import { USERS_URL } from './constants.js';

// Use apiSlice to inject endpoints
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Existing login mutation
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: data,
        credentials: 'include', // Permet d'envoyer les cookies avec la requête
      }),
    }),

    // Existing register mutation
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
        credentials: 'include', // Permet d'envoyer les cookies avec la requête
      }),
      invalidatesTags: ['User'], // Invalider les utilisateurs après un ajout
    }),

    // Existing logout mutation
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
        credentials: 'include', // Permet d'envoyer les cookies avec la requête
      }),
    }),

    // Existing profile mutation
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
        credentials: 'include', // Permet d'envoyer les cookies avec la requête
      }),
    }),

    // Existing getUsers query
    getUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}`,
        credentials: 'include', // Permet d'envoyer les cookies avec la requête
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),

    // New deleteUser mutation
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
        credentials: 'include', // Permet d'envoyer les cookies avec la requête
      }),
      invalidatesTags: ['User'],
    }),

    // New getUserDetails query
    getUserDetails: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        credentials: 'include', // Permet d'envoyer les cookies avec la requête
      }),
      keepUnusedDataFor: 5,
    }),

    // Existing updateUser mutation
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: 'PUT',
        body: data,
        credentials: 'include', // Permet d'envoyer les cookies avec la requête
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export the generated hooks
export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetUsersQuery,
  useProfileMutation,
  useDeleteUserMutation, // Added
  useGetUserDetailsQuery, // Added
  useUpdateUserMutation,
} = usersApiSlice;
