import mongoose, { Schema } from "mongoose";

/* ---------- SUB SCHEMAS ---------- */

const OrderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true }, // ✅ SINGLE IMAGE
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
  },
  { _id: false }
);

const AddressSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

/* ---------- ORDER SCHEMA ---------- */

const OrderSchema = new Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },

    userId: {
      type: String, // matches your auth setup
      required: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
      default: [],
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMode: {
      type: String,
      enum: ["COD", "PREPAID"],
      required: true,
    },

    address: {
      type: AddressSchema,
      required: true,
    },

    razorpayOrderId: String,

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

/* ---------- AUTO ORDER ID ---------- */

OrderSchema.pre("validate", function (next) {
  if (!this.orderId) {
    this.orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
  next();
});

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
