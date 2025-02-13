import React, { useState, useRef } from 'react';
import axios from 'axios';
import { modalCss } from '../css/Styles';
import { handleError } from './Handlers'
import { useCustomToast } from '../wrappers/Toast';

const Modal = ({ email, username, password, mode, onClose, changingMode }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const toast = useCustomToast();

  const isComplete = code.every(digit => digit !== '');

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return; // Only allow digits

    const newCode = [...code];
    pastedData.split('').forEach((digit, index) => {
      if (index < 6) newCode[index] = digit;
    });
    setCode(newCode);
  };




  const handleVerify = async () => {
    if (!isComplete) return;
  
    setIsLoading(true);
    setError('');
    try {
      const verificationCode = code.join('');

      const url = mode === "signup" 
        ? import.meta.env.VITE_SIGNUP_URL_VERIFY
        : import.meta.env.VITE_LOGIN_URL_VERIFY;
      
      const data = mode === "signup"
        ? { email, password, username, verificationCode }
        : { email, password, verificationCode };

      const response = await axios.post(url, data);
       
    if (mode === "signup") {
      if (response.status === 201 && response.data.code === 'REGISTRATION_SUCCESS') {
        changingMode();
        toast.success('Account verified successfully!');
      } else {
        throw new Error('Unexpected response');
      }
    } else {
      if (response.status === 200 && response.data.code === 'AUTH_VERIFIED') {
        toast.success('Verification Succeed!');
      } else {
        throw new Error('Unexpected response');
      }
    }
  } catch (error) {
    const errorMessage = handleError(error);
    setError(errorMessage);
  } finally {
    setIsLoading(false);
    if (!error) {
      onClose();
    }
  }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="info">
          <h2>
            {mode === 'login' ? "!!We Must make Sure That is You!!" : "Please!! Verify Your Email"}
          </h2>
          <p>
            Check The Code We Sent To Your Email
            <br/>
            <span>{email}</span>
            <br/>
            <br/>
          </p>
        </div>

        <div className="input-fields">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              maxLength={1}
              type="tel"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isLoading}
              className="input-field"
            />
          ))}
        </div>

        {error && (
          <div style={{ color: 'var(--primary-color)', textAlign: 'center', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div className="action-buttons">
          <button 
            className="verify-button"
            onClick={handleVerify}
            disabled={!isComplete || isLoading}
            style={{ opacity: (!isComplete || isLoading) ? 0.6 : 1, cursor: (!isComplete || isLoading) ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
          <button 
            onClick={onClose} 
            className="clear-button" 
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </div>

      <style>{`${modalCss}`}</style>
    </div>
  );
};

export default Modal;