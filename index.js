const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000


//middleware
app.use(cors());
app.use(express.json());



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
    // await client.connect();


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




//get all food for available food//
app.get('/foods',async(req, res)=>{
 const cursor =foodCollection.find()
  const result = await cursor.toArray()
  res.send(result)
})

//get single food for detail
app.get('/foods/:id',async(req, res)=>{
  const id=req.params.id;
  const cursor = {_id: new ObjectId(id)}
  const result = await foodCollection.findOne(cursor);
  res.send(result)
})


//get some specific data by email
app.get('/foods', async(req, res)=>{
 let query = {};
 if(req.query?.email){
  query = {donatorEmail: req.query.email}
 }
const cursor =foodCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
})

//get spcifiq request food by email
app.get('/requestFood', async(req, res)=>{
 let query = {};
 if(req.query?.email){
  query = {userEmail: req.query.email}
 }
const cursor =foodRequestCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
})

//get one requestFood for manage Food Detail
app.get('/requestFood/:id', async (req, res) => {
  const id = req.params.id;
  const cursor = {foodId:id};
  const result = await foodRequestCollection.find(cursor).toArray();
  res.send(result);
});
//delete one foods for manage food
app.delete ('/foods/:id', async(req, res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await foodCollection.deleteOne(query);
  res.send(result);
})

//delete one food my foodrRequestCollection if status:available and id maching
app.delete ('/requestFood/:id', async(req, res)=>{
const id = req.params.id;
const result = await foodRequestCollection.deleteOne({
  _id: new ObjectId(id),
  foodStatus: 'Available'
});
  res.send(result);
})



//Put for updated 
app.put('/foods/:id', async(req, res) =>{
  const id = req.params.id;
  const filter ={_id: new ObjectId(id)}
  const options = {upsert: true};
  const updatefood = req.body;
  console.log(updatefood)
  const food ={
    $set: {
      foodName: updatefood.foodName,
      image: updatefood.image,
      quantity: updatefood.quantity,
      pickup: updatefood.pickup,
      date: updatefood.date,
      note: updatefood.note,
      status: updatefood.status,
      donatorImage:updatefood.donatorImage,
      donatorName: updatefood.donatorName,
      donatorEmail:updatefood.donatorEmail

    }
  }
  const result = await foodCollection.updateOne(filter,food,options)
  res.send(result)
})

//Patch for manage my food manage button 
app.patch('/requestFood/:id',async(req, res)=>{
  const id = req.params.id;
  console.log(id)
  const filter = {_id: new ObjectId(id)};
  const updatedFood = req.body;
  console.log(updatedFood);
  const updateDoc = {
    $set:{
      foodStatus: updatedFood.foodStatus
    },
  };
  const result = await foodRequestCollection.updateOne(filter,updateDoc)
  res.send(result)

})

//Patch for manage my food manage button 
app.patch('/requestFood/:id',async(req, res)=>{
  const id = req.params.id;
  console.log(id)
  const filter = {_id: new ObjectId(id)};
  const updatedFood = req.body;
  console.log(updatedFood);
  const updateDoc = {
    $set:{
      foodStatus: updatedFood.foodStatus
    },
  };
  const result = await foodRequestCollection.updateOne(filter,updateDoc)
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