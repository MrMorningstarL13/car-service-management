const { User } = require('../../models')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

const checkAuth = (req, res) => {

    const token = req.cookies.bearer

    if (!token) {
        return res.status(401).send("No token in request")
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send("Unauthroized request")
        }
        return res.status(200).json({ loggedIn: true, user: user })
    })
}

module.exports = checkAuth