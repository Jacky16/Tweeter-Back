import { model, Schema } from "mongoose";

const schemaTweet = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  backupImage: { type: String },
  dateOfCreation: { type: Date, default: Date.now },
  visibilityOpen: { type: Boolean, default: true },
});

const Tweet = model("Tweet", schemaTweet, "tweets");

export default Tweet;
