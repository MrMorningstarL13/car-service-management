const { DataTypes } = require("sequelize")

module.exports = (db) => {
    const repairModel = db.define('repair', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        isComplete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        freezeTableName: true
    })

    return repairModel;
}