const express = require("express")
const authController = require("../controllers/auth.controller")
const { authRateLimiter } = require("../middleware/rateLimiter.middleware")
const { validateRegister, validateLogin } = require("../middleware/validators.middleware")

const router = express.Router()

/* POST /api/auth/register */
router.post("/register", authRateLimiter, validateRegister, authController.userRegisterController)

/* POST /api/auth/login */
router.post("/login", authRateLimiter, validateLogin, authController.userLoginController)

/**
 * - POST /api/auth/logout
 */
router.post("/logout", authController.userLogoutController)

module.exports = router