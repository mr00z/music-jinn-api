import mongoose, { Document, Schema } from 'mongoose';
import IYouTubeServiceData from '../integrations/youtube/IYouTubeServiceData';
import ConnectorsFactory from '../integrations/ConnectorsFactory';
import Connectors from '../integrations/ConnectorsEnum';

interface IServicesData {
  youtube: IYouTubeServiceData;
}

export interface ISong {
  title: string;
  author: string;
  genres: string[];
  moods: string[];
  servicesData: IServicesData;
}

export interface ISongQuery {
  page: string;
  resultsPerPage: string;
  query: string;
  genres: string[];
  moods: string[];
}

export interface ISongDocument extends ISong, Document {
  updateServicesData: () => Promise<void>;
  initializeServicesData: () => Promise<void>;
}

const SongSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genres: { type: [String], required: true },
  moods: [String],
  servicesData: Object,
});

SongSchema.index({ title: 'text', author: 'text' });

SongSchema.methods.initializeServicesData = async function (): Promise<void> {
  const connectorsFactory = new ConnectorsFactory(this);
  this.servicesData = {};
  for (const connectorName of Object.values(Connectors)) {
    const connector = connectorsFactory.getConnector(connectorName);
    const serviceData = await connector.getServiceData();
    this.servicesData[connectorName] = {
      responseData: serviceData,
      updatedAt: new Date(),
    };
  }
  await this.save();
};

SongSchema.methods.updateServicesData = async function (): Promise<void> {
  const today = new Date();
  const connectorsFactory = new ConnectorsFactory(this);
  let isUpdated = false;

  for (const serviceName in this.servicesData) {
    if (this.servicesData.hasOwnProperty(serviceName)) {
      const element = this.servicesData[serviceName];
      if (!element || element.updatedAt.getDate() < today.getDate() - 7) {
        const connector = connectorsFactory.getConnector(serviceName);
        const serviceData = await connector.getServiceData();
        element.responseData = serviceData;
        element.updatedAt = new Date();

        isUpdated = true;
      }
    }
  }
  if (isUpdated) {
    this.markModified('servicesData');
    await this.save();
  }
};

export default mongoose.model<ISongDocument>('Song', SongSchema);
