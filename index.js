const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;


//middleware
app.use(cors());
app.use(express.json());

//user: feedingBD
//Pass: M4wTAcxT1Ggxt1Xs

console.log(process.env.DB_USER)
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b2stcle.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const foodCollection = client.db('feedingBD').collection('foods');
    const foodRequestCollection = client.db('feedingBD').collection('requestFood')


app.post('/foods',async(req, res)=>{
    const food= req.body;
const result = await foodCollection.insertOne(food);
res.send(result)
})

app.post('/foodsrequest',async(req, res)=>{
  const foodrequest = req.body;
  const result = await foodRequestCollection.insertOne(foodrequest);
  res.send(result)
})




//get all food for available food
app.get('/foods',async(req, res)=>{
 const cursor =foodCollection.find()
  const result = await cursor.toArray()
  res.send(result)
})

//get single food for detail
app.get('/foods/:id',async(req, res)=>{
  const id=req.params.id;
  console.log(id)
  const cursor = {_id: new ObjectId(id)}
  const result = await foodCollection.findOne(cursor);
  res.send(result)
})



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req, res)=>{
    res.send('Feeding BD Server is Running');
})

app.listen(port,()=>{
    console.log(`feeding bd server is running on port:${port}`);
})