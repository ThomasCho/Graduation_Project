const express = require('express')
const app = express()
const mongoose = require('mongoose')
const index = require('./router/index')
const user = require('./router/user')

mongoose.connect('mongodb://localhost:27017/graduationProject')

app.use('/', index)
app.use('/api', user)

app.listen(3000, () => {
  console.log('app listening on port 3000.')
})
