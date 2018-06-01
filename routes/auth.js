'use strict';

const express = require('express');
const router = express.Router();

const passport = require('passport');

const jwt = require('jsonwebtoken');
const config = require('../config');

const singly = require('../logic/sLinkedList');

//const baseQuestions = require('../assets/questions.json');

const { JWT_SECRET, JWT_EXPIRY } = config;

const User = require('../models/User');
const Question = require('../models/Question');

function createAuthToken (user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

const options = {session: false, failWithError: true};

router.post('/users', (req, res) => {

  // global list, move into specific user
  let {username, password, firstName, lastName} = req.body;
  console.log('BODY',req.body);
  username = username.trim();
  password = password.trim();

  console.log('got here');

  return User.find({username})
    .count()
    .then(count => {
      // There is an existing user with the same username
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      console.log(hash);
      return Question.find().then(questions => {
        let qList = new singly();
        questions.forEach(q => qList.insertLast(q));
        console.log(qList);
        return qList;
      })
        .then((qList) => {
          return new User({
            username,
            password: hash,
            firstName,
            lastName,
            questions:qList
          });
        });
    })
    .then(user => {
      return res.status(201).json(user);
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

const localAuth = passport.authenticate('local', options);

router.post('/login', localAuth, function (req, res) {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true});

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = router;