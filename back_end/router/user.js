// 对用户数据操作的路由
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bodyParser = require('body-parser')
router.use(bodyParser.json())

// 获取当前登录用户的信息
router.get(/user\/info/, (req, res) => {
  res.json({
    success: true,
    message: req.api_user
  })
})

// 查询所有用户
router.get('/user', (req, res) => {
  User.find({})
    .then(users => {
      res.json({
        success: true,
        message: users
      })
    })
    .catch(err => {
      res.json({
        success: false,
        message: err
      })
    })
})

// 通过ObjectId查询单个用户
router.get('/user/:email', (req, res) => {
  User.find({
    email: req.params.email
  })
    .then(user => {
      if (!user.length) {
        res.json({
          success: false,
          message: '无此用户'
        })
      } else {
        res.json({
          success: true,
          message: user[0]
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

// 添加一个用户
router.post('/user/register', (req, res) => {
  // 使用User model上的create方法储存数据
  let newUser = JSON.parse(JSON.stringify(req.body))
  newUser.name = newUser.gender = newUser.birthday = newUser.introduction = newUser.avatar = newUser.constellation = ''
  newUser.hasPost = newUser.hasStar = newUser.hasJoin = []
  newUser.isAdmin = 0
  console.log(newUser)
  User.create(newUser, (err, user) => {
    if (err) {
      res.json({
        success: false,
        message: err
      })
    } else {
      res.json({
        success: true,
        message: user
      })
    }
  })
})

// 忘记密码的更新用户密码
router.put('/user/forgetPsw', (req, res) => {
  console.log(req.body)
  User.findOneAndUpdate({email: req.body.email}
    , {
      $set: {
        password: req.body.newPsw
      }
    }, {
      new: true
    })
    .then(user => res.json({
      success: true,
      message: user
    }))
    .catch(err => res.json({
      success: false,
      message: err
    }))
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
        phone: req.body.phone,
        gender: req.body.gender,
        birthday: req.body.birthday
      }
    }, {
      new: true
    })
    .then(user => res.json({
      success: true,
      message: user
    }))
    .catch(err => res.json({
      success: false,
      message: err
    }))
})

// 更新一个用户的密码
router.put('/user/modPsw/:email', (req, res) => {
  User.find({email: req.params.email})
    .then(user => {
      user = user.length ? JSON.parse(JSON.stringify(user[0])) : {} // 深拷贝
      if (user.password === req.body.oldPsw) {
        User.findOneAndUpdate({email: req.params.email}
          , {
            $set: {
              password: req.body.confirmPsw
            }
          }, {
            new: true
          })
          .then(user => res.json({
            success: true,
            message: user
          }))
          .catch(err => res.json({
            success: false,
            message: err
          }))
      } else {
        res.json({
          success: false,
          message: '修改失败，登录密码错误，请重试'
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

// 删除一个用户
router.delete('/user/:email', (req, res) => {
  User.findOneAndRemove({
    email: req.params.email
  })
    .then(user => res.send({
      success: true,
      message: `${user.title}删除成功`
    }))
    .catch(err => res.json({
      success: false,
      message: err
    }))
})

module.exports = router
