const db = require("../models");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Product = db.products;
const cloudinary = require("../utils/cloudinary");
const { sequelize } = require("../models/index");

const createProduct = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    let product = new Product({
      image: result.secure_url,
      title: req.body.title,
      category: req.body.category,
      ratings: req.body.ratings,
      specifications: req.body.specifications,
      price: req.body.price,
      originalPrice: req.body.originalPrice,
    });
    await product.save();
    res.json(product);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { id, limit, minprice, maxprice, title, ratings, ram } = req.query;

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

    if (title) {
      whereClause.title = { [Op.like]: `%${title}%` };
    }

    if (ratings) {
      whereClause.ratings = { [Op.like]: ratings };
    }

    let products;

    if (ram) {
      const ramValues = ram.split(",");
      whereClause = {
        ...whereClause,
        [Op.and]: {
          [Op.or]: ramValues.map((value) =>
            sequelize.literal(
              `JSON_EXTRACT(specifications, '$.ram') LIKE '%${value}%'`
            )
          ),
        },
      };
    }
    
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
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};

const filterProduct = async (req, res) => {
  try {
    const { id, limit, minprice, maxprice, title, ratings, ram } = req.query;

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

    if (title) {
      const titleValues = title.split(",");
      whereClause[Op.and] = [...(whereClause[Op.and] || []),
        {
          [Op.or]: titleValues.map((value) => ({
            title: { [Op.like]: `%${value}%` },
          })),
        },
      ];
    }

    if (ratings) {
      const ratingsValues = ratings.split(",");
      whereClause[Op.and] = [...(whereClause[Op.and] || []),
        {
          [Op.or]: ratingsValues.map((value) => ({
            ratings: { [Op.like]: `%${value}%` },
          })),
        },
      ];
    }

    if (ram) {
      const ramValues = ram.split(",");
      whereClause[Op.and] = [...(whereClause[Op.and] || []),
        {
          [Op.or]: ramValues.map((value) =>
            sequelize.literal(
              `JSON_EXTRACT(specifications, '$.ram') LIKE '%${value}%'`
            )
          ),
        },
      ];
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
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};









module.exports = {
  createProduct,
  getAllProduct,
  filterProduct
};
