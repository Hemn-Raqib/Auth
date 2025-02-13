


export const registerCss = `.group {
          display: flex;
          line-height: 30px;
          align-items: center;
          position: relative;
          max-width: 100%;
        }

        .input {
          width: 100%;
          height: 45px;
          line-height: 30px;
          padding: 0 5rem;
          padding-left: 3rem;
          border: 2px solid transparent;
          border-radius: 10px;
          outline: none;
          background-color: #f8fafc;
          color: #0d0c22;
          transition: .5s ease;
        }

        .input::placeholder {
          color: #94a3b8;
        }

        .input:focus, .input:hover {
          outline: none;
          border-color: black;
          background-color: #fff;
          box-shadow: 0 0 0 3px gray;
        }

        .icon {
          position: absolute;
          left: 1rem;
          fill: none;
          width: 1rem;
          height: 1rem;
          color: var(--colors);
        }

       .yes {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  color: white;
  background-color: #171717;
  padding: 1em 2em;
  border: none;
  border-radius: .6rem;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.yes span:not(:nth-child(6)) {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 30px;
  width: 30px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s ease;
}
  .yes:hover{
  color:black;
  border:1px solid black;
  }

.yes span:nth-child(1) {
  position: relative;
}

.yes span:nth-child(2) {
  transform: translate(-3.3em, -4em);
}

.yes span:nth-child(3) {
  transform: translate(-6em, 1.3em);
}

.yes span:nth-child(4) {
  transform: translate(-.2em, 1.8em);
}

.yes span:nth-child(5) {
  transform: translate(3.5em, 1.4em);
}

.yes span:nth-child(6) {
  transform: translate(3.5em, -3.8em);
}

.yes:hover span:not(:nth-child(1)) {
  transform: translate(-50%, -50%) scale(4);
  transition: 1.5s ease;
}
.yes .button_top {
  color: inherit; /* Inherit from parent */
  position: relative; /* Make sure it's above the circles */
  z-index: 1;
}  
  
.account:hover {
  border-color: var(--link-color);
}

.account:focus,
.account:focus-visible {
  outline: 3px solid var(--link-color);
  opacity: 0.4;
}
`





















