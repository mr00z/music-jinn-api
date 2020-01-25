import mongoose, { Document, Schema } from "mongoose";

export interface ISong extends Document {
  name: string;
  author: string;
  genre: string;
  moods: string[];
}

const SongSchema: Schema = new Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  moods: [String]
});

export default mongoose.model<ISong>("Song", SongSchema);
