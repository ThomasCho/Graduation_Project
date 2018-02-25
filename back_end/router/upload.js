// 对上传操作的路由
const formidable = require('formidable')
const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
router.use(bodyParser.json())

// 头像上传
router.post('/img/avatar', (req, res) => {
  console.log('upload router')
  var form = new formidable.IncomingForm()
  form.uploadDir = './public/img'
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.json({success: false, message: '上传失败'})
    }
    console.log('received upload')
    res.json({fields: fields, files: files})
  })
})

module.exports = router
