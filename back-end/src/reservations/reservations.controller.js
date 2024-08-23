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

async function validateInputs(req, res, next){
  const inputs = req.body;
  if(!inputs){
    return next(({status: 400, message: "No inputs sent."}));

  }
  if(!inputs.first_name){
    return res.status(400);
  }
  next();
}

async function create(req, res, next){
  console.log("creating reservation");
  console.log(req.body);
  try{
    const createdReservation = await service.createReservation(req.body);
    res.status(201).json({data: createdReservation});
  } catch (error) {
    console.log("Error creating reservation:", error);
    next(error);
  }
  
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(validateInputs), asyncErrorBoundary(create)],
};
