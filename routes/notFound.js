const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errors');

router.get('/user-not-found', errorController.userNotFound);

router.use('*', errorController.notFoundError);

module.exports = router;