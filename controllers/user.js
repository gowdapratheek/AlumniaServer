import User from "../model/user.js";
import OTP from "../model/otp.js";
import AlumniPersonalDetails from "../model/alumni.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";

export const getAllUsers = async (req, res) => {
  try {
    const result = await User.find();
    res
      .status(200)
      .json({ result, message: "all users get successfully", success: true });
  } catch (error) {
    res.status(404).json({
      message: "error in getAllUsers - controllers/user.js",
      error,
      success: false,
    });
  }
};

export const sendRegisterOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ message: "email field is required", success: false });
    if (!validator.isEmail(email))
      return res.status(400).json({
        message: `email pattern failed. Please provide a valid email.`,
        success: false,
      });

    const isEmailAlreadyReg = await User.findOne({ email });
    // in register user should not be registered already
    if (isEmailAlreadyReg)
      return res.status(200).json({
        message: `user with email ${email} already resgistered `,
        success: false,
      });

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const hashedOTP = await bcrypt.hash(otp, 12);
    const newOTP = await OTP.create({
      email,
      otp: hashedOTP,
      name: "register_otp",
    });

    var transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    const mailOptions = {
      from: process.env.ALUMNIA,
      to: email,
      subject: "Alunima OTP Verification",
      html: `<p>Your OTP code is ${otp}</p>`,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else return null; //console.log(info);
    });

    res.status(200).json({
      result: newOTP,
      otp,
      message: "register_otp send successfully",
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      message: "error in sendRegisterOTP  - controllers/user.js",
      error,
      success: false,
    });
  }
};

export const updateUserType = async (req, res) => {
  const { email, userType } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { usertype: userType },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User type updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user type:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Failed to update user type.",
      error: error.message,
    });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp)
      return res.status(400).json({
        message:
          "Please provide all required fields (name, email, password, otp, usertype)",
        success: false,
      });

    if (!validator.isEmail(email))
      return res.status(400).json({
        message: "Invalid email format. Please provide a valid email.",
        success: false,
      });

    const isEmailAlreadyReg = await User.findOne({ email });
    console.log(isEmailAlreadyReg);
    if (isEmailAlreadyReg)
      return res.status(200).json({
        message: `User with email ${email} already registered.`,
        success: false,
      });

    const otpHolder = await OTP.find({ email });
    if (otpHolder.length == 0)
      return res.status(400).json({
        message: "Invalid or expired OTP.",
        success: false,
      });

    const registerOtps = otpHolder.filter((otp) => otp.name === "register_otp");
    const findedOTP = registerOtps[registerOtps.length - 1];
    const plainOTP = otp;
    const hashedOTP = findedOTP.otp;
    const isValidOTP = await bcrypt.compare(plainOTP, hashedOTP);

    if (isValidOTP) {
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.generateAuthToken();
      await OTP.deleteMany({ email: findedOTP.email });
      await newUser.save();

      // const userId = newUser._id;
      // const alumniDetails = new AlumniPersonalDetails({
      //   alumniId: userId,
      // });
      // await alumniDetails.save();

      return res.status(200).json({
        result: newUser,
        message: "Registered successfully.",
        success: true,
      });
    } else {
      return res.status(200).json({
        message: "Invalid OTP. Try again",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error in register controller:", error);
    res.status(500).json({
      message: "Registration failed.",
      error: error.message,
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const auth_token = "auth_token";
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password.",
        success: false,
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format. Please provide a valid email.",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(200).json({
        message: "Invalid credentials.",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials.",
        success: false,
      });
    }

    const isTokenExist = existingUser.tokens.some(
      (token) => token.name === auth_token
    );
    if (isTokenExist) {
      return res.status(200).json({
        result: existingUser,
        message: `User with email ${email} is already logged in.`,
        success: true,
      });
    }

    const token = jwt.sign(
      { email, _id: existingUser._id },
      process.env.AUTH_TOKEN_SECRET_KEY,
      { expiresIn: "1h" } // Optional: set token expiration time
    );

    existingUser.tokens.push({ name: auth_token, token });
    const result = await existingUser.save();

    res.status(200).json({
      result,
      message: "Login successful.",
      success: true,
    });
  } catch (error) {
    console.error("Error during login:", error); // Add this line to log the error
    res.status(500).json({
      message: "Login failed.",
      error,
      success: false,
    });
  }
};

export const sendForgetPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const isEmailAlreadyReg = await User.findOne({ email });

    if (!email)
      return res
        .status(400)
        .json({ message: "email field is required", success: false });
    // in forget password route, user should be registered already
    if (!isEmailAlreadyReg)
      return res
        .status(400)
        .json({ message: `No user exist with email ${email}`, success: false });
    if (!validator.isEmail(email))
      return res.status(400).json({
        message: `email pattern failed. Please provide a valid email.`,
        success: false,
      });

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const hashedOTP = await bcrypt.hash(otp, 12);
    const newOTP = await OTP.create({
      email,
      otp: hashedOTP,
      name: "forget_password_otp",
    });

    var transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    const mailOptions = {
      from: process.env.ALUMNIA,
      to: email,
      subject: "Alumnia OTP Verification to reset password",
      html: `<p>Your OTP code is ${otp}</p>`,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else return null; //console.log(info);
    });

    res.status(200).json({
      result: newOTP,
      otp,
      message: "forget_password_otp send successfully",
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      message: "error in sendForgetPasswordOTP - controllers/user.js",
      error,
      success: false,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    if (!email || !password || !otp)
      return res.status(400).json({
        message: "make sure to provide all the fieds ( email, password, otp)",
        success: false,
      });
    if (!validator.isEmail(email))
      return res.status(400).json({
        message: `email pattern failed. Please provide a valid email.`,
        success: false,
      });

    const findedUser = await User.findOne({ email });
    if (!findedUser)
      return res.status(400).json({
        message: `user with email ${email} is not exist `,
        success: false,
      });

    const otpHolder = await OTP.find({ email });
    if (otpHolder.length == 0)
      return res
        .status(400)
        .json({ message: "you have entered an expired otp", success: false });

    const forg_pass_otps = otpHolder.filter(
      (otp) => otp.name == "forget_password_otp"
    ); // otp may be sent multiple times to user. So there may be multiple otps with user email stored in dbs. But we need only last one.
    const findedOTP = forg_pass_otps[forg_pass_otps.length - 1];

    const plainOTP = otp;
    const hashedOTP = findedOTP.otp;

    const isValidOTP = await bcrypt.compare(plainOTP, hashedOTP);

    if (isValidOTP) {
      const hashedPassword = await bcrypt.hash(password, 12);
      const result = await User.findByIdAndUpdate(
        findedUser._id,
        { name: findedUser.name, email, password: hashedPassword },
        { new: true }
      );

      await OTP.deleteMany({ email: findedOTP.email });

      return res.status(200).json({
        result,
        message: "password changed successfully",
        success: true,
      });
    } else {
      return res.status(200).json({ message: "wrong otp", success: false });
    }
  } catch (error) {
    res.status(404).json({
      message: "error in changePassword - controllers/user.js",
      error,
      success: false,
    });
  }
};

export const deleteAllUsers = async (req, res) => {
  try {
    const result = await User.deleteMany();
    res.status(200).json({
      result,
      message: `User collection deleted successfully `,
      success: true,
    });
  } catch (err) {
    res.status(404).json({
      message: "error in deleteAllUsers - controllers/user.js",
      success: false,
    });
  }
};
