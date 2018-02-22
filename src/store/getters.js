const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  email: state => state.user.email,
  introduction: state => state.user.introduction,
  constellation: state => state.user.constellation,
  gender: state => state.user.gender,
  birthday: state => state.user.birthday
}

export default getters
