const express = require('express');
const path = require('path')

const isAuth = require('../middleware/isAuth');
const productController = require('../controllers/admin.js');
const { product } = require('../models/product.js');
const { check } = require('express-validator');

const router = express.Router();

router.get('/add-product', isAuth, productController.getAddProd);

router.post('/add-product', isAuth, [
    check('title').trim().notEmpty().withMessage('Title cannot be empty').isString().withMessage('Title must be a string'),
    check('img').trim().isURL().withMessage('Image Link must be in the form of a valid URL'),
    check('price').trim().isNumeric().withMessage('Price must be a number'),
    check('desc').trim().notEmpty().withMessage('Description cannot be left empty')
], productController.postAddProd);

router.get('/admin-products', isAuth, productController.dispProds);

router.get('/edit-product/:prodId', isAuth, productController.getEditProd);

router.post('/edit-product', isAuth, [
    check('title').trim().notEmpty().withMessage('Title cannot be empty').isString().withMessage('Title must be a string'),
    check('img').trim().isURL().withMessage('Image Link must be in the form of a valid URL'),
    check('price').trim().isNumeric().withMessage('Price must be a number'),
    check('desc').trim().notEmpty().withMessage('Description cannot be left empty')
], productController.postEditProd);

router.get('/delete-product/:prodId', isAuth, productController.deleteProd);

module.exports = router;