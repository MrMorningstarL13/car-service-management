const db = require('../config/db')

const Appointment = require('./appointment')(db)
const Car = require('./car')(db)
const Feedback = require('./feedback')(db)
const Invoice = require('./invoice')(db)
const Employee = require('./employee')(db)
const Service = require('./service')(db)
const ServiceType = require('./serviceType')(db)
const User = require('./user')(db)
const Repair = require('./repair')(db)
const AuthUser = require('./authUser')(db)
const Favourite = require('./favourites')(db)

AuthUser.hasOne(User)
User.belongsTo(AuthUser, 
    { foreignKey: 'authUserId' }
)

AuthUser.hasOne(Employee)
Employee.belongsTo(AuthUser,
    { foreignKey: 'authUserId' }
)

User.hasMany(Car)
Car.belongsTo(User)

Car.hasMany(Appointment)
Appointment.belongsTo(Car)

Invoice.hasOne(Appointment)
Appointment.belongsTo(Invoice,
    { foreignKey: { name: 'invoiceId', allowNull: true } }
)

Service.hasMany(Appointment)
Appointment.belongsTo(Service)

Appointment.hasMany(Repair)
Repair.belongsTo(Appointment)

Employee.hasMany(Repair)
Repair.belongsTo(Employee,
    { foreignKey: { name: 'employeeId', allowNull: true } }
)

Service.hasMany(Employee)
Employee.belongsTo(Service)

ServiceType.hasMany(Repair)
Repair.belongsTo(ServiceType)

Service.hasMany(Feedback)
Feedback.belongsTo(Service)

User.belongsToMany(Service, {through: Favourite })
Service.belongsToMany(User, {through: Favourite })

Service.hasMany(ServiceType)
ServiceType.belongsTo(Service)

module.exports = {
    db,
    Appointment,
    Car,
    Employee,
    Feedback,
    Invoice,
    Service,
    ServiceType,
    Favourite,
    User,
    Repair,
    AuthUser,
}