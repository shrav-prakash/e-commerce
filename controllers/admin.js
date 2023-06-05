const Product = require('../models/product');
const User = require('../models/user');
const ObjectID = require('mongodb').ObjectId;
const { validationResult } = require('express-validator');

exports.getAddProd = (req, res, next) => {
    res.render('admin/addEditProd', {
        product: { title: '', img: '', price: '', desc: '' },
        pageTitle: 'Add Product',
        path: 'admin/addProduct',
        mode: 'add',
        errorMsg: null,
        validationErrors: []
    });
}

exports.postAddProd = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/addEditProd', {
            product: { title: req.body.title, img: req.body.img, price: req.body.price, desc: req.body.desc },
            pageTitle: 'Add Product',
            path: 'admin/addProduct',
            mode: 'add',
            errorMsg: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    const prod = new Product({ title: req.body.title, img: req.body.img, price: req.body.price, desc: req.body.desc });
    prod.save().then(() => {
        res.redirect('/admin/admin-products');
    }).catch(err => console.log(err));
}

exports.dispProds = (req, res, next) => {
    Product.find().then(products => {
        res.render('admin/productList', { products: products, pageTitle: 'Admin Product List', path: 'admin/prodList' });
    }).catch(err => console.log(err));
}

exports.getEditProd = (req, res, next) => {
    let prodId = req.params.prodId;

    Product.findById(prodId).then(product => {
        if (product === [])
            return res.render('prodNotFound', { pageTitle: 'Product Not Found' })
        res.render('admin/addEditProd', {
            product: product,
            pageTitle: 'Edit Product',
            path: 'admin/editProduct',
            mode: 'edit',
            errorMsg: null,
            validationErrors: []
        });
    });
}

exports.postEditProd = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/addEditProd', {
            product: { title: req.body.title, img: req.body.img, price: req.body.price, desc: req.body.desc, _id: req.body.id },
            pageTitle: 'Edit Product',
            path: 'admin/editProduct',
            mode: 'edit',
            errorMsg: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Product.findById(req.body.id).then(prod => {
        prod.title = req.body.title;
        prod.img = req.body.img;
        prod.desc = req.body.desc;
        prod.price = req.body.price;
        prod.save().then(() => {
            res.redirect('/admin/admin-products');
        })
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
                    return res.render('prodNotFound', { pageTitle: 'Product Not Found' });
                }
            })
        });
    } catch {
        return res.render('prodNotFound', { pageTitle: 'Product Not Found' });
    }
}