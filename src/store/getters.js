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
  hasPost: state => state.user.hasPost,
  hasStar: state => state.user.hasStar,
  hasJoin: state => state.user.hasJoin,

  Ename: state => state.event.name,
  date: state => state.event.date,
  time: state => state.event.time,
  isCharged: state => state.event.isCharged,
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
  view: state => state.event.view,
  owner: state => state.event.owner,
  comment: state => state.event.comment
}

export default getters
