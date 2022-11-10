const express = require("express");
const queryController = require("../controllers/query_controller");
const router = new express.Router();

router.get("/query1", queryController.getQuery1);
router.get("/query2", queryController.getQuery2);
router.get("/query3", queryController.getQuery3);

module.exports = router;
