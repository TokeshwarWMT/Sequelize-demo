const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = db.users;

const createUser = async (req, res) => {
  try {
    let data = req.body;
    let { name, email, password, mobile, optInToken } = data;
    const uniqueMobile = await User.findOne({ where: { mobile: mobile } });

    if (uniqueMobile) {
      return res.status(400).json("Please enter a unique mobile number");
    }
    const uniqueEmail = await User.findOne({ where: { email: email } });
    if (uniqueEmail) {
      return res.status(400).json("Please enter a unique email");
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name: name,
      email: email,
      password: encryptedPassword,
      mobile: mobile,
      optInToken: optInToken
    };
    const user = await User.create(userData);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const login = async (req, res) => {
  let email = req.body.email;
  let pass = req.body.password;

  try {
    var user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).send({ message: "incorrect email!!" });
    }

    const password = user.password;
    let passMatch = await bcrypt.compare(pass, password);
    let key = process.env.USER_SECRET_KEY;

    if (passMatch) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        key
      );
      res.status(201).send({ token: token });
    } else {
      return res.status(400).send("incorrect password!!");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  createUser,
  login,
};
