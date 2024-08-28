/**
 * Defines the router for table resources.
 * 
 * @type {Router}
 */

const router = require("express").Router();
const notFound = require("../errors/notFound");
const controller = require("./tables.controller");

router.route("/").get(controller.list).post(controller.create).all(notFound);


module.exports = router;
