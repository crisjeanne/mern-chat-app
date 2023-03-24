const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL;
const dbName = 'test';

// Edit a message
router.put('/:id', async (req, res) => {
  const client = await MongoClient.connect(url);
  const db = client.db(dbName);

  const id = req.params.id;
  const message = req.body.message;

  await db.collection('messages').updateOne({ _id: ObjectId(id) }, { $set: { message } });

  client.close();

  res.sendStatus(200);
});

// Delete a message
router.delete('/:id', async (req, res) => {
  const client = await MongoClient.connect(url);
  const db = client.db(dbName);

  const id = req.params.id;

  await db.collection('messages').deleteOne({ _id: ObjectId(id) });

  client.close();

  res.sendStatus(200);
});

module.exports = router;
