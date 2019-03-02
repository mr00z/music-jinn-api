import express from "express";
import mongodb, { MongoError } from "mongodb";
import { Song } from "../models/Song";

const MongoClient = mongodb.MongoClient;
const router = express.Router();
const uri = process.env.MONGO_DB;

router.get("/", (req, res) => {
  const client = new MongoClient(uri, { useNewUrlParser: true });
  // tslint:disable-next-line: arrow-parens
  client.connect(err => {
    if (err) {
      res.send(err.message);
    }
    const dbQuery = { moods: "" };
    const queryStr = req.query;
    if (queryStr) {
      dbQuery.moods = queryStr.mood;
    }
    const collection = client.db("musicjinn").collection("songs");

    collection
      .find(dbQuery.moods ? dbQuery : {})
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