export const modalCss = `.modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          position: relative;
          padding: 6rem;
          border-radius: var(--border-radius);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                      0 10px 10px -5px rgba(0, 0, 0, 0.04);
          max-width: 420px;
          width: 90%;
          background-color: var(--background-color);
          color: var(--text-color);
          border: 1px solid var(--surface-color);
        }

        

        .info {
          text-align: center;
          margin-bottom: 2rem;
        }

        .info h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-color);
        }

        .info p {
          font-size: 0.95rem;
          opacity: 0.9;
          color: var(--text-color-secondary);
        }

        .input-fields {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .input-fields input {
          width: 3rem;
          height: 3rem;
          border-radius: var(--border-radius);
          border: 2px solid var(--surface-color);
          background-color: var(--surface-color);
          color: var(--text-color);
          font-size: 1.5rem;
          text-align: center;
          transition: all var(--transition-duration);
        }

        .input-fields input:focus {
          outline: none;
          border-color: var(--primary-color);
          background-color: var(--surface-color-hover);
          transform: scale(1.05);
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .verify-button, .clear-button {
          padding: 0.75rem 1.5rem;
          border-radius: var(--border-radius);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-duration);
        }

        .verify-button {
          background-color: var(--primary-color);
          color: var(--background-color);
          border: none;
        }

        .verify-button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
          .verify-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .verify-button:not(:disabled):hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .clear-button {
          background-color: transparent;
          border: 2px solid var(--surface-color);
          color: var(--text-color);
        }

        .clear-button:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
          transform: translateY(-1px);
        }

        .clear-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .clear-button:not(:disabled):hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .modal-content {
            width: 95%;
            padding: 1.5rem;
          }

          .input-fields input {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1.25rem;
          }

          .verify-button, .clear-button {
            padding: 0.6rem 1.2rem;
            font-size: 0.95rem;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-content {
          animation: fadeIn 0.25s ease-out;
        }`;






















        export const spinnerCss = ` .spinner-container {
                position: fixed;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 50;
                pointer-events: none;
            }

            .spinner-svg {
                animation: spin 1s linear infinite;
            }

            .spinner-circle {
                fill: #1a1a1a;
            }

            .spinner-path {
                fill: #ffffff;
            }

            [data-theme="dark"] .spinner-circle {
                fill: #ffffff;
            }

            [data-theme="dark"] .spinner-path {
                fill: #1a1a1a;
            }

            @keyframes spin {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }`;



























            export const ErrorCss = `
                .error-container {
                    margin-top: 8rem;
                    min-height: 100vh;
                    text-align: center;
                    padding: 0 2rem;
                }

                .error-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .error-icon {
                    width: 12rem;
                    height: 12rem;
                    margin: 0 auto;
                    fill: #1a1a1a;
                }

                [data-theme="dark"] .error-icon {
                    fill: #ffffff;
                }

                .error-title {
                    margin-top: 1rem;
                    font-size: 2rem;
                    line-height: 1.2;
                    color: #1a1a1a;
                }

                [data-theme="dark"] .error-title {
                    color: #ffffff;
                }

                .error-message {
                    margin-top: 0.5rem;
                    font-size: 1.25rem;
                    color: #666666;
                }

                [data-theme="dark"] .error-message {
                    color: #a0a0a0;
                }

                .error-buttons {
                    margin-top: 1.5rem;
                    display: flex;
                    gap: 1rem;
                }

                .back-button {
                    padding: 0.5rem 1.5rem;
                    font-size: 1.125rem;
                    border-radius: 0.75rem;
                    background-color: #1a1a1a;
                    color: #ffffff;
                    border: none;
                    transition: all 0.5s ease-in-out;
                }

                [data-theme="dark"] .back-button {
                    background-color: rgba(47,46,46,0.799);
                }

                .back-button:hover {
                    background-color: #ffffff;
                    color: #1a1a1a;
                    border: 1px solid #1a1a1a;
                }

                [data-theme="dark"] .back-button:hover {
                    background-color: #ffffff;
                    border: none;
                }

                .home-button {
                    padding: 0.5rem 1.5rem;
                    font-size: 1.125rem;
                    border-radius: 0.75rem;
                    background-color: #ffffff;
                    color: #1a1a1a;
                    border: 1px solid #1a1a1a;
                    transition: all 0.3s ease-in-out;
                }

                [data-theme="dark"] .home-button {
                    background-color: rgba(47,46,46,0.799);
                    color: #ffffff;
                    border: none;
                }

                .home-button:hover {
                    background-color: #f3f4f6;
                }

                [data-theme="dark"] .home-button:hover {
                    background-color: rgba(69,69,69,1);
                }

                @media (min-width: 768px) {
                    .error-title {
                        font-size: 2.25rem;
                    }
                }
            `;










































         export   const logosStyles = `
.theme-toggle {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  opacity: 0.8;
}

.theme-toggle:focus {
  outline: none;
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--link-color);
  border-radius: var(--border-radius);
}

.logo-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.logo {
  height: 5em;
  padding: 1em;
  will-change: filter;
  transition: filter var(--transition-duration);
}



.logo:hover {
  filter: drop-shadow(0 0 1em var(--primary-color));
}

.logo.react:hover {
  filter: drop-shadow(0 0 1em var(--primary-color));
}




@media (max-width: 768px) {
  .logo {
    height: 3.5em;
    padding: 0.875em;
  }
}`;



















