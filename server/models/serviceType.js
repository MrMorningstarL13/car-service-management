const {DataTypes} = require('sequelize')

module.exports = (db) => {
    const serviceTypeModel = db.define('service_type', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        baseCost: {
            type: DataTypes.FLOAT,
            allowNull: false,
        }
    },{
        freezeTableName: true
    })

    return serviceTypeModel
}