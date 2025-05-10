import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    Fname: {
      type: String,
      required: true
    },
    Lname: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true
    },
    birthdate: {
      type: Date,
      required: true
    },
    establishment: {
      type: String,
      required: true
    },
    field: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['Teacher', 'Student'],
      required: true
    }
  }
);

export default mongoose.model('User', userSchema);
