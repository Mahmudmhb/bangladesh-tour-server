const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()

const cors = require('cors')


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gegfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('menu-product');
        const menuCollection = database.collection('products');
        const handleAddToCartCollection = database.collection("handleAddToCarts");

        app.post("/handleAddToCarts", async (req, res) => {
            const handleAddToCart = req.body;
            const result = await handleAddToCartCollection.insertOne(handleAddToCart)

            console.log(result)
            res.json(result)

        });

        app.get('/handleAddToCarts', async (req, res) => {
            const email = req.query;
            const query = { email: email };
            console.log(email)
            const cursor = handleAddToCartCollection.find({});
            const handleAddToCart = await cursor.toArray();
            console.log(handleAddToCart)
            res.json(handleAddToCart);
            // res.json("message", email)
        });
        app.delete('/handleAddToCarts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await handleAddToCartCollection.deleteOne(query)
            // console.log(result)
            // console.log('deleting user', id);
            res.json(result)
        })

        app.get('/menus', async (req, res) => {
            const cursor = menuCollection.find({});
            const user = await cursor.toArray();
            res.send(user)
        })
        app.post('/menus', async (req, res) => {
            const newAddMenu = req.body;
            const result = await menuCollection.insertOne(newAddMenu)
            console.log('post hittng', req.body)
            console.log(result)
            res.send(result)
        })

    }
    finally {
        // await client.close()
    }


}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('hello world');
})

app.listen(PORT, () => {
    console.log("htting the tour bangladesh server", PORT);
})