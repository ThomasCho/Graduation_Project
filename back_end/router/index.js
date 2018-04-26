const express = require('express')
const router = express.Router()
const Event = require('../models/event')
const User = require('../models/user')
const bodyParser = require('body-parser')
router.use(bodyParser.json())

router.get('/', (req, res) => {
  res.send('Hello Express!')
})

// 获取数据分析页面所需数据，就是所有用户和活动的数据
router.get('/api/dataAnalysis', (req, res) => {
  Event.find({})
    .then(events => {
      events = events.filter(val => {
        return val.auth === 1
      })

      User.find({})
        .then(users => {
          res.json({
            success: true,
            message: {
              events,
              users
            }
          })
        })
        .catch(err => {
          res.json({
            success: false,
            message: err
          })
        })
    })
    .catch(err => {
      res.json({
        success: false,
        message: err
      })
    })
})

module.exports = router
