import fetch from '../util/fetch'

export function loginByEmail (email, password) {
  const data = {
    email,
    password
  }
  return fetch({
    url: 'api/loginbyemail',
    method: 'post',
    data
  })
}

export function getInfo (token) {
  return fetch({
    url: 'api/user/info',
    method: 'get',
    params: { token }
  })
}
