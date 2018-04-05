const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  email: state => state.user.email,
  introduction: state => state.user.introduction,
  constellation: state => state.user.constellation,
  phone: state => state.user.phone,
  gender: state => state.user.gender,
  birthday: state => state.user.birthday,

  Ename: state => state.event.name,
  date: state => state.event.date,
  time: state => state.event.time,
  isFree: state => state.event.isFree,
  money: state => state.event.money,
  type: state => state.event.type,
  resource: state => state.event.resource,
  desc: state => state.event.desc,
  remark: state => state.event.remark,
  detail: state => state.event.detail,
  region: state => state.event.region,
  poster: state => state.event.poster,
  participant: state => state.event.participant,
  star: state => state.event.star,
  view: state => state.event.view
}

export default getters
