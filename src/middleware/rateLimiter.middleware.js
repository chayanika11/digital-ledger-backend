const rateLimit = require("express-rate-limit");

/**
 * Rate limiter for authentication routes (Login/Register)
 * Limits requests per IP to prevent brute-force attacks
 */
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // Limit each IP to 15 auth requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many authentication requests from this IP. Please try again after 15 minutes."
    }
});

/**
 * Rate limiter for financial transaction routes
 * Limits requests per IP to prevent rapid automated transfers / API spamming
 */
const transactionRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // Limit each IP to 20 transaction requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Transaction rate limit exceeded. Please slow down and try again."
    }
});

module.exports = {
    authRateLimiter,
    transactionRateLimiter
};
