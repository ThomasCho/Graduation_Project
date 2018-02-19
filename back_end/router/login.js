// 对登录操作的路由
const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
router.use(bodyParser.json())
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// 登录
router.post('/loginbyemail', (req, res) => {
  User.find({
    email: req.body.email
  }, (err, user) => {
    console.log(user)
    user = JSON.parse(JSON.stringify(user[0]))
    if (err) {
      res.json('error: ' + err)
    }
    if (!user) {
      res.json({
        success: false,
        message: '认证失败，用户名找不到'
      })
    } else {
      // 检查密码
      if (user.password !== req.body.password) {
        res.json({
          success: false,
          message: '认证失败，密码错误'
        })
      } else {
        // 密码正确，创建token
        let token = jwt.sign(user, 'app.get(superSecret)', {
          expiresIn: '1h' // 设置过期时间
        })

        // json格式返回token
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        })
      }
    }
  })

  // User.find({}, (error, users) => {
  //   let data = JSON.parse(JSON.stringify(users))
  //   if (error) {
  //     res.json('error: ' + error)
  //   } else {
  //     for (let user of data) {
  //       if (user.email === req.body.email) {
  //         res.json(user.password === req.body.password ? 'success' : 'fail')
  //         return
  //       }
  //     }
  //     res.json('无此用户')
  //   }
  // })
})

module.exports = router
