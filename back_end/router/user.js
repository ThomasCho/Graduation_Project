// 对用户数据操作的路由
const express = require('express')
const router = express.Router()
const User = require('../models/user')

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
router.get('/user/:id', (req, res) => {
  User.findById(req.params.id)
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
router.put('/user/:id', (req, res) => {
  User.findOneAndUpdate({_id: req.params.id}
    , {
      $set: {
        name: req.body.name,
        rating: req.body.rating,
        gender: req.body.gender,
        birthday: req.body.birthday,
        description: req.body.description,
        pictureLink: req.body.pictureLink,
        constellation: req.body.constellation
      }
    }, {
      new: true
    })
    .then(user => res.json(user))
    .catch(err => res.json(err))
})

// 删除一个用户
router.delete('/user/:id', (req, res) => {
  User.findOneAndRemove({
    _id: req.params.id
  })
    .then(user => res.send(`${user.title}删除成功`))
    .catch(err => res.json(err))
})

module.exports = router
