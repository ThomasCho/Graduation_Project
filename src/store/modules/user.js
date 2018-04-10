import { loginByEmail, getInfo } from '../../api/login'
import Cookies from 'js-cookie'

const user = {
  state: {
    token: Cookies.get('x-access-token'),
    avatar: '',
    name: '',
    email: '',
    introduction: '',
    constellation: '',
    phone: '',
    gender: '',
    birthday: '',
    hasPost: [],
    hasStar: [],
    hasJoin: [],
    isAdmin: '',
    hobby: '',
    hasFollow: [],
    followBy: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_CONSTELLATION: (state, constellation) => {
      state.constellation = constellation
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_GENDER: (state, gender) => {
      state.gender = gender
    },
    SET_BIRTHDAY: (state, birthday) => {
      state.birthday = birthday
    },
    SET_HASPOST: (state, hasPost) => {
      state.hasPost = hasPost
    },
    SET_HASSTAR: (state, hasStar) => {
      state.hasStar = hasStar
    },
    SET_HASJOIN: (state, hasJoin) => {
      state.hasJoin = hasJoin
    },
    SET_ISADMIN: (state, isAdmin) => {
      state.isAdmin = isAdmin
    },
    SET_HOBBY: (state, hobby) => {
      state.hobby = hobby
    },
    SET_HASFOLLOW: (state, hasFollow) => {
      state.hasFollow = hasFollow
    },
    SET_FOLLOWBY: (state, followBy) => {
      state.followBy = followBy
    }
  },

  actions: {
    // 邮箱登录
    LoginByEmail ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByEmail(userInfo.email.trim(), userInfo.password).then(response => {
          if (response.data.success) {
            Cookies.set('x-access-token', response.data.token)
            commit('SET_TOKEN', response.data.token)
            commit('SET_EMAIL', userInfo.email.trim())
            resolve(response.data)
          } else {
            reject(response.data.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          if (response.data.success) {
            commit('SET_EMAIL', response.data.message.email)
            commit('SET_NAME', response.data.message.name)
            commit('SET_AVATAR', response.data.message.avatar)
            commit('SET_INTRODUCTION', response.data.message.introduction)
            commit('SET_CONSTELLATION', response.data.message.constellation)
            commit('SET_PHONE', response.data.message.phone)
            commit('SET_GENDER', response.data.message.gender)
            commit('SET_BIRTHDAY', response.data.message.birthday)
            commit('SET_HASPOST', response.data.message.hasPost)
            commit('SET_HASSTAR', response.data.message.hasStar)
            commit('SET_HASJOIN', response.data.message.hasJoin)
            commit('SET_ISADMIN', response.data.message.isAdmin)
            commit('SET_HOBBY', response.data.message.hobby)
            commit('SET_HASFOLLOW', response.data.message.hasFollow)
            commit('SET_FOLLOWBY', response.data.message.followBy)
            resolve(response.data.message)
          } else {
            reject(response.data.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut ({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        Cookies.remove('x-access-token')
        resolve()
      })
    }
  }
}

export default user
