const {DataTypes} = require("sequelize")

module.exports = (db) => {
    const serviceModel = db.define("service", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lat: {
            type: DataTypes.STRING,
        },
        lng: {
            type: DataTypes.STRING,
        },
    }, {
        freeezeTableName: true,
    })

    return serviceModel
}