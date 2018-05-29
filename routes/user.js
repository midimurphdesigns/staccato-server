'use strict';
const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.get('/users/:id', (req, res, next) => {
  const { id } = req.params;

  User.findOne({ _id: id })
    .then(result => {
      if (result) {
        res.status(200).json(result);
      }
      else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

