const User = require('../models/user');
const bcrypt = require('bcryptjs');

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
        errorMsg: msg
    });
}

exports.postLogin = (req, res, next) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            req.flash('Error', 'User with that email does not exist')
            return res.redirect('/login');
        }
        bcrypt.compare(req.body.password, user.password).then(result => {
            if (!result) {
                req.flash('Error', 'Incorrect Password')
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
    let msg = req.flash('Error');
    if (msg.length > 0) {
        msg = msg[0]
    } else {
        msg = null;
    }
    res.render('auth/signup', {
        path: 'signup',
        pageTitle: 'Sign Up',
        errorMsg: msg
    });
}

exports.postSignUp = (req, res, next) => {
    const uname = req.body.uname;
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }).then(user => {
        if (user) {
            req.flash('Error', 'User with that email already exists')
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

