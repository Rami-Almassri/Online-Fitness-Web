const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // setting connection with mongoDB
        const conn = await mongoose.connect(process.env.MONGO_URI);
        // console.log(`Database connection started ${conn.connection.host}`);
    } catch (error) {
        // the connection didn't work
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;