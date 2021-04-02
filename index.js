const express = require('express')
const app = express()
const ObjectId = require("mongodb").ObjectID;
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5055;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e9x41.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err);
  const bookCollection = client.db("BooksParadise").collection("books");

  app.get('/books', (req, res) => {
    bookCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })
  })

  app.get('/books/:id', (req, res) => {
    bookCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, items) => {
      console.log(err, items);
      res.send(items[0])
    })
  })
  
  app.post('/add-books', (req, res) => {
    const newBook = req.body;
    console.log('adding new event:', newBook);
    bookCollection.insertOne(newBook)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

//   client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})