import mongoose from "mongoose";

let connection: Promise<typeof mongoose> | undefined;

export async function connectDB(): Promise<typeof mongoose> {
  if (!connection) {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in the environment");
    }

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

    connection = mongoose
      .connect(mongoUri, {
        maxPoolSize: 1,
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false,
      })
      .then((m) => {
        console.log("MongoDB connected");
        return m;
      })
      .catch((error) => {
        connection = undefined;
        throw error;
      });
  }

  return connection;
}
