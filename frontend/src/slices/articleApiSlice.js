// Importation des outils nécessaires depuis Redux Toolkit et RTK Query
import { apiSlice } from './apiSlice';
import { ARTICLES_URL } from './constants';

// Extension de l'apiSlice avec les endpoints pour les articles
export const articlesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Récupérer tous les articles
    getArticles: builder.query({
      query: () => ({
        url: `${ARTICLES_URL}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Article'],
      keepUnusedDataFor: 5,
    }),

    // Créer un nouvel article
    createArticle: builder.mutation({
      query: (data) => ({
        url: `${ARTICLES_URL}`,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Article'],
    }),

    // Récupérer un article par ID
    getArticleById: builder.query({
      query: (articleId) => ({
        url: `${ARTICLES_URL}/${articleId}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (result, error, articleId) => [{ type: 'Article', id: articleId }],
      keepUnusedDataFor: 5,
    }),

    // Mettre à jour un article
    updateArticle: builder.mutation({
      query: (data) => ({
        url: `${ARTICLES_URL}/${data.articleId}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Article'],
    }),

    // Supprimer un article
    deleteArticle: builder.mutation({
      query: (articleId) => ({
        url: `${ARTICLES_URL}/${articleId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Article'],
    }),

    // Importer des articles depuis un fichier CSV
    importArticles: builder.mutation({
      query: (formData) => ({
        url: `${ARTICLES_URL}/import`,
        method: 'POST',
        body: formData,
        credentials: 'include',
      }),
      invalidatesTags: ['Article'],
    }),
  }),
});

// Exportation des hooks générés pour une utilisation dans les composants
export const {
  useGetArticlesQuery,
  useCreateArticleMutation,
  useGetArticleByIdQuery,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useImportArticlesMutation,
} = articlesApiSlice;
