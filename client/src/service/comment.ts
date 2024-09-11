import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface IComment {
  id: number;
  content: string;
}

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/comment.php' }), // Укажите базовый URL вашего API
  tagTypes: ['comment'],
  endpoints: (builder) => ({
    getComments: builder.query<IComment[], number>({
      query: (newsId) => `?news_id=${newsId}`,
      providesTags: ['comment'],
    }),
    addComment: builder.mutation<{ success: boolean }, Partial<IComment>>({
      query: (newComment) => ({
        url: '',
        method: 'POST',
        body: newComment,
      }),
      invalidatesTags: ['comment'],
    }),
    deleteComment: builder.mutation<{ success: boolean }, number>({
      query: (commentId) => ({
        url: '',
        method: 'DELETE',
        body: new URLSearchParams({ id: commentId.toString() }),
      }),
      invalidatesTags: ['comment'],
    }),
  }),
});

export const { useGetCommentsQuery, useAddCommentMutation, useDeleteCommentMutation } = commentsApi;
