const { check } = require('express-validator');

exports.prodValidator = [
    check('title').trim().notEmpty().withMessage('Title cannot be empty').isString().withMessage('Title must be a string'),
    // check('img').trim().isURL().withMessage('Image Link must be in the form of a valid URL'),
    check('price').trim().isNumeric().withMessage('Price must be a number'),
    check('desc').trim().notEmpty().withMessage('Description cannot be left empty')
];