// 对活动相关操作的路由
const express = require('express')
const Event = require('../models/event')
const User = require('../models/user')
const bodyParser = require('body-parser')
const router = express.Router()
router.use(bodyParser.json())

// common methods
let pageClassify = (req, res) => {
  console.log(req.query.pageType)
  User.find({
    email: req.query.user
  })
    .then(users => {
      if (req.query.pageType === 'post') {
        Event.find({
          'name': {'$in': users[0].hasPost}
        })
          .then(events => {
            console.log(events)
            res.json({
              success: true,
              message: events
            })
          })
          .catch(err => {
            console.log(err)
            res.json({
              success: false,
              message: '暂找不到活动~'
            })
          })
      } else if (req.query.pageType === 'star') {
        Event.find({
          'name': {'$in': users[0].hasStar}
        })
          .then(events => {
            console.log(events)
            res.json({
              success: true,
              message: events
            })
          })
          .catch(err => {
            console.log(err)
            res.json({
              success: false,
              message: '暂找不到活动~'
            })
          })
      } else if (req.query.pageType === 'join') {
        Event.find({
          'name': {'$in': users[0].hasJoin}
        })
          .then(events => {
            console.log(events)
            res.json({
              success: true,
              message: events
            })
          })
          .catch(err => {
            console.log(err)
            res.json({
              success: false,
              message: '暂找不到活动~'
            })
          })
      }
    })
    .catch(err => {
      console.log(err)
      res.json({
        success: false,
        message: '暂找不到活动~'
      })
    })
}

let searchClassify = (req, res) => {
  let queryType = req.query.searchType
  if (queryType === 'learning') {
    queryType = '学习'
  } else if (queryType === 'eating') {
    queryType = '吃喝'
  } else if (queryType === 'playing') {
    queryType = '玩耍'
  } else if (queryType === 'hiking') {
    queryType = '旅行'
  }
  // 类型包含这个关键字，或名字匹配到这个关键字
  Event.find({'$or': [{'type': queryType}, {'name': queryType}]})
    .then(events => {
      res.json({
        success: true,
        message: events
      })
    })
    .catch(err => {
      res.json({
        success: false,
        message: err
      })
    })
}

let noClassify = (req, res) => {
  Event.find({})
    .then(events => {
      res.json({
        success: true,
        message: events
      })
    })
    .catch(err => {
      res.json({
        success: false,
        message: err
      })
    })
}

// 发布活动
router.post('/publishEvent', (req, res) => {
  let newEvent = JSON.parse(JSON.stringify(req.body))
  newEvent.participant = []
  newEvent.star = '0'
  newEvent.view = '0'
  Event.create(newEvent, (err, event) => {
    if (err) {
      res.json({
        success: false,
        message: err
      })
    } else {
      User.find({
        email: newEvent.owner
      })
        .then(users => {
          users[0].hasPost.push(newEvent.name)
          users[0].save(err => {
            if (err) {
              res.json({
                success: false,
                message: err
              })
            }
            res.json({
              success: true,
              message: event
            })
          })
        })
    }
  })
})

// 撤销发布活动
router.delete('/unpublishEvent', (req, res) => {
  Event.remove({name: req.body.eventName}, err => {
    if (err) {
      res.json({
        success: false,
        message: err
      })
    } else {
      User.find({
        email: req.body.userEmail
      })
        .then(users => {
          users[0].hasPost.splice(users[0].hasPost.indexOf(req.body.eventName), 1)
          users[0].save(err => {
            if (err) {
              res.json({
                success: false,
                message: err
              })
            } else {
              res.json({
                success: true,
                message: '已撤销发布'
              })
            }
          })
        })
    }
  })
})

// 获取活动
router.get('/loadEvent', (req, res) => {
  if (req.query.pageType) {
    // 页面分类，例如：我已发布、我已收藏、我已参加
    pageClassify(req, res)
  } else if (req.query.searchType) {
    // 搜索分类，如 学习、吃喝、玩耍、旅行 或 搜索框输入搜索
    searchClassify(req, res)
  } else {
    // 无任何分类，搜全部活动
    noClassify(req, res)
  }
})

