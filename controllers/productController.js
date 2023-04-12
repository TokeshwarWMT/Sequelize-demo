const db = require("../models");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Product = db.products;
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: "dbv10f3bf",
  api_key: "474116116625175",
  api_secret: "UU-WYsG12QFKvYzA7gVo_u6ZjbI",
});

const createProduct = async (req, res) => {
  try {
    let data = req.body;
    const product = await Product.create(data);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};


const getAllProduct = async (req, res) => {
  try {
    const { id, limit, minprice, maxprice } = req.query;

    let whereClause = {};

    if (id) {
      whereClause.id = id;
    }

    if (minprice) {
      whereClause.price = { [Op.gte]: minprice };
    }

    if (maxprice) {
      whereClause.price = { ...whereClause.price, [Op.lte]: maxprice };
    }

    let products;

    if (limit) {
      products = await Product.findAll({
        where: whereClause,
        limit: Number(limit),
      });
    } else {
      products = await Product.findAll({ where: whereClause });
    }

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const filterProduct = async (req, res) => {
  try {
    const { title, ratings, specifications, price, originalPrice } = req.query;
    const filter = {};
    if (title) {
      filter.title = { [Op.like]: `%${title}%` };
    }
    if (ratings) {
      filter.ratings = { [Op.like]: `%${ratings}%` };
    }
    if (specifications) {
      filter.specifications = { [Op.like]: `%${specifications}%` };
    }
    if (price) {
      filter.price = { [Op.like]: `%${price}%` };
    }
    if (originalPrice) {
      filter.originalPrice = { [Op.like]: `%${originalPrice}%` };
    }
    const product = await Product.findAll({ where: filter });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  filterProduct,
};
