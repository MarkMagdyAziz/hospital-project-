const mongoose = require("mongoose");
const userTypesSchema = new mongoose.Schema({
  typeName: { type: String, required: true, unique: true },
  status: { type: Boolean, default: false },
});
const userTypes = mongoose.model("UserTypes", userTypesSchema);
userTypesSchema.virtual("hospitalRoles", {
  localField: "_id",
  foreignField: "UserTypes",
  ref: "roles",
});
module.exports = userTypes;
