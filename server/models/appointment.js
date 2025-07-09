const {DataTypes} = require("sequelize")

module.exports = (db) => {
    const appointmentModel = db.define("appointment", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        scheduledDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        estimatedDuration: {
            type: DataTypes.STRING,
        },
        estimatedCost:{
            type: DataTypes.FLOAT,
        },
        checkIn: {
            type: DataTypes.DATE,
        },
        checkOut: {
            type: DataTypes.DATE,
        },
        status: {
            type: DataTypes.ENUM("waiting", "accepted", "in progress", "cancelled", "finished"),
            allowNull: false,
        },
        priority: {
            type: DataTypes.ENUM("normal", "premium")
        }
    }, {
        freezeTableName: true
    })

    return appointmentModel;
}