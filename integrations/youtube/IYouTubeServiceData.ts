import { youtube_v3 } from 'googleapis';

interface IYouTubeServiceData {
  responseData: youtube_v3.Schema$SearchResult;
  updatedAt: Date;
}

export default IYouTubeServiceData;
