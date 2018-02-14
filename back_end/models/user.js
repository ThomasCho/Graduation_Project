const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    gender: {
        type: String,
        require: true
    },
    birthday: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    pictureLink: {
        type: String,
        require: false
    },
    constellation: {
        type: String,
        require: false
    }
})

const UserModel = module.exports = mongoose.model('User', userSchema)