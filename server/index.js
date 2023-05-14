const express = require('express')
const app = express()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5050;

app.use(express.json());
app.use(cors());
require('dotenv').config(); 


// const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.cvfa5.mongodb.net/$easyConsulting?retryWrites=true&w=majority`;
const uri = "mongodb+srv://ynagoorgani:VhiS6kFkC1CJ1KxX@cluster0.lpmozoy.mongodb.net/cluster0?retryWrites=true&w=majority";



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("easyConsulting").collection("services");
  const reviewCollection = client.db("easyConsulting").collection("review");
  const orderCollection = client.db("easyConsulting").collection("orders");
  const adminCollection = client.db("easyConsulting").collection("admin");

  const handlePost = (route, collection) => {
    app.post(route, (req, res) => {
      const data = req.body;
      collection.insertOne(data)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
    })
  }
  handlePost('/addService', serviceCollection)
  handlePost('/addReview', reviewCollection)
  handlePost('/addOrder', orderCollection)
  handlePost('/addAdmin', adminCollection)


  const handleGet = (route, collection, findObj = {}) => {
    app.get(route, (req, res) => {
      collection.find(
        findObj === 'email' ? {email: req.query.email}:
        findObj === 'id'? {_id: ObjectId(req.params.id)}: null
      )
      .toArray((err, items) => {
        res.send(items)
      })
    })
  }
  handleGet('/services', serviceCollection);
  handleGet('/reviews', reviewCollection);
  handleGet('/orders', orderCollection);
  handleGet('/bookingList', orderCollection, 'email');
  handleGet('/admin', adminCollection, 'email')
  handleGet('/userReview', reviewCollection, 'email');
  handleGet('/userReview/:id', reviewCollection, 'id');

  
  const handleUpdate = (route, collection) => {
    app.patch(route, (req, res) => {
      collection.updateOne({_id: ObjectId(req.params.id)},{
          $set: req.body
      })
      .then(result => {
        res.send( result.modifiedCount > 0)
      })
    })
  }
  handleUpdate('/statusUpdate/:id', orderCollection);
  handleUpdate('/updateReview/:id', reviewCollection);
  handleUpdate('/updateService/:id', serviceCollection);


  const handleDelete = (route, collection) => {
    app.delete(route, (req, res) => {
      collection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
        res.send( result.deletedCount > 0)
      })
    })
  }
  handleDelete('/delete/:id', serviceCollection);
  handleDelete('/deleteReview/:id', reviewCollection);
  handleDelete('/deleteOrder/:id', orderCollection);
    
});

app.get('/', (req, res) => {
	console.log("hellow workng")
	res.send('welcome to easy consulting!')
	
})

app.listen(port)