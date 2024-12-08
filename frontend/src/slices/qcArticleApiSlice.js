import { apiSlice } from './apiSlice';
import { ARTICLES_URL } from './constants.js';

export const articleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all articles with pagination and filters
    getArticles: builder.query({
      query: ({ page = 1, limit = 20, sort = 'createdAt', order = 'desc', search = '', filter = '' } = {}) => {
        // Construire les paramètres de l'URL
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sort,
          order,
        });

        if (search) params.append('search', search);
        if (filter) params.append('filter', JSON.stringify(filter));

        return {
          url: `${ARTICLES_URL}?${params.toString()}`, // Construit l'URL avec les paramètres
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Article'],
      keepUnusedDataFor: 5,
    }),

    // Get an article by ID
    getArticleById: builder.query({
      query: (id) => ({
        url: `${ARTICLES_URL}/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (result, error, id) => [{ type: 'Article', id }],
      keepUnusedDataFor: 5,
    }),

    // Create a new article
    createArticle: builder.mutation({
      query: (data) => ({
        url: `${ARTICLES_URL}`,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Article'],
    }),

    // Update an article
    updateArticle: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${ARTICLES_URL}/${id}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Article', id }],
    }),

    // Delete an article
    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `${ARTICLES_URL}/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Article'],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articleApiSlice;
