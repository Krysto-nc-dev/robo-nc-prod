import { apiSlice } from './apiSlice';
import { ARTICLES_URL } from './constants.js';

export const articleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all articles with optional search
    getArticles: builder.query({
      query: ({ search } = {}) => {
        const params = new URLSearchParams();
        if (search) {
          params.append("search", search); // Ajoute `search` comme paramètre
        }
        return {
          url: `${ARTICLES_URL}?${params.toString()}`, // Inclut les paramètres dans l'URL
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Article'],
    }),

    // Get a single article by ID
    getArticleById: builder.query({
      query: (id) => ({
        url: `${ARTICLES_URL}/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (result, error, id) => [{ type: 'Article', id }],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleByIdQuery,
} = articleApiSlice;
