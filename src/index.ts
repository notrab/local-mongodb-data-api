import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { Db, Document, MongoClient } from "mongodb";

let db: Db;

// TODO: Handle connections better
MongoClient.connect("mongodb://localhost:27017").then((client) => {
  console.log("Connected to database");
  db = client.db("test");
});

const app = new Hono();

const allowedActions = [
  "findOne",
  "find",
  "insertOne",
  "insertMany",
  "updateOne",
  "updateMany",
  "replaceOne",
  "deleteOne",
  "deleteMany",
  "aggregate",
];

app.post("/:action", async (c) => {
  const action = c.req.param("action");
  const body = await c.req.json();

  if (!allowedActions.includes(action)) {
    return c.json(
      {
        message: `You must use one of the following actions: ${allowedActions.join(
          ", "
        )}. You provided '${action}'`,
      },
      400
    );
  }

  // TODO: Refactor one more cases are handled
  switch (action) {
    case "findOne": {
      const { collection, filter, projection } = body;

      const options = { projection };

      const document = await db
        .collection(collection)
        .findOne(filter || {}, options);

      if (!document) {
        return c.json({ document: null });
      }

      return c.json({ document });
    }

    case "find": {
      const { collection, filter, projection, sort, limit, skip } = body;

      const options = {
        sort,
        projection,
        limit,
        skip,
      };

      if (
        (await db.collection(collection).countDocuments(filter || {})) === 0
      ) {
        return c.json([]);
      }

      const cursor = await db
        .collection(collection)
        .find(filter || {}, options);

      let results: Document[] = [];

      for await (const doc of cursor) {
        results.push(doc);
      }

      return c.json(results);
    }
    case "insertOne": {
      const { collection, document } = body;

      const result = await db.collection(collection).insertOne(document);

      return c.json(result);
    }
    default: {
      return c.status(400);
    }
  }
});

serve(app);
