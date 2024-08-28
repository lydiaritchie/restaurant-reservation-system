const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

async function create(req, res, next){
    try{
        const createdTable = await service.createTable(req.body.data);
        res.status(201).json({data: createdTable});
    } catch (error) {
        next({status: 400, message: "Could not create table"});
    }
}

async function list(req, res, next){
    try{
        const tables = await service.listTables();
        res.status(201).json({data: tables});
    } catch (error) {
        next({status: 400, message: "Could not list tables"});
    }
}

module.exports = {
    create: [asyncErrorBoundary(create)],
    list: [asyncErrorBoundary(list)],
}
