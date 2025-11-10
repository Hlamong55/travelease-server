const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster01.quh7cvg.mongodb.net/?appName=Cluster01`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("TravelEase server is running");
});

async function run() {
  try {
    await client.connect();

    const db = client.db("travelease");
    const vehicleCollection = db.collection("vehicles");

    // vehicle releted APIs
    app.get("/vehicles", async (req, res) => {
      const cursor = vehicleCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

   

    app.get("/vehicles/latest", async (req, res) => {
      try {
        const vehicles = await vehicleCollection
          .find()
          .sort({ createdAt: -1 }) 
          .limit(6)
          .toArray();
        res.send(vehicles);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to load vehicles" });
      }
    });


    

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`TravelEase server is running on port: ${port}`);
});
