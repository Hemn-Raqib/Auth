import React, { Suspense, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSpinner } from '../wrappers/GlobalSpinner';
import Spinner from '../elements/Spinner';
import  useAuth from '../auth/useAuth';
const PrivateRoute = () => {
  const { isLoading, setIsLoading } = useSpinner();
  const location = useLocation();
const { auth, isAuthChecked, user, loggedin, accessToken } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  if (!auth) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }



  return (
    <Suspense fallback={<Spinner />}>
      <Outlet />
    </Suspense>
  );
};

export default PrivateRoute;













