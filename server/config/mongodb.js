// import mongoose from "mongoose";

// const connectDB = async () => {
//     mongoose.connection.on('connected', () => {
//         console.log("Database Connected")
//     })
//     // await mongoose.connect(`${process.env.MONGODB_URI}/Imagify`) // /Project name
//     await mongoose.connect(process.env.MONGODB_URI)
// }
// export default connectDB;
import mongoose from "mongoose";
import dns from "dns";

// IPv6 ke bajay IPv4 prefer karo
dns.setDefaultResultOrder?.("ipv4first");

let hasConnected = false;

const connectDB = async () => {
  if (hasConnected) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing");

  mongoose.connection.once("connected", () => console.log("✅ MongoDB connected"));
  mongoose.connection.on("error", (e) => console.error("❌ Mongo error:", e.message));

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 30000,
    retryWrites: true,
    appName: "ImagifyLocal",
  });

  hasConnected = true;
};

export default connectDB;

