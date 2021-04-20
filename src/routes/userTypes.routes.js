const express = require("express");
const router = new express.Router();
const UserTypes = require("../models/userTypes.model");
const Roles = require("../models/roles.model");
router.post("/add/adminType", async (req, res) => {
  try {
    const type = new UserTypes(req.body);
    await type.save();
    res.status(200).send({
      apiStatus: true,
      error: "add adminType Done!",
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      error: "add adminType Faield!",
      data: error.message,
    });
  }
});
router.get("/all/adminType", async (req, res) => {
  try {
    const types = await UserTypes.find();

    res.status(200).send({
      apiStatus: true,
      error: "add adminType Done!",
      data: { types },
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      error: "add adminType Faield!",
      data: error.message,
    });
  }
});
router.post("roles/addRoute", async (req, res) => {
  try {
    console.log(req.body);
    const type = new Roles({
      userType: [req.body.role],
      routeLink: req.body.routeLink,
    });

    await type.save();
    res.status(200).send({
      apiStatus: true,
      error: "addRoute Done!",
      data: { type },
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      error: "addRoute Faield!",
      data: error.message,
    });
  }
});
router.post("/roles/giveaccess/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    const role = await Roles.findOne({ roleId: id });
    role.userType.push(type);
    res.status(200).send({
      apiStatus: true,
      message: "give access Done!",
      data: { role },
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      message: "give access Failed!",
      data: error.message,
    });
  }
});
module.exports = router;
