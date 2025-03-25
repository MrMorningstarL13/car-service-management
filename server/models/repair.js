const { DataTypes } = require("sequelize")

module.exports = (db) => {
    const repairModel = db.define('repair', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    }, {
        freezeTableName: true
    })

    return repairModel;
}