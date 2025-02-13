import React, { createContext, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  InfoIcon
} from 'lucide-react';
import { useScreenSize } from './ScreenSizeContext';

const ToastContext = createContext(null);

const styles = `
  .toast-container {
    position: fixed;
    z-index: 50;
    padding: 8px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: var(--background-input, #ffffff);
    color: var(--text-primary);
    font-size: 14px;
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;
  }

  .toast-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .toast-icon {
    flex-shrink: 0;
  }

  /* Screen size specific styles */
  .screen-small .toast-container {
    width: 90vw !important;
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%);
    padding: 12px;
    font-size: 14px;
  }

  .screen-small .toast-top-left,
  .screen-small .toast-top-right,
  .screen-small .toast-top-center {
    top: 12px;
  }

  .screen-small .toast-bottom-left,
  .screen-small .toast-bottom-right,
  .screen-small .toast-bottom-center {
    bottom: 12px;
  }

  .screen-small .toast-center,
  .screen-small .toast-center-left,
  .screen-small .toast-center-right {
    top: 50%;
    transform: translate(-50%, -50%);
  }

  /* Position Classes */
  .toast-top-left {
    top: 16px;
    left: 16px;
  }

  .toast-top-right {
    top: 16px;
    right: 16px;
  }

  .toast-bottom-left {
    bottom: 16px;
    left: 16px;
  }

  .toast-bottom-right {
    bottom: 16px;
    right: 16px;
  }

  .toast-top-center {
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
  }

  .toast-bottom-center {
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
  }

  .toast-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .toast-center-left {
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
  }

  .toast-center-right {
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
  }

  /* Responsive Styles */
  @media (min-width: 640px) {
    .toast-container {
      padding: 12px 24px;
      font-size: 16px;
    }

    .toast-top-left { top: 24px; left: 24px; }
    .toast-top-right { top: 24px; right: 24px; }
    .toast-bottom-left { bottom: 24px; left: 24px; }
    .toast-bottom-right { bottom: 24px; right: 24px; }
    .toast-center-left { left: 24px; }
    .toast-center-right { right: 24px; }
  }

  @media (min-width: 1024px) {
    .toast-container {
      padding: 16px 32px;
      font-size: 18px;
    }

    .toast-top-left { top: 32px; left: 32px; }
    .toast-top-right { top: 32px; right: 32px; }
    .toast-bottom-left { bottom: 32px; left: 32px; }
    .toast-bottom-right { bottom: 32px; right: 32px; }
    .toast-center-left { left: 32px; }
    .toast-center-right { right: 32px; }
  }

  /* Width classes based on screen size */
  .screen-small .toast-width-center,
  .screen-small .toast-width-side {
    width: 90vw;
    max-width: none;
  }

  .screen-medium .toast-width-center {
    width: 60vw;
  }

  .screen-medium .toast-width-side {
    width: auto;
    max-width: 384px;
  }

  .screen-large .toast-width-center {
    width: 40vw;
  }

  .screen-large .toast-width-side {
    width: auto;
    max-width: 384px;
  }

  /* Toast Types with better contrast */
  .toast-success {
    background-color: rgba(34, 197, 94, 0.15);
    border: 1px solid rgba(34, 197, 94, 0.3);
  }

  .toast-error {
    background-color: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .toast-warning {
    background-color: rgba(234, 179, 8, 0.15);
    border: 1px solid rgba(234, 179, 8, 0.3);
  }

  .toast-info {
    background-color: rgba(59, 130, 246, 0.15);
    border: 1px solid rgba(59, 130, 246, 0.3);
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .toast-container {
      background-color: rgba(30, 41, 59, 0.9);
    }

    .toast-success {
      background-color: rgba(34, 197, 94, 0.2);
    }

    .toast-error {
      background-color: rgba(239, 68, 68, 0.2);
    }

    .toast-warning {
      background-color: rgba(234, 179, 8, 0.2);
    }

    .toast-info {
      background-color: rgba(59, 130, 246, 0.2);
    }
  }
`;

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const screenSize = useScreenSize();

  const showToast = (message, options = {}) => {
    const {
      position = screenSize === 'small' ? 'bottom-center' : 'bottom-right',
      duration = 2000,
      className = '',
      type = 'info',
      icon = null,
      iconColor = null
    } = options;

    setToast({ 
      message, 
      position, 
      className,
      type,
      icon,
      iconColor
    });

    setTimeout(() => setToast(null), duration);
  };

  const getIcon = (type, customIcon) => {
    if (customIcon) return customIcon;

    const icons = {
      success: CheckCircle2,
      error: XCircle,
      warning: AlertCircle,
      info: InfoIcon
    };

    const IconComponent = icons[type] || icons.info;
    const size = screenSize === 'small' ? 20 : 24;
    return <IconComponent size={size} color={getIconColor(type)} />;
  };

  const getIconColor = (type) => {
    const colors = {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#eab308',
      info: '#3b82f6'
    };
    return colors[type] || colors.info;
  };

  const getAnimationVariants = (position) => {
    if (screenSize === 'small') {
      return {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 50 }
      };
    }

    const baseVariants = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    };

    const positionAnimations = {
      'top-left': { x: -50 },
      'top-right': { x: 50 },
      'bottom-left': { y: 50, x: -50 },
      'bottom-right': { y: 50, x: 50 },
      'top-center': { y: -50 },
      'bottom-center': { y: 50 },
      'center': { scale: 0.8 },
      'center-left': { scale: 0.9 },
      'center-right': { scale: 0.9 }
    };

    const positionAnimation = positionAnimations[position] || {};

    return {
      initial: { ...baseVariants.initial, ...positionAnimation },
      animate: { ...baseVariants.animate, ...Object.fromEntries(Object.keys(positionAnimation).map(key => [key, 0])) },
      exit: { ...baseVariants.exit, ...positionAnimation }
    };
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <style>{styles}</style>
      {children}
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            variants={getAnimationVariants(toast.position)}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`
              toast-container 
              toast-${toast.position}
              toast-${toast.type}
              ${toast.position.includes('center') ? 'toast-width-center' : 'toast-width-side'}
              ${toast.className}
              screen-${screenSize}
            `}
          >
            <div className="toast-content">
              <span className="toast-icon">
                {getIcon(toast.type, toast.icon)}
              </span>
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const useCustomToast = () => {
  const { showToast } = useToast();
  const screenSize = useScreenSize();

  const getDefaultPosition = () => {
    if (screenSize === 'small') return 'bottom-center';
    return 'bottom-right';
  };

  return {
    success: (message, options = {}) => {
      showToast(message, {
        type: 'success',
        position: getDefaultPosition(),
        duration: 3000,
        ...options
      });
    },
    error: (message, options = {}) => {
      showToast(message, {
        type: 'error',
        position: getDefaultPosition(),
        duration: 4000,
        ...options
      });
    },
    warning: (message, options = {}) => {
      showToast(message, {
        type: 'warning',
        position: getDefaultPosition(),
        duration: 4000,
        ...options
      });
    },
    info: (message, options = {}) => {
      showToast(message, {
        type: 'info',
        position: getDefaultPosition(),
        duration: 3000,
        ...options
      });
    }
  };
};

export default ToastProvider;