const Product = require('../models/product');
const User = require('../models/user');
const ObjectID = require('mongodb').ObjectId;
const { validationResult } = require('express-validator');

exports.getAddProd = (req, res, next) => {
    res.render('admin/addEditProd', {
        product: { title: '', price: '', desc: '' },
        pageTitle: 'Add Product',
        path: 'admin/addProduct',
        mode: 'add',
        errorMsg: null,
        validationErrors: []
    });
}

exports.postAddProd = (req, res, next) => {
    if (!req.file) {
        console.log(req.body);
        return res.status(422).render('admin/addEditProd', {
            product: { title: req.body.title, price: req.body.price, desc: req.body.desc },
            pageTitle: 'Add Product',
            path: 'admin/addProduct',
            mode: 'add',
            errorMsg: 'Attached file is not an image',
            validationErrors: []
        });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/addEditProd', {
            product: { title: req.body.title, price: req.body.price, desc: req.body.desc },
            pageTitle: 'Add Product',
            path: 'admin/addProduct',
            mode: 'add',
            errorMsg: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    const prod = new Product({ title: req.body.title, img: '\\' + req.file.path, price: req.body.price, desc: req.body.desc });
    prod.save().then(() => {
        res.redirect('/admin/admin-products');
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.dispProds = (req, res, next) => {
    Product.find().then(products => {
        res.render('admin/productList', { products: products, pageTitle: 'Admin Product List', path: 'admin/prodList' });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getEditProd = (req, res, next) => {
    let prodId = req.params.prodId;

    Product.findById(prodId).then(product => {
        if (product === [])
            return res.render('errors/prodNotFound', { pageTitle: 'Product Not Found' })
        res.render('admin/addEditProd', {
            product: product,
            pageTitle: 'Edit Product',
            path: 'admin/editProduct',
            mode: 'edit',
            errorMsg: null,
            validationErrors: []
        });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.postEditProd = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/addEditProd', {
            product: { title: req.body.title, price: req.body.price, desc: req.body.desc, _id: req.body.id },
            pageTitle: 'Edit Product',
            path: 'admin/editProduct',
            mode: 'edit',
            errorMsg: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    console.log(req.file);

    Product.findById(req.body.id).then(prod => {
        prod.title = req.body.title;
        console.log(req.file);
        if (req.file) {
            prod.img = '\\' + req.file.path;
        }
        prod.desc = req.body.desc;
        prod.price = req.body.price;
        prod.save().then(() => {
            res.redirect('/admin/admin-products');
        })
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })

}

exports.deleteProd = (req, res, next) => {
    const prodId = req.params.prodId;

    try {
        Product.findOneAndDelete({ _id: new ObjectID(prodId) }).then(deletedProd => {
            User.find().then(users => {
                for (const user of users) {
                    const index = user.cart.items.findIndex(item => item.productId.toString() === prodId);
                    if (index > -1) {
                        user.deleteFromCart(prodId);
                    }
                }
                if (deletedProd) {
                    return res.redirect('/admin/admin-products');
                } else {
                    return res.render('errors/prodNotFound', { pageTitle: 'Product Not Found' });
                }
            })
        });
    } catch {
        return res.render('errors/prodNotFound', { pageTitle: 'Product Not Found' });
    }
}