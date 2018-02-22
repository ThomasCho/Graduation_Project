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
  }
})

module.exports = mongoose.model('User', userSchema)
