const express = require('express')
const dotenv = require("dotenv")
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config()

const uri = process.env.MONGODB_URL;
const app = express()
const port = process.env.PORT||5000

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const db =client.db('studynook')
    const addroomCollection =db.collection("addrooms")
    const addBookCollection =db.collection("bookscollection")

     app.get("/rooms",async(req,res)=>{
        const result =await addroomCollection.find().toArray()
        res.json(result)
     })

    //  mylisting api 
    app.get("/mylisting",async(req,res)=>{
      const email =req.query.email
      console.log(email);
      const result = await addroomCollection.find({email:email}).toArray()
      res.json(result)
     })
      

     app.get("/feautersection",async(req,res)=>{
      const result = await addroomCollection.find().limit(6).toArray()
      res.json(result);
     })
    
    app.post("/addroom",async (req,res)=>{
        const addroomData = req.body
        console.log(addroomData);
        const result =await addroomCollection.insertOne(addroomData)
        res.json(result)
    })


    // post booking data 
    app.post("/mybookins",async (req,res)=>{
        const addbookData = req.body
        
        const result =await addBookCollection.insertOne(addbookData)
        res.json(result)
    })
    // get booking data 
      app.get("/mybookins",async(req,res)=>{
        const {email} =req.query
        const query ={email:email};

        const result =await addBookCollection.find(query).toArray()
        res.json(result)
     })

    //  delete booking
    app.delete("/mybookins/:id",async(req,res)=>{
      const {id} =req.params;
      const query ={_id :new ObjectId(id)};
      const result = await addBookCollection.deleteOne(query);
      res.send(result)

    })


    app.get("/rooms/:id",async(req,res)=> {
        const {id} =req.params
        const result =await addroomCollection.findOne({_id: new ObjectId(id)})
        res.json(result)
    })

    app.patch("/rooms/:id",async (req,res)=> {
      const {id} =req.params
      const updatedData =req.body

      const result = await addroomCollection.updateOne(
        {_id: new ObjectId(id)},
         {$set:updatedData}
      )
      res.json(result) 
    })


    app.delete("/rooms/:id",async(req,res)=> {
      const {id} = req.params;
      const result =await addroomCollection.deleteOne({_id: new ObjectId(id)})
      res.json(result)
    })

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('server running is fine')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
