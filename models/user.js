const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectID = require('mongodb').ObjectId;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [{ productId: { type: Schema.Types.ObjectId, ref: 'Product', required: 'true' }, qty: { type: Number, required: true } }]
    },
    orders: {
        type: [Schema.Types.ObjectId],
        ref: 'Order',
        required: true
    }
});

userSchema.methods.addToCart = function (productId) {
    if (this.cart) {
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
    return this.save();
}

userSchema.methods.deleteFromCart = function (productId) {
    if (this.cart) {
        const cartIndex = this.cart.items.findIndex(cartProd => cartProd.productId.equals(productId));
        if (cartIndex > -1) {
            this.cart.items[cartIndex].qty -= 1;
        }
        if (this.cart.items[cartIndex].qty == 0) {
            this.cart.items.splice(cartIndex, 1);
        }
    }
    return this.save();
}

module.exports = mongoose.model('User', userSchema);

