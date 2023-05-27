const getDB = require('../util/db').getDB;
const ObjectId = require('mongodb').ObjectId;
const User = require('../models/user');

class Product {
    constructor(title, img, price, desc, userID) {
        this.title = title;
        this.img = img;
        this.price = price;
        this.desc = desc;
        this.userID = userID;
    }

    addProd() {
        const db = getDB();
        return db.collection('products').insertOne(this).then(result => console.log('res: ', result)).catch(err => console.log(err));
    }

    static fetchProds(callBack) {
        const db = getDB();
        return db.collection('products').find().toArray().then(products => callBack(products)).catch(err => console.log(err));
    }

    static getProdById(prodId, callBack) {
        const db = getDB();
        return db.collection('products').find({ _id: new ObjectId(prodId) }).toArray().then(product => callBack(product[0])).catch(err => console.log(err));
    }

    static editProduct(prod, callBack) {
        const db = getDB();
        const prodId = prod.id;
        delete prod.id;
        return db.collection('products').updateOne({ _id: new ObjectId(prodId) }, { $set: prod }).then(() => callBack()).catch(err => console.log(err));
    }

    static deleteProduct(prodId, callBack) {
        const db = getDB();
        return db.collection('products').deleteOne({ _id: new ObjectId(prodId) }).then(() => {
            User.getUsers().then((users) => {
                for (const user of users) {
                    console.log(user.cart.items, prodId);
                    const index = user.cart.items.findIndex(item => item.productId.toString() === prodId);
                    console.log(index);
                    if (index > -1) {
                        const newUser = new User(user._id, user.cart);
                        newUser.deleteFromCart(prodId);
                    }
                }
            })
        }).then(() => callBack(true)).catch(err => console.log(err));
    }
}

module.exports = Product;