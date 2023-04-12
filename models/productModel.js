module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "product",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { args: true, msg: "You must enter a title" },
        },
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ratings: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      specifications: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      originalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
   
    },
    {
      timestamps: false,
      initialAutoIncrement: 1000,
    }
  );
  Product.associate = (models) => {
    Product.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };
  return Product;
};
