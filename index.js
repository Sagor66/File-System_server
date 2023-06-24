const express = require('express')
const cors = require("cors")
const app = express()
const port = process.env.port || 5000

app.use(cors())
app.use(express.json())

// file_system_user
// 5lZ9EymIirt0yLeU


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://file_system_user:5lZ9EymIirt0yLeU@cluster0.1octync.mongodb.net/?retryWrites=true&w=majority";

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

    const fileSystemCollection = client.db("File_System").collection("folder_structures")
    const childFileCollection = client.db("File_System").collection("child_folders")

    app.get("/folders", async (req, res) => {
        const folders = fileSystemCollection.find()
        const result = await folders.toArray()
        res.send(result)
    })

    app.post("/folders", async (req, res) => {
        const newFolder = req.body
        console.log(req.body)
        const result = await fileSystemCollection.insertOne(newFolder)
        res.send(result)
    })

    app.delete("/folders/:id", async (req, res) => {
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        const result = await fileSystemCollection.deleteOne(query)
        res.send(result)
    })

    // app.patch("/folders/:id", async (req, res) => {
    //     const id = req.params.id
    //     const query = { _id: new ObjectId(id) }
    //     const updatedFolder = req.body

    // })


    // child folders
    app.get("/folders/:id", async (req, res) => {
        const id = req.params.id
        const query = { root_id: id }
        const options = {
            projection: {
                name: 1,
                root_id: 1,
            }
        }
        const folders = childFileCollection.find(query, options)
        // childFileCollection.find({ root_id: id }).toArray()
        // const data = folders.filter(folder => folder._id === id )
        // console.log(data)
        const result = await folders.toArray()
        res.send(result)
    })

    app.post("/folders/:id", async (req, res) => {
        const id = req.params.id
        console.log(id)
        let newFolder = req.body
        newFolder = {
            root_id: id,
            ...newFolder
        }
        console.log(newFolder)
        const result = await childFileCollection.insertOne(newFolder)
        res.send(result)
    })

    app.delete("/folders/child/:id", async (req, res) => {
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        const result = await childFileCollection.deleteOne(query)
        res.send(result)
    })



    // app.get("/folders/:id", async (req, res) => {
    //     const id = req.params.id
    //     const query = { _id: new ObjectId(id) }
    //     const result = await fileSystemCollection.deleteOne(query)
    // })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('File Server is running')
})

app.listen(port, () => {
  console.log(`Files are coming in ${port}`)
})