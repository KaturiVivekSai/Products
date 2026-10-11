const mongoose = require('mongoose');

const ProductScheme = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    price :{
        type : Number,
        required : true,
        min : 0
    },
    inStock: {
        type: Boolean,
        required: true,
        default: true
    },
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamp : true
});

module.exports = mongoose.model("Product", ProductScheme);