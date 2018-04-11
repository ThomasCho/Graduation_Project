// 推荐算法
/* eslint-disable */
const Event = require('../../models/event')
const User = require('../../models/user')

// 初始化数据
const initData = () => {
  return new Promise((resolve, reject) => {
    Event.find({})
      .then(val => {
        // 为每一个活动附上score这个属性
        let events = val.map((e) => {
          e.score = 0
          return e
        })

        User.find({})
          .then(val => {
            let users = val
            // 把活动数组和用户数组返回出去
            resolve({
              events,
              users
            })
          })
      })
  })
}

// 计算用户的相似度,找出与当前登录用户最为相似的几个用户
const findMostLikelyUsers = (curUser, othUser) => {
  const RETURN_NUM = 3  // 拟返回若干个相似度最高的用户

  // 初始化每个用户的相似度，顺便与“我”星座相同的用户相似度+1
  othUser.forEach(val => {
    if (val.constellation === curUser.constellation) {
      val.similarity = 1
    } else {
      val.similarity = 0
    }
  })

  // 爱好有一项与“我”的爱好相同的，相似度+2
  othUser.forEach(val => {
    let hobbies = val.hobby.split('，')
    hobbies.forEach(hob => {
      if (curUser.hobby.indexOf(hob) !== -1) {
        val.similarity += 2
      }
    })
  })

  // 被关注者中有“我”的话，相似度+3；已关注人中有“我”的话，相似度+1
  othUser.forEach(val => {
    if (val.followBy.indexOf(curUser.email) !== -1) {
      val.similarity += 3
    } else if (val.hasFollow.indexOf(curUser.email) !== -1) {
      val.similarity += 1
    }
  })

  // 已参加的活动中有与“我”已参加的活动相同的话，相似度+1；已收藏的活动中有与“我”已收藏的活动相同的话，相似度+1
  othUser.forEach(val => {
    val.hasJoin.forEach(join => {
      if (curUser.hasJoin.indexOf(join) !== -1) {
        val.similarity += 1
      }
    })
    val.hasStar.forEach(star => {
      if (curUser.hasStar.indexOf(star) !== -1) {
        val.similarity += 1
      }
    })
  })

  othUser.sort((a, b) => {
    return b.similarity - a.similarity
  })

  // 若用户数量大于拟返回的数量，则返回相似度最高的若干个用户，否则返回全部用户
  if (othUser.length > RETURN_NUM) {
    return othUser.splice(0, RETURN_NUM)
  } else {
    return othUser
  }
}

// 去重
const removeDuplicate = arr => {
  let set = new Set()
  arr.forEach(val => {
    set.add(val)
  })
  return Array.from(set)
}

// 已收藏、已发布、已参加的活动去重
const filterEvent = user => {
  let all = user.hasStar.concat(user.hasPost, user.hasJoin)
  return removeDuplicate(all)
}

// 找出对应的活动
const getCorrespondEvents = (names, events) => {
  let returnEvents = []
  names.forEach(name => {
    events.forEach(event => {
      if (event.name === name) {
        returnEvents.push(event)
      }
    })
  })
  return returnEvents
}

// 根据“我”的活动，和所有其他活动，之间找相似性，最后调整所有活动的积分
const getFinalResults = (events, myEvents) => {
  events.forEach(their => {
    myEvents.forEach(my => {
      // 类型相同，+2分
      their.type.forEach(type => {
        if (my.type.indexOf(type) !== -1) {
          their.score += 2
        }
      })

      // 收不收费相同，+2分
      if (their.isCharged === my.isCharged) {
        their.score += 2
      }

      // 资源相同，+2分
      if (their.resource === my.resource) {
        their.score += 2
      }

      // 地区在附近，+2分
      their.score += Math.sqrt(Math.pow(their.region[0] - my.region[0], 2) + Math.pow(their.region[1] - my.region[1], 2)) > 1 ? 0 : 2
    })
  })

  return events
}

const getRecommendEvents = (userEmail) => {
  return new Promise((resolve, reject) => {
    const FINAL_RESULTS_NUM = 10  // 拟推荐多少条活动

    let events = []  // 原始的活动数组
    let users = []  // 原始的用户数组
    let currentUser = {}  // 当前登录用户
    let mostLikelyUsers = []  // 与当前登录用户最相似的几个用户

    initData().then((res) => {
      events = JSON.parse(JSON.stringify(res.events))  // 原始的活动数组
      users = JSON.parse(JSON.stringify(res.users))  // 原始的用户数组

      // 基于star（关注）数、view（浏览）数，为每个活动调整积分
      events.forEach(val => {
        val.score = val.star * 3 + val.view * 1
      })

      // 找出当前用户的信息，并将此信息从原始用户数组中去除；并把admin账号筛掉
      users = users.filter(val => {
        if (val.email === userEmail) {
          currentUser = JSON.parse(JSON.stringify(val))
        } else if (val.email !== 'admin') {
          return val
        }
      })

      // 找和我相似的人
      mostLikelyUsers = findMostLikelyUsers(currentUser, users)

      // 获取“我”和这几个相似度高的用户的去重活动
      mostLikelyUsers.forEach(val => {
        val.filteredEvent = filterEvent(val)
      })
      currentUser.filteredEvent = filterEvent(currentUser)

      // top1用户筛出来的活动，积分+3 ，top2用户筛出来的活动，积分+2，top3用户筛出来的活动，积分+1
      // 基于：跟你喜好相似的人喜欢的东西你也很有可能喜欢
      for (let i = 0, len = mostLikelyUsers.length; i < len; i++) {
        mostLikelyUsers[i].filteredEvent.forEach(val => {
          events.forEach(event => {
            if (event.name === val) {
              event.score += (len - i)
            }
          })
        })
      }

      let myEvents = getCorrespondEvents(currentUser.filteredEvent, events)

      // 所有活动最终得分求出
      let mostLikelyEvents = getFinalResults(events, myEvents)

      // 按积分高低排序
      mostLikelyEvents.sort((a, b) => {
        return b.score > a.score
      })
      // console.log(mostLikelyEvents)

      // 返还最终结果
      if (mostLikelyEvents.length > FINAL_RESULTS_NUM) {
        resolve(mostLikelyEvents.splice(0, FINAL_RESULTS_NUM))
      } else {
        resolve(mostLikelyEvents)
      }
    })
  })
}

exports.getRecommendEvents = getRecommendEvents
