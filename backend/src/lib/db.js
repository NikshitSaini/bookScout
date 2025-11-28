 import moongoose from 'mongoose';


 export const connectDB = async () => {
        try {
            await moongoose.connect(process.env.Mongo_URI);
            console.log("MongoDB connected successfully");
        } catch (error) {
            console.log("MongoDB connection failed", error);
            process.exit(1);
        }
 }