import React, {Suspense} from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSpinner } from '../wrappers/GlobalSpinner';
import Spinner from '../elements/Spinner';
import  useAuth from '../auth/useAuth';

const PublicRoute = () => {
    const { auth, isAuthChecked, user, loggedin, accessToken } = useAuth();
  const { isLoading, setIsLoading } = useSpinner();
  const location = useLocation();

  if (isLoading) {
    return <Spinner />; 
  }
  
  
  
  if (auth) {
    return <Navigate to={location.state?.from || "/mainscreen"} replace />;
  }
  
  return (
    <>
     <Suspense fallback={<Spinner />}>
     <Outlet />
     </Suspense>
    </>
  );
};

export default PublicRoute;























