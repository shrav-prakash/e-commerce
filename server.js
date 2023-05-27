const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const mongoConnect = require('./util/db').mongoConnect;

dotenv.config();

const app = express();

app.set('view engine', 'pug');

const User = require('./models/user');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');

const errorController = require('./controllers/errors');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    User.findUserById("6470b6a392437f2758e9326e").then(user => {
        req.user = user
        next();
    }).catch(err => console.log(err));
});
app.use('/admin', adminRoutes);
app.use(userRoutes);

app.use(errorController.notFoundError);

mongoConnect((client) => {
    console.log("App is running on port 8080");
    app.listen(8080);
});