import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export interface INews {
  id: number;
  title: string;
  image: string;
  author: string;
  content: string;
  cardTitle: string;
  cardDescription: string;
  created_at: string;
  likes: number;
  views: number;
}

type ICreate = Omit<INews, 'id' | 'created_at' | 'likes' | 'views'>;

export const newsApiAPI = createApi({
  reducerPath: 'news',
  baseQuery: fetchBaseQuery({ baseUrl: '/news.php' }),
  tagTypes: ['news'],
  endpoints: (build) => ({
    findAllNews: build.query<INews[], void>({
      query: () => ({
        url: `/`,
      }),
      providesTags: ['news'],
    }),
    findOneNew: build.query<INews, number>({
      query: (id: number) => ({
        url: `?id=` + id,
      }),
      providesTags: ['news'],
    }),

    createNew: build.mutation<void, ICreate>({
      query: (specialization) => ({
        url: `/`,
        method: 'POST',
        body: specialization,
      }),
      invalidatesTags: ['news'],
    }),
    updateNew: build.mutation<INews, { id: number; news: ICreate }>({
      query: ({ id, news }) => ({
        url: `?id=${id}`,
        method: 'PUT',
        body: { ...news, id: id },
      }),
      invalidatesTags: ['news'],
    }),
    deleteNew: build.mutation<INews, number>({
      query: (id: number) => ({
        url: `/`, // передача id как часть пути
        body: { id },
        method: 'DELETE',
      }),
      invalidatesTags: ['news'],
    }),

    like: build.mutation<number, number>({
      query: (id: number) => ({
        url: '/',
        method: 'PATCH',
        body: { id, action: 'like' },
      }),
      invalidatesTags: ['news'],
    }),
    unLike: build.mutation<number, number>({
      query: (id: number) => ({
        url: '/',
        method: 'PATCH',
        body: { id, action: 'unlike' },
      }),
      invalidatesTags: ['news'],
    }),
  }),
});

export const {
  useCreateNewMutation,
  useDeleteNewMutation,
  useFindAllNewsQuery,
  useFindOneNewQuery,
  useUpdateNewMutation,
  useLikeMutation,
  useUnLikeMutation,
} = newsApiAPI;
