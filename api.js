const express = require('express');
const mongodb = require('mongodb');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection URI
// const mongoURI = 'mongodb://localhost:27017';
const mongoURI = 'mongodb://cpride829:<password>@snowcatcluster:27017/game-chars-database';
const dbName = 'game-chars-database';
const collectionName = 'game-chars-collection';

// Create a MongoDB client
const MongoClient = mongodb.MongoClient;
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
let db;
client.connect((err) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');
  db = client.db(dbName);

  const charactersCollection = db.collection('characters');
  charactersCollection.countDocuments()
    .then(count => {
      if (count === 0) {
        charactersCollection.insertMany([
          { name: "Sebastian Sallow", game: "Hogwarts Legacy" },
          { name: "Nathan Drake", game: "Uncharted" },
          { name: "Lara Croft", game: "Tomb Raider" }
        ])
        .then(result => {
          console.log('Game character data inserted successfully');
        })
        .catch(error => {
          console.error('Error inserting game character data:', error);
        });
      }
    })
    .catch(error => {
      console.error('Error checking game character data:', error);
    });
});

app.use(express.json());

// Create a new character
app.post('/characters', async (req, res) => {
  const charactersCollection = db.collection('characters');
  const newCharacter = {
    name: req.body.name,
    game: req.body.game
  };
  try {
    const result = await charactersCollection.insertOne(newCharacter);
    res.status(201).json(result.ops[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all characters
app.get('/characters', async (req, res) => {
  const charactersCollection = db.collection('characters');
  try {
    const characters = await charactersCollection.find({}).toArray();
    res.json(characters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single character by ID
app.get('/character/:id', async (req, res) => {
  const charactersCollection = db.collection('characters');
  try {
    const character = await charactersCollection.findOne({ _id: new mongodb.ObjectID(req.params.id) });
    if (!character) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }
    res.json(character);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a character by ID
app.put('/characters/:id', async (req, res) => {
  const charactersCollection = db.collection('characters');
  try {
    const filter = { _id: new mongodb.ObjectID(req.params.id) };
    const updateDoc = { $set: { name: req.body.name, game: req.body.game } };
    const result = await charactersCollection.updateOne(filter, updateDoc);
    if (result.modifiedCount === 0) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }
    res.json({ message: 'Character updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a character by ID
app.delete('/characters/:id', async (req, res) => {
  const charactersCollection = db.collection('characters');
  try {
    const result = await charactersCollection.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Character not found' });
      return;
    }
    res.json({ message: 'Character deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
