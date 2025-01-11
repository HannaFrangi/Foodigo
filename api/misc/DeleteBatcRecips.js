import mongoose from "mongoose";

// Replace with your MongoDB connection string
const mongoURI =
  process.env.MONGODB_URI ||
  "mongodb+srv://majdchbat:tSvXdHgpIdEbb45G@cluster0.knx1g.mongodb.net/foodigo_db?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const YourModel = mongoose.model("recipes", new mongoose.Schema({}));

// The ID you want to exclude
const specificId = "67766e1ef63cd38f3bc240f0"; // Replace with the actual ID

async function deleteAllExceptSpecificId() {
  try {
    await YourModel.deleteMany({ _id: { $ne: specificId } });
    console.log("Deleted all documents except the specific ID.");
  } catch (error) {
    console.error("Error deleting documents:", error);
  } finally {
    mongoose.connection.close();
  }
}

deleteAllExceptSpecificId();
