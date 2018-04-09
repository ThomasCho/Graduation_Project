const event = {
  state: {
    name: '',
    date: '',
    time: '',
    isCharged: '',
    money: '',
    type: '',
    resource: '',
    desc: '',
    remark: '',
    detail: '',
    region: '',
    poster: '',
    participant: '',
    star: '',
    view: '',
    owner: '',
    comment: [],
    auth: ''
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
    SET_ISCHARGED: (state, isCharged) => {
      state.isCharged = isCharged
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
    },
    SET_STAR: (state, star) => {
      state.star = star
    },
    SET_VIEW: (state, view) => {
      state.view = view
    },
    SET_OWNER: (state, owner) => {
      state.owner = owner
    },
    SET_COMMENT: (state, comment) => {
      state.comment = comment
    },
    SET_AUTH: (state, auth) => {
      state.auth = auth
    }
  },

  actions: {
    // 选择活动
    ChooseEvent ({ commit }, event) {
      commit('SET_ENAME', event.name)
      commit('SET_DATE', event.date)
      commit('SET_TIME', event.time)
      commit('SET_ISCHARGED', event.isCharged)
      commit('SET_MONEY', event.money)
      commit('SET_TYPE', event.type)
      commit('SET_RESOURCE', event.resource)
      commit('SET_DESC', event.desc)
      commit('SET_REMARK', event.remark)
      commit('SET_DETAIL', event.detail)
      commit('SET_REGION', event.region)
      commit('SET_POSTER', event.poster)
      commit('SET_PARTICIPANT', event.participant)
      commit('SET_STAR', event.star)
      commit('SET_VIEW', event.view)
      commit('SET_OWNER', event.owner)
      commit('SET_COMMENT', event.comment)
      commit('SET_AUTH', event.auth)
    }
  }
}

export default event
