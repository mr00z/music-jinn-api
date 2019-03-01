import express from "express";
import { Song } from "../models/Song";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ xd: "1" });
});

export default router;
