const express = require("express");
const router = express.Router();
const { listQuestions } = require("../controllers/questionController");

router.get("/", listQuestions);

module.exports = router;