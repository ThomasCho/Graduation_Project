const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    require: true
  },
  time: {
    type: Array,
    require: true
  },
  isFree: {
    type: Boolean,
    require: true
  },
  money: {
    type: String,
    require: false
  },
  type: {
    type: Array,
    require: true
  },
  resource: {
    type: String,
    require: true
  },
  desc: {
    type: String,
    require: true
  },
  remark: {
    type: String,
    require: false
  },
  detail: {
    type: String,
    require: false
  },
  region: {
    type: Array,
    require: true
  },
  poster: {
    type: String,
    require: false
  },
  participant: {
    type: Array,
    require: true
  }
}, {versionKey: false})

module.exports = mongoose.model('Event', eventSchema)
