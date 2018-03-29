const event = {
  state: {
    name: '',
    date: '',
    time: '',
    isFree: '',
    money: '',
    type: '',
    resource: '',
    desc: '',
    remark: '',
    detail: '',
    region: '',
    poster: '',
    participant: ''
  },

  mutations: {
    SET_ENAME: (state, name) => {
      state.name = name
    },
    SET_DATE: (state, date) => {
      state.date = date
    },
    SET_TIME: (state, time) => {
      state.time = time
    },
    SET_ISFREE: (state, isFree) => {
      state.isFree = isFree
    },
    SET_MONEY: (state, money) => {
      state.money = money
    },
    SET_TYPE: (state, type) => {
      state.type = type
    },
    SET_RESOURCE: (state, resource) => {
      state.resource = resource
    },
    SET_DESC: (state, desc) => {
      state.desc = desc
    },
    SET_REMARK: (state, remark) => {
      state.remark = remark
    },
    SET_DETAIL: (state, detail) => {
      state.detail = detail
    },
    SET_REGION: (state, region) => {
      state.region = region
    },
    SET_POSTER: (state, poster) => {
      state.poster = poster
    },
    SET_PARTICIPANT: (state, participant) => {
      state.participant = participant
    }
  },

  actions: {
    // 选择活动
    ChooseEvent ({ commit }, event) {
      commit('SET_ENAME', event.name)
      commit('SET_DATE', event.date)
      commit('SET_TIME', event.time)
      commit('SET_ISFREE', event.isFree)
      commit('SET_MONEY', event.money)
      commit('SET_TYPE', event.type)
      commit('SET_RESOURCE', event.resource)
      commit('SET_DESC', event.desc)
      commit('SET_REMARK', event.remark)
      commit('SET_DETAIL', event.detail)
      commit('SET_REGION', event.region)
      commit('SET_POSTER', event.poster)
      commit('SET_PARTICIPANT', event.participant)
    }
  }
}

export default event
