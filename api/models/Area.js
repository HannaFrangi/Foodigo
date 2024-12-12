import mongoose from "mongoose";

const AreaSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const Area = mongoose.model("Area", AreaSchema);
export default Area;
