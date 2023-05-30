const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    const isLoggedIn = req.session.isLoggedIn;
    res.render('auth/login', {
        path: 'login',
        pageTitle: 'Login',
        isLoggedIn: isLoggedIn
    });
}

exports.postLogin = (req, res, next) => {
    User.findById("6470b6a392437f2758e9326e").then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(() => {
            res.redirect('/');
        })
    });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/login');
    })
}