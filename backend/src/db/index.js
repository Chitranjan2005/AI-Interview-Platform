import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connectionistance = await mongoose.connect(
      `${process.env.MONGO_URL}/QuestionDB`
    );
    console.log(`Mongoose connected to ${connectionistance.connection.host}`);
  } catch (error) {
    console.error('Mongoose error: ', error);
    throw error;
    process.exit(1);
  }
};
export default connectDB;
