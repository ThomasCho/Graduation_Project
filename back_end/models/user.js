const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  email: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  gender: {
    type: String,
    require: true
  },
  birthday: {
    type: Date,
    require: true
  },
  introduction: {
    type: String,
    require: true
  },
  avatar: {
    type: String,
    require: false
  },
  constellation: {
    type: String,
    require: false
  },
  phone: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  hasPost: {
    type: Array,
    require: true
  },
  hasStar: {
    type: Array,
    require: true
  },
  hasJoin: {
    type: Array,
    require: true
  },
  isAdmin: {
    type: Number,
    require: true
  },
  hobby: {
    type: String,
    require: false
  },
  hasFollow: {
    type: Array,
    require: true
  },
  followBy: {
    type: Array,
    require: true
  }
}, {versionKey: false})

module.exports = mongoose.model('User', userSchema)
