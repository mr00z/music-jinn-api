import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Song, { ISongDocument, ISongQuery } from '../models/Song';

const router = express.Router();
const uri = process.env.MONGO_DB;
const DEFAULT_PAGE = 1;
const DEFAULT_RESULTS_PER_PAGE = 10;

router.get('/', async (req: Request, res: Response) => {
  const queryStr: ISongQuery = req.query;
  const { page, resultsPerPage, query } = queryStr;

  const pageNumber = parseInt(page, 10) || DEFAULT_PAGE;
  const resultsPerPageNumber = parseInt(resultsPerPage, 10) || DEFAULT_RESULTS_PER_PAGE;

  await mongoose.connect(uri, { useNewUrlParser: true });
  try {
    const collationSettings = { locale: 'en', strength: 2 };

    const mongoQuery = query ? { $text: { $search: queryStr.query } } : {};

    const foundSongs: ISongDocument[] = await Song.find(mongoQuery)
      .collation(collationSettings)
      .skip(resultsPerPageNumber * pageNumber - resultsPerPageNumber)
      .limit(resultsPerPageNumber)
      .exec();

    const songsCount = await Song.countDocuments(mongoQuery).collation(collationSettings).exec();

    res.send({
      songs: foundSongs,
      currentPage: page,
      pagesCount: Math.ceil(songsCount / resultsPerPageNumber),
      resultsCount: songsCount,
    });
  } catch (e) {
    res.status(500).send(e);
  }
  mongoose.connection.close();
});

export default router;
