const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const isAuth = require('../middleware/isAuth');
const { check } = require('express-validator');
const User = require('../models/user');

router.get('/login', authController.getLogin);

router.post('/login', [
    check('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail().custom(async value => {
        return User.findOne({ email: value }).then(user => {
            if (user === null) {
                return Promise.reject('User with the given email address does not exist');
            }
        })
    }),
    check('password').trim().isLength({ min: 8 }).withMessage('Password must be atleast 8 characters long')
], authController.postLogin);

router.get('/sign-up', authController.getSignUp)

router.post('/sign-up', [
    check('uname').trim().isLength({ min: 5 }).withMessage('Username must be atleast 5 characters long').isAlphanumeric().withMessage('Username must contain only letters and numbers'),
    check('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail().custom(async value => {
        return User.findOne({ email: value }).then(user => {
            if (user) {
                return Promise.reject('User with this email already exists');
            }
        })
    }),
    check('password').trim().isLength({ min: 8 }).withMessage('Password must be atleast 8 characters long'),
    check('repassword').trim().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must match!');
        }
        return true;
    })], authController.postSignUp);

router.post('/logout', isAuth, authController.postLogout);

module.exports = router;