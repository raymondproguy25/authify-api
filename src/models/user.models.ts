import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true},
  email: { 
    type: String, 
    required: true, 
    lowercase: true,
    unique: true
  },
  phone: { type: Number, required: true },
  password: { type: String, required: true},
}, { timestamps: true });

const UserInfo = mongoose.model("UserInfo", userSchema);
export default UserInfo;
