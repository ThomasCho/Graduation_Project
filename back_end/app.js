const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bodyParser = require('body-parser')

const user = require('./router/user')
const login = require('./router/login')
const upload = require('./router/upload')

mongoose.connect('mongodb://localhost:27017/graduationProject')

// 只要参数有token或者头信息里有x-access-token，我们就认定它是一个api接口，
// 校验通过了，就把token的decode对象，也就是之前加密的用户对象返回来，保存为req.api_user
// 没有挂载路径的中间件，应用的每个请求都会执行该中间件
app.use((req, res, next) => {
  console.log(req.url) // for debug
  // 检查post的信息或者url查询参数或者头信息
  let token = (req.body && req.body.token) || req.query.token || req.headers['x-access-token']

  // 解析 token
  if (token) {
    console.log('has token') // for debug
    // 确认token
    jwt.verify(token, 'hellothomas', (err, decoded) => {
      if (err) {
        console.log('has token but with error') // for debug
        return res.json({success: false, message: 'token信息错误.'})
      } else {
        console.log('has token and no error') // for debug
        // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用
        req.api_user = decoded
        next()
      }
    })
  } else {
    console.log('does not have token') // for debug
    // 若是登录行为，则没有token是正常的，允许next()
    if (req.url === '/api/loginbyemail') {
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
app.use('/api', user)
app.use('/api', login)
app.use('/api', upload)

// 使用 morgan 将请求日志打印到控制台
app.use(morgan('dev'))
app.use(express.static('public'))
app.use(cors({ origin: '*' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(3000, () => {
  console.log('app listening on port 3000.')
})
