import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { LoadingProvider } from './wrappers/GlobalSpinner';
const App = React.lazy(() => import('./App'));
import { AuthProvider } from './auth/AuthContext';
// import { ToastProvider } from './wrappers/Toast';


const Main = () => {
  return (                  
    <React.StrictMode>  
      <Suspense>
        <LoadingProvider>
          {/* <ToastProvider> */}
          <AuthProvider>
        <App />
          </AuthProvider>
          {/* </ToastProvider> */}
        </LoadingProvider>
      </Suspense>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
