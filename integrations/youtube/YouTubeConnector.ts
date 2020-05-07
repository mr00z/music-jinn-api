import { google, youtube_v3 } from 'googleapis';
import { ISong } from '../../models/Song';
import IConnector from '../IConnector';

class YouTubeConnector implements IConnector {
  #youtube: youtube_v3.Youtube;
  song: ISong;

  constructor(song: ISong) {
    this.#youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY,
    });
    this.song = song;
  }

  performSearch(maxResults: number = 1) {
    return this.#youtube.search.list({
      part: 'id,snippet',
      q: `${this.song.author} - ${this.song.title}`,
      maxResults,
    });
  }

  async getServiceData(): Promise<youtube_v3.Schema$SearchResult> {
    const response = await this.performSearch();
    return response.data.items[0];
  }
}

export default YouTubeConnector;
