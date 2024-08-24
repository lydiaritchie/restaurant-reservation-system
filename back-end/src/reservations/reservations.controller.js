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
  console.log("inputs:", inputs);

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
  //specific checks for people
  if (typeof inputs["people"] != "number" || isNaN(Number(inputs["people"]))) {
    return next({ status: 400, message: "people isn't a number" });
  }
  if (inputs["people"] === 0) {
    return next({ status: 400, message: "people is 0" });
  }

  //validate date
  const date = new Date(inputs["reservation_date"]);
  if (isNaN(date.getTime())) {
    return next({ status: 400, message: "reservation_date is not a date" });
  }

  //validate time
  regexp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
  if (!regexp.test(inputs["reservation_time"])) {
    return next({ status: 400, message: "reservation_time is not a time" });
  }

  //check missing and empty properties
  for (const property of allProperties) {
    if (!inputs[property]) {
      return next({ status: 400, message: `${property} is missing` });
    }
    if (inputs[property] === undefined || inputs[property] === null) {
      return next({ status: 400, message: `${property} is empty` });
    }
  }

  next();
}

async function create(req, res, next) {
  console.log("creating reservation");
  //console.log(req.body);

  try {
    const createdReservation = await service.createReservation(req.body.data);
    console.log("createdReservation:", createdReservation);
    res.status(201).json({ data: createdReservation });
  } catch (error) {
    console.log("Error creating reservation:", error);
    next(error);
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(validateInputs), asyncErrorBoundary(create)],
};
