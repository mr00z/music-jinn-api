import mongoose, { Document, Schema } from 'mongoose';
import ConnectorsFactory from '../integrations/ConnectorsFactory';
import Connectors from '../integrations/ConnectorsEnum';
import { isDateLaterThan } from '../helpers/utils';
import IServiceData from '../integrations/IServiceData';

interface IServicesData {
  [key: string]: IServiceData;
}

export interface ISong {
  title: string;
  author: string;
  genres: string[];
  moods: string[];
  servicesData: IServicesData;

  updateServicesData(): Promise<void>;
  initializeServicesData(): Promise<void>;
}

export type ISongDocument = ISong & Document;

export type SongQuery = {
  page: string;
  resultsPerPage: string;
  query: string;
  genres: string[];
  moods: string[];
};

const SongSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genres: { type: [String], required: true },
  moods: [String],
  servicesData: Object,
});

class Song extends mongoose.Model implements ISong {
  title: string;
  author: string;
  genres: string[];
  moods: string[];
  servicesData: IServicesData;

  async updateServicesData(): Promise<void> {
    const connectorsFactory = new ConnectorsFactory(this);
    let isUpdated = false;

    for (const connectorName of Object.values(Connectors)) {
      if (this.servicesData.hasOwnProperty(connectorName)) {
        const element = this.servicesData[connectorName];

        if (!element || isDateLaterThan(7, element.updatedAt)) {
          const connector = connectorsFactory.getConnector(connectorName);

          element.responseData = await connector.getServiceData();
          element.updatedAt = new Date();

          isUpdated = true;
        }
      } else {
        const connector = connectorsFactory.getConnector(connectorName);
        this.servicesData[connectorName] = { responseData: {}, updatedAt: null };
        this.servicesData[connectorName].responseData = await connector.getServiceData();
        this.servicesData[connectorName].updatedAt = new Date();

        isUpdated = true;
      }
    }
    if (isUpdated) {
      this.markModified('servicesData');
      await this.save();
    }
  }
  async initializeServicesData(): Promise<void> {
    const connectorsFactory = new ConnectorsFactory(this);
    this.servicesData = { youtube: null, lastfm: null };
    for (const connectorName of Object.values(Connectors)) {
      const connector = connectorsFactory.getConnector(connectorName);
      const serviceData = await connector.getServiceData();
      this.servicesData[connectorName] = {
        responseData: serviceData,
        updatedAt: new Date(),
      };
    }
    await this.save();
  }
}

SongSchema.loadClass(Song);

SongSchema.index({ title: 'text', author: 'text' });

export default mongoose.model<ISongDocument>('Song', SongSchema);
