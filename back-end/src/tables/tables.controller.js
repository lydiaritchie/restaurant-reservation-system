const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

async function create(req, res, next) {
  try {
    const createdTable = await service.createTable(req.body.data);
    res.status(201).json({ data: createdTable });
  } catch (error) {
    next({ status: 400, message: "Could not create table" });
  }
}

async function list(req, res, next) {
  try {
    const tables = await service.listTables();
    res.status(201).json({ data: tables });
  } catch (error) {
    next({ status: 400, message: "Could not list tables" });
  }
}

async function setReservation(req, res, next) {
    const reservation_id = req.body.data;
    console.log("reservation_id:", reservation_id);
    const table_id = req.params.table_id;
    console.log(table_id);
  try {
    const updatedTable = await service.setTableReservation(table_id, reservation_id);
    res.status(200).json({ data: 7 });
  } catch (error) {
    console.log(error);
    next({status: 400, message: "Could not update the table"});
  }
}

module.exports = {
  create: [asyncErrorBoundary(create)],
  list: [asyncErrorBoundary(list)],
  setTableReservation: [asyncErrorBoundary(setReservation)],
};
