const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const isAuth = require('../middleware/isAuth');
const authValidator = require('../middleware/authValidator');

router.get('/login', authController.getLogin);

router.post('/login', authValidator.loginValidation, authController.postLogin);

router.get('/sign-up', authController.getSignUp)

router.post('/sign-up', authValidator.signupValidation, authController.postSignUp);

router.post('/logout', isAuth, authController.postLogout);

module.exports = router;