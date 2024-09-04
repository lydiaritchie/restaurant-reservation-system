const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

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

  if(inputs.status != "booked"){
    return next({ status: 400, message: `Status ${inputs.status} is not allowed`});
  }

  next();
}

//validate date to not be in the past or a Tuesday
async function validateDate(req, res, next) {
  const date = req.body.data.reservation_date;
  const time = req.body.data.reservation_time;
  const dateTimeString = date + "T" + time;
  const dateObj = new Date(dateTimeString);
  const today = new Date().toISOString().split("T")[0];
  if (date < today) {
    return next({ status: 400, message: "Please book in the future" });
  } else if (dateObj.getDay() === 2) {
    return next({ status: 400, message: "Restaurant in closed" });
  }

  next();
}

async function validateTime(req, res, next) {
  const time = req.body.data.reservation_time;
  if (time < "10:30" || time > "21:30") {
    return next({
      status: 400,
      message: "Please book between 10:30 am and 9:30 pm",
    });
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

/**
 * Gets the reservation that matches the reservation id passed in.
 */
async function read(req, res, next) {
  const id = req.params.reservation_id;
  try {
    const reservation = await service.getReservation(id);
    if (!reservation) {
      return next({
        status: 404,
        message: `Reservation with id ${id} not found`,
      });
    }
    res.status(200).json({ data: reservation });
  } catch (error) {
    next({ status: 400, message: `Could not get reservation with id ${id}` });
  }
}

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

async function update(req, res, next) {
  const reservation_id = req.params.reservation_id;
  const { status } = req.body.data;
  console.log("reservation_id:", reservation_id);
  console.log("status:", status);

  const reservation = await service.getReservation(reservation_id);

  if(!reservation){
    return next({status: 404, message: `Resevation ${reservation_id} does not exist`});
  }

  if(reservation.status === "finished"){
    return next({status: 400, message: "Cannot update status of a finished reservation"});
  }

  if (status === "seated" || status === "booked" || status === "finished") {
    try {
      await service.updateStatus(status, reservation_id);
      return res.status(200).json({data: {status: status}});
    } catch (error) {
      console.log(error);
      return next({
        status: 400,
        message: `Could not update status: ${status} on reservation ${reservation_id}`,
      });
    }
  } else {
    next({status: 400, message: `${status} is not a valid status`});
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(validateInputs),
    asyncErrorBoundary(validateDate),
    asyncErrorBoundary(validateTime),
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(read)],
  update: [asyncErrorBoundary(update)],
};
