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

const jwtAuth = passport.authenticate('jwt', {session:false});

router.post('/next', jwtAuth, (req, res, next) => {

  User.findById(req.user.id)
    .then(result => {
      console.log('HEAD',result.head, 'Q LIST LEN',result.questions.length-1);
      if (result.head >= (result.questions.length-1)) {
        console.log('head matched');
        if (req.body.userInput) {
          console.log('correct answer...');
          return User.findByIdAndUpdate(req.user.id, {$set:{ head: 0 }, $inc:{ qCorrect: 1, qTotal: 1 }}, { upsert: true }).exec((err, document) => {
            if (err) {console.log('error from mongoose');}
            console.log('res-->a',document.questions[document.head]);
            res.status(201).json(result.questions[result.head]);
          });
        }
        else {
          return User.findByIdAndUpdate(req.user.id, {$inc:{ qTotal: 1 }}, { new: true }).exec((err, document) => {
            if (err) console.log('error from mongoose');
            console.log('res-->b',document.questions[document.head]);
            res.status(201).json(result.questions[result.head]);
          });
        }
      }
      else {
        // if user answers true, continue in the list
        // extended functionality - space out answer by 2 * m
        if (req.body.userInput) {
          return User.findByIdAndUpdate(req.user.id, {$inc:{ head: 1, qCorrect: 1, qTotal: 1 }}, { new: true }).exec((err, document) => {
            if (err) console.log('error from mongoose');
            console.log('res-->c',document.questions[document.head]);
            res.status(201).json(result.questions[result.head]);
          });
        }
        // if user answers false, ask the question again
        else return User.findByIdAndUpdate(req.user.id, {$inc:{ qTotal: 1 }}).exec((err, document) => {
          if (err) console.log('error from mongoose');
          console.log('res-->d',document.questions[document.head]);
          res.status(201).json(result.questions[result.head]);
        });
      }
    })
    .catch(err => {
      next(err);
    });
});

router.get('/first', jwtAuth, (req, res, next) => {
  User.findById(req.user.id)
    .then(result => {
      if (result.head >= (result.questions.length-1)) {
        return User.findByIdAndUpdate(req.user.id, {$set:{ head: 0 }}, { new: true }).exec();
      }
      else {
        // if user answers false, ask the question again
        return User.findById(req.user.id);
      }
    })
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
});

router.get('/history', jwtAuth, (req, res, next) => {
  User.findOne({ _id: req.user.id })
    .then(result => {
      if (result) {
        res.status(200).json({qTotal:result.qTotal, qCorrect:result.qCorrect});
      }
      else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
  // double the increment if userInput is true
  // set to 1 if false
});

module.exports = router;