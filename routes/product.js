const express = require("express");
const router = express.Router();

const productController = require('../controllers/productController');
const authentication = require('../middleware/auth');

router.post("/createProduct", productController.createProduct);
router.get("/getAllProduct", productController.getAllProduct);

module.exports = router;
