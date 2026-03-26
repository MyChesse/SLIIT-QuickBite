
import mongoose from 'mongoose';

 export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    }

        catch (error) {
        console.error('MongoDB connection error:', error);
        // process.exit(1); // Commented out to allow server to run without DB
       
    }
};

export default connectDB;