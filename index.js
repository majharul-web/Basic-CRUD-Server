const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;

// middle war
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6soco.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();


        // database and collection
        const database = client.db('crud_products');
        const userCollections = database.collection('products');

        // read data
        app.get('/products', async (req, res) => {
            const cursor = await userCollections.find({}).toArray();
            res.send(cursor);
        })

        // insert data
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await userCollections.insertOne(product);

            res.json(result);
        })

        // delete 
        app.delete('/products/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollections.deleteOne(query);

            res.json(result);
        })

        // get single product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollections.findOne(query);
            res.send(result)
        })

        // update
        app.put('/products/update/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    productName: updatedProduct.productName,
                    price: updatedProduct.price,
                    quantity: updatedProduct.quantity
                },
            };
            const result = await userCollections.updateOne(filter, updateDoc, options)
            console.log('updating', id)

            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);




//----------------------------- home page-----------------------------
app.get('/', (req, res) => {
    res.send('welcome to basic CRUD');
})
app.listen(port, () => {
    console.log(`Basic CRUD Server listening at http://localhost:${port}`)
})
//----------------------------- home page-----------------------------


