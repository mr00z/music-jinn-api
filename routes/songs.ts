import express, { Request, Response } from 'express';
import Song, { ISongDocument, SongQuery } from '../models/Song';

const router = express.Router();
const DEFAULT_PAGE = 1;
const DEFAULT_RESULTS_PER_PAGE = 10;

router.get('/', async (req: Request, res: Response) => {
  const queryStr: SongQuery = req.query;
  const { page, resultsPerPage, query } = queryStr;

  const pageNumber = parseInt(page, 10) || DEFAULT_PAGE;
  const resultsPerPageNumber = parseInt(resultsPerPage, 10) || DEFAULT_RESULTS_PER_PAGE;

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
    res.status(500).send(e.message);
  }
});

export default router;
