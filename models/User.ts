// Goal: অ্যাডমিন User মডেল
import mongoose from "mongoose";

export const USER_ROLES = ["super_admin", "editor", "viewer"] as const;
export type Role = (typeof USER_ROLES)[number];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "editor",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

// hot-reload-এ মডেল দুবার তৈরি ঠেকায়
export default mongoose.models.User || mongoose.model("User", userSchema);
