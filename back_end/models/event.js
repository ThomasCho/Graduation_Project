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
  isCharged: {
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
  },
  star: {
    type: String,
    require: true
  },
  view: {
    type: String,
    require: true
  },
  owner: {
    type: String,
    require: true
  },
  comment: {
    type: Array,
    require: true
  },
  auth: {
    type: Number,
    require: true
  }
}, {versionKey: false})

module.exports = mongoose.model('Event', eventSchema)
