const mongoose = require('mongoose');
const Schema = mongoose.Schema

const orderSchema = new Schema({
    items: [{
        id: { type: Schema.Types.ObjectId, ref: 'Product', required: 'true' },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true }
    }],
    price: {
        type: Number,
        required: true
    },
    custId: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema)