const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator')

exports.getLogin = (req, res, next) => {
    let msg = req.flash('Error');
    if (msg.length > 0) {
        msg = msg[0]
    } else {
        msg = null;
    }
    res.render('auth/login', {
        path: 'login',
        pageTitle: 'Login',
        errorMsg: msg,
        oldInput: {
            email: "",
            password: ""
        },
        validationErrors: []
    });
}

exports.postLogin = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render(
            'auth/login', {
            path: 'login',
            pageTitle: 'Login',
            errorMsg: errors.errors[0].msg,
            oldInput: {
                email: req.body.email,
                password: req.body.password
            },
            validationErrors: errors.array()
        })
    }

    User.findOne({ email: req.body.email }).then(user => {
        bcrypt.compare(req.body.password, user.password).then(result => {
            if (!result) {
                return res.status(422).render(
                    'auth/login', {
                    path: 'login',
                    pageTitle: 'Login',
                    errorMsg: 'Incorrect Password',
                    oldInput: {
                        email: req.body.email,
                        password: req.body.password
                    },
                    validationErrors: [{ path: 'password' }]
                })
            }
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(() => {
                return res.redirect('/');
            });
        }).catch(err => {
            console.log(err);
            return res.redirect('/login');
        })
    })
}

exports.getSignUp = (req, res, next) => {
    let msg = req.flash('Error');
    if (msg.length > 0) {
        msg = msg[0]
    } else {
        msg = null;
    }
    res.render('auth/signup', {
        path: 'signup',
        pageTitle: 'Sign Up',
        errorMsg: msg,
        oldInput: {
            uname: "",
            email: "",
            password: "",
            repassword: ""
        },
        validationErrors: []
    });
}

exports.postSignUp = (req, res, next) => {
    const uname = req.body.uname;
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: 'signup',
            pageTitle: 'Sign Up',
            errorMsg: errors.array()[0].msg,
            oldInput: {
                uname: req.body.uname,
                email: req.body.email,
                password: req.body.password,
                repassword: req.body.repassword
            },
            validationErrors: errors.array()
        });
    }

    bcrypt.hash(password, 12).then(hashedPassword => {
        const newUser = new User({
            username: uname,
            email: email,
            password: hashedPassword,
            cart: { items: [] }
        })
        newUser.save().then(() => {
            res.redirect('/login');
        })
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/login');
    })
}

