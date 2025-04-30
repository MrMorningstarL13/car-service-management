const express = require('express')
require('dotenv').config()
const { db } = require('./models') 
const router = require('./routes')

const port = 8080
const app = express()

app.use(express.json())

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

app.get('/reset', async (req, res) => {
    try {
        db.sync({force: true});
        res.status(200).json({message: "reset ok"})
    } catch(err) {
        res.status(500).warn("there was an error during reset")
    }
})

app.use('/api', router)

app.get('/', async (req, res) => {
    res.json("Hello")
})