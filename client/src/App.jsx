import React, { useEffect, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useNavigate } from 'react-router-dom';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import Spinner from './elements/Spinner';
import MainLayout from './Layout/MainLayout';
import MainScreen from './files/MainScreen';
import Register from './register/Register'
import { ScreenSizeProvider } from './wrappers/ScreenSizeContext';
import ToastProvider from './wrappers/Toast';
import ErrorPage from './wrappers/ErrorPage';

const AppRouter = () => {
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            index: true, 
            element: <Suspense fallback={<Spinner />}><Register /></Suspense>,
            
          }
        ],
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: 'mainscreen',
            element: <Suspense fallback={<Spinner />}><MainScreen /></Suspense>,
          }
        ],
      },
      {
        path: '*',
        element: <ErrorPage />,
      }
    ],
  },
]);

return <RouterProvider router={router} fallbackElement={<Spinner />} />;

}


const App = () => {

  return (
    <div>
      <ScreenSizeProvider>
      <ToastProvider>
      <AppRouter />
      </ToastProvider>
      </ScreenSizeProvider>
    </div>
  );
};

export default App;


