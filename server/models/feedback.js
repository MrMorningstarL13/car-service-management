const {DataTypes} = require("sequelize")

module.exports = (db) => {
    const feedbackModel = db.define("feedback", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        freeezeTableName: true,
    })

    return feedbackModel
}