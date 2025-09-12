import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import app from "../app.js";

const PORT = process.env.PORT || 5000;

const connect_to_database = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
        });
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

const start_server = async () => {
    await connect_to_database();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

start_server();
