import mongoose from "mongoose"

mongoose.connect("mongodb+srv://repula:repula@dkjed.mongo.net/alura-node");

let db = mongoose.connectection;

export default db;