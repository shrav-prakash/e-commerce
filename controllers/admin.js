const Product = require('../models/product');
const User = require('../models/user');
const ObjectID = require('mongodb').ObjectId;

exports.getAddProd = (req, res, next) => {
    const isLoggedIn = req.session.isLoggedIn;
    res.render('admin/addEditProd', { product: { title: '', img: '', price: '', desc: '' }, pageTitle: 'Add Product', path: 'admin/addProduct', mode: 'add', isLoggedIn: isLoggedIn });
}

exports.postAddProd = (req, res, next) => {
    const prod = new Product({ title: req.body.title, img: req.body.img, price: req.body.price, desc: req.body.desc });
    prod.save().then(() => {
        res.redirect('/admin/admin-products');
    }).catch(err => console.log(err));
}

exports.dispProds = (req, res, next) => {
    const isLoggedIn = req.session.isLoggedIn;
    Product.find().then(products => {
        res.render('admin/productList', { products: products, pageTitle: 'Admin Product List', path: 'admin/prodList', isLoggedIn: isLoggedIn });
    }).catch(err => console.log(err));
}

exports.getEditProd = (req, res, next) => {
    let prodId = req.params.prodId;
    const isLoggedIn = req.session.isLoggedIn;
    Product.findById(prodId).then(product => {
        if (product === [])
            return res.render('prodNotFound', { pageTitle: 'Product Not Found', isLoggedIn: isLoggedIn })
        res.render('admin/addEditProd', { product: product, pageTitle: 'Edit Product', path: 'admin/editProduct', mode: 'edit', isLoggedIn: isLoggedIn });
    });
}

exports.postEditProd = (req, res, next) => {
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
    const isLoggedIn = req.session.isLoggedIn;
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
                    return res.render('prodNotFound', { pageTitle: 'Product Not Found', isLoggedIn: isLoggedIn });
                }
            })
        });
    } catch {
        return res.render('prodNotFound', { pageTitle: 'Product Not Found', isLoggedIn: isLoggedIn });
    }
}