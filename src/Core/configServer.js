import mongoose from "mongoose";
import "dotenv/config";

const URI = process.env.URI;
const connectToDB = () => {
  try {
    mongoose.connect("mongodb+srv://fmalbran93:coderhouse@clustercoder.nqsqgsl.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=ClusterCoder");
    console.log("connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

export default connectToDB;