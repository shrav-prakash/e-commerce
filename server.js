const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

dotenv.config();

const app = express();
const store = new mongoStore({ uri: process.env.mongoURL, collection: 'sessions' });
const csrfProtection = csrf();

app.set('view engine', 'pug');

const User = require('./models/user');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');
const errorRoutes = require('./routes/notFound');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: process.env.secret, resave: false, saveUninitialized: false, store: store }));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id).then(user => {
        req.user = user
        next();
    });
});

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(authRoutes);
app.use(errorRoutes);

mongoose.connect(process.env.mongoURL).then(() => {
    console.log("App is currently running on port 8080");
    app.listen(8080);
}).catch(err => {
    console.log(err);
})