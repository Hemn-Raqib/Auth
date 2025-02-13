export const handleError = (error) => {
  if (!error) return 'An unexpected error occurred';
  
  // Handle axios response errors
  if (error.response) {
    const { status, data } = error.response;
    
    // Handle specific error codes
    switch (data.code) {
      case 'EMAIL_EXISTS':
        return 'This email is already registered';
      case 'USERNAME_EXISTS':
        return 'This username is already taken';
      case 'INVALID_CODE':
        return 'Invalid verification code';
      case 'CODE_EXPIRED':
        return 'Verification code has expired';
      case 'INVALID_CREDENTIALS':
        return 'Invalid email or password';
      case 'VALIDATION_ERROR':
        return Array.isArray(data.details) 
          ? data.details.map(err => err.msg).join(', ')
          : 'Please check your input';
      case 'VERIFICATION_REQUIRED':
        return 'Additional verification required';
      default:
        // Handle HTTP status codes
        if (status === 429) return 'Too many attempts, please try again later';
        if (status === 403) return 'Access denied';
        if (status === 404) return 'Resource not found';
        if (status >= 500) return 'Server error, please try again later';
        return data.message || 'An unexpected error occurred';
    }
  }
  
  // Handle network errors
  if (error.request) {
    return "Cannot connect to server. Please check your internet connection";
  }
  
  // Handle other errors
  return error.message || "An unexpected error occurred";
};













  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const domainPattern = /^[A-Za-z0-9._%+-]+@(?:gmail|yahoo|hotmail)\.(?:com|net|org|edu|gov)$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,20}$/;
  const usernameRegex = /^[a-zA-Z0-9_-]{4,20}$/;

  
  
  export const validateFields = (email, password, username, mode) => {
    
  
    if (!email || !password) {
      return { msg: 'All fields must be filled', case: false };
    }
  
    if (mode === "signup") {
      if (!email || !password || !username) {
        return { msg: 'All fields must be filled', case: false };
      }
      if (!usernameRegex.test(username)) {
        return { msg: 'Username must contain lower, upper, numbers, and -, _', case: false };
      }
    }
  
    if (!emailPattern.test(email)) {
      return { msg: 'Please enter a valid email', case: false };
    }
  
    if (!domainPattern.test(email)) {
      return { msg: 'Please enter a valid Domain', case: false };
    }
  
    if (!passwordRegex.test(password)) {
      return { msg: 'Password must contain minimum 8 characters, 1 uppercase, 1 lowercase and 1 number', case: false };
    }
  
    return { msg: '', case: true };
  };
  
















