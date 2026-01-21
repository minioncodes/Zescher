import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },

    userId: {
      type: String, // UUID user id
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    razorpayOrderId: {
  type: String,
},

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true,
    },

    orderStatus: {
      type: String,
      enum: ["CREATED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "CREATED",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "COD"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

// ✅ Auto-generate orderId before save
OrderSchema.pre("validate", function (next) {
  if (!this.orderId) {
    this.orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
  next();
});

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
