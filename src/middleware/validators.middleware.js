const { body, validationResult } = require("express-validator");

/**
 * Middleware to handle validation errors returned by express-validator
 */
function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Input validation failed",
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
}

/**
 * Validation rules for user registration
 */
const validateRegister = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),
    handleValidationErrors
];

/**
 * Validation rules for user login
 */
const validateLogin = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
    handleValidationErrors
];

/**
 * Validation rules for transaction creation
 */
const validateTransaction = [
    body("fromAccount")
        .trim()
        .isMongoId()
        .withMessage("fromAccount must be a valid MongoDB ObjectId"),
    body("toAccount")
        .trim()
        .isMongoId()
        .withMessage("toAccount must be a valid MongoDB ObjectId"),
    body("amount")
        .isFloat({ gt: 0 })
        .withMessage("Amount must be a positive number greater than 0"),
    body("idempotencyKey")
        .trim()
        .notEmpty()
        .withMessage("idempotencyKey is required"),
    handleValidationErrors
];

/**
 * Validation rules for initial funds deposit
 */
const validateInitialFunds = [
    body("toAccount")
        .trim()
        .isMongoId()
        .withMessage("toAccount must be a valid MongoDB ObjectId"),
    body("amount")
        .isFloat({ gt: 0 })
        .withMessage("Amount must be a positive number greater than 0"),
    body("idempotencyKey")
        .trim()
        .notEmpty()
        .withMessage("idempotencyKey is required"),
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateTransaction,
    validateInitialFunds
};
