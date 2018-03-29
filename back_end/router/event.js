// 对活动相关操作的路由
const express = require('express')
const Event = require('../models/event')
const bodyParser = require('body-parser')
const router = express.Router()
router.use(bodyParser.json())

// 发布活动
router.post('/publishEvent', (req, res) => {
  console.log(req.body)
  let newEvent = JSON.parse(JSON.stringify(req.body))
  newEvent.participant = []
  Event.create(newEvent, (err, event) => {
    if (err) {
      res.json({
        success: false,
        message: err
      })
    } else {
      res.json({
        success: true,
        message: event
      })
    }
  })
})

// 获取活动
router.get('/loadEvent', (req, res) => {
  Event.find({})
    .then(events => {
      res.json({
        success: true,
        message: events
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
