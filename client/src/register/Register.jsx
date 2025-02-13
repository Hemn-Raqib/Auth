import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { registerCss } from '../css/Styles';
import {validateFields, handleError} from './Handlers';
import useAuth from '../auth/useAuth';
import { useCustomToast } from '../wrappers/Toast';




const Register = () => {
  const { userInfo } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [hide, setHide] = useState(true);
  const [mode, setMode] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useCustomToast();


  axios.defaults.withCredentials = true;

  const handleSubmit = async () => {
    
    
    const validation = validateFields(email, password, username, mode);
    if (!validation.case) {
      setError(validation.msg);
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      const url = mode === "signup"
        ? import.meta.env.VITE_SIGNUP_URL
        : import.meta.env.VITE_LOGIN_URL;
        
      const data = mode === "signup"
        ? { email, password, username }
        : { email, password };

      const response = await axios.post(url, data);
      if (mode === "signup") {
        if (response.status === 200 && response.data.code === 'CODE_SENT') {
          setShowModal(true);
          toast.warning('Verification code sent to your email');
        }
      } else {
        if (response.status === 200 && response.data.code === 'LOGIN_SUCCESS') {
          const { accessToken } = response.data.data;
          await userInfo(accessToken);
          toast.success('Login successful!');
        } else if (response.status === 403 && response.data.code === 'VERIFICATION_REQUIRED') {
          setShowModal(true);
          toast.warning('Additional verification required');
        }
      }
    } catch (error) {
      
      if (error.response?.status === 403 && 
        error.response?.data?.code === 'VERIFICATION_REQUIRED') {
          setShowModal(true);
          toast.warning('Additional verification required');
          return;
  }
  
  
  const errorMessage = handleError(error);
  setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const changeIcon = () => {
    setHide((prevHide) => !prevHide);
  };

  const changeMode = () => {
    setMode(prevMode => prevMode === 'signup' ? 'login' : 'signup');
    setError('');
  };


  const handleCloseModal = () => {
    setShowModal(false);
  };


  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '2rem auto', 
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {mode === "signup" && (
        <div className="group">
          <svg stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="icon">
            <path d="M12 12a5.25 5.25 0 100-10.5A5.25 5.25 0 0012 12zm0 1.5c-3.037 0-9 1.53-9 4.5v.75A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75v-.75c0-2.97-5.963-4.5-9-4.5z" strokeLinejoin="round" strokeLinecap="round"/>
          </svg>
          <input
            className="input"
            type="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>
      )}

      <div className="group">
        <svg stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="icon">
          <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="group">
        {hide ? (
          <svg onClick={changeIcon} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="icon">
            <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" strokeLinejoin="round" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg onClick={changeIcon} xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="icon">
            <path d="M17.25 10.5V6.75a4.5 4.5 0 10-9 0" strokeLinejoin="round" strokeLinecap="round"/>
            <path d="M3.75 10.5h16.5a2.25 2.25 0 012.25 2.25v6.75a2.25 2.25 0 01-2.25 2.25H3.75a2.25 2.25 0 01-2.25-2.25v-6.75a2.25 2.25 0 012.25-2.25z" strokeLinejoin="round" strokeLinecap="round"/>
          </svg>
        )}
        <input
          className="input"
          type={hide ? 'password' : 'text'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {error && (
        <div style={{ color: 'var(--primary-color)', textAlign: 'center', margin: '0.5rem 0', border: '1px solid var(--primary-color)', padding: '6px', borderRadius: '10px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button 
          className='yes' 
          onClick={handleSubmit} 
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          <span className="circle1"></span>
          <span className="circle2"></span>
          <span className="circle3"></span>
          <span className="circle4"></span>
          <span className="circle5"></span>
          <span className="button_top">
            {mode === "signup" ? (isLoading ? 'Signup...' : 'Signup') : (isLoading ? 'Login...' : 'Login')}
          </span>
        </button>
      </div>


      
      <button 
        onClick={changeMode} 
        disabled={isLoading}
        className='account'
        style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer',  }}
      >
        <span>
          {mode === "login" ? "Don't Have an Account?" : "Have an Account?"}
        </span>
      </button>

      <style>{`${registerCss}`}</style>
      {showModal && (
        <Modal 
          mode={mode}
          email={email}
          username={username}
          password={password}
          onClose={handleCloseModal}
          changingMode={changeMode}
        />
      )}
    </div>
  );
};

export default Register;