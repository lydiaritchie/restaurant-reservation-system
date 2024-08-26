const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const date = req.query.date;
  const allReservations = await service.listReservations(date);
  res.json({
    data: allReservations,
  });
}

async function validateInputs(req, res, next) {
  const inputs = req.body.data;

  const allProperties = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];

  if (!inputs) {
    return next({ status: 400, message: "No inputs sent." });
  }

  //check missing and empty properties
  for (const property of allProperties) {
    if (
      inputs[property] === undefined ||
      inputs[property] === "" ||
      inputs[property] === null
    ) {
      return next({ status: 400, message: `${property} is missing` });
    }
  }

  //check if people is a number
  if (!Number.isInteger(inputs.people) || inputs.people < 1) {
    return next({ status: 400, message: "people is not a number" });
  }

  //validate date
  const date = new Date(inputs.reservation_date);
  if (isNaN(date.getTime())) {
    return next({ status: 400, message: "reservation_date is not a date" });
  }

  //validate time
  const regexp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
  if (!regexp.test(inputs.reservation_time)) {
    return next({ status: 400, message: "reservation_time is not a time" });
  }

  next();
}

//validate date to not be in the past or a Tuesday
async function validateDate(req, res, next){
  const date = req.body.data.reservation_date;
  const dateObj = new Date(date);
  const today = new Date().toISOString().split('T')[0];
  if (date < today){
    return next({status: 400, message: "Please book in the future"});
  }
  else if(dateObj.getDay() === 2){
    return next({status:400, message: "Restaurant in closed"})
  }
  
  next();
}

async function create(req, res, next) {
  try {
    const createdReservation = await service.createReservation(req.body.data);
    res.status(201).json({ data: createdReservation });
  } catch (error) {
    next({ status: 400, message: "Could not create reservation" });
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(validateInputs),
    asyncErrorBoundary(validateDate),
    asyncErrorBoundary(create),
  ],
};
