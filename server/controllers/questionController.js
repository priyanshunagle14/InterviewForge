const { getAllQuestions } = require("../models/questions");

function listQuestions(req, res) {
  res.json(getAllQuestions());
}

module.exports = { listQuestions };