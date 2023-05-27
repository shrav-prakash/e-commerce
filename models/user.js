const ObjectID = require('mongodb').ObjectId;
const getDB = require("../util/db").getDB;

class User {
    constructor(id, cart, orders, username, password, email) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.cart = cart;
        this.id = new ObjectID(id);
        this.orders = orders
    }

    addUser() {
        const db = getDB();
        return db.collection('users').insertOne(this).then(() => console.log('User Created')).catch(err => console.log(err));
    }

    addToCart(productId) {
        if (this.cart) {
            //console.log(this.cart, productId);
            const cartIndex = this.cart.items.findIndex(cartProd => cartProd.productId.equals(productId));
            if (cartIndex > -1) {
                console.log('In cart');
                this.cart.items[cartIndex].qty += 1;
            } else {
                console.log('Not in cart');
                this.cart.items.push({ productId: new ObjectID(productId), qty: 1 });
            }
        } else {
            console.log('No cart');
            this.cart = { "items": [{ productId: new ObjectID(productId), qty: 1 }] };
        }
        const db = getDB();
        return db.collection('users').updateOne({ _id: this.id }, { $set: { cart: this.cart } });
    }

    deleteFromCart(productId) {
        if (this.cart) {
            const cartIndex = this.cart.items.findIndex(cartProd => cartProd.productId.equals(productId));
            if (cartIndex > -1) {
                this.cart.items[cartIndex].qty -= 1;
            }
            if (this.cart.items[cartIndex].qty == 0) {
                this.cart.items.splice(cartIndex, 1);
            }
        }
        //console.log(this.cart);
        const db = getDB();
        return db.collection('users').updateOne({ _id: this.id }, { $set: { cart: this.cart } });
    }

    createOrder(products) {
        if (this.cart) {
            console.log("Creating order");
            let order = { "items": [], "price": 0, custId: this.id };
            for (const product of products) {
                console.log(product);
                const index = this.cart.items.findIndex(item => item.productId.toString() === product._id.toString())
                if (index > -1) {
                    order.items = [...order.items, { id: product._id, title: product.title, price: product.price, qty: this.cart.items[index].qty }]
                    order.price += +(parseFloat(product.price) * parseInt(this.cart.items[index].qty)).toFixed(2);
                }
            }
            order.price = order.price.toFixed(2).toString();
            const db = getDB();
            return db.collection('orders').insertOne(order).then(res => {
                const orderId = res.insertedId;
                if (this.orders) {
                    this.orders = [...this.orders, orderId];
                } else {
                    this.orders = [orderId];
                }
                return db.collection('users').updateOne({ _id: this.id }, { $set: { orders: this.orders, cart: { "items": [] } } });
            });
        }
    }

    static findUserById(userId) {
        const db = getDB();
        return db.collection('users').findOne({ _id: new ObjectID(userId) }).then(res => {
            return res;
        }).catch(err => console.log(err));
    }

    static getUsers() {
        const db = getDB();
        return db.collection('users').find().toArray()
    }
}

module.exports = User;
