const {DataTypes} = require('sequelize')

module.exports = (db) => {
    const employeeModel = db.define('employee', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        hireDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        experienceLevel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        salary: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        isRep: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },{
        freezeTableName: true
    })

    return employeeModel;
}