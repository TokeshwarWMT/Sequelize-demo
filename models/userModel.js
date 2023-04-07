const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const randomString = () => {
  const length = 10;
  return randomstring.generate(length);
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
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
      mobile: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { args: true, msg: "You must enter a mobile number" },
          isNumeric: { args: true, msg: "Mobile number must be numeric" },
          len: { args: [10], msg: "Mobile number must be 10 digits long" },
        },
      },
      optInToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      hooks: {
        beforeCreate: async (user, options) => {
          // Generate a unique opt-in token
          const optInToken = randomString({ length: 32 });

          // Save the opt-in token to the user record
          user.optInToken = optInToken;

          // Send an email to the user with an opt-in link
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "tokeshwars@webmobtech.com",
              pass: "Tiku123+-",
            },
          });
          console.log(user.email, user.name, user.optInToken)

          const mailOptions = {
            from: "tokeshwars@webmobtech.com",
            to: user.email,
            subject: "Please confirm your email address",
            html: `
              <p>Hi ${user.name},</p>
              <p>Thank you for signing up for our service. Please click the link below to confirm your email address:</p>
              <a href="http://yourwebsite.com/opt-in?token=${optInToken}">Confirm email address</a>
            `,
          };

          await transporter.sendMail(mailOptions);
        },
      },
    }
  );

  return User;
};
