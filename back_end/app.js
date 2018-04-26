const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bodyParser = require('body-parser')

const index = require('./router/index')
const user = require('./router/user')
const login = require('./router/login')
const upload = require('./router/upload')
const verification = require('./router/verification')
const event = require('./router/event')
const follow = require('./router/follow')

mongoose.connect('mongodb://localhost:27017/graduationProject')

// 请求地址白名单
let apiWhiteList = ['/api/loginbyemail', '/api/user/register', '/api/user/forgetPsw',
  '/api/verification', '/api/verifyUserAndPhone', '/api/verifyCode']

// 验证头信息里有没有x-access-token
// 校验通过了，就把token的decode对象，也就是之前加密的用户对象返回来，保存为req.api_user
// 没有挂载路径的中间件，应用的每个请求都会执行该中间件
app.use((req, res, next) => {
  console.log(req.url) // for debug
  // 检查post的信息或者url查询参数或者头信息
  let token = req.headers['x-access-token']

  // 解析 token
  if (token) {
    // 确认token
    jwt.verify(token, 'hellothomas', (err, decoded) => {
      if (err) {
        console.log('has token but with error') // for debug
        res.json({success: false, message: 'token信息错误，请重新登录'})
      } else {
        console.log('has token and no error') // for debug
        // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用
        req.api_user = decoded
        next()
      }
    })
  } else {
    console.log('does not have token') // for debug
    // 若在白名单内，则没有token也允许next()；或请求后台静态资源也不需要token
    if (apiWhiteList.indexOf(req.url) !== -1 || /\.[jpg|png]/.test(req.url)) {
      next()
    } else {
      // 如果没有token，则返回错误
      return res.status(403).send({
        success: false,
        message: '没有提供token！'
      })
    }
  }
})

// 将路由挂载到应用
app.use(index)
app.use('/api', user)
app.use('/api', login)
app.use('/api', upload)
app.use('/api', verification)
app.use('/api', event)
app.use('/api', follow)

// 使用 morgan 将请求日志打印到控制台
app.use(morgan('dev'))
app.use(express.static('public'))
app.use(cors({ origin: '*' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(3000, () => {
  console.log('app listening on port 3000.')
})
