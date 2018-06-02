'use strict';
const express = require('express');
const router = express.Router();
const {LinkedList, size} = require('../logic/sLinkedList');

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
      //copy user's questions into a linked list
      let newList = new LinkedList();
      let node = result.questions.head;
      let increment = 0;
      // fill the linked list
      while (node) {
        newList.insertLast(node.value);
        node = node.next;
      }
      let m = newList.head.value.weight;
      if (req.body.userInput === true) {
        m = m*2;
        newList.head.value.weight = m;
        increment = 1;
        if (m > size(newList)) {
          newList.swapHeadWithTail();
        }
        else {
          newList.insertAt(m, newList.head.value);
          newList.head = newList.head.next;
        }
      }
      else {
        newList.head.value.weight = 1;
        newList.insertAt(2, newList.head.value);
        newList.head = newList.head.next;
      }
      User.findByIdAndUpdate(req.user.id, {$set: {"questions":newList}, $inc: {qTotal:1, qCorrect:increment}}, {new: true}).exec();
      return newList.head.value;
    })
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

router.get('/first', jwtAuth, (req, res, next) => {
  User.findById(req.user.id)
    .then(result => {
      res.status(200).json(result.questions.head.value);
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
});

module.exports = router;