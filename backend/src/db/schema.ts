import e from "express";
import mongoose from "mongoose";

const spaceSchema =  new mongoose.Schema({
    email: String,
    roomId: String,
    title: String,
    lastModified: { type: Date, default: Date.now }
})
const Space = mongoose.model("space", spaceSchema);

export { Space }