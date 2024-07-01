const express = require('express');
const cors = require('cors');
// const corsOptions ={
//   origin:['https://assignment-10-type-2.web.app', 'http://localhost:5000'], 
//   credentials:false,            
//   optionSuccessStatus:200
// }

require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json())




app.get('/', (req, res) => {
  res.send("Simple crud is running")
})

app.listen(port, () => {
  console.log(`crud is running through ${port}`)
})

console.log(process.env.DB_USER)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5hzivst.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const textileArtCollection = client.db("textileItemsDB").collection("items");

    app.post('/items', async (req, res) => {
      const items = req.body;
      console.log(items);
      const result = await textileArtCollection.insertOne(items);
      res.send(result)
    })

    app.get("/items", async (req, res) => {
      const data = textileArtCollection.find();
      const result = await data.toArray();
      res.send(result);
    });


    app.delete("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log(id)
      const result = await textileArtCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/items/:id", async (req, res) => {
      const data = req.body;
      const Update = data.itemDetails
      console.log(Update)
      const paramsId = req.params.id;
      const filter = { _id: new ObjectId(paramsId) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          image: Update.image,
          itemName: Update.itemName,
          subcategoryName: Update.subcategoryName,
          description: Update.description,
          price: Update.price,
          rating: Update.rating,
          customization: Update.customization,
          processingTime: Update.processingTime,
          stockStatus: Update.stockStatus,
          email: Update.email,
          userName: Update.userName
        },
      };
      const result = await textileArtCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });


    app.get("/subcategories", async (req, res) => {
      const data = Categories.find();
      const result = await data.toArray();
      res.send(result);
    });



    app.get('/items/:subcategoryName', async(req, res)=> {
      // const item = req.body;
      console.log("subcategory request" , req.params.subcategoryName);
      const result = await textileArtCollection.find({ subcategoryName:req.params.subcategoryName }).toArray();
      res.send(result);
  });


  app.get('/item/:email', async(req, res)=> {
    // const item = req.body;
    console.log(req.params.user_email);
    const result = await textileArtCollection.find({ email:req.params.email }).toArray();
    res.send(result);
  });



    /////////////////////////////////





    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);

