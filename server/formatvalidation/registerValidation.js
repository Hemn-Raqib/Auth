import { check } from 'express-validator';

export const Validation1 = [
  // Email Validation
  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email should not be empty')
    .isEmail()
    .withMessage('Invalid email format')
    .isLength({ max: 40 })
    .withMessage('Email should not exceed 40 characters')
    .custom((value) => {
      const domainPattern = /^(gmail|yahoo|hotmail)\.(com|net|org|edu|gov)$/i;
      const domain = value.split('@')[1];
      if (!domainPattern.test(domain)) {
        throw new Error('Unsupported email domain');
      }
      return true;
    }),

  // Password Validation
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Password should not be empty')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password length should be between 8 and 20 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,20}$/)
    .withMessage('Password should contain at least one lowercase letter, one uppercase letter, and one digit'),

  // Username Validation
  check('username')
    .optional() // Only check if the field is provided
    .trim()
    .matches(/^[a-zA-Z0-9_-]{4,20}$/)
    .withMessage('Username must be between 4 and 20 characters and contain only letters, numbers, "-", or "_"')
];



export const Validation2 = [
    // Email Validation
    check('email')
      .trim()
      .notEmpty()
      .withMessage('Email should not be empty')
      .isEmail()
      .withMessage('Invalid email format')
      .isLength({ max: 40 })
      .withMessage('Email should not exceed 40 characters')
      .custom((value) => {
        const domainPattern = /^(gmail|yahoo|hotmail)\.(com|net|org|edu|gov)$/i;
        const domain = value.split('@')[1];
        if (!domainPattern.test(domain)) {
          throw new Error('Unsupported email domain');
        }
        return true;
      }),
  
    // Password Validation
    check('password')
      .trim()
      .notEmpty()
      .withMessage('Password should not be empty')
      .isLength({ min: 8, max: 20 })
      .withMessage('Password length should be between 8 and 20 characters')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,20}$/)
      .withMessage('Password should contain at least one lowercase letter, one uppercase letter, and one digit'),
  
    // Username Validation
    check('username')
      .optional() // Only check if the field is provided
      .trim()
      .matches(/^[a-zA-Z0-9_-]{4,20}$/)
      .withMessage('Username must be between 4 and 20 characters and contain only letters, numbers, "-", or "_"'),
      check('verificationCode')
      .trim()
      .notEmpty()
      .withMessage('Code should not be empty')
      .isLength({ min: 6, max: 6 })
      .withMessage('Code must be exactly 6 digits')
      .matches(/^\d{6}$/)
      .withMessage('Code must contain only digits'),
  ];



  export const Validation3 = [
    // Email Validation
    check('email')
      .trim()
      .notEmpty()
      .withMessage('Email should not be empty')
      .isEmail()
      .withMessage('Invalid email format')
      .isLength({ max: 40 })
      .withMessage('Email should not exceed 40 characters')
      .custom((value) => {
        const domainPattern = /^(gmail|yahoo|hotmail)\.(com|net|org|edu|gov)$/i;
        const domain = value.split('@')[1];
        if (!domainPattern.test(domain)) {
          throw new Error('Unsupported email domain');
        }
        return true;
      }),
  
    // Password Validation
    check('password')
      .trim()
      .notEmpty()
      .withMessage('Password should not be empty')
      .isLength({ min: 8, max: 20 })
      .withMessage('Password length should be between 8 and 20 characters')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,20}$/)
      .withMessage('Password should contain at least one lowercase letter, one uppercase letter, and one digit')
  ];





  export const Validation4 = [
    // Email Validation
    check('email')
      .trim()
      .notEmpty()
      .withMessage('Email should not be empty')
      .isEmail()
      .withMessage('Invalid email format')
      .isLength({ max: 40 })
      .withMessage('Email should not exceed 40 characters')
      .custom((value) => {
        const domainPattern = /^(gmail|yahoo|hotmail)\.(com|net|org|edu|gov)$/i;
        const domain = value.split('@')[1];
        if (!domainPattern.test(domain)) {
          throw new Error('Unsupported email domain');
        }
        return true;
      }),
  
    // Password Validation
    check('password')
      .trim()
      .notEmpty()
      .withMessage('Password should not be empty')
      .isLength({ min: 8, max: 20 })
      .withMessage('Password length should be between 8 and 20 characters')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,20}$/)
      .withMessage('Password should contain at least one lowercase letter, one uppercase letter, and one digit'),
  
      check('verificationCode')
      .trim()
      .notEmpty()
      .withMessage('Code should not be empty')
      .isLength({ min: 6, max: 6 })
      .withMessage('Code must be exactly 6 digits')
      .matches(/^\d{6}$/)
      .withMessage('Code must contain only digits'),
  ];