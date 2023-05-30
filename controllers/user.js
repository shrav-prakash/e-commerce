const Product = require("../models/product");
const Order = require("../models/order");

exports.getProds = (req, res, next) => {
    const isLoggedIn = req.session.isLoggedIn;
    Product.find().then(products => {
        res.render('user/prodList', {
            products: products,
            pageTitle: 'Product List',
            path: 'prodList',
            isLoggedIn: isLoggedIn
        });
    });
};

exports.getProdDetails = (req, res, next) => {
    const prodId = req.params.prodId;
    const isLoggedIn = req.session.isLoggedIn;
    Product.findById(prodId).then(prodDetails => {
        res.render('user/productDetails', {
            product: prodDetails,
            pageTitle: prodDetails.title,
            path: 'prodList',
            isLoggedIn: isLoggedIn
        })
    })
}

exports.getShop = (req, res, next) => {
    const isLoggedIn = req.session.isLoggedIn;
    Product.find().then(products => {
        res.render('user/index', {
            products: products,
            pageTitle: 'Shop',
            path: 'shop',
            isLoggedIn: isLoggedIn
        });
    });
};

exports.getCart = (req, res, next) => {
    const user = req.user;
    let cart = [];
    let totCost = 0;
    const isLoggedIn = req.session.isLoggedIn;
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
            totCost: totCost,
            isLoggedIn: isLoggedIn
        });
    })
}

exports.deleteCart = (req, res, next) => {
    const prodId = req.body.prodId;
    const user = req.user;
    const isLoggedIn = req.session.isLoggedIn;
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
                totCost: totCost,
                isLoggedIn: isLoggedIn
            });
        })
    })
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.prodId;
    const user = req.user;
    const isLoggedIn = req.session.isLoggedIn;
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
                totCost: totCost,
                isLoggedIn: isLoggedIn
            });
        })
    })
}

exports.getOrders = (req, res, next) => {
    const user = req.user;
    const isLoggedIn = req.session.isLoggedIn;
    user.populate('orders').then(() => {
        res.render('user/orders', {
            pageTitle: 'Your Orders',
            path: 'orders',
            orders: user.orders,
            isLoggedIn: isLoggedIn
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
