const P = require("pino");
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

/**
 * setReservation validations
 * table capacity less than number of people in reservation, return 400 & error message
 * if the table is occupied, return 400 & error message
 */

async function validateSetReservation(req, res, next) {
  const reservation_id = req.body.data;
  const table_id = req.params.table_id;

  // Attach the values to the req object
  req.reservation_id = reservation_id;
  req.table_id = table_id;

  //get table
  try{
    const currentTable = await service.read(table_id);
  } catch (error){
    console.log("error:", error);
    throw error;
  }

  //if table is occupied
  if(currentTable.reservation_id != null){
    next({status: 400, message: "This table is already occupied"});
  }

  next();
}

async function setReservation(req, res, next) {
  const reservation_id = req.reservation_id;
  console.log("reservation_id:", reservation_id);
  const table_id = req.table_id;
  console.log(table_id);
  try {
    const updatedTable = await service.setTableReservation(
      table_id,
      reservation_id
    );
    res.status(200).json({ data: updatedTable });
  } catch (error) {
    console.log(error);
    next({ status: 400, message: "Could not update the table" });
  }
}

module.exports = {
  create: [asyncErrorBoundary(create)],
  list: [asyncErrorBoundary(list)],
  setTableReservation: [
    asyncErrorBoundary(validateSetReservation),
    asyncErrorBoundary(setReservation),
  ],
};
