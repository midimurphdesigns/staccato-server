'use strict';

const express = require('express');
const router = express.Router();

const passport = require('passport');

const jwt = require('jsonwebtoken');
const config = require('../config');

//const baseQuestions = require('../assets/questions.json');

const { JWT_SECRET, JWT_EXPIRY } = config;

const User = require('../models/User');

const list = require('../logic/spacedRep');

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
  
  username = username.trim();
  password = password.trim();

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
    .then(digest => {
      let qList = new list();
      qList.insertFirst({question:"What are the 7 fundamental notes (disregarding sharp / flat)",answer:"cdefgab"});
      qList.insertFirst({question:"What are the 7 fundamental notes (disregarding sharp / flat)",answer:"cdefgab"});
      qList.insertFirst({question:"What are the 7 fundamental notes (disregarding sharp / flat)",answer:"cdefgab"});
      qList.insertFirst({question:"What are the 7 fundamental notes (disregarding sharp / flat)",answer:"cdefgab"});
      qList.insertFirst({question:"What are the 7 fundamental notes (disregarding sharp / flat)",answer:"cdefgab"});
      qList.insertFirst({question:"What are the 7 fundamental notes (disregarding sharp / flat)",answer:"cdefgab"});
      qList.insertFirst({question:"What are the 7 fundamental notes (disregarding sharp / flat)",answer:"cdefgab"});
      qList.insertFirst({question:"What are the 7 fundamental notes (disregarding sharp / flat)",answer:"cdefgab"});
      qList.insertFirst({question:"What are the 7 fundamental notes (disregarding sharp / flat)",answer:"cdefgab"});
      qList.insertFirst({question:"What are the 7 fundamental notes (disregarding sharp / flat)",answer:"cdefgab"});
      return User.create({
        username,
        password: digest,
        firstName,
        lastName,
        qList
      });
    })
    .then(user => res.status(201).json(user))
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

const localAuth = passport.authenticate('local', options);

router.post('/login', localAuth, function (req, res) {
  console.log(req.user);
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true});

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = router;