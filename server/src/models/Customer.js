import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    totalSpent: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);


// import mongoose from "mongoose";

// const customerSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: { type: String, trim: true, lowercase: true },
//     phone: { type: String, trim: true },
//     totalSpent: { type: Number, default: 0 },
//     orders: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Customer", customerSchema);
