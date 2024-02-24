import "dotenv/config";
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());

const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri);

app.post("/add/:chubby_neighborhood", async function (req, res) {
  const restaurantDb = client.db("sample_restaurants");
  const neighborhoods = restaurantDb.collection("neighborhoods");
  const result = await neighborhoods.insertOne({
    name: req.params.chubby_neighborhood,
  });
  client.db("sample_mflix").collection("comments");
  res.json(result);
});

async function getSessions(username, date_range_begin, date_range_end) {
  const users = client.db("user_database").collection("users");

  /* TODO working on this query */
  const cursor = users.find({ username: username }).project({
    sessions: {
      $filter: {
        input: "$sessions",
        as: "session",
        cond: {
          $gte: [date_range_begin, "$session.start"],
          $lte: [date_range_end, "$session.end"],
        },
      },
    },
  });

  const sessions = await cursor.toArray();
  return sessions;
}

app.get("/session/search", async (req, res) => {
  const username = req.query.username;
  const date_range_begin = req.query.date_range_begin;
  const date_range_end = req.query.date_range_end;
  console.log(username, date_range_begin, date_range_end);
  const sessions = await getSessions(
    username,
    date_range_begin,
    date_range_end,
  );
  res.json(sessions);
});

app.listen(8080);
