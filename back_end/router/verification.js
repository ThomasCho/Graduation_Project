// 对忘记密码相关操作的路由
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bodyParser = require('body-parser')
const SMS = require('yunpian-sdk').SMS
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
router.use(bodyParser.json())

// 经过中间件处理后，可以通过req.session访问session object。
// 比如如果你在session中保存了session.phone就可以根据phone查找对应的验证码了。
router.use(session({
  store: new RedisStore({
    host: '127.0.0.1',
    port: '6379',
    ttl: 60 * 5 // Session的有效期 5分钟
  }),
  secret: 'thomas',
  resave: false,
  saveUninitialized: true
}))

const sms = new SMS({apikey: 'a91e62d88b995eb3630527c360f8bb75'})

// 获取验证码
router.post('/verification', (req, res) => {
  let randomCode = Math.floor(Math.random() * 1000000)
  console.log('Code: ' + randomCode)
  sms.singleSend({
    mobile: req.body.phone,
    text: '【STU活动平台】您的验证码是' + randomCode + '。如非本人操作，请忽略本短信'
  }).then((result) => {
    req.session[req.body.phone] = randomCode
    console.log(req.session)
    res.json({
      success: true,
      message: result
    })
  })
})

router.post('/verifyCode', (req, res) => {
  if (req.session[req.body.phone]) {
    // 有发验证码，就校验输入的验证码是否正确
    if (req.session[req.body.phone] === parseInt(req.body.code)) {
      res.json({
        success: true,
        message: '验证码校验通过'
      })
    } else {
      res.json({
        success: false,
        message: '验证码校验不通过，请重新输入'
      })
    }
  } else {
    // 没有发验证码
    res.json({
      success: false,
      message: '并没有向此号码发送验证码'
    })
  }
})

// 验证某个用户的账号和所留电话号码是否相符，用于忘记密码功能
router.post('/verifyUserAndPhone', (req, res) => {
  User.find({
    email: req.body.email
  })
    .then(user => {
      if (!user.length) {
        res.json({
          success: false,
          message: '无此用户'
        })
      } else {
        let data = JSON.parse(JSON.stringify(user[0]))

        if (req.body.phone && data.phone !== req.body.phone) {
          res.json({
            success: false,
            message: '该号码与此用户绑定的号码不相符'
          })
        } else {
          res.json({
            success: true,
            message: data
          })
        }
      }
    })
    .catch(err => {
      res.json({
        success: false,
        message: err
      })
    })
})

module.exports = router
