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
        const productsCollections = database.collection('products');
        const orderCollections = database.collection('orders');

        // read data
        app.get('/products', async (req, res) => {
            const cursor = await productsCollections.find({}).toArray();
            res.send(cursor);
        })

        // insert data
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollections.insertOne(product);

            res.json(result);
        })

        // delete 
        app.delete('/products/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollections.deleteOne(query);

            res.json(result);
        })

        // get single product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollections.findOne(query);
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
            const result = await productsCollections.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })

        // order
        app.post('/buyProducts', async (req, res) => {
            const orderProducts = req.body;
            const result = await orderCollections.insertOne(orderProducts);
            res.send(result)
        })

        // find order
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const result = await orderCollections.find({ email: email }).toArray();
            res.send(result)
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


