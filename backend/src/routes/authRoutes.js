const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/registrar', AuthController.registrar);
router.post('/login', AuthController.login);
router.post('/google', AuthController.loginGoogle);

module.exports = router;