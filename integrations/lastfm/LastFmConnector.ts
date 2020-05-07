import fetch from 'node-fetch';
import { ISong } from '../../models/Song';
import IConnector from '../IConnector';
import GetTrackInfoResponse from './GetTrackInfoResponse';

class LastFmConnector implements IConnector {
  #endpoint: string = 'http://ws.audioscrobbler.com/2.0/';
  #apiKey: string;
  song: ISong;

  constructor(song: ISong) {
    this.song = song;
    this.#apiKey = process.env.LAST_FM_API_KEY;
  }

  getTrackInfo(artist: string, track: string): Promise<any> {
    if (!artist || !track) return;
    return fetch(
      `${this.#endpoint}?method=track.getInfo&api_key=${this.#apiKey}&artist=${artist}&track=${track}&format=json`
    );
  }

  async getServiceData(): Promise<GetTrackInfoResponse> {
    const response = await this.getTrackInfo(this.song.author, this.song.title);
    const trackInfo: GetTrackInfoResponse = await response.json();

    return trackInfo;
  }
}

export default LastFmConnector;
