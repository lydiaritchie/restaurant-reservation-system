/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const notFound = require("../errors/notFound");
const controller = require("./reservations.controller");

router.route("/:reservation_id/status").put(controller.update).all(notFound);

router.route("/:reservation_id/seat").get(controller.read).all(notFound);

router.route("/:reservation_id").get(controller.read).put(controller.updateReservation).all(notFound);

router.route("/").get(controller.list).post(controller.create).all(notFound);
module.exports = router;
