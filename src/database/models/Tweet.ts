import { model, Schema } from "mongoose";

const schemaTweet = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  backupImage: { type: String },
});

const Tweet = model("Tweet", schemaTweet, "tweets");

export default Tweet;
