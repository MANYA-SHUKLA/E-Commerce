const mongoose = require("mongoose");
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if(!process.env.MONGO_URI){
    throw new Error(
        "Please provide MONGO_URI in the .env file"
    )
}

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connect DB")
    } catch (error) {
        console.log("Mongodb connect error",error)
        process.exit(1)
    }
}

module.exports = connectDB;
