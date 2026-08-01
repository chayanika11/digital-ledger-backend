const { Router } = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const transactionController = require("../controllers/transaction.controller");
const { transactionRateLimiter } = require('../middleware/rateLimiter.middleware');
const { validateTransaction, validateInitialFunds } = require('../middleware/validators.middleware');

const transactionRoutes = Router();

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */
transactionRoutes.post("/", transactionRateLimiter, authMiddleware.authMiddleware, validateTransaction, transactionController.createTransaction);

/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transaction from system user
 */
transactionRoutes.post("/system/initial-funds", transactionRateLimiter, authMiddleware.authSystemUserMiddleware, validateInitialFunds, transactionController.createInitialFundsTransaction);

module.exports = transactionRoutes;