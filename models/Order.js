const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    userId: {type: String, required: true },
    products: [
        {
            productId: {type: String, required: true},
            title: {type: String, required:true},
            quantity: {type: Number, default: 1},
            price: {type: Number, required: true}
        }
    ],
    amount: {type: Number, required: true},
    address: {type: Object, required: true},
    status: {type: String, default: "pending"}
}, {timestamps: true})


module.exports = mongoose.model("Order", OrderSchema)

