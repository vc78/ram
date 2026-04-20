import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/siid_flash";

if (!MONGODB_URI && process.env.NODE_ENV === 'production') {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local or Vercel dashboard");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null, lastFailed: 0 };
}

async function dbConnect() {
  // Ultra-Fast Dev Fallback: Skip if no DB config is present
  if (process.env.NODE_ENV === 'development' && !process.env.MONGODB_URI) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  // If connection failed recently, don't wait again (5 minute retry window)
  if (cached.lastFailed && Date.now() - cached.lastFailed < 300000) {
    throw new Error("MongoDB connection recently failed. Using fallback.");
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2500, // Fail quickly (2.5s) if DB is not running
      connectTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      cached.lastFailed = 0; // Reset failure on success
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.lastFailed = Date.now(); // Mark as failed
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
