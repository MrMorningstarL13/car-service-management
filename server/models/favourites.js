const {DataTypes} = require("sequelize")

module.exports = (db) => {
    const favouriteModel = db.define("favourite", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        }
    })

    return favouriteModel
}