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
          "Error! name should be contains only en-US chars and numbers"
        );
    },
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate(v) {
      if (!validator.isMobilePhone(v, ["ar-EG"]))
        throw new Error("invalid ar-EG Mobile phone!");
    },
  },
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
  address: { type: String, trim: true },

  userName: { type: String, unique: true },
  image: { type: String, trim: true },
  userId: { type: Number, uniqe: true },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "UserTypes",
  },
  status: { type: Boolean, default: false },
  tokens: [
    {
      token: { type: String, trim: true },
    },
  ],
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Schedule",
  },
});
userSchema.virtual("patientSchedule", {
  ref: "Schedule",
  localField: "_id",
  foreignField: "patientId",
});
userSchema.methods.toJSON = function () {
  // convert user data base object to => javascript object
  // function run every time together with app.use(express.json()); => wana ba5rog bel data
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.pre("save", async function (next) {
  user = this;
  // create userId
  if (user.userId == undefined || null) {
    lastUser = await User.findOne().sort({ _id: -1 });
    lastUser ? (user.userId = lastUser.userId + 1) : (user.userId = 100);
  }
  // create userName
  if (!user.userName) user.userName = user._id;
  // check user => Bycrypt password
  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 10);
  next();
});
userSchema.statics.findByCredintials = async (phone, password) => {
  const user = await User.findOne({ phone });
  if (!user) throw new Error("Invalid user phone number !");
  if (!user.status) throw new Error("Your account is deactive");

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) throw new Error("invalid user Passwrod!");
  if (user.tokens.length > 5) throw new Error("Maximum 5 devices");

  return user;
};
userSchema.methods.generateToken = async function () {
  user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWTSECRET);
  // user.tokens.concat({ token });
  user.tokens = user.tokens.concat({ token: token });

  await user.save();
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
