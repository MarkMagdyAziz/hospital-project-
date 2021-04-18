const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) => {
  try {
    console.log("token", req.header("Authorization"));

    // undefined
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWTSECRET);
    console.log(decoded);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
      status: true,
    });
    console.log(user);
    if (!user) throw new Error("");
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      error: error.message,
      message: "Token Error!! Please Auth!!",
    });
  }
};

module.exports = auth;
