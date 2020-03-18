import mongoose, { Document, Schema } from 'mongoose';

export interface ISong {
  name: string;
  author: string;
  genre: string;
  moods: string[];
}

export interface ISongQuery extends ISong {
  page: number;
  resultsPerPage: number;
}

export interface ISongDocument extends ISong, Document {}

const SongSchema: Schema = new Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  moods: [String]
});

export default mongoose.model<ISongDocument>('Song', SongSchema);
