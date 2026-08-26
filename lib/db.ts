import mongoose from "mongoose";

const globalMongoose = global as typeof globalThis & { mongooseConnection?: Promise<typeof mongoose> };

export default async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured.");

  if (!globalMongoose.mongooseConnection) {
    // Caching the promise lets concurrent requests share one connection attempt, but a
    // rejected promise must be dropped — otherwise the first failure is replayed for
    // every later request and the app stays broken until the server restarts.
    globalMongoose.mongooseConnection = mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 }).catch((error) => {
      globalMongoose.mongooseConnection = undefined;
      throw error;
    });
  }

  return globalMongoose.mongooseConnection;
}
