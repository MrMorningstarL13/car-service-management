const {DataTypes} = require("sequelize")

module.exports = (db) => {
    const authUserModel = db.define("auth_user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        email: {
            type:DataTypes.TEXT,
            allowNull: false,
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },{
        freezeTableName: true
    })

    return authUserModel;
}