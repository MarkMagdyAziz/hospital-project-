// name, bithday, email, phone, area, password, image, discount level, username, status, role
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isAlphanumeric(value))
        throw new Error(
          "check if the name contains only en-US chars and numbers"
        );
    },
  },
  bDay: {
    type: Date,
    validate(value) {
      if (!validator.isDate(value))
        throw new Error(
          "Check if the input is a valid date. e.g. [2002-07-15]"
        );
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("invalid email!", value);
    },
  },
  history: { type: String },
  phone: {
    type: String,
    required: true,
    validate(v) {
      if (!validator.isMobilePhone(v, ["ar-EG"]))
        throw new Error("invalid ar-EG Mobile phone!");
    },
  },
  address: { type: String, trim: true },
  password: {
    type: String,
    trim: true,
    required: true,
    validate(v) {
      if (!validator.isStrongPassword(v, ["returnScore:true"]))
        throw new Error(
          "Use Strong password must be include Capital , Small , Special Characters and Numbers"
        );
    },
  },
  userName: { type: String, unique: true },
  image: { type: String, trim: true },
  userId: { type: Number, uniqe: true },
  role: { type: String, required: true },
  status: { type: Boolean, default: false },
  tokens: [
    {
      token: { type: String, trim: true },
    },
  ],
});
// userSchema.methods.toJSON = function () {
//   const user = this.toObject();
//   delete user.password;
//   return user;
// };
userSchema.pre("save", async function (next) {
  user = this;
  // create userId
  if (!user.userId) {
    lastUser = await User.findOne().sort({ _id: -1 });
    lastUser ? (user.userId = lastUser.userId + 1) : (user.userId = 1);
  }
  // create userName
  if (!user.userName) user.userName = user._id;
  // check user => Bycrypt password
  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 10);
  next();
});
userSchema.statics.findByCredintials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid user email!");
  if (!user.status) throw new Error("Your account is deactive");

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) throw new Error("invalid user Passwrod!");
  return user;
};
userSchema.methods.generateToken = async function () {
  user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWTSECRET);
  user.tokens.concat({ token });
  await user.save();
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
