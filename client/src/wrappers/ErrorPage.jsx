import React from "react";
import { useRouteError, Link, useNavigate } from 'react-router-dom';
import { ErrorCss } from "../css/Styles";

const XMarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="error-icon">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

export const ErrorPage = () => {
    const { auth } = useAuth();
    const error = useRouteError();
    const navigate = useNavigate();
    const goBack = () => navigate(-1);
    
    return (
        <div className="error-container">
            <div className="error-content">
                <XMarkIcon />
                <h1 className="error-title">
                    Page Note Found
                </h1>
                <p className="error-message">
                    {/* {error.statusText || error.message} */}
                </p>
                <div className="error-buttons">
                    <button onClick={goBack} className="back-button">
                        Back
                    </button>
                    <Link to={auth ? '/mainscreen' : '/'}>
                        <button className="home-button">
                            {auth ? 'Home' : "Register"}
                        </button>
                    </Link>
                </div>
            </div>

            <style>{`${ErrorCss}`}</style>
        </div>
    );
}

export default ErrorPage;
