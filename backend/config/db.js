const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB successfully connected")
    } catch (error) {
        console.log(`There is an errro : ${error}`);
        process.exit(1)
    }
}

module.exports = connectDB;