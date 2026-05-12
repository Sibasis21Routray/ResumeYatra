import mongoose from "mongoose";
import ProfessionalContext from "../src/models/ProfessionalContext";

async function fixProfessionalContext() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/resumeYatra");
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;

    // Get all indexes on the collection
    const indexes = await db
      ?.collection("professionalcontexts")
      .getIndexes();
    console.log("Current indexes:", indexes);

    // Drop the old problematic index
    try {
      await db?.collection("professionalcontexts").dropIndex("resumeVersionId_1");
      console.log("✓ Dropped old resumeVersionId_1 index");
    } catch (e: any) {
      console.log(
        "Index might not exist or already dropped:",
        e.message
      );
    }

    // Delete all documents with null resumeVersion
    const result = await ProfessionalContext.deleteMany({
      $or: [{ resumeVersion: null }, { resumeVersion: undefined }],
    });
    console.log(
      `✓ Deleted ${result.deletedCount} documents with null resumeVersion`
    );

    // Get remaining count
    const count = await ProfessionalContext.countDocuments();
    console.log(`✓ Remaining documents: ${count}`);

    console.log("\n✓ Cleanup complete! You can now save professional context.");
    process.exit(0);
  } catch (error: any) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

fixProfessionalContext();
