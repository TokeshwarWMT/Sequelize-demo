const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const productController = require('../controllers/productController');
const authentication = require('../middleware/auth');

router.post("/createProduct", upload.single("image"), productController.createProduct);
router.get("/getAllProduct", productController.getAllProduct);
router.get("/filterProduct", productController.filterProduct)


module.exports = router;
