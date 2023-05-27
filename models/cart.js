const fs = require('fs');
const path = require('path');
const Product = require('./product').product;

const rootDir = require('../util/path');

const cartFilePath = path.join(rootDir, 'data', 'cart.json');

exports.cart = class Cart {
    static addProduct(id, price) {
        fs.readFile(cartFilePath, (err, fileContent) => {
            let cart = { prodList: [], totPrice: 0 };
            if (!err && fileContent.length > 0) {
                cart = JSON.parse(fileContent);
            }
            const prodIndex = cart.prodList.findIndex(prod => prod.id === id);
            if (prodIndex > -1) {
                cart.prodList[prodIndex].qty += 1;
            } else {
                cart.prodList = [...cart.prodList, { id: id, qty: 1 }];
            }
            cart.totPrice += +price;
            cart.totPrice = parseFloat(cart.totPrice.toFixed(2));
            fs.writeFile(cartFilePath, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id, price, callBack) {
        let res = "";
        fs.readFile(cartFilePath, (err, fileContent) => {
            if (!err) {
                if (fileContent.length == 0) {
                    res = "Cannot delete product as cart is empty";
                } else {
                    let cart = JSON.parse(fileContent);
                    const prodIndex = cart.prodList.findIndex(prod => prod.id === id);
                    if (prodIndex > -1) {
                        cart.prodList[prodIndex].qty -= 1;
                        if (cart.prodList[prodIndex].qty == 0) {
                            cart.prodList.splice(prodIndex, 1);
                        }
                        cart.totPrice -= +price;
                        cart.totPrice = parseFloat(cart.totPrice.toFixed(2));
                        fs.writeFile(cartFilePath, JSON.stringify(cart), err => {
                            console.log(err);
                        });
                        res = "success";
                    } else {
                        res = "Product is not present in cart";
                    }
                }
            } else
                res = "Cannot delete product as cart is empty";
            callBack(res);
        });
    }

    static displayCart(callBack) {
        fs.readFile(cartFilePath, (err, fileContent) => {
            if (!err && fileContent.length !== 0) {
                let cart = [], totCost = 0;
                const cartItems = JSON.parse(fileContent);
                Product.fetchProds(products => {
                    for (const product of products) {
                        const item = cartItems.prodList.find(prod => prod.id === product.id);
                        if (item) {
                            const price = (parseFloat(product.price) * parseInt(item.qty)).toFixed(2);
                            totCost += +price;
                            cart = [...cart, { id: item.id, qty: item.qty, title: product.title, img: product.img, price: price.toString() }];
                        }
                    }
                    if (cartItems.totPrice != totCost) {
                        cartItems.totPrice = totCost;
                        fs.writeFile(cartFilePath, JSON.stringify(cartItems), err => {
                            console.log(err);
                        });
                    }
                    callBack(cart, totCost);
                });
            } else {
                callBack([], 0);
                return;
            }
        });
    }
}