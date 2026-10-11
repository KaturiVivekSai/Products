const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");
const {protect} = require("../middleware/auth");

router.get("", ProductController.getProducts);

router.get("/:id", ProductController.getControllerById)

router.post("", protect, ProductController.createProduct);

router.put("/:id", protect, ProductController.putController);

router.delete("/:id", protect, ProductController.deleteController) 

module.exports = router;