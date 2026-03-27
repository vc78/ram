import mongoose, { Schema, model, models } from "mongoose"

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["admin", "user", "contractor"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "active",
    },
    settings_data: {
      type: String, // Store industrial settings as JSON string
      default: "{}",
    },
  },
  {
    timestamps: true,
  }
)

// Important for Next.js hot-reloading: check if model already exists
export default models.User || model("User", UserSchema)
