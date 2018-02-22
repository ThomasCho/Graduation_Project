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
    gender: '',
    birthday: ''
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
    SET_GENDER: (state, gender) => {
      state.gender = gender
    },
    SET_BIRTHDAY: (state, birthday) => {
      state.birthday = birthday
    }
  },

  actions: {
    // 邮箱登录
    LoginByEmail ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByEmail(userInfo.email.trim(), userInfo.password).then(response => {
          Cookies.set('x-access-token', response.data.token)
          commit('SET_TOKEN', response.data.token)
          commit('SET_EMAIL', userInfo.email.trim())
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          commit('SET_NAME', response.data.name)
          commit('SET_AVATAR', response.data.avatar)
          commit('SET_INTRODUCTION', response.data.introduction)
          commit('SET_CONSTELLATION', response.data.constellation)
          commit('SET_GENDER', response.data.gender)
          commit('SET_BIRTHDAY', response.data.birthday)
          resolve(response.data)
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
