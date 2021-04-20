const express = require("express");
const User = require("../models/user.model");
const auth = require("../middleware/auth");
const router = new express.Router();

// user registeration
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
// active user account
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
// deactive user account
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
// loggin
router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredintials(
      req.body.phone,
      req.body.password
    );
    if (user.tokens.length > 5) throw new Error("Maximum 5 devices");
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
//  user profile
router.get("/user/profile", auth, async (req, res) => {
  res.send(req.user);
});
// log out from this device
router.post("/user/logout", auth, async (req, res) => {
  try {
    // const _id = req.params.id;
    // const user = await User.findById({ _id });
    // if (!user) throw new Error("invalid user id");

    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    console.log(req.user);
    res.status(200).send({
      apiStatus: true,
      message: "Logged Out",
      data: req.user,
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      message: "Logg out Error!",
      data: error.message,
    });
  }
});
// log out from all devices
router.post("/user/logoutall", auth, async (req, res) => {
  req.user.tokens = [];
  await req.user.save();
  try {
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      message: "Logged out from all devices faield!",
      data: error.message,
    });
  }
});
// get one user
router.get("/user/single/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    res.status(200).send({
      apiStatus: true,
      data: user,
      message: "all users retrived",
    });
  } catch (e) {
    res.status(500).send({
      apiStatus: false,
      data: e.message,
      message: "error loading data",
    });
  }
});
// remove one user
router.post("/user/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let user = await User.findByIdAndDelete(id);
    if (!user) throw new Error("user not found!");
    res.status(200).send({
      apiSatsus: true,
      messagw: "User has been removed!",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      message: "Delete User Field!",
      data: error.message,
    });
  }
});
// edit user profile
router.patch("/user/edit/:id", auth, async (req, res) => {
  const { id } = req.params;
  const reqEdits = Object.keys(req.body);
  const allowed = ["name", "phone", "password"];
  const isValidUpdates = reqEdits.every((r) => allowed.includes(r));
  if (!isValidUpdates) throw new Error("invalid updates");

  try {
    // const user = await User.findByIdAndUpdate(id, req.body, {
    //   runValidators: true,
    //   new: true,
    // });

    const user = await User.findById(id);
    reqEdits.forEach((r) => {
      console.log(req);
      user[r] = req.body[r];
    });

    await user.save();

    res.status(200).send({
      apiStatus: true,
      data: { user },
      message: "Edit Sucessed !!",
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      data: error.message,
      message: "edit errorr !!",
    });
  }
});
// get all users
router.get("/user/userslist", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).send({
      apiStatus: true,
      data: { allUsers },
      message: "Get Users Succeeded!",
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      data: error.message,
      message: "get all users Failed!",
    });
  }
});
router.get("/test", auth, (req, res) => res.send("hello"));
module.exports = router;
