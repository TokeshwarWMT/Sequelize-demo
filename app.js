const express = require("express");
const app = express();
require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const user = require("./routes/user");

app.use("/api/user", user);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
