const express = require("express");
const User = require("../models/user.model");
const auth = require("../middleware/auth");
const router = new express.Router();

router.get("/", async (req, res) => {
  res.send("test");
});
router.post("/user/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    // Todo: send activation OTP & email
    res.status(200).send({
      apiStatus: true,
      data: { user },
      message: "Registeration Succeded! ",
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      data: error.message,
      message: "Registeration Error! ",
    });
  }
});
router.get("/user/activate/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById({ _id });
    if (!user) throw new Error("invalid user id");
    user.status = true;
    await user.save();
    res.status(200).send({
      apiStatus: true,
      data: { user },
      message: "activated",
    });
  } catch (e) {
    res.status(500).send({
      apiStatus: false,
      data: e.message,
      message: "error activating",
    });
  }
});

router.get("/user/deactivate/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById({ _id });
    if (!user) throw new Error("invalid user id");
    user.status = false;

    await user.save();

    res.status(200).send({
      apiStatus: true,
      data: { user },
      message: "Deactivated",
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      data: error.message,
      message: "Cannot Deactivate!",
    });
  }
});
router.get("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredintials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();
    res.status(200).send({
      apiStatus: true,
      data: { user, token },
      message: "Logged In",
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      data: "Loggin Errrror!",
      message: error.message,
    });
  }
});
router.post("/user/edit", auth, async (req, res) => {
  try {
    reqEdits = Object.keys(req.body);
    allowed = ["name", "password"];
    isValidUpdates = reqEdits.every((r) => allowed.includes(r));
    if (!isValidUpdates) throw new Error("invalid updates");
    reqEdits.forEach((r) => {
      req.user[r] = req.body[r];
    });
    await req.user.save();
    res.send("Edited!");
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      message: "edit errorr !!",
    });
  }
});
module.exports = router;
