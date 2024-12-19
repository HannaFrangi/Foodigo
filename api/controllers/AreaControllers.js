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

export const getAreaByid = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    console.log(req.params.id);
    if (!area) {
      return res
        .status(404)
        .json({ success: false, message: "Area not found" });
    }
    return res.status(200).json({
      success: true,
      data: area,
    });
  } catch (error) {
    console.error("Error fetching Area by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the Area due to server error",
    });
  }
};
