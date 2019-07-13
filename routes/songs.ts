import express from "express";
import mongodb, { MongoError } from "mongodb";
import MoodsMap from "../helpers/MoodsMap";
import moodsDict from "../helpers/moodsOppositesDict";
import { Song } from "../models/Song";

const MongoClient = mongodb.MongoClient;
const router = express.Router();
const uri = process.env.MONGO_DB;

const moodsMap = new MoodsMap(moodsDict);

router.get("/", (req, res) => {
  const client = new MongoClient(uri, { useNewUrlParser: true });
  // tslint:disable-next-line: arrow-parens
  client.connect(err => {
    if (err) {
      res.send(err.message);
    }
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
    const collection = client.db("musicjinn").collection("songs");
    // tslint:disable-next-line: no-console
    console.log(dbQuery);
    collection
      .find(dbQuery)
      .toArray()
      .then((value: Song[]) => {
        res.send(value);
        client.close();
      })
      .catch((reason: MongoError) => {
        res.send(reason.message);
      });
  });
});

export default router;
