import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = Schema({
  name: {
    type: String,
    required: true,
    min: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 5,
  },
  tokens: {
    type: [{ name: String, token: String }],
    required: true,
  },
  usertype: {
    type: String,
    default: "Others",
  },
  alumniDetailsId: {
    type: Schema.Types.ObjectId,
    ref: "AlumniPersonalDetails",
  },
  studentDetailsId: {
    type: Schema.Types.ObjectId,
    ref: "StudentPersonalDetails",
  },
});

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      password: this.password,
    },
    process.env.AUTH_TOKEN_SECRET_KEY
  );

  const index = this.tokens.findIndex((token) => token.name == "auth_token");

  if (index == -1)
    this.tokens = this.tokens.concat({ name: "auth_token", token });

  return token;
};

const userModel = model("User", userSchema);
export default userModel;
