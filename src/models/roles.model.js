const mongoose = require("mongoose");
const userTypes = require("./userTypes.model");

const roleSchema = new mongoose.Schema({
  roleId: {
    type: Number,
    uniqe: true,
  },
  userType: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserTypes",
    },
  ],
  routeLink: { type: String },
});
roleSchema.pre("save", async function (next) {
  role = this;

  // create scheduleId
  if (!role.roleId) {
    lastRole = await Role.findOne().sort({ _id: -1 });
    lastRole ? (role.roleId = lastRole.roleId + 1) : (role.roleId = 1);
  }

  next();
});
const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
