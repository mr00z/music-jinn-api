import Song from '../models/Song';
import mongoose from 'mongoose';

// tslint:disable no-console
export async function updateServicesDataInAllSongs() {
  const allSongs = await Song.find({});

  try {
    for (const song of allSongs) {
      await song.updateServicesData();
      console.log(`Song with id: ${song.id} has been updated`);
    }
  } catch (error) {
    console.log(error.message);
  }
}
// tslint:enable no-console
