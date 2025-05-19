const db = require('../config/db')

const Appointment = require('./appointment')(db)
const Car = require('./car')(db)
const Feedback = require('./feedback')(db)
const Invoice = require('./invoice')(db)
const Part = require('./part')(db)
const Employee = require('./employee')(db)
const Request = require('./request')(db)
const Service = require('./service')(db)
const ServicePart = require('./servicePart')(db)
const ServiceType = require('./serviceType')(db)
const Supplier = require('./supplier')(db)
const User = require('./user')(db)
const Repair = require('./repair')(db)

User.hasMany(Car)
Car.belongsTo(User)

Car.hasMany(Appointment)
Appointment.belongsTo(Car)

Invoice.hasOne(Appointment)
Appointment.belongsTo(Invoice,
    {foreignKey: { name: 'invoiceId', allowNull: true },}
)

Service.hasMany(Appointment)
Appointment.belongsTo(Service)

Repair.belongsTo(Appointment)
Appointment.hasMany(Repair)

Repair.belongsTo(Employee)
Employee.hasMany(Repair)

Repair.belongsTo(ServiceType)
ServiceType.hasMany(Repair)

Repair.hasMany(Feedback)
Feedback.belongsTo(Repair)

Employee.hasMany(Request)
Request.belongsTo(Employee)

Repair.hasMany(Part)
Part.belongsTo(Repair)

Part.belongsToMany(Supplier, {through: "part_supplier_junc" })
Supplier.belongsToMany(Part, {through: "part_supplier_junc" })

User.belongsToMany(Service, {through: 'Favourite' })
Service.belongsToMany(User, {through: 'Favourite' })

Service.belongsToMany(ServiceType, {through: "available_service_type"})
ServiceType.belongsToMany(Service, {through: "available_service_type" })

module.exports = {
    db,
    Car,
    Employee,
    Feedback,
    Invoice,
    Part,
    Request,
    Service,
    ServicePart,
    ServiceType,
    Supplier,
    User,
    Repair,
}