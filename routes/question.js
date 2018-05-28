'use strict';
const express = require('express');
const router = express.Router();

const Question = require('../models/Question');

router.get('/questions', (req, res, err) => {
  Question.find()
    .then(result => {
      res.json(result);
    });
});

module.exports = router;