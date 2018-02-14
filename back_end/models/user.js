const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
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
  description: {
    type: String,
    require: true
  },
  pictureLink: {
    type: String,
    require: false
  },
  constellation: {
    type: String,
    require: false
  }
})

module.exports = mongoose.model('User', userSchema)
