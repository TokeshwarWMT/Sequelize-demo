const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

const User = db.users;

const createUser = async (req, res) => {
  try {
    let data = req.body;
    let { name, email, password } = data;

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
    };
    const user = await User.create(userData);
    return res.status(201).json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const uniqueEmail = await User.findOne({ where: { email: email } });
    if (uniqueEmail) {
      return res.status(400).json("Please enter a unique email");
    }

    const msg = {
      to: email,
      from: "deept@webmobtech.com",
      subject: "Your OTP for signup",
      text: `Your OTP for signup is ${otp}`,
    };
    await sgMail.send(msg);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
    });

    res.status(201).json({ message: "OTP sent to email" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || user.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    await user.update({ otp: null });

    res.status(200).json({ message: "User account created" });
  } catch (error) {
    next(error);
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
  signup,
  verifyOtp,
  login,
};
