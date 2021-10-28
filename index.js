const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId

const cors = require('cors')
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oewpu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("CarMechanics");
        const ServicesCollection = database.collection("Services");
        //Get api
        app.get('/services', async (req, res) => {
            const cursor = ServicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })
        //Get single services
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const service = await ServicesCollection.findOne(query);
            res.json(service)
        })

        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service);
            const result = await ServicesCollection.insertOne(service)
            console.log(result);
            res.json(result)
        })
        //Delete api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await ServicesCollection.deleteOne(query);
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running genius server')

});
app.listen(port, () => {
    console.log('Running in port', port);
});