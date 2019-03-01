import mongoose from "mongoose";

export type Song = mongoose.Document & {
  name: string;
  author: string;
  genre: string;
  moods: string[];
};
