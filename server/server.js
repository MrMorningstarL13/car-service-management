const express = require('express')
require('dotenv').config()
const { db } = require('./models') 

const port = process.env.PORT
const app = express()

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