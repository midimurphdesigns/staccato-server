'use strict';
const express = require('express');
const router = express.Router();
const List = require('../logic/sLinkedList');

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

router.get('/:id/next', (req, res, next) => {
  const { id } = req.params;
  User.findOne({ _id: id })
    .then(result => {
      result.qList.insertAt(result.qList.head.n, result.qList.head)
      // result.qList.head = result.qList.head.next;
      let currNode = result.qList.next.value;
      if (result) {
        res.status(200).json(currNode);
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