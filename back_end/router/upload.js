// 对上传操作的路由
const fs = require('fs')
const formidable = require('formidable')
const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
router.use(bodyParser.json())

// 头像上传
router.post('/img/avatar', (req, res) => {
  var form = new formidable.IncomingForm()
  form.uploadDir = './public/img'
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.json({success: false, message: '上传失败'})
    }
    let avatarName = '/' + req.api_user.email + '.' + files.file.name.split('.')[1]
    let newPath = form.uploadDir + avatarName
    fs.renameSync(files.file.path, newPath)
    res.send({
      success: true,
      code: 200,
      msg: avatarName
    })
  })
})

module.exports = router
