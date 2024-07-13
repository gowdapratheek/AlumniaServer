import { Schema, model } from "mongoose";

const studentPersonalDetailsSchema = Schema({
  studentId: {
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
  courseName: {
    type: String,
    // required: true,
  },
  yearOfStudy: {
    type: String,
    // required: true,
  },
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
});

const StudentPersonalDetails = model(
  "StudentPersonalDetails",
  studentPersonalDetailsSchema
);
export default StudentPersonalDetails;
