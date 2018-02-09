'use strict';

const mongoose = require('mongoose');

const Pet = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'user',
  },
});


module.exports = mongoose.model('pet',Pet);