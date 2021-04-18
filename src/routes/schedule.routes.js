const express = require("express");
const Schedule = require("../models/schedule.model");
const User = require("../models/user.model");
const Doctor = require("../models/doctor.model");
const auth = require("../middleware/auth");

const router = new express.Router();

// add appointment
router.post("/schedule/add", auth, async (req, res) => {
  try {
    const { patientNumber, doctorId } = req.body;
    const patient = await User.findOne({ phone: patientNumber });
    if (!patient) throw new Error("invalid patient phone number!");
    const doctor = await Doctor.findOne({ doctorId });
    if (!doctor) throw new Error("invalid doctor Id!");
    const Reservation = new Schedule({
      patientId: patient._id,
      doctorId: doctor._id,
      ...req.body,
    });
    await Reservation.save();
    res.status(200).send({
      apiStatus: true,
      error: "Add Appointment Done!",
      data: { Reservation },
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      error: "Add Appointment Failed!",
      data: error.message,
    });
  }
});
// show single appointment
router.get("/schedule/showsingle/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Schedule.findOne({ scheduleId: id });
    res.status(200).send({
      apiStatus: true,
      error: "Show single Done!",
      data: { appointment },
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      error: "Show single appointment Failed!",
      data: error.message,
    });
  }
});
// get patients Schedule
router.get("/schedule/allschedule", auth, async (req, res) => {
  try {
    // const schedule = await req.user.populate("patientSchedule").execPopulate();
    const schedule = await Schedule.find();
    console.log("schedule", schedule);
    res.status(200).send({
      apiStatus: true,
      data: schedule,
      error: " Schedule Done!",
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      error: "Get Schedule Patients Failed!",
      data: error.message,
    });
  }
});
// remove appointment
router.post("/schedule/remove/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    let appointment = await Schedule.findOneAndDelete({ scheduleId: id });
    if (!appointment) throw new Error("Appointment not found!");
    res.status(200).send({
      apiStatus: true,
      error: "Remove Appointment Done!",
      data: { appointment },
    });
  } catch (error) {
    res.status(500).send({
      apiStatus: false,
      error: "Remove Appointment Failed!",
      data: error.message,
    });
  }
});

module.exports = router;
