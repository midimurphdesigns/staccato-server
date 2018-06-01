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
      let node = result.questions.head;
      let answer = req.body.userInput;
      let m = node.value.weight;
      if (answer) {
        m = m*2;
      }
      else {
        m = 1;
      }
      result.questions.head.value.weight = m;
      // if m > len just send to the back
      let i = 0;
      let count = 0;
      while ( (i < m-1)) {
        if (node.next) {
          node = node.next;
          i++;
          count++;
        }
        i++;
      }
      if (!node.next) {
        node.next = result.questions.head;
        node.next.next = null;
      }
      else {
        let temp = node.next;
        node.next = result.questions.head;
        node.next.next = temp;
        let runner = result.questions.head;
        let holder = [];
        eval('result.questions.head'+'.next'.repeat(count).next+ '= node');
        console.log('NEXTS', node);
      }
      console.log('node', node);
      User.findByIdAndUpdate(req.user.id, {$set: {"questions.head":result.questions.head}}, {new: true}).exec();
      return node;
    })
    .then(result => {
      console.log('RESULT', result);
      console.log(req.body);
      if (result) {
        res.status(200).json(result.value);
      }
      else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
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