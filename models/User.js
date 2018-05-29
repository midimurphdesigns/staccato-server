'use strict';

const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const list = require('../logic/sLinkedList');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, requred: true },
  firstName: { type: String },
  lastName: { type: String },
  qList: { type: String },
  qObj: {
    head: { type: Object, default: null },
    next: { type: Object, default: null },
    answered: { type: Boolean },
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 }
  },
});

userSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);

const userSchema = new mongoose.Schema({
  fullName: { type: String },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // data(ques itself) - img & ans && next pointer
  userQuestionList: { type: Object, default: questions },
  questionsObj: {
    questionHead: { type: Object, default: null },
    questionNext: { type: Object, default: null },
    answered: { type: Boolean },
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 }
  }
});