const express = require("express");
const Doctor = require("../models/doctor.model");
const auth = require("../middleware/auth");

const router = new express.Router();
// get all doctors
router.get("/doctor/doctorslist", auth, async (req, res) => {
  try {
    // Empty `filter` means "match all documents"
    // Equivalently, User.find() with no arguments and get the same result.

    const filter = {};
    const allDrs = await Doctor.find(filter);
    res.status(500).send({
      apiStatus: true,
      data: { allDrs },
      message: "get Drs Succeeded!",
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      data: { error },
      message: "get Drs Failed!",
    });
  }
});
// add new doctor
router.post("/doctor/add", auth, async (req, res) => {
  const doctor = new Doctor(req.body);
  await doctor.save();
  try {
    res.status(200).send({
      apiStatus: true,
      data: { doctor },
      message: "Added Succeded! ",
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      data: error.message,
      message: "Added Failed! ",
    });
  }
});

// show doctor information
router.get("/doctor/drinfo/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findOne({ doctorId: id });
    res.status(200).send({
      apiStatus: true,
      data: { doctor },
      message: "get doctor info Succeeded!",
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      data: { error },
      message: "get doctor info Failed!",
    });
  }
});
// remove doctor
router.post("/doctor/remove/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    let dr = await Doctor.findOneAndDelete({ doctorId: id });
    if (!dr) throw new Error("DOCTORR not found!");
    res.status(200).send({
      apiSatsus: true,
      messagw: "User has been removed!",
      data: dr,
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      message: "Remove Doctor Field!",
      data: error.message,
    });
  }
});
// update doctor profile
router.put("/doctor/update/:id", auth, async (req, res) => {
  const { id } = req.params;
  const reqEdits = Object.keys(req.body);
  const allowed = ["name", "schedule", "availability"];
  const isValidUpdates = reqEdits.every((r) => allowed.includes(r));
  if (!isValidUpdates) throw new Error("invalid updates");

  try {
    const doctor = await Doctor.findOne({ doctorId: id });
    reqEdits.forEach((data) => {
      doctor[data] = req.body[data];
    });
    await doctor.save();
    res.status(200).send({
      apiStatus: true,
      data: { doctor },
      message: "Update Succeeded!!",
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      data: error.message,
      message: "Update Failed !!",
    });
  }
});
module.exports = router;
