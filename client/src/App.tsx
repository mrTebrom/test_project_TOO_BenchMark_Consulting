import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AllNews } from './page/allNews';
import { Admin } from './page/admin';
import { setupStore } from './store/store';
import { Header } from './component/header';
import { News } from './page/news';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    children: [
      { index: true, element: <AllNews /> },
      {
        path: 'admin',
        element: <Admin />,
      },
      {
        path: '/news/:id',
        element: <News />,
      },
    ],
  },
]);

const store = setupStore();
export const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};
