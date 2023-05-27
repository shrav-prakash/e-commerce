const Product = require('../models/product');

exports.getAddProd = (req, res, next) => {
    res.render('admin/addEditProd', { product: new Product('', '', '', ''), pageTitle: 'Add Product', path: 'admin/addProduct', mode: 'add' });
}

exports.postAddProd = (req, res, next) => {
    const prod = new Product(req.body.title, req.body.img, req.body.price, req.body.desc, req.user);
    prod.addProd().then(() => {
        res.redirect('/admin/admin-products');
    }).catch(err => console.log(err));
}

exports.dispProds = (req, res, next) => {
    Product.fetchProds(products => {
        res.render('admin/productList', { products: products, pageTitle: 'Admin Product List', path: 'admin/prodList' });
    }).catch(err => console.log(err));
}

exports.getEditProd = (req, res, next) => {
    let prodId = req.params.prodId;
    Product.getProdById(prodId, product => {
        console.log('Prod: ', product._id);
        if (product === [])
            return res.render('prodNotFound', { pageTitle: 'Product Not Found' })
        res.render('admin/addEditProd', { product: product, pageTitle: 'Edit Product', path: 'admin/editProduct', mode: 'edit' });
    });
}

exports.postEditProd = (req, res, next) => {
    let prod = req.body;
    Product.editProduct(prod, () => {
        res.redirect('/admin/admin-products');
    })
}

exports.deleteProd = (req, res, next) => {
    let prodId = req.params.prodId;
    Product.deleteProduct(prodId, isDeleted => {
        if (isDeleted) {
            return res.redirect('/admin/admin-products');
        } else {
            return res.render('prodNotFound', { pageTitle: 'Product Not Found' });
        }
    })
}