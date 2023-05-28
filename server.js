const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

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
    User.findById("6470b6a392437f2758e9326e").then(user => {
        req.user = user
        next();
    }).catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(userRoutes);

app.use(errorController.notFoundError);

mongoose.connect(process.env.mongoURL).then(() => {
    console.log("App is currently running on port 8080");
    app.listen(8080);
}).catch(err => {
    console.log(err);
})