const Product = require("../models/product");
const User = require("../models/user");

exports.getProds = (req, res, next) => {
    Product.fetchProds(products => {
        res.render('user/prodList', {
            products: products,
            pageTitle: 'Product List',
            path: 'prodList'
        });
    });
};

exports.getProdDetails = (req, res, next) => {
    const prodId = req.params.prodId;
    Product.getProdById(prodId, prodDetails => {
        res.render('user/productDetails', {
            product: prodDetails,
            pageTitle: prodDetails.title,
            path: 'prodList'
        })
    })
}

exports.getShop = (req, res, next) => {
    Product.fetchProds(products => {
        res.render('user/index', {
            products: products,
            pageTitle: 'Shop',
            path: 'shop'
        });
    });
};

exports.getCart = (req, res, next) => {
    Product.fetchProds(products => {
        const user = req.user;
        let cart = [];
        let totCost = 0;
        for (const product of products) {
            const item = user.cart.items.find(item => item.productId.equals(product._id));
            if (item) {
                const price = (parseFloat(product.price) * parseInt(item.qty)).toFixed(2);
                totCost += +price;
                cart = [...cart, { id: item.productId, qty: item.qty, title: product.title, img: product.img, price: price.toString() }];
                console.log(cart, totCost);
            }
        }
        totCost = totCost.toFixed(2).toString();
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
    const newUser = new User(req.user._id, req.user.cart);
    newUser.deleteFromCart(prodId).then(() => {
        Product.fetchProds(products => {
            let cart = [];
            let totCost = 0;
            for (const product of products) {
                const item = req.user.cart.items.find(item => item.productId.equals(product._id));
                if (item) {
                    const price = (parseFloat(product.price) * parseInt(item.qty)).toFixed(2);
                    totCost += +price;
                    cart = [...cart, { id: item.productId, qty: item.qty, title: product.title, img: product.img, price: price.toString() }];
                    console.log(cart, totCost);
                }
            }
            totCost = totCost.toFixed(2).toString();
            console.log("At the end;", cart, totCost);
            return res.render('user/cart', {
                pageTitle: 'Your Cart',
                path: 'cart',
                cart: cart,
                totCost: totCost
            });
        })
    });
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.prodId;
    const newUser = new User(req.user._id, req.user.cart);
    console.log(newUser);
    newUser.addToCart(prodId).then(() => {
        Product.fetchProds(products => {
            let cart = [];
            let totCost = 0;
            for (const product of products) {
                const item = req.user.cart.items.find(item => item.productId.equals(product._id));
                if (item) {
                    const price = (parseFloat(product.price) * parseInt(item.qty)).toFixed(2);
                    totCost += +price;
                    cart = [...cart, { id: item.productId, qty: item.qty, title: product.title, img: product.img, price: price.toString() }];
                    console.log(cart, totCost);
                }
            }
            totCost = totCost.toFixed(2).toString();
            console.log("At the end;", cart, totCost);
            return res.render('user/cart', {
                pageTitle: 'Your Cart',
                path: 'cart',
                cart: cart,
                totCost: totCost
            });
        })
    });
}

exports.getOrders = (req, res, next) => {
    res.render('user/orders', {
        pageTitle: 'Your Orders',
        path: 'orders'
    });
};

exports.postOrders = (req, res, next) => {
    const user = req.user;
    const newUser = new User(user._id, user.cart, user.orders);
    Product.fetchProds(products => {
        newUser.createOrder(products).then(() => {
            req.user.cart = { "items": [] };
            res.redirect('/');
        });

    });
}

exports.getCheckout = (req, res, next) => {
    res.render('user/checkout', {
        pageTitle: 'Checkout',
        path: 'checkout'
    });
};