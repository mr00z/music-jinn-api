import cookieParser from "cookie-parser";
import cors from "cors";
import express, { json, urlencoded } from "express";
import logger from "morgan";
import { join } from "path";

import indexRouter from "./routes/index";
import moodsRouter from "./routes/moods";
import songsRouter from "./routes/songs";

const corsOptions = {
  optionsSuccessStatus: 200,
  origin: "*"
};

const app = express();

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(static(join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/songs", songsRouter);
app.use("/moods", moodsRouter);

export default app;
