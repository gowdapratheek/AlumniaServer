import { Schema, model } from "mongoose";

const alumniPersonalDetailsSchema = Schema({
  alumniId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  photo: {
    filename: String,
    format: String,
    data: Buffer,
  },
  dob: {
    type: String,
  },
  gender: {
    type: String,
    // enum: ["Male", "Female", "Other"],
    // required: true,
  },
  contact: {
    phoneNumber: { type: Number },
    github: { type: String },
    linkedin: { type: String },
  },
  companyName: {
    type: String,
    // required: true,
  },
  role: {
    type: String,
    // required: true,
  },
  locationOfCompany: {
    address: {
      type: String,
      // required: true,
    },
    country: {
      type: String,
      // required: true,
    },
    state: {
      type: String,
      // required: true,
    },
    pinCode: {
      type: String,
      // required: true,
    },
  },
});

const AlumniPersonalDetails = model(
  "AlumniPersonalDetails",
  alumniPersonalDetailsSchema
);
export default AlumniPersonalDetails;
