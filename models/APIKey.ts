import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IAPIKey {
  consumerName: string;
  apiKey: string;
}

export type IAPIKeyDocument = IAPIKey & Document;

const APIKeySchema: Schema = new Schema({
  consumerName: { type: String, required: true },
  apiKey: { type: Object, required: true },
});

export default mongoose.model<IAPIKeyDocument>('APIKey', APIKeySchema);
