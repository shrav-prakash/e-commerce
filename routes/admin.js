const express = require('express');

const isAuth = require('../middleware/isAuth');
const productController = require('../controllers/admin.js');
const productValidator = require('../middleware/prodValidator').prodValidator;

const router = express.Router();

router.get('/add-product', isAuth, productController.getAddProd);

router.post('/add-product', isAuth, productValidator, productController.postAddProd);

router.get('/admin-products', isAuth, productController.dispProds);

router.get('/edit-product/:prodId', isAuth, productController.getEditProd);

router.post('/edit-product', isAuth, productValidator, productController.postEditProd);

router.get('/delete-product/:prodId', isAuth, productController.deleteProd);

module.exports = router;