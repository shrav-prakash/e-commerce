const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

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

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + '-' + file.originalname;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('img'));
app.use(session({ secret: process.env.secret, resave: false, saveUninitialized: false, store: store }));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id).then(user => {
        req.user = user
        next();
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
});

app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(authRoutes);
app.use(errorRoutes);

app.use((error, req, res, next) => {
    res.status(500).render('errors/500', { pageTitle: 'Error Code - 500' });
});

mongoose.connect(process.env.mongoURL).then(() => {
    console.log("App is currently running on port 8080");
    app.listen(8080);
}).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
})