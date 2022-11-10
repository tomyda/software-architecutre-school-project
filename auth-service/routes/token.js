const express = require("express");
const tokenController = require("./../controllers/token_controller");
const router = new express.Router();

router.post("/generate", tokenController.generate);
router.post("/generate/service", tokenController.generateForService);
router.post("/verify", tokenController.verify);
router.delete("/revoke", tokenController.revoke);

module.exports = router;
