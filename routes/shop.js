const express = require('express');

const productController = require('../controllers/user');

const router = express.Router();

router.get('/', productController.getShop);

router.get('/products', productController.getProds);

router.get('/products/:prodId', productController.getProdDetails);

router.get('/orders', productController.getOrders);

router.get('/cart', productController.getCart);

router.post('/cart', productController.postCart);

router.post('/delete-cart', productController.deleteCart);

router.get('/orders', productController.getOrders);

router.post('/place-order', productController.postOrders);

module.exports = router;