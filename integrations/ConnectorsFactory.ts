import { ISong } from '../models/Song';
import YouTubeConnector from './youtube/YouTubeConnector';

class ConnectorsFactory {
  song: ISong;
  constructor(song: ISong) {
    this.song = song;
  }

  getConnector(serviceName: string) {
    switch (serviceName) {
      case 'youtube':
        return new YouTubeConnector(this.song);
      default:
        return null;
    }
  }
}

export default ConnectorsFactory;
