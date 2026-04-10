import mongoose from "mongoose";

import dns from "node:dns";

export const connectDB = async () => {
  const dnsServers = (process.env.MONGO_DNS_SERVERS || "8.8.8.8,1.1.1.1")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    const canRetryWithDirectUri =
      error?.code === "ENOTFOUND" &&
      typeof process.env.MONGO_URI_DIRECT === "string" &&
      process.env.MONGO_URI_DIRECT.trim().length > 0;

    if (canRetryWithDirectUri) {
      try {
        console.warn(
          "SRV DNS lookup failed. Retrying with direct Mongo URI...",
        );
        await mongoose.connect(process.env.MONGO_URI_DIRECT);
        return;
      } catch (fallbackError) {
        console.error("MongoDB direct URI fallback failed:", fallbackError);
      }
    }

    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with an error code
  }
};

export default connectDB;
