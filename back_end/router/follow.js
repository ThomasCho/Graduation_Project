// 对用户数据操作的路由
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bodyParser = require('body-parser')
router.use(bodyParser.json())

// 关注
router.put('/followSB', (req, res) => {
  User.find({email: req.body.from})
    .then(from => {
      from[0].hasFollow.push(req.body.to)
      from[0].save(err => {
        if (err) {
          res.json({
            success: false,
            message: err
          })
        } else {
          User.find({email: req.body.to})
            .then(to => {
              to[0].followBy.push(req.body.from)
              to[0].save(err => {
                if (err) {
                  res.json({
                    success: false,
                    message: err
                  })
                } else {
                  res.json({
                    success: true,
                    message: '已关注'
                  })
                }
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
    })
    .catch(err => {
      res.json({
        success: false,
        message: err
      })
    })
})

// 取消关注
router.put('/unfollowSB', (req, res) => {
  User.find({email: req.body.from})
    .then(from => {
      from[0].hasFollow.splice(from[0].hasFollow.indexOf(req.body.to), 1)
      from[0].save(err => {
        if (err) {
          res.json({
            success: false,
            message: err
          })
        } else {
          User.find({email: req.body.to})
            .then(to => {
              to[0].followBy.splice(to[0].followBy.indexOf(req.body.from), 1)
              to[0].save(err => {
                if (err) {
                  res.json({
                    success: false,
                    message: err
                  })
                } else {
                  res.json({
                    success: true,
                    message: '已取消关注'
                  })
                }
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
    })
    .catch(err => {
      res.json({
        success: false,
        message: err
      })
    })
})

// 获取被关注的人
router.get('/getFollower', (req, res) => {
  User.find({
    email: req.query.user
  })
    .then(users => {
      User.find({
        'email': {'$in': users[0].followBy}
      })
        .then(results => {
          res.json({
            success: true,
            message: results
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

// 获取关注的人
router.get('/getFollowing', (req, res) => {
  User.find({
    email: req.query.user
  })
    .then(users => {
      User.find({
        'email': {'$in': users[0].hasFollow}
      })
        .then(results => {
          res.json({
            success: true,
            message: results
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
