// Goal: অ্যাডমিন User মডেল
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["super_admin", "editor", "viewer"],
      default: "editor",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// hot-reload-এ মডেল দুবার তৈরি ঠেকায়
export default mongoose.models.User || mongoose.model("User", userSchema);