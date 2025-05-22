const {DataTypes} = require('sequelize')

module.exports = (db) => {
    const userModel = db.define("user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        phone: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        
    },{
        freezeTableName: true
    })

    return userModel
}