import { ISong } from '../models/Song';
import IConnector from './IConnector';
import YouTubeConnector from './youtube/YouTubeConnector';
import LastFmConnector from './lastfm/LastFmConnector';

class ConnectorsFactory {
  song: ISong;
  constructor(song: ISong) {
    this.song = song;
  }

  getConnector(serviceName: string): IConnector {
    switch (serviceName) {
      case 'youtube':
        return new YouTubeConnector(this.song);
      case 'lastfm':
        return new LastFmConnector(this.song);
      default:
        return null;
    }
  }
}

export default ConnectorsFactory;
