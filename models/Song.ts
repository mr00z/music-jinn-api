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

    if (!this.servicesData) this.servicesData = {};

    for (const connectorName of Object.values(Connectors)) {
      if (this.servicesData.hasOwnProperty(connectorName)) {
        const element = this.servicesData[connectorName];

        if (!element || isDateLaterThan(90, element.updatedAt)) {
          const connector = connectorsFactory.getConnector(connectorName);

          element.responseData = await connector.getServiceData();
          element.updatedAt = new Date();

          isUpdated = true;
        }
      } else {
        const connector = connectorsFactory.getConnector(connectorName);
        const serviceData = await connector.getServiceData();
        this.servicesData[connectorName] = {
          responseData: serviceData,
          updatedAt: new Date(),
        };

        isUpdated = true;
      }
    }
    if (isUpdated) {
      this.markModified('servicesData');
      await this.save();
    }
  }
}

SongSchema.loadClass(Song);

SongSchema.index({ title: 'text', author: 'text' });

export default mongoose.model<ISongDocument>('Song', SongSchema);
