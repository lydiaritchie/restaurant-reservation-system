const service = require("./reservations.service");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.json({
    data: [],
  });
}

async function create(req, res, next){
  console.log("creating reservation");
  console.log(req.body);
  try{
    const createdReservation = await service.createReservation(req.body);
    res.status(201).json({data: createdReservation});
  } catch (error) {
    console.log("Error creating resrvation:", error);
    next(error);
  }
  
}

module.exports = {
  list,
  create,
};
