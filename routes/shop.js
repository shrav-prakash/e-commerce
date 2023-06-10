const express = require('express');

const productController = require('../controllers/user');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/', productController.getShop);

router.get('/products', productController.getProds);

router.get('/products/:prodId', productController.getProdDetails);

router.get('/cart', isAuth, productController.getCart);

router.post('/cart', isAuth, productController.postCart);

router.post('/delete-cart', isAuth, productController.deleteCart);

router.get('/orders', isAuth, productController.getOrders);

router.post('/place-order', isAuth, productController.postOrders);

router.get('/orders/:orderId', isAuth, productController.getInvoice);

module.exports = router;