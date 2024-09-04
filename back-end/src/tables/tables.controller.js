const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");

async function validatePostInputs(req, res, next) {
  const data = req.body.data;

  if (data === undefined || data === null) {
    return next({ status: 400, message: "Data is missing" });
  }

  const table_name = data.table_name;

  if (table_name === undefined || table_name === null) {
    return next({ status: 400, message: "table_name is missing" });
  }

  if (table_name === "") {
    return next({ status: 400, message: "table_name is empty" });
  }

  if (table_name.length === 1) {
    return next({
      status: 400,
      message: "table_name must be at least 2 characters",
    });
  }
  const capacity = data.capacity;

  if (capacity === undefined || capacity === null) {
    return next({ status: 400, message: "capacity is missing" });
  }

  if (capacity === "") {
    return next({ status: 400, message: "capacity is empty" });
  }

  if (!Number.isInteger(capacity)) {
    return next({ status: 400, message: "capacity is not a number" });
  }

  if (capacity === 0) {
    return next({ status: 400, message: "capacity cannot be 0" });
  }

  next();
}

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
    res.status(200).json({ data: tables });
  } catch (error) {
    next({ status: 400, message: "Could not list tables" });
  }
}

/**
 * setReservation validations
 * table capacity less than number of people in reservation, return 400 & error message
 * if the table is occupied, return 400 & error message
 */

async function validateSeatReservation(req, res, next) {
  const data = req.body.data;

  if (data === undefined || data === null) {
    return next({ status: 400, message: "Data is missing" });
  }

  const {reservation_id}  = data;
  const table_id = req.params.table_id;

  //check if values exsist
  if (reservation_id === undefined || reservation_id === null) {
    return next({ status: 400, message: "Reservation_id is missing" });
  }

  if (table_id === undefined || table_id === null) {
    return next({ status: 400, message: "Table_id is missing" });
  }

  // Attach the values to the req object
  res.locals.reservation_id = reservation_id;
  res.locals.table_id = table_id;

  let currentReservation;
  let currentTable;

  //get table and reservation
  try {
    currentReservation = await reservationService.getReservation(
      reservation_id
    );
    currentTable = await service.read(table_id);
  } catch (error) {
    console.log("error:", error);
    throw error;
  }

  //check if currentReservation exists
  if (currentReservation === undefined) {
    return next({
      status: 404,
      message: `reservation ${reservation_id} does not exist`,
    });
  }

  //if table capacity is less than currentReservation.people
  if (currentTable.capacity < currentReservation.people) {
    return next({
      status: 400,
      message: "table doesn't have the capacity",
    });
  }

  //if table is occupied
  if (currentTable.reservation_id != null) {
    return next({ status: 400, message: "This table is already occupied" });
  }

  if(currentReservation.status === "seated"){
    return next({status: 400, message: "Reservation already seated"});
  }


  next();
}

async function seatReservation(req, res, next) {
  const reservation_id = res.locals.reservation_id;
  const table_id = res.locals.table_id;

  try {
    const updatedTable = await service.setTableReservation(
      table_id,
      reservation_id
    );
    await reservationService.updateStatus("seated", reservation_id);
    res.status(200).json({ data: updatedTable });
  } catch (error) {
    console.log(error);
    next({ status: 400, message: "Could not update the table" });
  }
}

async function deleteTableReservation(req, res, next){
  const table_id = req.params.table_id;
  let table;

  try{
    const fetchedTable = await service.read(table_id);
    const allTables = await service.listTables();
    table = fetchedTable;
  } catch (error) {
    console.log(error);
  }

  console.log("table:", table);

  if(!table) {
    return next({ status: 404, message: `table ${table_id} does not exist`});
  }

  if(table.reservation_id === null){
    return next({status: 400, message: `table ${table_id} is not occupied`});
  }

  const reservation_id = table.reservation_id;

  try{
    await service.deleteTableReservation(table_id);
    await reservationService.updateStatus("finished", reservation_id);
    res.status(200).json({data: `Deleted seating from table ${table_id}`});
  } catch (error) {
    console.log(error);
    next({ status: 400, message: `Could not delete reservation on table ${table_id}`});
  }
}

module.exports = {
  create: [asyncErrorBoundary(validatePostInputs), asyncErrorBoundary(create)],
  list: [asyncErrorBoundary(list)],
  seatTableReservation: [
    asyncErrorBoundary(validateSeatReservation),
    asyncErrorBoundary(seatReservation),
  ],
  destroy: [asyncErrorBoundary(deleteTableReservation)],
};
