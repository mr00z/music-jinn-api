import { youtube_v3 } from 'googleapis';
import GetTrackInfoResponse from './lastfm/GetTrackInfoResponse';

export default interface IServiceData {
  responseData: youtube_v3.Schema$SearchResult | GetTrackInfoResponse;
  updatedAt: Date;
}
