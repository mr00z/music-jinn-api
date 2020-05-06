import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import { join } from 'path';

import indexRouter from './routes/index';
import moodsRouter from './routes/moods';
import genresRouter from './routes/genres';
import jinnRouter from './routes/jinn';
import songsRouter from './routes/songs';
import apiKeyAuthentication from './middleware/apiKeyAuthentication';

const corsOptions = {
  optionsSuccessStatus: 200,
  origin: process.env.MUSIC_JINN_CLIENT_URI,
};

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(static(join(__dirname, "public")));

app.use(apiKeyAuthentication);

app.use('/', indexRouter);
app.use('/jinn', jinnRouter);
app.use('/moods', moodsRouter);
app.use('/genres', genresRouter);
app.use('/songs', songsRouter);

export default app;