// 加入活动
router.post('/joinEvent', (req, res) => {
  let params = JSON.parse(JSON.stringify(req.body))
  Event.find({
    name: params.eventName
  })
    .then(events => {
      let hasJoined = false
      events[0].participant.forEach((e) => {
        if (e.email === params.userInfo.email) {
          hasJoined = true
        }
      })
      if (!hasJoined) {
        events[0].participant.push(params.userInfo)
        events[0].save(err => {
          if (err) {
            res.json({
              success: false,
              message: err
            })
          }

          User.find({
            email: params.userInfo.email
          })
            .then(users => {
              users[0].hasJoin.push(params.eventName)
              users[0].save(err => {
                if (err) {
                  res.json({
                    success: false,
                    message: err
                  })
                }
                res.json({
                  success: true,
                  message: '参加成功'
                })
              })
            })
        })
      } else {
        res.json({
          success: false,
          message: '你已参加，请勿重复点击'
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

// 撤销加入活动
router.post('/unjoinEvent', (req, res) => {
  let params = JSON.parse(JSON.stringify(req.body))
  Event.find({
    name: params.eventName
  })
    .then(events => {
      events[0].participant = events[0].participant.filter(val => {
        return val.email !== params.userEmail
      })
      events[0].save(err => {
        if (err) {
          res.json({
            success: false,
            message: err
          })
        }

        User.find({
          email: params.userEmail
        })
          .then(users => {
            users[0].hasJoin = users[0].hasJoin.filter(val => {
              return val !== params.eventName
            })
            users[0].save(err => {
              if (err) {
                res.json({
                  success: false,
                  message: err
                })
              } else {
                res.json({
                  success: true,
                  message: '已撤销参加'
                })
              }
            })
          })
      })
    })
    .catch(err => {
      res.json({
        success: false,
        message: err
      })
    })
})

// 更新该活动的被收藏数
router.put('/starEvent', (req, res) => {
  Event.find({
    name: req.body.eventName
  })
    .then(events => {
      events[0].star++
      events[0].save(err => {
        if (err) {
          res.json({
            success: false,
            message: err
          })
        }

        User.find({
          email: req.body.byWho
        })
          .then(users => {
            if (users[0].hasStar.indexOf(req.body.eventName) === -1) {
              users[0].hasStar.push(req.body.eventName)
              users[0].save(err => {
                if (err) {
                  res.json({
                    success: false,
                    message: err
                  })
                }
                res.json({
                  success: true,
                  message: '已收藏'
                })
              })
            } else {
              res.json({
                success: false,
                message: '你已收藏此活动，请勿重复收藏'
              })
            }
          })
      })
    })
    .catch(err => {
      res.json({
        success: false,
        message: err
      })
    })
})

// 撤销收藏
router.put('/unstarEvent', (req, res) => {
  Event.find({
    name: req.body.eventName
  })
    .then(events => {
      events[0].star--
      events[0].save(err => {
        if (err) {
          res.json({
            success: false,
            message: err
          })
        }

        User.find({
          email: req.body.userEmail
        })
          .then(users => {
            users[0].hasStar = users[0].hasStar.filter(val => {
              return val !== req.body.eventName
            })
            users[0].save(err => {
              if (err) {
                res.json({
                  success: false,
                  message: err
                })
              } else {
                res.json({
                  success: true,
                  message: '已撤销收藏'
                })
              }
            })
          })
      })
    })
    .catch(err => {
      res.json({
        success: false,
        message: err
      })
    })
})

// 更新该活动的被浏览数
router.put('/incView', (req, res) => {
  Event.find({
    name: req.body.eventName
  })
    .then(events => {
      events[0].view++
      events[0].save(err => {
        if (err) {
          res.json({
            success: false,
            message: err
          })
        }
        res.json({
          success: true,
          message: ''
        })
      })
    })
    .catch(err => {
      res.json({
        success: false,
        message: err
      })
    })
})

module.exports = router
