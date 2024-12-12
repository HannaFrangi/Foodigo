import Area from "../models/Area.js";

export const createArea = async (req, res) => {
  const { name } = req.body;
  try {
    const existingArea = await Area.findOne({ name });
    if (existingArea) {
      return res.status(400).json({
        success: false,
        message: "Area already exists",
        data: existingArea,
      });
    }
    const newArea = new Area({ name });
    await newArea.save();
    res.status(201).json({
      success: true,
      message: "Area created successfully",
      data: newArea,
    });
  } catch (error) {
    console.error("Error in addArea:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllAreas = async (req, res) => {
  try {
    const areas = await Area.find();
    res.json({
      success: true,
      data: areas,
    });
  } catch (error) {
    console.error("Error in getAllAreas:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
