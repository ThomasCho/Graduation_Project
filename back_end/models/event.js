const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  startDate: {
    type: Date,
    require: true
  },
  startTime: {
    type: Date,
    require: true
  },
  endDate: {
    type: Date,
    require: true
  },
  endTime: {
    type: Date,
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
  }
}, {versionKey: false})

module.exports = mongoose.model('Event', eventSchema)
