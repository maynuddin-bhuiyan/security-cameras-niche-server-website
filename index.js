const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');



const app = express();
const port = process.env.PORT || 7000;


//Middleware 

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l2npz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });






 
async function runerw () {
  try{
    await client.connect();
    const database = client.db('security-cameras');
    const camerasCollection = database.collection('cameras');
    const oderCollection = database.collection("oder");
    const reviewCollection = database.collection("review");
    const userCollection = database.collection("user");
    




    app.get('/cameras', async(req , res) => {
      const cursor = camerasCollection.find({});
      const cameras = await cursor.limit(6).toArray();
      res.send(cameras);

  });



    app.post('/oder', async(req, res) => {
      const user = req.body;
      const order =  await oderCollection.insertOne(user);
      console.log(order);
      res.send(order)

  });


  app.get('/oder', async(req , res) => {
    const email = req.query.email;
    const query = {email : email};
    const user = oderCollection.find(query);
    const order = await user.toArray();
    res.json(order);

});




  app.post('/review', async(req, res) => {
    const review = req.body;
    const orderreview =  await reviewCollection.insertOne(review);
    console.log(orderreview);
    res.send(orderreview)

});





app.get('/review', async(req , res) => {
  const cursor = reviewCollection.find({});
  const review = await cursor.toArray();
  res.send(review);

})


app.get('/user/:email', async(req, res) => {
  const email = req.params.email;
  const query = {email : email};
  const user = await userCollection.findOne(query);
  const isAdmin = false;
  if(user?.role === "admin"){
    isAdmin = true;
  }
  res.json({admin: is})

});


app.post('/user', async(req, res) => {
  const user = req.body;
  const userAll =  await userCollection.insertOne(user);
  console.log(userAll);
  res.send(userAll)

});



app.put('/user', async(req, res) => {
  const user = req.body;
  const filter = {email : user.email};
  const options = { upsert: true };
  const upDateuser = {$set : user};
  const result = await userCollection.updateOne(filter, upDateuser, options);
  res.json(result);

});


app.put('/user/admin', async(req, res) => {
  const user = req.body;
  const filter = {email : user.email};
  const upDateuser = {$set : {role: 'admin'}};
  const result = await userCollection.updateOne(filter, upDateuser);
  res.json(result);

});
   
    

  }
  finally{
     // await client.close();
  }
}


runerw().catch(console.dir);



app.get('/', (req, res) => {
  res.send('security-cameras-website')
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})