// dolibarrApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { DOLIBAR_URL, DOLIBARR_API_KEY } from './constants';

const doliBaseQuery = fetchBaseQuery({
  baseUrl: DOLIBAR_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const dolibarrApiSlice = createApi({
  reducerPath: 'dolibarrApi',
  baseQuery: doliBaseQuery,
  tagTypes: ['ThirdParty'],
  endpoints: (builder) => ({
    getThirdparties: builder.query({
      query: () =>
        `thirdparties?DOLAPIKEY=${DOLIBARR_API_KEY}&sortfield=t.rowid&sortorder=ASC&limit=100&format=json`,
    }),
  }),
});

// Export des hooks pour les endpoints de dolibarrApiSlice
export const { useGetThirdpartiesQuery } = dolibarrApiSlice;
export default dolibarrApiSlice;
