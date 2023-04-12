module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { args: true, msg: "You must enter a name" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { args: true, msg: "You must enter an email" },
        isEmail: { args: true, msg: "Invalid email address" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { args: true, msg: "You must enter a password" },
      },
    },
    otp: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false,
    initialAutoIncrement: 1000
  });
  User.associate = (models) => {
    User.hasMany(models.Product, {
      foreignKey: "userId",
      as: "products",
    });
  };
  return User;
};