export const tableStyles = `
:root {
            --container-padding-xl: 2rem;
            --container-padding-lg: 1.5rem;
            --container-padding-md: 1.25rem;
            --container-padding-sm: 1rem;
            --container-max-width-xl: 1400px;
            --container-max-width-lg: 1200px;
            --container-max-width-md: 960px;
            --container-max-width-sm: 540px;
          }

          .app-container {
            display: flex;
            flex-direction: column;
            gap: clamp(1rem, 2vw, 1.5rem);
            padding: var(--container-padding-lg);
            background-color: var(--background-color);
            border-radius: var(--border-radius);
            width: 100%;
            max-width: var(--container-max-width-lg);
            margin: 0 auto;
            min-height: 100vh;
          }

          .header {
            text-align: center;
            margin-bottom: clamp(1rem, 2vw, 2rem);
          }

          h1 {
            font-size: clamp(1.75rem, 4vw, 2.8rem);
            line-height: 1.1;
            color: var(--text-color);
            margin: 0;
          }

          .action-buttons {
            display: flex;
            justify-content: center;
            gap: clamp(0.5rem, 1vw, 1rem);
            margin-bottom: clamp(1rem, 2vw, 1.5rem);
            padding: 0 1rem;
          }

          .refresh-button {
            min-width: clamp(120px, 15vw, 140px);
            padding: 0.6em 1.2em;
            border-radius: var(--border-radius);
            border: 1px solid var(--primary-color);
            font-size: clamp(0.875rem, 1vw, 0.95rem);
            font-weight: 500;
            background-color: var(--surface-color);
            color: var(--text-color);
            cursor: pointer;
            transition: all var(--transition-duration);
          }

          .refresh-button:hover {
            background-color: var(--surface-color-hover);
          }

          .button-container {
            display: flex;
            justify-content: center;
            gap: clamp(0.5rem, 1vw, 0.75rem);
            margin-bottom: clamp(1rem, 2vw, 1.5rem);
            flex-wrap: wrap;
          }

          .collect-button {
            min-width: clamp(120px, 15vw, 140px);
            padding: 0.6em 1.2em;
            border-radius: var(--border-radius);
            border: 1px solid transparent;
            font-size: clamp(0.875rem, 1vw, 0.95rem);
            font-weight: 500;
            background-color: var(--surface-color);
            color: var(--text-color);
            cursor: pointer;
            transition: all var(--transition-duration);
          }

          .collect-button:hover {
            background-color: var(--surface-color-hover);
          }

          .collect-button.active {
            background-color: var(--primary-color);
            color: var(--background-color);
          }

          .table-wrapper {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .table-container {
            min-width: 100%;
            background-color: var(--surface-color);
            border-radius: var(--border-radius);
            border: 1px solid var(--surface-color-hover);
            animation: fadeIn 0.25s ease-out;
          }

          .data-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            color: var(--text-color);
            font-size: clamp(0.875rem, 1vw, 1rem);
          }

          .data-table th,
          .data-table td {
            padding: clamp(0.5rem, 1vw, 0.875rem);
            text-align: left;
            border-bottom: 1px solid var(--surface-color-hover);
          }

          .data-table th {
            font-weight: 600;
            color: var(--text-color);
          }

          .data-table td small {
            color: var(--text-color-secondary);
          }

          .terminate-button {
            padding: 0.4em 0.8em;
            border-radius: var(--border-radius);
            border: 1px solid var(--error-text);
            font-size: clamp(0.75rem, 1vw, 0.85rem);
            font-weight: 500;
            background-color: transparent;
            color: var(--error-text);
            cursor: pointer;
            transition: all var(--transition-duration);
            white-space: nowrap;
          }

          .terminate-button:hover {
            background-color: var(--error-bg);
          }

          /* Status indicators */
          .status-succeeded {
            color: var(--success-text);
            font-weight: 500;
          }

          .status-failed {
            color: var(--error-text);
            font-weight: 500;
          }

          /* Error and loading states */
          .error-message {
            padding: 1rem;
            margin-bottom: 1rem;
            background-color: var(--error-bg);
            color: var(--error-text);
            border-radius: var(--border-radius);
            font-size: clamp(0.875rem, 1vw, 1rem);
          }

          .loading {
            text-align: center;
            padding: 1.5rem;
            color: var(--text-color-secondary);
            font-size: clamp(0.875rem, 1vw, 1rem);
          }

          /* Responsive breakpoints */
          @media (min-width: 1400px) {
            .app-container {
              max-width: var(--container-max-width-xl);
              padding: var(--container-padding-xl);
            }
          }

          @media (max-width: 1200px) {
            .app-container {
              max-width: var(--container-max-width-lg);
              padding: var(--container-padding-lg);
            }
          }

          @media (max-width: 992px) {
            .app-container {
              max-width: var(--container-max-width-md);
              padding: var(--container-padding-md);
            }
          }

          @media (max-width: 768px) {
            .app-container {
              max-width: var(--container-max-width-sm);
              padding: var(--container-padding-sm);
            }

            .hide-sm {
              display: none;
            }

            .button-container {
              flex-direction: column;
              width: 100%;
              max-width: 280px;
              margin: 0 auto 1rem;
            }

            .collect-button {
              width: 100%;
            }

            .action-buttons {
              flex-direction: column;
              padding: 0;
            }

            .refresh-button {
              width: 100%;
            }
          }

          /* Animations */
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Print styles */
          @media print {
            .button-container, .action-buttons {
              display: none;
            }

            .app-container {
              box-shadow: none;
              padding: 0;
            }

            .data-table th,
            .data-table td {
              border: 1px solid var(--surface-color-hover);
            }
          }
`;







export const ToastStyle = `
.toast-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 100%;
  }

  .toast-card {
    width: 100%;
    max-width: 290px;
    height: 70px;
    background: #353535;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: left;
    backdrop-filter: blur(10px);
    transition: 0.5s ease-in-out;
    cursor: pointer;
    animation: slideIn 0.3s ease-out forwards;
  }

  .toast-card:hover {
    transform: scale(1.05);
  }

  .toast-image {
    width: 50px;
    height: 50px;
    margin-left: 10px;
    border-radius: 10px;
    background: linear-gradient(#d7cfcf, #9198e5);
    transition: 0.5s ease-in-out;
  }

  .toast-card:hover .toast-image {
    background: linear-gradient(#9198e5, #712020);
  }

  .toast-content {
    width: calc(100% - 90px);
    margin-left: 10px;
    color: white;
    font-family: 'Poppins', sans-serif;
  }

  .toast-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .toast-title {
    font-size: 16px;
    font-weight: bold;
  }

  .toast-timestamp {
    font-size: 10px;
  }

  .toast-message {
    font-size: 12px;
    font-weight: lighter;
    margin: 0;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }`;