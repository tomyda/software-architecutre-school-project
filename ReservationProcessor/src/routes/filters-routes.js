const express = require('express')
const filtersController = require('../controllers/filters-controller')
const router = new express.Router()

router.get('/filters', filtersController.getFilters)

module.exports = router
