const {DataTypes} = require('sequelize')

module.exports = (db) => {
    const requestModel = db.define('request',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        requestType: {
            type: DataTypes.ENUM('delete','create'),
            allowNull: false,
        },
        reason: {
            type: DataTypes.TEXT,
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
        }
    }, {
        freezeTableName: true
    })
}