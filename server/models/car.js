const {DataTypes} = require('sequelize')

module.exports = (db) => {
    const carModel = db.define("car", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        brand: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        model: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        yearOfProduction: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        engineType: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        kilometrage: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isInsured: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        plateNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        freezeTableName: true
    })

    return carModel;
}