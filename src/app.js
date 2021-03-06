const express = require("express");
const cors = require("cors");
const app = express();

const userRoutes = require("./routes/user.routes");
const doctorRoutes = require("./routes/doctor.routes");
const scheduleRoutes = require("./routes/schedule.routes");
const userTypes = require("./routes/userTypes.routes");
require("./db/db");

app.use(cors());

app.use(express.urlencoded());
app.use(express.json());
app.use(userRoutes);
app.use(doctorRoutes);
app.use(scheduleRoutes);
app.use(userTypes);

module.exports = app;
