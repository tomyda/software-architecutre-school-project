const express = require('express')
const reservationController = require('./../controllers/reservation_controller')
const router = new express.Router()

router.post('/register', reservationController.sendReservation)

module.exports = router
