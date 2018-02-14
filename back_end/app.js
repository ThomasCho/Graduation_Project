const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/graduationProject')

app.use('/', (req,res) => {
  res.send('Yo!')
})
app.listen(3000, () => {
    console.log('app listening on port 3000.')
})