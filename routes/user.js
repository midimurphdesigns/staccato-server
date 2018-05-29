'use strict';
const express = require('express');
const router = express.Router();
const List = require('../logic/sLinkedList');

const passport = require('passport');

const User = require('../models/User');

router.get('/', (req, res, err) => {
  User.find()
    .then(result => {
      res.json(result);
    })
    .catch(err => console.log(err));
});

router.get('/:id', (req, res, next) => {
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

const jwtAuth = passport.authenticate('jwt', {session:false});

router.get('/next/:id', (req, res, next) => {
  console.log('USER',req.user);

  User.findById(req.params.id)
    .then(result => {
      if (result) {
        res.status(200).json(result.questions[result.head]);
      }
      else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
  User.findByIdAndUpdate(req.params.id, {$inc: {'head':1}}, {upsert:true});
});

module.exports = router;