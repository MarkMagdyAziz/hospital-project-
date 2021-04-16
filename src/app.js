const express = require("express");
const cors = require("cors");
const app = express();

const userRoutes = require("./routes/user.routes");

require("./db/db");

app.use(cors());

app.use(express.urlencoded());
app.use(express.json());
app.use(userRoutes);

module.exports = app;
