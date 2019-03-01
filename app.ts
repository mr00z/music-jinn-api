import cookieParser from "cookie-parser";
import express, { json, urlencoded } from "express";
import logger from "morgan";
import { join } from "path";

import indexRouter from "./routes/index";
import songsRouter from "./routes/songs";

const app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(static(join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/songs", songsRouter);

export default app;
