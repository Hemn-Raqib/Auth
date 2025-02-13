import React, { memo, Suspense } from 'react';
import { Outlet, useNavigation, useLocation, Navigate} from 'react-router-dom';
import Yes from '../files/Yes'
const MainLayout = () => {
  return (
    <div>
      <Yes />
      <Outlet /> 
    </div>
  );
};

export default MainLayout;











