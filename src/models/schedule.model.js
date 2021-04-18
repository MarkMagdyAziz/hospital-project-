const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    scheduleId: {
      type: Number,
      uniqe: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    doctorId: {
      type: Number,
      required: true,
      ref: "Doctor",
    },
    date: {
      type: Date,
    },
    Status: {
      type: String,
    },
  },
  { timestamps: true }
);

scheduleSchema.pre("save", async function (next) {
  schedule = this;
  // create scheduleId
  if (!schedule.scheduleId) {
    lastSchedule = await Schedule.findOne().sort({ _id: -1 });
    lastSchedule
      ? (schedule.scheduleId = lastSchedule.scheduleId + 1)
      : (schedule.scheduleId = 1000);
  }

  next();
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
