const express = require('express');
const path = require('path')

const productController = require('../controllers/admin.js');
const { product } = require('../models/product.js');

const router = express.Router();

router.get('/add-product', productController.getAddProd);

router.post('/add-product', productController.postAddProd);

router.get('/admin-products', productController.dispProds);

router.get('/edit-product/:prodId', productController.getEditProd);

router.post('/edit-product', productController.postEditProd);

router.get('/delete-product/:prodId', productController.deleteProd);

module.exports = router;