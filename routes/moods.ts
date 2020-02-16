import express from "express";
import mongoose from "mongoose";
import Song from "../models/Song";

const router = express.Router();

router.get("/", (req, res) => {
  mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true });
  const db = mongoose.connection;

  db.once("open", async () => {
    try {
      const moods = await Song.distinct("moods");
      res.send(moods);
    } catch (e) {
      res.status(500).send(e);
    }
  });
});

export default router;
