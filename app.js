const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
require('dotenv').config()

app.use(morgan('dev'))
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'OPTION'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const user = require("./routes/user");
const product = require("./routes/product");

app.use("/api/users", user);
app.use("/api/products", product);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});



