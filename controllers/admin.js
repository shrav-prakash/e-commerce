const Product = require('../models/product');
const User = require('../models/user');
const ObjectID = require('mongodb').ObjectId;
const { validationResult } = require('express-validator');
const fileHelper = require('../util/file');

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
    let numProds, page = req.query.page;
    if (!page) {
        page = 1;
    }
    Product.find().count().then(numItems => {
        numProds = numItems;
        Product.find().skip((page - 1) * process.env.ITEMS_PER_PAGE).limit(process.env.ITEMS_PER_PAGE).then(products => {
            return res.render('admin/productList', {
                products: products,
                pageTitle: 'Admin Product List',
                path: 'admin/prodList',
                hasNextPage: process.env.ITEMS_PER_PAGE * page < numProds,
                hasPrevPage: page > 1,
                nextPage: +page + 1,
                prevPage: +page - 1,
                currPage: page,
                lastPage: Math.ceil(numProds / process.env.ITEMS_PER_PAGE)
            });
        });
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

    Product.findById(req.body.id).then(prod => {
        prod.title = req.body.title;
        if (req.file) {
            fileHelper.deleteFile(prod.img);
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
            fileHelper.deleteFile(deletedProd.img);
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