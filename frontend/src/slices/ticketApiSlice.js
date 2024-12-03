// Import the base API slice and constants
import { apiSlice } from "./apiSlice";
import { TICKETS_URL } from "./constants.js";

// Use apiSlice to inject endpoints
export const ticketsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tickets
    getTickets: builder.query({
      query: (filters) => ({
        url: `${TICKETS_URL}`,
        method: "GET",
        params: filters, // Pass filters as query parameters
        credentials: "include",
      }),
      providesTags: ["Ticket"],
      keepUnusedDataFor: 5,
    }),

    // Create a new ticket
    createTicket: builder.mutation({
      query: (data) => ({
        url: `${TICKETS_URL}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Ticket"],
    }),

    // Get a ticket by ID
    getTicketById: builder.query({
      query: (ticketId) => ({
        url: `${TICKETS_URL}/${ticketId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, ticketId) => [{ type: "Ticket", id: ticketId }],
      keepUnusedDataFor: 5,
    }),

    // Update a ticket
    updateTicket: builder.mutation({
      query: (data) => ({
        url: `${TICKETS_URL}/${data.ticketId}`, // Make sure to pass the ticket ID
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Ticket"],
    }),

    // Delete a ticket
    deleteTicket: builder.mutation({
      query: (ticketId) => ({
        url: `${TICKETS_URL}/${ticketId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Ticket"],
    }),

    // Add a comment to a ticket
    addCommentToTicket: builder.mutation({
      query: ({ ticketId, data }) => ({
        url: `${TICKETS_URL}/${ticketId}/comments`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: "Ticket", id: ticketId }],
    }),

    // Change ticket status
    changeTicketStatus: builder.mutation({
      query: ({ ticketId, data }) => ({
        url: `${TICKETS_URL}/${ticketId}/status`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: "Ticket", id: ticketId }],
    }),
  }),
});

// Export the generated hooks
export const {
  useGetTicketsQuery,
  useCreateTicketMutation,
  useGetTicketByIdQuery,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useAddCommentToTicketMutation,
  useChangeTicketStatusMutation,
} = ticketsApiSlice;
