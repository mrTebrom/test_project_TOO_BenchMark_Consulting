import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { newsApiAPI } from '../service/news';
import { commentsApi } from '../service/comment';

const rootReducer = combineReducers({
  [newsApiAPI.reducerPath]: newsApiAPI.reducer,
  [commentsApi.reducerPath]: commentsApi.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(newsApiAPI.middleware).concat(commentsApi.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
