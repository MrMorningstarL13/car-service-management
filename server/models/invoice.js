const {DataTypes} = require("sequelize")

module.exports = (db) => {
    const invoiceModel = db.define("invoice", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        finalCost: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        paymentMethod: {
            type: DataTypes.ENUM("cash", "card"),
            allowNull: false,
        },
        paymentDate: {
            type: DataTypes.DATE
        }
    }, {
        freezeTableName: true
    })

    return invoiceModel
}