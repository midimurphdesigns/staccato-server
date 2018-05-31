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
  //console.log('USER',req.user);

  // point the questions.next to head, set this last on to cycle from back to front
  // User.updateOne({_id: req.user.id}, {"questions.next" : null}, {$set: { "questions.$.next": {$inc: { head: 1 }}}}).exec()
  console.log('Qs',req.user.questions.length, 'head', req.user.head);
  User.findById(req.user.id)
    .then(result => {
      if (result.head >= (result.questions.length-1)) {
        if (req.body.userInput) {
          return User.findByIdAndUpdate(req.user.id, {$set:{ head: 0 }}, {$inc:{ qCorrect: 1, qTotal: 1 }}, { new: true }).exec();
        }
      }
      else {
        // if user answers true, continue in the list
        // extended functionality - space out answer by 2 * m
        if (req.body.userInput) {
          return User.findByIdAndUpdate(req.user.id, {$inc:{ head: 1, qCorrect: 1, qTotal: 1 }}, { new: true }).exec();
        }
        // if user answers false, ask the question again
        else return User.findByIdAndUpdate(req.user.id, {$inc:{ qTotal: 1 }});
      }
    })
    .then(result => {
      console.log('RESULT', result);
      console.log(req.body);
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
  // if (req.user.head >= (req.user.questions.length-1)) {
  //   console.log('got here');
  //   User.findByIdAndUpdate(req.user.id, {$set:{ head: 0 }}, { new: true }).exec()
  //     .then(result => {
  //       console.log('RESULT', result);
  //       if (result) {
  //         res.status(200).json(result.questions[result.head]);
  //       }
  //       else {
  //         next();
  //       }
  //     })
  //     .catch(err => {
  //       next(err);
  //     });
  // }
  // else {
  //   console.log('ELSE');
  //   User.findByIdAndUpdate(req.user.id, {$inc:{ head: 1 }}, { new: true }).exec()
  //     .then(result => {
  //       console.log('RESULT', result);
  //       if (result) {
  //         res.status(200).json(result.questions[result.head]);
  //       }
  //       else {
  //         next();
  //       }
  //     })
  //     .catch(err => {
  //       next(err);
  //     });
  // }
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
  // double the increment if userInput is true
  // set to 1 if false
});

module.exports = router;