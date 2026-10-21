// COMP 3123 Assignment 1
// Zelda Pelletier
const Employee = require("../models/Employee");
const fields = ["first_name", "last_name", "email", "position", "salary", "date_of_joining", "department"];
async function findOwnedEmployee(eid, userId, res)
{
    const employee = await Employee.findById(eid);
    if (!employee)
    {
        res.status(404).json({status: false, message: "Employee not found"});
        return null;
    }
    if (employee.user.toString() !== userId.toString())
    {
        res.status(403).json({status: false, message: "You do not have access to this employee"});
        return null;
    }
    return employee;
}
async function getEmployees(req, res, next)
{
    try
    {
        const employees = await Employee.find({user: req.user.id});
        res.status(200).json(employees);
    }
    catch (error)
    {
        next(error);
    }
}
async function createEmployee(req, res, next)
{
    try
    {
        const data = {};
        fields.forEach((field) => {data[field] = req.body[field];});
        data.user = req.user.id;
        const employee = await Employee.create(data);
        res.status(201).json(employee);
    }
    catch (error)
    {
        next(error);
    }
}
async function getEmployee(req, res, next)
{
    try
    {
        const employee = await findOwnedEmployee(req.params.eid, req.user.id, res);
        if (!employee)
        {
            return;
        }
        res.status(200).json(employee);
    }
    catch (error)
    {
        next(error);
    }
}
async function updateEmployee(req, res, next)
{
    try
    {
        const employee = await findOwnedEmployee(req.params.eid, req.user.id, res);
        if (!employee)
        {
            return;
        }
        fields.forEach((field) =>
        {
            if (req.body[field] !== undefined)
            {
                employee[field] = req.body[field];
            }
        });
        await employee.save();
        res.status(200).json(employee);
    }
    catch (error)
    {
        next(error);
    }
}
async function deleteEmployee(req, res, next)
{
    try
    {
        const employee = await findOwnedEmployee(req.query.eid, req.user.id, res);
        if (!employee)
        {
            return;
        }
        await employee.deleteOne();
        res.status(204).send();
    }
    catch (error)
    {
        next(error);
    }
}
module.exports = {getEmployees, createEmployee, getEmployee, updateEmployee, deleteEmployee};