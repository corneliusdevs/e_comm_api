const mongoose = require("mongoose")

const ProdImgSchema = new mongoose.Schema({
    title: {type: String, required: true},
    desc: {type: String, required: true},
    categories: {type: Array },
    size: {type: String},
    color: {type: String},
    price: {type: Number, required: true},
    img: {
        data: Buffer,
        contentType: String, 
        }
}, 
{timestamps: true})


module.exports = mongoose.model("ProductImages", ProdImgSchema)
