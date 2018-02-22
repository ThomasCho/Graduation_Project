// 对用户数据操作的路由
const express = require('express')
const router = express.Router()
const User = require('../models/user')

// 获取当前登录用户的信息
router.get(/user\/info/, (req, res) => {
  res.json(req.api_user)
})

// 查询所有用户
router.get('/user', (req, res) => {
  User.find({})
    .then(users => {
      res.json(users)
    })
    .catch(err => {
      res.json(err)
    })
})

// 通过ObjectId查询单个用户
router.get('/user/:email', (req, res) => {
  User.find({
    email: req.params.email
  })
    .then(user => {
      res.json(user)
    })
    .catch(err => {
      res.json(err)
    })
})

// 添加一个用户
router.post('/user', (req, res) => {
  // 使用User model上的create方法储存数据
  User.create(req.body, (err, user) => {
    if (err) {
      res.json(err)
    } else {
      res.json(user)
    }
  })
})

// 更新一个用户
router.put('/user/:email', (req, res) => {
  User.findOneAndUpdate({email: req.params.email}
    , {
      $set: {
        avatar: req.body.avatar,
        name: req.body.name,
        introduction: req.body.introduction,
        constellation: req.body.constellation,
        gender: req.body.gender,
        birthday: req.body.birthday
      }
    }, {
      new: true
    })
    .then(user => res.json(user))
    .catch(err => res.json(err))
})

// 删除一个用户
router.delete('/user/:email', (req, res) => {
  User.findOneAndRemove({
    email: req.params.email
  })
    .then(user => res.send(`${user.title}删除成功`))
    .catch(err => res.json(err))
})

module.exports = router
