const mongoose = require("mongoose");
const validator = require("validator");

// doctor should be added by the admin
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    validate(name) {
      if (!validator.isAlphanumeric(name))
        throw new Error(
          "Error! name should be contains only en-US chars and numbers"
        );
    },
  },
  specialist: {
    type: String,
    required: true,
    trim: true,
    validate(specialist) {
      if (!validator.isAlphanumeric(specialist))
        throw new Error(
          "Error! name should be contains only en-US chars and numbers"
        );
    },
  },
  doctorId: {
    type: Number,
    uniqe: true,
  },
  schedule: {
    type: String,
    trim: true,
  },
  workdays: [String],
  availability: {
    type: String,
    enum: ["available", "busy"],
    default: "available",
  },
  rate: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 5,
  },
});
doctorSchema.pre("save", async function (next) {
  doctor = this;
  // create doctorId
  if (doctor.doctorId == undefined || null) {
    lastDr = await Doctor.findOne().sort({ _id: -1 });
    lastDr ? (doctor.doctorId = lastDr.doctorId + 1) : (doctor.doctorId = 10);
  } else {
    doctor.doctorId = 10;
  }
  next();
});
doctorSchema.virtual("doctorSchedule", {
  ref: "Schedule",
  localField: "_id",
  foreignField: "doctorId",
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
