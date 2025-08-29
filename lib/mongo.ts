import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI as string;
if (!MONGODB_URI) {
  throw new Error("please define the MONGO_URI environment variable in .env.local");
}
let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}
console.log("cached = ",cached);
console.log("cached cann = ",cached.conn);
async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "productdb", 
      bufferCommands: false,
    }).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
export default connectDB;
