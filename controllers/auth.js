const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: 'login',
        pageTitle: 'Login',
        isLoggedIn: false
    });
}

exports.postLogin = (req, res, next) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.redirect('/sign-up');
        }
        bcrypt.compare(req.body.password, user.password).then(result => {
            if (!result) {
                return res.redirect('/login');
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
    });
}

exports.getSignUp = (req, res, next) => {
    res.render('auth/signup', {
        path: 'signup',
        pageTitle: 'Sign Up',
        isLoggedIn: false
    });
}

exports.postSignUp = (req, res, next) => {
    const uname = req.body.uname;
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }).then(user => {
        if (user) {
            return res.redirect('/sign-up');
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
        })
    }).catch(err => {
        console.log(err);
    })

}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/login');
    })
}

