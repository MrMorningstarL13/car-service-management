const {DataTypes} = require('sequelize')

module.exports = (db) => {
    const servicePartModel = db.define('service_part', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true
    })

    return servicePartModel;
}