import { ISong } from '../models/Song';

export default interface IConnector {
  song: ISong;
  getServiceData(): Promise<any>;
}
