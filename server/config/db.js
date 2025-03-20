const {Sequelize} = require('sequelize')

const db = new Sequelize('car-service-management', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true,
    }
})

module.exports = db;