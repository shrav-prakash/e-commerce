const { check } = require('express-validator');
const User = require('../models/user');

exports.loginValidation = [
    check('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail().custom(async value => {
        return User.findOne({ email: value }).then(user => {
            if (user === null) {
                return Promise.reject('User with the given email address does not exist');
            }
        })
    }),
    check('password').trim().isLength({ min: 8 }).withMessage('Password must be atleast 8 characters long')
];

exports.signupValidation = [
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
    })
]