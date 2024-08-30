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

async function setTableReservation(req, res, next) {
    console.log("setTableReservation");
    const reservation_id = req.body;
    console.log(reservation_id);
    const table_id = req.params.table_id;
    console.log(table_id);
  try {
    await setTableReservation(table_id, reservation_id);
    res.status(200).json({ data: "Set" });
  } catch (error) {
    console.log(error);
    next({status: 400, message: "Could not update table"});
  }
}

module.exports = {
  create: [asyncErrorBoundary(create)],
  list: [asyncErrorBoundary(list)],
  setTableReservation: [asyncErrorBoundary(setTableReservation)],
};
