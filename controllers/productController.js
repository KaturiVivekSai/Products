const express = require("express");
const Product = require("../models/product");

exports.getController=(async (req, res,next) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch(err) {
        next(err);
    }
});

exports.getControllerById=(async (req, res, next) => {
    try {
        const id = req.params.id;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch(err) {
        next(err);
    }
})

exports.postController=( async (req, res, next) => {
   try {
        const {name, price} = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Name not found"
            })
        }

        if (!price) {
            return res.status(400).json({
                message: "price not found"
            })
        }

        const product = await Product.create(req.body)
        return res.status(201).json(product);
   } catch(err) {
        next(err);
    }
});

exports.putController=(async (req, res, next) => {
    try {
        const id = req.params.id;

        const product = await Product.findByIdAndUpdate(id, req.body, {
            returnDocument: "after", runValidators: true
        });
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch(err) {
        next(err);
    }
});


exports.deleteController=(async (req, res,next ) => {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.status(200).json({
        message: "Product deleted successfully"
    })
}) 

exports.createProduct = async (req, res, next) => {
   try {
        const {name, price} = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Name not found"
            })
        }

        if (!price) {
            return res.status(400).json({
                message: "price not found"
            })
        }

        const product = await Product.create({
            ...req.body, 
            createdBy: req.user.id
        })
        return res.status(201).json(product);
   } catch (err) {
        next(err);
   }
}

exports.updateProduct = async (req,res,next) =>{
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({
                error: "Product not found"
            })
        }
        if(String(product.createdById) !== req.user.id) {
            return res.status(403).json({
                error: "You can only change your own products"
            })
        }
        delete req.body.createdById
        const updated = await Product.findByIdAndUpdate(
            req.params.id, req.body,
            { returnDocument: "after", runValidators: true}
        )
        res.json(updated);
    } catch(err){
        next(err);
    }
}

exports.getMyProducts = async (req,res,next) =>{
    try{
        const products = await Product.find({createdById: req.user.id})
        return res.json(200).json(products);
    } catch(err){
        next(err);
    }
}

exports.getProducts = async (req,res,next) => {
    try{
        const {search, sort, inStock, minPrice, maxPrice} = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const filter = { };
        if(inStock){
            filter.inStock = inStock ==="true"
        }
        if(search){
            const safe = search.replace(/[.*?^${})|[\]\\]/g,"\\$&")
            filter.name = {
                $regex: safe, $options: "i"
            };
        }
        if(minPrice || maxPrice){
            filter.price ={};
            if(minPrice)    filter.price.$gte = Number(minPrice);
            if(maxPrice)    filter.price.$lte = Number(maxPrice);
        }
        console.log(filter);
        const total = await Product.countDocuments(filter);
        const result = await Product.find(filter).sort(sort || "-_id").skip((page - 1) * limit).limit(limit);
        res.status(200).json(
            {total,
            page,
            pages: Math.ceil(total/limit),
            result}
        );
    } catch(err) {
        next(err);
    }
}