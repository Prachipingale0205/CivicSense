const jwt = require("jsonwebtoken");
const User = require("./user.model");
const env = require("../../config/env");
const { createError } = require("../../middleware/errorHandler");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

const register = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, "An account with this email already exists");
  }
  const user = await User.create({ name, email, password, role });
  const token = generateToken(user);
  return { user: formatUser(user), token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw createError(401, "Invalid email or password");
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw createError(401, "Invalid email or password");
  const token = generateToken(user);
  return { user: formatUser(user), token };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw createError(404, "User not found");
  return formatUser(user);
};

module.exports = { register, login, getMe };