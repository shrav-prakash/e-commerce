const Product = require("../models/product");
const Order = require("../models/order");
const fs = require('fs');
const path = require('path');
const user = require("../models/user");
const pdfDoc = require('pdfkit');

exports.getProds = (req, res, next) => {

    Product.find().then(products => {
        res.render('user/prodList', {
            products: products,
            pageTitle: 'Product List',
            path: 'prodList'
        });
    });
};

exports.getProdDetails = (req, res, next) => {
    const prodId = req.params.prodId;

    Product.findById(prodId).then(prodDetails => {
        res.render('user/productDetails', {
            product: prodDetails,
            pageTitle: prodDetails.title,
            path: 'prodList'
        })
    })
}

exports.getShop = (req, res, next) => {

    Product.find().then(products => {
        res.render('user/index', {
            products: products,
            pageTitle: 'Shop',
            path: 'shop'
        });
    });
};

exports.getCart = (req, res, next) => {
    const user = req.user;
    let cart = [];
    let totCost = 0;

    user.populate('cart.items.productId').then(() => {
        for (const item of user.cart.items) {
            const price = (parseFloat(item.productId.price) * parseInt(item.qty)).toFixed(2);
            totCost += +price;
            cart = [...cart, { id: item.productId._id, qty: item.qty, title: item.productId.title, img: item.productId.img, price: price }];
        }
        totCost = totCost.toFixed(2);
        return res.render('user/cart', {
            pageTitle: 'Your Cart',
            path: 'cart',
            cart: cart,
            totCost: totCost
        });
    })
}

exports.deleteCart = (req, res, next) => {
    const prodId = req.body.prodId;
    const user = req.user;

    user.deleteFromCart(prodId).then(() => {
        let cart = [];
        let totCost = 0;
        user.populate('cart.items.productId').then(() => {
            for (const item of user.cart.items) {
                const price = (parseFloat(item.productId.price) * parseInt(item.qty)).toFixed(2);
                totCost += +price;
                cart = [...cart, { id: item.productId._id, qty: item.qty, title: item.productId.title, img: item.productId.img, price: price }];
            }
            totCost = totCost.toFixed(2);
            return res.render('user/cart', {
                pageTitle: 'Your Cart',
                path: 'cart',
                cart: cart,
                totCost: totCost
            });
        })
    })
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.prodId;
    const user = req.user;

    user.addToCart(prodId).then(() => {
        let cart = [];
        let totCost = 0;
        user.populate('cart.items.productId').then(() => {
            for (const item of user.cart.items) {
                const price = (parseFloat(item.productId.price) * parseInt(item.qty)).toFixed(2);
                totCost += +price;
                cart = [...cart, { id: item.productId._id, qty: item.qty, title: item.productId.title, img: item.productId.img, price: price }];
            }
            totCost = totCost.toFixed(2);
            return res.render('user/cart', {
                pageTitle: 'Your Cart',
                path: 'cart',
                cart: cart,
                totCost: totCost
            });
        })
    })
}

exports.getOrders = (req, res, next) => {
    const user = req.user;

    user.populate('orders').then(() => {
        res.render('user/orders', {
            pageTitle: 'Your Orders',
            path: 'orders',
            orders: user.orders
        });
    })
};

exports.postOrders = (req, res, next) => {
    const user = req.user;
    user.populate('cart.items.productId', 'title price').then(() => {
        let orderItems = [], price = 0;
        for (const item of user.cart.items) {
            orderItems.push({ id: item.productId._id, price: item.productId.price, title: item.productId.title, qty: item.qty });
            price += item.productId.price * item.qty;
        }
        price = price.toFixed(2);
        const order = new Order({ items: orderItems, price: price, custId: user._id });
        order.save().then(result => {
            if (user.orders) {
                user.orders.push(result._id);
            } else {
                user.orders = [result._id];
            }
            user.cart = { "items": [] };
            user.save().then(() => {
                return res.redirect('/orders');
            })
        })
    })
}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);
    Order.findById(orderId).then(order => {
        if (order) {
            if (order.custId.toString() === req.user._id.toString()) {
                const invoice = new pdfDoc();
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
                invoice.pipe(fs.createWriteStream(invoicePath));
                invoice.pipe(res);
                const header = 'Order ID - ' + orderId;
                invoice.fontSize(10).text(header, { align: 'left' }).moveDown().moveDown();
                invoice.fontSize(16).text('INVOICE', { align: 'center' }).moveDown();
                invoice.text('---------------------------------------------', { align: 'center' }).moveDown().moveDown();
                for (const item of order.items) {
                    const iteminfo = item.title + ' x ' + item.qty;
                    const itemprice = '- $' + item.price * item.qty;
                    invoice.fontSize(12).text(iteminfo, { align: 'left', continued: true }).text(itemprice, { align: 'right' }).moveDown();
                }
                const totPrice = 'Total price - $' + order.price;
                invoice.text(totPrice, { align: 'right' });
                invoice.end();
            } else {
                return next(new Error('Unauthorized user'));
            }
        } else {
            return next(new Error('Invalid order ID'));
        }
    }).catch(err => {
        return next(err);
    })
};
