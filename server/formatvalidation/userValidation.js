import { check, oneOf } from 'express-validator';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

  export const userValidationforcollectinguserdata = [
  check('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .matches(/^[a-zA-Z\s'-]{3,30}$/).withMessage('First Name Must contain only letters, spaces, hyphens, and apostrophes, and be between 3 and 30 characters long'),
    check('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .matches(/^[a-zA-Z\s'-]{3,30}$/).withMessage('Last Name Must contain only letters, spaces, hyphens, and apostrophes, and be between 3 and 30 characters long'),
    check('title')
    .optional({ checkFalsy: true }) // Makes the field optional (allows empty string or undefined)
    .trim()
    .matches(/^[a-zA-Z\s'-]{3,30}$/).withMessage('Title Must contain only letters, spaces, hyphens, and apostrophes, and be between 3 and 30 characters long'),

  check('birth_date')
    .notEmpty().withMessage('Birth date is required')
    .isISO8601().toDate().withMessage('Invalid date format'),

  check('country')
    .notEmpty().withMessage('Country is required'),

  check('city')
    .notEmpty().withMessage('City is required'),
    
    check('interests')
    .isArray().withMessage('interests must be an array')
    .notEmpty().withMessage('At least one interests is required'),
];

export const userValidationforEditUserData = oneOf([
  check('username')
    .optional()
    .trim()
    .notEmpty().withMessage('User Name is required')
    .matches(/^[a-zA-Z0-9_-]{4,20}$/).withMessage('Username must be 4-20 characters and can contain letters, numbers, underscores, and hyphens'),
  check('firstName')
    .optional()
    .trim()
    .notEmpty().withMessage('First name is required')
    .matches(/^[a-zA-Z\s'-]{3,30}$/).withMessage('First Name Must contain only letters, spaces, hyphens, and apostrophes, and be between 3 and 30 characters long'),
  check('lastName')
    .optional()
    .trim()
    .notEmpty().withMessage('Last name is required')
    .matches(/^[a-zA-Z\s'-]{3,30}$/).withMessage('Last Name Must contain only letters, spaces, hyphens, and apostrophes, and be between 3 and 30 characters long'),
  check('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title is required')
    .matches(/^[a-zA-Z\s'-]{3,30}$/).withMessage('Title Must contain only letters, spaces, hyphens, and apostrophes, and be between 3 and 30 characters long'),
  check('birth_date')
    .optional()
    .notEmpty().withMessage('Birth date is required')
    .isISO8601().toDate().withMessage('Invalid date format'),
  check('country')
    .optional()
    .notEmpty().withMessage('Country is required'),
  check('city')
    .optional()
    .notEmpty().withMessage('City is required'),
  check('skills')
    .optional()
    .isArray().withMessage('Skills must be an array')
    .notEmpty().withMessage('At least one skill is required'),
  // check('interests')
  //   .optional()
  //   .isArray().withMessage('Interests must be an array')
  //   .notEmpty().withMessage('At least one interest is required'),
  check('bio')
    .optional()
    .isLength({ max: 400 }).withMessage('Bio should not exceed 400 characters'),
  check('socialMedia')
    .optional()
    .isObject().withMessage('Social media must be an object')
    .custom((value) => {
      for (const [platform, url] of Object.entries(value)) {
        if (url && typeof url !== 'string') {
          throw new Error(`Invalid URL for ${platform}`);
        }
      }
      return true;
    })
]);




export const companyValidationForCollectingCompanyData = [
  check('company_name')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .matches(/^[a-zA-Z\s'-]{3,30}$/).withMessage('Company Name Must contain only letters, spaces, hyphens, and apostrophes, and be between 3 and 30 characters long'),
  check('founding_date')
    .notEmpty().withMessage('Founding date is required')
    .isISO8601().toDate().withMessage('Invalid date format'),

  check('industry')
    .trim()
    .notEmpty().withMessage('Industry is required')
    .matches(/^[a-zA-Z\s'-]{3,30}$/).withMessage('Industry Must contain only letters, spaces, hyphens, and apostrophes, and be between 3 and 30 characters long'),
  
    check('business_model')
    .trim()
    .notEmpty().withMessage('business model is required')
    .matches(/^[a-zA-Z0-9\s'-]{3,30}$/).withMessage('business model Must contain only letters, spaces, hyphens, and apostrophes, and be between 3 and 30 characters long'),

  check('company_size')
  .optional()
    .trim()
    .isLength({ max: 30 }).withMessage('Company size should not exceed 20 characters'),

    check('target')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Target should not exceed 50 characters'),

    check('country')
    .notEmpty().withMessage('Country is required'),

  check('city')
    .notEmpty().withMessage('City is required'),

];


export const companyValidationForEditCompanyData  = oneOf([
  check('username')
  .trim()
  .notEmpty()
  .withMessage('User Name should not be empty')
  .matches(/^[a-zA-Z0-9_-]{4,20}$/).withMessage('Username must be 4-20 characters and can contain letters, numbers, underscores, and hyphens'),
  check('company_name')
  .trim()
  .notEmpty().withMessage('Company name is required')
  .isLength({ max: 50 }).withMessage('Company name should not exceed 50 characters')
  .matches(/^[a-zA-Z\s'-]{3,30}$/).withMessage('Company Name must be 3-20 characters and can contain letters, numbers, underscores, and hyphens'),

  check('founding_date')
    .notEmpty().withMessage('Founding date is required')
    .isISO8601().toDate().withMessage('Invalid date format'),

  check('industry')
    .trim()
    .notEmpty().withMessage('Industry is required')
    .matches(/^[a-zA-Z\s'-]{3,30}$/).withMessage('Industry Must contain only letters, spaces, hyphens, and apostrophes, and be between 3 and 30 characters long'),
  
    check('business_model')
    .trim()
    .notEmpty().withMessage('business model is required')
    .matches(/^[a-zA-Z0-9\s'-]{3,30}$/).withMessage('business model Must contain only letters, spaces, hyphens, and apostrophes, and be between 3 and 30 characters long'),

  check('company_size')
  .optional()
    .trim()
    .isLength({ max: 30 }).withMessage('Company size should not exceed 20 characters'),

    check('target')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Target should not exceed 50 characters'),

  check('bio')
    .optional()
    .trim()
    .isLength({ max: 400 }).withMessage('Company bio should not exceed 400 characters'),

    check('country')
    .notEmpty().withMessage('Country is required'),

  check('city')
    .notEmpty().withMessage('City is required'),

  check('mission_statement')
    .optional()
    .trim()
    .isLength({ max: 400 }).withMessage('Mission statement should not exceed 400 characters'),

  check('services')
  .optional()
    .isArray().withMessage('Services must be an array')
    .custom((value) => {
      if (value.length > 10) {
        throw new Error('Maximum 10 services are allowed');
      }
      return true;
    })
]);













export const otherValidationForCollectingOtherData = [
  check('entity_name')
    .trim()
    .notEmpty().withMessage('Entity name is required')
    .matches(/^[a-zA-Z\s'-]{3,30}$/).withMessage('Entity Name Must contain only letters, spaces, hyphens, and apostrophes, and be between 3 and 30 characters long'),
  check('entity_type')
    .trim()
    .notEmpty().withMessage('Entity type is required')
    .matches(/^[a-zA-Z\s'-]{3,30}$/).withMessage('Entity Type Must contain only letters, spaces, hyphens, and apostrophes, and be between 3 and 30 characters long'),
  check('entity_size')
  .optional()  
  .trim()
    .matches(/^[a-zA-Z\s'-]{3,30}$/).withMessage('Entity size Must contain only letters, spaces, hyphens, and apostrophes, and be between 3 and 30 characters long'),
  check('target')
  .optional()  
  .trim()
    .isLength({ max: 50 }).withMessage('Target should not exceed 50 characters'),
  check('founding_date')
    .notEmpty().withMessage('Founding date is required')
    .isISO8601().toDate().withMessage('Invalid date format'),

    check('country')
    .notEmpty().withMessage('Country is required'),

  check('city')
    .notEmpty().withMessage('City is required'),

];









export const otherValidationForEditOtherData  = oneOf([
  check('username')
  .trim()
  .notEmpty()
  .withMessage('User Name should not be empty')
  .matches(/^[a-zA-Z0-9_-]{4,20}$/).withMessage('Username must be 4-20 characters and can contain letters, numbers, underscores, and hyphens'),
  check('entity_name')
  .trim()
  .notEmpty().withMessage('Entity name is required')
  .isLength({ max: 50 }).withMessage('Entity name should not exceed 50 characters')
  .matches(/^[a-zA-Z\s'-]{3,30}$/).withMessage('Entity Name must be 3-20 characters and can contain letters, numbers, underscores, and hyphens'),
  check('entity_type')
  .trim()
  .notEmpty().withMessage('Entity Type is required')
  .isLength({ max: 50 }).withMessage('Entity Type should not exceed 50 characters')
  .matches(/^[a-zA-Z\s'-]{3,30}$/).withMessage('Entity Type must be 3-20 characters and can contain letters, numbers, underscores, and hyphens'),
  
  check('entity_size')
  .optional()
  .trim()
  .matches(/^[a-zA-Z\s'-]{3,30}$/).withMessage('Entity size Must contain only letters, spaces, hyphens, and apostrophes, and be between 3 and 30 characters long'),
  check('target')
  .optional()
  .trim()
  .isLength({ max: 50 }).withMessage('Target should not exceed 50 characters'),

  check('founding_date')
    .notEmpty().withMessage('Founding date is required')
    .isISO8601().toDate().withMessage('Invalid date format'),

  check('bio')
    .optional()
    .trim()
    .isLength({ max: 400 }).withMessage('Company bio should not exceed 400 characters'),

    check('country')
    .notEmpty().withMessage('Country is required'),

  check('city')
    .notEmpty().withMessage('City is required'),

  check('mission_statement')
    .optional()
    .trim()
    .isLength({ max: 400 }).withMessage('Mission statement should not exceed 400 characters'),

  check('techs')
  .optional()
    .isArray().withMessage('Technologies must be an array')
    .custom((value) => {
      if (value.length > 10) {
        throw new Error('Maximum 10 Technologies are allowed');
      }
      return true;
    })
]);