const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    phoneNumber: String,
    intrests: [],
    projectRequirements: String,
    date : String,
})

module.exports = mongoose.model("User",userSchema)