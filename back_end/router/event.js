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
  newEvent.star = '0'
  newEvent.view = '0'
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
  if (req.query.type) {
    let queryType = req.query.type
    if (queryType === 'learning') {
      queryType = '学习'
    } else if (queryType === 'eating') {
      queryType = '吃喝'
    } else if (queryType === 'playing') {
      queryType = '玩耍'
    } else if (queryType === 'hiking') {
      queryType = '旅行'
    }
    // 类型包含这个关键字，或名字匹配到这个关键字
    Event.find({'$or': [{'type': queryType}, {'name': queryType}]})
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
  } else {
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
  }
})

// 加入活动
router.post('/joinEvent', (req, res) => {
  let params = JSON.parse(JSON.stringify(req.body))
  Event.find({
    name: params.eventName
  })
    .then(events => {
      let hasJoined = false
      events[0].participant.forEach((e) => {
        if (e.email === params.userInfo.email) {
          hasJoined = true
        }
      })
      if (!hasJoined) {
        events[0].participant.push(params.userInfo)
        events[0].save(err => {
          if (err) {
            res.json({
              success: false,
              message: err
            })
          }
          res.json({
            success: true,
            message: '参加成功'
          })
        })
      } else {
        res.json({
          success: false,
          message: '你已参加，请勿重复点击'
        })
      }
    })
    .catch(err => {
      res.json({
        success: false,
        message: err
      })
    })
})

// 更新该活动的被收藏数
router.put('/starEvent', (req, res) => {
  Event.find({
    name: req.body.eventName
  })
    .then(events => {
      events[0].star++
      events[0].save(err => {
        if (err) {
          res.json({
            success: false,
            message: err
          })
        }
        res.json({
          success: true,
          message: '已收藏'
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

// 更新该活动的被浏览数
router.put('/incView', (req, res) => {
  Event.find({
    name: req.body.eventName
  })
    .then(events => {
      events[0].view++
      events[0].save(err => {
        if (err) {
          res.json({
            success: false,
            message: err
          })
        }
        res.json({
          success: true,
          message: ''
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
