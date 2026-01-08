import mongoose, { Schema } from "mongoose";

const OtpSchema = new Schema(
  {
    phone: { type: String, required: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// auto delete expired OTPs
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Otp ||
  mongoose.model("Otp", OtpSchema);
