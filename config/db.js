import mongoose from 'mongoose';
import dotenv from 'dotenv';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully...');
  } catch(err){
        console.log("Error connecting to database:", err);
        process.exit(1);
    }
};

export default connectDB;