import userModel from "../../DB/models/userModel.js";
import orderModel from "../../DB/models/orderModel.js";

//Hash Password
import { hashSync, compareSync } from "bcrypt";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";

//SEND Email
import { sendEmail } from "../utils/sendEmail.js";
import { SignUpTemplet, restpasswordTemplet } from "../utils/generateHtml.js";

import crypto from "crypto";

//NanoId
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890", 7);

//Error Handle
import { asyncHandler } from "../utils/errorHandling.js";

//Jwt
import JWT from "jsonwebtoken";

// register
export const registerController = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, address, answer } = req.body;
  console.log({ name, email, password, phone, address, answer });
  //validations
  //check user
  const exisitingUser = await userModel.findOne({ email });
  //exisiting user
  if (exisitingUser) {
    return res.status(200).send({
      success: false,
      message: "Already Register please login",
    });
  }
  console.log(exisitingUser);
  // ================================================

  const hashpassword = hashSync(password, parseInt(process.env.salt_Round));
  console.log(hashpassword);

  const activationCode = crypto.randomBytes(64).toString("hex");
  //register user
  const user = await new userModel({
    name,
    email,
    password: hashpassword,
    answer,
    phone,
    address,
    activationCode,
  }).save();
  //save
  await user.save();

  if (!user) {
    return next(new Error("invalid-register", { cause: 500 }));
  }
  console.log(
    `${req.protocol}://${req.headers.host}/confirmEmail/${activationCode}`
  );
  const link = `${req.protocol}://${req.headers.host}/user/confirmEmail/${activationCode}`;
  const isSend = await sendEmail({
    to: email,
    subject: "confirm Email",
    html: `${SignUpTemplet(link)}`,
  });

  return isSend
    ? res.status(201).json({
        success: true,
        message: "User Register Successfully check you inbox",
        result: user,
      })
    : next(new Error("Something went wrong!"));
});

// LOGIN
export const loginController = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  console.log({ email, password });
  //validation
  if (!email || !password) {
    return res.status(404).send({
      success: false,
      message: "Invalid email or password",
    });
  }
  //check user
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "Email is not registerd",
    });
  }
  const match = await comparePassword(password, user.password);
  if (!match) {
    return res.status(200).send({
      success: false,
      message: "Invalid Password",
    });
  }
  //token
  const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.status(200).send({
    success: true,
    message: "login successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
    },
    token,
  });
});

//forgot Password
export const forgotPasswordController = asyncHandler(async (req, res, next) => {
  const { email, answer, newPassword } = req.body;
  if (!email) {
    res.status(400).send({ message: "Emai is required" });
  }
  if (!answer) {
    res.status(400).send({ message: "answer is required" });
  }
  if (!newPassword) {
    res.status(400).send({ message: "New Password is required" });
  }
  //check
  const user = await userModel.findOne({ email, answer });
  //validation
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "Wrong Email Or Answer",
    });
  }
  const hashed = await hashPassword(newPassword);
  await userModel.findByIdAndUpdate(user._id, { password: hashed });
  res.status(200).send({
    success: true,
    message: "Password Reset Successfully",
  });
});

//test controller
export const testController = asyncHandler(async (req, res, next) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
});

//update prfole
export const updateProfileController = asyncHandler(async (req, res, next) => {
  const { name, email, password, address, phone } = req.body;
  const user = await userModel.findById(req.user._id);
  //password
  if (password && password.length < 6) {
    return res.json({ error: "Passsword is required and 6 character long" });
  }
  const hashedPassword = password ? await hashPassword(password) : undefined;
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      name: name || user.name,
      password: hashedPassword || user.password,
      phone: phone || user.phone,
      address: address || user.address,
    },
    { new: true }
  );
  res.status(200).send({
    success: true,
    message: "Profile Updated SUccessfully",
    updatedUser,
  });
});

//orders
export const getOrdersController = asyncHandler(async (req, res) => {
  const orders = await orderModel
    .find({ buyer: req.user._id })
    .populate("products", "-photo")
    .populate("buyer", "name");
  res.json(orders);
});

//orders
export const getAllOrdersController = asyncHandler(async (req, res) => {
  const orders = await orderModel
    .find({})
    .populate("products", "-photo")
    .populate("buyer", "name")
    .sort({ createdAt: "-1" });
  res.json(orders);
});

//order status
export const orderStatusController = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const orders = await orderModel.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );
  res.json(orders);
});
