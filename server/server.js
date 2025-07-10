require('dotenv').config()
const express = require('express')
const { db } = require('./models') 
const router = require('./routes')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const port = 8080
const app = express()

app.use(cookieParser())
app.use(express.json())

app.use(cors({
    origin:'http://localhost:5173',
    credentials: true
}))

app.get('/reset', async (req, res) => {
    try {
        db.sync({alter: true});
        res.status(200).json({message: "reset ok"})
    } catch(err) {
        res.status(500).warn("there was an error during reset")
    }
})

app.use('/api', router)

app.get('/*', async (req, res) => {
    res.json("This is the default GET, you might have typed the URL wrong :P")
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})