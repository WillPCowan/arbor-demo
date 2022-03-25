import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  up: Number,
  down: Number,
});

const viewSchema = new mongoose.Schema({
  name: String,
  votes: voteSchema,
  // versions: [viewVersionSchema]  // Future feature
  content: String,
});

const resourceSchema = new mongoose.Schema({
  name: String,
  votes: voteSchema,
  url: String,
});

const conceptSchema = new mongoose.Schema(
  {
    name: String,
    // views: [viewSchema],
    body: String,
    origin: String,
    wikidataId: String,
    wikipediaId: String,
    resources: [resourceSchema],
  },
  { timestamps: true }
);

const Concept = mongoose.model("Concept", conceptSchema);
export default Concept;
