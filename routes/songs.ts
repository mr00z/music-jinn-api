import express from "express";
import mongoose from "mongoose";
import MoodsMap from "../helpers/MoodsMap";
import moodsDict from "../helpers/moodsOppositesDict";
import Song, { ISong } from "../models/Song";

const router = express.Router();
const uri = process.env.MONGO_DB;

const moodsMap = new MoodsMap(moodsDict);

router.get("/", (req, res) => {
  const dbQuery = { moods: "" };
  const queryStr = req.query;
  const { mood } = queryStr;
  if (queryStr) {
    if (queryStr.wantToStay === "true") {
      dbQuery.moods = mood;
    } else {
      const oppositeMood = moodsMap.getOppositeMood(mood);
      if (oppositeMood) {
        dbQuery.moods = oppositeMood;
      }
    }
  }

  mongoose.connect(uri, { useNewUrlParser: true });
  const db = mongoose.connection;
  db.once("open", async () => {
    try {
      const queryResult: ISong[] = await Song.find(dbQuery).exec();
      res.send(queryResult);
    } catch (e) {
      res.status(500).send(e);
    }
  });
});

export default router;
